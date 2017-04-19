import request from 'superagent';
import moment from 'moment';
import marked from 'marked';
import React from 'react';

// react-md
import ListItem from 'react-md/lib/Lists/ListItem';
import FontIcon from 'react-md/lib/FontIcons';
import Button from 'react-md/lib/Buttons/Button';
import Dialog from 'react-md/lib/Dialogs';
import Paper from 'react-md/lib/Papers/Paper';
import List from 'react-md/lib/Lists/List';

// Components
import Advertisement from 'components/misc/Advertisement';
import ScriptEditor from 'components/editors/Script';
import Comments from 'components/misc/Comments';
import Creator from 'components/misc/Creator';
import Votes from 'components/misc/Votes';
import Tabs from 'components/misc/Tabs';

// Modules
import downloadButtons from 'lib/shared/buttons/download';
import downloadPresets from 'lib/shared/presets/download';
import isCreator from 'lib/app/items/is-creator';

// Constants
import { XYBUTTONS_URL } from 'constants/config';

export default class ViewButton extends React.Component {

  constructor(props) {
    super(props);

    const s = this.props.storage;
    let presets = [];

    presets = Object.keys(s)
      .filter(k => /^preset_/.test(k))
      .filter(k =>
        isCreator(s[k].creator, this.props.storage, 'preset', s[k].id)
      )
      .map(k => s[k]);

    this.state = { loading: true, presets, addToPreset: false };
  }

  /**
   * Retrieve only the data returned from `GET api/buttons/:button`. Set
   * isInstalled and isCreator.
   */
  componentDidMount() {
    request
      .get(XYBUTTONS_URL + 'api/buttons/' + this.props.params.button)
      .end((err, res) => {
        if (err || res.body.id == -1) {
          this.props.App._alert('Could not load button');
          location.hash = '#/buttons';
        }

        res.body.isInstalled =
          !!Object.keys(this.props.storage)
            .find(k => k == 'button_' + res.body.id),
        res.body.isCreator = isCreator(
          res.body.creator, this.props.storage, 'button', res.body.id
        ),
        res.body.loading = false;
        
        this.setState(res.body);
      });
  }

  /**
   * Downloads the button to local storage that it can be used in presets.
   */
  onDownload() {
    downloadButtons([{ id: this.state.id }])
      .then(() => location.reload())
      .catch(() => this.props.App._alert('Could not download button'));
  }

  /**
   * Deletes the button from local storage.
   */
  onRemove() {
    try {
      Object.keys(this.props.storage).forEach(key => {
        if (key.indexOf('preset_') == 0) {
          this.props.storage[key].buttons.forEach(button => {
            if (button.id == this.state.id)
              throw 'Button must be removed from presets first';
          });
        }
      });
      
      chrome.storage.local.remove(
        'button_' + this.state.id, () => location.reload()
      );
    }
    catch (err) {
      this.props.App._alert(err);
    }
  }

  /**
   * Loads the button's script for the user to inspect.
   */
  onViewScript() {
    request
      .get(`${XYBUTTONS_URL}api/buttons/${this.state.id}/script`)
      .end((err, res) => {
        if (err || res.body.error)
          this.props.App._alert(res.body.message);
        else
          this.setState({ script: res.body.script });
      });
  }

  /**
   * Opens the 'add button to preset' modal OR adds the button to a preset
   * within that list.
   * @param {number} [id]
   */
  onAddToPreset(id) {
    if (!id) {
      this.setState({ addToPreset: true });
    }
    else {
      request
        .post(`${XYBUTTONS_URL}api/presets/${id}/buttons/${this.state.id}`)
        .send({
          size: '4em', position: '50%,50%', styles: '{}'
        })
        .end((err, res) => {
          if (err || res.body.error) {
            this.props.App._alert(res.body.message);
          }
          else {
            const next = () => location.hash = `#/presets/${id}/buttons`;
            downloadPresets([{ id }]).then(next).catch(next);
          }
        });
    }
  }

