import { apiRequest } from "../api.js";
import { ensureSession, getCollection } from "../auth.js";
import { $, escapeAttribute, escapeHtml, formatDate, formatLastSync } from "../utils.js";
import { clearMessage, showMessage, toggleBusy } from "../ui.js";

export async function initIntegrationsPage() {
  const session = await ensureSession();
  const [accounts, integrations, rules] = await Promise.all([
    getCollection("accounts", session.user.id),
    getCollection("integrations", session.user.id),
    getCollection("rules", session.user.id),
  ]);

  const state = {
    user: session.user,
    integrations,
    rules,
  };

  fillRuleAccounts(accounts);
  renderIntegrations(integrations);
  renderRules(rules);
  initImportModalState();
  initRuleForm(state);
  initImportActions(state);
}

function initImportModalState() {
  const modal = document.getElementById("importModal");
  if (!modal) return;

  modal.addEventListener("show.bs.modal", ({ relatedTarget }) => {
    modal.dataset.integrationId = relatedTarget?.getAttribute("data-integration-id") || "";
  });
}

function initRuleForm(state) {
  const form = $("[data-rule-form]");
  if (!form) return;

  const message = $("[data-rule-message]", form);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearMessage(message);

    const submitButton = $('button[type="submit"]', form);
    const payload = {
      userId: state.user.id,
      keyword: $("#ruleKeyword").value.trim(),
      category: $("#ruleCategory").value,
      accountName: $("#ruleAccount").value,
      notify: $("#ruleNotify").checked,
    };

    toggleBusy(submitButton, true, "Сохраняем...");

    try {
      const createdRule = await apiRequest("/rules", { method: "POST", body: payload });
      state.rules = [createdRule, ...state.rules];
      renderRules(state.rules);
      form.reset();
      $("#ruleNotify").checked = true;
      showMessage(message, "Правило сохранено.", "success");
    } catch (error) {
      showMessage(message, error.message || "Не удалось сохранить правило.");
    } finally {
      toggleBusy(submitButton, false, "Сохранить правило");
    }
  });
}

function initImportActions(state) {
  const modal = document.getElementById("importModal");
  const submitButton = $("[data-import-submit]", modal);
  if (!modal || !submitButton) return;

  submitButton.addEventListener("click", async () => {
    const integrationId = Number(modal.dataset.integrationId || 0);
    const provider = $("[data-import-provider]", modal)?.textContent?.trim() || "Банк";
    const period = $("#importRange")?.value || "Последние 30 дней";
    const integration = state.integrations.find((item) => item.id === integrationId);

    toggleBusy(submitButton, true, "Импортируем...");

    try {
      const importedTransactions = buildImportedTransactions(state.user.id, provider, period);
      await Promise.all(importedTransactions.map((item) => apiRequest("/transactions", { method: "POST", body: item })));

      if (integration) {
        const patched = await apiRequest(`/integrations/${integration.id}`, {
          method: "PATCH",
          body: { lastSyncAt: new Date().toISOString(), status: "active" },
        });

        state.integrations = state.integrations.map((item) => item.id === patched.id ? patched : item);
        renderIntegrations(state.integrations);
      }

      if (window.bootstrap) {
        window.bootstrap.Modal.getOrCreateInstance(modal).hide();
      }
    } catch (error) {
      alert(error.message || "Импорт не удался.");
    } finally {
      toggleBusy(submitButton, false, "Начать импорт");
    }
  });
}

function renderIntegrations(integrations) {
  const container = $("[data-integrations-list]");
  if (!container) return;

  container.innerHTML = integrations
    .map((integration) => {
      const statusMap = {
        active: { label: "Активно", className: "positive" },
        warning: { label: "Требует проверки", className: "warning" },
        inactive: { label: "Неактивно", className: "" },
      };
      const status = statusMap[integration.status] || statusMap.inactive;

      return `
        <div class="col-md-6">
          <article class="integration-card">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h3>${escapeHtml(integration.provider)}</h3>
                <p class="text-secondary mb-0">${escapeHtml(formatLastSync(integration.lastSyncAt, integration.status))}</p>
              </div>
              <span class="status-pill ${status.className}">${status.label}</span>
            </div>
            <div class="d-flex gap-2 mt-4">
              <button
                class="btn btn-outline-dark btn-sm"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#importModal"
                data-provider="${escapeAttribute(integration.provider)}"
                data-integration-id="${integration.id}"
              >
                Импортировать
              </button>
              <button class="btn btn-light btn-sm" type="button">${integration.status === "warning" ? "Переподключить" : "Настройки"}</button>
            </div>
          </article>
        </div>
      `;
    })
    .join("");
}

function renderRules(rules) {
  const list = $("[data-rules-list]");
  if (!list) return;

  list.innerHTML = rules
    .map((rule) => `<li class="py-1">${escapeHtml(rule.keyword)} → ${escapeHtml(rule.category)}${rule.notify ? " • с уведомлением" : ""}</li>`)
    .join("");
}

function fillRuleAccounts(accounts) {
  const select = $("#ruleAccount");
  if (!select) return;

  select.innerHTML = [
    "<option>Все счета</option>",
    ...accounts.map((account) => `<option>${escapeHtml(account.name)}</option>`),
  ].join("");
}

function buildImportedTransactions(userId, provider, period) {
  const today = new Date();
  const firstDate = new Date(today);
  const secondDate = new Date(today);

  if (period.includes("90")) {
    firstDate.setDate(today.getDate() - 21);
    secondDate.setDate(today.getDate() - 8);
  } else if (period.includes("7")) {
    firstDate.setDate(today.getDate() - 4);
    secondDate.setDate(today.getDate() - 1);
  } else {
    firstDate.setDate(today.getDate() - 10);
    secondDate.setDate(today.getDate() - 3);
  }

  return [
    {
      userId,
      title: `${provider} import: супермаркет`,
      category: "Еда",
      amount: 1780,
      type: "expense",
      accountName: "Текущий счёт",
      provider,
      date: formatDate(firstDate),
    },
    {
      userId,
      title: `${provider} import: транспорт`,
      category: "Транспорт",
      amount: 540,
      type: "expense",
      accountName: "Текущий счёт",
      provider,
      date: formatDate(secondDate),
    },
  ];
}
