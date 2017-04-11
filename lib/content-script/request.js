/**
 * Passes a ButtonRequest object with event properties along to background.js
 * and returns the response to inject.js.
 * @module lib/content-script/request
 * @param {MessageEvent} event - A window.postMessage() event object.
 * @param {object} data - An alias for event.data;
 */
export default function(event, data) {

  const transaction = data.transaction;

  chrome.p.runtime.sendMessage(data)
    .then(res => {
      if (res.error) throw res.error;

      window.postMessage({
        from: 'content-script.js', transaction, error: false,
        response: res.response
      }, location.href);
    })
    .catch(err => {
      window.postMessage({
        from: 'content-script.js', transaction, error: err.toString()
      }, location.href);
    });

}