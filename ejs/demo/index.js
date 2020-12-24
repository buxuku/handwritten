const ejs = require('../index');
const path = require('path');

const render = async () => {
  const data = { dirs: [{ pathname: 'public/index.js', name: 'index.js' }, { pathname: 'public/index.css', name: 'index.css' }] };
  const content = await ejs.renderFile(
    path.resolve(__dirname, 'template.html'),
    data,
  );
  console.log(content)
};

render();