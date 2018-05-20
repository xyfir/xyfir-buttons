export default data =>
  `
const start = Button.require('start.js');

${
    data.exclude.length
      ? `const exclude = [${data.exclude.map(e => `'${e}'`).join(', ')}];`
      : 'const exclude = [];'
  }

for (let match of exclude) {
  if (new RegExp(match).test(location.href)) {
    delete window._xyb_.buttons[Button.data.id];
    Button.destroy();
    return;
  }
}

const runAt = '${data.runAt}';

if (['document-end', 'document-idle'].indexOf(runAt) > -1) {
  if (/comp|inter/.test(document.readyState)) {
    start(Button);
  }
  else {
    document.addEventListener(
      runAt == 'document-end' ? 'DOMContentLoaded' : 'load',
      () => start(Button), false
    );
  }
}
else {
  start(Button);
}
`.trim();
