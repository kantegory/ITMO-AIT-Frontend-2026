import { state } from "./state.js";
import { currentId, escapeHtml } from "./utils.js";

export function renderAll() {
    renderModels();
    renderDatasets();
    renderSubscriptions();
    renderExplore();
    loadModelDetails();
    loadDatasetDetails();
    loadSubscriptionDetails();
}

export function renderExplore() {
    const mRow = document.querySelector("#explore-models-row");
    const dRow = document.querySelector("#explore-datasets-row");
    if (!mRow && !dRow) return;

    const searchVal = document.getElementById("globalSearch")?.value.toLowerCase() || "";
    const tagVal = document.getElementById("filterTag")?.value || "";
    const frameVal = document.getElementById("filterFramework")?.value || "";
    const licVal = document.getElementById("filterLicense")?.value || "";
    const models = state.globalModels.filter(model => {
        return model.name.toLowerCase().includes(searchVal) &&
            (tagVal === "" || model.tag === tagVal) &&
            (frameVal === "" || model.framework === frameVal) &&
            (licVal === "" || model.license === licVal);
    });
    const datasets = state.globalDatasets.filter(dataset => {
        return dataset.name.toLowerCase().includes(searchVal) &&
            (tagVal === "" || dataset.tag === tagVal) &&
            (licVal === "" || dataset.license?.includes(licVal));
    });

    if (mRow) {
        mRow.innerHTML = models.map(model => `
            <div class="col-md-6 col-lg-4">
                <div class="card card-item p-3 h-100 border-0 shadow-sm">
                    <h6 class="fw-bold"><a href="model-details.html?id=${model.id}" class="text-dark text-decoration-none">${escapeHtml(model.name)}</a></h6>
                    <div class="text-muted small mb-2">${escapeHtml(model.framework)} • ${escapeHtml(model.license)}</div>
                    <p class="text-muted small mb-3">${escapeHtml(model.description)}</p>
                    <div class="d-flex justify-content-between align-items-center mt-auto">
                        <span class="tag">${escapeHtml(model.tag)}</span>
                        <button class="btn btn-primary btn-sm" type="button" aria-label="Добавить модель ${escapeHtml(model.name)}" onclick="addToMy('models', ${model.id})">Добавить</button>
                    </div>
                </div>
            </div>`).join("") || '<p class="text-muted p-3">Модели не найдены</p>';
    }

    if (dRow) {
        dRow.innerHTML = datasets.map(dataset => `
            <div class="col-md-6 col-lg-4">
                <div class="card card-item p-3 h-100 border-0 shadow-sm">
                    <h6 class="fw-bold"><a href="dataset-details.html?id=${dataset.id}" class="text-dark text-decoration-none">${escapeHtml(dataset.name)}</a></h6>
                    <div class="text-muted small mb-2">${escapeHtml(dataset.size)} • ${escapeHtml(dataset.license)}</div>
                    <p class="text-muted small mb-3">${escapeHtml(dataset.description)}</p>
                    <div class="d-flex justify-content-between align-items-center mt-auto">
                        <span class="tag">${escapeHtml(dataset.tag)}</span>
                        <button class="btn btn-primary btn-sm" type="button" aria-label="Добавить датасет ${escapeHtml(dataset.name)}" onclick="addToMy('datasets', ${dataset.id})">Добавить</button>
                    </div>
                </div>
            </div>`).join("") || '<p class="text-muted p-3">Датасеты не найдены</p>';
    }
}

export function renderModels() {
    const dash = document.querySelector("#dashboard-models-row");
    const table = document.querySelector("#models-table-body");
    if (!dash && !table) return;

    const html = state.myModels.map(model => dash ? `
        <div class="col-md-4"><div class="card card-item p-3 h-100 shadow-sm border-0">
            <h6 class="fw-semibold"><a href="model-details.html?id=${model.id}" class="text-decoration-none text-dark">${escapeHtml(model.name)}</a></h6>
            <div class="text-muted small mb-2">${escapeHtml(model.framework)}</div>
            <span class="tag w-fit">${escapeHtml(model.tag)}</span>
        </div></div>` : `
        <tr>
            <td class="ps-4"><a href="model-details.html?id=${model.id}" class="text-dark fw-bold text-decoration-none">${escapeHtml(model.name)}</a></td>
            <td><span class="tag">${escapeHtml(model.tag)}</span></td><td>${escapeHtml(model.size)}</td><td>${escapeHtml(model.date)}</td>
            <td class="text-end pe-4"><button class="btn btn-light btn-sm text-danger" type="button" aria-label="Удалить модель ${escapeHtml(model.name)}" onclick="deleteItem('models', ${model.id})">Удалить</button></td>
        </tr>`).join("");
    if (dash) dash.innerHTML = html;
    if (table) table.innerHTML = html;
}

