import getPreset from 'lib/inject/get-preset';

/**
 * A function that returns an object for a button that when clicked switches
 * the active preset to the next matching array.
 * @param {number} nextPreset - The id of the preset to switch to when the
 * button is clicked.
 * @returns {object} A button object to be passed to the constructor of Button.
 */
export default function(nextPreset) {

  const button = {
    id: 'next-preset', local: true, urlMatch: '.*',
    
    size: '1em', tooltip: 'Go to Next Preset', position: '95%,0%,0%,95%',
    
    icon: '<svg width="1024" height="1024" viewBox="0 0 1024 1024" style="margin-left: calc(50% - 0.5em)"><g transform="scale(0.03125 0.03125)"><path d="M512 0c-282.77 0-512 229.23-512 512s229.23 512 512 512 512-229.23 512-512-229.23-512-512-512zM512 928c-229.75 0-416-186.25-416-416s186.25-416 416-416 416 186.25 416 416-186.25 416-416 416z"></path><path d="M354.744 706.744l90.512 90.512 285.254-285.256-285.256-285.254-90.508 90.508 194.744 194.746z"></path></g></svg>',
    
    styles: {
      backgroundColor: '#0078d7', color: '#FFF'
    },
    
    script: {
      'main.js': function(Button) {
        // When button is clicked, load the next preset and render it
        Button.on('click', e => getPreset(nextPreset));
      }
    }
  };

  return button;

}