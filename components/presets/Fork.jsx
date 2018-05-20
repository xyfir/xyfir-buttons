import React from 'react';

// react-md
import Button from 'react-md/lib/Buttons/Button';
import Paper from 'react-md/lib/Papers';

// Components
import Tabs from 'components/misc/Tabs';

// Modules
import savePreset from 'lib/shared/presets/save';

export default class ForkPreset extends React.Component {
  constructor(props) {
    super(props);
  }

  /**
   * Create a fork of the preset and its buttons.
   */
  onFork() {
    const id = this.props.params.preset;
    let preset;

    chrome.p.storage.local
      .get('preset_' + id)
      .then(res => {
        preset = res['preset_' + id];
        preset.id = Date.now();
        return savePreset(preset);
      })
      .then(() => (location.hash = '#/presets/' + preset.id));
  }

  render() {
    return (
      <Tabs
        type={2}
        base={'#/presets/' + this.props.params.preset}
        activeTabIndex={1}
      >
        <Paper zDepth={1} className="fork-preset">
          <p>Are you sure you want to fork this preset?</p>
          <Button
            raised
            primary
            label="Fork Preset"
            onClick={() => this.onFork()}
          >
            call_split
          </Button>
        </Paper>
      </Tabs>
    );
  }
}
