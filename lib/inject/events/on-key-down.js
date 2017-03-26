/**
 * Listens for keydown events on the document and acts on events meants for
 * xyButtons.
 * SHIFT + ALT + X puts xyButtons into listener mode. The next key entered will
 * then be checked against accepted keys, and the appropriate action will be
 * carried out.
 * @module lib/inject/events/on-key-down
 * @param {KeyboardEvent} event
 */
export default function(event) {

  if (event.altKey && event.shiftKey && event.key == 'X') {
    window._xyb_.system.awaitingKeyCommand = true;
  }
  else if (window._xyb_.system.awaitingKeyCommand) {
    window._xyb_.system.awaitingKeyCommand = false;

    switch (event.key) {
      case 's':
        (() => {
          const container =
            document.querySelector('.xybuttons.system') ||
            document.querySelector('.xybuttons');

          if (container.style.display == 'none')
            container.style.display = 'initial';
          else
            container.style.display = 'none';

            window.postMessage({
              from: 'inject.js', action: 'set-preset-visibility',
              hidden: container.style.display == 'none'
            }, location.href);
        })();
        break;
    }
  }

}