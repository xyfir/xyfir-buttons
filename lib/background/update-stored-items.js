// Modules
import downloadPresets from 'lib/app/presets/download';

// Constants
import { XYBUTTONS_URL } from 'constants/config';

/**
 * Download the latest version of locally installed presets and their buttons
 * from the xyButtons API.
 * @module lib/background/update-stored-items
 */
export default function() {

  // Loop through presets
  chrome.p.storage.local
    .get('presets')
    .then(result => {
      if (!Array.isArray(result.presets) || !result.presets.length) return;

      // Build array to be sent to xyButtons
      const presets = result.presets.map(p => {
        return { id: p.id, updated: p.updated }
      });

      downloadPresets(presets)
        .then(() => 1)
        .catch(e => console.log('lib/background/update-stored-items:', e));
    });

}