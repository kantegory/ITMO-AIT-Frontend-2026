"use strict";

window.TPulseApi = (() => {
  const apiOrigin = window.location.port === "3000" ? "" : "http://localhost:3000";
  const tokenKey = "tpulseAccessToken";
  const userKey = "tpulseCurrentUser";

  function getStorage() {
    return localStorage.getItem(tokenKey) ? localStorage : sessionStorage;
  }

  function getToken() {
    return localStorage.getItem(tokenKey) || sessionStorage.getItem(tokenKey);
  }

  function getCurrentUser() {
    const serializedUser = localStorage.getItem(userKey) || sessionStorage.getItem(userKey);
    return serializedUser ? JSON.parse(serializedUser) : null;
  }

  function saveSession(payload, remember = false) {
    const storage = remember ? localStorage : sessionStorage;
    clearSession();
    storage.setItem(tokenKey, payload.accessToken);
    storage.setItem(userKey, JSON.stringify(payload.user));
  }

  function updateStoredUser(user) {
    const storage = getStorage();
    storage.setItem(userKey, JSON.stringify(user));
  }

  function clearSession() {
    [localStorage, sessionStorage].forEach((storage) => {
      storage.removeItem(tokenKey);
      storage.removeItem(userKey);
    });
  }

  async function request(path, options = {}) {
    const headers = new Headers(options.headers || {});
    const token = getToken();

    if (options.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    let response;
    try {
      response = await fetch(apiOrigin + path, { ...options, headers });
    } catch (error) {
      throw new Error("API недоступен. Запустите npm start в папке lab2.");
    }

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json") ? await response.json() : await response.text();

    if (!response.ok) {
      const message = data?.message || data || `Ошибка API: ${response.status}`;
      throw new Error(String(message));
    }

    return data;
  }

  async function login(email, password, remember) {
    const payload = await request("/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
    saveSession(payload, remember);
    return payload.user;
  }

  async function register(profile) {
    const payload = await request("/register", {
      method: "POST",
      body: JSON.stringify(profile)
    });
    saveSession(payload, true);

    const workspace = await request("/workspaces", {
      method: "POST",
      body: JSON.stringify({
        name: profile.workspaceName,
        code: profile.workspaceName.split(/\s+/).map((word) => word[0]).join("").slice(0, 2).toUpperCase(),
        ownerId: payload.user.id
      })
    });

    const project = await request("/projects", {
      method: "POST",
      body: JSON.stringify({
        workspaceId: workspace.id,
        name: "Первый проект",
        description: "Первый проект нового рабочего пространства",
        status: "planned",
        deadline: null,
        ownerId: payload.user.id
      })
    });

    const user = await request(`/users/${payload.user.id}`, {
      method: "PATCH",
      body: JSON.stringify({ workspaceId: workspace.id, projectId: project.id })
    });

    await request("/members", {
      method: "POST",
      body: JSON.stringify({
        workspaceId: workspace.id,
        userId: user.id,
        name: `${profile.firstName} ${profile.lastName}`,
        shortName: `${profile.firstName} ${profile.lastName[0]}.`,
        email: profile.email,
        role: "Администратор",
        status: "Онлайн",
        projectsCount: 0,
        code: `user-${user.id}`,
        initials: `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase(),
        avatar: "lime"
      })
    });

    updateStoredUser(user);
    return user;
  }

  function toQuery(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") query.set(key, value);
    });
    const value = query.toString();
    return value ? `?${value}` : "";
  }

  return {
    login,
    register,
    logout: clearSession,
    isAuthenticated: () => Boolean(getToken()),
    getCurrentUser,
    getTasks: (params) => request(`/tasks${toQuery(params)}`),
    createTask: async (task) => {
      const created = await request("/tasks", { method: "POST", body: JSON.stringify(task) });
      return request(`/tasks/${created.id}`, {
        method: "PATCH",
        body: JSON.stringify({ key: `TP-${created.id}` })
      });
    },
    updateTask: (id, changes) => request(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify(changes) }),
    getProjects: (params) => request(`/projects${toQuery(params)}`),
    getMembers: (params) => request(`/members${toQuery(params)}`),
    createMember: (member) => request("/members", { method: "POST", body: JSON.stringify(member) }),
    updateMember: (id, changes) => request(`/members/${id}`, { method: "PATCH", body: JSON.stringify(changes) }),
    getComments: (params) => request(`/comments${toQuery(params)}`),
    createComment: (comment) => request("/comments", { method: "POST", body: JSON.stringify(comment) })
  };
})();
