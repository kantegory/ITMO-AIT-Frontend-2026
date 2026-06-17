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