import updateArray from 'lib/shared/presets/update-array';

/**
 * Save preset to storage.
 * @param {object} preset
 * @return {Promise}
 */
export default function(preset) {
  return chrome.p.storage.local
    .set({ ['preset_' + preset.id]: preset })
    .then(() => updateArray());
}
