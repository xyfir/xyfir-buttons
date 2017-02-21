import onStorageChange from 'lib/background/on-storage-change';
import chromePromise from 'chrome-promise';
import onMessage from 'lib/background/on-message';
import onStart from 'lib/background/on-start';

chrome.p = new chromePromise();

// Listen for changes made to storage by app.js or content-script.js
chrome.storage.onChanged.addListener(onStorageChange);

// Listen for events from content-script.js
chrome.runtime.onMessage.addListener(onMessage);

onStart();