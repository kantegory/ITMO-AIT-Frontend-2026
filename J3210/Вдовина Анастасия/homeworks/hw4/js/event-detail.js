function getEventIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

function renderBadges(event) {
  const wrap = document.querySelector('.js-badges');
  wrap.innerHTML = event.badges.map((badge) => `<span class="badge text-bg-light">${badge}</span>`).join('');
}

// текст пишет пользователь: через textContent, иначе введённый тег выполнится как код
function createReviewCard(review) {
  const author = document.createElement('span');
  author.className = 'review-card__author';
  author.textContent = review.author;

  const rating = document.createElement('span');
  rating.className = 'review-card__rating';
  rating.textContent = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
  rating.setAttribute('aria-label', `Оценка ${review.rating} из 5`);

  const head = document.createElement('div');
  head.className = 'd-flex justify-content-between';
  head.appendChild(author);
  head.appendChild(rating);

  const text = document.createElement('p');
  text.className = 'mb-0 mt-1';
  text.textContent = review.text;

  const card = document.createElement('li');
  card.className = 'review-card mb-3';
  card.appendChild(head);
  card.appendChild(text);
  return card;
}

function renderReviews(event) {
  const list = document.querySelector('.js-review-list');
  list.innerHTML = '';

  if (event.reviews.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'text-muted';
    empty.textContent = 'Отзывов пока нет — будьте первым.';
    list.appendChild(empty);
    return;
  }

  event.reviews.forEach((review) => list.appendChild(createReviewCard(review)));
}

function renderPricing(event) {
  const section = document.querySelector('.js-pricing-section');
  if (!event.priceTiers || event.priceTiers.length === 0) return;

  section.classList.remove('d-none');
  const body = document.querySelector('.js-pricing-body');
  body.innerHTML = event.priceTiers
    .map((tier) => `<tr><td>${tier.name}</td><td>${tier.price}</td></tr>`)
    .join('');
}

function renderSidebar(event) {
  const sidebar = document.querySelector('.js-sidebar');

  if (event.free) {
    const options = event.participationOptions;
    const optionsBlock = options
      ? `
      <label for="participationOption" class="form-label">${options.label}</label>
      <select id="participationOption" class="form-select mb-3 js-participation-option">
        ${options.values.map((value) => `<option>${value}</option>`).join('')}
      </select>
    `
      : '';

    sidebar.innerHTML = `
      <h2 class="h5">Участие</h2>
      <p class="fw-semibold fs-4">Бесплатно</p>
      <p class="text-muted">${event.participationNote}</p>
      ${optionsBlock}
      <button type="button" class="btn btn-brand w-100 js-open-action"><svg class="icon" aria-hidden="true"><use href="img/sprite.svg#icon-ticket"></use></svg> Записаться</button>
    `;
  } else {
    sidebar.innerHTML = `
      <h2 class="h5">Билеты</h2>
      <p class="js-ticket-price fw-semibold fs-4" data-price="${event.priceFrom}">${event.priceLabel}</p>
      <label for="ticketQuantity" class="form-label">Количество</label>
      <input type="number" id="ticketQuantity" class="form-control mb-3 js-ticket-quantity" value="1" min="1" max="10">
      <p class="mb-3">Итого от: <span class="fw-semibold js-ticket-total">${event.priceFrom} ₽</span></p>
      <button type="button" class="btn btn-brand w-100 js-open-action"><svg class="icon" aria-hidden="true"><use href="img/sprite.svg#icon-ticket"></use></svg> Купить билет</button>
    `;

    const quantityInput = sidebar.querySelector('.js-ticket-quantity');
    const totalEl = sidebar.querySelector('.js-ticket-total');
    quantityInput.addEventListener('input', () => {
      const quantity = Number(quantityInput.value) || 1;
      totalEl.textContent = `${quantity * event.priceFrom} ₽`;
    });
  }

  sidebar.querySelector('.js-open-action').addEventListener('click', () => openActionModal(event));
}

function buildModalContent(event) {
  const content = document.querySelector('.js-modal-content');

  if (event.free) {
    content.innerHTML = `
      <div class="modal-header">
        <h2 class="modal-title h5 js-modal-title" id="actionModalLabel"></h2>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
      </div>
      <div class="modal-body">
        <div class="alert alert-danger js-modal-error d-none" role="alert"></div>
        <div class="mb-3">
          <label for="regFullName" class="form-label">Имя и фамилия</label>
          <input type="text" id="regFullName" class="form-control" required>
        </div>
        <div class="mb-3">
          <label for="regEmail" class="form-label">Email</label>
          <input type="email" id="regEmail" class="form-control" required>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Отмена</button>
        <button type="button" class="btn btn-brand js-confirm-action">Записаться</button>
      </div>
    `;
  } else {
    const categoryOptions = (event.priceTiers.length > 0 ? event.priceTiers.map((t) => t.name) : ['Стандарт'])
      .map((name) => `<option>${name}</option>`)
      .join('');

    content.innerHTML = `
      <div class="modal-header">
        <h2 class="modal-title h5" id="actionModalLabel">Оформление билета</h2>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
      </div>
      <div class="modal-body">
        <p class="js-modal-event"></p>
        <div class="alert alert-danger js-modal-error d-none" role="alert"></div>
        <div class="mb-3">
          <label for="ticketCategory" class="form-label">Категория</label>
          <select id="ticketCategory" class="form-select">${categoryOptions}</select>
        </div>
        <div class="mb-3">
          <label for="ticketEmail" class="form-label">Email для отправки билета</label>
          <input type="email" id="ticketEmail" class="form-control" required>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Отмена</button>
        <button type="button" class="btn btn-brand js-confirm-action">Подтвердить покупку</button>
      </div>
    `;
  }

  const modalTitle = content.querySelector('.js-modal-title');
  if (modalTitle) modalTitle.textContent = `Запись на «${event.title}»`;

  const modalEventLine = content.querySelector('.js-modal-event');
  if (modalEventLine) modalEventLine.textContent = `${event.title} · ${event.dateLabel}`;

  content.querySelector('.js-confirm-action').addEventListener('click', () => confirmAction(event));
}

