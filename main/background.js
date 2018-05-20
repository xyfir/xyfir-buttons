import createFirstPreset from 'lib/background/create-first-preset';
import wipeTempData from 'lib/background/wipe-temp-data';
import onMessage from 'lib/background/on-message';
import modifyCSP from 'lib/background/modify-csp';
import chromep from 'chrome-promise';

chrome.p = chromep;

// Listen for events from content-script.js
chrome.runtime.onMessage.addListener(onMessage);

// Modifies content security policy to prevent the blocking of eval()
chrome.webRequest.onHeadersReceived.addListener(
  modifyCSP,
  { urls: ['*://*/*'], types: ['main_frame'] },
  ['blocking', 'responseHeaders']
);

createFirstPreset();
wipeTempData();
