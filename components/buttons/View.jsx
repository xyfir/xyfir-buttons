import marked from 'marked';
import React from 'react';

// react-md
import ListItem from 'react-md/lib/Lists/ListItem';
import Button from 'react-md/lib/Buttons/Button';
import Dialog from 'react-md/lib/Dialogs';
import Paper from 'react-md/lib/Papers/Paper';
import List from 'react-md/lib/Lists/List';

// Components
import Advertisement from 'components/misc/Advertisement';
import ScriptEditor from 'components/editors/Script';
import Tabs from 'components/misc/Tabs';

// Modules
import savePreset from 'lib/shared/presets/save';

export default class ViewButton extends React.Component {
  constructor(props) {
    super(props);

    const s = this.props.storage;
    let presets = [];

    presets = Object.keys(s)
      .filter(k => /^preset_/.test(k))
      .map(k => s[k]);

    this.state = { loading: true, presets, addToPreset: false };
  }

  /**
   * Load button into state.
   */
  componentDidMount() {
    const id = this.props.params.button;

    chrome.p.storage.local.get('button_' + id).then(r => {
      this.setState(r['button_' + id]);
      this.setState({ loading: false });
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
    } else {
      const preset = this.state.presets.find(p => p.id == id);
      const button = preset.buttons.findIndex(b => this.state.id == id);

      if (button > -1) return;

      preset.buttons.push({
        id,
        size: '4em',
        position: '50%,50%',
        styles: '{}'
      });

      savePreset(preset).then(() => this.setState({ addToPreset: false }));
    }
  }

  /**
   * Attempts to convert this.state.domains into more human-readable text.
   * @type {string}
   */
  get domainsText() {
    switch (this.state.domains) {
      case '':
        return '';
      case '*':
        return 'Global';
      case '**':
        return 'Multiple Sites';
      default:
        return this.state.domains.replace(/,/g, ' - ');
    }
  }

  render() {
    if (this.state.loading) return <div />;

    const b = this.state;

    return (
      <Tabs base={'#/buttons/' + this.state.id} activeTabIndex={0}>
        <div className="view-button">
          <Paper zDepth={1}>
            <h2 className="name">{b.name}</h2>
            <span className="domains">{this.domainsText}</span>
            <div
              className="description markdown-body"
              dangerouslySetInnerHTML={{
                __html: marked(b.description, { santize: true })
              }}
            />
          </Paper>

          <Advertisement />

          <Paper zDepth={1}>
            <div className="url-match">
              <label>URL Match Expression:</label>
              <span>{b.urlMatch}</span>
            </div>

            {b.repository ? (
              <a href={b.repository} target="_blank" className="repository">
                View Repository
              </a>
            ) : null}

            <ScriptEditor
              readOnly
              value={b.script}
              onError={this.props.App._alert}
            />
          </Paper>

          {this.state.presets.length ? (
            <Button
              floating
              primary
              fixed
              onClick={() => this.onAddToPreset()}
              tooltipLabel="Add button to a preset you own"
              fixedPosition="bl"
              tooltipPosition="right"
            >
              library_add
            </Button>
          ) : null}

          <Dialog
            id="add-button-to-preset"
            onHide={() => this.setState({ addToPreset: false })}
            visible={this.state.addToPreset}
            className="add-button-to-preset"
          >
            <List className="presets-list">
              {this.state.presets.map(preset => (
                <ListItem
                  threeLines
                  onClick={() => this.onAddToPreset(preset.id)}
                  primaryText={preset.name}
                  secondaryText={
                    (preset.domains == '*'
                      ? 'Global'
                      : preset.domains == '**'
                        ? 'Multiple'
                        : preset.domains) +
                    '\n' +
                    preset.description.split('\n')[0]
                  }
                />
              ))}
            </List>
          </Dialog>
        </div>
      </Tabs>
    );
  }
}
