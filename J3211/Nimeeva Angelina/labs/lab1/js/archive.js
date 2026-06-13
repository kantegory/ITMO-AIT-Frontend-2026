document.addEventListener("DOMContentLoaded", () => {
  const app = window.Lab1App;
  if (!app) return;

  const updateArchiveResultsStatus = (visible) => {
    const resultsStatus = document.getElementById("archiveResultsStatus");
    if (!resultsStatus) return;

    resultsStatus.textContent =
      visible === 0
        ? "По выбранным фильтрам документы архива не найдены."
        : `Показано ${visible} ${app.pluralize(visible, ["документ", "документа", "документов"])}.`;
  };

  const renderArchiveRow = (documentItem) => {
    const badgeClass =
      {
        signed: "status-accepted",
        pending: "status-pending",
        received: "status-received",
        rejected: "status-rejected",
      }[documentItem.status] || "status-received";

    return `
      <tr data-archive-row data-title="${app.escapeHtml(documentItem.title || "")}" data-type="${app.escapeHtml(
        documentItem.type || "",
      )}" data-status="${app.escapeHtml(documentItem.status || "")}">
        <td>${app.escapeHtml(documentItem.title || "Документ")}</td>
        <td>${app.escapeHtml(documentItem.typeLabel || documentItem.type || "Документ")}</td>
        <td>${app.escapeHtml(documentItem.date || "—")}</td>
        <td><span class="badge app-badge ${badgeClass}">${app.escapeHtml(
          documentItem.statusLabel || "Без статуса",
        )}</span></td>
        <td class="text-body-secondary small">${app.escapeHtml(
          documentItem.comment || "Без комментария.",
        )}</td>
      </tr>
    `;
  };

  const filterArchive = () => {
    const rows = app.$$("[data-archive-row]");
    if (!rows.length) {
      updateArchiveResultsStatus(0);
      return;
    }

    const query = (document.getElementById("archiveQuery")?.value || "").trim().toLowerCase();
    const type = document.getElementById("archiveType")?.value || "all";
    const status = document.getElementById("archiveStatus")?.value || "all";
    let visible = 0;

    rows.forEach((row) => {
      const matches =
        (!query || (row.dataset.title || "").toLowerCase().includes(query)) &&
        (type === "all" || row.dataset.type === type) &&
        (status === "all" || row.dataset.status === status);

      row.classList.toggle("d-none", !matches);
      if (matches) visible += 1;
    });

    if (document.getElementById("archiveCount")) {
      document.getElementById("archiveCount").textContent = String(visible);
    }

    updateArchiveResultsStatus(visible);
  };

  const filterDocumentsForRole = (items) => {
    const role = app.getSavedRole();
    if (role !== "tenant") {
      return app.sortByIdDesc(items);
    }

    const currentUser = app.getCurrentUser();
    return app.sortByIdDesc(
      items.filter((item) => !item.tenant || item.tenant === currentUser?.name),
    );
  };

  const renderArchiveDocuments = () =>
    app.renderTableData({
      selector: "#archiveContent tbody",
      columns: 5,
      emptyMessage: "В архиве пока нет документов.",
      errorMessage: "Не удалось загрузить архив документов.",
      fetchItems: () => app.fetchCollection("documents"),
      transformItems: filterDocumentsForRole,
      renderItem: renderArchiveRow,
      onRendered: (documents) => {
        if (document.getElementById("archiveCount")) {
          document.getElementById("archiveCount").textContent = String(documents.length);
        }
        filterArchive();
      },
    });

  const syncArchiveAccess = async () => {
    const guestBlock = document.getElementById("archiveGuest");
    const contentBlock = document.getElementById("archiveContent");
    const role = app.getSavedRole();

    if (!guestBlock || !contentBlock) return;

    guestBlock.classList.toggle("d-none", Boolean(role));
    contentBlock.classList.toggle("d-none", !role);

    if (!role) {
      if (document.getElementById("archiveResultsStatus")) {
        document.getElementById("archiveResultsStatus").textContent =
          "Архив доступен после входа в кабинет.";
      }
      return;
    }

    if (document.getElementById("archiveHeroTitle")) {
      document.getElementById("archiveHeroTitle").textContent =
        role === "admin"
          ? "Архив и управление документами"
          : "Архив договоров, счетов и актов";
    }

    if (document.getElementById("archiveHeroText")) {
      document.getElementById("archiveHeroText").textContent =
        role === "admin"
          ? "Здесь хранятся входящие и исходящие документы, а также быстрый доступ к согласованию."
          : "Здесь лежат договоры, допсоглашения, счета и акты с поиском и фильтрами.";
    }

    await renderArchiveDocuments();
  };

  app.watch(["archiveQuery", "archiveType", "archiveStatus"], filterArchive);
  syncArchiveAccess();
});
