const API_BASE_URL = 'http://localhost:3000';

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...options
  });

  if (!response.ok) {
    let message = 'Ошибка запроса к API';
    try {
      const errorData = await response.json();
      if (errorData?.message) message = errorData.message;
    } catch (_) {}
    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json();
}

const AppAPI = {
  async getCourses() {
    return apiRequest('/courses');
  },

  async getPopularCourses(limit = 4) {
    const courses = await apiRequest('/courses');
    return courses
        .filter(course => course.isPopular === true)
        .sort((a, b) => b.students - a.students)
        .slice(0, limit);
    },

  async getCourseById(id) {
    return apiRequest(`/courses/${id}`);
  },

  async getLessonsByCourse(courseId) {
    const lessons = await apiRequest('/lessons');
    return lessons
        .filter(lesson => Number(lesson.courseId) === Number(courseId))
        .sort((a, b) => Number(a.order) - Number(b.order));
  },


  async getCommentsByCourse(courseId) {
    const comments = await apiRequest('/comments');
    return comments
        .filter(comment => Number(comment.courseId) === Number(courseId))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async addComment(comment) {
    return apiRequest('/comments', {
      method: 'POST',
      body: JSON.stringify(comment)
    });
  },

  async findUserByEmail(email) {
    const users = await apiRequest('/users');
    return users.find(user =>
        String(user.email).trim().toLowerCase() === String(email).trim().toLowerCase()
    ) || null;
  },

  async register(userData) {
    const existingUser = await this.findUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('Пользователь с таким email уже существует');
    }

    const newUser = await apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify({
        ...userData,
        registeredAt: new Date().toISOString().slice(0, 10)
      })
    });

    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return newUser;
  },

  async login(email, password) {
    const users = await apiRequest('/users');

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedPassword = String(password).trim();

    const user = users.find(user =>
        String(user.email).trim().toLowerCase() === normalizedEmail &&
        String(user.password).trim() === normalizedPassword
    );

    if (!user) {
        throw new Error('Неверный email или пароль');
    }

    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  },

  getCurrentUser() {
    const raw = localStorage.getItem('currentUser');
    return raw ? JSON.parse(raw) : null;
  },

  logout() {
    localStorage.removeItem('currentUser');
  },

  async getEnrollmentsByUser(userId) {
    const enrollments = await apiRequest('/enrollments');
    return enrollments.filter(item => Number(item.userId) === Number(userId));
  },

  async getEnrollment(userId, courseId) {
    const enrollments = await apiRequest('/enrollments');
    return enrollments.find(item =>
        Number(item.userId) === Number(userId) &&
        Number(item.courseId) === Number(courseId)
    ) || null;
  },

  async enrollUser(userId, courseId) {
    const existing = await this.getEnrollment(userId, courseId);
    if (existing) return existing;

    return apiRequest('/enrollments', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        courseId,
        completedLessons: [],
        progress: 0
      })
    });
  },

  async updateEnrollment(enrollmentId, payload) {
    return apiRequest(`/enrollments/${enrollmentId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
  },

  async getTeacherCourses(teacherId) {
    const courses = await apiRequest('/courses');
    return courses
        .filter(course => String(course.teacherId) === String(teacherId))
        .sort((a, b) => String(b.id).localeCompare(String(a.id)));
    },

  async createCourse(courseData) {
    return apiRequest('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData)
    });
  },

  async createLesson(lessonData) {
    return apiRequest('/lessons', {
      method: 'POST',
      body: JSON.stringify(lessonData)
    });
  },

  async updateUser(userId, payload) {
    return apiRequest(`/users/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
    });
  }
};

window.AppAPI = AppAPI;