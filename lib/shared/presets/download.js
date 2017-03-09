import downloadButtons from 'lib/shared/buttons/download';
import updatePresetsArray from 'lib/shared/presets/update-array';
import request from 'superagent';

// Constants
import { XYBUTTONS_URL } from 'constants/config';

/**
 * Downloads presets, their buttons, and saves them to local storage.
 * @module lib/shared/presets/download
 * @param {object[]} presets - An array that is passed to the download presets
 * api controller as the `presets` query string property.
 * @returns {Promise} A promise that resolves on success.
 */
export default function(presets) {

  return new Promise((resolve, reject) => {
    if (!presets.length) {
      resolve();
      return;
    }

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
            .then(() => {
              return chrome.p.storage.local.set(storage);
            })
            .then(() => {
              return updatePresetsArray();
            })
            .then(() => {
              resolve();
            })
            .catch(err => {
              reject(err);
            });
        }
      });
  });

}