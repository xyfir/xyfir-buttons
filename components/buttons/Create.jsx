import React from 'react';
import request from 'superagent';

// react-md
import Paper from 'react-md/lib/Papers';

// Components
import Form from 'components/buttons/Form';

// Constants
import { XYBUTTONS_URL } from 'constants/config';

class CreateButton extends React.Component {

  constructor(props) {
    super(props);
  }

  /**
   * Call xyButtons API to create button.
   * @param {object} button - The button object passed from
   * CreateOrEditButtonForm's onValidate().
   */
  onCreate(button) {
    request
      .post(XYBUTTONS_URL + 'api/buttons')
      .send(button)
      .end((err, res) => {
        if (err || res.body.error)
          this.props.App.onAlert(res.body.message);
        else
          chrome.storage.set({ ['button_' + req.body.id]: button });
      });
  }

  render() {
    return (
      <Paper zDepth={1} className='create-button'>
        <Form onSuccess={this.onCreate} />
      </Paper>
    );
  }

}

export default CreateButton;