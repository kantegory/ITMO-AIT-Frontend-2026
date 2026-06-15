function initProfilePage() {
  const profileName = document.getElementById("profileName");
  if (!profileName) {
    return;
  }

  let currentUser = getCurrentUser();
  if (!currentUser) {
    window.location.href = "auth.html";
    return;
  }
  if (currentUser.accountType === "organizer") {
    window.location.href = "organizer.html";
    return;
  }

  const profileAvatar = document.getElementById("profileAvatar");
  const profileEmail = document.getElementById("profileEmail");
  const activeTicketsCount = document.getElementById("activeTicketsCount");
  const refundRequestsCount = document.getElementById("refundRequestsCount");
  const successfulPurchasesCount = document.getElementById("successfulPurchasesCount");
  const ticketsList = document.getElementById("ticketsList");
  const returnsTableBody = document.getElementById("returnsTableBody");
  const logoutBtn = document.getElementById("logoutBtn");

  const refundModalElement = document.getElementById("refundModal");
  const refundForm = document.getElementById("refundForm");
  const refundReason = document.getElementById("refundReason");
  const refundEventName = document.getElementById("refundEventName");
  const refundTicketId = document.getElementById("refundTicketId");
  const refundModal = refundModalElement ? new bootstrap.Modal(refundModalElement) : null;

  let selectedTicketId = null;

  function getInitials(name) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    return parts.slice(0, 2).map((part) => part[0].toUpperCase()).join("") || "--";
  }

  function persistCurrentUser() {
    updateStoredUser(currentUser);
  }

  function renderProfile() {
    profileName.textContent = currentUser.name;
    profileEmail.textContent = currentUser.email;
    profileAvatar.textContent = getInitials(currentUser.name);

    const tickets = currentUser.tickets || [];
    const refunds = currentUser.refunds || [];
    const activeCount = tickets.length;

    activeTicketsCount.textContent = String(activeCount);
    refundRequestsCount.textContent = String(refunds.length);
    successfulPurchasesCount.textContent = String(tickets.length);

    if (!tickets.length) {
      ticketsList.innerHTML = '<div class="col-12"><div class="empty-state">У вас пока нет купленных билетов.</div></div>';
    } else {
      ticketsList.innerHTML = tickets
        .map((ticket) => {
          const refundButton = ticket.canRefund
            ? `<button class="btn btn-sm btn-outline-danger request-refund-btn" type="button" data-ticket-id="${escapeHtml(ticket.id)}">Оформить возврат</button>`
            : '<button class="btn btn-sm btn-outline-secondary" type="button" disabled>Заявка отправлена</button>';

          return `
            <div class="col-md-6">
              <article class="ticket-item h-100">
                <p class="small text-secondary mb-2">${escapeHtml(ticket.category)} • ${escapeHtml(ticket.date)} • ${escapeHtml(ticket.city)}</p>
                <h3 class="h5 mb-2">${escapeHtml(ticket.eventName)}</h3>
                <p class="mb-3 small">${escapeHtml(ticket.seat)} • Заказ #${escapeHtml(ticket.id)}</p>
                <div class="d-flex justify-content-between align-items-center gap-2 flex-wrap">
                  <span class="badge text-bg-success">Оплачен</span>
                  ${refundButton}
                </div>
              </article>
            </div>
          `;
        })
        .join("");
    }

    if (!refunds.length) {
      returnsTableBody.innerHTML = '<tr><td colspan="5"><div class="empty-state my-2">Заявок на возврат пока нет.</div></td></tr>';
    } else {
      returnsTableBody.innerHTML = refunds
        .map((refund) => {
          return `
            <tr>
              <td>#${escapeHtml(refund.ticketId)}</td>
              <td>${escapeHtml(refund.eventName)}</td>
              <td>${escapeHtml(refund.requestedAt)}</td>
              <td>${refund.amount ? `${Number(refund.amount).toLocaleString("ru-RU")} ₽` : "Будет рассчитана"}</td>
              <td><span class="badge text-bg-secondary">В обработке</span></td>
            </tr>
          `;
        })
        .join("");
    }
  }

  if (ticketsList) {
    ticketsList.addEventListener("click", (event) => {
      const button = event.target.closest(".request-refund-btn");
      if (!button || !refundModal || !refundReason) return;

      selectedTicketId = button.dataset.ticketId || null;
      const ticket = (currentUser.tickets || []).find((item) => item.id === selectedTicketId);
      if (!ticket) return;

      refundEventName.textContent = ticket.eventName;
      refundTicketId.textContent = `#${ticket.id}`;
      refundReason.value = "";
      refundReason.classList.remove("is-invalid");
      refundModal.show();
    });
  }

  if (refundForm && refundReason) {
    refundForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!refundReason.value.trim()) {
        refundReason.classList.add("is-invalid");
        return;
      }

      refundReason.classList.remove("is-invalid");

      const ticket = (currentUser.tickets || []).find((item) => item.id === selectedTicketId);
      if (!ticket || !ticket.canRefund) {
        if (refundModal) refundModal.hide();
        return;
      }

      ticket.canRefund = false;

      currentUser.refunds = currentUser.refunds || [];
      currentUser.refunds.unshift({
        ticketId: ticket.id,
        eventName: ticket.eventName,
        requestedAt: new Date().toLocaleDateString("ru-RU"),
        amount: ticket.price,
        status: "processing",
      });

      persistCurrentUser();
      renderProfile();

      if (refundModal) refundModal.hide();
      selectedTicketId = null;
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (event) => {
      event.preventDefault();
      clearCurrentUserId();
      window.location.href = "auth.html";
    });
  }

  renderProfile();
}

initProfilePage();
