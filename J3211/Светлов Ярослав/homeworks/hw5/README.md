# ДЗ5 — заметки на Vue

Node.js 22.12+ (проверено на 22.22.2).

```sh
npm ci
npm run api
```

Во втором терминале из этой же папки: `npm start`. Открыть http://localhost:8085.
API работает на http://localhost:3005. `npm run build` создаёт `dist`; `npm run preview` показывает сборку вместо dev-сервера. API при этом тоже нужен.

`npm test` проверяет API на временной базе. Примеры лежат в `db.json`, новые заметки — в игнорируемом `db.local.json`. Авторизация для учебных заметок не предусмотрена.

[Отчёт в PDF](Отчёт.pdf), [исходник LaTeX](report.tex).
