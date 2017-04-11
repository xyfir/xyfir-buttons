import request from 'superagent';

/**
 * Convert a ButtonRequest object sent from inject.js to an actual request sent
 * via superagent.
 * @param {object} data
 * @param {function} respond
 */
export default function (data, respond) {

  try {
    const req = request
      [data.method || 'get'](data.url)
      .redirects(data.redirects || 5)
      .query(data.query || {})
      .field(data.field || {})
      .retry(data.retry || 3)
      .type(data.type || 'json')
      .send(data.send || {})
      .set(data.set || {});
    
    if (data.auth && data.auth.user)
      req.auth(data.auth.user, data.auth.pass || '', data.auth.options || {});
    if (data.accept)
      req.accept(data.accept);
    if (data.timeout)
      req.timeout(data.timeout);
    if (data.responseType)
      req.responseType(data.responseType);

    req.end((error, response) => respond({ error, response }));
  }
  catch (err) {
    respond({ error: err });
  }

}