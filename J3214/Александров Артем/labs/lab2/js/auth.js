function getCurrentUser() {
  const userJson = localStorage.getItem('currentUser');
  return userJson ? JSON.parse(userJson) : null;
}

function setCurrentUser(user) {
  localStorage.setItem('currentUser', JSON.stringify(user));
}

function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'index.html';
}

function checkAuth() {
  const user = getCurrentUser();
  if (!user) {
    
    window.location.href = 'index.html';
  }
  return user;
}