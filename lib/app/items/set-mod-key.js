/**
 * Sets a mod key to local storage for a button or preset if a mod key is
 * present in the response object.
 * @module lib/app/items/set-mod-key
 * @param {object} storage - The extension storage object.
 * @param {object} response - The response.body from a superagent request to an
 * API route that will return an object with an `id` property and possibly a
 * `modKey` property.
 * @param {string} type - The type of item: 'preset|button'.
 */
export default function(storage, response, type) {

  if (response.modKey) {
    const keys = Object.assign({ buttons: {}, presets: {} }, storage.modkeys);
    keys[type + 's'][response.id] = response.modKey;
    
    chrome.storage.local.set({ modkeys: keys });
  }

}