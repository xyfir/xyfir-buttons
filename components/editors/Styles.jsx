import React from 'react';

// Components
import Editor from 'lib/editors/Editor';

// react-md
import Button from 'react-md/lib/Buttons/Button';
import Dialog from 'react-md/lib/Dialogs';

class StylesEditor extends React.Component {

  constructor(props) {
    super(props);

    this.state = { showEditor: false, value: this.props.value };
  }

  /**
   * A string (not JSON) representing an HTMLElement.style object.
   * @type {string}
   */
  get value() {
    return this.state.value;
  }

  /**
   * Opens or closes the editor. Does not save editor's data on close.
   */
  onToggleShowEditor() {
    this.setState({ view: !this.state.showEditor });
  }

  /**
   * Save's the editor's value to this.state.value.
   */
  onSaveStyles() {
    this.setState({ value: this.refs.editor.value });
  }

  /**
   * Render the editor view that allows the user to see the edit the
   * HTMLElement.style object.
   * @returns {React.Component}
   */
  _renderEditor() {
    return (
      <Dialog
        fullPage
        id='styles-editor-dialog'
        visible={true}
        className='styles-editor editor'
      >
        <Editor
          ref='editor'
          value={this.state.value}
        />

        <div className='floating-controls'>
          <Button
            floating primary fixed
            onClick={() => this.onSaveStyles()}
          >save</Button>
          <Button
            floating fixed
            onClick={() => this.onToggleShowEditor()}
          >close</Button>
        </div>
      </Dialog>
    )
  }

  /**
   * Renders a button that when clicked opens the editor.
   * @returns {React.Component}
   */
  _renderButton() {
    return (
      <Button
        flat primary
        label='Custom Styles'
        onClick={() => this.onToggleShowEditor()}
      >edit</Button>
    )
  }

  render() {
    return this.state.showEditor
      ? this._renderEditor()
      : this._renderButton();
  }

}

StylesEditor.propTypes = {
  /**
   * A string (not JSON) representing an HTMLElement.style object. Must be code
   * that if eval()'d would return an object.
   */
  value: React.PropTypes.string,
};

StylesEditor.defaultProps = {
  value: '{ backgroundColor: "blue", color: "white" }'
};

export default StylesEditor;