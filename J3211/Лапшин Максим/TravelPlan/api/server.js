const jsonServer = require('json-server');

const app = jsonServer.create();
const router = jsonServer.router('api/db.json');
const middlewares = jsonServer.defaults();

app.use(middlewares);

app.use(router);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Mock API: http://localhost:${PORT}`);
  console.log(`Туры: http://localhost:${PORT}/tours`);
  console.log(`Фильтры: http://localhost:${PORT}/filters`);
});