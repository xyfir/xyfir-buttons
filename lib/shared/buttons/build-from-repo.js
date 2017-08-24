import request from 'superagent';

/**
 * Validates a Github repo's data and attempts to build a button.
 * @async
 * @param {string} url - The base Github 'contents' API url for the repo.
 * @param {object[]} files - An array of file objects returned from Github.
 * https://developer.github.com/v3/repos/contents/.
 * @returns {object} A button object that contains at least a `script` object.
 */
export default async function(url, files) {

  if (!Array.isArray(files))
    throw 'Could not read repository files';
  else if (!files.find(f => f.name == 'main.js'))
    throw 'Repository does not have a main.js file';
  
  let manifest = files.find(f => f.name == 'xybuttons.manifest.json');
  let download = [];

  // Download and parse xybuttons.manifest.json if available
  if (manifest) {
    manifest = await request.get(url + '/xybuttons.manifest.json');
    manifest = JSON.parse(atob(manifest.body.content));

    // Files that are to be downloaded and included in the button script
    download = manifest.scriptFiles;
  }
  // Build array of files to download
  else {
    download = files
      .filter(f => f.type == 'file')
      .map(f => f.name);
  }

  const script = {};

  // Download files
  for (let file of download) {
    const res = await request.get(url + '/' + file);
    script[file] = atob(res.body.content);
  }

  if (manifest)
    return Object.assign(manifest.button || {}, { script });
  else
    return { script };

};