async function confirmAction(event) {
  const content = document.querySelector('.js-modal-content');
  const errorBox = content.querySelector('.js-modal-error');
  const user = getCurrentUser();

  if (!user) {
    errorBox.textContent = 'Нужно войти в аккаунт, чтобы записаться или купить билет.';
    errorBox.classList.remove('d-none');
    return;
  }

  const participationOption = document.querySelector('.js-participation-option');
  let category;
  if (!event.free) {
    category = content.querySelector('#ticketCategory').value;
  } else if (participationOption) {
    category = participationOption.value;
  } else {
    category = 'Бесплатная регистрация';
  }

  try {
    await createTicket({ userId: Number(user.id), eventId: event.id, category, status: 'active' });
    const modalEl = document.getElementById('actionModal');
    bootstrap.Modal.getOrCreateInstance(modalEl).hide();
    window.location.href = 'profile.html';
  } catch (error) {
    errorBox.textContent = 'Не удалось оформить запись. Попробуйте ещё раз.';
    errorBox.classList.remove('d-none');
  }
}

function openActionModal(event) {
  buildModalContent(event);
  const modalEl = document.getElementById('actionModal');
  bootstrap.Modal.getOrCreateInstance(modalEl).show();
}

function initReviewForm(event) {
  const form = document.querySelector('.js-review-form');
  const list = document.querySelector('.js-review-list');
  const user = getCurrentUser();

  if (!isAuthenticated() || !user) {
    form.innerHTML = '';
    const hint = document.createElement('p');
    hint.className = 'text-muted mb-0';
    hint.textContent = 'Чтобы оставить отзыв, войдите в аккаунт.';
    const link = document.createElement('a');
    link.href = 'login.html';
    link.textContent = 'Войти';
    hint.append(' ');
    hint.appendChild(link);
    form.appendChild(hint);
    return;
  }

  form.elements.author.value = user.name;

  const errorBox = document.createElement('div');
  errorBox.className = 'alert alert-danger mt-3 d-none';
  errorBox.setAttribute('role', 'alert');
  form.appendChild(errorBox);

  form.addEventListener('submit', async (submitEvent) => {
    submitEvent.preventDefault();
    errorBox.classList.add('d-none');

    const author = form.elements.author.value.trim();
    const text = form.elements.text.value.trim();
    const rating = Number(form.elements.rating.value);
    if (!author || !text) return;

    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;

    const review = { author, rating, text };

    try {
      const updated = await saveEventReviews(event.id, [review].concat(event.reviews));
      event.reviews = updated.reviews;
      renderReviews(event);
      form.elements.text.value = '';
    } catch (error) {
      errorBox.textContent = 'Не удалось сохранить отзыв. Попробуйте ещё раз.';
      errorBox.classList.remove('d-none');
    } finally {
      button.disabled = false;
    }
  });
}

async function initEventDetailPage() {
  const id = getEventIdFromUrl();
  const loading = document.querySelector('.js-loading');
  const errorBox = document.querySelector('.js-error');
  const article = document.querySelector('.js-event-article');

  if (!id) {
    loading.classList.add('d-none');
    errorBox.textContent = 'Мероприятие не указано.';
    errorBox.classList.remove('d-none');
    return;
  }

  try {
    const event = await getEventById(id);

    document.title = `${event.title} — EventTix`;
    document.querySelector('.js-breadcrumb-current').textContent = event.title;
    document.querySelector('.js-hero').style.backgroundImage = `url('${event.image}')`;
    const heroImage = document.createElement('img');
    heroImage.src = event.image;
    heroImage.className = 'event-hero__image';
    heroImage.alt = `Афиша: ${event.title}`;
    document.querySelector('.js-hero').replaceChildren(heroImage);
    document.querySelector('.js-title').textContent = event.title;
    document.querySelector('.js-meta').textContent = `${event.dateLabel}${event.timeLabel ? ', ' + event.timeLabel : ''} · ${event.venueFull}`;
    document.querySelector('.js-description').textContent = event.description;
    document.querySelector('.js-venue-description').textContent = event.venueDescription;
    document.querySelector('.js-venue-map-label').textContent = event.venueMapLabel;

    if (event.warning) {
      const warningBox = document.querySelector('.js-warning');
      warningBox.innerHTML = `<strong>Внимание.</strong> ${event.warning}`;
      warningBox.classList.remove('d-none');
    }

    renderBadges(event);
    renderPricing(event);
    renderReviews(event);
    renderSidebar(event);
    initReviewForm(event);

    loading.classList.add('d-none');
    article.classList.remove('d-none');
  } catch (error) {
    loading.classList.add('d-none');
    errorBox.textContent = 'Мероприятие не найдено. Убедитесь, что json-server запущен (npm run api).';
    errorBox.classList.remove('d-none');
  }
}

document.addEventListener('DOMContentLoaded', initEventDetailPage);