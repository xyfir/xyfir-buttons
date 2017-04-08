import request from 'superagent';
import moment from 'moment';
import React from 'react';

// react-md
import SelectField from 'react-md/lib/SelectFields';
import TextField from 'react-md/lib/TextFields';
import FontIcon from 'react-md/lib/FontIcons';
import Button from 'react-md/lib/Buttons/Button';
import Paper from 'react-md/lib/Papers';

// Constants
import { XYBUTTONS_URL, STRIPE_KEY } from 'constants/config';

export default class Purchase extends React.Component {

  constructor(props) {
    super(props);
  }

  onPurchase() {
    // save updated subscription to storage
    this._loadStripe()
      .then(() => {
        const data = {
          exp_month: this.refs.month._field.getValue(),
          number: this.refs.number._field.getValue(),
          exp_year: this.refs.year._field.getValue(),
          cvc: this.refs.cvc._field.getValue()
        };

        return new Promise((resolve, reject) => {
          Stripe.card.createToken(data, (status, res) => {
            if (res.error)
              reject(res.error.message);
            else
              resolve(res.id);
          });
        });
      })
      .then(token => {
        const data = {
          subscription: +this.refs.subscription.state.value,
          stripeToken: token
        };
        
        return new Promise((resolve, reject) => {
          request
            .post(XYBUTTONS_URL + 'api/users/account/purchase')
            .send(data)
            .end((err, res) => {
              if (err || res.body.error)
                reject(res.body.message);
              else
                resolve(res.body.subscription);
            });
        });
      })
      .then(subscription => {
        const account = Object.assign(
          {}, this.props.storage.account, { subscription }
        );
        
        chrome.storage.local.set({ account }, () => location.reload());
      })
      .catch(err => {
        this.props.App._alert(err);
      });
  }

  /**
   * Loads Stripe's library if needed.
   * @return {Promise} Resolves once library is loaded.
   */
  _loadStripe() {
    return new Promise(resolve => {
      try {
        Stripe;
        resolve();
      }
      catch (e) {
        const el = document.createElement('script');
        
        el.src = 'https://js.stripe.com/v2/';
        el.type = 'text/javascript';
        el.onload = () => {
          Stripe.setPublishableKey(STRIPE_KEY);
          resolve()
        };

        document.body.appendChild(el);
      }
    });
  }

  render() {
    const a = this.props.storage.account, ref = a.referral,
    discount = (ref.referral || ref.affiliate) && ref.hasMadePurchase;

    return (
      <Paper zDepth={1} className='purchase'>
        {discount ? (
          <p>
            You will receive 10% off of your first purchase.
          </p>
        ) : a.subscription > moment().unix() ? (
          <p>
            Your subscription will expire on {
              moment.unix(a.subscription).calendar()
            }. Purchasing another subscription will add time to your existing one.
          </p>
        ) : <span />}

        <p>
          Purchasing a xyButtons subscription helps support development and keep our servers up.
          <br />
          Subscribed users receive a golden username and do not receive advertisements.
          <br />
          In the future more special features may be added. Have an idea for a new feature? Send us an <a href='https://xyfir.com/#/contact' target='_blank'>email</a>.
        </p>

        <SelectField
          id='select--subscription'
          ref='subscription'
          label='Subscription'
          menuItems={[
            { label: '1 Month - $1', value: 1 },
            { label: '1 Year - $10', value: 2 }
          ]}
          className='md-cell'
        />

        <TextField
          id='text--number'
          ref='number'
          type='text'
          label='Card Number'
          leftIcon={<FontIcon>credit_card</FontIcon>}
          className='md-cell'
        />

        <TextField
          id='number--cvc'
          ref='cvc'
          type='number'
          label='CVC'
          leftIcon={<FontIcon>security</FontIcon>}
          className='md-cell'
        />

        <div className='expiration'>
          <TextField
            id='number--exp-month'
            ref='month'
            type='number'
            label='Expiration Month'
            className='md-cell'
          />

          <TextField
            id='number--exp-year'
            ref='year'
            type='number'
            label='Expiration Year'
            className='md-cell'
          />
        </div>

        <Button
          raised primary
          label='Purchase'
          onClick={() => this.onPurchase()}
        >credit_card</Button>
      </Paper>
    );
  }

}