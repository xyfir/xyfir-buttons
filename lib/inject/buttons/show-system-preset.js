import renderSystemPreset from 'lib/inject/render-system-preset';

/**
 * The main system button added to all user presets.
 * When clicked, the active preset is hidden and the system preset and buttons
 * are loaded into a new container.
 */
export default  {

  id: 'show-system-preset', urlMatch: '.*',
    
  size: '2em', tooltip: 'Show system preset', position: '95%,1%',
  content: 'xy', styles: '{}',
  
  script: {
    'main.js': function(Button) {
      Button.on('click', e => renderSystemPreset());
    }
  }

};