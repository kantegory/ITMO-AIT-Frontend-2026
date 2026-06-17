import { getAuth, clearAuth } from "./storage.js";

const API_BASE = "/api";

export class ApiError extends Error {
  constructor(message, { status, payload } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

async function parseJsonSafe(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function apiFetch(path, { method = "GET", body, auth = true } = {}) {
  const headers = { Accept: "application/json" };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const session = auth ? getAuth() : null;
  if (session?.token) {
    headers.Authorization = `Bearer ${session.token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (res.status === 401 && auth) {
    clearAuth();
  }

  if (!res.ok) {
    const payload = await parseJsonSafe(res);
    const message =
      payload?.message || `Ошибка запроса (${res.status})`;
    throw new ApiError(message, { status: res.status, payload });
  }

  if (res.status === 204) return null;
  return await parseJsonSafe(res);
}

export const AuthApi = {
  login: (data) => apiFetch("/auth/login", { method: "POST", body: data, auth: false }),
  register: (data) =>
    apiFetch("/auth/register", { method: "POST", body: data, auth: false }),
  me: () => apiFetch("/auth/me"),
};

export const CoursesApi = {
  list: (params) => {
    const qs = new URLSearchParams();
    if (params?.direction) qs.set("direction", params.direction);
    if (params?.level) qs.set("level", params.level);
    if (params?._sort) qs.set("_sort", params._sort);
    if (params?._order) qs.set("_order", params._order);
    return apiFetch(`/courses?${qs.toString()}`, { auth: false });
  },
  get: (id) => apiFetch(`/courses/${encodeURIComponent(id)}`, { auth: false }),
  create: (data) => apiFetch("/courses", { method: "POST", body: data }),
};

export const LessonsApi = {
  listByCourse: (courseId) => {
    const qs = new URLSearchParams({ courseId });
    return apiFetch(`/lessons?${qs.toString()}`, { auth: false });
  },
  create: (data) => apiFetch("/lessons", { method: "POST", body: data }),
};

export const MaterialsApi = {
  listByCourse: (courseId) => {
    const qs = new URLSearchParams({ courseId });
    return apiFetch(`/materials?${qs.toString()}`, { auth: false });
  },
  create: (data) => apiFetch("/materials", { method: "POST", body: data }),
};

export const AssignmentsApi = {
  listByCourse: (courseId) => {
    const qs = new URLSearchParams({ courseId });
    return apiFetch(`/assignments?${qs.toString()}`, { auth: false });
  },
  create: (data) => apiFetch("/assignments", { method: "POST", body: data }),
};

export const ThreadsApi = {
  listByCourse: (courseId) => {
    const qs = new URLSearchParams({ courseId });
    return apiFetch(`/threads?${qs.toString()}`, { auth: false });
  },
};

export const MessagesApi = {
  listByThread: (threadId) => {
    const qs = new URLSearchParams({ threadId });
    return apiFetch(`/messages?${qs.toString()}`, { auth: false });
  },
};

export const CertificatesApi = {
  my: async () => {
    const me = await AuthApi.me();
    const qs = new URLSearchParams({ userId: me.id });
    return apiFetch(`/certificates?${qs.toString()}`);
  },
  create: (data) => apiFetch("/certificates", { method: "POST", body: data }),
};

export const EnrollmentsApi = {
  my: async () => {
    const me = await AuthApi.me();
    const qs = new URLSearchParams({ userId: me.id });
    return apiFetch(`/enrollments?${qs.toString()}`);
  },
  hasCourse: async (courseId) => {
    const me = await AuthApi.me();
    const qs = new URLSearchParams({ userId: me.id, courseId });
    const list = await apiFetch(`/enrollments?${qs.toString()}`);
    return Array.isArray(list) && list.length > 0;
  },
  getForCourse: async (courseId) => {
    const me = await AuthApi.me();
    const qs = new URLSearchParams({ userId: me.id, courseId });
    const list = await apiFetch(`/enrollments?${qs.toString()}`);
    return Array.isArray(list) ? list[0] : null;
  },
  patch: (id, patch) => apiFetch(`/enrollments/${encodeURIComponent(id)}`, { method: "PATCH", body: patch }),
  create: (data) => apiFetch("/enrollments", { method: "POST", body: data }),
};

