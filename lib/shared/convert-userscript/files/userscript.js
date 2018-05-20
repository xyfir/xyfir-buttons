export default data =>
  `
exports = function(_Button, _storage) {


unsafeWindow = window;

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

function GM_xmlhttpRequest(details) {
  const req = Button.request
    [details.method.toLowerCase()](details.url)
    .send(details.data || '')
    .set(details.headers || {});
  
  if (details.user && details.password)
    req.auth(details.user, details.password);
  else if (details.user)
    req.auth(details.user);
  
  req
    .end()
    .then(res => {
      const response = {
        context: details.context || {},
        responseHeaders: res.headers, responseText: req.text,
        status: res.status, statusText: res.statusText, readyState: 4
      };

      details.onload(response);
    })
    .catch(err => (details.onerror || (() => 1))(err));
}

function GM_openInTab(url) {
  return window.open(url);
}

function GM_log(msg) {
  console.log(msg);
}

/* <userscript> */
${data.code}
/* </userscript> */


}
`.trim();
