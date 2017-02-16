/**
 * Contacts background.js to get the current tab's id, which is then set to
 * chrome.tabId. Sets value to -1 on error.
 * @module lib/content-script/get-tab-id
 */
export default function() {

  chrome.p.runtime.sendMessage({ action: 'get-tab-id' })
    .then(id => {
      chrome.tabId = id;
    })
    .catch(err => {
      chrome.tabId = -1;
    });

}