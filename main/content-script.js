import chromePromise from 'chrome-promise';
import injectFiles from 'lib/content-script/inject-files';
import onMessage from 'lib/content-script/on-message';
import getTabId from 'lib/content-script/get-tab-id';

chrome.p = new chromePromise();

window.addEventListener('message', onMessage);

getTabId();
injectFiles();