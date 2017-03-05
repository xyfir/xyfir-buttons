import request from 'superagent';
import moment from 'moment';
import React from 'react';

// react-md
import Paper from 'react-md/lib/Papers/Paper';

// Components
import Comments from 'components/misc/Comments';

// Constants
import { XYBUTTONS_URL } from 'constants/config';

export default class ViewUser extends React.Component {

  constructor(props) {
    super(props);

    this.state = { loading: true };
  }

  /**
   * Load user's data from `GET api/users/:user/`.
   */
  componentDidMount() {
    request
      .get(`${XYBUTTONS_URL}api/users/${this.props.params.user}`)
      .end((err, res) => {
        if (err || res.body.id == -1) {
          this.props.App._alert('Could not load user');
          location.hash = '#/users';
        }
        
        res.body.loading = false;
        this.setState(res.body);
      });
  }

  render() {
    if (this.state.loading) return <div />;

    const u = this.state;

    return (
      <div className='view-user'>
        <Paper zDepth={1}>
          <h2 className='name'>{u.name}</h2>

          <dl className='info-list'>
            <div>
              <dt>User #</dt><dd>{u.id}</dd>
            </div>
            
            <div>
              <dt>Joined</dt>
              <dd title={u.joined}>{moment(u.joined).fromNow()}</dd>
            </div>
            
            <div>
              <dt>Reputation</dt><dd>{u.reputation}</dd>
            </div>

            <div>
              <dt>Buttons</dt>
              <dd>
                <a href={'#/buttons?user=' + u.id}>
                  View {u.buttons} Buttons
                </a>
              </dd>
            </div>
            
            <div>
              <dt>Presets</dt>
              <dd>
                <a href={'#/presets?user=' + u.id}>
                  View {u.presets} Presets
                </a>
              </dd>
            </div>
          </dl>
        </Paper>

        <Comments
          {...this.props}
          id={u.id}
          type={4}
          alert={this.props.App._alert}
          comments={u.comments}
        />
      </div>
    );
  }

}