import request from 'superagent';
import moment from 'moment';
import React from 'react';

// react-md
import FontIcon from 'react-md/lib/FontIcons';
import Button from 'react-md/lib/Buttons/Button';
import Paper from 'react-md/lib/Papers/Paper';

// Components
import Comments from 'components/misc/Comments';
import Creator from 'components/misc/Creator';
import Votes from 'components/misc/Votes';
import Tabs from 'components/misc/Tabs';

// Modules
import downloadPresets from 'lib/app/presets/download';

// Constants
import { XYBUTTONS_URL } from 'constants/config';

export default class ViewPreset extends React.Component {

  constructor(props) {
    super(props);

    this.state = { loading: true };
  }

  /**
   * Retrieve only the data returned from `GET api/presets/:preset`. Set
   * isInstalled and isCreator.
   */
  componentDidMount() {
    request
      .get(`${XYBUTTONS_URL}api/presets/${this.props.params.preset}`)
      .end((err, res) => {
        if (err || res.body.id == -1) {
          this.props.App._alert('Could not load preset');
          location.hash = '#/presets';
        }

        res.body.isInstalled =
          !!Object.keys(this.props.storage)
            .find(k => k == 'preset_' + res.body.id),
        res.body.isCreator =
          res.body.creator.id == this.props.storage.account.uid
          && res.body.creator.id != 0,
        res.body.loading = false;
        
        this.setState(res.body);
      });
  }

  /**
   * Downloads the preset and its buttons to local storage.
   */
  onDownload() {
    downloadPresets([{ id: this.state.id }])
      .then(() => location.reload())
      .catch(() => this.props.App._alert('Could not download preset'));
  }

  /**
   * Deletes the preset from local storage.
   */
  onRemove() {
    const storage = Object.assign({}, this.props.storage);
    const buttons = storage['preset_' + this.state.id].buttons.slice(0);
    const remove  = [];

    delete storage['preset_' + this.state.id];
    remove.push('preset_' + this.state.id);

    // Loop through all presets and mark buttons from deleted preset that are
    // in other presets
    Object.keys(storage).forEach(key => {
      if (key.indexOf('preset_') == 0) {
        storage[key].buttons.forEach(b1 => {
          const index = buttons.findIndex(b2 => b1.id == b2.id);

          if (index > -1) buttons[index].keep = true;
        });
      }
    });
    
    // Delete buttons that are in deleted preset and not in any other presets
    buttons.forEach(button => {
      if (!button.keep) remove.push('button_' + button.id);
    });

    // Delete keys from storage
    chrome.storage.local.remove(remove, () => location.reload());
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

    const p = this.state;

    return (
      <Tabs
        base={'#/presets/' + this.state.id}
        isCreator={this.state.isCreator}
        activeTabIndex={0}
      >
        <div className='view-preset'>
          <Paper zDepth={1}>
            <h2 className='name'>
              {p.isListed ? <FontIcon>public</FontIcon> : <span />}
              {p.name}
            </h2>
            <span className='domains'>{this.domainsText}</span>
            <p className='description'>{p.description}</p>
          </Paper>

          <Paper zDepth={1}>
            <dl className='info-list'>
              <div>
                <dt>Creator</dt>
                <dd><Creator {...p.creator} /></dd>
              </div>

              <div>
                <dt>Created</dt>
                <dd title={p.created}>{moment(p.created).fromNow()}</dd>
              </div>

              {p.updated.indexOf('0') != 0 ? (
                <div>
                  <dt>Updated</dt>
                  <dd title={p.updated}>{moment(p.updated).fromNow()}</dd>
                </div>
              ) : <span />}

              <div>
                <dt>Votes</dt>
                <dd>
                  <Votes
                    id={p.id} type={1} votes={p.votes}
                    alert={this.props.App._alert}
                  />
                </dd>
              </div>

              <div>
                <dt title='from the past month'>Downloads</dt>
                <dd>{p.downloads}</dd>
              </div>

              <div>
                <dt>URL Match</dt>
                <dd>{p.urlMatch}</dd>
              </div>

              <div>
                <dt>Buttons</dt>
                <dd>
                  <a href={'#/buttons?preset=' + p.id}>
                    View {p.buttons} Buttons
                  </a>
                </dd>
              </div>
            </dl>
          </Paper>

          <Comments
            {...this.props}
            id={p.id}
            type={1}
            alert={this.props.App._alert}
            comments={p.comments}
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
              tooltipLabel='Download preset'
              tooltipPosition='left'
            >file_download</Button>
          )}
        </div>
      </Tabs>
    );
  }

}