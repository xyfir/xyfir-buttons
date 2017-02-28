import React from 'react';
import request from 'superagent';

// react-md
import Paper from 'react-md/lib/Papers';

// Components
import Form from 'components/buttons/Form';

// Constants
import { XYBUTTONS_URL } from 'constants/config';

// Modules
import downloadButtons from 'lib/app/buttons/download';

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
          const next = () => location.hash = '#/buttons/' + res.body.id;
          downloadButtons([{ id: res.body.id }]).then(next).catch(next);
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