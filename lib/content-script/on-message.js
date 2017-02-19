import getButtonStorage from 'lib/content-script/get-button-storage';
import setButtonStorage from 'lib/content-script/set-button-storage';
import getActivePreset from 'lib/content-script/get-active-preset';

export default function(event) {

  // We only want messages from inject.js, and not ourself or anyone else
  if (event.data.from != 'inject.js') return;

  switch (d.action) {
    case 'get-active-preset':
      getActivePreset(event, event.data);
      break;

    case 'get-button-storage':
      getButtonStorage(event, event.data);
      break;

    case 'set-button-storage':
      setButtonStorage(event, event.data);
      break;
  }

}