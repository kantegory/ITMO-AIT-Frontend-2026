<template>
  <div>
    <div v-if="activeModal" class="modal-backdrop fade show"></div>

    <!-- Модалка Транзакции -->
    <div v-if="activeModal === 'transaction'" class="modal fade show d-block" tabindex="-1" role="dialog" aria-labelledby="modal-transaction-title" aria-modal="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header bg-light border-0">
            <h2 class="modal-title fw-bold h5" id="modal-transaction-title">
                {{ modalPayload ? 'Редактировать транзакцию' : 'Добавить транзакцию' }}
            </h2>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Закрыть окно"></button>
          </div>
          <div class="modal-body p-4">
            <form @submit.prevent="submitTransaction">
              
              <!-- Семантическая группировка радиокнопок -->
              <fieldset class="mb-4 border-0 p-0 m-0">
                <legend class="form-label text-muted small pt-0 mb-2">Тип операции</legend>
                <div class="d-flex gap-3">
                  <div class="form-check">
                    <input class="form-check-input" type="radio" value="expense" id="type-expense" v-model="transForm.type">
                    <label class="form-check-label text-danger" for="type-expense">Расход</label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="radio" value="income" id="type-income" v-model="transForm.type">
                    <label class="form-check-label text-success" for="type-income">Доход</label>
                  </div>
                  <div class="form-check" v-if="goals.length > 0">
                    <input class="form-check-input" type="radio" value="savings" id="type-savings" v-model="transForm.type">
                    <label class="form-check-label text-primary" for="type-savings">В копилку</label>
                  </div>
                </div>
              </fieldset>

              <div class="mb-3">
                <label for="trans-amount" class="form-label text-muted small">Сумма (₽)</label>
                <input type="number" id="trans-amount" class="form-control" v-model.number="transForm.amount" required aria-required="true">
              </div>

              <div class="mb-3">
                <label for="trans-category" class="form-label text-muted small">
                    {{ transForm.type === 'savings' ? 'Выберите копилку' : 'Категория' }}
                </label>
                <div class="d-flex gap-2">
                  <select class="form-select" id="trans-category" v-model="transForm.category" required aria-required="true">
                      <template v-if="transForm.type === 'savings'">
                          <option v-for="g in goals" :key="g.id" :value="g.id">{{ g.name }}</option>
                      </template>
                      <template v-else>
                          <option v-for="c in currentCategories" :key="c" :value="c">{{ c }}</option>
                      </template>
                  </select>
                  
                  <button v-if="transForm.type !== 'savings'" type="button" class="btn btn-outline-secondary" @click="openModal('categories')" aria-label="Управление категориями">
                    <svg class="bi" aria-hidden="true"><use href="/assets/sprite.svg#bi-gear"></use></svg>
                  </button>
                </div>
              </div>

              <div class="row g-3 mb-4">
                <div class="col-6">
                  <label for="trans-date" class="form-label text-muted small">Дата</label>
                  <input type="date" id="trans-date" class="form-control" v-model="transForm.date" required aria-required="true">
                </div>
                <div class="col-6">
                  <label for="trans-desc" class="form-label text-muted small">Описание</label>
                  <input type="text" id="trans-desc" class="form-control" v-model="transForm.desc" placeholder="Кратко">
                </div>
              </div>

              <button type="submit" class="btn btn-primary w-100 py-2">Сохранить</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Модалка Удаления -->
    <div v-if="activeModal === 'delete'" class="modal fade show d-block" tabindex="-1" role="alertdialog" aria-labelledby="modal-delete-title" aria-modal="true">
      <div class="modal-dialog modal-sm modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-body p-4 text-center">
            <svg class="bi text-danger" style="font-size: 3rem;" aria-hidden="true"><use href="/assets/sprite.svg#bi-exclamation-circle"></use></svg>
            <h2 id="modal-delete-title" class="h5 mt-3">Вы уверены?</h2>
            <p class="text-muted">Это действие нельзя отменить.</p>
            <div class="d-flex gap-2 justify-content-center mt-3">
              <button class="btn btn-secondary w-50" @click="closeModal">Отмена</button>
              <button class="btn btn-danger w-50" @click="confirmDelete">Удалить</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Модалка Управления категориями -->
    <div v-if="activeModal === 'categories'" class="modal fade show d-block" tabindex="-1" role="dialog" aria-labelledby="modal-cat-title" aria-modal="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header bg-light">
            <h2 class="modal-title h6" id="modal-cat-title">Категории ({{ transForm.type === 'expense' ? 'Расходы' : 'Доходы' }})</h2>
            <button type="button" class="btn-close" @click="backToTransaction" aria-label="Вернуться к транзакции"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addCategory" class="input-group mb-3">
              <label for="new-cat-name" class="visually-hidden">Название новой категории</label>
              <input type="text" id="new-cat-name" class="form-control" v-model="newCatName" placeholder="Новая категория" required aria-required="true">
              <button type="submit" class="btn btn-success">Добавить</button>
            </form>
            <ul class="list-group" aria-label="Список категорий">
              <li v-for="c in currentCategoriesList" :key="c.id" class="list-group-item d-flex justify-content-between align-items-center">
                {{ c.name }}
                <div>
                    <button class="btn btn-sm btn-outline-primary py-0 px-2 me-1" @click="editCategoryPrompt(c)" aria-label="Редактировать">
                        <svg class="bi" aria-hidden="true"><use href="/assets/sprite.svg#bi-pencil"></use></svg>
                    </button>
                    <button class="btn btn-sm btn-outline-danger py-0 px-2" @click="removeCategory(c.id)" aria-label="Удалить">
                        <svg class="bi" aria-hidden="true"><use href="/assets/sprite.svg#bi-trash"></use></svg>
                    </button>
                </div>
              </li>
            </ul>
          </div>
          <div class="modal-footer border-0 pt-0">
              <button class="btn btn-secondary w-100" @click="backToTransaction">Назад к транзакции</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Модалка Цели -->
    <div v-if="activeModal === 'goal'" class="modal fade show d-block" tabindex="-1" role="dialog" aria-labelledby="modal-goal-title" aria-modal="true">
      <div class="modal-dialog">
        <div class="modal-content border-0 shadow">
          <div class="modal-header bg-light">
              <h2 class="modal-title h5" id="modal-goal-title">{{ modalPayload ? 'Редактировать цель' : 'Новая цель' }}</h2>
              <button class="btn-close" @click="closeModal" aria-label="Закрыть окно"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveGoal">
                <div class="mb-3">
                    <label for="goal-name" class="form-label">Название цели</label>
                    <input type="text" id="goal-name" class="form-control" v-model="goalForm.name" required aria-required="true">
                </div>
                <div class="mb-3">
                    <label for="goal-target" class="form-label">Необходимая сумма (₽)</label>
                    <input type="number" id="goal-target" class="form-control" v-model.number="goalForm.targetAmount" required aria-required="true">
                </div>
                <div class="text-end">
                    <button type="button" class="btn btn-secondary" @click="closeModal">Отмена</button>
                    <button type="submit" class="btn btn-primary">Сохранить</button>
                </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Модалка Пополнения -->
    <div v-if="activeModal === 'addFunds'" class="modal fade show d-block" tabindex="-1" role="dialog" aria-labelledby="modal-addfunds-title" aria-modal="true">
      <div class="modal-dialog modal-sm modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header bg-light">
              <h2 class="modal-title h6" id="modal-addfunds-title">Пополнить: {{ modalPayload?.name }}</h2>
              <button class="btn-close" @click="closeModal" aria-label="Закрыть окно"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addFunds">
                <label for="funds-add-amount" class="form-label text-muted small">Сумма пополнения (₽)</label>
                <input type="number" id="funds-add-amount" class="form-control mb-3" v-model.number="fundsAmount" required aria-required="true">
                <button type="submit" class="btn btn-success w-100">Пополнить</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Модалка Снятия -->
    <div v-if="activeModal === 'withdrawFunds'" class="modal fade show d-block" tabindex="-1" role="dialog" aria-labelledby="modal-withdraw-title" aria-modal="true">
      <div class="modal-dialog modal-sm modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header bg-light">
              <h2 class="modal-title h6" id="modal-withdraw-title">Снять из: {{ modalPayload?.name }}</h2>
              <button class="btn-close" @click="closeModal" aria-label="Закрыть окно"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="withdrawFunds">
                <label for="funds-withdraw-amount" class="form-label text-muted small">Сумма снятия (₽)</label>
                <input type="number" id="funds-withdraw-amount" class="form-control mb-3" v-model.number="fundsAmount" required aria-required="true">
                <button type="submit" class="btn btn-warning w-100">Снять</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Модалка Синхронизации -->
    <div v-if="activeModal === 'sync'" class="modal fade show d-block" tabindex="-1" role="dialog" aria-labelledby="modal-sync-title" aria-modal="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-body text-center p-4">
            <svg class="bi text-success" style="font-size: 3rem;" aria-hidden="true"><use href="/assets/sprite.svg#bi-arrow-repeat"></use></svg>
            <h2 id="modal-sync-title" class="h5 mt-3">Загрузить транзакции?</h2>
            <p class="text-muted">Это добавит новые записи из подключенного банка.</p>
            <div class="d-flex gap-2 justify-content-center mt-3">
                <button class="btn btn-secondary w-50" @click="closeModal">Отмена</button>
                <button class="btn btn-success w-50" @click="executeSync">Начать</button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useModals } from '../composables/useModals';
