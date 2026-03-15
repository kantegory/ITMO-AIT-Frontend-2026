function toggleTheme() {
    const html = document.documentElement;
    const icon = document.getElementById('themeIcon');
    
    if (html.getAttribute('data-bs-theme') === 'dark') {
        html.setAttribute('data-bs-theme', 'light');
        icon.classList.remove('bi-sun-fill');
        icon.classList.add('bi-moon-fill');
        localStorage.setItem('theme', 'light');
    } else {
        html.setAttribute('data-bs-theme', 'dark');
        icon.classList.remove('bi-moon-fill');
        icon.classList.add('bi-sun-fill');
        localStorage.setItem('theme', 'dark');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const html = document.documentElement;
    const icon = document.getElementById('themeIcon');
    
    html.setAttribute('data-bs-theme', savedTheme);
    if (savedTheme === 'dark' && icon) {
        icon.classList.remove('bi-moon-fill');
        icon.classList.add('bi-sun-fill');
    }

    const forms = document.querySelectorAll('.needs-validation');
    forms.forEach(function(form) {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });
});

function applyFilters() {
    const categories = Array.from(document.querySelectorAll('.filter-category:checked')).map(el => el.value);
    const levels = Array.from(document.querySelectorAll('.filter-level:checked')).map(el => el.value);
    const prices = Array.from(document.querySelectorAll('.filter-price:checked')).map(el => el.value);
    
    const cards = document.querySelectorAll('.course-card-wrapper');
    
    cards.forEach(function(card) {
        const category = card.dataset.category;
        const level = card.dataset.level;
        const price = card.dataset.price;
        
        const categoryMatch = categories.length === 0 || categories.includes(category);
        const levelMatch = levels.length === 0 || levels.includes(level);
        const priceMatch = prices.length === 0 || prices.includes(price);
        
        if (categoryMatch && levelMatch && priceMatch) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}