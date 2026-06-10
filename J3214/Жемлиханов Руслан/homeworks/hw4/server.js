const jsonServer = require('json-server');
const auth = require('json-server-auth');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

const rules = auth.rewriter({
  users: 660,
  pipelines: 660,
  pipelineDetails: 660,
  connections: 660,
  variables: 660,
  notifications: 660
});

server.db = router.db;
server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use(rules);
server.use(auth);
server.use(router);

server.listen(3000, () => {
  console.log('JSON Server with auth is running on http://localhost:3000');
});
