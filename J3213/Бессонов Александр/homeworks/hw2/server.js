"use strict";

const path = require("path");
const jsonServer = require("json-server");
const auth = require("json-server-auth");

const server = jsonServer.create();
const databasePath = path.join(__dirname, "db.json");
const router = jsonServer.router(databasePath);
const middlewares = jsonServer.defaults({
  static: __dirname,
  logger: true
});

server.db = router.db;
server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use(auth.rewriter({
  users: 600
}));
server.use(auth);
server.use(router);

const port = 3000;
server.listen(port, () => {
  console.log(`T-Пульс запущен: http://localhost:${port}`);
  console.log(`REST API доступен: http://localhost:${port}/tasks`);
});

