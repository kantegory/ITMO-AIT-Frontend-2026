async function initProfilePage() {
  const notesInput = document.getElementById("travelNotes");
  const saveBtn = document.getElementById("saveNoteBtn");
  if (!notesInput || !saveBtn) return;
  const user = getCurrentUser();
  if (!user) {
    showToast("Войдите, чтобы открыть профиль");
    return;
  }
  fillProfileHeader(user);
  try {
    await fillProfileSavedRoutes(user.id);
  } catch (error) {
    showToast("Не удалось загрузить сохранённые маршруты");
  }
  try {
    await setupNoteSaving(user.id);
  } catch (error) {
    showToast("Не удалось загрузить заметки");
  }
}

function fillProfileHeader(user) {
  const hello = document.querySelector("h1.h4");
  const email = document.querySelector(".profile-email-line");
  if (hello) {
    hello.textContent = "Привет, " + (user.name || "путешественник") + "!";
  }
  if (email) {
    email.innerHTML = iconSprite("envelope", "me-1") + " " + escapeHtml(user.email);
  }
}

async function fillProfileSavedRoutes(userId) {
  const container = document.getElementById("savedRoutesGrid");
  if (!container) return;
  const uid = Number(userId);
  if (!Number.isFinite(uid)) {
    container.innerHTML =
      '<div class="col-12"><div class="text-muted-sm">Не удалось определить пользователя.</div></div>';
    return;
  }
  const mine = await getSavedRoutesForUser(uid);
  const seenRouteIds = new Set();
  const uniqueSaved = [];
  mine.forEach(function (item) {
    const rid = Number(item.routeId);
    if (!Number.isFinite(rid) || seenRouteIds.has(rid)) return;
    seenRouteIds.add(rid);
    uniqueSaved.push(item);
  });
  if (!uniqueSaved.length) {
    container.innerHTML =
      '<div class="col-12"><div class="text-muted-sm">Сохранённых маршрутов пока нет.</div></div>';
    return;
  }
  const routePromises = uniqueSaved.map(function (item) {
    return apiRequest("/routes/" + item.routeId).catch(function () {
      return null;
    });
  });
  const routes = (await Promise.all(routePromises)).filter(Boolean);
  if (!routes.length) {
    container.innerHTML =
      '<div class="col-12"><div class="text-muted-sm">Не удалось загрузить данные маршрутов.</div></div>';
    return;
  }
  container.innerHTML = routes
    .map(
      (route) =>
        '<div class="col-md-6"><div class="card h-100 border-0 bg-light"><div class="card-body"><h5 class="card-title mb-1">' +
        escapeHtml(route.title) +
        '</h5><p class="text-muted-sm mb-2">' +
        Number(route.durationDays) +
        ' дня • ' +
        escapeHtml(route.type === "nature" ? "природа" : "город") +
        '</p><div class="mb-2 d-flex flex-wrap gap-2"><span class="badge bg-primary-subtle text-primary">' +
        escapeHtml(route.type === "nature" ? "Природа" : "Город") +
        '</span><span class="badge bg-secondary-subtle text-secondary">' +
        Number(route.budget).toLocaleString("ru-RU") +
        ' ₽</span></div><a href="destination.html?id=' +
        route.id +
        '" class="small text-decoration-none">Открыть маршрут →</a></div></div></div>'
    )
    .join("");
}

