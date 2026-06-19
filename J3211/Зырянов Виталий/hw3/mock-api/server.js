const crypto = require("node:crypto");
const path = require("node:path");
const jsonServer = require("json-server");

const server = jsonServer.create();
const dbPath = path.join(__dirname, "db.json");
const router = jsonServer.router(dbPath);
const middlewares = jsonServer.defaults();

const tokens = new Map();
const PORT = process.env.PORT || 3000;

server.use(middlewares);
server.use(jsonServer.bodyParser);

function sanitizeUser(user) {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
}

function parseBearerToken(req) {
  const header = req.get("authorization");
  if (!header) return null;
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) return null;
  return token;
}

function getCurrentUser(req) {
  const token = parseBearerToken(req);
  if (!token || !tokens.has(token)) return null;
  const userId = tokens.get(token);
  return router.db.get("users").find({ id: userId }).value() || null;
}

function requireAuth(req, res, next) {
  const user = getCurrentUser(req);
  if (!user) {
    res.status(401).json({ message: "Требуется авторизация" });
    return;
  }

  req.user = user;
  next();
}

function createToken() {
  return crypto.randomBytes(24).toString("hex");
}

server.post("/register", (req, res) => {
  const {
    firstName = "",
    lastName = "",
    username = "",
    email = "",
    password = "",
    role = "Студент",
    bio = ""
  } = req.body || {};

  if (!firstName.trim() || !lastName.trim() || !username.trim() || !email.trim() || !password.trim()) {
    res.status(400).json({ message: "Заполните все обязательные поля" });
    return;
  }

  const users = router.db.get("users");
  const emailExists = users.find({ email: email.trim().toLowerCase() }).value();
  const usernameExists = users.find({ username: username.trim() }).value();

  if (emailExists || usernameExists) {
    res.status(409).json({ message: "Пользователь с таким email или логином уже существует" });
    return;
  }

  const nextId = Number(users.map("id").max().value() || 0) + 1;
  const createdUser = {
    id: nextId,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    username: username.trim(),
    email: email.trim().toLowerCase(),
    password: password.trim(),
    role: role.trim() || "Студент",
    bio: bio.trim(),
    publicRepos: 0,
    stars: 0
  };

  users.push(createdUser).write();

  const token = createToken();
  tokens.set(token, createdUser.id);

  res.status(201).json({
    token,
    user: sanitizeUser(createdUser)
  });
});

server.post("/login", (req, res) => {
  const { login = "", password = "" } = req.body || {};

  if (!login.trim() || !password.trim()) {
    res.status(400).json({ message: "Введите логин/email и пароль" });
    return;
  }

  const normalizedLogin = login.trim().toLowerCase();
  const user = router
    .db
    .get("users")
    .find(
      (candidate) =>
        (candidate.email && candidate.email.toLowerCase() === normalizedLogin) ||
        (candidate.username && candidate.username.toLowerCase() === normalizedLogin)
    )
    .value();

  if (!user || user.password !== password.trim()) {
    res.status(401).json({ message: "Неверный логин/email или пароль" });
    return;
  }

  const token = createToken();
  tokens.set(token, user.id);

  res.json({
    token,
    user: sanitizeUser(user)
  });
});

server.post("/logout", requireAuth, (req, res) => {
  const token = parseBearerToken(req);
  if (token) tokens.delete(token);
  res.status(204).send();
});

server.get("/me", requireAuth, (req, res) => {
  res.json(sanitizeUser(req.user));
});

server.get("/my/models", requireAuth, (req, res) => {
  const models = router.db.get("models").filter({ ownerId: req.user.id }).value();
  res.json(models);
});

server.get("/my/datasets", requireAuth, (req, res) => {
  const datasets = router.db.get("datasets").filter({ ownerId: req.user.id }).value();
  res.json(datasets);
});

server.get("/my/subscriptions", requireAuth, (req, res) => {
  const subscriptions = router.db.get("subscriptions").filter({ ownerId: req.user.id }).value();
  res.json(subscriptions);
});

server.use((req, res, next) => {
  if (req.path.startsWith("/users")) {
    res.status(403).json({ message: "Прямой доступ к пользователям запрещён" });
    return;
  }

  next();
});

server.use(router);

server.listen(PORT, () => {
  console.log(`Mock API is running at http://localhost:${PORT}`);
});
