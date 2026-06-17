window.toggleTheme = toggleTheme;

document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const lectureCards = document.querySelectorAll('.lecture-card');
    const searchInput = document.getElementById('searchInput');
    let activeFilter = 'all';

    window.checkAccess = function(lectureId, buttonElement) {
        const code = prompt('Введите кодовое слово для доступа к видео:');
        const accessCodes = {
            'parallel': 'параллель',
            'crossroad': 'перекресток',
        };
        const videoLinks = {
            'parallel': 'https://rutube.ru/video/1f72289c07471a38ed98b9f8fd1d08fd/?r=wd',
            'crossroad': 'https://rutube.ru/video/1f72289c07471a38ed98b9f8fd1d08fd/?r=wd',
        };
        if (code && code.toLowerCase() === accessCodes[lectureId]) {
            alert('Доступ разрешен! Видео скоро откроется');
            window.open(videoLinks[lectureId], '_blank');
        } else {
            alert('Неверное кодовое слово!');
        }
    };

    function filterCards() {
        const searchText = searchInput ? searchInput.value.toLowerCase().trim() : '';
        lectureCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            let categoryMatch = (activeFilter === 'all' || cardCategory === activeFilter);
            
            let searchMatch = true;
            if (searchText !== '') {
                const cardTitle = card.querySelector('h3, .h3, h4, .h4')?.innerText.toLowerCase() || '';
                const cardDesc = card.querySelector('p')?.innerText.toLowerCase() || '';
                searchMatch = cardTitle.includes(searchText) || cardDesc.includes(searchText);
            }
            
            if (categoryMatch && searchMatch) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => {
                btn.classList.remove('btn-danger', 'active');
                btn.classList.add('btn-outline-danger');
            });

            this.classList.remove('btn-outline-danger');
            this.classList.add('btn-danger', 'active');

            activeFilter = this.getAttribute('data-filter');
            filterCards();
        });
    });
    if (searchInput) {
        searchInput.addEventListener('input', filterCards);
    }
});


// дз3
function setTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        updateThemeIcon('dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        updateThemeIcon('light');
    }
}

function updateThemeIcon(theme) {
    const icon = document.getElementById('themeIcon');
    if (!icon) return; 
    if (theme === 'dark') {
        icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
    } else {
        icon.innerHTML = '<path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/>';
    }
}

function getSystemTheme() {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    } else {
        return 'light';
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');  
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        const systemTheme = getSystemTheme();
        setTheme(systemTheme);
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        setTheme('light');
    } else {
        setTheme('dark');
    }
}


document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    const themeToggle = document.getElementById('themeToggle');
    const themeToggleMobile = document.getElementById('themeToggleMobile');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    if (themeToggleMobile) {
        themeToggleMobile.addEventListener('click', toggleTheme);
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
});