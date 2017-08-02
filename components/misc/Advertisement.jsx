import React from 'react';
import moment from 'moment';
import request from 'superagent';
import PropTypes from 'prop-types';

// react-md
import Paper from 'react-md/lib/Papers';

// Constants
import { XYBUTTONS_URL } from 'constants/config';

export default class Advertisement extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    if (this.props.sub > moment().unix()) return;

    request
      .get(XYBUTTONS_URL + 'api/ads')
      .end((err, res) =>
        !err && res.body.link && this.setState(res.body)
      );
  }

  render() {
    if (!this.state.type) return <span />;
    
    return (
      <Paper zDepth={1}>
        <a onClick={() => window.open(this.state.link)}>{
          this.state.normalText.title
        }</a>
        
        <span>{this.state.normalText.description}</span>

        <small>
          Remove advertisements by purchasing a <a href='#/users/account/purchase'>subscription</a>.
        </small>
      </Paper>
    );
  }

}

Advertisement.propTypes = {
  sub: PropTypes.number
};

Advertisement.defaultProps = {
  sub: 0
};