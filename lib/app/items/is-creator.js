/**
 * Determines if the user is the creator of a button or preset.
 * @module lib/app/items/is-creator
 * @param {number|object} creator - A user id or an object with an `id`
 * property which is a user id.
 * @param {object} storage - The extension's storage object.
 * @param {string} type - The type of item: "preset|button".
 * @param {number} id - The item's id.
 * @returns {boolean}
 */
export default function(creator, storage, type, id) {

  creator = typeof creator == 'object' ? creator.id : creator;

  // If user is anonymous, assume they are creator if they have a mod key
  if (storage.account.uid == 0)
    return !!storage.modkeys[type + 's'][id];
  // If user is logged in, their uid must match the item's creator id
  else
    return creator == storage.account.uid;

}