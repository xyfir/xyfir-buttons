import generateTransaction from 'lib/shared/util/generate-transaction';

/**
 * A local storage api for each button. Data is sent to content-script.js and
 * saved to chrome.storage.local.
 */
export default class ButtonStorage {

  /**
   * @param {number} id - The button's id.
   */
  constructor(id) {
    /**
     * @property {number} The button's id
     */
    this.id = id;
    
    /**
     * @property {object} A key:value object with the button's storage
     */
    this.store = {};
    
    /**
     * @property {boolean} If data has been loaded from content-script.js
     */
    this.hasLoaded = false;
  }

  /**
   * Calls content-script.js to get the button's local storage data.
   * @private
   * @returns {Promise} A promise that resolves to the storage object and
   * rejects with an error message.
   */
  _loadStore() {
    return new Promise((resolve, reject) => {
      const transaction = generateTransaction(window._xyb_, (event, data) => {
        if (data.error) {
          reject('Could not load object from chrome.storage');
        }
        else {
          this.store = data.store;
          this.hasLoaded = true;

          resolve(this.store);
        }
      });

      window.postMessage({
        from: 'inject.js', transaction, action: 'get-button-storage',
        buttonId: this.id
      }, location.href);
    });
  }

  /**
   * Calls content-script.js to update the button's storage object.
   * @private
   * @param {number} [count=0] - _updateStorage() calls itself on error and
   * uses count to limit running infinitely on error.
   */
  _updateStorage(count = 0) {
    const transaction = generateTransaction(window._xyb_, (event, data) => {
      if (data.error && count < 3) this._updateStorage(count + 1);
    });

    window.postMessage({
      from: 'inject.js', transaction, action: 'set-button-storage',
      buttonId: this.id, store: this.store
    }, location.href);
  }

  /**
   * Returns the button's local storage object.
   * @returns {Promise} A promise that resolves to the storage object and
   * rejects with an error message.
   */
  get() {
    if (this.hasLoaded)
      return new Promise(resolve => resolve(this.store));
    else
      return this._loadStore();
  }

  /**
   * Sets a value to a key in the button's local storage object. If a key
   * already exists, its value is replaced with the new value. Works like
   * React's setState().
   * @param {object} obj - A key:value object to merge the button's storage
   * object with via Object.assign().
   * @returns {object} The updated storage object.
   */
  set(obj) {
    Object.assign(this.store, obj);

    this._updateStorage();
    
    return this.store;
  }

  /**
   * Removes keys from the button's local storage.
   * @param {string[]} keys - The keys to remove from the button's storage.
   * @returns {object} The updated storage object.
   */
  remove(keys) {
    keys.forEach(key => {
      delete this.store[key];
    });

    this._updateStorage();

    return this.store;
  }

  /**
   * Replaces the entire storage object with a new object.
   * @param {object} obj - The object to replace the current object with.
   */
  replace(obj) {
    this.store = obj;
    this._updateStorage();
  }
  
  /**
   * Empties the storage object.
   */
  clear() {
    this.store = {};
    this._updateStorage();
  }

}