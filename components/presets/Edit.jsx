import React from 'react';
import request from 'superagent';

// react-md
import Paper from 'react-md/lib/Papers';

// Components
import Form from 'components/presets/Form';
import Tabs from 'components/misc/Tabs';

// Constants
import { XYBUTTONS_URL } from 'constants/config';

class EditPreset extends React.Component {

  constructor(props) {
    super(props);

    const preset = this.props.storage[
      'preset_' + this.props.params.preset
    ];
    
    if (!preset || preset.creator != this.props.storage.account.uid)
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
        if (err || res.body.error)
          this.props.App._alert(res.body.message);
        else
          chrome.storage.local.set({ ['preset_' + id]: preset });
      });
  }

  render() {
    if (!this.state.preset) return <div />;
    
    return (
      <Tabs
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