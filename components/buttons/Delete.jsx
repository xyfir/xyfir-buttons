import React from 'react';

// react-md
import Paper from 'react-md/lib/Papers';
import Button from 'react-md/lib/Buttons/Button';

// Components
import Tabs from 'components/misc/Tabs';

export default class DeleteButton extends React.Component {

  constructor(props) {
    super(props);
  }

  /**
   * Delete button from local storage.
   */
  onDelete() {
    const id = this.props.params.button;

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

  render() {
    return (
      <Tabs
        base={'#/buttons/' + this.props.params.button}
        activeTabIndex={3}
      >
        <Paper zDepth={1} className='delete-button'>
          <p>
            Are you sure you want to delete this button?
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