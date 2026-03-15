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

    function applyFilters() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
        
        const activeTasks = Array.from(taskFilters)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        modelCols.forEach(col => {
            const card = col.querySelector('.model-card');
            if (!card) return;

            const title = card.querySelector('.card-title').innerText.toLowerCase();
            const desc = card.querySelector('.card-text').innerText.toLowerCase();
            const task = col.getAttribute('data-task');

            const matchesText = title.includes(query) || desc.includes(query);
            const matchesTask = activeTasks.length === 0 || activeTasks.includes(task);

            if (matchesText && matchesTask) {
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

});