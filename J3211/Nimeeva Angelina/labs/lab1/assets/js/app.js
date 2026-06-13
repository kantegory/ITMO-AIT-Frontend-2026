document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const formatDate = (value = new Date()) =>
    new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(value);
  const roleKey = "lab1Role";
  const getModal = (id) =>
    window.bootstrap && document.getElementById(id)
      ? window.bootstrap.Modal.getOrCreateInstance(document.getElementById(id))
      : null;
  const getSavedRole = () => {
    try {
      return sessionStorage.getItem(roleKey) || "";
    } catch {
      return "";
    }
  };
  const saveRole = (role) => {
    try {
      sessionStorage.setItem(roleKey, role);
    } catch {
      return;
    }
  };
  const clearRole = () => {
    try {
      sessionStorage.removeItem(roleKey);
    } catch {
      return;
    }
  };

  const toast = $("#actionToast");
  const toastMessage = $("#actionToastMessage");
  const toastInstance =
    toast && window.bootstrap ? window.bootstrap.Toast.getOrCreateInstance(toast) : null;
  const showToast = (message) => {
    if (!toastInstance || !toastMessage) return;
    toastMessage.textContent = message;
    toastInstance.show();
  };

  const cabinetLink = (role) => (role === "admin" ? "admin.html" : "tenant.html");
  const roleLabel = (role) => (role === "admin" ? "Администрация" : "Арендатор");
  const alertFeed = {
    tenant: [
      { date: "20 марта", text: "Напоминание о показаниях." },
      { date: "18 марта", text: "Срок подписи по допсоглашению скоро истекает." },
      { date: "12 марта", text: "Новый счет и акт уже в архиве.", read: true },
    ],
    admin: [
      { date: "15 марта", text: "Поступили новые показания по помещениям 3.18 и 2.11." },
      { date: "14 марта", text: "Письмо по перепланировке ждет согласования." },
      { date: "12 марта", text: "Счета за март размещены в кабинетах арендаторов.", read: true },
    ],
  };
  const statusMap = {
    received: { text: "Получено", className: "status-received" },
    review: { text: "На проверке", className: "status-pending" },
    accepted: { text: "Принято", className: "status-accepted" },
    rejected: { text: "Отклонено", className: "status-rejected" },
  };

  $$("[data-current-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  if (document.body.dataset.role) {
    saveRole(document.body.dataset.role);
  }

  $$("[data-logout]").forEach((link) => {
    link.addEventListener("click", clearRole);
  });

  const renderAuthLinks = (items, linkClass) =>
    items
      .map(
        ({ href, label, active, logout, button }) =>
          button
            ? `<li class="nav-item">
                <button class="btn btn-soft notification-trigger" type="button" data-bs-toggle="offcanvas" data-bs-target="#authAlerts" aria-controls="authAlerts">
                  Уведомления
                  <span class="notification-badge-dot" aria-hidden="true"></span>
                </button>
              </li>`
            : `<li class="nav-item"><a class="${linkClass}${active ? " active" : ""}" href="${href}"${
                logout ? ' data-logout="true"' : ""
              }>${label}</a></li>`,
      )
      .join("");

  const renderAuthFooterLinks = (items) =>
    items
      .filter(({ button }) => !button)
      .map(
        ({ href, label, logout }) =>
          `<li><a href="${href}"${logout ? ' data-logout="true"' : ""}>${label}</a></li>`,
      )
      .join("");

  const syncAuthNavigation = () => {
    const nav = $("#authNav");
    const footer = $("#authFooterLinks");
    if (!nav && !footer) return;

    const role = getSavedRole();
    const currentView = document.body.dataset.view || "";
    const alertsTitle = $("#authAlertsLabel");
    const alertsList = $("#authAlertsList");
    const items = role
      ? [
          { href: cabinetLink(role), label: "Кабинет" },
          { href: "archive.html", label: "Архив", active: currentView === "archive" },
          { href: "search.html", label: "Помещения", active: currentView === "search" },
          { href: "index.html", label: "Выход", logout: true },
          { button: true },
        ]
      : [
          { href: "index.html", label: "Вход", active: currentView === "login" },
          { href: "register.html", label: "Регистрация", active: currentView === "register" },
          { href: "search.html", label: "Помещения", active: currentView === "search" },
        ];

    if (nav) nav.innerHTML = renderAuthLinks(items, "nav-link");
    if (footer) footer.innerHTML = renderAuthFooterLinks(items);
    if (alertsTitle) alertsTitle.textContent = role ? `Уведомления: ${roleLabel(role)}` : "Уведомления";
    if (alertsList) {
      alertsList.innerHTML = role
        ? (alertFeed[role] || [])
            .map(
              ({ date, text, read }) => `
                <div class="list-group-item">
                  <div class="notification-entry${read ? " is-read" : ""}">
                    <span class="notification-dot" aria-hidden="true"></span>
                    <div>
                      <div class="fw-semibold">${date}</div>
                      <div class="text-body-secondary small">${text}</div>
                    </div>
                  </div>
                </div>`,
            )
            .join("")
        : "";
    }

    $$("[data-logout]").forEach((link) => {
      link.addEventListener("click", clearRole);
    });
  };

  const syncArchiveAccess = () => {
    const guestBlock = $("#archiveGuest");
    const contentBlock = $("#archiveContent");
    if (!guestBlock || !contentBlock) return;

    const role = getSavedRole();
    const heroTitle = $("#archiveHeroTitle");
    const heroText = $("#archiveHeroText");

    guestBlock.classList.toggle("d-none", Boolean(role));
    contentBlock.classList.toggle("d-none", !role);

    if (!role) return;

    if (heroTitle) {
      heroTitle.textContent =
        role === "admin"
          ? "Архив и управление документами"
          : "Архив договоров, счетов и актов";
    }

    if (heroText) {
      heroText.textContent =
        role === "admin"
          ? "Здесь хранятся входящие и исходящие документы, а также быстрый доступ к согласованию."
          : "Здесь лежат договоры, допсоглашения, счета и акты с поиском и фильтрами.";
    }
  };

  syncAuthNavigation();
  syncArchiveAccess();

  $$("[data-password-toggle]").forEach((button) => {
    const input = $(button.dataset.passwordToggle || "");
    if (!input) return;

    button.addEventListener("click", () => {
      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
      button.textContent = isPassword ? "Скрыть" : "Показать";
    });
  });

  $("#loginForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const role = $("#loginRole")?.value || "tenant";
    saveRole(role);
    window.location.href = cabinetLink(role);
  });

  const registerModal = getModal("registerSuccessModal");
  $("#registerForm")?.addEventListener("submit", (event) => {
    event.preventDefault();

    const role = $("#accountRole")?.value || "tenant";
    const isAdmin = role === "admin";
    const roleName = roleLabel(role);

    if ($("#registerSuccessRole")) $("#registerSuccessRole").textContent = `Роль: ${roleName}`;
    if ($("#registerSuccessText")) {
      $("#registerSuccessText").textContent =
        "Заявка отправлена. После подтверждения можно будет войти под выбранной ролью.";
    }

    const demoLink = $("#registerDemoLink");
    if (demoLink) {
      demoLink.href = cabinetLink(role);
      demoLink.textContent = `Открыть демо-кабинет: ${roleName}`;
    }

    registerModal?.show();
  });

  $("#meterForm")?.addEventListener("submit", (event) => {
    event.preventDefault();

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${$("#meterMonth")?.value || ""}</td>
      <td>${$("#electricityValue")?.value || ""} кВт·ч</td>
      <td>${$("#waterValue")?.value || ""} м³</td>
      <td>${$("#heatingValue")?.value || ""} Гкал</td>
      <td><span class="badge app-badge status-pending">Отправлено</span></td>
    `;

    $("#meterTableBody")?.prepend(row);
    $("#meterForm")?.reset();
    showToast("Показания отправлены.");
  });

  const uploadInput = $("#uploadFiles");
  const uploadList = $("#uploadFileList");
  const renderUploadList = () => {
    if (!uploadInput || !uploadList) return;
    uploadList.innerHTML = "";

    if (!uploadInput.files.length) {
      uploadList.innerHTML = "<li>Файлы появятся здесь после выбора.</li>";
      return;
    }

    Array.from(uploadInput.files).forEach((file) => {
      const item = document.createElement("li");
      item.textContent = file.name;
      uploadList.append(item);
    });
  };

  uploadInput?.addEventListener("change", renderUploadList);
  renderUploadList();

  $("#uploadForm")?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!uploadInput?.files.length) {
      showToast("Добавьте хотя бы один файл.");
      return;
    }

    Array.from(uploadInput.files).forEach((file) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${file.name}</td>
        <td>${$("#uploadType")?.value || "Документ"}</td>
        <td>${formatDate()}</td>
        <td><span class="badge app-badge status-received">Получено</span></td>
      `;
      $("#tenantUploadTableBody")?.prepend(row);
    });

    $("#uploadForm")?.reset();
    renderUploadList();
    showToast("Документы отправлены.");
  });

  let signRow = null;
  const signModal = getModal("signModal");
  $("#signModal")?.addEventListener("show.bs.modal", (event) => {
    signRow = event.relatedTarget?.closest("tr") || null;
    if ($("#signDocumentName")) {
      $("#signDocumentName").textContent =
        event.relatedTarget?.getAttribute("data-sign-document") || "Документ";
    }
  });

  $("#signForm")?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!$("#signAgreement")?.checked) {
      showToast("Подтвердите электронное подписание.");
      return;
    }

    if (signRow) {
      const signedText = `Подписан ${formatDate()}`;
      const badge = $("[data-status-badge]", signRow);
      const note = $("[data-status-note]", signRow);
      const action = $("[data-action-cell]", signRow);

      if (badge) {
        badge.textContent = "Подписан";
        badge.className = "badge app-badge status-accepted";
      }
      if (note) note.textContent = signedText;
      if (action) action.textContent = signedText;
    }

    $("#signForm")?.reset();
    signModal?.hide();
    showToast(`Документ "${$("#signDocumentName")?.textContent || "Документ"}" подписан.`);
  });

  $$("[data-review-reading]").forEach((button) => {
    button.addEventListener("click", () => {
      const row = button.closest("tr");
      const badge = row ? $("[data-reading-status]", row) : null;

      if (badge) {
        badge.textContent = "Проверено";
        badge.className = "badge app-badge status-accepted";
      }

      button.textContent = "Готово";
      button.disabled = true;
      showToast(`Показания ${button.dataset.reviewReading || ""} подтверждены.`);
    });
  });

  let processRow = null;
  const processModal = getModal("processModal");
  $("#processModal")?.addEventListener("show.bs.modal", (event) => {
    processRow = event.relatedTarget?.closest("tr") || null;
    if ($("#processDocumentName")) {
      $("#processDocumentName").textContent =
        event.relatedTarget?.getAttribute("data-process-document") || "Документ";
    }
    if ($("#processStatus") && processRow) {
      $("#processStatus").value = processRow.dataset.currentStatus || "review";
    }
  });

  $("#processForm")?.addEventListener("submit", (event) => {
    event.preventDefault();

    const status = $("#processStatus")?.value || "review";
    const comment = $("#processComment")?.value.trim() || "Статус обновлен";
    const current = statusMap[status];

    if (processRow && current) {
      processRow.dataset.currentStatus = status;
      const badge = $("[data-status-badge]", processRow);
      const note = $("[data-status-note]", processRow);

      if (badge) {
        badge.textContent = current.text;
        badge.className = `badge app-badge ${current.className}`;
      }
      if (note) note.textContent = comment;
    }

    $("#processForm")?.reset();
    processModal?.hide();
    showToast("Статус документа обновлен.");
  });

  $("#publishForm")?.addEventListener("submit", (event) => {
    event.preventDefault();

    const tenant = $("#publishTenant")?.value;
    const type = $("#publishType")?.value;
    const file = $("#publishFile")?.files[0];

    if (!tenant || !type || !file) {
      showToast("Заполните арендатора, тип и файл.");
      return;
    }

    const item = document.createElement("li");
    item.innerHTML = `<strong>${type}: ${file.name}</strong><span>Отправлено для ${tenant} только что.</span>`;
    $("#adminOutbox")?.prepend(item);

    $("#publishForm")?.reset();
    showToast("Документ отправлен в кабинет арендатора.");
  });

  const applicationModal = getModal("applicationModal");
  $("#applicationModal")?.addEventListener("show.bs.modal", (event) => {
    const name = event.relatedTarget?.getAttribute("data-space-name") || "Помещение";
    if ($("#applicationSpaceName")) $("#applicationSpaceName").textContent = name;
    if ($("#applicationSpace")) $("#applicationSpace").value = name;
  });

  $("#applicationForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    $("#applicationForm")?.reset();
    applicationModal?.hide();
    showToast("Заявка на просмотр отправлена.");
  });

  const filterSpaces = () => {
    const cards = $$("[data-space-card]");
    if (!cards.length) return;

    const query = ($("#spaceQuery")?.value || "").trim().toLowerCase();
    const status = $("#spaceStatus")?.value || "all";
    const type = $("#spaceType")?.value || "all";
    const floor = $("#spaceFloor")?.value || "all";
    const minArea = Number($("#areaMin")?.value || 0);
    const maxArea = Number($("#areaMax")?.value || 9999);
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

    if ($("#spaceCount")) $("#spaceCount").textContent = String(visible);
    $("#spaceEmpty")?.classList.toggle("is-visible", visible === 0);
  };

  const filterArchive = () => {
    const rows = $$("[data-archive-row]");
    if (!rows.length) return;

    const query = ($("#archiveQuery")?.value || "").trim().toLowerCase();
    const type = $("#archiveType")?.value || "all";
    const status = $("#archiveStatus")?.value || "all";
    let visible = 0;

    rows.forEach((row) => {
      const matches =
        (!query || (row.dataset.title || "").toLowerCase().includes(query)) &&
        (type === "all" || row.dataset.type === type) &&
        (status === "all" || row.dataset.status === status);

      row.classList.toggle("d-none", !matches);
      if (matches) visible += 1;
    });

    if ($("#archiveCount")) $("#archiveCount").textContent = String(visible);
  };

  const watch = (ids, handler) => {
    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (!element) return;
      ["input", "change"].forEach((eventName) => {
        element.addEventListener(eventName, handler);
      });
    });
  };

  watch(["spaceQuery", "spaceStatus", "spaceType", "spaceFloor", "areaMin", "areaMax"], filterSpaces);
  watch(["archiveQuery", "archiveType", "archiveStatus"], filterArchive);

  $("#resetFilters")?.addEventListener("click", () => {
    $("#spaceFilters")?.reset();
    filterSpaces();
  });

  filterSpaces();
  filterArchive();
});
