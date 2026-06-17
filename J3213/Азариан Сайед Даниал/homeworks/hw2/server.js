const path = require("path");
const jsonServer = require("json-server");

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();

const PORT = Number(process.env.PORT || 3000);

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.get("/kudago/search", async (req, res) => {
  const params = new URLSearchParams({
    lang: String(req.query.lang || "ru"),
    location: String(req.query.location || "msk"),
    page_size: String(req.query.page_size || "10"),
    ctype: String(req.query.ctype || "event"),
  });

  if (isNonEmptyString(req.query.q)) {
    params.set("q", String(req.query.q));
  }

  try {
    const response = await fetch(`https://kudago.com/public-api/v1.4/search/?${params.toString()}`);
    const text = await response.text();

    if (!response.ok) {
      return res.status(response.status).json({
        message: `KudaGo API error: ${response.status}`,
        details: text.slice(0, 300),
      });
    }

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.status(200).send(text);
  } catch (error) {
    return res.status(502).json({
      message: "Не удалось выполнить поиск в KudaGo API.",
      details: error && error.message ? error.message : "Unknown error",
    });
  }
});

server.get("/kudago/events", async (req, res) => {
  const params = new URLSearchParams({
    lang: String(req.query.lang || "ru"),
    location: String(req.query.location || "msk"),
    page_size: String(req.query.page_size || "10"),
    actual_since: String(req.query.actual_since || Math.floor(Date.now() / 1000)),
    order_by: String(req.query.order_by || "-publication_date"),
    fields: String(
      req.query.fields ||
        "id,title,slug,dates,price,is_free,place,categories,images,description,site_url"
    ),
    expand: String(req.query.expand || "place"),
  });

  if (typeof req.query.is_free !== "undefined") {
    params.set("is_free", String(req.query.is_free));
  }
  if (isNonEmptyString(req.query.ids)) {
    params.set("ids", String(req.query.ids));
  }
  if (isNonEmptyString(req.query.q)) {
    params.set("q", String(req.query.q));
  }

  try {
    const response = await fetch(`https://kudago.com/public-api/v1.4/events/?${params.toString()}`);
    const text = await response.text();

    if (!response.ok) {
      return res.status(response.status).json({
        message: `KudaGo API error: ${response.status}`,
        details: text.slice(0, 300),
      });
    }

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.status(200).send(text);
  } catch (error) {
    return res.status(502).json({
      message: "Не удалось получить данные из KudaGo API.",
      details: error && error.message ? error.message : "Unknown error",
    });
  }
});

function sanitizeUser(user) {
  if (!user) return null;

  const { password, ...safeUser } = user;
  return safeUser;
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

server.post("/login", (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  if (!email || !password) {
    return res.status(400).json({ message: "Email и пароль обязательны." });
  }

  const user = router.db
    .get("users")
    .find((item) => item.email.toLowerCase() === email && item.password === password)
    .value();

  if (!user) {
    return res.status(401).json({ message: "Неверный email или пароль." });
  }

  return res.status(200).json({ user: sanitizeUser(user) });
});

server.post("/register", (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const phone = String(req.body.phone || "").trim();
  const password = String(req.body.password || "");
  const accountType = req.body.accountType === "organizer" ? "organizer" : "buyer";

  if (!isNonEmptyString(name)) {
    return res.status(400).json({ message: "Укажите имя." });
  }

  if (!isNonEmptyString(email)) {
    return res.status(400).json({ message: "Укажите email." });
  }

  if (!isNonEmptyString(phone)) {
    return res.status(400).json({ message: "Укажите телефон." });
  }

  if (!isNonEmptyString(password)) {
    return res.status(400).json({ message: "Укажите пароль." });
  }

  const existingUser = router.db
    .get("users")
    .find((item) => item.email.toLowerCase() === email)
    .value();

  if (existingUser) {
    return res.status(409).json({ message: "Пользователь с таким email уже зарегистрирован." });
  }

  const newUser = {
    id: `user_${Date.now()}_${Math.random().toString(16).slice(2, 6)}`,
    name,
    email,
    phone,
    password,
    accountType,
    tickets: [],
    refunds: [],
    organizerEvents: [],
  };

  router.db.get("users").push(newUser).write();

  return res.status(201).json({ user: sanitizeUser(newUser) });
});

server.use(router);

server.listen(PORT, () => {
  console.log(`Mock API is running on http://localhost:${PORT}`);
});
