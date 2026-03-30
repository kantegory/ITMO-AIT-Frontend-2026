import { API_BASE_URL } from "./config.js";
import { clearSession, isProtectedPage, loadSession, redirectToLogin } from "./session.js";
import { safeJsonParse } from "./utils.js";

export async function apiRequest(path, options = {}) {
  const {
    method = "GET",
    body,
    auth = true,
    token,
  } = options;

  const headers = {};
  const accessToken = token || loadSession()?.accessToken;

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (auth && accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    throw new Error("API недоступен, нужен `npm run api`");
  }

  const raw = await response.text();
  const data = raw ? safeJsonParse(raw) : null;

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      clearSession();
      if (isProtectedPage()) {
        redirectToLogin();
      }
    }

    const message =
      data?.message ||
      data?.error ||
      (typeof data === "string" ? data : "") ||
      "Ошибка запроса к API.";
    throw new Error(message);
  }

  return data;
}
