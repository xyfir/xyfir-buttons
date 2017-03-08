import React from 'react';
import request from 'superagent';

// react-md
import Paper from 'react-md/lib/Papers';
import Button from 'react-md/lib/Buttons/Button';

// Components
import Tabs from 'components/misc/Tabs';

// Constants
import { XYBUTTONS_URL } from 'constants/config';

// Modules
import deletePreset from 'lib/shared/presets/delete';

export default class DeletePreset extends React.Component {

  constructor(props) {
    super(props);
  }

  /**
   * Attempt to delete preset via API. If successful it's also deleted from
   * local storage.
   */
  onDelete() {
    const id = this.props.params.preset;

    request
      .delete(`${XYBUTTONS_URL}api/presets/${id}`)
      .end((err, res) => {
        if (err || res.body.error)
          this.props.App._alert('Could not delete preset');
        else
          deletePreset(id).then(() => location.hash = '#/presets');
      });
  }

  render() {
    return (
      <Tabs
        base={'#/presets/' + this.props.params.preset}
        isCreator={true}
        activeTabIndex={3}
      >
        <Paper zDepth={1} className='delete-preset'>
          <p>
            Are you sure you want to delete this preset?
            <br />
            It will be deleted both from your local system and from Xyfir Buttons' servers. Forks of it will remain untouched.
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