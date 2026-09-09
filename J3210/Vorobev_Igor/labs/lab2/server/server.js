const jsonServer = require('json-server');

const app = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

app.use(middlewares);

app.db = router.db;

app.use(router);

app.listen(3001, () => {
  console.log('JSON Server запущен: http://localhost:3001');
});