window.updateCategoryDropdown = function(selectedVal = null) {
    const typeRadio = document.querySelector('input[name="trans-type"]:checked');
    if (!typeRadio) return;
    const type = typeRadio.value;
    const select = document.getElementById('trans-category');
    const addBtn = select.nextElementSibling;
    if (!select) return;
    select.innerHTML = '';
    
    if (type === 'savings') {
        addBtn.style.display = 'none';
        goals.forEach(g => {
            const opt = document.createElement('option');
            opt.value = g.id; 
            opt.textContent = g.name; 
            select.appendChild(opt);
        });
        if (selectedVal) select.value = selectedVal;
    } else {
        addBtn.style.display = 'block';
        const cats = getCategoriesByType(type);
        cats.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat; 
            opt.textContent = cat; 
            select.appendChild(opt);
        });
        if (selectedVal && cats.includes(selectedVal)) select.value = selectedVal;
    }
}

window.openTransactionModal = function() {
    let myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('transactionModal'));
    document.getElementById('transaction-form').reset();
    document.getElementById('trans-id').value = '';
    document.getElementById('trans-date').valueAsDate = new Date();
    document.getElementById('modal-title').innerText = 'Добавить транзакцию';
    updateCategoryDropdown(); myModal.show();
}

window.editTransaction = function(id) {
    let myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('transactionModal'));
    const t = transactions.find(t => String(t.id) === String(id));
    if(t) {
        document.getElementById('trans-id').value = t.id; 
        document.getElementById(`type-${t.type}`).checked = true; 
        updateCategoryDropdown(); 
        document.getElementById('trans-amount').value = t.amount; 
        document.getElementById('trans-category').value = t.type === 'savings' ? goals.find(g=>g.name === t.category)?.id : t.category;
        document.getElementById('trans-date').value = t.date; 
        document.getElementById('trans-desc').value = t.desc;
        document.getElementById('modal-title').innerText = 'Редактировать транзакцию'; myModal.show();
    }
}

window.deleteTransaction = function(id) {
    itemToDelete = { id: id, type: 'transaction' }; 
    document.getElementById('delete-modal-text').innerText = 'Удалить эту транзакцию?';
    bootstrap.Modal.getOrCreateInstance(document.getElementById('deleteConfirmModal')).show();
}

window.openManageCategoriesModal = function() {
    const transModal = document.getElementById('transactionModal');
    if (transModal && bootstrap.Modal.getInstance(transModal)) {
        bootstrap.Modal.getInstance(transModal).hide();
    }

    const typeRadio = document.querySelector('input[name="trans-type"]:checked');
    const type = typeRadio ? typeRadio.value : 'expense'; 
    
    document.getElementById('new-category-name').value = ''; 
    document.getElementById('category-error').classList.add('d-none');

    renderManageCategories(type);
    bootstrap.Modal.getOrCreateInstance(document.getElementById('manageCategoriesModal')).show();
}

window.renderManageCategories = function(type) {
    const list = document.getElementById('categories-list');
    list.innerHTML = '';

    categories.filter(c => c.type === type).forEach(cat => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center py-1 px-2';
        li.innerHTML = `
            <span>${cat.name}</span>
            <div>
                <button class="btn btn-sm btn-light text-primary py-0 px-2" onclick="editCategory('${cat.id}')"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-sm btn-light text-danger py-0 px-2" onclick="deleteCategory('${cat.id}')"><i class="bi bi-trash"></i></button>
            </div>
        `;
        list.appendChild(li);
    });
}

window.editCategory = function(id) {
    const cat = categories.find(c => String(c.id) === String(id));
    if(!cat) return;
    document.getElementById('edit-cat-type').value = cat.type;
    document.getElementById('edit-cat-oldname').value = cat.name; 
    document.getElementById('edit-category-name').value = cat.name;
    document.getElementById('edit-category-error').classList.add('d-none');
    
    bootstrap.Modal.getOrCreateInstance(document.getElementById('manageCategoriesModal')).hide();
    bootstrap.Modal.getOrCreateInstance(document.getElementById('editCategoryModal')).show();
}

window.deleteCategory = function(id) {
    bootstrap.Modal.getOrCreateInstance(document.getElementById('manageCategoriesModal')).hide();
    const cat = categories.find(c => String(c.id) === String(id));
    itemToDelete = { id: id, type: 'category' }; 
    document.getElementById('delete-modal-text').innerText = `Удалить "${cat.name}"? Транзакции сохранятся.`;
    setTimeout(() => bootstrap.Modal.getOrCreateInstance(document.getElementById('deleteConfirmModal')).show(), 150);
}

window.openWithdrawFundsModal = function(id) {
    document.getElementById('withdraw-funds-form').reset();
    document.getElementById('withdraw-goal-id').value = id;
    document.getElementById('withdraw-error').classList.add('d-none');
    bootstrap.Modal.getOrCreateInstance(document.getElementById('withdrawFundsModal')).show();
}

window.openGoalModal = function(id = null) {
    let myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('goalModal'));
    document.getElementById('goal-form').reset();
    document.getElementById('goal-id').value = '';
    document.getElementById('goal-modal-title').innerText = 'Добавить цель';
    
    if (id) {
        const g = goals.find(g => String(g.id) === String(id));
        if (g) {
            document.getElementById('goal-id').value = g.id;
            document.getElementById('goal-name').value = g.name;
            document.getElementById('goal-target').value = g.targetAmount;
            document.getElementById('goal-modal-title').innerText = 'Редактировать цель';
        }
    }
    myModal.show();
}

window.editGoal = function(id) { openGoalModal(id); }
window.deleteGoal = function(id) {
    itemToDelete = { id: id, type: 'goal' }; 
    document.getElementById('delete-modal-text').innerText = 'Удалить эту цель?';
    bootstrap.Modal.getOrCreateInstance(document.getElementById('deleteConfirmModal')).show();
}
window.openAddFundsModal = function(id) {
    document.getElementById('add-funds-form').reset();
    document.getElementById('funds-goal-id').value = id;
    bootstrap.Modal.getOrCreateInstance(document.getElementById('addFundsModal')).show();
}