import Button from 'lib/inject/Button';

// System buttons
import editButtons from 'lib/inject/buttons/edit-buttons';
import nextPreset from 'lib/inject/buttons/next-preset';
import close from 'lib/inject/buttons/close-system-preset';

/**
 * Hides the active user preset and renders the system preset and its buttons
 * into a new container.
 * @module lib/inject/render-system-preset
 */
export default function() {

  // Hide the current active preset
  document.querySelector('.xybuttons')
    .style.display = 'none';
  
  // Create a new container to render the system buttons to
  const container = document.createElement('div');
  container.className = 'xybuttons system';
  document.documentElement.appendChild(container);
  
  // Render system buttons
  window._xyb_.system.buttons = {
    [close.id]: new Button(close, container),
    [nextPreset.id]: new Button(nextPreset, container),
    [editButtons.id]: new Button(editButtons, container)
  };

}