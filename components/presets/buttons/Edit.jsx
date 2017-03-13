import request from 'superagent';
import React from 'react';

// react-md
import Button from 'react-md/lib/Buttons/Button';
import Paper from 'react-md/lib/Papers';

// Components
import StylesEditor from 'components/editors/Styles';
import Tabs from 'components/misc/Tabs';

// Modules
import downloadPresets from 'lib/shared/presets/download';

// Constants
import { XYBUTTONS_URL } from 'constants/config';

export default class EditPresetButton extends React.Component {

  constructor(props) {
    super(props);

    const button =
      this.props.storage['preset_' + this.props.params.preset]
        .buttons.find(b => b.id == this.props.params.button);
    
    this.state = {
      presetId: this.props.params.preset, button
    };
  }

  /**
   * Attempts to update a button's preset-specific data. For now this is only
   * the button's styling.
   */
  onUpdate() {
    const { presetId, button } = this.state;

    request
      .put(`${XYBUTTONS_URL}api/presets/${presetId}/buttons/${button.id}`)
      .send(
        Object.assign({}, button, { styles: this.refs.styles.value })
      )
      .end((err, res) => {
        if (err || res.body.error) {
          this.props.App._alert('Could not update button');
        }
        else {
          downloadPresets([{ id: presetId }])
            .then(() => 1).catch(() => 1);
          this.props.App._alert('Button updated');
        }
      });
  }

  render() {
    const { presetId, button } = this.state;

    return (
      <Tabs
        type={2}
        base={'#/presets/' + presetId}
        isCreator={true}
        activeTabIndex={4}
      >
        <Paper zDepth={1} className='edit-button-in-preset'>
          <StylesEditor ref='styles' value={button.styles} />

          <hr className='divider' />

          <Button
            raised primary
            label='Update Styles'
            onClick={() => this.onUpdate()}
          >edit_mode</Button>
        </Paper>
      </Tabs>
    );
  }

}