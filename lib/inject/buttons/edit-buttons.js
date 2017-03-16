/**
 * Opens a new tab to where user can modify button placement, sizes, etc.
 */
export default  {

  id: 'edit-buttons', urlMatch: '.*',
    
  size: '3em', tooltip: 'Edit buttons', position: '85%,1%',
  content: 'Edit', styles: '{}',
  
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