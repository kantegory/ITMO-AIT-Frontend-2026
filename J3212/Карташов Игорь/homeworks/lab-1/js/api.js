var API_BASE = 'http://localhost:3000';

function api(endpoint) {
  return fetch(API_BASE + endpoint).then(function (res) {
    if (!res.ok) throw new Error('API error: ' + res.status);
    return res.json();
  });
}

function apiPost(endpoint, data) {
  return fetch(API_BASE + endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(function (res) {
    if (!res.ok) throw new Error('API error: ' + res.status);
    return res.json();
  });
}
