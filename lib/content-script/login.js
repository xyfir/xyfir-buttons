/**
 * Checks if user is logging into Xyfir Buttons. Sends data to background.js
 * to go through the login process.
 */
export default function() {

  if (location.host == 'buttons.xyfir.com' && location.search)
    chrome.runtime.sendMessage({ action: 'login' });

}