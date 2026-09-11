function renderEventCard(event, headingTag = 'h2') {
  const priceText = event.free ? 'Бесплатно' : event.priceLabel;
  const dateLine = `${event.dateShort}${event.timeLabel ? ', ' + event.timeLabel : ''}`;
  const placeLine = `${event.cityLabel}, ${event.venueShort}`;

  const col = document.createElement('div');
  col.className = 'col-12 col-sm-6 col-lg-4';
  col.innerHTML = `
    <article class="card event-card h-100">
      <div class="event-card__image-wrap" style="background-image: url('${event.image}');">
        <img src="${event.image}" class="event-card__image" alt="" loading="lazy">
      </div>
      <div class="card-body event-card__body">
        <span class="badge text-bg-light align-self-start">${event.typeLabel}</span>
        <${headingTag} class="event-card__title h5"><a href="event.html?id=${event.id}" class="stretched-link text-decoration-none text-dark"></a></${headingTag}>
        <p class="event-card__meta mb-0">
          <svg class="icon" aria-hidden="true"><use href="img/sprite.svg#icon-calendar"></use></svg><span class="js-meta-date"></span>
          ·
          <svg class="icon" aria-hidden="true"><use href="img/sprite.svg#icon-pin"></use></svg><span class="js-meta-place"></span>
        </p>
        <div class="event-card__footer">
          <span class="fw-semibold">${priceText}</span>
        </div>
      </div>
    </article>
  `;

  col.querySelector('.event-card__title a').textContent = event.title;
  col.querySelector('.js-meta-date').textContent = dateLine;
  col.querySelector('.js-meta-place').textContent = placeLine;
  col.querySelector('.event-card__image').alt = `Афиша: ${event.title}, ${event.cityLabel}`;
  return col;
}

async function loadEvents(filters = {}, limit = null) {
  const grid = document.querySelector('.js-events-grid');
  const emptyState = document.querySelector('.js-empty-state');
  const loading = document.querySelector('.js-loading');

  loading.classList.remove('d-none');
  emptyState.classList.add('d-none');
  grid.innerHTML = '';

  try {
    let events = await getEvents(filters);
    if (limit) events = events.slice(0, limit);

    if (events.length === 0) {
      emptyState.textContent = 'По заданным фильтрам мероприятий не найдено. Попробуйте изменить параметры поиска.';
      emptyState.classList.remove('d-none');
      return;
    }

    const headingTag = limit ? 'h3' : 'h2';
    events.forEach((event) => grid.appendChild(renderEventCard(event, headingTag)));
  } catch (error) {
    emptyState.textContent = 'Не удалось загрузить мероприятия. Убедитесь, что json-server запущен (npm run api).';
    emptyState.classList.remove('d-none');
  } finally {
    loading.classList.add('d-none');
  }
}

function initEventsPage() {
  const grid = document.querySelector('.js-events-grid');
  if (!grid) return;

  const form = document.querySelector('.js-filters-form');
  const limit = Number(grid.dataset.limit) || null;

  if (!form) {
    loadEvents({}, limit);
    return;
  }

  const queryInput = form.elements.q || null;

  const currentFilters = () => ({
    q: queryInput ? queryInput.value.trim() : '',
    type: form.elements.type.value,
    city: form.elements.city.value,
    date: form.elements.date.value,
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    loadEvents(currentFilters());
  });

  form.addEventListener('reset', () => {
    setTimeout(() => loadEvents());
  });

  if (queryInput) {
    queryInput.addEventListener('input', () => loadEvents(currentFilters()));
  }

  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get('q');
  if (initialQuery && queryInput) {
    queryInput.value = initialQuery;
  }

  loadEvents(currentFilters(), limit);
}

document.addEventListener('DOMContentLoaded', initEventsPage);