import removeSystemPreset from 'lib/inject/remove-system-preset';
import getPreset from 'lib/inject/get-preset';

/**
 * A button that when clicked switches the active preset to the next in the
 * window._xyb_.presets.matches array.
 */
export default {

  id: 'next-preset', urlMatch: '.*',
  
  size: '4em', tooltip: 'Go to next preset', position: '90%,90%',
  content: 'Next Preset', styles: '{}',
  
  script: {
    
    'main.js': function(Button) {
      const { current, matches } = window._xyb_.presets;

      if (matches.length > 1) {
        // Get the current preset's index in the matches array
        const index = matches.findIndex(p => p.id == current.id);
        let id = -1;

        // Current preset is at end of array, go back to beginning
        if (matches.length - 1 == index)
          id = matches[0].id;
        // Go to next element in array
        else
          id = matches[index + 1].id;

        // When button is clicked, load the next preset and render it
        Button.on('click', () => {
          removeSystemPreset();
          getPreset(id)
        });
      }
      else {
        Button.element.disabled = true;
      }
    }

  }

};