const fs = require('node:fs');
const path = require('node:path');
const jsonServer = require('json-server');
function createApp(database) {
  const app = jsonServer.create();
  app.use(jsonServer.defaults({ logger: false }));
  app.use(jsonServer.bodyParser);
  app.use((req, res, next) => {
    if (req.path !== '/notes' || !['GET', 'POST'].includes(req.method)) return res.status(404).json('Маршрут не найден.');
    if (req.method === 'POST') {
      const { title, text } = req.body;
      if (typeof title !== 'string' || !title.trim() || title.length > 100 || typeof text !== 'string' || !text.trim() || text.length > 5000) return res.status(400).json('Заполните заголовок и текст заметки.');
      req.body = { title: title.trim(), text: text.trim(), createdAt: new Date().toISOString() };
    }
    next();
  });
  app.use(jsonServer.router(database));
  return app;
}
if (require.main === module) {
  const db = process.env.DB_FILE || path.join(__dirname, 'db.local.json');
  if (!fs.existsSync(db)) fs.copyFileSync(path.join(__dirname, 'db.json'), db);
  createApp(db).listen(3005, '127.0.0.1', () => console.log('Notes API: http://localhost:3005'));
}
module.exports = { createApp };
