/**
 * Sets a tab's preset visibility setting.
 * @module lib/content-script/set-preset-visibility
 * @param {MessageEvent} event - A window.postMessage() event object.
 * @param {object} data - An alias for event.data;
 */
export default function(event, data) {
  
  const tabKey = 'tab_' + chrome.tabId;

  chrome.p.storage.local
    .get(tabKey)
    .then(res => {
      const storage = res[tabKey]
        ? Object.assign(res[tabKey], { presetHidden: data.hidden })
        : { presetHidden: data.hidden };

      return chrome.p.storage.local.set({ [tabKey]: storage });
    })
    .then(() => {
      return;
    })
    .catch(err => {
      console.log('xyB lib/content-script/set-preset-visibility:', err);
    });

}