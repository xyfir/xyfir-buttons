/**
 * Opens option.html in a new tab with a specific hash.
 * @module lib/content-script/open-extension
 * @param {MessageEvent} event - A window.postMessage() event object.
 * @param {object} data - An alias for event.data;
 * @param {string} data.hash - The hash to add to the url.
 */
export default function(event, data) {
  chrome.runtime.sendMessage(data);
}
