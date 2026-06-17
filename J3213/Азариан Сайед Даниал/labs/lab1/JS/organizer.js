function initOrganizerPage() {
  const organizerIdentity = document.getElementById("organizerIdentity");
  if (!organizerIdentity) {
    return;
  }

  let currentUser = getCurrentUser();
  if (!currentUser) {
    window.location.href = "auth.html";
    return;
  }
  if (currentUser.accountType !== "organizer") {
    window.location.href = "profile.html";
    return;
  }

  if (!Array.isArray(currentUser.organizerEvents)) {
    currentUser.organizerEvents = [];
    updateStoredUser(currentUser);
  }

  const organizerMessage = document.getElementById("organizerMessage");
  const createEventForm = document.getElementById("createEventForm");
  const eventNameInput = document.getElementById("eventNameInput");
  const eventCategoryInput = document.getElementById("eventCategoryInput");
  const eventDateInput = document.getElementById("eventDateInput");
  const eventCityInput = document.getElementById("eventCityInput");
  const eventVenueInput = document.getElementById("eventVenueInput");
  const eventPriceInput = document.getElementById("eventPriceInput");
  const eventTimeInput = document.getElementById("eventTimeInput");
  const eventAgeInput = document.getElementById("eventAgeInput");
  const eventPosterInput = document.getElementById("eventPosterInput");
  const eventDescriptionInput = document.getElementById("eventDescriptionInput");
  const organizerEventsList = document.getElementById("organizerEventsList");
  const organizerLogoutBtn = document.getElementById("organizerLogoutBtn");

  organizerIdentity.textContent = `${currentUser.name} • ${currentUser.email}`;

  function toReadableDate(dateValue) {
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return dateValue;
    return date.toLocaleDateString("ru-RU");
  }

  function showOrganizerMessage(text, type) {
    if (!organizerMessage) return;
    organizerMessage.innerHTML = `<div class="alert alert-${type} py-2 px-3 mb-0">${escapeHtml(text)}</div>`;
    window.setTimeout(() => {
      organizerMessage.innerHTML = "";
    }, 2200);
  }

  function persistCurrentUser() {
    updateStoredUser(currentUser);
  }

  function renderOrganizerEvents() {
    const events = currentUser.organizerEvents || [];
    if (!events.length) {
      organizerEventsList.innerHTML = '<div class="empty-state">Вы еще не создали ни одного события.</div>';
      return;
    }

    organizerEventsList.innerHTML = events
      .map((eventItem) => {
        return `
          <article class="org-event-card">
            <div class="d-flex justify-content-between align-items-start gap-2 flex-wrap">
              <div>
                <h3 class="h6 m-0">${escapeHtml(eventItem.name)}</h3>
                <p class="small text-secondary m-0">${escapeHtml(eventItem.category)} • ${escapeHtml(eventItem.date)} • ${escapeHtml(eventItem.city)}</p>
                <p class="small text-secondary m-0">${escapeHtml(eventItem.time || "19:00")} • ${escapeHtml(eventItem.age || "6+")}</p>
                <p class="small text-secondary m-0">${escapeHtml(eventItem.venue)} • ${Number(eventItem.price).toLocaleString("ru-RU")} ₽</p>
              </div>
              <span class="badge text-bg-light border">Опубликовано</span>
            </div>
          </article>
        `;
      })
      .join("");
  }

  function renderOrganizerPage() {
    renderOrganizerEvents();
  }

  createEventForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!createEventForm.checkValidity()) {
      createEventForm.classList.add("was-validated");
      return;
    }

    const newEvent = {
      id: generateId("org_event"),
      name: eventNameInput.value.trim(),
      category: eventCategoryInput.value,
      dateIso: eventDateInput.value,
      date: toReadableDate(eventDateInput.value),
      time: eventTimeInput.value,
      city: eventCityInput.value.trim(),
      venue: eventVenueInput.value.trim(),
      age: eventAgeInput.value,
      description: eventDescriptionInput.value.trim(),
      posterImage: eventPosterInput.value.trim(),
      price: Number(eventPriceInput.value),
    };

    currentUser.organizerEvents.unshift(newEvent);
    persistCurrentUser();
    renderOrganizerPage();

    createEventForm.reset();
    createEventForm.classList.remove("was-validated");
    showOrganizerMessage("Событие создано.", "success");
  });

  if (organizerLogoutBtn) {
    organizerLogoutBtn.addEventListener("click", (event) => {
      event.preventDefault();
      clearCurrentUserId();
      window.location.href = "auth.html";
    });
  }

  renderOrganizerPage();
}

initOrganizerPage();
