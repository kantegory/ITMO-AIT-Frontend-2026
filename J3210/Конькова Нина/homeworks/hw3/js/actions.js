function showActionToast(message) {
    const toastEl = document.getElementById('liveToast');

    const toastBody = toastEl.querySelector('.toast-body');
    toastBody.textContent = message;

    const toast = new bootstrap.Toast(toastEl, {
        autohide: true,
        delay: 5000
    });
    toast.show();
}

document.addEventListener('DOMContentLoaded', function () {
    const modelButtons = document.querySelectorAll('.btn-sm');
    modelButtons.forEach(btn => {
        if (!btn.hasAttribute('href')) {
            btn.addEventListener('click', function(e) {
                const action = this.innerText.trim();
                const row = this.closest('tr');
                if (!row) return;

                const modelName = row.cells[0].innerText.trim();

                const messages = {
                    "Rollback": `Откат версии для модели: ${modelName} запущен.`,
                    "Deploy": `Модель ${modelName} разворачивается в Production.`,
                    "Promote": `Перевод ${modelName} из Staging в Production выполнен!`,
                    "Archive": `Модель ${modelName} перемещена в архив.`,
                    "Restore": `Модель ${modelName} восстановлена из архива.`
                };

                showActionToast(messages[action] || `Действие ${action} инициировано.`);
            });
        }
    });

     const fileActions = document.querySelectorAll('.btn-outline-primary, .btn-link, .btn-dark');

    fileActions.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const text = this.innerText.trim();

            if (this.getAttribute('href') === '#' || !this.hasAttribute('href')) {
                e.preventDefault();

                const fileName = this.closest('.list-group-item')
                                 ? this.closest('.list-group-item').querySelector('span').innerText.trim()
                                 : "модели";

                if (text.includes('Download Model')) {
                    showActionToast("Подготовка полного архива весов модели (.pth)... Сборка начата.");
                }
                else if (text.includes('Download')) {
                    showActionToast(`Загрузка файла ${fileName} из хранилища S3...`);
                }
                else if (text.includes('View')) {
                    showActionToast(`Генерация превью для визуализации: ${fileName}`);
                }
                else if (text.includes('Open')) {
                    showActionToast(`Чтение сырых данных из ${fileName}... Загрузка таблицы.`);
                }
            }
        });
    });
});