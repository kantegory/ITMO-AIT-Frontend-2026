export function initFilters() {
    const priceRange = document.getElementById("priceRange");
    const priceValue = document.getElementById("priceValue");
    const filterForm = document.getElementById("filterForm");
    const applyBtn = document.getElementById("applyFiltersBtn");

    if (!priceRange || !filterForm) return;

    priceRange.addEventListener("input", function () {
        priceValue.textContent = this.value;
    });

    filterForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const originalText = applyBtn.innerHTML;
        
        applyBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Загрузка...';
        applyBtn.disabled = true;

        setTimeout(() => {
            applyBtn.innerHTML = originalText;
            applyBtn.disabled = false;
            alert("Фильтры применены!");
        }, 1500);
    });
}