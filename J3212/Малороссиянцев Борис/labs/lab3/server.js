'use strict';
const jsonServer  = require('json-server');
const server      = jsonServer.create();
const router      = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
server.use(middlewares);
server.use(jsonServer.bodyParser);
function makeToken(id, email) {
  return Buffer.from(`${id}:${email}`).toString('base64');
}
function parseToken(token) {
  try {
    const [id, email] = Buffer.from(token, 'base64').toString().split(':');
    return { id: Number(id), email };
  } catch {
    return null;
  }
}
server.post('/register', (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  if (!email || !password || !firstName) {
    return res.status(400).json({ error: 'Заполните все обязательные поля' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Пароль должен быть не менее 8 символов' });
  }
  const db    = router.db;
  const users = db.get('users');
  if (users.find({ email }).value()) {
    return res.status(409).json({ error: 'Пользователь с таким email уже существует' });
  }
  const newUser = {
    id:        Date.now(),
    email:     email.toLowerCase().trim(),
    password,               
    firstName: firstName.trim(),
    lastName:  (lastName || '').trim(),
    createdAt: new Date().toISOString(),
  };
  users.push(newUser).write();
  const token = makeToken(newUser.id, newUser.email);
  return res.status(201).json({
    token,
    user: { id: newUser.id, firstName: newUser.firstName, lastName: newUser.lastName, email: newUser.email },
  });
});
server.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Укажите email и пароль' });
  }
  const db   = router.db;
  const user = db.get('users').find({ email: email.toLowerCase().trim(), password }).value();
  if (!user) {
    return res.status(401).json({ error: 'Неверный email или пароль' });
  }
  const token = makeToken(user.id, user.email);
  return res.json({
    token,
    user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email },
  });
});
const PUBLIC_PATHS = ['/register', '/login'];
server.use((req, res, next) => {
  if (PUBLIC_PATHS.includes(req.path)) return next();
  const authHeader = req.headers['authorization'] || '';
  const token      = authHeader.replace('Bearer ', '').trim();
  if (!token) {
    return res.status(401).json({ error: 'Необходима авторизация' });
  }
  const payload = parseToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Токен недействителен' });
  }
  req.currentUser = payload;
  next();
});
server.use(router);
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`\n✅  Wanderlust JSON Server запущен на http://localhost:${PORT}`);
  console.log(`    POST /register  — регистрация`);
  console.log(`    POST /login     — вход`);
  console.log(`    GET  /notes     — заметки (требует токен)`);
  console.log(`    GET  /trips     — поездки (требует токен)\n`);
});