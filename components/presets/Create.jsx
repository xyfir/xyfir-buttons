import React from 'react';
import request from 'superagent';

// react-md
import Paper from 'react-md/lib/Papers';

// Components
import Form from 'components/presets/Form';

// Constants
import { XYBUTTONS_URL } from 'constants/config';

// Modules
import downloadPresets from 'lib/shared/presets/download';

class CreatePreset extends React.Component {

  constructor(props) {
    super(props);
  }

  /**
   * Call xyButtons API to create preset.
   * @param {object} preset - The preset object passed from
   * CreateOrEditPresetForm's onValidate().
   */
  onCreate(preset) {
    request
      .post(XYBUTTONS_URL + 'api/presets')
      .send(preset)
      .end((err, res) => {
        if (err || res.body.error) {
          this.props.App._alert(res.body.message);
        }
        else {
          const next = () => location.hash = '#/presets/' + res.body.id;
          downloadPresets([{ id: res.body.id }]).then(next).catch(next);
        }
      });
  }

  render() {
    return (
      <Paper zDepth={1} className='create-preset'>
        <Form {...this.props} onSuccess={b => this.onCreate(b)} />
      </Paper>
    );
  }

}

export default CreatePreset;