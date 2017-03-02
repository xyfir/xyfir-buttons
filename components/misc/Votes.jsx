import React, { PropTypes } from 'react';
import request from 'superagent';

// react-md
import FontIcon from 'react-md/lib/FontIcons';
import Button from 'react-md/lib/Buttons/Button';

// Constants
import { XYBUTTONS_URL } from 'constants/config';

export default class Votes extends React.Component {

  constructor(props) {
    super(props);

    this.state = { votes: this.props.votes };
  }

  onVote(vote) {
    const { type, id } = this.props;

    request
      .post(`${XYBUTTONS_URL}api/votes/${type}/${id}`)
      .send({ vote })
      .end((err, res) => {
        if (err || res.body.error)
          this.props.alert(res.body.message);
        else
          this.setState({ vote: this.state.vote + vote });
      });
  }

  render() {
    return (
      <div className='votes'>
        <span className='count'>
          {this.state.votes > 0 ? '+' : ''}
          {this.state.votes}
        </span>

        <div className='controls'>
          <Button
            flat secondary
            onClick={() => this.onVote(-1)}
          >arrow_downward</Button>
          <Button
            flat primary
            onClick={() => this.onVote(1)}
          >arrow_upward</Button>
        </div>
    </div>
    );
  }

}

Votes.propTypes = {
  id: PropTypes.number.isRequired,
  type: PropTypes.number.isRequired,
  votes: PropTypes.number,
  alert: PropTypes.func.isRequired
};

Votes.defaultProps = {
  votes: 0
};