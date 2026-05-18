const API_BASE = "http://localhost:3001";

async function handleJson(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function getModels(filters = {}) {
  const params = new URLSearchParams(filters).toString();
  const url = `${API_BASE}/api/models${params ? `?${params}` : ""}`;
  const res = await fetch(url);
  return handleJson(res);
}

export async function getDatasets(filters = {}) {
  const params = new URLSearchParams(filters).toString();
  const url = `${API_BASE}/api/datasets${params ? `?${params}` : ""}`;
  const res = await fetch(url);
  return handleJson(res);
}

export async function getSpaces(filters = {}) {
  const params = new URLSearchParams(filters).toString();
  const url = `${API_BASE}/api/spaces${params ? `?${params}` : ""}`;
  const res = await fetch(url);
  return handleJson(res);
}

export async function getModelById(id) {
  const res = await fetch(`${API_BASE}/api/model/${id}`);
  return handleJson(res);
}

export async function getDatasetById(id) {
  const res = await fetch(`${API_BASE}/api/dataset/${id}`);
  return handleJson(res);
}

export async function getSpaceById(id) {
  const res = await fetch(`${API_BASE}/api/space/${id}`);
  return handleJson(res);
}

export function isLoggedIn() {
  return !!localStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "index.html";
}
