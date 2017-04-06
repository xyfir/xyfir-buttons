/**
 * Opens a new tab to where user can modify button placement, sizes, etc.
 */
export default  {

  id: 'edit-buttons', urlMatch: '.*',
    
  size: '2em', tooltip: 'Edit buttons in preset', position: '90%,1%',
  content: '%F0%9F%96%8A%EF%B8%8F', styles: '{}',
  
  script: {
    'main.js': function(Button) {
      Button.on('click', e => {
        window.postMessage({
          from: 'inject.js', action: 'open-extension',
          hash: `#/presets/${window._xyb_.presets.current.id}/buttons/place`
        }, location.href);
      });
    }
  }

};