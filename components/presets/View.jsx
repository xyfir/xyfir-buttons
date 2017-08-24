import marked from 'marked';
import React from 'react';

// react-md
import Paper from 'react-md/lib/Papers/Paper';

// Components
import Advertisement from 'components/misc/Advertisement';
import Tabs from 'components/misc/Tabs';

export default class ViewPreset extends React.Component {

  constructor(props) {
    super(props);

    this.state = { loading: true };
  }

  /**
   * Load preset.
   */
  componentDidMount() {
    const id = this.props.params.preset;

    chrome.p.storage.local
      .get('preset_' + id)
      .then(res => {
        this.setState(res['preset_' + id]);
        this.setState({ loading: false });
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

    const p = this.state;

    return (
      <Tabs
        type={2}
        base={'#/presets/' + this.state.id}
        activeTabIndex={0}
      >
        <div className='view-preset'>
          <Paper zDepth={1}>
            <h2 className='name'>
              {p.name}
            </h2>
            <span className='domains'>{this.domainsText}</span>
            <div
              className='description markdown-body'
              dangerouslySetInnerHTML={{
                __html: marked(p.description, { santize: true })
              }}
            />
          </Paper>

          <Advertisement />

          <Paper zDepth={1}>
            <dl className='info-list'>
              <div>
                <dt>URL Match</dt>
                <dd>{p.urlMatch}</dd>
              </div>

              <div>
                <dt>Buttons</dt>
                <dd>
                  <a href={'#/buttons?preset=' + p.id}>
                    View {p.buttons.length} Buttons
                  </a>
                </dd>
              </div>
            </dl>
          </Paper>
        </div>
      </Tabs>
    );
  }

}