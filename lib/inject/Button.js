import generateTransaction from 'lib/shared/util/generate-transaction';
import Storage from 'lib/inject/ButtonStorage';

/**
 * Provides the API for a button's script.
 */
export default class Button {
  /**
   * Initializes variables and elements and runs the button's main.js script.
   * @param {object} button - An object that combines the local storage objects
   * of presets_id.buttons[i] and button_id.
   * @param {HTMLDivElement} element - The container DOM element in which the button
   * occupies in the current page.
   */
  constructor(button, container) {
    /**
     * @property {object} The button's full data for the preset.
     */
    this.data = button;

    /**
     * @property {HTMLDivElement} The container element .xybuttons.
     */
    this.container = container;

    /**
     * @property {HTMLButtonElement} The button's DOM element.
     */
    this.element = document.createElement('button');

    /**
     * @property {ButtonStorage} The button's local storage API.
     */
    this.storage = new Storage(button.id);

    this._buildElement();
    this._start();
  }

  /**
   * Destroys the button. The following actions are taken:
   * - The button element is removed from the container element.
   */
  destroy() {
    this.element.remove();
  }

  /**
   * Build's the button's DOM element and adds it as a child to the container.
   * @private
   */
  _buildElement() {
    // Set the element's styling and position on page
    const positions = this.data.position.split(',');
    const style = {
      top: positions[0],
      left: positions[1],
      height: this.data.size,
      width: this.data.size
    };

    // this.data.style is the button's default styling merged with the
    // styling for the button within the preset
    Object.assign(this.element.style, this.data.styles, style);

    // Set the element's tooltip that shows on hover
    this.element.title = this.data.tooltip;

    this.data.content = decodeURIComponent(this.data.content);

    // Set the element's content
    if (this.data.content.indexOf('data:image/png;base64') == 0)
      this.element.innerHTML = `<img src="${this.data.content}" />`;
    else this.element.innerText = this.data.content;

    // Add the button to its container
    this.container.appendChild(this.element);
  }

  /**
   * Parses the script object if it's a string and starts the button's script
   * by calling this.data.script['main.js'].
   * @private
   */
  _start() {
    // Run the button's main.js script and pass its instance of Button
    // System scripts do not need to be parsed or eval()'d.
    if (typeof this.data.script == 'string') {
      this.data.script = JSON.parse(this.data.script);

      eval(`(function(Button){${this.data.script['main.js']}})(this);`);
    } else {
      this.data.script['main.js'](this);
    }
  }

  /**
   * A shortcut for `this.element.addEventListener(...)`. May also in the
   * future give the ability to listen for events emitted by this Button
   * instance (as well as the actual button element itself).
   */
  on() {
    this.element.addEventListener.apply(this.element, arguments);
  }

  /**
   * Requires a local script file or a remote file. The page's CSP is (mostly)
   * bypassed.
   * @param {string} resource - Can either be the path and file name of a local
   * 'file' within the script object OR a remote file to be downloaded via
   * this.request.
   * @param {boolean} [asModule] - Only has an affect when the resource being
   * required is a remote JavaScript file. If true, `exports` and
   * `module.exports` objects are made available for the loaded script to use.
   * Whichever variable was modified is then returned via the promise's resolve
   * with a default of an empty object if the script doesn't use the variables.
   * @returns {Promise|any} Returns a promise if a remote file is being loaded.
   * Otherwise the result of the eval()'d local 'file' is returned.
   * @example
   * // Load a local file that is part of the button's script
   * const someFunction = Button.require('path/to/local-file.js');
   * const someObject = Button.require('config.js');
   *
   * // jQuery is made global
   * await Button.require('https://code.jquery.com/jquery-X.X.X.min.js');
   *
   * // jQuery is now only accessible via this `$` variable.
   * const $ = await Button.require(
   *  'https://code.jquery.com/jquery-X.X.X.min.js',
   *  true // Load file as module
   * );
   *
   * // CSS is inserted into the page in a <style> element if page's CSP allows
   * // The promise resolves to the element after the element's `onload` event
   * const style = await Button.require('https://site.com/some-css-file.css');
   *
   * // Files that aren't CSS or JS will have their request response returned
   * // for the user to handle
   * // The same as doing `res = await Button.request.get(url).end()`
   * const res = await Button.require('https://site.com/some-file.txt');
   */
  require(resource, asModule = false) {
    let exports = {},
      module = { exports: {} };

    // Require a remote resource
    if (/^https?:\/\//.test(resource)) {
      return new Promise((resolve, reject) => {
        this.request
          .get(resource)
          .end()
          .then(res => {
            const ext = resource.split('.').slice(-1)[0];

            switch (ext) {
              case 'js':
                if (!asModule) {
                  exports = module = undefined;
                  eval(res.text);
                  resolve();
                } else {
                  eval(res.text);
                  resolve(
                    typeof exports != 'object' || Object.keys(exports).length
                      ? exports
                      : module.exports
                  );
                }
                break;

              case 'css':
                const el = document.createElement('style');
                el.onload = () => resolve(el);
                el.innerHTML = res.text;
                document.body.appendChild(el);
                break;

              default:
                resolve(res);
            }
          })
          .catch(err => {
            reject('Loading required resource failed: ' + err);
          });
      });
    }
    // Require a local script 'file' within this.data.script.
    else {
      if (resource == 'main.js') throw 'You can not load main.js';
      else if (this.data.script[resource] == undefined)
        throw 'Could not find file ' + resource;
      else {
        eval(`(function(){${this.data.script[resource]}})();`);

        return typeof exports != 'object' || Object.keys(exports).length
          ? exports
          : module.exports;
      }
    }
  }

  /**
   * An imitation of the superagent interface with a few notable differences.
   * @returns {Proxy} A proxy that captures all methods and the arguments
   * passed to them and stores that in a data object which will be sent to
   * background.js to be converted to a superagent request when .end() is
   * called on the proxy. Calling .end() will return a promise that resolves to
   * the superagent response object and rejects with either the superagent
   * error or an error emitted anywhere along the transfer process.
   */
  get request() {
    const data = {};

    const proxy = new Proxy(data, {
      get(target, prop) {
        if (prop == 'end') {
          return () =>
            new Promise((resolve, reject) => {
              const transaction = generateTransaction(
                window._xyb_,
                (event, res) => {
                  if (res.error) reject(res.error);
                  else resolve(res.response);
                }
              );

              Object.assign(data, {
                from: 'inject.js',
                action: 'request',
                transaction
              });

              window.postMessage(data, location.href);
            });
        } else {
          return function() {
            data[prop] = Array.from(arguments);
            return proxy;
          };
        }
      }
    });

    return proxy;
  }
}
