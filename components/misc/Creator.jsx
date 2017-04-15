import React from 'react';
import PropTypes from 'prop-types';

export default class Creator extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const creator = this.props;

    return (
      <span className='creator'>
        <a
          className={
            `name ${
              creator.isAdmin ? 'admin' :
              creator.isModerator ? 'moderator' :
              creator.isPremium ? 'premium' : ''
            }`
          }
          href={`#/users/${creator.id}`}
        >{creator.name}</a>
        <span className='reputation'>({creator.reputation})</span>
      </span>
    );
  }

}

Creator.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  isAdmin: PropTypes.number.isRequired,
  isPremium: PropTypes.number.isRequired,
  reputation: PropTypes.number.isRequired,
  isModerator: PropTypes.number.isRequired
};