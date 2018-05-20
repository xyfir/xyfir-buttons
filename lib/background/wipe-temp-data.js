/**
 * Deletes temporary stored data.
 * @module lib/background/wipe-temp-data
 */
export default function() {
  chrome.p.storage.local
    .get(null)
    .then(result => {
      const remove = Object.keys(result).filter(key => /^tab_/.test(key));
      chrome.storage.local.remove(remove);
    })
    .catch(err => {
      console.error('lib/background/wipe-temp-data:', err);
    });
}
