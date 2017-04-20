import React from 'react';
import request from 'superagent';

// react-md
import Paper from 'react-md/lib/Papers';

// Components
import Form from 'components/presets/Form';
import Tabs from 'components/misc/Tabs';

// Constants
import { XYBUTTONS_URL } from 'constants/config';

// Modules
import downloadPresets from 'lib/shared/presets/download';
import isCreator from 'lib/app/items/is-creator';

class EditPreset extends React.Component {

  constructor(props) {
    super(props);

    const preset = this.props.storage[
      'preset_' + this.props.params.preset
    ];
    
    if (
      !preset ||
      !isCreator(preset.creator, this.props.storage, 'preset', preset.id)
    )
      location.hash = '#/presets', this.state = {};
    else
      this.state = { preset };
  }

  /**
   * Call xyButtons API to edit the preset.
   * @param {object} preset - The preset object passed from
   * CreateOrEditPresetForm's onValidate().
   */
  onEdit(preset) {
    const id = this.state.preset.id;

    request
      .put(XYBUTTONS_URL + 'api/presets/' + id)
      .send(preset)
      .end((err, res) => {
        if (err || res.body.error) {
          this.props.App._alert(res.body.message);
        }
        else {
          const next = () => location.reload();
          downloadPresets([{ id }]).then(next).catch(next);
        }
      });
  }

  render() {
    if (!this.state.preset) return <div />;
    
    return (
      <Tabs
        type={2}
        base={'#/presets/' + this.state.preset.id}
        isCreator={true}
        activeTabIndex={2}
      >
        <Paper zDepth={1} className='create-preset'>
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

export default EditPreset;