const API_URL = 'http://localhost:3000';

async function getModels() {
  const res = await fetch(`${API_URL}/models`);
  return res.json();
}

async function getDatasets() {
  const res = await fetch(`${API_URL}/datasets`);
  return res.json();
}

async function getUserByEmail(email) {
  const res = await fetch(`${API_URL}/users?email=${encodeURIComponent(email)}`);
  const users = await res.json();
  return users[0] || null;
}

async function loginUser(email, password) {
  const res = await fetch(
    `${API_URL}/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
  );
  const users = await res.json();
  return users[0] || null;
}

async function registerUser(userData) {
  const res = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return res.json();
}
