import React from 'react';
import request from 'superagent';

// react-md
import Paper from 'react-md/lib/Papers';
import Button from 'react-md/lib/Buttons/Button';

// Components
import Tabs from 'components/misc/Tabs';

// Constants
import { XYBUTTONS_URL } from 'constants/config';

export default class DeleteButton extends React.Component {

  constructor(props) {
    super(props);
  }

  /**
   * Attempt to delete button via API. If successful it's also deleted from
   * local storage.
   */
  onDelete() {
    const id = this.props.params.button;

    request
      .delete(XYBUTTONS_URL + 'api/buttons/' + id)
      .send({
        modKey: this.props.storage.modkeys.buttons[id] || ''
      })
      .end((err, res) => {
        if (err || res.body.error) {
          this.props.App._alert('Could not delete button');
        }
        else {
          const storage = Object.assign({}, this.props.storage);

          // Delete button from presets
          Object.keys(storage).map(key => {
            if (key.indexOf('preset_') == 0) {
              storage[key].buttons = storage[key].buttons
                .filter(b => b.id != id);
            }
          });

          chrome.p.storage.local.set(storage)
            .then(() => chrome.p.storage.local.remove('button_' + id))
            .then(() => location.hash = '#/buttons')
            .catch(err => this.props.App._alert(err));
        }
      });
  }

  render() {
    return (
      <Tabs
        base={'#/buttons/' + this.props.params.button}
        isCreator={true}
        activeTabIndex={3}
      >
        <Paper zDepth={1} className='delete-button'>
          <p>
            Are you sure you want to delete this button?
            <br />
            It will be deleted both from your local system and from Xyfir Buttons' servers. It will also be removed from any presets that use it. Forks of it will remain untouched.
          </p>
          <Button
            raised primary
            label='Delete Button'
            onClick={() => this.onDelete()}
          >delete</Button>
        </Paper>
      </Tabs>
    );
  }

}