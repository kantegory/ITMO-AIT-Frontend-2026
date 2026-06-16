const apiBaseUrl = "http://localhost:3000";

async function apiRequest(path, options = {}) {
  const requestOptions = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  };

  if (options.body !== undefined) {
    requestOptions.body = options.body;
  }

  const response = await fetch(`${apiBaseUrl}${path}`, requestOptions);

  if (!response.ok) {
    let message = `${response.status} ${response.statusText}`;

    try {
      const text = await response.text();
      if (text) {
        message = `${message} — ${text}`;
      }
    } catch {
      // ничего
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    return null;
  }

  return response.json();
}

function trimUser(user) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    name: user.name,
    email: user.email,
  };
}

async function loginUser(email, password) {
  const params = new URLSearchParams({ email, password });
  const users = await apiRequest(`/users?${params.toString()}`);
  return users[0] ? trimUser(users[0]) : null;
}

async function registerUser(userData) {
  const params = new URLSearchParams({ email: userData.email });
  const existingUsers = await apiRequest(`/users?${params.toString()}`);

  if (existingUsers.length) {
    throw new Error("Пользователь с таким email уже есть");
  }

  const payload = {
    id: `user-${Date.now()}`,
    firstName: userData.firstName,
    lastName: userData.lastName,
    name: `${userData.firstName} ${userData.lastName}`.replace(/\s+/g, " ").trim(),
    email: userData.email,
    password: userData.password,
  };

  const createdUser = await apiRequest("/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return trimUser(createdUser);
}

function getProjectRole(project, userName) {
  const member = (project.members || []).find((item) => item.name === userName);
  return member ? member.role : "Наблюдатель";
}

function decorateProject(project, userName) {
  const role = getProjectRole(project, userName);

  return {
    ...project,
    role,
    actions: buildProjectActions(role),
  };
}

async function loadProjectsFromApi(userName) {
  const list = await apiRequest("/projects");

  return list
    .filter((project) => (project.members || []).some((member) => member.name === userName))
    .map((project) => decorateProject(project, userName));
}

async function loadProjectFromApi(projectId, userName) {
  const project = await apiRequest(`/projects/${encodeURIComponent(projectId)}`);
  return decorateProject(project, userName);
}

async function createProjectInApi(project) {
  return apiRequest("/projects", {
    method: "POST",
    body: JSON.stringify(project),
  });
}

async function saveProjectInApi(projectId, project) {
  return apiRequest(`/projects/${encodeURIComponent(projectId)}`, {
    method: "PATCH",
    body: JSON.stringify(project),
  });
}

async function deleteProjectInApi(projectId) {
  return apiRequest(`/projects/${encodeURIComponent(projectId)}`, {
    method: "DELETE",
  });
}
