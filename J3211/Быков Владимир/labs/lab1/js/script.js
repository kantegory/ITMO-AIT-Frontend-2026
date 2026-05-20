const pageLinks = document.querySelectorAll('[data-page-link]');
const pages = document.querySelectorAll('[data-page]');

function showPage(pageName) {
    pages.forEach((page) => {
        page.classList.toggle('is-active', page.dataset.page === pageName);
    });

    window.scrollTo(0, 0);
}

pageLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        showPage(link.dataset.pageLink);
    });
});

const statusFilter = document.querySelector('#statusFilter');
const typeFilter = document.querySelector('#typeFilter');
const workerFilter = document.querySelector('#workerFilter');
const resetFilters = document.querySelector('#resetFilters');
const projectCards = document.querySelectorAll('.project-card');

function isFilterMatched(card, filterName, filterValue) {
    return filterValue === 'all' || card.dataset[filterName] === filterValue;
}

function updateProjectList() {
    projectCards.forEach((card) => {
        const isMatched =
            isFilterMatched(card, 'status', statusFilter.value) &&
            isFilterMatched(card, 'type', typeFilter.value) &&
            isFilterMatched(card, 'worker', workerFilter.value);

        card.classList.toggle('is-hidden', !isMatched);
    });
}

statusFilter.addEventListener('change', updateProjectList);
typeFilter.addEventListener('change', updateProjectList);
workerFilter.addEventListener('change', updateProjectList);

resetFilters.addEventListener('click', () => {
    statusFilter.value = 'all';
    typeFilter.value = 'all';
    workerFilter.value = 'all';
    updateProjectList();
});
