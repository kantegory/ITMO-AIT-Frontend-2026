// server.js
import jsonServer from "json-server";
import auth from "json-server-auth";
import cors from "cors";

const app = jsonServer.create();
const router = jsonServer.router("db.json");

// правила доступа
const rules = auth.rewriter({
  users: 600,
  tickets: 660,
  events: 644,
  reviews: 660
});

app.db = router.db;

app.use(cors());
app.use(rules);
app.use(auth);
app.use(router);

app.listen(4000, () => {
  console.log("JSON Server with Auth running on port 4000");
});