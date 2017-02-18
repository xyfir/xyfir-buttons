import request from 'superagent';

// Modules
import updateButtons from 'lib/background/update-buttons';

// Constants
import { XYBUTTONS_URL } from 'constants/config';

/**
 * Download the latest version of locally installed presets and their buttons
 * from the xyButtons API.
 * @module lib/background/update-presets
 */
export default function() {

  let presets;

  // Loop through presets
  chrome.p.storage.local
    .get('presets')
    .then(result => {
      if (!Array.isArray(result.presets) || !result.presets.length) return;

      // Build array to be sent to xyButtons
      presets = JSON.stringify(
          result.presets.map(p => {
          delete p.urlMatch;
          return p;
        })
      );

      // Call GET xyButtons/api/presets/download?presets=[...]
      request
        .get(XYBUTTONS_URL + 'api/presets/download')
        .query({ presets })
        .end((err, res) => {
          if (err || res.error || !res.presets.length) return;

          presets = {};

          // Convert presets array to object to set to storage
          res.presets.forEach(preset => {
            presets['preset_' + preset.id] = preset;
          });

          // Update presets in local storage
          chrome.p.storage.local
            .set(presets)
            .then(() => updateButtons(res.presets));
        });
    });

}