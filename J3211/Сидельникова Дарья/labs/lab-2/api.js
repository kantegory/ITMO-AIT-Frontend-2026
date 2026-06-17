const API_URL = "http://localhost:3000";

export async function loginRequest(email, password) {
    const response = await fetch(
        `${API_URL}/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
    );

    if (!response.ok) {
        throw new Error("Ошибка входа");
    }

    const users = await response.json();

    if (!users.length) {
        throw new Error("Неверный email или пароль");
    }

    return users[0];
}

export async function registerRequest(userData) {
    const checkResponse = await fetch(
        `${API_URL}/users?email=${encodeURIComponent(userData.email)}`
    );

    if (!checkResponse.ok) {
        throw new Error("Ошибка проверки пользователя");
    }

    const existingUsers = await checkResponse.json();

    if (existingUsers.length > 0) {
        throw new Error("Пользователь с таким email уже существует");
    }

    const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });

    if (!response.ok) {
        throw new Error("Ошибка регистрации");
    }

    return response.json();
}

export async function getUsers() {
    const response = await fetch(`${API_URL}/users`);

    if (!response.ok) {
        throw new Error("Ошибка загрузки пользователей");
    }

    return response.json();
}

export async function getProjects() {
    const response = await fetch(`${API_URL}/projects`);

    if (!response.ok) {
        throw new Error("Ошибка загрузки проектов");
    }

    return response.json();
}

export async function getUserTasks(userId) {
    const response = await fetch(`${API_URL}/tasks?assigneeId=${encodeURIComponent(userId)}`);

    if (!response.ok) {
        throw new Error("Ошибка загрузки задач");
    }

    return response.json();
}

export async function getProjectById(projectId) {
    const response = await fetch(`${API_URL}/projects/${projectId}`);

    if (!response.ok) {
        throw new Error("Ошибка загрузки проекта");
    }

    return response.json();
}

export async function getProjectTasks(projectId) {
    const response = await fetch(`${API_URL}/tasks?projectId=${encodeURIComponent(projectId)}`);

    if (!response.ok) {
        throw new Error("Ошибка загрузки задач проекта");
    }

    return response.json();
}

export async function createProject(projectData) {
    const response = await fetch(`${API_URL}/projects`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(projectData)
    });

    if (!response.ok) {
        throw new Error("Ошибка создания проекта");
    }

    return response.json();
}

export async function createTask(taskData) {
    const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(taskData)
    });

    if (!response.ok) {
        throw new Error("Ошибка создания задачи");
    }

    return response.json();
}
