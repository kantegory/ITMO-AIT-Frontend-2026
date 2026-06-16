document.addEventListener("DOMContentLoaded", () => {
  const app = window.Lab1App;
  if (!app || !app.requireRole("tenant")) return;

  const renderTenantReadingRow = (reading) => {
    const status = app.getReadingStatus(reading.status, "tenant");

    return `
      <tr>
        <td>${app.escapeHtml(reading.month || "—")}</td>
        <td>${app.escapeHtml(String(reading.electricity ?? 0))} кВт·ч</td>
        <td>${app.escapeHtml(String(reading.water ?? 0))} м³</td>
        <td>${app.escapeHtml(String(reading.heating ?? 0))} Гкал</td>
        <td><span class="badge app-badge ${status.className}">${status.text}</span></td>
      </tr>
    `;
  };

  const loadTenantMeterReadings = () =>
    app.renderTableData({
      selector: "#meterTableBody",
      columns: 5,
      emptyMessage: "Пока нет отправленных показаний.",
      errorMessage: "Не удалось загрузить историю показаний.",
      fetchItems: () => app.fetchCollection("meterReadings"),
      transformItems: (items) =>
        app.sortByIdDesc(items.filter((item) => app.belongsToCurrentUser(item))),
      renderItem: renderTenantReadingRow,
    });

  const renderTenantIncomingDocumentRow = (documentItem) => {
    const status = app.statusMap[documentItem.status] || app.statusMap.review;

    return `
      <tr>
        <td>${app.escapeHtml(documentItem.title || "Документ")}</td>
        <td>${app.escapeHtml(documentItem.type || "Документ")}</td>
        <td>${app.escapeHtml(documentItem.date || "—")}</td>
        <td><span class="badge app-badge ${status.className}">${status.text}</span></td>
      </tr>
    `;
  };

  const loadTenantIncomingDocuments = () =>
    app.renderTableData({
      selector: "#tenantUploadTableBody",
      columns: 4,
      emptyMessage: "Здесь появятся отправленные вами документы.",
      errorMessage: "Не удалось загрузить документы арендатора.",
      fetchItems: () => app.fetchCollection("incomingDocuments"),
      transformItems: (items) =>
        app.sortByIdDesc(items.filter((item) => app.belongsToCurrentUser(item))),
      renderItem: renderTenantIncomingDocumentRow,
    });

  const filterTenantArchiveDocuments = (items) => {
    const currentUser = app.getCurrentUser();
    return app.sortByIdDesc(
      items.filter((item) => !item.tenant || item.tenant === currentUser?.name),
    );
  };

  const renderSigningDocumentRow = (documentItem) => {
    const badgeClass =
      {
        signed: "status-accepted",
        pending: "status-pending",
        received: "status-received",
        rejected: "status-rejected",
      }[documentItem.status] || "status-received";

    const actionCell =
      documentItem.status === "pending"
        ? `<button class="btn btn-brand btn-sm" type="button" data-bs-toggle="modal" data-bs-target="#signModal" data-sign-document-id="${app.escapeHtml(
            String(documentItem.id ?? ""),
          )}" data-sign-document="${app.escapeHtml(documentItem.title || "Документ")}">Подписать</button>`
        : app.escapeHtml(documentItem.signedAt ? `Подписан ${documentItem.signedAt}` : documentItem.comment || "Готово");

    return `
      <tr>
        <td>
          <strong>${app.escapeHtml(documentItem.title || "Документ")}</strong>
          <div class="text-body-secondary small">${app.escapeHtml(
            documentItem.comment || "Без комментария.",
          )}</div>
        </td>
        <td>${app.escapeHtml(documentItem.deadline || "—")}</td>
        <td><span class="badge app-badge ${badgeClass}">${app.escapeHtml(
          documentItem.statusLabel || "Без статуса",
        )}</span></td>
        <td>${actionCell}</td>
      </tr>
    `;
  };

  const loadSigningDocuments = () =>
    app.renderTableData({
      selector: "#signingDocsTableBody",
      columns: 4,
      emptyMessage: "Сейчас нет документов, ожидающих подписи.",
      errorMessage: "Не удалось загрузить документы на подпись.",
      fetchItems: () => app.fetchCollection("documents"),
      transformItems: (items) =>
        filterTenantArchiveDocuments(items).filter((item) =>
          ["pending", "signed"].includes(item.status),
        ),
      renderItem: renderSigningDocumentRow,
    });

  document.getElementById("meterForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const profile = app.getCurrentTenantProfile();
    const reading = {
      userId: profile.userId,
      tenant: profile.tenant,
      space: profile.space,
      month: document.getElementById("meterMonth")?.value || "",
      electricity: Number(document.getElementById("electricityValue")?.value || 0),
      water: Number(document.getElementById("waterValue")?.value || 0),
      heating: Number(document.getElementById("heatingValue")?.value || 0),
      comment: document.getElementById("meterComment")?.value || "",
      status: "pending",
      date: app.formatDate(),
    };

    try {
      await app.createResource("meterReadings", reading);
      document.getElementById("meterForm")?.reset();
      await loadTenantMeterReadings();
      app.showToast("Показания отправлены на сервер.");
    } catch (error) {
      console.error(error);
      app.showToast("Ошибка отправки показаний.");
    }
  });

  const uploadInput = document.getElementById("uploadFiles");
  const uploadList = document.getElementById("uploadFileList");

  const updateUploadStatus = (count) => {
    const uploadStatus = document.getElementById("uploadFilesStatus");
    if (!uploadStatus) return;

    uploadStatus.textContent =
      count === 0
        ? "Файлы не выбраны."
        : `Выбрано ${count} ${app.pluralize(count, ["файл", "файла", "файлов"])}.`;
  };

  const renderUploadList = () => {
    if (!uploadInput || !uploadList) return;

    uploadList.innerHTML = "";
    if (!uploadInput.files.length) {
      uploadList.innerHTML = "<li>Файлы появятся здесь после выбора.</li>";
      updateUploadStatus(0);
      return;
    }

    Array.from(uploadInput.files).forEach((file) => {
      const item = document.createElement("li");
      item.textContent = file.name;
      uploadList.append(item);
    });

    updateUploadStatus(uploadInput.files.length);
  };

  uploadInput?.addEventListener("change", renderUploadList);
  renderUploadList();

  document.getElementById("uploadForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!uploadInput?.files.length) {
      app.showToast("Добавьте хотя бы один файл.");
      return;
    }

    const currentUser = app.getCurrentUser();
    const documentType = document.getElementById("uploadType")?.value || "Документ";

    try {
      await Promise.all(
        Array.from(uploadInput.files).map((file) =>
          app.createResource("incomingDocuments", {
            title: file.name,
            type: documentType,
            tenant: currentUser?.name || "Арендатор",
            userId: currentUser?.id || null,
            status: "review",
            comment: "Загружено арендатором через личный кабинет.",
            date: app.formatDate(),
          }),
        ),
      );

      document.getElementById("uploadForm")?.reset();
      renderUploadList();
      await loadTenantIncomingDocuments();
      app.showToast("Документы отправлены.");
    } catch (error) {
      console.error(error);
      app.showToast("Не удалось отправить документы.");
    }
  });

  let signDocumentId = "";
  const signModal = app.getModal("signModal");

  document.getElementById("signModal")?.addEventListener("show.bs.modal", (event) => {
    signDocumentId = event.relatedTarget?.getAttribute("data-sign-document-id") || "";
    if (document.getElementById("signDocumentName")) {
      document.getElementById("signDocumentName").textContent =
        event.relatedTarget?.getAttribute("data-sign-document") || "Документ";
    }
  });

  document.getElementById("signForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!document.getElementById("signAgreement")?.checked) {
      app.showToast("Подтвердите электронное подписание.");
      return;
    }

    if (!signDocumentId) {
      app.showToast("Не удалось определить документ для подписи.");
      return;
    }

    const signedAt = app.formatDate();

    try {
      await app.updateResource("documents", signDocumentId, {
        status: "signed",
        statusLabel: "Подписан",
        signedAt,
        comment: `Подписан ${signedAt}`,
      });

      document.getElementById("signForm")?.reset();
      signModal?.hide();
      await loadSigningDocuments();
      app.showToast(
        `Документ "${document.getElementById("signDocumentName")?.textContent || "Документ"}" подписан.`,
      );
    } catch (error) {
      console.error(error);
      app.showToast("Не удалось подписать документ.");
    }
  });

  loadTenantMeterReadings();
  loadTenantIncomingDocuments();
  loadSigningDocuments();
});
