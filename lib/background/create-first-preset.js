import savePreset from 'lib/shared/presets/save';

/**
 * Creates a preset for users without any.
 */
export default async function() {
  try {
    const { presets } = await chrome.p.storage.local.get('presets');

    if (!Array.isArray(presets) || !presets.length) {
      await savePreset({
        id: Date.now(),
        name: 'Main Preset',
        urlMatch: '.*',
        domains: '*',
        description: 'All buttons will work with this preset.',
        buttons: []
      });
    }
  } catch (err) {
    console.error('lib/background/create-first-preset', err);
  }
}
