document.addEventListener("DOMContentLoaded", () => {
    const page = document.getElementById("collaborationPage");
    if (!page) {
        return;
    }

    if (!TravelApp.isAuthenticated()) {
        window.location.href = "login.html";
        return;
    }

    seedDefaults();

    const inviteModal = new bootstrap.Modal(document.getElementById("inviteModal"));
    const stageModal = new bootstrap.Modal(document.getElementById("stageModal"));

    renderParticipants();
    renderStages();
    renderNotes();
    renderIdeas();

    document.getElementById("inviteParticipantButton").addEventListener("click", () => {
        document.getElementById("inviteParticipantForm").reset();
        inviteModal.show();
    });

    document.getElementById("addStageButton").addEventListener("click", () => {
        document.getElementById("stageForm").reset();
        document.getElementById("stageId").value = "";
        document.getElementById("stageModalLabel").textContent = "Добавить этап маршрута";
        stageModal.show();
    });

    document.getElementById("inviteParticipantForm").addEventListener("submit", (event) => {
        event.preventDefault();
        const name = document.getElementById("participantName").value.trim();
        const email = document.getElementById("participantEmail").value.trim();
        const role = document.getElementById("participantRole").value;
        const status = document.getElementById("participantStatus").value;

        if (!name || !email || !role || !status) {
            TravelApp.showToast("Заполните данные участника", "error");
            return;
        }

        const participants = TravelApp.getStorage(TravelApp.storageKeys.collaborationParticipants, []);
        participants.push({ id: TravelApp.generateId("participant"), name, email, role, status });
        TravelApp.setStorage(TravelApp.storageKeys.collaborationParticipants, participants);
        inviteModal.hide();
        renderParticipants();
        TravelApp.showToast("Участник добавлен", "success");
    });

    document.getElementById("stageForm").addEventListener("submit", (event) => {
        event.preventDefault();
        const stageId = document.getElementById("stageId").value;
        const day = document.getElementById("stageDay").value.trim();
        const place = document.getElementById("stagePlace").value.trim();
        const description = document.getElementById("stageDescription").value.trim();

        if (!day || !place || !description) {
            TravelApp.showToast("Заполните этап маршрута", "error");
            return;
        }

        const stages = TravelApp.getStorage(TravelApp.storageKeys.collaborationStages, []);
        if (stageId) {
            const index = stages.findIndex((stage) => stage.id === stageId);
            if (index >= 0) {
                stages[index] = { ...stages[index], day, place, description };
            }
            TravelApp.showToast("Этап маршрута обновлён", "success");
        } else {
            stages.push({ id: TravelApp.generateId("stage"), day, place, description });
            TravelApp.showToast("Этап маршрута добавлен", "success");
        }

        TravelApp.setStorage(TravelApp.storageKeys.collaborationStages, stages);
        stageModal.hide();
        renderStages();
    });

    document.getElementById("sharedNoteForm").addEventListener("submit", (event) => {
        event.preventDefault();
        const author = document.getElementById("sharedNoteAuthor").value.trim();
        const text = document.getElementById("sharedNoteText").value.trim();

        if (!author || !text) {
            TravelApp.showToast("Укажите автора и текст заметки", "error");
            return;
        }

        const notes = TravelApp.getStorage(TravelApp.storageKeys.collaborationNotes, []);
        notes.unshift({ id: TravelApp.generateId("note"), author, text, date: new Date().toISOString() });
        TravelApp.setStorage(TravelApp.storageKeys.collaborationNotes, notes);
        event.target.reset();
        renderNotes();
        TravelApp.showToast("Общая заметка добавлена", "success");
    });

    document.getElementById("ideaForm").addEventListener("submit", (event) => {
        event.preventDefault();
        const title = document.getElementById("ideaTitle").value.trim();
        const text = document.getElementById("ideaText").value.trim();

        if (!title || !text) {
            TravelApp.showToast("Заполните заголовок и описание идеи", "error");
            return;
        }

        const ideas = TravelApp.getStorage(TravelApp.storageKeys.collaborationIdeas, []);
        ideas.unshift({ id: TravelApp.generateId("idea"), title, text, votes: 0 });
        TravelApp.setStorage(TravelApp.storageKeys.collaborationIdeas, ideas);
        event.target.reset();
        renderIdeas();
        TravelApp.showToast("Идея добавлена", "success");
    });

    page.addEventListener("click", (event) => {
        const editStageButton = event.target.closest("[data-stage-edit]");
        const deleteStageButton = event.target.closest("[data-stage-delete]");
        const deleteNoteButton = event.target.closest("[data-shared-note-delete]");
        const supportIdeaButton = event.target.closest("[data-idea-support]");

        if (editStageButton) {
            const stage = TravelApp.getStorage(TravelApp.storageKeys.collaborationStages, []).find((item) => item.id === editStageButton.dataset.stageEdit);
            if (stage) {
                document.getElementById("stageId").value = stage.id;
                document.getElementById("stageDay").value = stage.day;
                document.getElementById("stagePlace").value = stage.place;
                document.getElementById("stageDescription").value = stage.description;
                document.getElementById("stageModalLabel").textContent = "Редактировать этап маршрута";
                stageModal.show();
            }
        }

        if (deleteStageButton) {
            TravelApp.removeArrayItem(TravelApp.storageKeys.collaborationStages, (stage) => stage.id === deleteStageButton.dataset.stageDelete);
            renderStages();
            TravelApp.showToast("Этап маршрута удалён", "info");
        }

        if (deleteNoteButton) {
            TravelApp.removeArrayItem(TravelApp.storageKeys.collaborationNotes, (note) => note.id === deleteNoteButton.dataset.sharedNoteDelete);
            renderNotes();
            TravelApp.showToast("Заметка удалена", "info");
        }

        if (supportIdeaButton) {
            const ideas = TravelApp.getStorage(TravelApp.storageKeys.collaborationIdeas, []);
            const index = ideas.findIndex((idea) => idea.id === supportIdeaButton.dataset.ideaSupport);
            if (index >= 0) {
                ideas[index].votes += 1;
                TravelApp.setStorage(TravelApp.storageKeys.collaborationIdeas, ideas);
                renderIdeas();
                TravelApp.showToast("Вы поддержали идею", "success");
            }
        }
    });
});

