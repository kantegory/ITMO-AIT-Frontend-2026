document.addEventListener("DOMContentLoaded", () => {
  setCurrentYear();
  initAuthForms();
  initEventFilters();
  initSeatSelection();
  initTicketReturns();
  initOrganizerTools();
});

function setCurrentYear() {
  document.querySelectorAll(".js-current-year").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}

function initAuthForms() {
  const forms = document.querySelectorAll(".js-auth-form");
  if (!forms.length) return;

  const modalElement = document.getElementById("authSuccessModal");
  const modalText = document.getElementById("auth-success-text");
  const modal = modalElement ? new bootstrap.Modal(modalElement) : null;

  forms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
      }

      const successMessage =
        form.dataset.successMessage || "Действие выполнено успешно.";

      if (modal && modalText) {
        modalText.textContent = successMessage;
        modal.show();
      }

      form.reset();
      form.classList.remove("was-validated");
    });
  });
}

function initEventFilters() {
  const form = document.getElementById("event-filter-form");
  if (!form) return;

  const cards = Array.from(document.querySelectorAll(".event-card"));
  const resultsCount = document.getElementById("results-count");
  const emptyState = document.getElementById("empty-state");
  const resetButton = document.getElementById("reset-filters");

  const applyFilters = () => {
    const type = form.elements.type.value;
    const city = form.elements.city.value;
    const datePeriod = form.elements.date.value;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let visibleCount = 0;

    cards.forEach((card) => {
      const cardType = card.dataset.type;
      const cardCity = card.dataset.city;
      const cardDate = new Date(card.dataset.date);

      const typeMatch = type === "all" || type === cardType;
      const cityMatch = city === "all" || city === cardCity;
      const dateMatch = matchesDateRange(cardDate, datePeriod, today);
      const visible = typeMatch && cityMatch && dateMatch;

      card.classList.toggle("d-none", !visible);
      if (visible) visibleCount += 1;
    });

    if (resultsCount) {
      resultsCount.textContent = String(visibleCount);
    }

    if (emptyState) {
      emptyState.classList.toggle("d-none", visibleCount > 0);
    }
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    applyFilters();
  });

  resetButton?.addEventListener("click", () => {
    form.reset();
    applyFilters();
  });

  applyFilters();
}

function matchesDateRange(date, period, today) {
  if (period === "all") return true;

  const diff = date - today;
  const daysDiff = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (period === "week") {
    return daysDiff >= 0 && daysDiff <= 7;
  }

  if (period === "month") {
    return daysDiff >= 0 && daysDiff <= 31;
  }

  return true;
}

function initSeatSelection() {
  const seatButtons = Array.from(document.querySelectorAll(".seat-btn[data-seat]"));
  if (!seatButtons.length) return;

  const selectedList = document.getElementById("selected-seats-list");
  const selectedCount = document.getElementById("selected-count");
  const openModalButton = document.getElementById("open-purchase-modal");
  const modalSeatList = document.getElementById("modal-seat-list");
  const modalTotal = document.getElementById("modal-total");
  const confirmButton = document.getElementById("confirm-purchase");
  const successAlert = document.getElementById("purchase-success");
  const pricePerSeat = Number(document.body.dataset.seatPrice || "3500");

  const purchaseModalElement = document.getElementById("purchaseModal");
  const purchaseModal = purchaseModalElement
    ? new bootstrap.Modal(purchaseModalElement)
    : null;

  const selected = new Set();

  const renderSelection = () => {
    const seats = Array.from(selected).sort();

    if (selectedList) {
      selectedList.textContent = seats.length ? seats.join(", ") : "Нет";
    }

    if (selectedCount) {
      selectedCount.textContent = String(seats.length);
    }

    if (openModalButton) {
      openModalButton.disabled = seats.length === 0;
    }
  };

  seatButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.classList.contains("unavailable")) return;

      const seatId = button.dataset.seat;
      const isSelected = selected.has(seatId);

      if (isSelected) {
        selected.delete(seatId);
        button.classList.remove("selected");
      } else {
        selected.add(seatId);
        button.classList.add("selected");
      }

      renderSelection();
    });
  });

  openModalButton?.addEventListener("click", () => {
    if (!purchaseModal) return;

    const seats = Array.from(selected).sort();
    if (modalSeatList) {
      modalSeatList.textContent = seats.join(", ");
    }

    if (modalTotal) {
      modalTotal.textContent = `${(seats.length * pricePerSeat).toLocaleString("ru-RU")} ₽`;
    }

    purchaseModal.show();
  });

  confirmButton?.addEventListener("click", () => {
    if (!purchaseModal) return;

    purchaseModal.hide();

    if (successAlert) {
      successAlert.classList.remove("d-none");
      successAlert.textContent = `Покупка завершена. Вы выбрали мест: ${selected.size}.`;
    }
  });

  renderSelection();
}

function initTicketReturns() {
  const returnButtons = Array.from(document.querySelectorAll(".js-return-btn"));
  if (!returnButtons.length) return;

  const label = document.getElementById("return-ticket-label");
  const confirmButton = document.getElementById("confirm-return-btn");
  const modalElement = document.getElementById("returnModal");
  const returnModal = modalElement ? new bootstrap.Modal(modalElement) : null;
  const toastElement = document.getElementById("return-toast");
  const toast = toastElement ? new bootstrap.Toast(toastElement) : null;

  let activeTicketId = "";

  returnButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeTicketId = button.dataset.ticketId || "";
      if (label) label.textContent = activeTicketId;
      returnModal?.show();
    });
  });

  confirmButton?.addEventListener("click", () => {
    if (!activeTicketId) return;

    const card = document.querySelector(`.ticket-card[data-ticket-id="${activeTicketId}"]`);
    if (card) {
      const status = card.querySelector(".ticket-status");
      status?.classList.remove("bg-success");
      status?.classList.add("bg-secondary");
      if (status) {
        status.textContent = "Возврат оформлен";
      }

      const actionButton = card.querySelector(".js-return-btn");
      if (actionButton) {
        actionButton.setAttribute("disabled", "disabled");
        actionButton.textContent = "Заявка отправлена";
      }
    }

    returnModal?.hide();
    toast?.show();
    activeTicketId = "";
  });
}

function initOrganizerTools() {
  const form = document.getElementById("organizer-event-form");
  if (!form) return;

  const tableBody = document.getElementById("organizer-events-body");
  const alert = document.getElementById("organizer-create-alert");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    const title = form.elements.title.value.trim();
    const place = form.elements.place.value.trim();
    const date = form.elements.date.value;
    const price = Number(form.elements.price.value);

    if (tableBody) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${escapeHtml(title)}</td>
        <td>${escapeHtml(place)}</td>
        <td>${formatDate(date)}</td>
        <td>${price.toLocaleString("ru-RU")} ₽</td>
        <td><span class="badge text-bg-warning">Черновик</span></td>
      `;
      tableBody.prepend(row);
    }

    if (alert) {
      alert.classList.remove("d-none");
      alert.textContent = `Событие «${title}» добавлено в список.`;
    }

    form.reset();
    form.classList.remove("was-validated");
  });
}

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);
  return date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
