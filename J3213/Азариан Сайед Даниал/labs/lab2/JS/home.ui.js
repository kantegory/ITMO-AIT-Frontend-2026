(function initHomeUiModule() {
  const root = window;
  root.EventPassHome = root.EventPassHome || {};

  const ui = {};

  ui.showEventsStatus = function showEventsStatus(message, isError) {
    let eventsStatus = document.getElementById("eventsStatus");
    if (!eventsStatus) {
      const eventsGrid = document.getElementById("eventsGrid");
      if (!eventsGrid || !eventsGrid.parentElement) {
        return;
      }

      eventsStatus = document.createElement("div");
      eventsStatus.id = "eventsStatus";
      eventsStatus.className = "mt-3";
      eventsGrid.parentElement.appendChild(eventsStatus);
    }

    const alertClass = isError ? "alert-danger" : "alert-light";
    eventsStatus.innerHTML = `<div class="alert ${alertClass} border mb-0">${escapeHtml(message)}</div>`;
  };

  ui.renderEventCard = function renderEventCard(eventsGrid, eventItem) {
    const linkTarget = eventItem.isExternalUrl ? ' target="_blank" rel="noopener noreferrer"' : "";
    const descriptionText =
      eventItem.source === "organizer"
        ? `${eventItem.description} Организатор: ${eventItem.organizerName}.`
        : eventItem.description;

    eventsGrid.insertAdjacentHTML("beforeend", `
      <div class="col-sm-6 col-lg-4">
        <article class="event-card h-100">
          <img src="${escapeHtml(eventItem.image)}" class="event-card-img" alt="${escapeHtml(eventItem.title)}">
          <div class="p-3">
            <p class="small text-secondary mb-2">${escapeHtml(eventItem.category)} | ${escapeHtml(eventItem.dateLabel)} | ${escapeHtml(eventItem.city)}</p>
            <h3 class="h5">
              <a class="text-decoration-none text-dark" href="${escapeHtml(eventItem.url)}"${linkTarget}>
                ${escapeHtml(eventItem.title)}
              </a>
            </h3>
            <p class="text-secondary mb-3">${escapeHtml(descriptionText)}</p>
            <div class="d-flex justify-content-between align-items-center">
              <span class="fw-semibold">${
                eventItem.price.isFree
                  ? "Бесплатно"
                  : eventItem.price.isKnown
                    ? `от ${eventItem.price.value.toLocaleString("ru-RU")} руб.`
                    : "Бесплатно"
              }</span>
              <button
                class="btn btn-sm btn-outline-primary buy-ticket-btn"
                type="button"
                data-event-name="${escapeHtml(eventItem.title)}"
                data-category="${escapeHtml(eventItem.category)}"
                data-date="${escapeHtml(eventItem.dateLabel)}"
                data-date-iso="${escapeHtml(eventItem.dateIso)}"
                data-city="${escapeHtml(eventItem.city)}"
                data-seat="Электронный билет"
                data-price="${eventItem.price.value}"
              >
                Купить
              </button>
            </div>
          </div>
        </article>
      </div>
    `);
  };

  ui.clearLoadMoreControl = function clearLoadMoreControl() {
    const existingLoadMoreWrap = document.getElementById("loadMoreWrap");
    if (existingLoadMoreWrap) {
      existingLoadMoreWrap.remove();
    }
  };

  ui.createLoadMoreController = function createLoadMoreController(eventsGrid, allEvents, sourceEvents, organizerEvents, batchSize) {
    let renderedCount = 0;

    const loadMoreWrap = document.createElement("div");
    loadMoreWrap.id = "loadMoreWrap";
    loadMoreWrap.className = "text-center mt-4";
    loadMoreWrap.innerHTML = `<button class="btn btn-outline-primary" type="button" id="loadMoreEventsBtn">Показать еще ${batchSize}</button>`;
    eventsGrid.insertAdjacentElement("afterend", loadMoreWrap);

    const loadMoreButton = document.getElementById("loadMoreEventsBtn");

    function refreshLoadMoreState() {
      if (!loadMoreButton) {
        return;
      }

      const hasMore = renderedCount < allEvents.length;
      loadMoreWrap.classList.toggle("d-none", !hasMore);
      ui.showEventsStatus(
        `Показаны ${renderedCount} из ${allEvents.length} мероприятий (API: ${sourceEvents.length}, организаторы: ${organizerEvents.length}).`,
        false
      );
    }

    function renderNextBatch() {
      const nextItems = allEvents.slice(renderedCount, renderedCount + batchSize);
      nextItems.forEach((eventItem) => ui.renderEventCard(eventsGrid, eventItem));
      renderedCount += nextItems.length;

      const actions = root.EventPassHome.actions || {};
      if (typeof actions.initHomePurchaseActions === "function") {
        actions.initHomePurchaseActions();
      }
      if (typeof actions.initHomeEventSearch === "function") {
        actions.initHomeEventSearch();
      }

      refreshLoadMoreState();
    }

    return {
      renderNextBatch,
      bind() {
        renderNextBatch();
        if (loadMoreButton) {
          loadMoreButton.addEventListener("click", renderNextBatch);
        }
      },
    };
  };

  ui.renderEventsList = function renderEventsList(events, options) {
    const eventsGrid = document.getElementById("eventsGrid");
    if (!eventsGrid) {
      return;
    }

    const useLoadMore = !options || options.useLoadMore !== false;
    const batchSize = options && options.batchSize ? Number(options.batchSize) : 9;
    const emptyMessage = options && options.emptyMessage ? options.emptyMessage : "Пока нет мероприятий.";
    const organizerEvents = Array.isArray(options && options.organizerEvents) ? options.organizerEvents : [];
    const sourceEvents = Array.isArray(events) ? events : [];
    const allEvents = [...organizerEvents, ...sourceEvents];

    eventsGrid.innerHTML = "";
    ui.clearLoadMoreControl();

    if (!allEvents.length) {
      ui.showEventsStatus(emptyMessage, true);
      return;
    }

    if (!useLoadMore) {
      allEvents.slice(0, batchSize).forEach((eventItem) => ui.renderEventCard(eventsGrid, eventItem));

      const actions = root.EventPassHome.actions || {};
      if (typeof actions.initHomePurchaseActions === "function") {
        actions.initHomePurchaseActions();
      }
      if (typeof actions.initHomeEventSearch === "function") {
        actions.initHomeEventSearch();
      }

      const visibleCount = Math.min(allEvents.length, batchSize);
      ui.showEventsStatus(
        `Показаны ${visibleCount} мероприятий (API: ${sourceEvents.length}, организаторы: ${organizerEvents.length}).`,
        false
      );
      return;
    }

    const controller = ui.createLoadMoreController(eventsGrid, allEvents, sourceEvents, organizerEvents, batchSize);
    controller.bind();
  };

  root.EventPassHome.ui = ui;
})();
