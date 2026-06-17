const fs = require('fs');
const path = require('path');
const jsonServer = require('json-server');
const auth = require('json-server-auth');

const root = __dirname;
const rules = JSON.parse(fs.readFileSync(path.join(root, 'routes.json'), 'utf8'));

const app = jsonServer.create();
const router = jsonServer.router(path.join(root, 'db.json'));
const middlewares = jsonServer.defaults();

app.db = router.db;

const rewriter = auth.rewriter(rules);

app.use(middlewares);
app.use(rewriter);
if (Array.isArray(auth)) {
  auth.forEach(function (mw) {
    app.use(mw);
  });
} else {
  app.use(auth);
}
app.use(router);

const PORT = process.env.PORT || 3001;
app.listen(PORT, function () {
  console.log('Сервер' + PORT);
  console.log('Остановка: Ctrl+C');
});
