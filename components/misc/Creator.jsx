import React, { PropTypes } from 'react';

export default class Creator extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const creator = this.props;

    return (
      <span className='creator'>
        <a
          className='name'
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
  reputation: PropTypes.number.isRequired
};