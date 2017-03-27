import React from 'react';
import request from 'superagent';

// react-md
import TextField from 'react-md/lib/TextFields';
import Button from 'react-md/lib/Buttons/Button';
import Paper from 'react-md/lib/Papers';

// Constants
import { XYBUTTONS_URL } from 'constants/config';

// Modules
import downloadButtons from 'lib/shared/buttons/download';

/**
 * Contains data parsed from the userscript and its metadata comment block.
 * @typedef {Object} ParsedUserScript
 * @property {string} name
 * @property {string} description
 * @property {string} urlMatch
 * @property {string} tooltip
 * @property {string} content
 * @property {object|string} script
 * @property {object} grant
 * @property {string} runAt
 * @property {string} code
 * @property {string[]} exclude
 */

export default class CreateButtonFromUserscript extends React.Component {

  constructor(props) {
    super(props);
  }

  /**
   * Call xyButtons API to create button.
   * @param {object} button - The button object passed from
   * CreateOrEditButtonForm's onValidate().
   */
  onCreate() {
    const button = this._parseCode(this.refs.script._field.getValue());

    if (!button) {
      this.props.App._alert('Could not parse or convert userscript');
      return;
    }

    button.isListed = false, button.styles = '{}';

    request
      .post(XYBUTTONS_URL + 'api/buttons')
      .send(button)
      .end((err, res) => {
        if (err || res.body.error) {
          this.props.App._alert(res.body.message);
        }
        else {
          const next = () => location.hash = '#/buttons/' + res.body.id;
          downloadButtons([{ id: res.body.id }]).then(next).catch(next);
        }
      });
  }

