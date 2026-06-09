const path = require("path");
const jsonServer = require("json-server");

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();

const DEFAULT_SEATS = [
  "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8",
  "B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8",
  "C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8"
];

server.use(middlewares);
server.use(jsonServer.bodyParser);

function db() {
  return router.db;
}

function createId(collectionName) {
  const items = db().get(collectionName).value();
  const maxId = items.reduce((current, item) => Math.max(current, Number(item.id) || 0), 0);
  return maxId + 1;
}

function createToken(user) {
  return Buffer.from(`${user.id}:${user.role}`, "utf-8").toString("base64url");
}

function getUserByToken(token) {
  if (!token) return null;

  try {
    const [id] = Buffer.from(token, "base64url").toString("utf-8").split(":");
    return db().get("users").find({ id: Number(id) }).value() || null;
  } catch (error) {
    return null;
  }
}

function getAuthorizedUser(req) {
  const authHeader = req.headers.authorization || "";
  const [, token] = authHeader.split(" ");
  return getUserByToken(token);
}

function requireAuth(req, res, next) {
  const user = getAuthorizedUser(req);

  if (!user) {
    res.status(401).json({ message: "Нужно авторизоваться." });
    return;
  }

  req.user = user;
  next();
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      res.status(403).json({ message: "Недостаточно прав для этого действия." });
      return;
    }

    next();
  };
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function safeUser(user) {
  const { password, ...rest } = user;
  return rest;
}

function getEventById(id) {
  return db().get("events").find({ id: Number(id) }).value() || null;
}

function getAllSeats(event) {
  return event.allSeats || DEFAULT_SEATS;
}

function getOccupancyPercent(event) {
  const totalSeats = getAllSeats(event).length;
  const unavailableSeats = (event.unavailableSeats || []).length;

  return totalSeats === 0 ? 0 : Math.round((unavailableSeats / totalSeats) * 100);
}

function getSoldSeatsCount(event) {
  return (event.unavailableSeats || []).length;
}

function mapEventForList(event) {
  return {
    id: event.id,
    title: event.title,
    type: event.type,
    typeLabel: event.typeLabel,
    city: event.city,
    cityLabel: event.cityLabel,
    venue: event.venue,
    address: event.address,
    dateTime: event.dateTime,
    price: event.price,
    image: event.image,
    description: event.description,
    status: event.status,
    seatsAvailable: getAllSeats(event).length - getSoldSeatsCount(event),
    occupancyPercent: getOccupancyPercent(event)
  };
}

function mapEventDetails(event) {
  return {
    ...mapEventForList(event),
    allSeats: getAllSeats(event),
    unavailableSeats: event.unavailableSeats || [],
    organizerId: event.organizerId
  };
}

function mapTicket(ticket) {
  const event = getEventById(ticket.eventId);

  return {
    ...ticket,
    event: event ? mapEventForList(event) : null
  };
}

function buildOrderNumber() {
  return `EVT-${Math.floor(10000 + Math.random() * 90000)}`;
}

function detectCityMeta(city, venue) {
  const normalizedCity = String(city || "").trim().toLowerCase();
  const normalizedVenue = String(venue || "").trim().toLowerCase();

  if (normalizedCity === "moscow" || normalizedVenue.includes("моск")) {
    return { cityKey: "moscow", cityLabel: "Москва" };
  }

  if (normalizedCity === "spb" || normalizedVenue.includes("санкт") || normalizedVenue.includes("петербург")) {
    return { cityKey: "spb", cityLabel: "Санкт-Петербург" };
  }

  if (normalizedCity === "kazan" || normalizedVenue.includes("казан")) {
    return { cityKey: "kazan", cityLabel: "Казань" };
  }

  return { cityKey: "moscow", cityLabel: "Москва" };
}

server.post("/auth/register", (req, res) => {
  const firstName = String(req.body.firstName || "").trim();
  const lastName = String(req.body.lastName || "").trim();
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || "").trim();
  const phone = String(req.body.phone || "").trim();
  const role = req.body.role === "organizer" ? "organizer" : "user";

  if (!firstName || !lastName || !email || !password || !phone) {
    res.status(400).json({ message: "Заполните все обязательные поля." });
    return;
  }

  const existingUser = db().get("users").find({ email }).value();
  if (existingUser) {
    res.status(409).json({ message: "Пользователь с таким email уже существует." });
    return;
  }

  const user = {
    id: createId("users"),
    firstName,
    lastName,
    email,
    password,
    phone,
    role
  };

  db().get("users").push(user).write();

  res.status(201).json({
    message: "Регистрация прошла успешно.",
    token: createToken(user),
    user: safeUser(user)
  });
});

