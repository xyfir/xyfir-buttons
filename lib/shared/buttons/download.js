import request from 'superagent';

// Constants
import { XYBUTTONS_URL } from 'constants/config';

/**
 * Downloads buttons and saves them to storage.
 * @module lib/shared/buttons/download
 * @param {object[]} buttons - An array that is passed to the download buttons
 * api controller as the `buttons` query string property.
 * @returns {Promise} A promise that resolves to the downloaded buttons array.
 */
export default function(buttons) {

  return new Promise((resolve, reject) => {
    if (!buttons.length) {
      resolve();
      return;
    }

    request
      .get(XYBUTTONS_URL + 'api/buttons/download')
      .query({ buttons: JSON.stringify(buttons) })
      .end((err, res) => {
        if (err || res.body.error) {
          reject(res.body.message);
        }
        else {
          const storage = {};
          
          res.body.buttons.forEach(
            button => storage['button_' + button.id] = button
          );

          chrome.storage.local.set(storage, () => resolve(res.body.buttons));
        }
      });
  });

}