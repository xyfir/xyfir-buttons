import updatePresetsArray from 'lib/app/presets/update-array';

/**
 * Deletes a preset from `preset_[id]` and `presets` array in local storage.
 * @module lib/app/presets/delete
 * @param {number} id
 * @returns {Promise} A promise that always resolves.
 */
export default function(id) {

  return new Promise(resolve => {
    chrome.p.storage.local.get(null)
      .then(storage => {
        const buttons = storage['preset_' + id].buttons.slice(0);
        const remove  = [];

        delete storage['preset_' + id];
        remove.push('preset_' + id);

        // Loop through all presets and mark buttons from deleted preset that are
        // in other presets
        Object.keys(storage).forEach(key => {
          if (key.indexOf('preset_') == 0) {
            storage[key].buttons.forEach(b1 => {
              const index = buttons.findIndex(b2 => b1.id == b2.id);

              if (index > -1) buttons[index].keep = true;
            });
          }
        });
        
        // Delete buttons that are in deleted preset and not in any other presets
        buttons.forEach(button => {
          if (!button.keep) remove.push('button_' + button.id);
        });

        // Delete keys from storage
        return chrome.p.storage.local.remove(remove);
      })
      .then(() => {
        return updatePresetsArray();
      })
      .then(() => {
        resolve();
      });
  });

}