import savePreset from 'lib/shared/presets/save';

/**
 * Creates a preset for new users.
 * @module lib/background/create-first-preset
 */
export default function() {
  
  chrome.p.storage.local.get([
    'presets'
  ])
  .then(result => {
    if (!Array.isArray(result.presets) || !result.presets.length) {
      savePreset({
        id: Date.now(), name: '', urlMatch: '.*', domains: '*', buttons: [],
        description: 'All buttons will work with this preset.'
      });
    }
  })
  .catch(err =>
    console.error('lib/background/create-first-preset:', err)
  );

}