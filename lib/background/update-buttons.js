import request from 'superagent';

// Constants
import { XYBUTTONS_URL } from 'constants/config';

/**
 * Update buttons within presets that were updated.
 * @module lib/background/update-buttons
 * @param {object[]} presets - An array of preset objects as returned from
 * GET xyButtons/api/presets/download.
 */
export default function(presets) {

  let buttons;

  // Build buttons array to send to api
  buttons = JSON.stringify(
    presets.buttons.map(b => {
      return {
        id: b.id, updated: b.updated
      };
    })
  );

  request
    .get(XYBUTTONS_URL + 'api/buttons/download')
    .query({ buttons })
    .end((err, res) => {
      if (err || !res.error || !res.buttons.length) return;

      buttons = {};

      // Convert response to object that can be inserted into local storage
      res.buttons.forEach(button => {
        presets['button_' + button.id] = button;
      });

      chrome.storage.local.set(buttons);
    });

}