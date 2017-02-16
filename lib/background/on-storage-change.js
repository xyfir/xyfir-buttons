import moment from 'moment';

/**
 * Listen for changes to any of the extension's storage areas.
 * @module lib/background/on-storage-change
 * @param {object} changes - A key:value object holding the properties that
 * were changed. Each key's value is a StorageChange object that holds oldValue
 * and newValue properties.
 * @param {string} areaName - The name of the storage area. Possible values are
 * 'sync', 'local', or 'managed'.
 */
export default function(changes, areaName) {

  // background.js makes changes to sync area, but not local  
  if (areaName != 'local') return;

  chrome.p.storage.sync
    .get('account')
    .then(res => {
      // Only sync if user has subscription
      if (moment().unix() > res.account.subscription) return;

      // Convert StorageChange object to normal key:val object
      Object.keys(changes).forEach(change => {
        changes[change] = changes[change].newValue;
      });

      chrome.storage.sync.set(changes);
    })
    .catch(err => {
      return;
    });

}