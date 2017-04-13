export default data =>
`
exports = function(Button) {
  ${data.require.length ?
    `const required = [${data.require.map(r => `'${r}'`).join(', ')}];` :
    'const required = [];'
  }

  Promise.all(
    [Button.storage.get].concat(
      required.map(r => () => Button.require(r))
    )
  )
  .then(res => {
    const script = Button.require('userscript.js');
    let storage = res[0];

    if (storage._isActive) script(Button, storage);

    Button.on('click', () => {
      storage = Button.storage.set({ _isActive: !storage._isActive });

      if (storage._isActive)
        script(Button, storage);
      else
        location.reload();
    });
  })
  .catch(err => {
    console.log('xyButtons button #' + Button.data.id +  ' error', err);
  });
}
`.trim();