import { useFinanceData } from '../composables/useFinanceData';
import { useAuth } from '../composables/useAuth';
import { apiFetch } from '../services/api';

const { activeModal, modalPayload, closeModal, openModal } = useModals();
const { transactions, categories, goals, loadData, rules } = useFinanceData();
const { user } = useAuth();

const backToTransaction = () => openModal('transaction', modalPayload.value);

// --- Удаление ---
const confirmDelete = async () => {
    if (!modalPayload.value) return;
    const { id, type } = modalPayload.value;
    
    if (type === 'transaction') {
        const transaction = transactions.value.find(t => String(t.id) === String(id));
        if (transaction) {
            if (transaction.type === 'savings') {
                const goal = goals.value.find(g => g.name === transaction.category);
                if (goal) {
                    goal.currentAmount -= transaction.amount;
                    await apiFetch(`/goals/${goal.id}`, { method: 'PUT', body: JSON.stringify(goal) });
                }
            } else if (transaction.type === 'income' && transaction.category === 'Из копилки') {
                const goal = goals.value.find(g => g.name === transaction.desc);
                if (goal) {
                    goal.currentAmount += transaction.amount;
                    await apiFetch(`/goals/${goal.id}`, { method: 'PUT', body: JSON.stringify(goal) });
                }
            }
        }
    }

    const endpoint = type === 'category' ? 'categories' : (type + 's');
    try {
        await apiFetch(`/${endpoint}/${id}`, { method: 'DELETE' });
        await loadData();
        closeModal();
    } catch (err) { console.error(err); }
};

