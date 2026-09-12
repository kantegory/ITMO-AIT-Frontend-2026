const searchInput = document.getElementById('order-search');
const typeFilter = document.getElementById('order-type-filter');
const orderCols = document.querySelectorAll('.order-col');
const emptyMsg = document.getElementById('orders-empty');

function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();
    const type = typeFilter.value;
    let visible = 0;

    orderCols.forEach((col) => {
        const nameMatch = !query || col.dataset.name.toLowerCase().includes(query);
        const typeMatch = !type || col.dataset.type === type;
        const show = nameMatch && typeMatch;
        col.classList.toggle('d-none', !show);
        if (show) visible++;
    });

    emptyMsg.classList.toggle('d-none', visible > 0);
}

searchInput.addEventListener('input', applyFilters);
typeFilter.addEventListener('change', applyFilters);
