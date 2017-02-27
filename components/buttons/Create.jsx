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
        if (err || res.body.error) {
          this.props.App._alert(res.body.message);
        }
        else {
          // Download and save button
          request
            .get(XYBUTTONS_URL + 'api/buttons/download')
            .query({ buttons: JSON.stringify([{ id: res.body.id }]) })
            .end((err, res) => {
              if (err || res.body.error) {
                this.props.App._alert(res.body.error);
              }
              else {
                button = res.body.buttons[0];

                chrome.storage.local.set({ ['button_' + button.id]: button });
                location.hash = '#/buttons/' + button.id;
              }
            });
        }
      });
  }

  render() {
    return (
      <Paper zDepth={1} className='create-button'>
        <Form {...this.props} onSuccess={b => this.onCreate(b)} />
      </Paper>
    );
  }

}

export default CreateButton;