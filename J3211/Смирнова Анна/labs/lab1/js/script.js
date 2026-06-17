const toggleBtn = document.getElementById('toggle-sidebar');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebar-overlay');

if (toggleBtn && sidebar) { 
    toggleBtn.addEventListener('click', () => { 
        sidebar.classList.toggle('show'); 
        if(overlay) overlay.classList.toggle('show'); 
    }); 
}

if (overlay) {
    overlay.addEventListener('click', () => { 
        sidebar.classList.remove('show'); 
        overlay.classList.remove('show'); 
    });
}

function showModal(id) {
    const el = document.getElementById(id);
    if (el) bootstrap.Modal.getOrCreateInstance(el).show();
}

window.openTransactionModal = function() {
    showModal('transactionModal');
}

window.deleteTransaction = function() {
    showModal('deleteConfirmModal');
}

window.openManageCategoriesModal = function() {
    const transModal = document.getElementById('transactionModal');
    if (transModal) bootstrap.Modal.getInstance(transModal)?.hide();
    showModal('manageCategoriesModal');
}

window.openGoalModal = function() {
    showModal('goalModal');
}

window.deleteGoal = function() {
    showModal('deleteConfirmModal');
}

window.openAddFundsModal = function() {
    showModal('addFundsModal');
}

window.openWithdrawFundsModal = function() {
    showModal('withdrawFundsModal');
}

document.addEventListener('submit', function(e) {
    e.preventDefault();
    const activeModals = document.querySelectorAll('.modal.show');
    activeModals.forEach(modalEl => {
        const instance = bootstrap.Modal.getInstance(modalEl);
        if (instance) instance.hide();
    });
});