export function renderDatasets() {
    const dash = document.querySelector("#dashboard-datasets-row");
    const table = document.querySelector("#datasets-table-body");
    if (!dash && !table) return;

    const html = state.myDatasets.map(dataset => dash ? `
        <div class="col-md-4"><div class="card card-item p-3 h-100 shadow-sm border-0">
            <h6 class="fw-semibold"><a href="dataset-details.html?id=${dataset.id}" class="text-decoration-none text-dark">${escapeHtml(dataset.name)}</a></h6>
            <div class="text-muted small mb-2">${escapeHtml(dataset.format)}</div>
            <span class="tag w-fit">${escapeHtml(dataset.tag)}</span>
        </div></div>` : `
        <tr>
            <td class="ps-4"><a href="dataset-details.html?id=${dataset.id}" class="text-dark fw-bold text-decoration-none">${escapeHtml(dataset.name)}</a></td>
            <td><span class="tag">${escapeHtml(dataset.tag)}</span></td><td>${escapeHtml(dataset.size)}</td><td>${escapeHtml(dataset.date)}</td>
            <td class="text-end pe-4"><button class="btn btn-light btn-sm text-danger" type="button" aria-label="Удалить датасет ${escapeHtml(dataset.name)}" onclick="deleteItem('datasets', ${dataset.id})">Удалить</button></td>
        </tr>`).join("");
    if (dash) dash.innerHTML = html;
    if (table) table.innerHTML = html;
}

export function renderSubscriptions() {
    const dash = document.querySelector("#dashboard-subs-row");
    const table = document.querySelector("#subs-table-body");
    if (!dash && !table) return;

    const html = state.mySubscriptions.map(subscription => dash ? `
        <div class="col-md-4">
            <div class="card card-item p-3 h-100 shadow-sm border-0">
                <h6 class="fw-semibold"><a href="subscription-details.html?id=${subscription.id}" class="text-decoration-none text-dark">${escapeHtml(subscription.name)}</a></h6>
                <div class="text-muted small mb-2">${escapeHtml(subscription.type)}</div>
                <span class="tag w-fit">${escapeHtml(subscription.updates)}</span>
            </div>
        </div>` : `
        <tr>
            <td class="ps-4"><a href="subscription-details.html?id=${subscription.id}" class="text-dark fw-bold text-decoration-none">${escapeHtml(subscription.name)}</a></td>
            <td><span class="tag">${escapeHtml(subscription.updates)}</span></td>
            <td>Активна</td>
            <td>${escapeHtml(subscription.date)}</td>
            <td class="text-end pe-4"><button class="btn btn-light btn-sm text-danger" type="button" aria-label="Отписаться от ${escapeHtml(subscription.name)}" onclick="deleteItem('subs', ${subscription.id})">Отписаться</button></td>
        </tr>`).join("");
    if (dash) dash.innerHTML = html;
    if (table) table.innerHTML = html;
}

export function loadModelDetails() {
    if (!window.location.pathname.includes("model-details.html")) return;
    const model = [...state.myModels, ...state.globalModels].find(item => item.id === currentId());
    if (!model) return;

    document.getElementById("modelTitle").innerText = model.name;
    document.getElementById("modelDescription").innerText = model.description;
    document.getElementById("modelAuthor").innerText = model.author;
    document.getElementById("modelFramework").innerText = model.framework || "N/A";
    document.getElementById("modelSize").innerText = model.size;
    document.getElementById("modelTag").innerText = model.tag;
    document.getElementById("modelLikes").innerText = model.likes || 0;
    document.getElementById("modelForks").innerText = model.forks || 0;
    document.getElementById("modelSlug").innerText = model.name.toLowerCase().replace(/\s+/g, "-");
}

export function loadDatasetDetails() {
    if (!window.location.pathname.includes("dataset-details.html")) return;
    const dataset = [...state.myDatasets, ...state.globalDatasets].find(item => item.id === currentId());
    if (!dataset) return;

    document.getElementById("dsTitle").innerText = dataset.name;
    document.getElementById("dsDescription").innerText = dataset.description;
    document.getElementById("dsRows").innerText = dataset.rows || "N/A";
    document.getElementById("dsFormat").innerText = dataset.format;
    document.getElementById("dsSize").innerText = dataset.size;
    document.getElementById("dsTag").innerText = dataset.tag;
    document.getElementById("dsLikes").innerText = dataset.likes || 0;
    document.getElementById("dsDate").innerText = dataset.date;
}

export function loadSubscriptionDetails() {
    if (!window.location.pathname.includes("subscription-details.html")) return;
    const subscription = state.mySubscriptions.find(item => item.id === currentId());
    if (!subscription) return;

    document.getElementById("subTitle").innerText = subscription.name;
    document.getElementById("subNameDisplay").innerText = subscription.name;
    document.getElementById("subTypeDisplay").innerText = subscription.type;
    document.getElementById("subMembers").innerText = subscription.members;
    document.getElementById("subReleases").innerText = subscription.releases;
    document.getElementById("subDescription").innerText = subscription.description;
    document.getElementById("subInitials").innerText = subscription.name.substring(0, 2).toUpperCase();
}
