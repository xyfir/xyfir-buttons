import getPreset from 'lib/inject/get-preset';
import Button from 'lib/inject/Button';

/**
 * Called when the url is changed. Updates the preset and its buttons based on
 * the new url.
 * @param {PopStateEvent} event
 * @module lib/inject/events/on-url-change
 */
export default function(event) {
  const { presets, buttons } = window._xyb_;
  const container = document.querySelector('.xybuttons');

  // Active preset still matches the current url
  if (presets.current.id && RegExp(presets.current.urlMatch).test(location)) {
    // Render or destroy buttons in active preset
    presets.current.buttons.forEach(button => {
      const match = RegExp(button.urlMatch).test(location);

      // Button *should* be rendered and *is not*
      if (match && !buttons[button.id]) {
        window._xyb_.buttons[button.id] = new Button(button, container);
      }
      // Button *should not* be rendered and *is*
      else if (!match && buttons[button.id]) {
        buttons[button.id].destroy();
        delete window._xyb_.buttons[button.id];
      }
    });
  }
  // Get new matching presets for current url
  else {
    getPreset();
  }
}
