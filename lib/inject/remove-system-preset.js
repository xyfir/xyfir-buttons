/**
 * Removes the system preset and its buttons and returns visibility to the
 * original .xyfir-buttons-container.
 * @module lib/inject/remove-system-preset
 */
export default function() {

  Object.keys(window._xyb_.system.buttons).forEach(id => {
    window._xyb_.system.buttons[id].destroy();
    delete window._xyb_.buttons[id];
  });
  
  document.querySelector('.xyfir-buttons-container.system').remove();
  
  document.querySelector('.xyfir-buttons-container').style.display = 'initial';

}