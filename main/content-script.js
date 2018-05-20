import injectFiles from 'lib/content-script/inject-files';
import onMessage from 'lib/content-script/on-message';
import getTabId from 'lib/content-script/get-tab-id';
import chromep from 'chrome-promise';

chrome.p = chromep;

window.addEventListener('message', onMessage);

getTabId();
injectFiles();
