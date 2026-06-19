const jsonServer = require('json-server');
const app = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

app.use(middlewares);

app.use(jsonServer.bodyParser);

app.post('/register', (req, res) => {
    const db = router.db;
    const users = db.get('users').value();
    
    if (users.find(u => u.email === req.body.email)) {
        return res.status(400).json("Email уже занят");
    }

    const newUser = {
        id: Date.now().toString(),
        ...req.body,
        courses: req.body.courses || [],
        certificates: req.body.certificates || []
    };

    db.get('users').push(newUser).write();

    res.status(201).json({ accessToken: `fake-jwt-token-${newUser.id}`, user: newUser });
});

app.post('/login', (req, res) => {
    const db = router.db;
    const { email, password } = req.body;
    
    const user = db.get('users').find({ email, password }).value();

    if (!user) {
        return res.status(400).json("Неверный email или пароль");
    }

    res.status(200).json({ accessToken: `fake-jwt-token-${user.id}`, user });
});

app.use(router);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`============================================`);
  console.log(`СЕРВЕР ЗАПУЩЕН! http://localhost:${PORT}`);
  console.log(`============================================`);
});