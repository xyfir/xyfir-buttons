import showSystemPresetButton from 'lib/inject/buttons/show-system-preset';
import Button from 'lib/inject/Button';

/**
 * Renders the preset and its buttons at data.preset to the page.
 * @module lib/inject/render-preset
 * @param {MessageEvent} event - An event object emitted from a 'message' event sent
 * from content-script.js.
 * @param {object} data - An alias for event.data.
 */
export default function(event, data) {

  window._xyb_.presets = {
    current: data.preset, matches: data.matches
  };
  
  let container = document.querySelector('.xybuttons');

  // Insert container into page for the first time
  if (container == null) {
    container = document.createElement('div');
    container.className = 'xybuttons';
    document.documentElement.appendChild(container);
  }
  // Remove the buttons from the previous preset from the page
  else {
    Object.keys(window._xyb_.buttons).forEach(id => {
      window._xyb_.buttons[id].destroy();
      delete window._xyb_.buttons[id];
    });
  }

  if (data.preset.hidden) container.style.display = 'none';

  // Add button to show the system preset
  data.preset.buttons.push(showSystemPresetButton);

  data.preset.buttons.forEach(button => {
    // Even though the preset matches the current url, the button must also
    // match before being rendered
    if (!RegExp(button.urlMatch).test(location)) return;

    // Create instance of Button
    window._xyb_.buttons[button.id] = new Button(button, container);
  });

}