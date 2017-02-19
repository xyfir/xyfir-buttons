import nextPresetButton from 'lib/buttons/next-preset';
import Button from 'lib/inject/Button';

/**
 * Renders the preset and its buttons at data.preset to the page.
 * @module lib/inject/render-preset
 * @param {MessageEvent} event - An event object emitted from a 'message' event sent
 * from content-script.js.
 * @param {object} data - An alias for event.data.
 */
module.exports = function(event, data) {

  window._xyb_.presets = {
    current: data.preset, matches: data.matches
  };
  
  let container = document.querySelector('.xyfir-buttons-container');

  // Insert container into page for the first time
  if (container == null) {
    container = document.createElement('div');
    container.className = 'xyfir-buttons-container';
    document.documentElement.appendChild(container);
  }
  // Remove the buttons from the previous preset from the page
  else {
    Object.keys(window._xyb_.buttons).forEach(id => {
      window._xyb_.buttons[id].destroy();
      delete window._xyb_.buttons[id];
    });
  }

  // Add 'next preset' button
  if (data.matches.length > 1) {
    // Get the current preset's index in the matches array
    const index = data.matches.findIndex(p => p.id == data.preset.id);
    let id = -1;

    // Current preset is at end of array, go back to beginning
    if (data.matches.length - 1 == index)
      id = data.matches[0].id;
    // Go to next element in array
    else
      id = data.matches[index + 1].id;

    data.preset.buttons.push(nextPresetButton(id));
  }

  data.preset.buttons.forEach(button => {
    // Even though the preset matches the current url, the button must also
    // match before being rendered
    if (!RegExp(button.urlMatch).test(location)) return;

    // Create instance of Button
    window._xyb_.buttons[button.id] = new Button(button, container);
  });

}