import downloadButtons from 'lib/app/buttons/download';
import request from 'superagent';

// Constants
import { XYBUTTONS_URL } from 'constants/config';

/**
 * Downloads presets, their buttons, and saves them to local storage.
 * @module lib/app/presets/download
 * @param {object[]} presets - An array that is passed to the download presets
 * api controller as the `presets` query string property.
 * @returns {Promise} A promise that resolves to the downloaded buttons array.
 */
module.exports = function(presets) {

  return new Promise((resolve, reject) => {
    request
      .get(XYBUTTONS_URL + 'api/presets/download')
      .query({ presets: JSON.stringify(presets) })
      .end((err, res) => {
        if (err || res.body.error) {
          reject(res.body.message);
        }
        else {
          const storage = {}, buttons = [];
          
          res.body.presets.forEach(preset => {
            storage['preset_' + preset.id] = preset;

            preset.buttons.forEach(button => {
              if (!buttons.find(b => b.id == button.id))
                buttons.push({ id: button.id });
            });
          });

          downloadButtons(buttons)
            .then(buttons => {
              chrome.storage.local.set(
                storage, () => resolve(res.body.presets, buttons)
              );
            })
            .catch(err => {
              reject(err);
            });
        }
      });
  });

}