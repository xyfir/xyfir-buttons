import React from 'react';

// react-md
import Button from 'react-md/lib/Buttons/Button';
import Paper from 'react-md/lib/Papers';

// Components
import StylesEditor from 'components/editors/Styles';
import Tabs from 'components/misc/Tabs';

// Modules
import savePreset from 'lib/shared/presets/save';

export default class EditPresetButton extends React.Component {
  constructor(props) {
    super(props);

    const button = this.props.storage[
      'preset_' + this.props.params.preset
    ].buttons.find(b => b.id == this.props.params.button);

    this.state = {
      presetId: this.props.params.preset,
      button
    };
  }

  /**
   * Update a button's preset-specific data. For now this is only the
   * button's styling.
   */
  onUpdate() {
    const { presetId, button } = this.state;
    const preset = this.props.storage['preset_' + presetId];

    preset.buttons = preset.buttons.filter(b => b.id != button.id);
    preset.buttons.push(
      Object.assign({}, button, { styles: this.refs.styles.value })
    );

    savePreset(preset).then(() => this.props.App._alert('Button updated'));
  }

  /**
   * Remove button from the preset.
   */
  onRemove() {
    const { presetId, button } = this.state;
    const preset = this.props.storage['preset_' + presetId];

    preset.buttons = preset.buttons.filter(b => b.id != button.id);

    savePreset(preset).then(() => history.back());
  }

  render() {
    const { presetId, button } = this.state;

    return (
      <Tabs type={2} base={'#/presets/' + presetId} activeTabIndex={4}>
        <Paper zDepth={1} className="edit-button-in-preset">
          <StylesEditor ref="styles" value={button.styles} />

          <hr className="divider" />

          <div className="controls">
            <Button
              raised
              secondary
              label="Remove Button"
              onClick={() => this.onRemove()}
            >
              delete
            </Button>

            <Button
              raised
              primary
              label="Update Button"
              onClick={() => this.onUpdate()}
            >
              edit_mode
            </Button>
          </div>
        </Paper>
      </Tabs>
    );
  }
}
