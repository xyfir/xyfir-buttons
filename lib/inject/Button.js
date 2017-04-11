import generateTransaction from 'lib/shared/generate-transaction';
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
     * @property {object} A key:value object where the key is the event name
     * and the value is the listener function.
     */
    this.events = {};

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
   * - Remove all of the button's event listeners that where registered with
   * this.on().
   * - The button element is removed from the container element.
   */
  destroy() {
    Object.keys(this.events).forEach(e => {
      this.element.removeEventListener(e, this.events[e], true);
    });

    this.events = {};

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
      top: positions[0], left: positions[1],
      height: this.data.size, width: this.data.size
    };

    // this.data.style is the button's default styling merged with the
    // styling for the button within the preset
    Object.assign(
      this.element.style, this.data.styles, style
    );

    // Set the element's tooltip that shows on hover
    this.element.title = this.data.tooltip;

    this.data.content = decodeURIComponent(this.data.content);

    // Set the element's content
    if (this.data.content.indexOf('data:image/png;base64') == 0)
      this.element.innerHTML = `<img src="${this.data.content}" />`;
    else
      this.element.innerText = this.data.content;

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

      eval(`(function(Button){${
        this.data.script['main.js']
      }})(this);`);
    }
    else {
      this.data.script['main.js'](this);
    }
  }

  /**
   * A simple method for applying event listeners to this.element. Only one
   * event of the same type can exist at one time with this method. Events
   * added to this.element here will automatically be removed when the button
   * instance is destroyed.
   * @param {string} eventName - The event to listen for, like 'click'.
   * @param {function} listener - A function that is called when an event of
   * eventName is emitted.
   */
  on(eventName, listener) {
    if (this.events[eventName]) {
      this.element.removeEventListener(
        eventName, this.events[eventName], true
      );
    }

    this.events[eventName] = listener;
    this.element.addEventListener(eventName, listener, true);
  }

  /**
   * Requires a local script file or a remote file. The page's CSP is (mostly)
   * bypassed.
   * @param {string} resource - Can either be the path and file name of a local
   * 'file' within the script object OR a remote file to be downloaded via
   * this.request().
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
   * // The promise resolves to the element on the element's `onload` event
   * const style = await Button.require('https://site.com/some-css-file.css');
   * 
   * // Files that aren't CSS or JS will have their request response returned
   * // for the user to handle
   * const res = await Button.require('https://site.com/some-file.txt');
   */
  require(resource, asModule = false) {
    let exports = {}, module = { exports: {} };

    // Require a remote resource
    if (/^https?:\/\//.test(resource)) {
      return new Promise((resolve, reject) => {
        this.request({ method: 'get', url: resource })
          .then(res => {
            const ext = resource.split('.').slice(-1)[0];

            switch (ext) {
              case 'js':
                if (!asModule) {
                  exports = module = undefined;
                  eval(res.text);
                  resolve();
                }
                else {
                  eval(res.text);
                  resolve(
                    typeof exports != 'object' || Object.keys(exports).length
                      ? exports : module.exports
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
      if (resource == 'main.js')
        throw 'You can not load main.js';
      else if (this.data.script[resource] == undefined)
        throw 'Could not find file ' + resource;
      else {
        eval(`(function(){${
          this.data.script[resource]
        }})();`);

        return typeof exports != 'object' || Object.keys(exports).length
          ? exports : module.exports;
      }
    }
  }

  load(file) {
    return this.require(file);
  }

  /**
   * Sends request data to content-script.js which is relayed to background.js
   * which then emits the request via superagent and returns the response. Due
   * to the request being made in background.js, the page's CSP is bypassed.
   * Some limitations are present because the data has to be transfered between
   * scripts as text.
   * @param {ButtonRequest} data
   * @returns {Promise} A promise that rejects if there was an error anywhere
   * in the message-passing process or in the request itself; and that resolves
   * to a superagent response object.
   */
  request(data) {
    return new Promise((resolve, reject) => {
      const transaction =
      generateTransaction(window._xyb_, (event, data) => {
        if (data.error)
          reject(data.error);
        else
          resolve(data.response);
      });

      Object.assign(
        data,
        { from: 'inject.js', action: 'request', transaction }
      );

      window.postMessage(data, location.href);
    });
  }

}