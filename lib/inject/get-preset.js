import generateTransaction from 'lib/shared/util/generate-transaction';
import renderPreset from 'lib/inject/render-preset';

/**
 * Requests a preset and its full data from content-script.js. Requested preset
 * is then rendered via lib/inject/render-preset.
 * @module lib/inject/get-preset
 * @param {number} [preset=0] - The preset to get the data for. If not provided
 * content-script.js will return the first preset that matches the page url.
 */
export default function(preset = 0) {
  
  const transaction = generateTransaction(window._xyb_, renderPreset);

  window.postMessage({
    from: 'inject.js', transaction, action: 'get-active-preset',
    usePreset: preset
  }, location.href);

}