import { request } from "./api.js";
import { renderDatasets, renderExplore, renderModels, renderSubscriptions } from "./render.js";
import { state } from "./state.js";
import { currentId, escapeHtml } from "./utils.js";

export function exposeActions() {
    window.socialAction = socialAction;
    window.addComment = addComment;
    window.addToMy = addToMy;
    window.deleteItem = deleteItem;
}

export function setupActions() {
    const inputs = document.querySelectorAll(".filter-input, #globalSearch");
    inputs.forEach(input => input.addEventListener("input", renderExplore));

    const resetBtn = document.getElementById("resetFilters");
    if (resetBtn) {
        resetBtn.onclick = () => {
            document.querySelectorAll(".filter-input").forEach(input => input.value = "");
            document.getElementById("globalSearch").value = "";
            renderExplore();
        };
    }

    setupUploadModal();
}

async function socialAction(type, category = "model", sourceEvent = window.event) {
    const isModel = category === "model";
    const lists = isModel
        ? [{ list: state.myModels, path: "myModels" }, { list: state.globalModels, path: "globalModels" }]
        : [{ list: state.myDatasets, path: "myDatasets" }, { list: state.globalDatasets, path: "globalDatasets" }];
    const collection = lists.find(item => item.list.some(entry => entry.id === currentId()));
    const entity = collection?.list.find(entry => entry.id === currentId());
    if (!entity) return;

    const field = type === "like" ? "likes" : "forks";
    entity[field] = (entity[field] || 0) + 1;
    const countId = (isModel ? "model" : "ds") + (type === "like" ? "Likes" : "Forks");
    document.getElementById(countId).innerText = entity[field];
    await request(`/${collection.path}/${entity.id}`, { method: "PATCH", body: { [field]: entity[field] } });

    const btn = sourceEvent?.currentTarget;
    if (btn) {
        btn.classList.remove("btn-outline-primary", "btn-outline-secondary");
        btn.classList.add(type === "like" ? "btn-primary" : "btn-secondary");
    }
}

async function addComment() {
    const input = document.getElementById("commentInput");
    const list = document.getElementById("commentsList");
    if (!input || !input.value.trim()) return;

    const comment = await request("/comments", {
        method: "POST",
        body: {
            user: localStorage.getItem("userName") || "Пользователь",
            text: input.value.trim(),
            page: window.location.pathname,
            resourceId: currentId(),
            createdAt: new Date().toISOString()
        }
    });

    list.insertAdjacentHTML("afterbegin", `
        <div class="p-3 bg-light rounded-4 mb-3 shadow-sm" style="border-left: 4px solid #0d6efd;">
            <div class="fw-bold small mb-1">${escapeHtml(comment.user)} <span class="text-muted fw-normal ms-2">Только что</span></div>
            <div class="small text-dark">${escapeHtml(comment.text)}</div>
        </div>`);
    input.value = "";
}

async function deleteItem(type, id) {
    if (!confirm("Вы уверены?")) return;
    const collections = {
        models: { list: state.myModels, path: "myModels", render: renderModels },
        datasets: { list: state.myDatasets, path: "myDatasets", render: renderDatasets },
        subs: { list: state.mySubscriptions, path: "mySubscriptions", render: renderSubscriptions }
    };
    const collection = collections[type];
    if (!collection) return;

    await request(`/${collection.path}/${id}`, { method: "DELETE" });
    collection.list.splice(collection.list.findIndex(item => item.id === id), 1);
    collection.render();
}

async function addToMy(type, id) {
    const isModel = type === "models";
    const source = isModel ? state.globalModels : state.globalDatasets;
    const target = isModel ? state.myModels : state.myDatasets;
    const endpoint = isModel ? "myModels" : "myDatasets";
    const item = source.find(entry => entry.id === id);

    if (!item || target.some(entry => entry.id === id)) {
        alert("Уже добавлено");
        return;
    }

    const created = await request(`/${endpoint}`, {
        method: "POST",
        body: { ...item, date: new Date().toLocaleDateString() }
    });
    target.push(created);
    alert("Добавлено в вашу коллекцию!");
}

function setupUploadModal() {
    const btn = document.getElementById("submitUpload") || document.querySelector("#uploadModal .btn-primary");
    if (!btn) return;

    btn.onclick = async () => {
        const modal = btn.closest(".modal-content");
        const name = modal.querySelector("input")?.value.trim();
        const selectedType = modal.querySelector("select")?.value || "model";
        if (!name) {
            alert("Введите название");
            return;
        }

        const isDataset = selectedType === "dataset" || window.location.pathname.includes("my-datasets.html");
        if (isDataset) {
            const dataset = await request("/myDatasets", {
                method: "POST",
                body: {
                    name,
                    format: "JSON",
                    size: "0MB",
                    tag: selectedType === "dataset" ? "Custom" : selectedType,
                    date: new Date().toLocaleDateString(),
                    rows: "0",
                    description: "Пользовательский датасет",
                    likes: 0,
                    license: "Private"
                }
            });
            state.myDatasets.push(dataset);
            renderDatasets();
        } else {
            const model = await request("/myModels", {
                method: "POST",
                body: {
                    name,
                    framework: "Custom",
                    size: "0MB",
                    tag: selectedType === "model" ? "Custom" : selectedType,
                    date: new Date().toLocaleDateString(),
                    author: localStorage.getItem("userName") || "Пользователь",
                    description: "Пользовательская модель",
                    version: "1.0.0",
                    likes: 0,
                    forks: 0,
                    license: "Private"
                }
            });
            state.myModels.push(model);
            renderModels();
        }

        alert("Успешно отправлено на модерацию!");
    };
}
