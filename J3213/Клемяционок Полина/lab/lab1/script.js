document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const lectureCards = document.querySelectorAll('.lecture-card');
    const searchInput = document.getElementById('searchInput');
    let activeFilter = 'all';

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