// --- Цели ---
const goalForm = ref({ id: null, name: '', targetAmount: 0, currentAmount: 0 });
watch(activeModal, (val) => {
    if (val === 'goal' && modalPayload.value) {
        goalForm.value = { ...modalPayload.value };
    } else if (val === 'goal') {
        goalForm.value = { id: null, name: '', targetAmount: 0, currentAmount: 0 };
    }
});

const saveGoal = async () => {
    const url = goalForm.value.id ? `/goals/${goalForm.value.id}` : '/goals';
    const method = goalForm.value.id ? 'PUT' : 'POST';
    const body = { ...goalForm.value, userId: user.value.id };
    
    await apiFetch(url, { method, body: JSON.stringify(body) });
    await loadData();
    closeModal();
};

const fundsAmount = ref('');
watch(activeModal, (val) => {
    if (val === 'addFunds' || val === 'withdrawFunds') fundsAmount.value = '';
});

const addFunds = async () => {
    const goal = modalPayload.value;
    goal.currentAmount += fundsAmount.value;
    
    await apiFetch(`/goals/${goal.id}`, { method: 'PUT', body: JSON.stringify(goal) });
    await apiFetch('/transactions', { method: 'POST', body: JSON.stringify({
        type: 'savings', amount: fundsAmount.value, category: goal.name,
        date: new Date().toISOString().split('T')[0], desc: 'Пополнение цели', userId: user.value.id
    })});
    
    await loadData();
    closeModal();
};

const withdrawFunds = async () => {
    const goal = modalPayload.value;
    if (fundsAmount.value > goal.currentAmount) return alert('Недостаточно средств!');
    
    goal.currentAmount -= fundsAmount.value;
    await apiFetch(`/goals/${goal.id}`, { method: 'PUT', body: JSON.stringify(goal) });
    await apiFetch('/transactions', { method: 'POST', body: JSON.stringify({
        type: 'income', amount: fundsAmount.value, category: 'Из копилки',
        date: new Date().toISOString().split('T')[0], desc: goal.name, userId: user.value.id
    })});
    
    await loadData();
    closeModal();
};

