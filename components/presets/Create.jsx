import React from 'react';

// react-md
import Paper from 'react-md/lib/Papers';

// Components
import Form from 'components/presets/Form';

// Modules
import savePreset from 'lib/shared/presets/save';

export default class CreatePreset extends React.Component {

  constructor(props) {
    super(props);
  }

  /**
   * Create preset.
   * @param {object} preset
   */
  onCreate(preset) {
    preset.id = Date.now();
    savePreset(preset).then(() => location.hash = '#/presets/' + preset.id);
  }

  render() {
    return (
      <Paper zDepth={1} className='create-preset'>
        <Form {...this.props} onSuccess={b => this.onCreate(b)} />
      </Paper>
    );
  }

}