import React from 'react';

// Components
import Editor from 'components/editors/Editor';

// react-md
import Button from 'react-md/lib/Buttons/Button';
import Dialog from 'react-md/lib/Dialogs';

class StylesEditor extends React.Component {

  constructor(props) {
    super(props);

    this.state = { showEditor: false, value: this.props.value };
  }

  /**
   * A JSON string representing an HTMLElement.style object.
   * @type {string}
   */
  get value() {
    return this.state.value;
  }

  /**
   * Opens or closes the editor. Does not save editor's data on close.
   */
  onToggleShowEditor() {
    this.setState({ showEditor: !this.state.showEditor });
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
        title='Styles Editor'
        visible={true}
        className='styles-editor editor'
      >
        <Editor
          ref='editor'
          mode='json'
          value={this.state.value}
        />

        <div className='floating-controls'>
          <Button
            floating primary fixed
            tooltipPosition='top'
            fixedPosition='bl'
            tooltipLabel='Save Styles'
            onClick={() => this.onSaveStyles()}
          >save</Button>
          <Button
            floating secondary fixed
            tooltipPosition='top'
            tooltipLabel='Close Editor'
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
        flat
        label='Edit Styles'
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
   * A JSON string representing an HTMLElement.style object.
   */
  value: React.PropTypes.string,
};

StylesEditor.defaultProps = {
  value: '{}'
};

export default StylesEditor;