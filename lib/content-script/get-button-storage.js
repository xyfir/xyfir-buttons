/**
 * Returns a button's local storage object.
 * @module lib/content-script/get-button-storage
 * @param {MessageEvent} event - A window.postMessage() event object.
 * @param {object} data - An alias for event.data;
 */
export default function(event, data) {
  const key = 'buttonstorage_' + data.buttonId;

  chrome.p.storage.local
    .get(key)
    .then(res => {
      window.postMessage(
        {
          from: 'content-script.js',
          transaction: data.transaction,
          store: res[key] || {}
        },
        location.href
      );
    })
    .catch(err => {
      window.postMessage(
        {
          from: 'content-script.js',
          transaction: data.transaction,
          error: err
        },
        location.href
      );
    });
}
