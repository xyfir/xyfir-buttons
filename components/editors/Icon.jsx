import React from 'react';

// Components
import Editor from 'components/editors/Editor';

// react-md
import Button from 'react-md/lib/Buttons/Button';
import Dialog from 'react-md/lib/Dialogs';
import Paper from 'react-md/lib/Papers';

class IconEditor extends React.Component {

  constructor(props) {
    super(props);

    this.state = { view: 'icon', value: this.props.value };
  }

  /**
   * The icon's SVG data.
   * @type {string}
   */
  get value() {
    return this.state.value;
  }

  /**
   * Opens or closes the editor. Does not save editor's data on close.
   */
  onToggleShowEditor() {
    this.setState({
      view: (this.state.view == 'icon' ? 'editor' : 'icon')
    });
  }

  /**
   * Save's the editor's value to this.state.value.
   */
  onSaveIcon() {
    this.setState({ value: this.refs.editor.value });
  }

  /**
   * Render the editor view that allows the user to see the content of an svg
   * icon and edit its code.
   * @returns {React.Component}
   */
  _renderEditor() {
    return (
      <Dialog
        fullPage
        id='icon-editor-dialog'
        visible={true}
        className='icon-editor editor'
      >
        <Editor
          ref='editor'
          mode='svg'
          value={this.state.value}
        />

        <div className='floating-controls'>
          <Button
            floating primary fixed
            onClick={() => this.onSaveIcon()}
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
   * Renders the SVG icon and allows the user to open the svg code editor.
   * @returns {React.Component}
   */
  _renderIcon() {
    return (
      <Paper zDepth={2} className='icon-editor icon'>
        <div
          className='icon-viewer'
          dangerouslySetInnerHTML={{__html: this.state.value}}
        />

        <Button
          flat primary
          label='Edit Icon'
          onClick={() => this.onToggleShowEditor()}
        >edit</Button>
      </Paper>
    )
  }

  render() {
    return this.state.view == 'icon'
      ? this._renderIcon()
      : this._renderEditor();
  }

}

IconEditor.propTypes = {
  /**
   * SVG data for the icon image.
   */
  value: React.PropTypes.string,
};

IconEditor.defaultProps = {
  value: '<svg><!-- icon must be svg format --></svg>'
};

export default IconEditor;