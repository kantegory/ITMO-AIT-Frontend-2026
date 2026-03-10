(function () {
  const buyButtons = document.querySelectorAll('[data-buy]');
  const buyEventName = document.getElementById('buyEventName');
  const buyConfirmButton = document.getElementById('buyConfirmButton');

  buyButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-title') || 'Мероприятие';
      if (buyEventName) buyEventName.textContent = title;
    });
  });

  if (buyConfirmButton) {
    buyConfirmButton.addEventListener('click', () => {
      buyConfirmButton.disabled = true;
      buyConfirmButton.textContent = 'Оформлено';

      setTimeout(() => {
        buyConfirmButton.disabled = false;
        buyConfirmButton.textContent = 'Подтвердить покупку';
      }, 1200);
    });
  }
})();
