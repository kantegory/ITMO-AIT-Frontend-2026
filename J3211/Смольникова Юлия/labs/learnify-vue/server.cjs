const jsonServer = require('json-server');
const auth = require('json-server-auth');

const app = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

app.db = router.db;

const rules = auth.rewriter({
  users: 600,
  courses: 632,
  enrollments: 630,
  certificates: 620
});

app.use(middlewares);
app.use(rules);
app.use(auth);
app.use(router);

app.listen(3000, () => {
  console.log('JSON Server with Auth is running on http://localhost:3000');
});