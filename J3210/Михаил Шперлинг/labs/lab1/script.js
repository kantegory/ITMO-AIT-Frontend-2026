document.addEventListener("DOMContentLoaded", function() {

    const bindFormValidation = (formId) => {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                } else {
                    event.preventDefault();
                    window.location.href = 'profile.html';
                }
                form.classList.add('was-validated');
            }, false);
        }
    };

    bindFormValidation('registerForm');
    bindFormValidation('loginForm');

    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.querySelector('.input-group .btn-primary');
    const modelCols = document.querySelectorAll('.model-col');
    const taskFilters = document.querySelectorAll('.task-filter');
    const frameworkSelect = document.getElementById('frameworkSelect');
    const formatSelect = document.getElementById('formatSelect');

    function applyFilters() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
        
        const activeTasks = Array.from(taskFilters)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        const selectedFramework = frameworkSelect ? frameworkSelect.value : 'all';
        const selectedFormat = formatSelect ? formatSelect.value : 'all';

        modelCols.forEach(col => {
            const card = col.querySelector('.model-card');
            if (!card) return;

            const title = card.querySelector('.card-title').innerText.toLowerCase();
            const desc = card.querySelector('.card-text').innerText.toLowerCase();
            
            const task = col.getAttribute('data-task');
            const framework = col.getAttribute('data-framework');
            const format = col.getAttribute('data-format');

            const matchesText = title.includes(query) || desc.includes(query);
            const matchesTask = activeTasks.length === 0 || activeTasks.includes(task);
            const matchesFramework = selectedFramework === 'all' || selectedFramework === framework;
            const matchesFormat = selectedFormat === 'all' || selectedFormat === format;

            if (matchesText && matchesTask && matchesFramework && matchesFormat) {
                col.style.display = 'block';
            } else {
                col.style.display = 'none';
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
        if (searchBtn) searchBtn.addEventListener('click', applyFilters);
    }

    taskFilters.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });

    if (frameworkSelect) {
        frameworkSelect.addEventListener('change', applyFilters);
    }

    if (formatSelect) {
        formatSelect.addEventListener('change', applyFilters);
    }

});