  /**
   * Attempts to convert this.state.domains into more human-readable text.
   * @type {string}
   */
  get domainsText() {
    switch (this.state.domains) {
      case '': return '';
      case '*': return 'Global';
      case '**': return 'Multiple Sites';
      default: return this.state.domains.replace(/,/g, ' - ');
    }
  }

  render() {
    if (this.state.loading) return <div />;

    const b = this.state;

    return (
      <Tabs
        base={'#/buttons/' + this.state.id}
        isCreator={this.state.isCreator}
        activeTabIndex={0}
      >
        <div className='view-button'>
          <Paper zDepth={1}>
            <h2 className='name'>
              {b.isListed ? <FontIcon>public</FontIcon> : <span />}
              {b.name}
            </h2>
            <span className='domains'>{this.domainsText}</span>
            <div
              className='description markdown-body'
              dangerouslySetInnerHTML={{
                __html: marked(b.description, { santize: true })
              }}
            />
          </Paper>

          <Advertisement sub={this.props.storage.account.subscription} />

          <Paper zDepth={1}>
            <dl className='info-list'>
              <div>
                <dt>Creator</dt>
                <dd><Creator {...b.creator} /></dd>
              </div>

              <div>
                <dt>Created</dt>
                <dd title={b.created}>{moment(b.created).fromNow()}</dd>
              </div>

              {b.updated.indexOf('0') != 0 ? (
                <div>
                  <dt>Updated</dt>
                  <dd title={b.updated}>{moment(b.updated).fromNow()}</dd>
                </div>
              ) : <span />}

              <div>
                <dt>Votes</dt>
                <dd>
                  <Votes
                    id={b.id} type={1} votes={b.votes}
                    alert={this.props.App._alert}
                  />
                </dd>
              </div>

              <div>
                <dt title='from the past month'>Downloads</dt>
                <dd>{b.downloads}</dd>
              </div>
            </dl>
          </Paper>

          <Paper zDepth={1}>
            <div className='url-match'>
              <label>URL Match Expression:</label>
              <span>{b.urlMatch}</span>
            </div>

            {b.repository ? (
              <a
                href={b.repository}
                target='_blank'
                className='repository'
              >View Repository</a>
            ) : <span />}

            {b.script ? (
              <ScriptEditor
                readOnly
                value={b.script}
                onError={this.props.App._alert}
              />
            ) : (
              <Button
                flat
                label='View Script'
                onClick={() => this.onViewScript()}
              >pageview</Button>
            )}
          </Paper>

          <Comments
            {...this.props}
            id={b.id}
            type={1}
            alert={this.props.App._alert}
            comments={b.comments}
          />

          {this.state.presets.length ? (
            <Button
              floating primary fixed
              onClick={() => this.onAddToPreset()}
              tooltipLabel='Add button to a preset you own'
              fixedPosition='bl'
              tooltipPosition='right'
            >library_add</Button>
          ) : (
            <span />
          )}

          {this.state.isInstalled ? (
            <Button
              floating secondary fixed
              onClick={() => this.onRemove()}
              tooltipLabel='Remove from local storage'
              tooltipPosition='left'
            >delete</Button>
          ) : (
            <Button
              floating primary fixed
              onClick={() => this.onDownload()}
              tooltipLabel='Download button'
              tooltipPosition='left'
            >file_download</Button>
          )}

          <Dialog
            id='add-button-to-preset'
            onHide={() => this.setState({ addToPreset: false })}
            visible={this.state.addToPreset}
            className='add-button-to-preset'
          >
            <List className='presets-list'>{
              this.state.presets.map(preset =>
                <ListItem
                  threeLines
                  onClick={() => this.onAddToPreset(preset.id)}
                  primaryText={preset.name}
                  secondaryText={
                    (
                      preset.domains == '*'
                        ? 'Global' : preset.domains == '**'
                        ? 'Multiple' : preset.domains
                    )
                    + '\n' + preset.description.split('\n')[0]
                  }
                />
              )
            }</List>
          </Dialog>
        </div>
      </Tabs>
    );
  }

}