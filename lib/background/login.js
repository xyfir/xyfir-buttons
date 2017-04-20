import request from 'superagent';

// Constants
import { XYBUTTONS_URL } from 'constants/config';

// Modules
import onStart from 'lib/background/on-start';
import canSync from 'lib/shared/can-browser-sync';

/**
 * @param {runtime.MessageSender} sender
 */
export default function(sender) {

  const data = {};

  // Parse query string into object
  sender.url.split('?')[1].split('&').forEach(q => {
    q = q.split('=');
    data[q[0]] = q[1];
  });

  // Redirect tab from Xyfir Buttons homepage to extension
  chrome.tabs.update(
    sender.tab.id, { url: chrome.runtime.getURL('app.html') }
  );

  if (data.xid && data.auth) {
    request
      .post(XYBUTTONS_URL + 'api/users/account/login')
      .send(data)
      .end((err, res) => {
        if (err || res.body.error) return;

        const storage = { account: { accessToken: res.body.accessToken } };

        // Save access token to storage before calling onStart()
        canSync()
          .then(sync => {
            if (sync)
              return chrome.p.storage.sync.set(storage);
            else
              return Promise.resolve();
          })
          .then(() => {
            return chrome.p.storage.local.set(storage);
          })
          .then(() => {
            onStart();
          });
      });
  }

}