import Ace from 'react-ace';
import React from 'react';
import brace from 'brace';
import PropTypes from 'prop-types';

import 'brace/mode/javascript';
import 'brace/theme/monokai';
import 'brace/ext/searchbox';
import 'brace/mode/json';

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
          fontSize={15}
          readOnly={this.props.readOnly}
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
  value: PropTypes.string,
  /**
   * The editor mode (syntax). Possible values: 'javascript', 'json'.
   * Defaults to 'javascript'.
   */
  mode: PropTypes.string,
  /**
   * Disables user's ability to edit the content.
   */
  readOnly: PropTypes.bool
};

Editor.defaultProps = {
  value: '', mode: 'javascript', readOnly: false
};

export default Editor;