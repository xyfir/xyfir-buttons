/**
 * Validates a Github Gist's data and attempts to build a button script.
 * @param {object} gist - The object returned from Github.
 * https://developer.github.com/v3/gists/#get-a-single-gist
 * @returns {object} A button script.
 */
export default function(gist) {
  if (!gist.id) throw 'Invalid script repository link';
  if (gist.truncated) throw 'Repository is too large';
  if (!gist.files['main.js'] || !gist.files['main.js'].content)
    throw 'Repository must have a non-empty main.js file';

  const script = {};

  Object.keys(gist.files).forEach(file => {
    if (gist.files[file].truncated) throw 'Repository is too large';

    script[file] = gist.files[file].content;
  });

  return script;
}
