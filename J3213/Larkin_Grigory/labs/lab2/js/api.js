var API_URL = 'http://localhost:3000';

function apiGet(path) {
  return fetch(API_URL + path).then(function (r) {
    if (!r.ok) throw new Error('Ошибка сети: ' + r.status);
    return r.json();
  });
}

function apiPost(path, data) {
  return fetch(API_URL + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(function (r) {
    if (!r.ok) throw new Error('Ошибка сети: ' + r.status);
    return r.json();
  });
}
