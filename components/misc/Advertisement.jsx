import PropTypes from 'prop-types';
import request from 'superagent';
import React from 'react';

// react-md
import Paper from 'react-md/lib/Papers';

// Constants
import { XYFIR_URL } from 'constants/config';

export default class Advertisement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentWillMount() {
    const res = await request.get(XYFIR_URL + 'api/ads').query({
      count: 1,
      blacklist: 'xyButtons'
    });

    this.setState(res.body[0]);
  }

  render() {
    if (!this.state.name) return null;

    return (
      <Paper zDepth={1}>
        <a onClick={() => window.open(this.state.ad.link)}>
          {this.state.ad.normalText.title}
        </a>

        <span>{this.state.ad.normalText.description}</span>
      </Paper>
    );
  }
}
