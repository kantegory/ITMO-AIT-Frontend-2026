const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

function applyTheme(theme) {
    htmlElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
}

const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
    const current = htmlElement.getAttribute('data-bs-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
});

document.getElementById('loginModal')?.addEventListener('shown.bs.modal', function() {
    document.getElementById('loginEmail')?.focus();
});

document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', function() {
        const input = document.getElementById(this.dataset.target);
        const icon = this.querySelector('i');
        input.type = input.type === 'password' ? 'text' : 'password';
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });
});

document.getElementById('registerPassword')?.addEventListener('input', function() {
    const val = this.value;
    const bar = document.querySelector('.strength-bar');
    const text = document.querySelector('.strength-text');
    let score = 0;
    if (val.length >= 6)
        score++;
    if (val.match(/[a-z]/) && val.match(/[A-Z]/))
        score++;
    if (val.match(/\d/))
        score++;
    if (val.match(/[^a-zA-Z\d]/))
        score++;

    const colors = ['#ff001a', '#ff7400', '#ffc107', '#389338'];
    const labels = ['Слабый', 'Средний', 'Хороший', 'Отличный'];
    const idx = Math.min(score, 3);

    bar.style.width = `${(idx + 1) * 25}%`;
    bar.style.background = colors[idx];
    text.textContent = labels[idx];
    text.className = `strength-text small text-${['danger','warning','warning','success'][idx]}`;
});