// --- Категории ---
const currentCategoriesList = computed(() => categories.value.filter(c => c.type === transForm.value.type));
const newCatName = ref('');

const addCategory = async () => {
    if (!newCatName.value) return;
    await apiFetch('/categories', {
        method: 'POST',
        body: JSON.stringify({ name: newCatName.value, type: transForm.value.type, userId: user.value.id })
    });
    newCatName.value = '';
    await loadData();
};
const removeCategory = async (id) => {
    await apiFetch(`/categories/${id}`, { method: 'DELETE' });
    await loadData();
};
const editCategoryPrompt = async (cat) => {
    const newName = prompt("Введите новое имя:", cat.name);
    if (newName && newName.trim()) {
        await apiFetch(`/categories/${cat.id}`, {
            method: 'PUT',
            body: JSON.stringify({ ...cat, name: newName.trim() })
        });
        await loadData();
    }
};

// --- Транзакции ---
const transForm = ref({
    id: null,
    type: 'expense',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    desc: ''
});

const currentCategories = computed(() => {
    return categories.value.filter(c => c.type === transForm.value.type).map(c => c.name);
});

watch(activeModal, (newVal, oldVal) => {
    if (newVal === 'transaction' && oldVal !== 'categories') {
        if (modalPayload.value) { 
            const t = modalPayload.value;
            transForm.value = {
                id: t.id, type: t.type, amount: t.amount,
                category: t.type === 'savings' ? goals.value.find(g => g.name === t.category)?.id : t.category,
                date: t.date, desc: t.desc
            };
        } else { 
            transForm.value = {
                id: null, type: 'expense', amount: '',
                category: currentCategories.value[0] || '',
                date: new Date().toISOString().split('T')[0], desc: ''
            };
        }
    }
});

const submitTransaction = async () => {
    let finalCategory = transForm.value.category;
    let finalDesc = transForm.value.desc;

    if (transForm.value.type === 'savings') {
        const targetGoal = goals.value.find(g => String(g.id) === String(transForm.value.category));
        if (targetGoal) {
            finalCategory = targetGoal.name;
            if (!finalDesc) finalDesc = 'Пополнение цели';
            if (!transForm.value.id) {
                targetGoal.currentAmount += transForm.value.amount;
                await apiFetch(`/goals/${targetGoal.id}`, { method: 'PUT', body: JSON.stringify(targetGoal) });
            }
        }
    } else {
        if (!finalDesc) finalDesc = finalCategory;
    }

    const tData = { 
        type: transForm.value.type, amount: transForm.value.amount, 
        category: finalCategory, date: transForm.value.date, desc: finalDesc, userId: user.value.id 
    };

    try {
        if (transForm.value.id) {
            await apiFetch(`/transactions/${transForm.value.id}`, { method: 'PUT', body: JSON.stringify(tData) });
        } else {
            await apiFetch(`/transactions`, { method: 'POST', body: JSON.stringify(tData) });
        }
        await loadData();
        closeModal();
    } catch (err) { console.error(err); }
};

// --- Синхронизация банков ---
const executeSync = async () => {
    const fakeBankData = [
        { desc: 'Яндекс.Еда', amount: 1200, type: 'expense' },
        { desc: 'Зарплата Т-Банк', amount: 55000, type: 'income' },
        { desc: 'Подписка Кинопоиск', amount: 299, type: 'expense' }
    ];

    for (const item of fakeBankData) {
        let assignedCategory = item.type === 'income' ? 'Зарплата' : 'Разное';
        if (item.type === 'expense') {
            const matchedRule = rules.value.find(r => item.desc.toLowerCase().includes(r.keyword.toLowerCase()));
            if (matchedRule) assignedCategory = matchedRule.category;
        }

        await apiFetch('/transactions', { method: 'POST', body: JSON.stringify({
            type: item.type, amount: item.amount, category: assignedCategory,
            date: new Date().toISOString().split('T')[0], desc: item.desc, userId: user.value.id
        })});
    }

    await loadData();
    closeModal();
};
</script>