server.post("/auth/login", (req, res) => {
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || "");

  const user = db().get("users").find({ email }).value();
  if (!user || user.password !== password) {
    res.status(401).json({ message: "Неверный email или пароль." });
    return;
  }

  res.json({
    message: "Вход выполнен успешно.",
    token: createToken(user),
    user: safeUser(user)
  });
});

server.get("/auth/profile", requireAuth, (req, res) => {
  const userTickets = db().get("tickets").filter({ userId: req.user.id }).value();
  const ticketsCount = userTickets.reduce((sum, ticket) => sum + (ticket.seats || []).length, 0);

  res.json({
    user: safeUser(req.user),
    stats: {
      ticketsCount
    }
  });
});

server.get("/events", (req, res) => {
  const events = db()
    .get("events")
    .filter({ status: "published" })
    .sortBy("dateTime")
    .value()
    .map(mapEventForList);

  res.json(events);
});

server.get("/events/:id", (req, res) => {
  const event = getEventById(req.params.id);
  if (!event || event.status !== "published") {
    res.status(404).json({ message: "Событие не найдено." });
    return;
  }

  const reviews = db()
    .get("reviews")
    .filter({ eventId: event.id })
    .value();

  const similarEvents = (event.similarEventIds || [])
    .map((id) => getEventById(id))
    .filter(Boolean)
    .filter((item) => item.status === "published")
    .map(mapEventForList);

  res.json({
    event: mapEventDetails(event),
    reviews,
    similarEvents
  });
});

server.get("/tickets/my", requireAuth, requireRole("user"), (req, res) => {
  const tickets = db()
    .get("tickets")
    .filter({ userId: req.user.id })
    .sortBy("purchasedAt")
    .reverse()
    .value()
    .map(mapTicket);

  const returns = db()
    .get("returns")
    .filter({ userId: req.user.id })
    .sortBy("createdAt")
    .reverse()
    .value()
    .map((item) => {
      const ticket = db().get("tickets").find({ id: item.ticketId }).value();
      return {
        ...item,
        ticket: ticket ? mapTicket(ticket) : null
      };
    });

  res.json({ tickets, returns });
});

server.post("/tickets/purchase", requireAuth, requireRole("user"), (req, res) => {
  const eventId = Number(req.body.eventId);
  const requestedSeats = Array.from(
    new Set((req.body.seats || []).map((seat) => String(seat || "").trim().toUpperCase()).filter(Boolean))
  );

  if (!eventId || requestedSeats.length === 0) {
    res.status(400).json({ message: "Выберите хотя бы одно место." });
    return;
  }

  const event = getEventById(eventId);
  if (!event || event.status !== "published") {
    res.status(404).json({ message: "Событие не найдено." });
    return;
  }

  const allSeats = getAllSeats(event);
  const currentUnavailable = new Set(event.unavailableSeats || []);
  const invalidSeats = requestedSeats.filter((seat) => !allSeats.includes(seat));
  const busySeats = requestedSeats.filter((seat) => currentUnavailable.has(seat));

  if (invalidSeats.length > 0) {
    res.status(400).json({ message: `Некорректные места: ${invalidSeats.join(", ")}.` });
    return;
  }

  if (busySeats.length > 0) {
    res.status(409).json({ message: `Места уже заняты: ${busySeats.join(", ")}.` });
    return;
  }

  const ticket = {
    id: createId("tickets"),
    orderNumber: buildOrderNumber(),
    userId: req.user.id,
    eventId: event.id,
    seats: requestedSeats,
    status: "paid",
    purchasedAt: new Date().toISOString(),
    total: requestedSeats.length * Number(event.price || 0)
  };

  db()
    .get("events")
    .find({ id: event.id })
    .assign({
      unavailableSeats: [...(event.unavailableSeats || []), ...requestedSeats].sort()
    })
    .write();

  db().get("tickets").push(ticket).write();

  res.status(201).json({
    message: `Покупка завершена. Номер заказа: ${ticket.orderNumber}.`,
    ticket: mapTicket(ticket)
  });
});

