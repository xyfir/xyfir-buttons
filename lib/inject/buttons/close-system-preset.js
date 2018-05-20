import removeSystemPreset from 'lib/inject/remove-system-preset';

/**
 * When clicked, the system preset is removed and the active user preset is
 * made visible again.
 */
export default {
  id: 'close-system-preset',
  urlMatch: '.*',

  size: '2em',
  tooltip: 'Close system preset',
  position: '95%,1%',
  content: '%E2%9C%96%EF%B8%8F',
  styles: {},

  script: {
    'main.js': function(Button) {
      Button.on('click', e => removeSystemPreset());
    }
  }
};
