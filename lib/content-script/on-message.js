import setPresetVisibility from 'lib/content-script/set-preset-visibility';
import getButtonStorage from 'lib/content-script/get-button-storage';
import setButtonStorage from 'lib/content-script/set-button-storage';
import getActivePreset from 'lib/content-script/get-active-preset';
import openExtension from 'lib/content-script/open-extension';
import request from 'lib/content-script/request';

/**
 * Listens for messages from inject.js.
 * @module lib/content-script/on-message
 * @param {event} MessageEvent
 */
export default function(event) {
  // We only want messages from inject.js, and not ourself or anyone else
  if (event.data.from != 'inject.js') return;

  switch (event.data.action) {
    case 'request':
      request(event, event.data);
      break;

    case 'open-extension':
      openExtension(event, event.data);
      break;

    case 'get-active-preset':
      getActivePreset(event, event.data);
      break;

    case 'get-button-storage':
      getButtonStorage(event, event.data);
      break;

    case 'set-button-storage':
      setButtonStorage(event, event.data);
      break;

    case 'set-preset-visibility':
      setPresetVisibility(event, event.data);
      break;
  }
}
