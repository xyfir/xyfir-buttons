import { XYBUTTON_URL} from 'constants/config';
import updatePresets from 'lib/background/update-presets';
import request from 'superagent';
import moment from 'moment';

/**
 * Downloads data stored in chrome.storage.sync to chrome.storage.local. Calls
 * updatePresets() to update locally installed presets and their buttons from
 * the xyButtons API.
 * @module lib/background/on-start
 */
export default function() {

  let account = {};
  
  chrome.p.storage.sync
    .get('account')
    .then(result => {
      account = result.account;

      return new Promise((resolve, reject) => {
        // Check if an access token is available
        if (!account.accessToken) {
          reject('No access token');
        }
        // Validate access token with xyAccounts
        else {
          request
            .get(XYBUTTON_URL + 'api/users/account')
            .query({ token: account.accessToken })
            .end((err, result) => {
              // Sync account subscription
              account.subscription = result.subscription;
              chrome.storage.sync.set({ account });

              if (err || !result.loggedIn)
                reject('Invalid access token');
              else if (moment().unix() > result.subscription)
                reject('User has no subscription');
              else
                resolve();
            });
        }
      });
    })
    .then(() => {
      // Get all keys of items saved to remote storage
      return chrome.p.storage.sync.get(null);
    })
    .then(result => {
      // Update local storage to reflect sync storage
      return chrome.p.storage.local.set(result);
    })
    .then(() => {
      updatePresets();
    })
    .catch(err => {
      updatePresets();
    });

}