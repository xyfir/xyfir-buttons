import request from 'superagent';
import moment from 'moment';
import marked from 'marked';
import React from 'react';

// react-md
import FontIcon from 'react-md/lib/FontIcons';
import Button from 'react-md/lib/Buttons/Button';
import Paper from 'react-md/lib/Papers/Paper';

// Components
import ScriptEditor from 'components/editors/Script';
import Comments from 'components/misc/Comments';
import Creator from 'components/misc/Creator';
import Votes from 'components/misc/Votes';
import Tabs from 'components/misc/Tabs';

// Modules
import downloadButtons from 'lib/shared/buttons/download';

// Constants
import { XYBUTTONS_URL } from 'constants/config';

export default class ViewButton extends React.Component {

  constructor(props) {
    super(props);

    this.state = { loading: true };
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
        res.body.isCreator =
          res.body.creator.id == this.props.storage.account.uid
          && res.body.creator.id != 0,
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
        </div>
      </Tabs>
    );
  }

}