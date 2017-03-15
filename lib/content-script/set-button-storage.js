/**
 * Sets a button's local storage object.
 * @module lib/content-script/set-button-storage
 * @param {MessageEvent} event - A window.postMessage() event object.
 * @param {object} data - An alias for event.data;
 */
export default function(event, data) {
  
  const key = 'buttonstorage_' + data.buttonId;

  chrome.p.storage.local
    .set({ [key]: data.store })
    .then(res => {
      window.postMessage({
        from: 'content-script.js', transaction: data.transaction,
        error: false
      }, location.href);
    })
    .catch(err => {
      window.postMessage({
        from: 'content-script.js', transaction: data.transaction,
        error: err
      }, location.href);
    });

}