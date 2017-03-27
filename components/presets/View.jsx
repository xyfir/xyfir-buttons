import request from 'superagent';
import marked from 'marked';
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
import downloadPresets from 'lib/shared/presets/download';
import deletePreset from 'lib/shared/presets/delete';

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
    deletePreset(this.state.id).then(() => location.reload());
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
        type={2}
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
            type={2}
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