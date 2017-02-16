/**
 * Injects inject.js and inject.css into the current page as <script> and
 * <style> elements.
 * @module lib/content-script/inject-files
 */
export default function() {

  const script = document.createElement('script'),
  style = document.createElement('style');

  script.src = chrome.extension.getUrl('inject.js'),
  style.src = chrome.extension.getUrl('inject.css');

  document.documentElement.appendChild(style);
  document.documentElement.appendChild(script);

}