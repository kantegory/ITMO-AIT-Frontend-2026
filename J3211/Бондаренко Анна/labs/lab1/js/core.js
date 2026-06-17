window.USERS = {
    currentUserId: localStorage.getItem('current_user'),
    userData: null,

    init: function() {
        if (!this.currentUserId) return;

        const storageKey = 'DATA_' + this.currentUserId;
        const savedData = localStorage.getItem(storageKey);

        const defaultState = {
            accounts: [],
            transactions: [],
            categories: ['ЗАРПЛАТА', 'ПРОДУКТЫ', 'КАФЕ', 'ТРАНСПОРТ', 'РАЗВЛЕЧЕНИЯ'],
            rules: []
        };

        this.userData = savedData ? JSON.parse(savedData) : defaultState;
    },

    save: function() {
        const storageKey = 'DATA_' + this.currentUserId;
        localStorage.setItem(storageKey, JSON.stringify(this.userData));
    },
    
    renderTotalBalance: function() {
        const balanceElement = document.getElementById('totalBalanceValue');
        if (!balanceElement || !this.userData) {
            return;
        }

        const totalValue = this.userData.accounts.reduce(function(sum, account) {
            return sum + account.balance;
        }, 0);

        balanceElement.textContent = totalValue.toFixed(2) + ' RUB';
    }
};

document.addEventListener('DOMContentLoaded', function() {
    const isAuthPage = window.location.href.includes('index.html') ||
        window.location.href.includes('register.html');

    if (!USERS.currentUserId && !isAuthPage) {
        window.location.href = 'index.html';
        return;
    }

    USERS.init();
    USERS.renderTotalBalance();

    const logoutBtn = document.querySelector('a[href="index.html"]');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('current_user');
        });
    }
});