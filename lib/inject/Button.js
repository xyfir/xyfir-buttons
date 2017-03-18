import Storage from './ButtonStorage';

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

    // Set the element's content
    this.element.innerText = decodeURIComponent(this.data.content);

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

      eval(`
        (function(Button){${
          this.data.script['main.js']
        }})(this);
      `);
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
   * Runs eval() on a 'file' within the object at this.data.script. An error
   * is thrown if the 'file' is not found, or if it is 'main.js'.
   * @param {string} file - A string containing the path and file name of the
   * 'file' to load. Used as a key for this.data.script.
   */
  load(file) {
    if (file == 'main.js')
      throw 'You can not load main.js';
    else if (this.data.script[file] == undefined)
      throw 'Could not find loaded file';
    else
      return eval(this.data.script[file]);
  }

}