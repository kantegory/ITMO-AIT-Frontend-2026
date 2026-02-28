/**
 * Lab1: ProjectHub — client-side scripts
 * Модальные окна открываются через Bootstrap (data-bs-toggle="modal").
 * Ниже — вспомогательная логика при необходимости.
 */

(function () {
  'use strict';

  // Закрытие модального окна по клику вне его и по Escape уже обеспечивает Bootstrap.
  // Пример: логирование открытия модалки «Роли и права» для отладки/аналитики.
  var modalRoles = document.getElementById('modalRoles');
  if (modalRoles) {
    modalRoles.addEventListener('show.bs.modal', function () {
      console.debug('Modal "Роли и права" opened');
    });
  }
})();
