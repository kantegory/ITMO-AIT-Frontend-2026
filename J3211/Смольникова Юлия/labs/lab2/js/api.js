const API_BASE = "http://localhost:3000";

async function apiRequest(path, options = {}) {
    const token = getToken();
    const headers = {
        "Content-Type": "application/json",
        ...options.headers
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers
    });

    if (!response.ok) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
        error.status = response.status;
        throw error;
    }

    return response.json();
}

async function loginUser({ email, password }) {
    const response = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
        const err = new Error("Неверный email или пароль");
        err.status = response.status;
        throw err;
    }

    return response.json();
}

async function registerUser({ name, email, password, role }) {
    const response = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role })
    });

    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const err = new Error(data.message || data.error || "Ошибка регистрации");
        err.status = response.status;
        throw err;
    }

    return response.json();
}

async function getCourses(page = 1, perPage = 100, filters = {}) {
    let path = `/courses?_page=${page}&_limit=${perPage}`;

    if (filters.userId) {
        path += `&userId=${filters.userId}`;
    }

    if (filters.subject) {
        path += `&subject=${encodeURIComponent(filters.subject)}`;
    }

    if (filters.level) {
        path += `&level=${encodeURIComponent(filters.level)}`;
    }

    if (filters.search) {
        path += `&q=${encodeURIComponent(filters.search)}`;
    }

    const data = await apiRequest(path);

    if (Array.isArray(data)) {
        return { courses: data, total: data.length };
    }

    return { courses: data.data || [], total: data.total || 0 };
}

async function getCourseById(id) {
    return apiRequest(`/courses/${id}`);
}

async function createCourse(courseData) {
    return apiRequest("/courses", {
        method: "POST",
        body: JSON.stringify(courseData)
    });
}

async function updateCourse(id, courseData) {
    return apiRequest(`/courses/${id}`, {
        method: "PUT",
        body: JSON.stringify(courseData)
    });
}

async function deleteCourse(id) {
    return apiRequest(`/courses/${id}`, {
        method: "DELETE"
    });
}

async function deleteEnrollmentsByCourse(courseId) {
    try {
        const data = await apiRequest(`/enrollments?courseId=${courseId}`);
        const list = Array.isArray(data) ? data : (data.data || []);
        await Promise.all(list.map(e => apiRequest(`/enrollments/${e.id}`, { method: "DELETE" })));
    } catch {
    }
}

async function getUserCourses(userId) {
    const [enrollmentsData, allCoursesData] = await Promise.all([
        apiRequest(`/enrollments?userId=${userId}`),
        apiRequest('/courses')
    ]);

    const enrollments = Array.isArray(enrollmentsData) ? enrollmentsData : (enrollmentsData.data || []);
    const allCourses = Array.isArray(allCoursesData) ? allCoursesData : (allCoursesData.data || []);

    const courseMap = {};
    allCourses.forEach(c => { courseMap[c.id] = c; });

    return enrollments.map(e => ({
        ...e,
        course: courseMap[e.courseId] || null
    }));
}

async function isAlreadyEnrolled(userId, courseId) {
    try {
        const data = await apiRequest(`/enrollments?userId=${userId}&courseId=${courseId}`);
        const list = Array.isArray(data) ? data : (data.data || []);
        return list.length > 0;
    } catch {
        return false;
    }
}

async function enrollCourse(enrollmentData) {
    return apiRequest("/enrollments", {
        method: "POST",
        body: JSON.stringify(enrollmentData)
    });
}