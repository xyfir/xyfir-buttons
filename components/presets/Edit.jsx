import React from 'react';

// react-md
import Paper from 'react-md/lib/Papers';

// Components
import Form from 'components/presets/Form';
import Tabs from 'components/misc/Tabs';

// Modules
import savePreset from 'lib/shared/presets/save';

export default class EditPreset extends React.Component {
  constructor(props) {
    super(props);

    const preset = this.props.storage['preset_' + this.props.params.preset];

    if (!preset) (location.hash = '#/presets'), (this.state = {});
    else this.state = { preset };
  }

  /**
   * Update the preset.
   * @param {object} preset
   */
  onEdit(preset) {
    preset.id = this.state.preset.id;
    savePreset(preset);
  }

  render() {
    if (!this.state.preset) return <div />;

    return (
      <Tabs
        type={2}
        base={'#/presets/' + this.state.preset.id}
        activeTabIndex={2}
      >
        <Paper zDepth={1} className="create-preset">
          <Form
            {...this.props}
            onSuccess={b => this.onEdit(b)}
            preset={this.state.preset}
          />
        </Paper>
      </Tabs>
    );
  }
}
