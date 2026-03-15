document.addEventListener('DOMContentLoaded', () => {

    const searchInput = document.getElementById('searchInput');
    
    if (searchInput) {

        const courseCards = document.querySelectorAll('.course-card');

        searchInput.addEventListener('input', function() {
            const searchQuery = this.value.toLowerCase();
            courseCards.forEach(card => {
                const title = card.querySelector('.card-title').textContent.toLowerCase();
                const col = card.closest('.col');

                if (title.includes(searchQuery)) {
                    col.style.display = 'block';
                } else {
                    col.style.display = 'none';
                }
            });
        });
    }
});