const API_URL = 'http://localhost:3000';

function getToken() {
  return localStorage.getItem('accessToken');
}

function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

function isLoggedIn() {
  return !!getToken();
}

function logout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  window.location.href = getBasePath() + 'index.html';
}

function getBasePath() {
  const path = window.location.pathname;
  if (path.includes('/UserCourses/') || path.includes('/Course/') || path.includes('/TeacherCourses/')) {
    return '../';
  }
  return '';
}

axios.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      logout();
    }
    return Promise.reject(error);
  }
);