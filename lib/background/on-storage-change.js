import moment from 'moment';

/**
 * Do not sync keys that begin with these prefixes.
 */
const ignore = ['localpreset_', 'tab_'];

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

      const remove = [], set = {};

      // Populate remove[], set{} from changes[]
      Object.keys(changes).forEach(change => {
        for (let key of ignore) {
          if (change.indexOf(key) == 0) return;
        }

        if (changes[change].newValue)
          set[change] = changes[change].newValue;
        else
          remove.push(change);
      });

      chrome.storage.sync.set(set);
      chrome.storage.sync.remove(remove);
    })
    .catch(err => {
      console.log('lib/background/on-storage-change', err);
    });

}