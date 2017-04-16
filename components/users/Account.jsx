import request from 'superagent';
import moment from 'moment';
import React from 'react';

// react-md
import TextField from 'react-md/lib/TextFields';
import Button from 'react-md/lib/Buttons/Button';
import Paper from 'react-md/lib/Papers';

// Constants
import { XYACCOUNTS_URL, XYBUTTONS_URL } from 'constants/config';

// Modules
import canSync from 'lib/shared/can-browser-sync';

export default class Account extends React.Component {

  constructor(props) {
    super(props);
  }

  /**
   * Attempts to update the user's display name.
   */
  onUpdateName() {
    const name = this.refs.name._field.getValue();

    request
      .put(XYBUTTONS_URL + 'api/users/account')
      .send({ name })
      .end((err, res) => {
        if (err || res.body.error) {
          this.props.App._alert(res.body.message);
        }
        else {
          const account = Object.assign(
            {}, this.props.storage.account, { name }
          );

          canSync()
            .then(sync => {
              return sync
                ? chrome.p.storage.sync.set({ account })
                : Promise.resolve();
            })
            .then(() => chrome.p.storage.local.set({ account }))
            .then(() => location.reload());
        }
      });
  }

  _renderAccount() {
    const a = this.props.storage.account;

    return (
      <div className='account'>
        <Paper zDepth={1} className='controls'>
          <Button
            flat
            label={
              moment().unix() > (a.subscription || 0)
              ? 'Purchase Subscription' : 'Extend Subscription'
            }
            onClick={() => location.hash += '/purchase'}
          >access_time</Button>

          <Button
            flat
            label='View Profile'
            onClick={() => location.hash = '#/users/' + a.uid}
          >account_box</Button>
        </Paper>

        <Paper zDepth={1}>
          <TextField
            id='text--name'
            ref='name'
            type='text'
            label='Display Name'
            className='md-cell'
            defaultValue={a.name}
          />

          <Button
            primary flat
            label='Update Name'
            onClick={() => this.onUpdateName()}
          >mode_edit</Button>
        </Paper>
      </div>
    );
  }

  _renderLogin() {
    return (
      <Paper zDepth={1} className='login'>
        <h2>You are not logged in!</h2>
        <p>
          Logging in with your Xyfir Account allows you to vote, comment, edit your created buttons and presets, and more.
        </p>

        <div>
          <Button
            secondary raised
            label='Register'
            onClick={() => location.href = XYACCOUNTS_URL + 'app/#/register/16'}
          >account_box</Button>
          
          <Button
            primary raised
            label='Login'
            onClick={() => location.href = XYACCOUNTS_URL + 'app/#/login/16'}
          >account_box</Button>
        </div>
      </Paper>
    );
  }

  render() {
    return (
      <div className='user-account'>{
        this.props.storage.account.uid
          ? this._renderAccount()
          : this._renderLogin()
      }</div>
    );
  }

}