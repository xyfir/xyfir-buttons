import canSync from 'lib/shared/util/can-browser-sync';

let sync = false;

// Only sync these keys
const whitelist = ['account', 'presets', 'modkeys'];

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

  // Browser cannot access sync StorageArea
  if (!sync) return;

  // background.js makes changes to sync area, but not local  
  if (areaName != 'local') return;

  const remove = [], set = {};

  // Populate remove[], set{} from changes[]
  Object.keys(changes).forEach(change => {
    for (let key of whitelist) {
      if (whitelist.indexOf(change) == -1) return;
    }

    if (changes[change].newValue)
      set[change] = changes[change].newValue;
    else
      remove.push(change);
  });

  chrome.storage.sync.set(set);
  chrome.storage.sync.remove(remove);

}

canSync().then(_sync => sync = _sync);