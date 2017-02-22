import React from 'react';
import request from 'superagent';

// react-md
import Paper from 'react-md/lib/Papers';

// Components
import Form from 'components/buttons/Form';

// Constants
import { XYBUTTONS_URL } from 'constants/config';

class EditButton extends React.Component {

  constructor(props) {
    super(props);

    const button = this.props.storage[
      'button_' + this.props.params.button
    ];

    if (!button) location.hash = '#/buttons';

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
          this.props.App.onAlert(res.body.message);
        else
          chrome.storage.set({ ['button_' + id]: button });
      });
  }

  render() {
    return (
      <Paper zDepth={1} className='create-button'>
        <Form onSuccess={this.onCreate} button={this.state.button} />
      </Paper>
    );
  }

}

export default EditButton;