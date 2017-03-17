import chromePromise from 'chrome-promise';
import injectFiles from 'lib/content-script/inject-files';
import onMessage from 'lib/content-script/on-message';
import getTabId from 'lib/content-script/get-tab-id';
import login from 'lib/content-script/login';

chrome.p = new chromePromise();

window.addEventListener('message', onMessage);

login();
getTabId();
injectFiles();