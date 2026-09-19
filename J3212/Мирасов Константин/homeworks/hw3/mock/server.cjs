const { copyFileSync, constants } = require('node:fs');
const path = require('node:path');
const jsonServer = require('json-server');
const auth = require('json-server-auth');
const cors = require('cors');
const access = require('./access.cjs');

function initializeDatabase() {
  try {
    copyFileSync(path.join(__dirname, 'seed.json'), databasePath, constants.COPYFILE_EXCL);
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

function handleRequestError(error, request, response, next) {
  response
    .status(error.status === 400 ? 400 : 500)
    .json({ message: 'Request could not be processed.' });
}

const databasePath = process.env.AXON_DB_PATH
  ? path.resolve(process.env.AXON_DB_PATH)
  : path.join(__dirname, 'db.json');
const port = Number(process.env.AXON_PORT ?? 3001);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('AXON_PORT must be an integer between 1 and 65535.');
}

initializeDatabase();

const app = jsonServer.create();
const router = jsonServer.router(databasePath);
app.db = router.db;

app.use(
  cors({
    origin: ['http://127.0.0.1:8080', 'http://localhost:8080'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(jsonServer.bodyParser);
app.use(access);
app.use(auth.rewriter({ resources: 644, stars: 644, subscriptions: 644, discussions: 644 }));
app.use(auth);
app.use(router);

app.use(handleRequestError);

const server = app.listen(port, '127.0.0.1', () => {
  console.log(`AxonHub mock: http://127.0.0.1:${port}/resources`);
});
server.on('error', (error) => {
  console.error(`Mock server failed: ${error.message}`);
  process.exitCode = 1;
});