function seedDefaults() {
    TravelApp.seedCollection(TravelApp.storageKeys.collaborationParticipants, [
        { id: "p1", name: "Анна Смирнова", email: "anna@example.com", role: "organizer", status: "online" },
        { id: "p2", name: "Игорь Морозов", email: "igor@example.com", role: "member", status: "online" },
        { id: "p3", name: "Мария Крылова", email: "maria@example.com", role: "member", status: "offline" }
    ]);
    TravelApp.seedCollection(TravelApp.storageKeys.collaborationStages, [
        { id: "s1", day: "День 1", place: "Прибытие и центр города", description: "Заселение, прогулка по набережной и ужин всей группой." },
        { id: "s2", day: "День 2", place: "Главные достопримечательности", description: "Экскурсия, обзорные точки и вечерняя встреча для корректировки плана." }
    ]);
    TravelApp.seedCollection(TravelApp.storageKeys.collaborationNotes, [
        { id: "n1", author: "Анна", text: "Проверьте, чтобы отель был рядом с центром и станцией транспорта.", date: "2026-03-10" }
    ]);
    TravelApp.seedCollection(TravelApp.storageKeys.collaborationIdeas, [
        { id: "i1", title: "Добавить музейный день", text: "Выделить отдельный день под музеи и локальные выставки.", votes: 4 },
        { id: "i2", title: "Сделать общий ужин в первый вечер", text: "Это поможет синхронизировать ожидания по маршруту и бюджету.", votes: 6 }
    ]);
}

