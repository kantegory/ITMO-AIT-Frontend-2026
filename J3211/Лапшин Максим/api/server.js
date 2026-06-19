const jsonServer = require('json-server');
const path = require('path');

const app = jsonServer.create();
const router = jsonServer.router('api/db.json');

// Папка public для статики
const publicPath = path.join(__dirname, '..', 'public');

// СНАЧАЛА статика
app.use(jsonServer.defaults({
  static: publicPath
}));

// ЗАТЕМ API
app.use(router);

const PORT = 3001;
app.listen(PORT, () => {
  console.log('Server: http://localhost:' + PORT);
  console.log('Public:', publicPath);
});