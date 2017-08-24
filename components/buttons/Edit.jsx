import React from 'react';

// react-md
import Paper from 'react-md/lib/Papers';

// Components
import Form from 'components/buttons/Form';
import Tabs from 'components/misc/Tabs';

// Modules
import saveButton from 'lib/shared/buttons/save';

export default class EditButton extends React.Component {

  constructor(props) {
    super(props);

    const button = this.props.storage[
      'button_' + this.props.params.button
    ];
    
    if (!button)
      location.hash = '#/buttons', this.state = {};
    else
      this.state = { button };
  }

  /**
   * Update button.
   * @param {object} button
   */
  onEdit(button) {
    button.id = this.state.button.id;
    saveButton(button);
  }

  render() {
    if (!this.state.button) return <div />;
    
    return (
      <Tabs
        base={'#/buttons/' + this.state.button.id}
        activeTabIndex={2}
      >
        <Paper zDepth={1} className='create-button'>
          <Form
            {...this.props}
            onSuccess={b => this.onEdit(b)}
            button={this.state.button}
          />
        </Paper>
      </Tabs>
    );
  }

}