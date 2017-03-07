import request from 'superagent';
import moment from 'moment';

// Constants
import { XYBUTTONS_URL, ENVIRONMENT } from 'constants/config';

// Modules
import updatePresets from 'lib/background/update-presets';

/**
 * - Attempts to create a new session if an access token is present.
 * - Downloads data stored in chrome.storage.sync to chrome.storage.local IF
 * user is logged in and has a subscription.
 * - Calls updatePresets() to update locally installed presets and their
 * buttons from the xyButtons API.
 * @module lib/background/on-start
 */
export default function() {
  
  chrome.p.storage.sync
    .get('account')
    .then(result => {
      let account = result.account || { accessToken: '' };

      // reject() is used to skip sync process
      return new Promise((resolve, reject) => {
        // Check if an access token is available
        if (!account.accessToken && ENVIRONMENT != 'dev') {
          reject('No access token');
        }
        // Validate access token with xyAccounts
        else {
          request
            .get(XYBUTTONS_URL + 'api/users/account')
            .query({ token: account.accessToken })
            .end((err, res) => {
              if (err || !res.body.loggedIn) {
                reject('Could not create session');
              }
              else {
                account = res.body;
                delete account.loggedIn;

                chrome.p.storage.sync.set({ account })
                  .then(() => chrome.p.storage.local.set({ account }))
                  .then(() => {
                    if (moment().unix() > account.subscription)
                      reject('User has no subscription');
                    else
                      resolve();
                  });
              }
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
      console.log('lib/background/on-start:', err);
      updatePresets();
    });

}