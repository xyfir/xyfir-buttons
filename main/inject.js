import onUrlChange from 'lib/inject/events/on-url-change';
import onKeyDown from 'lib/inject/events/on-key-down';
import onMessage from 'lib/inject/events/on-message';
import getPreset from 'lib/inject/get-preset';

window._xyb_ = {
  transactions: {}, buttons: {},
  presets: {
    current: {}, matches: []
  },
  system: {
    buttons: {}, awaitingKeyCommand: false
  }
};

window.addEventListener('message', onMessage);
window.addEventListener('popstate', onUrlChange);
document.addEventListener('keydown', onKeyDown);

getPreset();