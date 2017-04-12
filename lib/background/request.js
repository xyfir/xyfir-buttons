import request from 'superagent';

/**
 * Builds a request via superagent using data relayed via content-script and
 * responds with the error and/or request response.
 * @param {object} data
 * @param {function} respond
 */
export default function (data, respond) {

  const ignore = ['from', 'action', 'transaction'];
  let req;
  
  Object.keys(data).forEach(key => {
    if (ignore.indexOf(key) > -1)
      return;
    else if (req)
      req[key].apply(req, data[key]);
    // Initialization must be .get|post|...(url)
    else
      req = request[key](data[key][0]);
  });

  req && req.end((error, response) => {
    respond({ error: error && error.toString(), response });
  });

}