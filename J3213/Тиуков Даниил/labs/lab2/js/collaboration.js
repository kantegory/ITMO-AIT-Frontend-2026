document.addEventListener("DOMContentLoaded", () => {
    const page = document.getElementById("collaborationPage");
    if (!page) {
        return;
    }

    if (!TravelApp.isAuthenticated()) {
        window.location.href = "login.html";
        return;
    }

    const inviteModal = new bootstrap.Modal(document.getElementById("inviteModal"));
    const stageModal = new bootstrap.Modal(document.getElementById("stageModal"));

    let participants = [];
    let stages = [];
    let sharedNotes = [];
    let ideas = [];

    loadCollaborationData();

    async function loadCollaborationData() {
        try {
            const [p, s, n, i] = await Promise.all([
                TravelApi.getParticipants(),
                TravelApi.getStages(),
                TravelApi.getSharedNotes(),
                TravelApi.getIdeas()
            ]);

            participants = p;
            stages = s;
            sharedNotes = n;
            ideas = i;

            renderParticipants();
            renderStages();
            renderNotes();
            renderIdeas();
        } catch (error) {
            console.error("Ошибка загрузки данных совместного планирования:", error);
            TravelApp.showToast("Ошибка загрузки данных. Проверьте соединение с сервером.", "error");
        }
    }

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

    document.getElementById("inviteParticipantForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        const name = document.getElementById("participantName").value.trim();
        const email = document.getElementById("participantEmail").value.trim();
        const role = document.getElementById("participantRole").value;
        const status = document.getElementById("participantStatus").value;

        if (!name || !email || !role || !status) {
            TravelApp.showToast("Заполните данные участника", "error");
            return;
        }

        try {
            const participant = await TravelApi.addParticipant({ name, email, role, status });
            participants.push(participant);
            inviteModal.hide();
            renderParticipants();
            TravelApp.showToast("Участник добавлен", "success");
        } catch (error) {
            TravelApp.showToast("Ошибка при добавлении участника", "error");
            console.error("Ошибка:", error);
        }
    });

    document.getElementById("stageForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        const stageId = document.getElementById("stageId").value;
        const day = document.getElementById("stageDay").value.trim();
        const place = document.getElementById("stagePlace").value.trim();
        const description = document.getElementById("stageDescription").value.trim();

        if (!day || !place || !description) {
            TravelApp.showToast("Заполните этап маршрута", "error");
            return;
        }

        try {
            if (stageId) {
                const updated = await TravelApi.updateStage(Number(stageId), { day, place, description });
                const index = stages.findIndex((s) => s.id === Number(stageId));
                if (index >= 0) {
                    stages[index] = updated;
                }
                TravelApp.showToast("Этап маршрута обновлён", "success");
            } else {
                const stage = await TravelApi.addStage({ day, place, description });
                stages.push(stage);
                TravelApp.showToast("Этап маршрута добавлен", "success");
            }

            stageModal.hide();
            renderStages();
        } catch (error) {
            TravelApp.showToast("Ошибка при сохранении этапа", "error");
            console.error("Ошибка:", error);
        }
    });

    document.getElementById("sharedNoteForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        const author = document.getElementById("sharedNoteAuthor").value.trim();
        const text = document.getElementById("sharedNoteText").value.trim();

        if (!author || !text) {
            TravelApp.showToast("Укажите автора и текст заметки", "error");
            return;
        }

        try {
            const note = await TravelApi.addSharedNote({
                author,
                text,
                date: new Date().toISOString()
            });
            sharedNotes.unshift(note);
            event.target.reset();
            renderNotes();
            TravelApp.showToast("Общая заметка добавлена", "success");
        } catch (error) {
            TravelApp.showToast("Ошибка при добавлении заметки", "error");
            console.error("Ошибка:", error);
        }
    });

    document.getElementById("ideaForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        const title = document.getElementById("ideaTitle").value.trim();
        const text = document.getElementById("ideaText").value.trim();

        if (!title || !text) {
            TravelApp.showToast("Заполните заголовок и описание идеи", "error");
            return;
        }

        try {
            const idea = await TravelApi.addIdea({ title, text, votes: 0 });
            ideas.unshift(idea);
            event.target.reset();
            renderIdeas();
            TravelApp.showToast("Идея добавлена", "success");
        } catch (error) {
            TravelApp.showToast("Ошибка при добавлении идеи", "error");
            console.error("Ошибка:", error);
        }
    });

    page.addEventListener("click", async (event) => {
        const editStageButton = event.target.closest("[data-stage-edit]");
        const deleteStageButton = event.target.closest("[data-stage-delete]");
        const deleteNoteButton = event.target.closest("[data-shared-note-delete]");
        const supportIdeaButton = event.target.closest("[data-idea-support]");

        if (editStageButton) {
            const stage = stages.find((s) => s.id === Number(editStageButton.dataset.stageEdit));
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
            const stageId = Number(deleteStageButton.dataset.stageDelete);
            try {
                await TravelApi.deleteStage(stageId);
                stages = stages.filter((s) => s.id !== stageId);
                renderStages();
                TravelApp.showToast("Этап маршрута удалён", "info");
            } catch (error) {
                TravelApp.showToast("Ошибка при удалении этапа", "error");
                console.error("Ошибка:", error);
            }
        }

        if (deleteNoteButton) {
            const noteId = Number(deleteNoteButton.dataset.sharedNoteDelete);
            try {
                await TravelApi.deleteSharedNote(noteId);
                sharedNotes = sharedNotes.filter((n) => n.id !== noteId);
                renderNotes();
                TravelApp.showToast("Заметка удалена", "info");
            } catch (error) {
                TravelApp.showToast("Ошибка при удалении заметки", "error");
                console.error("Ошибка:", error);
            }
        }

        if (supportIdeaButton) {
            const ideaId = Number(supportIdeaButton.dataset.ideaSupport);
            const idea = ideas.find((i) => i.id === ideaId);
            if (!idea) {
                return;
            }

            try {
                const updated = await TravelApi.updateIdea(ideaId, { votes: idea.votes + 1 });
                const index = ideas.findIndex((i) => i.id === ideaId);
                if (index >= 0) {
                    ideas[index] = updated;
                }
                renderIdeas();
                TravelApp.showToast("Вы поддержали идею", "success");
            } catch (error) {
                TravelApp.showToast("Ошибка при голосовании", "error");
                console.error("Ошибка:", error);
            }
        }
    });

    function renderParticipants() {
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
        const container = document.getElementById("sharedNotesList");
        const empty = document.getElementById("sharedNotesEmpty");

        if (!sharedNotes.length) {
            container.innerHTML = "";
            empty.classList.remove("d-none");
            return;
        }

        empty.classList.add("d-none");
        container.innerHTML = sharedNotes.map((note) => `
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
});
