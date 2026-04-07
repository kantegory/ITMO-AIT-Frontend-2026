import { updateHeaderAuthUI } from './auth-ui.js';
import { initLoginPage } from './login-page.js';
import { initRegisterPage } from './register-page.js';
import { initCatalogPage } from './catalog-page.js';
import { initCoursePage } from './course-page.js';
import { initProfilePage } from './profile-page.js';

document.addEventListener('DOMContentLoaded', () => {
    updateHeaderAuthUI();

    const page = window.location.pathname.split('/').pop();

    switch (page) {
        case 'login.html':
            initLoginPage();
            break;
        case 'register.html':
            initRegisterPage();
            break;
        case 'courses.html':
            initCatalogPage();
            break;
        case 'course.html':
            initCoursePage();
            break;
        case 'profile.html':
            initProfilePage();
            break;
        default:
            break;
    }

    const themeButton = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }

    if (themeButton) {
        themeButton.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');

            if (document.body.classList.contains('dark-theme')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
    }
});