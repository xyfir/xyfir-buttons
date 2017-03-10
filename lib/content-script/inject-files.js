/**
 * Injects inject.js and inject.css into the current page as <script> and
 * <style> elements.
 * @module lib/content-script/inject-files
 */
export default function() {
  
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('inject.js');
  
  const link = document.createElement('link');
  link.href = chrome.runtime.getURL('inject.css'),
  link.type = 'text/css',
  link.rel = 'stylesheet';
  
  document.documentElement.appendChild(link);
  document.documentElement.appendChild(script);

}