document.addEventListener('DOMContentLoaded', function () {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user) return;

  // Профиль
  const profileName = document.getElementById('profileName');
  const profileSubtitle = document.getElementById('profileSubtitle');
  const profileAvatar = document.getElementById('profileAvatar');

  function renderProfile() {
    const u = JSON.parse(localStorage.getItem('user'));
    profileName.textContent = u.name;
    profileAvatar.textContent = u.name.charAt(0).toUpperCase();

    const parts = [];
    if (u.bio) parts.push(u.bio);
    if (u.location) parts.push(u.location);
    profileSubtitle.textContent = parts.join(' \u00b7 ') || 'Профиль не заполнен';
  }

  renderProfile();

  // Модалка — заполняем при открытии
  const editModal = document.getElementById('editProfileModal');
  editModal.addEventListener('show.bs.modal', function () {
    const u = JSON.parse(localStorage.getItem('user'));
    document.getElementById('editName').value = u.name;
    document.getElementById('editBio').value = u.bio || '';
    document.getElementById('editLocation').value = u.location || '';
  });

  // Сохранение
  document.getElementById('saveProfileBtn').addEventListener('click', async function () {
    const name = document.getElementById('editName').value.trim();
    const bio = document.getElementById('editBio').value.trim();
    const location = document.getElementById('editLocation').value.trim();

    if (!name) return;

    const updated = { name, bio, location };

    try {
      await updateUser(user.id, updated);
    } catch {
      // сервер недоступен — сохраняем только локально
    }

    const u = JSON.parse(localStorage.getItem('user'));
    Object.assign(u, updated);
    localStorage.setItem('user', JSON.stringify(u));

    renderProfile();
    bootstrap.Modal.getInstance(editModal).hide();
  });
});
