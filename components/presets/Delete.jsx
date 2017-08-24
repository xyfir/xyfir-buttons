import React from 'react';

// react-md
import Paper from 'react-md/lib/Papers';
import Button from 'react-md/lib/Buttons/Button';

// Components
import Tabs from 'components/misc/Tabs';

// Modules
import deletePreset from 'lib/shared/presets/delete';

export default class DeletePreset extends React.Component {

  constructor(props) {
    super(props);
  }

  /**
   * Delete preset.
   */
  onDelete() {
    const id = this.props.params.preset;
    deletePreset(id).then(() => location.hash = '#/presets');
  }

  render() {
    return (
      <Tabs
        type={2}
        base={'#/presets/' + this.props.params.preset}
        activeTabIndex={3}
      >
        <Paper zDepth={1} className='delete-preset'>
          <p>
            Are you sure you want to delete this preset?
          </p>
          <Button
            raised primary
            label='Delete Preset'
            onClick={() => this.onDelete()}
          >delete</Button>
        </Paper>
      </Tabs>
    );
  }

}