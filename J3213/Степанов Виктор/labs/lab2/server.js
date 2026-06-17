const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// ===== РЕГИСТРАЦИЯ =====
server.post('/register', (req, res) => {
  const { name, surname, username, email, password } = req.body;
  if (!name || !email || !password || !username) {
    return res.status(400).json({ error: 'Заполните все поля' });
  }
  const db = router.db;
  const exists = db.get('users').find({ email }).value();
  if (exists) {
    return res.status(409).json({ error: 'Email уже занят' });
  }
  const newUser = {
    id: Date.now(),
    name, surname: surname || '', username, email, password,
    organization: '', bio: ''
  };
  db.get('users').push(newUser).write();
  const token = 'token_' + newUser.id + '_' + Date.now();
  db.get('tokens').push({ token, userId: newUser.id }).write();
  res.json({ token, user: { id: newUser.id, username, email, name } });
});

// ===== ВХОД =====
server.post('/login', (req, res) => {
  const { email, password } = req.body;
  const db = router.db;
  const user = db.get('users').find({ email, password }).value();
  if (!user) {
    return res.status(401).json({ error: 'Неверный email или пароль' });
  }
  const token = 'token_' + user.id + '_' + Date.now();
  db.get('tokens').push({ token, userId: user.id }).write();
  res.json({ token, user: { id: user.id, username: user.username, email: user.email, name: user.name } });
});

// ===== ПРОВЕРКА ТОКЕНА =====
server.get('/me', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Не авторизован' });
  const token = auth.replace('Bearer ', '');
  const db = router.db;
  const tokenRecord = db.get('tokens').find({ token }).value();
  if (!tokenRecord) return res.status(401).json({ error: 'Токен недействителен' });
  const user = db.get('users').find({ id: tokenRecord.userId }).value();
  res.json({ id: user.id, username: user.username, email: user.email, name: user.name });
});

// ===== ВЫХОД =====
server.post('/logout', (req, res) => {
  const auth = req.headers.authorization;
  if (auth) {
    const token = auth.replace('Bearer ', '');
    router.db.get('tokens').remove({ token }).write();
  }
  res.json({ message: 'Выход выполнен' });
});

server.use(router);
server.listen(3001, () => {
  console.log('JSON Server запущен на http://localhost:3001');
});
