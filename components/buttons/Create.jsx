import React from 'react';

// react-md
import Paper from 'react-md/lib/Papers';

// Components
import Form from 'components/buttons/Form';

// Modules
import saveButton from 'lib/shared/buttons/save';

export default class CreateButton extends React.Component {

  constructor(props) {
    super(props);
  }

  /**
   * Create button.
   * @param {object} button
   */
  onCreate(button) {
    button.id = Date.now();
    saveButton(button).then(() => location.hash = '#/buttons/' + button.id);
  }

  render() {
    const props = Object.assign({}, this.props);

    if (props.location.query.loadFrom) {
      const loadFrom = props.location.query.loadFrom.split('.');
      props.button = props.storage[loadFrom[0]][loadFrom[1]];
    }

    return (
      <Paper zDepth={1} className='create-button'>
        <a href='#/buttons/create/from-userscript'>
          Convert From Userscript
        </a>

        <Form {...props} onSuccess={b => this.onCreate(b)} />
      </Paper>
    );
  }

}