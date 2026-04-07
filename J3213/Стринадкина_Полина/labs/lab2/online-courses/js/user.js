function loadUserProfile() {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    alert('Сначала войдите в систему');
    window.location.href = 'login.html';
    return;
  }

  document.getElementById('user-name').textContent = user.name || 'Без имени';
  document.getElementById('user-email').textContent = user.email || '—';
  document.getElementById('user-role').textContent =
    user.role === 'student' ? 'Студент' : user.role;

  const coursesContainer = document.getElementById('user-courses');
  coursesContainer.innerHTML = '';

  if (user.myCourses && user.myCourses.length > 0) {
    user.myCourses.forEach((course, index) => {
      const colorClass = index % 2 === 0 ? '' : ' bg-success';

      coursesContainer.innerHTML += `
        <p>${course.title}</p>
        <div class="progress mb-3">
          <div class="progress-bar${colorClass}" style="width: ${course.progress}%;">
            ${course.progress}%
          </div>
        </div>
      `;
    });
  } else {
    coursesContainer.innerHTML = `<p>У пользователя пока нет курсов.</p>`;
  }

  const certificatesList = document.getElementById('certificates-list');
  certificatesList.innerHTML = '';

  if (user.certificates && user.certificates.length > 0) {
    user.certificates.forEach(cert => {
      certificatesList.innerHTML += `
        <li class="list-group-item">${cert}</li>
      `;
    });
  } else {
    certificatesList.innerHTML = `
      <li class="list-group-item">Сертификатов пока нет</li>
    `;
  }
}

loadUserProfile();