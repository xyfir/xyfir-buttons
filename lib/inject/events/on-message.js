/**
 * @param {MessageEvent} event
 * @module lib/inject/events/on-message
 */
export default function(event) {

  // Only accept messages from content-script
  if (event.data.from != 'content-script.js')
    return;
  
  // Event is a response to an event sent from this script
  // Call the transaction's callback
  if (window.transactions[event.data.transaction]) {
    window.transactions[event.data.transaction](event, event.data);
    delete window.transactions[event.data.transaction];
  }
  // Event is not a response, but a new event from content script
  else {
    switch (event.data.action) {

    }
  }

}