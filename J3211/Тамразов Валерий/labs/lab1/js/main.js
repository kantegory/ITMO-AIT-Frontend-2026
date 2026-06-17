// Показать/скрыть пароль на странице входа
document.addEventListener('DOMContentLoaded', function() {
    var toggleBtn = document.getElementById('togglePassword');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            var passwordInput = document.getElementById('password');
            var icon = this.querySelector('i');
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('bi-eye');
                icon.classList.add('bi-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('bi-eye-slash');
                icon.classList.add('bi-eye');
            }
        });
    }

    // Фильтрация пайплайнов
    var searchInput = document.getElementById('searchInput');
    var statusCheckboxes = document.querySelectorAll('.filter-status');
    var envFilter = document.getElementById('envFilter');
    var ownerFilter = document.getElementById('ownerFilter');
    var resetBtn = document.getElementById('resetFilters');

    function filterPipelines() {
        var cards = document.querySelectorAll('#pipelinesList .pipeline-card');
        if (cards.length === 0) return;

        var searchText = searchInput ? searchInput.value.toLowerCase() : '';

        var checkedStatuses = [];
        statusCheckboxes.forEach(function(cb) {
            if (cb.checked) checkedStatuses.push(cb.value);
        });

        var selectedEnv = envFilter ? envFilter.value : 'all';
        var selectedOwner = ownerFilter ? ownerFilter.value : 'all';

        var visibleCount = 0;

        cards.forEach(function(card) {
            var name = card.getAttribute('data-name') || '';
            var status = card.getAttribute('data-status') || '';
            var env = card.getAttribute('data-env') || '';
            var owner = card.getAttribute('data-owner') || '';

            var matchSearch = name.toLowerCase().indexOf(searchText) !== -1;
            var matchStatus = checkedStatuses.indexOf(status) !== -1;
            var matchEnv = selectedEnv === 'all' || env === selectedEnv;
            var matchOwner = selectedOwner === 'all' || owner === selectedOwner;

            if (matchSearch && matchStatus && matchEnv && matchOwner) {
                card.style.display = '';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        var noResults = document.getElementById('noResults');
        if (noResults) {
            if (visibleCount === 0) {
                noResults.classList.remove('d-none');
            } else {
                noResults.classList.add('d-none');
            }
        }
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterPipelines);
    }
    statusCheckboxes.forEach(function(cb) {
        cb.addEventListener('change', filterPipelines);
    });
    if (envFilter) {
        envFilter.addEventListener('change', filterPipelines);
    }
    if (ownerFilter) {
        ownerFilter.addEventListener('change', filterPipelines);
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            if (searchInput) searchInput.value = '';
            statusCheckboxes.forEach(function(cb) { cb.checked = true; });
            if (envFilter) envFilter.value = 'all';
            if (ownerFilter) ownerFilter.value = 'all';
            filterPipelines();
        });
    }

    // Обработка отправки форм (login, register)
    var forms = document.querySelectorAll('.auth-card form');
    forms.forEach(function(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            var inputs = form.querySelectorAll('input[required]');
            var isValid = true;

            inputs.forEach(function(input) {
                if (!input.value.trim()) {
                    input.classList.add('is-invalid');
                    isValid = false;
                } else {
                    input.classList.remove('is-invalid');
                }
            });

            // Проверка совпадения паролей на странице регистрации
            var password = document.getElementById('regPassword');
            var confirm = document.getElementById('confirmPassword');
            if (password && confirm && password.value !== confirm.value) {
                confirm.classList.add('is-invalid');
                isValid = false;
            }

            if (isValid) {
                alert('Форма отправлена (демо)');
            }
        });
    });

    // Убираем is-invalid при вводе
    document.querySelectorAll('.auth-card input').forEach(function(input) {
        input.addEventListener('input', function() {
            this.classList.remove('is-invalid');
        });
    });
});
