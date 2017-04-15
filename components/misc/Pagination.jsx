import React from 'react';
import PropTypes from 'prop-types';

// react-md
import 'react-md/lib/Buttons/Button';

class Pagination extends React.Component {

  constructor(props) {
    super(props);
  }

  /**
   * Add or change the url hash's query string variable lastId to
   * this.props.lastId.
   */
  onNext() {
    const id = this.props.lastId, hash = location.hash;

    if (hash.indexOf('lastId=') > -1)
      location.hash = hash.replace(/lastId=\d+/, 'lastId=' + id);
    else if (hash.indexOf('?') > -1)
      location.hash += '&lastId=' + id;
    else
      location.hash += '?lastId=' + id;
  }

  render() {
    return (
      <div className='pagination'>
        {this.props.currentLastId ? (
          <Button
            secondary raised
            label='Back'
            onClick={() => history.back()}
          >navigate before</Button>
        ) : (<span />)}

        {this.props.lastId ? (
          <Button
            primary raised
            label='Next'
            onClick={() => this.onNext()}
          >navigate next</Button>
        ) : (<span />)}
      </div>
    );
  }

}

Pagination.propTypes = {
  /**
   * The id of the 25th item in the list. If truthy, show the next button.
   */
  lastId: PropTypes.number,
  /**
   * The current last id for the list. If truthy, the back button is shown.
   */
  currentLastId: PropTypes.number
}

export default Pagination;