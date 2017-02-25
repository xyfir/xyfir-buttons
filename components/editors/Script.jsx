import React from 'react';

// Components
import Editor from 'components/editors/Editor';

// react-md
import ListItem from 'react-md/lib/Lists/ListItem';
import Button from 'react-md/lib/Buttons/Button';
import Dialog from 'react-md/lib/Dialogs';
import Paper from 'react-md/lib/Papers';
import List from 'react-md/lib/Lists/List';

class ButtonScriptEditor extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      script: JSON.parse(this.props.script), view: 'files', viewing: '',
      selected: '', rename: false
    };
  }

  /**
   * Stringified script object.
   * @type {string}
   */
  get value() {
    return JSON.stringify(this.state.script);
  }

  /**
   * Saves this.refs.editor.value to this.state.script[this.state.viewing].
   */
  onSaveFile() {
    const script = Object.assign({}, this.state.script);

    script[this.state.viewing] = this.refs.editor.value;

    this.setState({ script });
  }

  /**
   * Changes this.state.view to 'files'. File being viewed is not saved.
   */
  onCloseFile() {
    this.setState({ view: 'files', viewing: '' });
  }

  /**
   * Sets this.state.selected to the file parameter which will cause a Dialog
   * to open that contains controls for the file.
   * @param {string} file - The [path/]name.ext of the 'file' to open.
   */
  onSelectFile(file) {
    this.setState({ selected: file });
  }

  /**
   * Unselects a file, hiding the Dialog element.
   */
  onUnselectFile() {
    this.setState({ selected: '' })
  }

  /**
   * Changes this.state.view to 'editor' and sets this.state.viewing to
   * this.state.selected, and then wipes this.state.selected.
   */
  onOpenFile() {
    this.setState({
      view: 'editor', viewing: this.state.selected, selected: ''
    });
  }

  /**
   * Deletes the selected file from the script object.
   */
  onDeleteFile() {
    if (file == 'main.js') return;

    const script = Object.assign({}, this.state.script);

    delete script[this.state.selected];

    this.setState({ script });
  }

  /**
   * Creates a new file.
   * @param {string} file - The [path/]name.ext of the 'file' to create.
   */
  onCreateFile(file) {
    const script = Object.assign({}, this.state.script);

    if (!script[file]) script[file] = '';

    this.setState({ script });
  }

  /**
   * Renames an existing file or opens the rename Dialog.
   * @param {string} [file] - The [path/]name.ext of the 'file' to rename.
   */
  onRenameFile(file) {
    if (!this.state.rename) {
      if (this.state.selected == 'main.js') {
        this.props.onError('Cannot rename main.js');
        return;
      }

      this.setState({ rename: true });
    }
    else {
      const script = Object.assign({}, this.state.script);

      if (script[file]) {
        this.props.onError('That file already exists');
        return;
      }
      
      // Create copy of file with new name, delete old
      script[file] = script[this.state.selected];
      delete script[this.state.selected];

      this.setState({ script, rename: false, selected: '' });
    }
  }

  /**
   * Render the editor view that allows the user to see the content of a 'file'
   * and edit its code.
   * @returns {React.Component}
   */
  _renderEditor() {
    return (
      <Dialog
        fullPage
        id='button-script-editor-dialog'
        visible={true}
        className='button-script-editor editor'
      >
        <Editor
          ref='editor'
          value={this.state.script[this.state.viewing]}
        />

        <div className='floating-controls'>
          <Button
            floating primary fixed
            onClick={() => this.onSaveFile()}
          >save</Button>
          <Button
            floating fixed
            onClick={() => this.onCloseFile()}
          >close</Button>
        </div>
      </Dialog>
    )
  }

  /**
   * Render the file view that allows the user to see all 'files' within the
   * script and open, delete existing, and create new files.
   * @returns {React.Component}
   */
  _renderFiles() {
    const files = Object.keys(this.state.script);

    return (
      <Paper zDepth={2} className='button-script-editor files'>
         <List className='file-list'>
           {files.map(file =>
            <ListItem
              key={file}
              onClick={() => this.onSelectFile(file)}
              primaryText={file}
            />
           )}
         </List>

        <div className='add-file'>
          <TextField
            id='text--add-file'
            ref='filename'
            type='text'
            label='File Name'
            helpText='File name with optional path: path/to/file.js'
            className='md-cell'
          />

          <Button
            flat primary
            label='Add File'
            onClick={() => this.onCreateFile(this.refs.filename.value)}
          >add box</Button>
        </div>

         <Dialog
          id='selected-file-dialog'
          onHide={() => this.onUnselectFile()}
          visible={this.state.selected}
         >{
           this.state.rename ? (
             <div className='rename-file'>
              <TextField
                id='text--rename-file'
                ref='filerename'
                type='text'
                label='File Name'
                helpText='File name with optional path: path/to/file.js'
                className='md-cell'
              />

              <Button
                flat primary
                label='Add File'
                onClick={() => this.onRenameFile(this.refs.filerename.value)}
              >edit</Button>
             </div>
           ) : (
             <div className='file-controls'>
              <Button
                flat primary
                label='Source'
                onClick={() => this.onOpenFile()}
              >code</Button>
              <Button
                flat secondary
                label='Rename'
                onClick={() => this.onRenameFile()}
              >edit</Button>
              <Button
                flat
                label='Delete'
                onClick={() => this.onDeleteFile()}
              >delete</Button>
             </div>
           )
         }</Dialog>
      </Paper>
    )
  }

  render() {
    return this.state.view == 'files'
      ? this._renderFiles()
      : this._renderEditor();
  }

}

ButtonScriptEditor.propTypes = {
  /**
   * Stringified script object
   */
  script: React.PropTypes.string,
  /**
   * Sends an error message string on error.
   */
  onError: React.PropTypes.func.isRequired
};

ButtonScriptEditor.defaultProps = {
  script: '{"main.js":""}'
};

export default ButtonScriptEditor;