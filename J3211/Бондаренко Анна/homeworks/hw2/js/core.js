window.USERS = {
    currentUserId: localStorage.getItem('current_user_id'),
    userData: null,

    init: async function () {
        if (!this.currentUserId) return;

        try {
            const [accounts, transactions, categories, rules] = await Promise.all([
                window.API.getAccounts(this.currentUserId),
                window.API.getTransactions(this.currentUserId),
                window.API.getCategories(),
                window.API.getRules(this.currentUserId)
            ]);

            this.userData = {
                accounts: accounts,
                transactions: transactions,
                categories: categories,
                rules: rules
            };
        } catch (error) {
            console.error("Ошибка при инициализации данных:", error);
        }
    },

    renderTotalBalance: function () {
        const balanceEl = document.getElementById('totalBalanceValue');
        if (!balanceEl || !this.userData) return;

        const total = this.userData.accounts.reduce(function (sum, account) {
            return sum + account.balance;
        }, 0);

        balanceEl.textContent = total.toFixed(2) + ' RUB';
    }
};

document.addEventListener('DOMContentLoaded', async function () {
    const path = window.location.pathname;
    const isAuth = path.includes('index.html') || path.includes('register.html');
    const uid = localStorage.getItem('current_user_id');
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(function (link) {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (path.includes(href)) {
            link.classList.add('active');
        }
    });

    if (!uid && !isAuth) {
        window.location.href = 'index.html';
        return;
    }

    if (uid) {
        await window.USERS.init();

        if (window.USERS.userData) {
            window.USERS.renderTotalBalance();

            if (typeof window.renderDashboard === 'function') window.renderDashboard();
            if (typeof window.initSearchPage === 'function') window.initSearchPage();
            if (typeof window.initReportsPage === 'function') window.initReportsPage();
            if (typeof window.initSettingsPage === 'function') window.initSettingsPage();
            if (typeof window.initExchangeRates === 'function') await window.initExchangeRates();
        }
    }

    const logoutBtn = document.querySelector('a[href="index.html"]');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            localStorage.removeItem('current_user_id');
            localStorage.removeItem('current_user_email');
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const btnOpen = document.getElementById('mobileMenuToggleBtn');
    const btnClose = document.getElementById('mobileMenuCloseBtn');
    const nav = document.getElementById('navLinksContainer');
    const overlay = document.getElementById('mobileMenuOverlayElement');

    function toggleMenu() {
        if (nav) nav.classList.toggle('active');
        if (overlay) overlay.classList.toggle('active');
    }

    if (btnOpen) {
        btnOpen.onclick = function (e) {
            e.preventDefault();
            toggleMenu();
        };
    }

    if (btnClose) {
        btnClose.onclick = function (e) {
            e.preventDefault();
            toggleMenu();
        };
    }

    if (overlay) {
        overlay.onclick = function () {
            toggleMenu();
        };
    }
});