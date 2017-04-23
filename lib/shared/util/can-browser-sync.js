/**
 * Detects if the browser is able to use `browser|chrome.storage.sync`.
 * @module lib/shared/util/can-browser-sync
 * @returns {Promise} A promise that always resolve to a boolean that is true
 * if the browser can use 'sync' storage.
 */
export default function() {

  return new Promise(resolve => {
    try {
      chrome.storage.sync.get('test', res => {
        resolve(!chrome.runtime.lastError);
      });
    }
    catch (err) {
      resolve(false);
    }
  });

}