function renderParticipants() {
    const participants = TravelApp.getStorage(TravelApp.storageKeys.collaborationParticipants, []);
    document.getElementById("participantsList").innerHTML = participants.map((participant) => `
        <div class="col-md-6 col-xl-4">
            <article class="collab-card">
                <div class="d-flex justify-content-between align-items-start gap-3 mb-3">
                    <div>
                        <h3 class="h5 mb-1">${TravelApp.escapeHtml(participant.name)}</h3>
                        <p class="text-secondary mb-0">${TravelApp.escapeHtml(participant.email)}</p>
                    </div>
                    <span class="badge ${participant.role === "organizer" ? "badge-city" : "badge-soft"}">${participant.role === "organizer" ? "Организатор" : "Участник"}</span>
                </div>
                <p class="participant-status ${participant.status === "online" ? "status-online" : "status-offline"}">${participant.status === "online" ? "Онлайн" : "Оффлайн"}</p>
            </article>
        </div>
    `).join("");
}

function renderStages() {
    const stages = TravelApp.getStorage(TravelApp.storageKeys.collaborationStages, []);
    const container = document.getElementById("stagesList");
    const empty = document.getElementById("stagesEmpty");

    if (!stages.length) {
        container.innerHTML = "";
        empty.classList.remove("d-none");
        return;
    }

    empty.classList.add("d-none");
    container.innerHTML = stages.map((stage) => `
        <article class="collab-card">
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3">
                <div>
                    <span class="badge badge-soft mb-3">${TravelApp.escapeHtml(stage.day)}</span>
                    <h3 class="h5 mb-2">${TravelApp.escapeHtml(stage.place)}</h3>
                    <p class="text-secondary mb-0">${TravelApp.escapeHtml(stage.description)}</p>
                </div>
                <div class="d-flex flex-wrap gap-2 align-self-stretch align-self-md-start">
                    <button type="button" class="btn btn-sm btn-outline-primary" data-stage-edit="${stage.id}">Редактировать</button>
                    <button type="button" class="btn btn-sm btn-outline-danger" data-stage-delete="${stage.id}">Удалить</button>
                </div>
            </div>
        </article>
    `).join("");
}

function renderNotes() {
    const notes = TravelApp.getStorage(TravelApp.storageKeys.collaborationNotes, []);
    const container = document.getElementById("sharedNotesList");
    const empty = document.getElementById("sharedNotesEmpty");

    if (!notes.length) {
        container.innerHTML = "";
        empty.classList.remove("d-none");
        return;
    }

    empty.classList.add("d-none");
    container.innerHTML = notes.map((note) => `
        <article class="collab-card">
            <div class="d-flex justify-content-between align-items-start gap-3 mb-2">
                <div>
                    <h3 class="h6 mb-1">${TravelApp.escapeHtml(note.author)}</h3>
                    <p class="text-secondary mb-0">${TravelApp.escapeHtml(TravelApp.formatDate(note.date))}</p>
                </div>
                <button type="button" class="btn btn-sm btn-outline-danger" data-shared-note-delete="${note.id}">Удалить</button>
            </div>
            <p class="mb-0">${TravelApp.escapeHtml(note.text)}</p>
        </article>
    `).join("");
}

function renderIdeas() {
    const ideas = TravelApp.getStorage(TravelApp.storageKeys.collaborationIdeas, []);
    const container = document.getElementById("ideasList");
    const empty = document.getElementById("ideasEmpty");

    if (!ideas.length) {
        container.innerHTML = "";
        empty.classList.remove("d-none");
        return;
    }

    empty.classList.add("d-none");
    container.innerHTML = ideas.map((idea) => `
        <div class="col-md-6">
            <article class="collab-card h-100">
                <h3 class="h5">${TravelApp.escapeHtml(idea.title)}</h3>
                <p class="text-secondary">${TravelApp.escapeHtml(idea.text)}</p>
                <div class="d-flex justify-content-between align-items-center gap-3">
                    <span class="badge badge-soft">Поддержали: ${idea.votes}</span>
                    <button type="button" class="btn btn-sm btn-primary" data-idea-support="${idea.id}">Поддержать идею</button>
                </div>
            </article>
        </div>
    `).join("");
}
