const jsonServer = require('json-server');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults({ static: __dirname });

const SECRET_KEY = 'minion-courses-secret-2026';
const TOKEN_EXPIRY = '24h';

server.use(middlewares);
server.use(jsonServer.bodyParser);

// ─── CORS ────────────────────────────────────────────────────────────────────
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

// ─── Helpers ─────────────────────────────────────────────────────────────────
function createToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email, name: user.name, role: user.role },
        SECRET_KEY,
        { expiresIn: TOKEN_EXPIRY }
    );
}

function verifyToken(req) {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return null;
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch {
        return null;
    }
}

function getDb() {
    return router.db.getState();
}

// ─── POST /register ───────────────────────────────────────────────────────────
server.post('/register', (req, res) => {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({ error: 'Заполните все обязательные поля' });
    }

    const db = getDb();
    const existing = db.users.find(u => u.email === email);
    if (existing) {
        return res.status(409).json({ error: 'Пользователь с таким email уже существует' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = {
        id: Date.now(),
        email,
        password: hashedPassword,
        name,
        role: role || 'student',
        avatar: 'images/avatar.jpg',
        enrolledCourses: [],
        progress: {}
    };

    router.db.get('users').push(newUser).write();

    const token = createToken(newUser);
    const { password: _, ...userWithoutPassword } = newUser;

    return res.status(201).json({ token, user: userWithoutPassword });
});

// ─── POST /login ──────────────────────────────────────────────────────────────
server.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Введите email и пароль' });
    }

    const db = getDb();
    const user = db.users.find(u => u.email === email);

    if (!user) {
        return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    // Поддержка как bcrypt-хешей, так и plain-text паролей (для тестовых данных)
    const passwordMatch = user.password.startsWith('$2')
        ? bcrypt.compareSync(password, user.password)
        : user.password === password;

    if (!passwordMatch) {
        return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const token = createToken(user);
    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({ token, user: userWithoutPassword });
});

// ─── GET /me ──────────────────────────────────────────────────────────────────
server.get('/me', (req, res) => {
    const payload = verifyToken(req);
    if (!payload) {
        return res.status(401).json({ error: 'Не авторизован' });
    }

    const db = getDb();
    const user = db.users.find(u => u.id === payload.id);
    if (!user) {
        return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json(userWithoutPassword);
});

// ─── GET /my-enrollments ──────────────────────────────────────────────────────
server.get('/my-enrollments', (req, res) => {
    const payload = verifyToken(req);
    if (!payload) {
        return res.status(401).json({ error: 'Не авторизован' });
    }

    const db = getDb();
    const enrollments = db.enrollments.filter(e => e.userId === payload.id);

    // Обогащаем данными курса
    const enriched = enrollments.map(e => {
        const course = db.courses.find(c => c.id === e.courseId);
        return { ...e, course };
    });

    return res.status(200).json(enriched);
});

// ─── POST /enroll ─────────────────────────────────────────────────────────────
server.post('/enroll', (req, res) => {
    const payload = verifyToken(req);
    if (!payload) {
        return res.status(401).json({ error: 'Не авторизован' });
    }

    const { courseId } = req.body;
    if (!courseId) {
        return res.status(400).json({ error: 'Укажите courseId' });
    }

    const db = getDb();
    const existing = db.enrollments.find(e => e.userId === payload.id && e.courseId === courseId);
    if (existing) {
        return res.status(409).json({ error: 'Вы уже записаны на этот курс' });
    }

    const newEnrollment = {
        id: Date.now(),
        userId: payload.id,
        courseId,
        progress: 0,
        enrolledAt: new Date().toISOString().split('T')[0]
    };

    router.db.get('enrollments').push(newEnrollment).write();
    return res.status(201).json(newEnrollment);
});

// ─── Защищённые маршруты (только для авторизованных) ─────────────────────────
const PROTECTED_ROUTES = ['/enrollments', '/certificates'];

server.use((req, res, next) => {
    const isProtected = PROTECTED_ROUTES.some(r => req.path.startsWith(r));
    if (isProtected && req.method !== 'GET') {
        const payload = verifyToken(req);
        if (!payload) {
            return res.status(401).json({ error: 'Не авторизован' });
        }
    }
    next();
});

// ─── Основной роутер JSON Server ──────────────────────────────────────────────
server.use(router);

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`\n🚀 Minion Courses API запущен на http://localhost:${PORT}`);
    console.log(`📚 Курсы:        GET  http://localhost:${PORT}/courses`);
    console.log(`🔐 Регистрация:  POST http://localhost:${PORT}/register`);
    console.log(`🔑 Вход:         POST http://localhost:${PORT}/login`);
    console.log(`👤 Профиль:      GET  http://localhost:${PORT}/me`);
    console.log(`📋 Мои курсы:    GET  http://localhost:${PORT}/my-enrollments\n`);
});
