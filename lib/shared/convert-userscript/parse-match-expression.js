/**
 * Converts a userscript's match, include, or exclude expression to a url
 * match regular expression.
 * @module lib/shared/convert-userscript/parse-match-expression
 * @param {string} match
 * @returns {string} The modified version of the match param.
 */
export default function(match) {
  // Match expression is already a regular expression
  if (match[0] == '/' && match[match.length - 1] == '/') {
    return match.substr(1, match.length - 2);
  }
  // Convert to a regular expression
  else {
    return match
      .replace(/\./g, '\\.')
      .replace(/\*/g, '.*')
      .replace(/\//g, '\\/');
  }
}
