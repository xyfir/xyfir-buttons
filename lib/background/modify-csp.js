const header = 'content-security-policy';

/**
 * Modifies a site's content security policy to allow the use of eval().
 * @module lib/background/modify-csp
 * @param {object} details - Object passed from the 
 * webRequest.onHeadersReceived.addListener() callback.
 * @returns {webRequest.BlockingResponse} An object containing the modified
 * responseHeaders array.
 */
export default function(details) {

  if (details.tabId == -1)
    return { responseHeaders: details.responseHeaders };

  details.responseHeaders = details.responseHeaders.map(h => {
    if (header == h.name.toLowerCase()) {
      // CSP already allows eval
      if (h.value.indexOf(`'unsafe-eval'`) > -1)
        h.value = h.value;
      // CSP has script-src, but does not allow eval
      else if (h.value.indexOf('script-src') > -1)
        h.value = h.value.replace('script-src', `script-src 'unsafe-eval'`)
      // CSP does not have script-src
      else
        h.value += `; script-src 'unsafe-eval'`;
    }

    return h;
  });

  return { responseHeaders: details.responseHeaders };

}