import request from 'superagent';
import moment from 'moment';

// Constants
import { XYBUTTONS_URL, ENVIRONMENT } from 'constants/config';

// Modules
import updateStoredItems from 'lib/background/update-stored-items';
import createFirstPreset from 'lib/background/create-first-preset';
import wipeTempData from 'lib/background/wipe-temp-data';
import canSync from 'lib/shared/util/can-browser-sync';

/**
 * - Attempts to create a new session if an access token is present.
 * - Downloads data stored in chrome.storage.sync to chrome.storage.local.
 * - Calls updateStoredItems() to update locally installed presets and their
 * buttons from the xyButtons API.
 * @module lib/background/on-start
 */
export default function() {

  let sync = true;
  
  canSync()
    .then(_sync => {
      sync = _sync;

      return chrome.p.storage[sync ? 'sync' : 'local'].get('account');
    })
    .then(result => {
      const account = result.account || { accessToken: '' };

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
                Object.assign(account, res.body);
                delete account.loggedIn;

                chrome.p.storage.local.set({ account })
                  .then(() => {
                    return sync
                      ? () => chrome.p.storage.sync.set({ account })
                      : Promise.resolve();
                  })
                  .then(() => resolve());
              }
            });
        }
      });
    })
    .then(() => {
      // Get all keys of items saved to remote storage
      if (sync)
        return chrome.p.storage.sync.get(null);
      else
        return {};
    })
    .then(result => {
      // Update local storage to reflect sync storage
      return chrome.p.storage.local.set(result);
    })
    .then(() => {
      updateStoredItems();
    })
    .catch(err => {
      console.log('lib/background/on-start:', err);

      createFirstPreset();
      updateStoredItems();
    });

  wipeTempData();

}