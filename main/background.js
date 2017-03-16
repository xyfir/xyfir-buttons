import onStorageChange from 'lib/background/on-storage-change';
import chromePromise from 'chrome-promise';
import onMessage from 'lib/background/on-message';
import modifyCSP from 'lib/background/modify-csp';
import onStart from 'lib/background/on-start';

chrome.p = new chromePromise();

// Listen for changes made to storage by app.js or content-script.js
chrome.storage.onChanged.addListener(onStorageChange);

// Listen for events from content-script.js
chrome.runtime.onMessage.addListener(onMessage);

// Modifies content security policy to prevent the blocking of eval()
chrome.webRequest.onHeadersReceived.addListener(
  modifyCSP,
  {urls: ['*://*/*'], types: ['main_frame']},
  ['blocking', 'responseHeaders']
);

onStart();