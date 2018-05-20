import React from 'react';

// react-md
import TextField from 'react-md/lib/TextFields';
import Button from 'react-md/lib/Buttons/Button';
import Paper from 'react-md/lib/Papers';

// Modules
import parseUserscript from 'lib/shared/convert-userscript/parse-code';
import saveButton from 'lib/shared/buttons/save';

export default class CreateButtonFromUserscript extends React.Component {
  constructor(props) {
    super(props);
  }

  /**
   * Create button.
   * @param {object} button - The button object passed from
   * CreateOrEditButtonForm's onValidate().
   */
  onCreate() {
    const button = parseUserscript(this.refs.script._field.getValue());

    if (!button) {
      this.props.App._alert('Could not parse or convert userscript');
      return;
    }

    (button.styles = '{}'), (button.id = Date.now());

    saveButton(button);
  }

  render() {
    return (
      <Paper zDepth={1} className="create-button-from-userscript">
        <p>
          Our system will attempt to automatically convert a userscript to a
          button compatible with Xyfir Buttons. This process is not perfect and
          the end result may work completely, partially, or not at all.
          <br />
          Clicking the created button will toggle running the original
          userscript's code when the button is injected into a page.
        </p>

        <TextField
          id="textarea--script"
          ref="script"
          rows={10}
          type="text"
          label="Userscript Code"
          maxRows={10}
          helpText={
            'The entire userscript code, including the required metadata' +
            ' comment block.'
          }
          className="md-cell"
          lineDirection="right"
        />

        <Button
          raised
          primary
          label="Create Button"
          onClick={() => this.onCreate()}
        />
      </Paper>
    );
  }
}
