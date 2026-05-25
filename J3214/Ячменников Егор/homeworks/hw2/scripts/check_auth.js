const currentUser = JSON.parse(localStorage.getItem('currentUser'));

if (currentUser.role === "organizer") {
    const nameBlock = document.getElementById('org-name');

    nameBlock.innerHTML = `Организатор: ${currentUser.name}`
} else {
    const authNavContainer = document.getElementById('auth-btn');
    if (currentUser && authNavContainer) {
        authNavContainer.innerHTML = `
            <span class="navbar-text me-3">Привет, <a href="user_profile.html"><strong>${currentUser.name}</strong></a></span>
            <button class="btn btn-danger btn-sm" id="btn-logout">Выйти</button>
        `;
    }
}

if (window.location.pathname.endsWith('user_profile.html')) {
    const userName = document.getElementById('user-profile-name');
    userName.innerHTML = currentUser.name;
}

document.getElementById('btn-logout').addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
});