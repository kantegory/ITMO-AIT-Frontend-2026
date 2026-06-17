/**
 * Логика валидации форм регистрации и входа.
 */
(function () {
    'use strict'

    // Ждем загрузки DOM, чтобы элементы были доступны
    document.addEventListener('DOMContentLoaded', function() {
        var forms = document.querySelectorAll('.needs-validation')

        // Превращаем коллекцию в массив и перебираем
        Array.prototype.slice.call(forms).forEach(function (form) {
            form.addEventListener('submit', function (event) {

                // Проверка совпадения паролей
                var pass = document.getElementById('password');
                var conf = document.getElementById('confirmPassword');

                // Проверяем, существуют ли оба поля на текущей странице (чтобы не было ошибок в консоли)
                if (pass && conf) {
                    if (pass.value !== conf.value) {
                        // Если не совпадают - помечаем поле как невалидное
                        conf.setCustomValidity('Invalid');
                    } else {
                        // Если совпали - убираем кастомную ошибку
                        conf.setCustomValidity('');
                    }
                }

                // Проверка Bootstrap
                if (!form.checkValidity()) {
                    // Если форма не прошла проверку - отменяем отправку (переход на другую страницу)
                    event.preventDefault()
                    event.stopPropagation()
                }

                // Добавляем технический класс Bootstrap, который включает CSS-подсветку (зеленый/красный)
                form.classList.add('was-validated')
            }, false)
        })
    })
})()