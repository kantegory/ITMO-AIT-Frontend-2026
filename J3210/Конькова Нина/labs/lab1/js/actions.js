// Имитация уведомлений
function showActionToast(message) {
    alert(message);
}

document.addEventListener('DOMContentLoaded', function () {
    // Обработка кнопок управления моделями
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

    // Имитация работы с артефакт-стором
    const downloadBtns = document.querySelectorAll('.btn-outline-primary, .btn-link');
    downloadBtns.forEach(btn => {
        if (btn.innerText.includes('Download') || btn.innerText.includes('Open')) {
            btn.addEventListener('click', function(e) {
                if (this.getAttribute('href') === '#' || !this.hasAttribute('href')) {
                    e.preventDefault();
                    showActionToast("Подготовка файла к скачиванию... Запрос к хранилищу S3 отправлен.");
                }
            });
        }
    });
});