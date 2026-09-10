// ЛР1 — минимальный клиентский JS для статического макета EventTix.
// Всё, что здесь есть, работает без бэкенда: фильтрация уже отрисованных карточек,
// пересчёт суммы билета и добавление отзыва в DOM. Модальные окна (вход, возврат,
// создание мероприятия) открываются штатными средствами Bootstrap через data-атрибуты.

function initEventFilters() {
  const form = document.querySelector('.js-filters-form');
  if (!form) return;

  const cards = Array.from(document.querySelectorAll('.js-event-card'));
  const emptyState = document.querySelector('.js-empty-state');
  const queryInput = form.elements.q || null;

  const applyFilters = () => {
    const type = form.elements.type ? form.elements.type.value : '';
    const city = form.elements.city ? form.elements.city.value : '';
    const date = form.elements.date ? form.elements.date.value : '';
    const query = queryInput ? queryInput.value.trim().toLowerCase() : '';

    let visibleCount = 0;

    cards.forEach((card) => {
      const title = card.querySelector('.event-card__title').textContent.toLowerCase();
      const meta = card.querySelector('.event-card__meta').textContent.toLowerCase();

      const matchesType = !type || card.dataset.type === type;
      const matchesCity = !city || card.dataset.city === city;
      // фильтр даты — это <input type="date">: показываем события с выбранного дня и позже.
      // Строки формата YYYY-MM-DD корректно сравниваются лексикографически.
      const matchesDate = !date || card.dataset.date >= date;
      const matchesQuery = !query || title.includes(query) || meta.includes(query);
      const isVisible = matchesType && matchesCity && matchesDate && matchesQuery;

      card.closest('.js-event-col').classList.toggle('d-none', !isVisible);
      if (isVisible) visibleCount += 1;
    });

    if (emptyState) {
      emptyState.classList.toggle('d-none', visibleCount > 0);
    }
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    applyFilters();
  });

  if (queryInput) {
    queryInput.addEventListener('input', applyFilters);
  }

  form.addEventListener('reset', () => {
    setTimeout(() => {
      cards.forEach((card) => card.closest('.js-event-col').classList.remove('d-none'));
      if (emptyState) emptyState.classList.add('d-none');
    });
  });

  // Подхватываем поисковый запрос, переданный с главной страницы: events.html?q=...
  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get('q');
  if (initialQuery && queryInput) {
    queryInput.value = initialQuery;
    applyFilters();
  }
}

function initTicketQuantity() {
  const quantityInput = document.querySelector('.js-ticket-quantity');
  const priceEl = document.querySelector('.js-ticket-total');
  const priceSource = document.querySelector('.js-ticket-price');

  if (!quantityInput || !priceEl || !priceSource) return;

  const unitPrice = Number(priceSource.dataset.price) || 0;

  const updateTotal = () => {
    const quantity = Number(quantityInput.value) || 1;
    priceEl.textContent = `${quantity * unitPrice} ₽`;
  };

  quantityInput.addEventListener('input', updateTotal);
  updateTotal();
}

function initReviewForm() {
  const form = document.querySelector('.js-review-form');
  const list = document.querySelector('.js-review-list');
  if (!form || !list) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const author = form.elements.author.value.trim();
    const text = form.elements.text.value.trim();
    const rating = Number(form.elements.rating.value);

    if (!author || !text) return;

    // Карточка собирается через createElement + textContent, а не через innerHTML:
    // имя и текст отзыва вводит пользователь, и подстановка их в HTML-строку
    // означала бы XSS — введённая разметка выполнилась бы как код страницы.
    const authorEl = document.createElement('span');
    authorEl.className = 'review-card__author';
    authorEl.textContent = author;

    const ratingEl = document.createElement('span');
    ratingEl.className = 'review-card__rating';
    ratingEl.textContent = '★'.repeat(rating) + '☆'.repeat(5 - rating);

    const head = document.createElement('div');
    head.className = 'd-flex justify-content-between';
    head.appendChild(authorEl);
    head.appendChild(ratingEl);

    const textEl = document.createElement('p');
    textEl.className = 'mb-0 mt-1';
    textEl.textContent = text;

    const reviewCard = document.createElement('li');
    reviewCard.className = 'review-card mb-3';
    reviewCard.appendChild(head);
    reviewCard.appendChild(textEl);

    list.prepend(reviewCard);
    form.reset();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initEventFilters();
  initTicketQuantity();
  initReviewForm();
});
