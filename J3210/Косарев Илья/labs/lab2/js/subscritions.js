const subscriptionsList = document.getElementById('subscriptionsList');
const subscriptionsCount = document.getElementById('subscriptionsCount');
const searchInput = document.getElementById('subscriptionsSearchInput');
const emptyState = document.getElementById('subscriptionsEmptyState');
const emptyText = document.getElementById('subscriptionsEmptyText');

const state = { user: null, items: [] };

const getName = (u) => `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.username || 'Пользователь';
const getTag = (u) => `@${u.username || ''}`;

function render() {
    const q = (searchInput.value || '').toLowerCase();
    const filtered = state.items.filter((u) => getName(u).toLowerCase().includes(q) || getTag(u).toLowerCase().includes(q));
    const total = state.items.length;

    if (total === 0) {
        subscriptionsCount.textContent = 'У вас нет подписок';
    } else if (filtered.length === total) {
        subscriptionsCount.textContent = `Вы подписаны на ${total} аккаунтов`;
    } else {
        subscriptionsCount.textContent = `Показано ${filtered.length} из ${total} подписок`;
    }

    if (filtered.length === 0) {
        subscriptionsList.innerHTML = '';
        subscriptionsList.classList.add('d-none');
        emptyState.classList.remove('d-none');
        emptyText.textContent = total === 0 ? 'У вас пока нет подписок.' : 'По вашему запросу ничего не найдено.';
        return;
    }

    emptyState.classList.add('d-none');
    subscriptionsList.classList.remove('d-none');
    subscriptionsList.innerHTML = filtered.map((u) => `
        <li class="list-group-item d-flex flex-column flex-lg-row justify-content-between align-items-lg-center">
            <div class="d-flex align-items-center gap-2 mb-3 mb-md-0">
                <img src="https://placekittens.com/60/60" class="rounded-circle" width="60" height="60" alt="Аватар">
                <div>
                    <div class="d-flex align-items-center gap-3">
                        <h5 class="mb-0 fw-bold">${getName(u)}</h5>
                        <span class="badge bg-secondary">Пользователь</span>
                    </div>
                    <div class="text-muted small">${getTag(u)}</div>
                </div>
            </div>
            <div class="d-flex align-items-center justify-content-between justify-content-lg-end gap-3">
                <div class="d-flex gap-3 text-center">
                    <div><div class="fw-bold">${(u.modelIds || []).length}</div><div class="text-muted">Моделей</div></div>
                    <div class="vr"></div>
                    <div><div class="fw-bold">${(u.datasetIds || []).length}</div><div class="text-muted">Датасетов</div></div>
                </div>
                <button class="btn btn-outline-danger btn-sm rounded-pill px-3 flex-shrink-0 unsubscribe-btn" data-id="${u.id}">
                    <i class="bi bi-person-x-fill me-1"></i> Отписаться
                </button>
            </div>
        </li>
    `).join('');
}

async function unsubscribe(targetId) {
    const nextSubscriptions = (state.user.subscriptions || []).filter((id) => Number(id) !== Number(targetId));
    const patchResponse = await api.patch(`/users/${state.user.id}`, { subscriptions: nextSubscriptions });
    state.user = patchResponse.data;
    state.items = state.items.filter((u) => Number(u.id) !== Number(targetId));

    const token = window.authSession.getStoredToken();
    if (token) {
        window.authSession.saveAuthSession(token, state.user);
    }

    render();
}

async function loadData() {
    const storedUser = window.authSession.getStoredUser();
    const userResponse = await api.get(`/users/${storedUser.id}`);
    state.user = userResponse.data;

    const ids = state.user.subscriptions || [];
    if (ids.length === 0) {
        state.items = [];
        render();
        return;
    }

    const params = new URLSearchParams();
    ids.forEach((id) => params.append('id', String(id)));

    const usersResponse = await api.get('/users', { params });
    const users = usersResponse.data;
    const usersById = new Map(users.map((u) => [Number(u.id), u]));
    state.items = ids.map((id) => usersById.get(Number(id))).filter(Boolean);

    render();
}

searchInput.addEventListener('input', render);

subscriptionsList.addEventListener('click', async (e) => {
    const btn = e.target.closest('.unsubscribe-btn');
    if (!btn) return;
    await unsubscribe(btn.dataset.id);
});

window.addEventListener('DOMContentLoaded', loadData);