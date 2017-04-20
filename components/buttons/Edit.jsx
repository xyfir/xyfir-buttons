import React from 'react';
import request from 'superagent';

// react-md
import Paper from 'react-md/lib/Papers';

// Components
import Form from 'components/buttons/Form';
import Tabs from 'components/misc/Tabs';

// Modules
import downloadButtons from 'lib/shared/buttons/download';
import isCreator from 'lib/app/items/is-creator';

// Constants
import { XYBUTTONS_URL } from 'constants/config';

class EditButton extends React.Component {

  constructor(props) {
    super(props);

    const button = this.props.storage[
      'button_' + this.props.params.button
    ];
    
    if (
      !button ||
      !isCreator(button.creator, this.props.storage, 'button', button.id)
    )
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

    button.modKey = this.props.storage.modkeys.buttons[id] || '';

    request
      .put(XYBUTTONS_URL + 'api/buttons/' + id)
      .send(button)
      .end((err, res) => {
        if (err || res.body.error) {
          this.props.App._alert(res.body.message);
        }
        else {
          const next = () => location.reload();
          downloadButtons([{ id }]).then(next).catch(next);
        }
      });
  }

  render() {
    if (!this.state.button) return <div />;
    
    return (
      <Tabs
        base={'#/buttons/' + this.state.button.id}
        isCreator={true}
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

export default EditButton;