/**
 * Save button to storage.
 * @param {object} button
 * @return {Promise}
 */
export default function(button) {
  return chrome.p.storage.local.set({ ['button_' + button.id]: button });
}
