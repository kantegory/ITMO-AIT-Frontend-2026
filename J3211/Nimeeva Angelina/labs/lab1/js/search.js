document.addEventListener("DOMContentLoaded", () => {
  const app = window.Lab1App;
  if (!app) return;

  const updateSpaceResultsStatus = (visible) => {
    const resultsStatus = document.getElementById("spaceResultsStatus");
    if (!resultsStatus) return;

    resultsStatus.textContent =
      visible === 0
        ? "По выбранным фильтрам помещения не найдены."
        : `Найдено ${visible} ${app.pluralize(visible, ["помещение", "помещения", "помещений"])}.`;
  };

  const renderSpaceCard = (space) => {
    const statusMap = {
      free: { text: "Свободно", badge: "status-free" },
      reserved: { text: "В резерве", badge: "status-reserved" },
      rented: { text: "Сдано", badge: "status-rented" },
    };

    const status = statusMap[space.status] || { text: "Неизвестно", badge: "status-received" };
    const titleId = `space-title-${space.id}`;
    const metaId = `space-meta-${space.id}`;
    const noteId = `space-note-${space.id}`;
    const statusId = `space-status-${space.id}`;
    const name = app.escapeHtml(space.name || "Помещение");
    const tenant = app.escapeHtml(space.tenant || "");
    const description = space.description ? `, ${app.escapeHtml(space.description)}` : "";
    const note = app.escapeHtml(space.note || "Без дополнительного комментария.");

    return `
      <div class="col-md-6" data-space-result>
        <article class="space-card" data-space-card data-name="${name}" data-status="${app.escapeHtml(
          space.status || "",
        )}" data-type="${app.escapeHtml(space.type || "")}" data-floor="${app.escapeHtml(
          String(space.floor ?? ""),
        )}" data-area="${app.escapeHtml(String(space.area ?? 0))}" data-tenant="${tenant}" aria-labelledby="${titleId}" aria-describedby="${metaId} ${noteId} ${statusId}">
          <div class="space-media">
            <img src="assets/img/${space.image || "space-suite"}.svg" alt="Иллюстрация помещения ${name}" loading="lazy">
          </div>
          <div class="space-body">
            <div class="d-flex justify-content-between gap-3 align-items-start">
              <div>
                <h2 class="section-title mb-1" id="${titleId}">${name}</h2>
                <p class="section-text mb-0" id="${metaId}">${app.escapeHtml(
                  String(space.floor ?? "—"),
                )} этаж, ${app.escapeHtml(String(space.area ?? 0))} м²${description}</p>
              </div>
              <span class="badge app-badge ${status.badge}" id="${statusId}">${status.text}</span>
            </div>
            <p class="space-meta" id="${noteId}">${app.escapeHtml(
              String(space.price ?? 0),
            )} ₽ / м². ${note}</p>
            <button class="btn ${
              space.status === "free" ? "btn-brand" : "btn-outline-brand"
            } w-100" type="button" data-bs-toggle="modal" data-bs-target="#applicationModal" data-space-name="${name}">
              ${
                space.status === "free"
                  ? "Оставить заявку"
                  : space.status === "reserved"
                    ? "Встать в резерв"
                    : "Оставить интерес"
              }
            </button>
          </div>
        </article>
      </div>
    `;
  };

  const filterSpaces = () => {
    const cards = app.$$("[data-space-card]");
    if (!cards.length) {
      updateSpaceResultsStatus(0);
      return;
    }

    const query = (document.getElementById("spaceQuery")?.value || "").trim().toLowerCase();
    const status = document.getElementById("spaceStatus")?.value || "all";
    const type = document.getElementById("spaceType")?.value || "all";
    const floor = document.getElementById("spaceFloor")?.value || "all";
    const minArea = Number(document.getElementById("areaMin")?.value || 0);
    const maxArea = Number(document.getElementById("areaMax")?.value || 9999);
    let visible = 0;

    cards.forEach((card) => {
      const matches =
        (!query ||
          (card.dataset.name || "").toLowerCase().includes(query) ||
          (card.dataset.tenant || "").toLowerCase().includes(query)) &&
        (status === "all" || card.dataset.status === status) &&
        (type === "all" || card.dataset.type === type) &&
        (floor === "all" || card.dataset.floor === floor) &&
        Number(card.dataset.area || 0) >= minArea &&
        Number(card.dataset.area || 0) <= maxArea;

      card.closest("[data-space-result]")?.classList.toggle("d-none", !matches);
      if (matches) visible += 1;
    });

    const emptyState = document.getElementById("spaceEmpty");
    if (emptyState) {
      emptyState.classList.toggle("is-visible", visible === 0);
      emptyState.hidden = visible !== 0;
      emptyState.setAttribute("aria-hidden", String(visible !== 0));
    }

    if (document.getElementById("spaceCount")) {
      document.getElementById("spaceCount").textContent = String(visible);
    }

    updateSpaceResultsStatus(visible);
  };

  const loadSpaces = async () => {
    const container = document.getElementById("spaceResults");
    if (!container) return;

    container.setAttribute("aria-busy", "true");
    if (document.getElementById("spaceResultsStatus")) {
      document.getElementById("spaceResultsStatus").textContent = "Загружаем список помещений.";
    }

    try {
      const spaces = await app.fetchCollection("spaces");
      const list = Array.isArray(spaces) ? spaces : [];

      container.innerHTML = list.map(renderSpaceCard).join("");
      if (document.getElementById("spaceCount")) {
        document.getElementById("spaceCount").textContent = String(list.length);
      }

      filterSpaces();
    } catch (error) {
      console.error(error);
      app.showToast("Не удалось загрузить список помещений.");
    } finally {
      container.setAttribute("aria-busy", "false");
    }
  };

  const applicationModal = app.getModal("applicationModal");

  document.getElementById("applicationModal")?.addEventListener("show.bs.modal", (event) => {
    const spaceName = event.relatedTarget?.getAttribute("data-space-name") || "Помещение";

    if (document.getElementById("applicationSpaceName")) {
      document.getElementById("applicationSpaceName").textContent = spaceName;
    }

    if (document.getElementById("applicationSpace")) {
      document.getElementById("applicationSpace").value = spaceName;
    }
  });

  document.getElementById("applicationForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const application = {
      space: document.getElementById("applicationSpace")?.value || "",
      person: document.getElementById("applicationPerson")?.value.trim() || "",
      phone: document.getElementById("applicationPhone")?.value.trim() || "",
      comment: document.getElementById("applicationComment")?.value.trim() || "",
      date: app.formatDate(),
      status: "new",
    };

    try {
      await app.createResource("applications", application);
      document.getElementById("applicationForm")?.reset();
      applicationModal?.hide();
      app.showToast("Заявка на просмотр отправлена на сервер.");
    } catch (error) {
      console.error(error);
      app.showToast("Ошибка отправки заявки.");
    }
  });

  app.watch(["spaceQuery", "spaceStatus", "spaceType", "spaceFloor", "areaMin", "areaMax"], filterSpaces);

  document.getElementById("resetFilters")?.addEventListener("click", () => {
    document.getElementById("spaceFilters")?.reset();
    filterSpaces();
  });

  loadSpaces();
});