  /**
   * Converts a userscript's match, include, or exclude expression to a url
   * match regular expression.
   * @param {string} match
   * @returns {string} The modified version of the match param.
   */
  _parseMatchExpression(match) {
    // Match expression is already a regular expression
    if (match[0] == '/' && match[match.length - 1] == '/') {
      return match.substr(1, match.length - 2);
    }
    // Convert to a regular expression
    else {
      return match
        .replace(/\./g, '\\.')
        .replace(/\*/g, '.*')
        .replace(/\//g, '\\/')
    }
  }

  /**
   * Build the button's script object.
   * @param {ParsedUserScript} data
   * @returns {object} A button script object that contains 'main.js',
   * 'start.js', and 'userscript.js'.
   */
  _buildScript(data) {
    const script = {
      'main.js': `
        const start = Button.load('start.js');
        let storage = {};

        ${data.exclude.length ? `
          const exclude = [${data.exclude.map(e => `'${e}'`).join(', ')}];

          for (let match of exclude) {
            if (match.test(location.href)) {
              delete window._xyb_.buttons[Button.id];
              Button.destroy();
              return;
            }
          }
        ` : ''}

        ${['document-end', 'document-idle'].indexOf(data.runAt) > -1 ? `
          if (/comp|inter/.test(document.readyState)) {
            start(Button);
          }
          else {
            document.addEventListener(
              ${
                data.runAt == 'document-end'
                ? '"DOMContentLoaded"' : '"load"'
              },
              () => start(Button), false
            );
          }
        ` : `
          start(Button);
        `}
      `,

      'start.js': `
        exports = function(Button) {
          const script = Button.load('userscript.js');

          Button.storage.get()
            .then(_storage => {
              storage = _storage;

              if (storage._isActive) script(Button, storage);
            })
            .catch(err => {
              console.log('Error loading button storage');
            })

          Button.on('click', () => {
            storage = Button.storage.set({ _isActive: !storage._isActive });

            if (storage._isActive)
              script(Button, storage);
            else
              location.reload();
          });
        }
      `,
      
      'userscript.js': `
        exports = function(_Button, _storage) {
          window.unsafeWindow = window;

          function GM_getValue(name, def) {
            return _storage[name] || def;
          }

          function GM_setValue(name, value) {
            _storage = _Button.storage.set({ [name]: value });
          }

          function GM_deleteValue(name) {
            _storage = _Button.storage.remove([name]);
          }

          function GM_listValues() {
            return Object.keys(_storage);
          }

          function GM_addStyle(css) {
            const style = document.createElement('style');
            style.innerHTML = css;
            document.head.appendChild(css);
          }

          function GM_setClipboard(text) {
            const el = document.createElement('input');
            el.type = 'text', el.value = text;
            document.body.appendChild(el);

            el.select();
            document.execCommand('copy');

            el.remove();
          }

          function GM_openInTab(url) { return window.open(url); }
          function GM_log(msg) { console.log(msg); }

          ${data.code}
        }
      `
    };

    Object.keys(script).forEach(file => {
      script[file] = script[file]
        .trim()
        .split('\n')
        .map(l => l.replace(/^\s{8}/, ''))
        .join('\n');
    });

    return script;
  }

  /**
   * Parse a userscript into an object.
   * @param {string} code - The userscript to parse.
   * @returns {ParsedUserScript}
   */
  _parseCode(code) {
    let meta = code.split('\n');

    if (meta.indexOf('// ==/UserScript==') == -1) return false;

    // Remove metadata block from code
    code = code.substr(code.indexOf('// ==/UserScript==') + 18).trim();

    // Convert metadata code block to an array of objects
    meta = meta
      .slice(1, meta.indexOf('// ==/UserScript=='))
      .map(md => md.match(/\/\/ @([\w:-]{1,})\s+(.+)/))
      .map(md => Object({ key: md[1], value: md[2] }));
    
    const data = {
      name: '', description: '', urlMatch: '', content: '', script: '', code,
      tooltip: '', exclude: [], grant: {}, runAt: 'document-end'
    };

    for (let md of meta) {
      switch (md.key) {
        case 'name':
          data.name = md.value.substr(0, 100);
          data.tooltip = md.value;
          break;

        case 'description:en':
          data.description = md.value;
          break;
        
        case 'description':
          data.description = !data.description ? md.value : data.description;
          break;
        
        case 'include':
        case 'match':
          md.value = `|(${this._parseMatchExpression(md.value)})`;
            
          if (data.urlMatch.length + md.value.length <= 1000) {
            data.urlMatch = data.urlMatch
              ? data.urlMatch + md.value
              : md.value.substr(1);
          }
          break;

        case 'exclude':
          data.exclude.push(this._parseMatchExpression(md.value));
          break;
        
        case 'run-at':
          if (md.value == 'context-menu')
            return false;
          else
            data.runAt = md.value;
          break;

        case 'grant':
          if (md.value != 'none') data.grant[md.value] = true;
          break;
        
        case 'icon':
          if (md.value.indexOf('data:image/png;base64') == 0)
            data.content = md.value;
          break;

        case 'resource':
        case 'require':
        case 'connect':
          return false;
      }
    }

    // Make button content an abbreviation of its name
    if (!data.content)
      data.content = data.name.replace(/[^A-Z0-9]/g, '').substr(0, 10);
    
    data.script = JSON.stringify(this._buildScript(data));

    delete data.exclude, delete data.grant, delete data.runAt,
    delete data.code;

    return data;
  }

  render() {
    return (
      <Paper zDepth={1} className='create-button-from-userscript'>
        <p>
          Our system will attempt to automatically convert a userscript to a button compatible with Xyfir Buttons. This process is not perfect and the end result may work completely, partially, or not at all.
          <br />
          Clicking the created button will toggle running the original userscript's code when the button is injected into a page.
        </p>

        <TextField
          id='textarea--script'
          ref='script'
          rows={10}
          type='text'
          label='Userscript Code'
          maxRows={10}
          helpText={
            'The entire userscript code, including the required metadata'
            + ' comment block.'
          }
          className='md-cell'
          lineDirection='right'
        />

        <Button
          raised primary
          label='Create Button'
          onClick={() => this.onCreate()}
        />
      </Paper>
    );
  }

}