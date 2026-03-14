document.addEventListener("DOMContentLoaded", () => {
    // Инициализация тултипов Bootstrap
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Фильтрация (визуальная)
    const filterBtn = document.getElementById('applyFilterBtn');
    if(filterBtn) {
        filterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const searchInput = document.getElementById('searchCourse').value;
            const originalText = filterBtn.innerHTML;
            filterBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Ищем...';
            
            setTimeout(() => {
                filterBtn.innerHTML = originalText;
                alert(searchInput ? `Поиск по запросу "${searchInput}" выполнен.` : 'Фильтры применены!');
            }, 800);
        });
    }

    // Редирект авторизации
    const authForm = document.getElementById('authForm');
    if(authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            window.location.href = 'profile.html';
        });
    }
});