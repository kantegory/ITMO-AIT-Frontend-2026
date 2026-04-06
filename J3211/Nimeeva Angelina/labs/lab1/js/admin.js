document.addEventListener("DOMContentLoaded", () => {
  const app = window.Lab1App;
  if (!app || !app.requireRole("admin")) return;

  const renderAdminReadingRow = (reading) => {
    const status = app.getReadingStatus(reading.status, "admin");
    const isAccepted = reading.status === "accepted";

    return `
      <tr>
        <td>${app.escapeHtml(reading.space || "—")}</td>
        <td>${app.escapeHtml(reading.tenant || "Арендатор")}</td>
        <td>${app.escapeHtml(String(reading.electricity ?? 0))} кВт·ч / ${app.escapeHtml(
          String(reading.water ?? 0),
        )} м³ / ${app.escapeHtml(String(reading.heating ?? 0))} Гкал</td>
        <td><span class="badge app-badge ${status.className}">${status.text}</span></td>
        <td>
          <button class="btn ${
            isAccepted ? "btn-outline-brand" : "btn-brand"
          } btn-sm" type="button" ${isAccepted ? "disabled" : ""} data-review-reading-id="${app.escapeHtml(
            String(reading.id ?? ""),
          )}" data-review-reading-space="${app.escapeHtml(reading.space || "")}">
            ${isAccepted ? "Готово" : "Проверить"}
          </button>
        </td>
      </tr>
    `;
  };

  const loadAdminMeterReadings = () =>
    app.renderTableData({
      selector: "#adminReadingsTableBody",
      columns: 5,
      emptyMessage: "Показаний на проверке пока нет.",
      errorMessage: "Не удалось загрузить показания.",
      fetchItems: () => app.fetchCollection("meterReadings"),
      transformItems: app.sortByIdDesc,
      renderItem: renderAdminReadingRow,
    });

  const renderApplicationRow = (application) => {
    const status = app.applicationStatusMap[application.status] || app.applicationStatusMap.new;

    return `
      <tr>
        <td>${app.escapeHtml(application.space || "—")}</td>
        <td>${app.escapeHtml(application.person || "—")}</td>
        <td>${app.escapeHtml(application.phone || "—")}</td>
        <td>${app.escapeHtml(application.date || "—")}</td>
        <td><span class="badge app-badge ${status.className}">${status.text}</span></td>
        <td class="text-body-secondary small">${app.escapeHtml(
          application.comment || "Без комментария.",
        )}</td>
      </tr>
    `;
  };

  const loadAdminApplications = () =>
    app.renderTableData({
      selector: "#applicationsTableBody",
      columns: 6,
      emptyMessage: "Заявок на просмотр пока нет.",
      errorMessage: "Не удалось загрузить заявки.",
      toastMessage: "Не удалось загрузить заявки на просмотр.",
      fetchItems: () => app.fetchCollection("applications"),
      transformItems: app.sortByIdDesc,
      renderItem: renderApplicationRow,
    });

  const renderAdminIncomingDocumentRow = (documentItem) => {
    const status = app.statusMap[documentItem.status] || app.statusMap.review;

    return `
      <tr data-current-status="${app.escapeHtml(documentItem.status || "review")}">
        <td>${app.escapeHtml(documentItem.title || "Документ")}</td>
        <td>${app.escapeHtml(documentItem.tenant || "Арендатор")}</td>
        <td><span class="badge app-badge ${status.className}">${status.text}</span></td>
        <td class="text-body-secondary small">${app.escapeHtml(
          documentItem.comment || "Без комментария.",
        )}</td>
        <td>
          <button class="btn ${
            documentItem.status === "review" ? "btn-brand" : "btn-outline-brand"
          } btn-sm" type="button" data-bs-toggle="modal" data-bs-target="#processModal" data-process-document-id="${app.escapeHtml(
            String(documentItem.id ?? ""),
          )}" data-process-document="${app.escapeHtml(documentItem.title || "Документ")}">
            Обработать
          </button>
        </td>
      </tr>
    `;
  };

  const loadAdminIncomingDocuments = () =>
    app.renderTableData({
      selector: "#incomingDocsTableBody",
      columns: 5,
      emptyMessage: "Новых входящих документов пока нет.",
      errorMessage: "Не удалось загрузить входящие документы.",
      fetchItems: () => app.fetchCollection("incomingDocuments"),
      transformItems: app.sortByIdDesc,
      renderItem: renderAdminIncomingDocumentRow,
    });

  const renderOutboxItem = (documentItem) => `
    <li>
      <strong>${app.escapeHtml(documentItem.title || "Документ")}</strong>
      <span>${app.escapeHtml(documentItem.comment || "Отправлено арендатору.")}</span>
    </li>
  `;

  const loadAdminOutbox = async () => {
    const outbox = document.getElementById("adminOutbox");
    if (!outbox) return [];

    try {
      const documents = app.sortByIdDesc(await app.fetchCollection("documents"));
      outbox.innerHTML = documents.length
        ? documents.slice(0, 5).map(renderOutboxItem).join("")
        : "<li><strong>Пока пусто</strong><span>Исходящие документы появятся после отправки.</span></li>";
      return documents;
    } catch (error) {
      console.error(error);
      outbox.innerHTML =
        "<li><strong>Ошибка загрузки</strong><span>Не удалось получить список исходящих документов.</span></li>";
      return [];
    }
  };

  const loadTenantOptions = async () => {
    const select = document.getElementById("publishTenant");
    if (!select) return [];

    try {
      const users = await app.fetchCollection("users", "?role=tenant");
      const options = ['<option value="">Выберите арендатора</option>'].concat(
        (Array.isArray(users) ? users : []).map(
          (user) => `<option value="${app.escapeHtml(user.name || "")}">${app.escapeHtml(user.name || "")}</option>`,
        ),
      );

      select.innerHTML = options.join("");
      return users;
    } catch (error) {
      console.error(error);
      app.showToast("Не удалось загрузить список арендаторов.");
      return [];
    }
  };

  document.addEventListener("click", async (event) => {
    const reviewButton = event.target.closest("[data-review-reading-id]");
    if (!reviewButton) return;

    const readingId = reviewButton.getAttribute("data-review-reading-id");
    const readingSpace = reviewButton.getAttribute("data-review-reading-space") || "";
    if (!readingId) return;

    reviewButton.disabled = true;

    try {
      await app.updateResource("meterReadings", readingId, { status: "accepted" });
      await loadAdminMeterReadings();
      app.showToast(`Показания для помещения ${readingSpace} подтверждены.`);
    } catch (error) {
      console.error(error);
      reviewButton.disabled = false;
      app.showToast("Не удалось обновить статус показаний.");
    }
  });

  let processDocumentId = "";
  const processModal = app.getModal("processModal");

  document.getElementById("processModal")?.addEventListener("show.bs.modal", (event) => {
    processDocumentId = event.relatedTarget?.getAttribute("data-process-document-id") || "";

    if (document.getElementById("processDocumentName")) {
      document.getElementById("processDocumentName").textContent =
        event.relatedTarget?.getAttribute("data-process-document") || "Документ";
    }
  });

  document.getElementById("processForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const status = document.getElementById("processStatus")?.value || "review";
    const comment = document.getElementById("processComment")?.value.trim() || "Статус обновлен";

    try {
      await app.updateResource("incomingDocuments", processDocumentId, { status, comment });
      document.getElementById("processForm")?.reset();
      processModal?.hide();
      await loadAdminIncomingDocuments();
      app.showToast("Статус документа обновлен.");
    } catch (error) {
      console.error(error);
      app.showToast("Не удалось обновить статус документа.");
    }
  });

  document.getElementById("publishForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const tenant = document.getElementById("publishTenant")?.value || "";
    const type = document.getElementById("publishType")?.value || "";
    const file = document.getElementById("publishFile")?.files?.[0];
    const deadline = document.getElementById("publishDeadline")?.value || "";

    if (!tenant || !type || !file) {
      app.showToast("Заполните арендатора, тип и файл.");
      return;
    }

    const typeMap = {
      Счет: { type: "invoice", typeLabel: "Счет" },
      Договор: { type: "contract", typeLabel: "Договор" },
      Допсоглашение: { type: "agreement", typeLabel: "Допсоглашение" },
      Акт: { type: "act", typeLabel: "Акт" },
    };

    const descriptor = typeMap[type] || { type: "document", typeLabel: type };
    const deadlineLabel = deadline ? app.formatDate(new Date(`${deadline}T00:00:00`)) : "";
    const status = deadline ? "pending" : "received";
    const statusLabel = deadline ? "Ожидает подписи" : "Получен";
    const comment = deadlineLabel
      ? `Отправлено для ${tenant}. Подписать до ${deadlineLabel}.`
      : `Отправлено для ${tenant}.`;

    try {
      await app.createResource("documents", {
        title: file.name,
        type: descriptor.type,
        typeLabel: descriptor.typeLabel,
        tenant,
        date: app.formatDate(),
        deadline: deadlineLabel,
        status,
        statusLabel,
        comment,
      });

      document.getElementById("publishForm")?.reset();
      await loadAdminOutbox();
      app.showToast("Документ отправлен в кабинет арендатора.");
    } catch (error) {
      console.error(error);
      app.showToast("Не удалось отправить документ.");
    }
  });

  loadTenantOptions();
  loadAdminMeterReadings();
  loadAdminApplications();
  loadAdminIncomingDocuments();
  loadAdminOutbox();
});
