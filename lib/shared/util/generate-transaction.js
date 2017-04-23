/**
 * Creates a new property in a transactions object with the key a random string
 * and the value a callback function to complete the transaction.
 * @module lib/shared/util/generate-transaction
 * @param {object} obj - The object that contains a transactions object.
 * @param {function} cb - A callback function that will be called when this
 * transaction receives a response.
 * @returns {string} The unique id for the transaction to be sent with the
 * event so it can be returned on the response event.
 */
export default function(obj, cb) {

  let transaction = Math.random().toString();

  // Make sure transaction doesn't already exist
  while (obj.transactions[transaction] !== undefined)
    transaction = Math.random().toString();
  
  obj.transactions[transaction] = cb;

  return transaction;

}