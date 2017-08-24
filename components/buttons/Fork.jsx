import React from 'react';

// react-md
import Paper from 'react-md/lib/Papers';
import Button from 'react-md/lib/Buttons/Button';

// Components
import Tabs from 'components/misc/Tabs';

// Modules
import saveButton from 'lib/shared/buttons/save';

export default class ForkButton extends React.Component {

  constructor(props) {
    super(props);
  }

  /**
   * Create a fork of the button.
   */
  onFork() {
    const id = this.props.params.button;
    let button;
    
    chrome.p.storage.local
      .get('button_' + id)
      .then(res => {
        button = res['button_' + id];
        button.id = Date.now();
        return saveButton(button);
      })
      .then(() => location.hash = '#/buttons/' + button.id);
  }

  render() {
    return (
      <Tabs
        base={'#/buttons/' + this.props.params.button}
        activeTabIndex={1}
      >
        <Paper zDepth={1} className='fork-button'>
          <p>
            Are you sure you want to fork this button?
          </p>
          <Button
            raised primary
            label='Fork Button'
            onClick={() => this.onFork()}
          >call_split</Button>
        </Paper>
      </Tabs>
    );
  }

}