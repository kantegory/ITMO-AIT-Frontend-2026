import { login, signup } from '../authentication.js';

export function initAuthPage() {
    const signupForm = document.querySelector('#signupModal form');
    signupForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('signupUsername').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        await signup(username, email, password);
    });

    const loginForm = document.querySelector('#loginModal form');
    loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        await login(email, password);
    });
}