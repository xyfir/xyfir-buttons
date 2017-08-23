import request from 'lib/background/request';

/**
 * Listen for messages sent from content-script.js.
 * @param {object} data 
 * @param {MessageSender} sender 
 * @param {function} respond 
 */
export default function(data, sender, respond) {

  switch (data.action) {
    case 'request':
      request(data, respond);
      break;

    case 'get-tab-id':
      respond(sender.tab.id);
      break;
    
    case 'open-extension':
      chrome.tabs.create({
        url: chrome.runtime.getURL('app.html') + data.hash
      });
      respond();
      break;
    
    default:
      respond();
  }

  return true; // respond() might by async

}