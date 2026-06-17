// Управление сайдбаром
const toggleBtn = document.getElementById('toggle-sidebar');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebar-overlay');
if (toggleBtn && sidebar) { toggleBtn.addEventListener('click', () => { sidebar.classList.toggle('show'); if(overlay) overlay.classList.toggle('show'); }); }
if (overlay) overlay.addEventListener('click', () => { sidebar.classList.remove('show'); overlay.classList.remove('show'); });

const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) logoutBtn.addEventListener('click', (e) => { e.preventDefault(); logout(); });

// ГЛОБАЛЬНЫЕ КЛИКИ
document.addEventListener('click', async function(e) {
    // Подтверждение удаления
    if (e.target && e.target.closest('#confirm-delete-btn')) {
        const id = itemToDelete.id;
        try {
            if (itemToDelete.type === 'transaction') {
                await apiFetch(`/transactions/${id}`, { method: 'DELETE' });
            } else if (itemToDelete.type === 'goal') {
                await apiFetch(`/goals/${id}`, { method: 'DELETE' });
            } else if (itemToDelete.type === 'category') {
                await apiFetch(`/categories/${id}`, { method: 'DELETE' });
            } else if (itemToDelete.type === 'bank') {
                await apiFetch(`/banks/${id}`, { method: 'DELETE' });
            }
            bootstrap.Modal.getOrCreateInstance(document.getElementById('deleteConfirmModal')).hide();
            await loadServerData(); 
            
            if (itemToDelete.type === 'category') {
                setTimeout(() => bootstrap.Modal.getOrCreateInstance(document.getElementById('manageCategoriesModal')).show(), 150);
            }
        } catch(err) { console.error(err); }
    }

    if (e.target && e.target.closest('#deleteConfirmModal .btn-secondary')) {
        if (itemToDelete && itemToDelete.type === 'category') {
            setTimeout(() => bootstrap.Modal.getOrCreateInstance(document.getElementById('manageCategoriesModal')).show(), 150);
        }
    }

    // Создание категории
    if (e.target && e.target.closest('#save-new-category-btn')) {
        const typeRadio = document.querySelector('input[name="trans-type"]:checked');
        const type = typeRadio ? typeRadio.value : 'expense';
        const newCatName = document.getElementById('new-category-name').value.trim();
        const errorDiv = document.getElementById('category-error');
        
        if (newCatName === '') { errorDiv.innerText = 'Введите название'; errorDiv.classList.remove('d-none'); return; }
        if (getCategoriesByType(type).includes(newCatName)) { errorDiv.innerText = 'Такая категория уже существует!'; errorDiv.classList.remove('d-none'); return; }

        try {
            await apiFetch('/categories', {
                method: 'POST',
                body: JSON.stringify({ name: newCatName, type, userId: currentUser.id })
            });
            document.getElementById('new-category-name').value = '';
            errorDiv.classList.add('d-none');
            await loadServerData();
            updateCategoryDropdown(newCatName); 
            if (document.getElementById('manageCategoriesModal').classList.contains('show')) renderManageCategories();
        } catch(err) { console.error(err); }
    }

    if (e.target && e.target.closest('#close-manage-cat-btn')) {
        bootstrap.Modal.getOrCreateInstance(document.getElementById('manageCategoriesModal')).hide();
        setTimeout(() => bootstrap.Modal.getOrCreateInstance(document.getElementById('transactionModal')).show(), 150);
    }

    // Редактирование категории
    if (e.target && e.target.closest('#save-edit-cat-btn')) {
        const id = categories.find(c => c.name === document.getElementById('edit-cat-oldname').value && c.type === document.getElementById('edit-cat-type').value).id;
        const type = document.getElementById('edit-cat-type').value;
        const newName = document.getElementById('edit-category-name').value.trim();
        const errorDiv = document.getElementById('edit-category-error');
        
        if (newName === '') { errorDiv.innerText = 'Введите название'; errorDiv.classList.remove('d-none'); return; }

        try {
            await apiFetch(`/categories/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ name: newName, type, userId: currentUser.id })
            });
            bootstrap.Modal.getOrCreateInstance(document.getElementById('editCategoryModal')).hide();
            await loadServerData();
            setTimeout(() => bootstrap.Modal.getOrCreateInstance(document.getElementById('manageCategoriesModal')).show(), 150);
        } catch(err){ console.error(err); }
    }

    if (e.target && e.target.closest('#cancel-edit-cat-btn')) {
        bootstrap.Modal.getOrCreateInstance(document.getElementById('editCategoryModal')).hide();
        setTimeout(() => bootstrap.Modal.getOrCreateInstance(document.getElementById('manageCategoriesModal')).show(), 150);
    }
});

// ГЛОБАЛЬНАЯ ОТПРАВКА ФОРМ
document.addEventListener('submit', async function(e) {
    if (e.target && e.target.id === 'transaction-form') {
        e.preventDefault();

        const typeRadio = document.querySelector('input[name="trans-type"]:checked');
        if (!typeRadio) return;
        
        const type = typeRadio.value;
        const amountInput = document.getElementById('trans-amount');
        if (!amountInput) return;
        
        const amount = parseFloat(amountInput.value);

        try {
            const id = document.getElementById('trans-id').value;
            const type = document.querySelector('input[name="trans-type"]:checked').value;
            const amount = parseFloat(document.getElementById('trans-amount').value);
            const categorySelect = document.getElementById('trans-category');
            
            let category = categorySelect.value;
            let desc = document.getElementById('trans-desc').value;

            if (type === 'savings') {
                const goalId = categorySelect.value;
                const targetGoal = goals.find(g => String(g.id) === String(goalId));
                if (targetGoal) {
                    category = targetGoal.name;
                    if (!desc) desc = 'Пополнение цели';
                    
                    if (!id) { 
                        targetGoal.currentAmount += amount;
                        await apiFetch(`/goals/${targetGoal.id}`, { method: 'PUT', body: JSON.stringify(targetGoal) });
                    }
                }
            } else {
                if (!desc) desc = category;
            }

            const date = document.getElementById('trans-date').value;
            const tData = { type, amount, category, date, desc, userId: currentUser.id };
            
            if (id) { 
                await apiFetch(`/transactions/${id}`, { method: 'PUT', body: JSON.stringify(tData) });
            } else { 
                await apiFetch(`/transactions`, { method: 'POST', body: JSON.stringify(tData) });
            }

            bootstrap.Modal.getOrCreateInstance(document.getElementById('transactionModal')).hide();
            await loadServerData(); 
        } catch (err) { console.error(err); }
    }
    
    if (e.target && e.target.id === 'goal-form') {
        e.preventDefault();
        const id = document.getElementById('goal-id').value;
        const name = document.getElementById('goal-name').value;
        const targetAmount = parseFloat(document.getElementById('goal-target').value);

        const existingGoal = goals.find(g => String(g.id) === String(id));
        const currentAmount = existingGoal ? existingGoal.currentAmount : 0;

        const gData = { name, targetAmount, currentAmount, userId: currentUser.id };
        try {
            if (id) { 
                await apiFetch(`/goals/${id}`, { method: 'PUT', body: JSON.stringify(gData) });
            } else { 
                await apiFetch(`/goals`, { method: 'POST', body: JSON.stringify(gData) });
            }
            bootstrap.Modal.getOrCreateInstance(document.getElementById('goalModal')).hide();
            await loadServerData();
        } catch(err) {console.error(err);}
    }

    if (e.target && e.target.id === 'add-funds-form') {
        e.preventDefault();
        const id = document.getElementById('funds-goal-id').value;
        const amount = parseFloat(document.getElementById('funds-amount').value);

        const targetGoal = goals.find(g => String(g.id) === String(id));
        if (targetGoal) {
            targetGoal.currentAmount += amount;
            try {
                await apiFetch(`/goals/${id}`, { method: 'PUT', body: JSON.stringify(targetGoal) });
                const newTrans = {
                    type: 'savings', amount: amount, category: targetGoal.name,
                    date: new Date().toISOString().split('T')[0], desc: 'Пополнение цели', userId: currentUser.id
                };
                await apiFetch('/transactions', { method: 'POST', body: JSON.stringify(newTrans) });
                
                bootstrap.Modal.getOrCreateInstance(document.getElementById('addFundsModal')).hide();
                await loadServerData();
            } catch(err) { console.error(err); }
        }
    }

    if (e.target && e.target.id === 'withdraw-funds-form') {
        e.preventDefault();
        const id = document.getElementById('withdraw-goal-id').value;
        const amount = parseFloat(document.getElementById('withdraw-amount').value);
        const errorDiv = document.getElementById('withdraw-error');

        const targetGoal = goals.find(g => String(g.id) === String(id));
        if (targetGoal) {
            if (amount > targetGoal.currentAmount) {
                errorDiv.classList.remove('d-none');
                return;
            }
            
            targetGoal.currentAmount -= amount;
            try {
                await apiFetch(`/goals/${id}`, { method: 'PUT', body: JSON.stringify(targetGoal) });
                const newTrans = {
                    type: 'income', amount: amount, category: 'Из копилки',
                    date: new Date().toISOString().split('T')[0], desc: targetGoal.name, userId: currentUser.id
                };
                await apiFetch('/transactions', { method: 'POST', body: JSON.stringify(newTrans) });
                
                bootstrap.Modal.getOrCreateInstance(document.getElementById('withdrawFundsModal')).hide();
                await loadServerData();
            } catch(err) { console.error(err); }
        }
    }

    if (e.target && e.target.id === 'rule-form') {
        e.preventDefault();
        console.log("Форма правил отправлена!");
        const keywordInput = e.target.querySelector('#rule-keyword');
        const categorySelect = e.target.querySelector('#rule-category');
        
        console.log("Поиск полей:", { keywordInput, categorySelect });

        if (!keywordInput || !categorySelect) {
            console.error("Ошибка: поля формы не найдены! Проверь id в integrations.html");
            return;
        }

        const keyword = keywordInput.value.trim();
        const category = categorySelect.value;
        
        console.log("Отправляю правило:", { keyword, category });

        try {
            await apiFetch('/rules', {
                method: 'POST',
                body: JSON.stringify({ 
                    keyword: keyword, 
                    category: category, 
                    userId: currentUser.id 
                })
            });
            console.log("Правило успешно сохранено!");
            e.target.reset(); 
            await loadServerData(); 
        } catch(err) { 
            console.error("Ошибка при сохранении правила:", err); 
        }
    }
});

// Подключение банка
window.connectBank = async function(bankId, bankName) {
    try {
        await apiFetch('/banks', {
            method: 'POST',
            body: JSON.stringify({ bankId: bankId, name: bankName, userId: currentUser.id })
        });
        await loadServerData();
    } catch(err) { console.error(err); }
}

// Отключение банка
window.disconnectBank = function(id) {
    itemToDelete = { id: id, type: 'bank' }; 
    document.getElementById('delete-modal-text').innerText = 'Отключить этот банк?';
    bootstrap.Modal.getOrCreateInstance(document.getElementById('deleteConfirmModal')).show();
}

// Удаление правила
window.deleteRule = async function(id) {
    try {
        await apiFetch(`/rules/${id}`, { method: 'DELETE' });
        await loadServerData();
    } catch(err) { console.error(err); }
}

// Импорт транзакций
window.openSyncModal = function() {
    if (banks.length === 0) {
        showToast('Сначала подключите хотя бы один банк!', 'error');
        return;
    }
    bootstrap.Modal.getOrCreateInstance(document.getElementById('syncModal')).show();
}

window.executeSync = async function() {
    bootstrap.Modal.getOrCreateInstance(document.getElementById('syncModal')).hide();

    const fakeBankData = [
        { desc: 'Яндекс.Еда', amount: 1200, type: 'expense' },
        { desc: 'Зарплата Т-Банк', amount: 55000, type: 'income' },
        { desc: 'Подписка Кинопоиск', amount: 299, type: 'expense' }
    ];

    let importedCount = 0;
    for (const item of fakeBankData) {
        let assignedCategory = item.type === 'income' ? 'Зарплата' : 'Разное';
        if (item.type === 'expense') {
            const matchedRule = rules.find(r => item.desc.toLowerCase().includes(r.keyword.toLowerCase()));
            if (matchedRule) assignedCategory = matchedRule.category;
        }

        const newTrans = {
            type: item.type, amount: item.amount, category: assignedCategory,
            date: new Date().toISOString().split('T')[0], desc: item.desc, userId: currentUser.id
        };

        await apiFetch('/transactions', { method: 'POST', body: JSON.stringify(newTrans) });
        importedCount++;
    }

    showToast(`Успешно импортировано транзакций: ${importedCount}.`);
    await loadServerData();
}

// Слушатели фильтров транзакций
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.trans-filter').forEach(input => { 
        if(typeof renderTransactions === 'function') input.addEventListener('input', renderTransactions); 
    });
});

// ЗАПУСК ПРИЛОЖЕНИЯ
if (checkAuth()) {
    if (document.getElementById('dashboard-cards') || 
        document.getElementById('transactions-table-body') || 
        document.getElementById('reportsChart') || 
        document.getElementById('goals-container') ||
        document.getElementById('banks-list')) {
        
        loadServerData();
    }
}

// Функция для вызова уведомления
window.showToast = function(message, type = 'success') {
    const toastEl = document.getElementById('liveToast');

    if (!toastEl) {
        console.error("Ошибка! Toast не найден. modal.html не загрузился или не подключен.");
        alert(message);
        return;
    }
    
    const toastBody = document.getElementById('toast-message');
    const toastHeader = toastEl.querySelector('.toast-header');
    
    toastHeader.className = `toast-header text-white ${type === 'error' ? 'bg-danger' : 'bg-success'}`;
    toastBody.innerText = message;
    
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}

// Закрытие модалки категорий
document.getElementById('manageCategoriesModal').addEventListener('hidden.bs.modal', async () => {
    await loadServerData();
    if (document.getElementById('rules-list')) {
        renderRules();
    }
});