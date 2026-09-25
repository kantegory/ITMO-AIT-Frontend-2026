<template>
  <AppLayout>
    <template #header="{ toggleSidebar }">
        <div class="d-flex align-items-center mb-4">
            <button class="btn btn-light d-lg-none me-2" @click="toggleSidebar" aria-expanded="false" aria-controls="sidebar" aria-label="Открыть меню">
                <svg class="bi" aria-hidden="true"><use href="/assets/sprite.svg#bi-list"></use></svg>
            </button>
            <h1 class="m-0 h2">Интеграция аккаунтов</h1>
        </div>
    </template>

    <div v-if="!isDataLoaded" class="text-center my-5">
      <div class="spinner-border text-primary" role="status"></div>
      <div class="mt-2 text-muted" aria-live="polite">Загрузка данных...</div>
    </div>

    <div v-else class="row g-4">
        <!-- Блок банков -->
        <div class="col-12 col-lg-6">
            <section class="card border-0 shadow-sm p-4 h-100" aria-labelledby="banks-heading">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h2 id="banks-heading" class="m-0 h5">Подключенные банки</h2>
                    <button type="button" class="btn btn-sm btn-success" @click="openSyncModal">
                        <svg class="bi me-1" aria-hidden="true"><use href="/assets/sprite.svg#bi-arrow-repeat"></use></svg> Синхронизировать
                    </button>
                </div>
                <p class="text-muted small">Подключите банк для автоматического импорта транзакций</p>
                
                <ul class="list-group list-group-flush" aria-label="Список доступных банков">
                    <li v-for="bank in availableBanks" :key="bank.id" class="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-3">
                        <div class="d-flex align-items-center">
                            <svg class="bi fs-3 me-3" :class="bank.colorClass" aria-hidden="true" >
                                <use :href="bank.icon"></use>
                            </svg> 
                            <span class="fs-5">{{ bank.name }}</span>
                        </div>
                        
                        <button v-if="getConnectedBank(bank.id)" class="btn btn-outline-danger btn-sm px-3" @click="disconnectBank(getConnectedBank(bank.id).id)">
                            Отключить
                        </button>
                        <button v-else class="btn btn-primary btn-sm px-3" @click="connectBank(bank)">
                            Подключить
                        </button>
                    </li>
                </ul>
            </section>
        </div>

        <!-- Блок правил -->
        <div class="col-12 col-lg-6">
            <section class="card border-0 shadow-sm p-4 h-100" aria-labelledby="rules-heading" style="background-color: var(--bg-main);">
                <h2 id="rules-heading" class="mb-3 h5">Настройка правил импорта</h2>
                
                <ul class="list-group mb-4" aria-label="Текущие правила автораспределения" v-if="rules.length > 0">
                    <li v-for="rule in rules" :key="rule.id" class="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-2" style="background-color: transparent;">
                        <div>
                            <strong>Если:</strong> "{{ rule.keyword }}" 
                            <svg class="bi text-muted mx-2" aria-hidden="true"><use href="/assets/sprite.svg#bi-arrow-right"></use></svg> 
                            <strong>Категория:</strong> <span class="badge bg-secondary">{{ rule.category }}</span>
                        </div>
                        <button class="btn btn-sm btn-outline-danger py-0 px-2" @click="deleteRule(rule.id)" :aria-label="'Удалить правило для слова ' + rule.keyword">
                            <svg class="bi" aria-hidden="true"><use href="/assets/sprite.svg#bi-trash"></use></svg>
                        </button>
                    </li>
                </ul>
                <ul class="list-group mb-4" v-else>
                    <li class="list-group-item text-muted border-0 px-0" style="background-color: transparent;">У вас пока нет правил импорта.</li>
                </ul>

                <form @submit.prevent="addRule" aria-label="Форма добавления правила">
                    <div class="mb-3">
                        <label for="rule-keyword" class="form-label small text-muted">Если описание содержит (слово):</label>
                        <input type="text" class="form-control" id="rule-keyword" v-model="newRule.keyword" placeholder="Например: Яндекс.Еда" required aria-required="true">
                    </div>
                    <div class="mb-3">
                        <label for="rule-category" class="form-label small text-muted">Назначить категорию расхода:</label>
                        <select class="form-select" id="rule-category" v-model="newRule.category" :disabled="expenseCategories.length === 0" required aria-required="true">
                            <option v-if="expenseCategories.length === 0" value="">Сначала создайте категорию расходов</option>
                            <option v-for="cat in expenseCategories" :key="cat" :value="cat">{{ cat }}</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary w-100" :disabled="expenseCategories.length === 0">
                        <svg class="bi me-2" aria-hidden="true"><use href="/assets/sprite.svg#bi-plus-lg"></use></svg> Добавить правило
                    </button>
                </form>
            </section>
        </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import AppLayout from '../components/AppLayout.vue';
import { useFinanceData } from '../composables/useFinanceData';
import { useAuth } from '../composables/useAuth';
import { useModals } from '../composables/useModals';
import { apiFetch } from '../services/api';

const { banks, rules, categories, isDataLoaded, loadData } = useFinanceData();
const { user } = useAuth();
const { openModal } = useModals();

const availableBanks = [
    { id: 'sber', name: 'Сбербанк', icon: '/assets/sprite.svg#bi-bank', colorClass: 'text-success' },
    { id: 'tbank', name: 'Т-Банк', icon: '/assets/sprite.svg#bi-wallet2', colorClass: 'text-warning' },
    { id: 'alfa', name: 'Альфа-Банк', icon: '/assets/sprite.svg#bi-credit-card', colorClass: 'text-danger' }
];

const newRule = ref({ keyword: '', category: '' });

onMounted(() => {
    if (!isDataLoaded.value) loadData();
});

const expenseCategories = computed(() => {
    return categories.value.filter(c => c.type === 'expense').map(c => c.name);
});

const getConnectedBank = (bankId) => {
    return banks.value.find(b => b.bankId === bankId);
};

const connectBank = async (bank) => {
    try {
        await apiFetch('/banks', {
            method: 'POST',
            body: JSON.stringify({ bankId: bank.id, name: bank.name, userId: user.value.id })
        });
        await loadData();
    } catch (err) { console.error(err); }
};

const disconnectBank = (id) => {
    openModal('delete', { id, type: 'bank' });
};

const addRule = async () => {
    try {
        await apiFetch('/rules', {
            method: 'POST',
            body: JSON.stringify({ 
                keyword: newRule.value.keyword.trim(), 
                category: newRule.value.category, 
                userId: user.value.id 
            })
        });
        newRule.value = { keyword: '', category: '' };
        await loadData();
    } catch (err) { console.error(err); }
};

const deleteRule = async (id) => {
    try {
        await apiFetch(`/rules/${id}`, { method: 'DELETE' });
        await loadData();
    } catch (err) { console.error(err); }
};

const openSyncModal = () => {
    if (banks.value.length === 0) {
        alert('Сначала подключите хотя бы один банк!');
        return;
    }
    openModal('sync');
};
</script>