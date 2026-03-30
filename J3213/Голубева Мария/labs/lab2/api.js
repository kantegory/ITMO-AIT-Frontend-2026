const API_URL = "http://localhost:3000";

// ===== Базовая функция для запросов =====
async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
}

// ===== USERS =====

// Получить пользователя по email
async function getUserByEmail(email) {
  const users = await request(`/users?email=${encodeURIComponent(email)}`);
  return users[0] || null;
}

// Получить пользователя по id
async function getUserById(id) {
  return await request(`/users/${id}`);
}

// Регистрация пользователя
async function createUser(userData) {
  return await request("/users", {
    method: "POST",
    body: JSON.stringify(userData)
  });
}

// ===== COURSES =====

// Получить все курсы
async function getCourses() {
  return await request("/courses");
}

// Получить курс по id
async function getCourseById(id) {
  return await request(`/courses/${id}`);
}

// ===== ENROLLMENTS =====

// Получить все записи пользователя на курсы
async function getEnrollmentsByUserId(userId) {
  return await request(`/enrollments?userId=${userId}`);
}

// Проверить, записан ли пользователь на курс
async function getEnrollment(userId, courseId) {
  const enrollments = await request(`/enrollments?userId=${userId}&courseId=${courseId}`);
  return enrollments[0] || null;
}

// Записать пользователя на курс
async function createEnrollment(enrollmentData) {
  return await request("/enrollments", {
    method: "POST",
    body: JSON.stringify(enrollmentData)
  });
}

// Обновить прогресс по записи
async function updateEnrollment(id, data) {
  return await request(`/enrollments/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data)
  });
}

// Удалить запись на курс
async function deleteEnrollment(id) {
  return await request(`/enrollments/${id}`, {
    method: "DELETE"
  });
}