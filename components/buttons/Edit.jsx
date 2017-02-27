import React from 'react';
import request from 'superagent';

// react-md
import Paper from 'react-md/lib/Papers';

// Components
import Form from 'components/buttons/Form';
import Tabs from 'components/buttons/Tabs';

// Constants
import { XYBUTTONS_URL } from 'constants/config';

class EditButton extends React.Component {

  constructor(props) {
    super(props);

    const button = this.props.storage[
      'button_' + this.props.params.button
    ];
    
    if (!button || button.creator != this.props.storage.account.uid)
      location.hash = '#/buttons', this.state = {};
    else
      this.state = { button };
  }

  /**
   * Call xyButtons API to edit the button.
   * @param {object} button - The button object passed from
   * CreateOrEditButtonForm's onValidate().
   */
  onEdit(button) {
    const id = this.state.button.id;

    request
      .put(XYBUTTONS_URL + 'api/buttons/' + id)
      .send(button)
      .end((err, res) => {
        if (err || res.body.error)
          this.props.App._alert(res.body.message);
        else
          chrome.storage.local.set({ ['button_' + id]: button });
      });
  }

  render() {
    if (!this.state.button) return <div />;
    
    const base = '#/buttons/' + this.state.button.id;
    
    return (
      <Tabs id={this.state.button.id} activeTabIndex={2} isCreator={true}>
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

export default EditButton;