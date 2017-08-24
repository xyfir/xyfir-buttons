import Fuse from 'fuse.js';

/**
 * Returns matching presets or buttons.
 * @param {object[]} items
 * @param {string} query
 * @return {object[]}
 */
export default function(items, query) {

  if (!query) return items;

  const options = {
    shouldSort: true,
    threshold: 0.3,
    keys: [
      { name: 'name', weight: 0.5 },
      { name: 'domains', weight: 0.3 },
      { name: 'description', weight: 0.2 }
    ]
  };

  const fuse = new Fuse(items, options);

  return fuse.search(query.toLowerCase());

}