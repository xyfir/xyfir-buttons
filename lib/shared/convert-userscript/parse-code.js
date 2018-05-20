import parseMatchExpression from './parse-match-expression';
import convertUserscript from 'lib/shared/convert-userscript/files/';

/**
 * Contains data parsed from the userscript and its metadata comment block.
 * @typedef {Object} ParsedUserScript
 * @property {string} name
 * @property {string} description
 * @property {string} urlMatch
 * @property {string} tooltip
 * @property {string} content
 * @property {object|string} script
 * @property {string} runAt
 * @property {string} code
 * @property {string[]} exclude
 */

/**
 * Parse a userscript into an object.
 * @module lib/shared/convert-userscript/parse-code
 * @param {string} code - The userscript to parse.
 * @returns {ParsedUserScript}
 */
export default function(code) {
  let meta = code.split('\n');

  if (meta.indexOf('// ==/UserScript==') == -1) return false;

  // Remove metadata block from code
  code = code.substr(code.indexOf('// ==/UserScript==') + 18).trim();

  // Convert metadata code block to an array of objects
  meta = meta
    .slice(
      meta.indexOf('// ==UserScript==') + 1,
      meta.indexOf('// ==/UserScript==')
    )
    .map(md => md.match(/\/\/ @([\w:-]{1,})\s+(.+)/))
    .map(md => Object({ key: md[1], value: md[2] }));

  const data = {
    name: '',
    description: '',
    urlMatch: '',
    content: '',
    script: '',
    code,
    tooltip: '',
    exclude: [],
    runAt: 'document-end',
    require: []
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
        md.value = `|(${parseMatchExpression(md.value)})`;

        if (data.urlMatch.length + md.value.length <= 1000) {
          data.urlMatch = data.urlMatch
            ? data.urlMatch + md.value
            : md.value.substr(1);
        }
        break;

      case 'exclude':
        data.exclude.push(parseMatchExpression(md.value));
        break;

      case 'run-at':
        if (md.value == 'context-menu') return false;
        else data.runAt = md.value;
        break;

      case 'icon':
        if (md.value.indexOf('data:image/png;base64') == 0)
          data.content = md.value;
        break;

      case 'require':
        data.require.push(md.value);
        break;

      case 'resource':
        return false;
    }
  }

  // Make button content an abbreviation of its name
  if (!data.content)
    data.content = data.name.replace(/[^A-Z0-9]/g, '').substr(0, 10);

  data.script = JSON.stringify({
    'main.js': convertUserscript.main(data),
    'start.js': convertUserscript.start(data),
    'userscript.js': convertUserscript.userscript(data)
  });

  delete data.exclude, delete data.runAt, delete data.code, delete data.require;

  return data;
}
