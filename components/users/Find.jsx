import request from 'superagent';
import moment from 'moment';
import React from 'react';

// react-md
import SelectField from 'react-md/lib/SelectFields';
import TextField from 'react-md/lib/TextFields';
import ListItem from 'react-md/lib/Lists/ListItem';
import List from 'react-md/lib/Lists/List';

// Components
import Pagination from 'components/misc/Pagination';

// Constants
import { XYBUTTONS_URL } from 'constants/config';

export default class FindUsers extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      users: [], order: 'reputation', direction: 'desc',
      lastId: (this.props.location.query.lastId || 0),
      search: ''
    };

    this._loadUsers = this._loadUsers.bind(this);
  }

  componentDidMount() {
    this._loadUsers(false);
  }

  /**
   * Make sure the query string's lastId variable matches this.state.lastId.
   */
  componentWillReceiveProps(props) {
    if (this.state.lastId != props.location.query.lastId) {
      this.setState({
        lastId: (props.location.query.lastId || 0)
      }, () => this._loadUsers(false));
    }
  }

  /**
   * Updates this.state and calls this._loadUsers().
   * @param {string} prop - The property name within this.state to set val to.
   * @param {any} val - The value to set to this.state at prop.
   */
  onFilter(prop, val) {
    this.setState({ [prop]: val }, () => this._loadUsers());
  }

  /**
   * Loads users with filters.
   * @param {boolean} [timeout=true] - If true, everything is wrapped in a 200
   * millisecond timeout that is cleared if _loadUsers() is called again
   * before the timeout is finished.
   */
  _loadUsers(timeout = true) {
    clearTimeout(this.searchTimeout);
    
    this.searchTimeout = setTimeout(() => {
      const query = Object.assign({}, this.state);
      delete query.users;

      request
        .get(XYBUTTONS_URL + 'api/users')
        .query(query)
        .end((err, res) => {
          if (err || res.body.error)
            this.props.App._alert(res.body.message);
          else
            this.setState({ users: res.body.users });
        });
    }, timeout ? 200 : 0);
  }

  /**
   * Renders the actual list of users.
   * @returns {JSX.Element}
   */
  _renderList() {
    if (!this.state.users.length) {
      return (
        <List className='users-list'>
          <ListItem primaryText='No users found'  />
        </List>
      );
    }

    return (
      <List className='users-list'>{
        this.state.users.map(user =>
          <a href={'#/users/' + user.id} key={user.id}>
            <ListItem
              threeLines
              primaryText={user.name}
              secondaryText={
                `Joined ${moment(user.joined).fromNow()}
                ${user.reputation} reputation points`
              }
            />
          </a>
        )
      }</List>
    );
  }

  render() {
    return (
      <div className='find-users'>
        <div className='controls'>
          <div className='md-grid'>
            <SelectField
              id='select--order-by'
              label='Order By'
              value={this.state.order}
              menuItems={[
                { label: 'Reputation', value: 'reputation' },
                { label: 'Date Joined', value: 'joined' }
              ]}
              onChange={v => this.onFilter('order', v)}
              className='md-cell'
            />

            <SelectField
              id='select--order-direction'
              label='Order Direction'
              value={this.state.direction}
              menuItems={[
                { label: 'Ascending', value: 'asc' },
                { label: 'Descending', value: 'desc' }
              ]}
              onChange={v => this.onFilter('direction', v)}
              className='md-cell'
            />
          </div>
          
          <div className='md-grid'>
            <TextField
              fullWidth
              id='search--search'
              type='search'
              label='Search'
              className='md-cell'
              onChange={v => this.onFilter('search', v)}
            />
          </div>
        </div>

        {this._renderList()}

        <Pagination
          lastId={(this.state.users[24] || {}).id}
          onChange={id => this.setState({ lastId: id })}
          currentLastId={this.state.lastId}
        />
      </div>
    );
  }

}