import React from 'react';
import marked from 'marked';
import request from 'superagent';

// react-md
import Paper from 'react-md/lib/Papers';

// Constants
import { XYDOCS_URL } from 'constants/config';

export default class ViewDocumentation extends React.Component {
  constructor(props) {
    super(props);

    this.state = { content: '' };
  }

  componentWillMount() {
    request
      .get(XYDOCS_URL + this.props.location.query.file + '.md')
      .end((err, res) => {
        if (err) return;

        // Convert markdown to html
        this.setState({
          content: marked(window.atob(res.body.content), { santize: true })
        });
      });
  }

  render() {
    if (!this.state.content) return <div />;

    return (
      <Paper zDepth={1} className="view-documentation">
        <div
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: this.state.content }}
        />
      </Paper>
    );
  }
}
