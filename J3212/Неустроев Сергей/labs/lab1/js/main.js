// ЛР1 — клиентский JS (на чистом JS, без фреймворков)
// Вариант №4: личные финансы

document.addEventListener('DOMContentLoaded', () => {
  console.log('ЛР1 инициализирована');

  // --- Пример: простая клиентская валидация форм (Bootstrap validation) ---
  const forms = document.querySelectorAll('.needs-validation');
  forms.forEach((form) => {
    form.addEventListener('submit', (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
      // TODO: здесь в ЛР2 заменить на реальную отправку на API (fetch/axios)
    });
  });

  // --- TODO: открытие модальных окон, переключение вкладок и т.п. ---
  // Bootstrap-модалки работают через data-bs-* атрибуты, доп. JS обычно не нужен.
});

// TODO (ЛР1): продумать, где нужен JS:
//  - открытие модального окна "Добавить транзакцию"
//  - переключение периода в отчётах
//  - фильтрация транзакций на странице поиска (можно временно на статике)
