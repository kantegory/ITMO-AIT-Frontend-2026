(() => {
  window.tp = window.tp || {};

  function renderEventCards(container, events) {
    container.innerHTML = "";
    if (!events.length) {
      container.innerHTML = '<p class="text-center mt-4">По вашему запросу ничего не найдено.</p>';
      return;
    }

    events.forEach(evt => {
      const card = document.createElement("div");
      card.className = "col-md-6 col-lg-4 mb-4";
      card.innerHTML = `
        <div class="card ticket-platform__card h-100">
          <img src="${evt.poster}" class="ticket-platform__event-image card-img-top" alt="Афиша «${evt.title}»">
          <div class="card-body d-flex flex-column">
            <h3 class="card-title">${evt.title}</h3>
            <p class="mb-2"><strong>Тип:</strong> ${evt.type}</p>
            <p class="mb-2"><strong>Дата:</strong> ${evt.date}</p>
            <p class="mb-2"><strong>Место:</strong> ${evt.location}</p>
            <p class="card-text ticket-platform__text-truncate">${evt.description}</p>
            <div class="mt-auto">
              <a href="event.html?id=${evt.id}" class="btn btn-primary w-100">Подробнее</a>
            </div>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  function hideOrganizerLinks() {
    const type = localStorage.getItem("userType");
    const orgLinks = document.querySelectorAll('a[href="organizer.html"]');
    if (type !== "organizer") {
      orgLinks.forEach(link => {
        const parentLi = link.closest("li");
        if (parentLi) parentLi.style.display = "none";
        else link.style.display = "none";
      });
    }
  }

  function hideUserLinks() {
    const type = localStorage.getItem("userType");
    if (type === "organizer") {
      const userLinks = document.querySelectorAll('a[href="dashboard.html"]');
      userLinks.forEach(link => {
        const parentLi = link.closest("li");
        if (parentLi) parentLi.style.display = "none";
        else link.style.display = "none";
      });
    }
  }

  function toggleCreateForm() {
    const container = document.getElementById("createEventFormContainer");
    if (!container) return;
    container.style.display =
      container.style.display === "block" ? "none" : "block";
  }

  window.tp.renderEventCards = renderEventCards;
  window.tp.hideOrganizerLinks = hideOrganizerLinks;
  window.tp.hideUserLinks = hideUserLinks;
  window.tp.toggleCreateForm = toggleCreateForm;
})();