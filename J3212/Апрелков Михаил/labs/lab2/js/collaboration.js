async function initCollaborationPage() {
  const notesUl = document.getElementById("collabNotesUl");
  if (!notesUl) return;
  const shareInput = document.getElementById("shareRouteInput");
  if (shareInput) {
    const pageUrl = window.location.href.split(/[?#]/)[0];
    const folder = pageUrl.replace(/[^/]*$/, "");
    shareInput.value = folder + "destination.html?id=1";
  }
  const currentUser = getCurrentUser();
  try {
    const notes = await apiRequest("/collabNotes?tripId=default");
    if (notes.length) {
      notesUl.innerHTML = notes.map((n) => renderCollabNoteLi(n, currentUser)).join("");
    }
    setupCollabNoteDelete(notesUl);
  } catch (error) {
    showToast("Не удалось загрузить общие заметки");
    setupCollabNoteDelete(notesUl);
  }
  const actUl = document.getElementById("collabActivityUl");
  if (actUl) {
    try {
      const acts = await apiRequest("/collabActivities?tripId=default");
      if (acts.length) {
        actUl.innerHTML = acts.map((a) => renderCollabActivityLi(a)).join("");
      }
    } catch (error) {}
  }
  const addBtn = document.getElementById("collabNoteBtn");
  const addInput = document.getElementById("collabNoteInput");
  if (!addBtn || !addInput) return;
  addBtn.addEventListener("click", async function () {
    const text = addInput.value.trim();
    if (!text) {
      showToast("Введите текст заметки");
      return;
    }
    const user = getCurrentUser();
    const author = user && user.name ? user.name : "Гость";
    const initial = (author.trim()[0] || "?").toUpperCase();
    try {
      const authorId = user ? Number(user.id) : null;
      const created = await apiRequest("/collabNotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tripId: "default",
          authorId: authorId,
          author: author,
          initial: initial,
          initialVariant: "secondary",
          text: text
        })
      });
      notesUl.insertAdjacentHTML("beforeend", renderCollabNoteLi(created, getCurrentUser()));
      addInput.value = "";
      showToast("Заметка добавлена в общий список");
    } catch (error) {
      showToast("Не удалось добавить заметку");
    }
  });
}

function renderCollabNoteLi(n, currentUser) {
  const v = String(n.initialVariant || "primary");
  let badgeClass = "bg-primary-subtle text-primary";
  if (v === "success") badgeClass = "bg-success-subtle text-success";
  if (v === "warning") badgeClass = "bg-warning-subtle text-warning";
  if (v === "secondary") badgeClass = "bg-secondary-subtle text-secondary";
  const canDelete =
    currentUser &&
    n.authorId != null &&
    String(n.authorId) !== "" &&
    Number(n.authorId) === Number(currentUser.id);
  const deleteBtn = canDelete
    ? '<button type="button" class="btn btn-sm btn-outline-danger ms-2 align-self-start flex-shrink-0" data-delete-collab-note-id="' +
      escapeAttr(String(n.id)) +
      '">Удалить</button>'
    : "";
  return (
    '<li class="list-group-item d-flex align-items-start" data-collab-note-id="' +
    escapeAttr(String(n.id)) +
    '"><span class="badge ' +
    badgeClass +
    ' me-2">' +
    escapeHtml(n.initial || "?") +
    '</span><div class="flex-grow-1 min-w-0"><div class="fw-semibold">' +
    escapeHtml(n.author) +
    '</div><div class="text-muted-sm">' +
    escapeHtml(n.text) +
    "</div></div>" +
    deleteBtn +
    "</li>"
  );
}

function setupCollabNoteDelete(notesUl) {
  if (!notesUl || notesUl.dataset.collabDeleteBound === "true") return;
  notesUl.dataset.collabDeleteBound = "true";
  notesUl.addEventListener("click", async function (e) {
    const btn = e.target.closest("[data-delete-collab-note-id]");
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    const user = getCurrentUser();
    if (!user) {
      showToast("Войдите, чтобы удалять заметки");
      return;
    }
    const noteId = btn.getAttribute("data-delete-collab-note-id");
    if (!noteId) return;
    try {
      const note = await apiRequest("/collabNotes/" + noteId);
      if (note.authorId == null || Number(note.authorId) !== Number(user.id)) {
        showToast("Можно удалить только свою заметку");
        return;
      }
      await apiRequest("/collabNotes/" + noteId, {
        method: "DELETE"
      });
      const li = btn.closest("[data-collab-note-id]");
      if (li) li.remove();
      showToast("Заметка удалена");
    } catch (error) {
      showToast("Не удалось удалить заметку");
    }
  });
}

function renderCollabActivityLi(a) {
  const icon = String(a.icon || "circle").replace(/[^a-z0-9-]/gi, "");
  const color = String(a.iconColor || "secondary").replace(/[^a-z]/g, "");
  return (
    '<li class="list-group-item text-muted-sm">' +
    iconSprite(icon, "me-1 text-" + color) +
    escapeHtml(a.text) +
    "</li>"
  );
}
