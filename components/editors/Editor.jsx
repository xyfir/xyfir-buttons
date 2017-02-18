import React from 'react';
import brace from 'brace';
import Ace from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/monokai';
import 'brace/mode/svg';

class Editor extends React.Component {

  constructor(props) {
    super(props);

    this.state = { value: this.props.value };
  }

  /**
   * The editor's current value.
   * @type {string}
   */
  get value() {
    return this.state.value;
  }

  render() {
    return (
      <div className='ace-editor'>
        <Ace
          name={'ace-editor-' + this.props.mode}
          mode={this.props.mode}
          theme='monokai'
          width='100vw'
          value={this.state.value}
          height='100vh'
          tabSize={2}
          onChange={value => this.setState({ value })}
          wrapEnabled={true}
          showPrintMargin={false}
        />
      </div>
    );
  }

}

Editor.propTypes = {
  /**
   * String to set as the initial content in the editor.
   */
  value: React.PropTypes.string,
  /**
   * The editor mode (syntax). Possible values: 'javascript', 'svg'. Defaults
   * to 'javascript'.
   */
  mode: React.PropTypes.mode
};

Editor.defaultProps = {
  value: '', mode: 'javascript'
};

export default Editor;