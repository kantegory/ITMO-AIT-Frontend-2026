const express = require('express');
const path = require('path');

const app = express();
const PORT = 8000;

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Static app is running on http://localhost:${PORT}`);
});