async function setupNoteSaving(userId) {
  const btn = document.getElementById("saveNoteBtn");
  const textarea = document.getElementById("travelNotes");
  const listEl = document.getElementById("profileNotesList");
  if (!btn || !textarea || !listEl) return;
  const normalizedUserId = Number(userId);
  if (!Number.isFinite(normalizedUserId)) return;
  if (btn.dataset.noteAddBound === "true") return;
  btn.dataset.noteAddBound = "true";
  let notes = [];
  try {
    notes = await apiRequest("/notes?userId=" + normalizedUserId);
  } catch (error) {
    showToast("Не удалось загрузить заметки");
  }
  renderProfileNotesList(listEl, notes, normalizedUserId);
  setupProfileNoteDelete(listEl);
  btn.addEventListener("click", async function (e) {
    e.preventDefault();
    const text = textarea.value.trim();
    if (!text) {
      showToast("Введите текст заметки");
      return;
    }
    const nowIso = new Date().toISOString();
    try {
      const created = await apiRequest("/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: normalizedUserId,
          text: text,
          updatedAt: nowIso
        })
      });
      const emptyHint = listEl.querySelector("[data-note-empty]");
      if (emptyHint) emptyHint.remove();
      listEl.insertAdjacentHTML("afterbegin", renderProfileNoteLi(created, normalizedUserId));
      textarea.value = "";
      showToast("Заметка добавлена");
    } catch (error) {
      showToast("Не удалось сохранить заметку");
    }
  });
}

function sortProfileNotesByDateDesc(notes) {
  return [...notes].sort((a, b) => {
    const ta = new Date(a.updatedAt || 0).getTime();
    const tb = new Date(b.updatedAt || 0).getTime();
    return tb - ta;
  });
}

function renderProfileNotesList(listEl, notes, currentUserId) {
  const sorted = sortProfileNotesByDateDesc(notes);
  if (!sorted.length) {
    listEl.innerHTML =
      '<li class="list-group-item text-muted-sm" data-note-empty="1">Пока нет заметок — добавьте первую ниже.</li>';
    return;
  }
  listEl.innerHTML = sorted.map((n) => renderProfileNoteLi(n, currentUserId)).join("");
}

function renderProfileNoteLi(n, currentUserId) {
  const noteId = escapeAttr(String(n.id));
  const updated = n.updatedAt ? new Date(n.updatedAt).toLocaleString("ru-RU") : "";
  const canDelete =
    Number.isFinite(Number(currentUserId)) && Number(n.userId) === Number(currentUserId);
  const deleteBtn = canDelete
    ? '<button type="button" class="btn btn-sm btn-outline-danger flex-shrink-0" data-delete-profile-note-id="' +
      noteId +
      '">Удалить</button>'
    : "";
  return (
    '<li class="list-group-item d-flex align-items-start justify-content-between gap-2" data-profile-note-id="' +
    noteId +
    '"><div class="flex-grow-1 min-w-0"><div class="text-muted-sm small">' +
    escapeHtml(updated || "без даты") +
    '</div><div class="mt-1">' +
    escapeHtml(n.text || "") +
    "</div></div>" +
    deleteBtn +
    "</li>"
  );
}

function setupProfileNoteDelete(listEl) {
  if (!listEl || listEl.dataset.noteDeleteBound === "true") return;
  listEl.dataset.noteDeleteBound = "true";
  listEl.addEventListener("click", async function (e) {
    const delBtn = e.target.closest("[data-delete-profile-note-id]");
    if (!delBtn) return;
    e.preventDefault();
    e.stopPropagation();
    const user = getCurrentUser();
    if (!user || !Number.isFinite(Number(user.id))) {
      showToast("Войдите снова");
      return;
    }
    const uid = Number(user.id);
    const noteId = delBtn.getAttribute("data-delete-profile-note-id");
    if (!noteId) return;
    try {
      const note = await apiRequest("/notes/" + noteId);
      if (Number(note.userId) !== uid) {
        showToast("Можно удалить только свою заметку");
        return;
      }
      await apiRequest("/notes/" + noteId, {
        method: "DELETE"
      });
      const li = delBtn.closest("[data-profile-note-id]");
      if (li) li.remove();
      if (!listEl.querySelector("[data-profile-note-id]")) {
        listEl.innerHTML =
          '<li class="list-group-item text-muted-sm" data-note-empty="1">Пока нет заметок — добавьте первую ниже.</li>';
      }
      showToast("Заметка удалена");
    } catch (error) {
      showToast("Не удалось удалить заметку");
    }
  });
}