server.post("/tickets/:id/return", requireAuth, requireRole("user"), (req, res) => {
  const ticket = db().get("tickets").find({ id: Number(req.params.id), userId: req.user.id }).value();

  if (!ticket) {
    res.status(404).json({ message: "Билет не найден." });
    return;
  }

  if (ticket.status === "returned") {
    res.status(409).json({ message: "Возврат уже оформлен." });
    return;
  }

  const event = getEventById(ticket.eventId);
  if (!event) {
    res.status(404).json({ message: "Событие для этого билета не найдено." });
    return;
  }

  const updatedUnavailableSeats = (event.unavailableSeats || []).filter((seat) => !(ticket.seats || []).includes(seat));

  db().get("tickets").find({ id: ticket.id }).assign({ status: "returned" }).write();
  db().get("events").find({ id: event.id }).assign({ unavailableSeats: updatedUnavailableSeats }).write();
  db().get("returns").push({
    id: createId("returns"),
    ticketId: ticket.id,
    userId: req.user.id,
    status: "completed",
    createdAt: new Date().toISOString()
  }).write();

  res.json({ message: `Возврат по заказу ${ticket.orderNumber} оформлен.` });
});

server.get("/organizer/dashboard", requireAuth, requireRole("organizer"), (req, res) => {
  const events = db()
    .get("events")
    .filter({ organizerId: req.user.id })
    .sortBy("dateTime")
    .value();

  const tickets = db()
    .get("tickets")
    .value()
    .filter((ticket) => events.some((event) => event.id === ticket.eventId) && ticket.status === "paid");

  const paidReturnsCount = db()
    .get("returns")
    .value()
    .filter((item) => {
      const ticket = db().get("tickets").find({ id: item.ticketId }).value();
      return ticket && events.some((event) => event.id === ticket.eventId);
    }).length;

  const soldTickets = tickets.reduce((sum, ticket) => sum + (ticket.seats || []).length, 0);
  const revenue = tickets.reduce((sum, ticket) => sum + Number(ticket.total || 0), 0);
  const activeEvents = events.filter((event) => event.status === "published").length;
  const returnsPercent = soldTickets === 0 ? 0 : ((paidReturnsCount / soldTickets) * 100);

  res.json({
    organizer: safeUser(req.user),
    stats: {
      activeEvents,
      soldTickets,
      revenue,
      returnsPercent
    },
    sales: events.map((event) => ({
      id: event.id,
      title: event.title,
      soldTickets: getSoldSeatsCount(event),
      occupancyPercent: getOccupancyPercent(event)
    })),
    events: events.map((event) => ({
      id: event.id,
      title: event.title,
      venue: `${event.cityLabel}, ${event.venue}`,
      dateTime: event.dateTime,
      price: event.price,
      status: event.status
    }))
  });
});

server.post("/organizer/events", requireAuth, requireRole("organizer"), (req, res) => {
  const title = String(req.body.title || "").trim();
  const type = String(req.body.type || "").trim();
  const venue = String(req.body.place || "").trim();
  const city = String(req.body.city || "").trim();
  const date = String(req.body.date || "").trim();
  const price = Number(req.body.price);
  const description = String(req.body.description || "").trim();

  if (!title || !type || !venue || !city || !date || !Number.isFinite(price) || price <= 0) {
    res.status(400).json({ message: "Заполните название, тип, город, место, дату и цену." });
    return;
  }

  const cityMeta = detectCityMeta(city, venue);
  const typeLabelMap = {
    concert: "Концерт",
    theater: "Театр",
    festival: "Фестиваль",
    sport: "Спорт"
  };

  const event = {
    id: createId("events"),
    title,
    type,
    typeLabel: typeLabelMap[type] || "Событие",
    city: cityMeta.cityKey,
    cityLabel: cityMeta.cityLabel,
    venue,
    address: `${cityMeta.cityLabel}, адрес уточняется`,
    dateTime: `${date}T19:00:00+03:00`,
    price,
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
    description: description || "Черновик события, созданный организатором через mock API.",
    status: "draft",
    organizerId: req.user.id,
    unavailableSeats: [],
    similarEventIds: []
  };

  db().get("events").push(event).write();

  res.status(201).json({
    message: `Событие «${event.title}» добавлено в черновики.`,
    event
  });
});

server.use((req, res) => {
  res.status(404).json({ message: `Маршрут ${req.method} ${req.path} не найден.` });
});

server.listen(3000, () => {
  console.log("Mock API запущено на http://localhost:3000");
});
