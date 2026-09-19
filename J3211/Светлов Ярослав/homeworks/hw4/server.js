const fs = require('node:fs');
const path = require('node:path');
const jsonServer = require('json-server');
const auth = require('json-server-auth');

function createApp(database) {
  const app = jsonServer.create();
  const router = jsonServer.router(database);
  app.db = router.db;
  app.use(jsonServer.defaults({ static: path.join(__dirname, 'public'), logger: false }));
  app.get('/vendor/bootstrap.css', (_req, res) => {
    res.sendFile(require.resolve('bootstrap/dist/css/bootstrap.min.css'));
  });
  app.get('/vendor/chart.js', (_req, res) => {
    res.sendFile(path.join(path.dirname(require.resolve('chart.js')), 'chart.umd.js'));
  });
  app.use(jsonServer.bodyParser);

  // Не открываем служебные /db и /666/* в обход правил доступа.
  app.use((req, res, next) => {
    const parts = req.path.split('/').filter(Boolean);
    const [resource, id] = parts;
    if (parts.length === 1 && ['login', 'register'].includes(resource) && req.method === 'POST') {
      const { email, password, name } = req.body;
      if (typeof email !== 'string' || typeof password !== 'string' ||
          (resource === 'register' && (typeof name !== 'string' || !name.trim()))) {
        return res.status(400).json('Заполните имя, email и пароль.');
      }
      req.body = { email: email.trim().toLowerCase(), password };
      if (resource === 'register') req.body.name = name.trim();
      return next();
    }
    const readable = ['experiments', 'models'].includes(resource) || (resource === 'users' && id);
    const writable = resource === 'models' && ((!id && req.method === 'POST') || (id && req.method === 'PATCH'));
    if (parts.length > 2 || !((readable && req.method === 'GET') || writable)) {
      return res.status(404).json('Маршрут не найден.');
    }
    const queryKeys = ['date', 'accuracy_gte', 'latencyMs_lte', 'q', 'userId', '_sort', '_order'];
    if (Object.keys(req.query).some(key => !queryKeys.includes(key))) {
      return res.status(400).json('Неподдерживаемый параметр запроса.');
    }
    if (id && !app.db.get(resource).find(item => String(item.id) === id).value()) {
      return res.status(404).json('Запись не найдена.');
    }
    next();
  });
  app.use(auth.rewriter({ users: 600, experiments: 440, models: 640 }));
  app.use(auth);

  app.get('/users/:id', (req, res) => {
    const { password, ...user } = app.db.get('users').find({ id: Number(req.params.id) }).value();
    res.json(user);
  });
  app.post('/models', (req, res, next) => {
    const { name, version, linkedExperimentId } = req.body;
    const userId = Number(req.claims.sub);
    if (typeof name !== 'string' || !name.trim() || typeof version !== 'string' || !/^\d+\.\d+\.\d+$/.test(version)) {
      return res.status(400).json('Введите название и версию в формате 1.0.0.');
    }
    const experiment = app.db.get('experiments').find({ id: linkedExperimentId, userId }).value();
    if (!experiment) return res.status(400).json('Выберите свой эксперимент.');
    const exists = app.db.get('models').find(model => model.userId === userId &&
      model.name.toLowerCase() === name.trim().toLowerCase() && model.version === version).value();
    if (exists) return res.status(409).json('Такая версия модели уже существует.');
    req.body = { name: name.trim(), version, linkedExperimentId, userId, stage: 'Staging' };
    next();
  });
  app.patch('/models/:id', (req, res, next) => {
    if (Object.keys(req.body).some(key => key !== 'stage') ||
        !['Staging', 'Production', 'Archived'].includes(req.body.stage)) {
      return res.status(400).json('Можно изменить только статус: Staging, Production или Archived.');
    }
    next();
  });
  app.use(router);
  return app;
}

if (require.main === module) {
  const database = process.env.DB_FILE || path.join(__dirname, 'db.local.json');
  if (!fs.existsSync(database)) fs.copyFileSync(path.join(__dirname, 'db.json'), database);
  const port = Number(process.env.PORT) || 3004;
  createApp(database).listen(port, '127.0.0.1', () => {
    console.log(`Nexus ML: http://localhost:${port}`);
  });
}

module.exports = { createApp };
