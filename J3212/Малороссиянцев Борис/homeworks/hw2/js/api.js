'use strict';
const API = (() => {
  const BASE = 'http://localhost:3000';
  const OWM_KEY = '7c2bf5858469b96c2bd0d162aa5610a9';
  function getToken() {
    return localStorage.getItem('wl_token') || '';
  }
  function authHeaders(extra = {}) {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
      ...extra,
    };
  }
  async function handleResponse(res) {
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw data;
    return data;
  }
  async function register({ email, password, firstName, lastName }) {
    const res = await fetch(`${BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, firstName, lastName }),
    });
    return handleResponse(res);
  }
  async function login(email, password) {
    const res = await fetch(`${BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  }
  async function getNotes() {
    const userId = Auth.getUserId();
    const res = await fetch(`${BASE}/notes?userId=${userId}&_sort=id&_order=desc`, {
      headers: authHeaders(),
    });
    return handleResponse(res);
  }
  async function createNote({ title, text, dest }) {
    const res = await fetch(`${BASE}/notes`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        id:     Date.now(),
        userId: Auth.getUserId(),
        title,
        text:   text || '',
        dest:   dest || '',
        date:   new Date().toLocaleDateString('ru', { day: 'numeric', month: 'short' }),
      }),
    });
    return handleResponse(res);
  }
  async function deleteNote(id) {
    const res = await fetch(`${BASE}/notes/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!res.ok) throw await res.json().catch(() => ({}));
  }
  async function getSavedRoutes() {
    const userId = Auth.getUserId();
    const res = await fetch(`${BASE}/savedRoutes?userId=${userId}`, {
      headers: authHeaders(),
    });
    return handleResponse(res);
  }
  async function saveRoute(destinationId) {
    const res = await fetch(`${BASE}/savedRoutes`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ id: Date.now(), destinationId, userId: Auth.getUserId() }),
    });
    return handleResponse(res);
  }
  async function unsaveRoute(destinationId) {
    const userId = Auth.getUserId();
    const listRes = await fetch(
      `${BASE}/savedRoutes?userId=${userId}&destinationId=${destinationId}`,
      { headers: authHeaders() }
    );
    const list = await handleResponse(listRes);
    if (list.length) {
      await fetch(`${BASE}/savedRoutes/${list[0].id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
    }
  }
  async function getTrips() {
    const userId = Auth.getUserId();
    const res = await fetch(`${BASE}/trips?userId=${userId}`, {
      headers: authHeaders(),
    });
    return handleResponse(res);
  }
  async function getWeather(city) {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather` +
      `?q=${encodeURIComponent(city)}&appid=${OWM_KEY}&units=metric&lang=ru`
    );
    if (!res.ok) throw new Error('Погода недоступна');
    return res.json();
  }
  async function getCountryInfo(countryName) {
    const res = await fetch(
      `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}` +
      `?fields=name,capital,currencies,flags,population,region,languages`
    );
    if (!res.ok) throw new Error('Данные о стране недоступны');
    const data = await res.json();
    return data[0];
  }
  return {
    register,
    login,
    getNotes,
    createNote,
    deleteNote,
    getSavedRoutes,
    saveRoute,
    unsaveRoute,
    getTrips,
    getWeather,
    getCountryInfo,
  };
})();