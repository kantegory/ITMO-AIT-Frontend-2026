document.addEventListener('DOMContentLoaded', () => {

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            window.location.href = 'index.html';
        });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const toastElement = document.getElementById('registerToast');
            const toast = new bootstrap.Toast(toastElement);
            toast.show();
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        });
    }

    const saveTransactionBtn = document.getElementById('saveTransactionBtn');
    if (saveTransactionBtn) {
        saveTransactionBtn.addEventListener('click', () => {
             const modalElement = document.getElementById('addTransactionModal');
             const modalInstance = bootstrap.Modal.getInstance(modalElement);
             modalInstance.hide();

             document.getElementById('transactionForm').reset();

             const toastElement = document.getElementById('successToast');
             const toast = new bootstrap.Toast(toastElement, {
                 delay: 3000 
             });
             toast.show();
        });
    }

    const connectBtns = document.querySelectorAll('.connect-btn');
    connectBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if(this.innerText === 'Подключить') {
                this.innerText = 'Подключено';
                this.classList.replace('btn-primary', 'btn-success');
            }
        });
    });
});

function filterTransactions() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const filterCategory = document.getElementById('categoryFilter').value;
    const filterAccount = document.getElementById('accountFilter').value;
    
    const rows = document.querySelectorAll('#transactionsTable tr');

    rows.forEach(row => {
        const description = row.cells[2].innerText.toLowerCase();
        
        const rowCategory = row.getAttribute('data-category');
        const rowAccount = row.getAttribute('data-account');

        const textMatches = description.includes(searchText);
        const categoryMatches = (filterCategory === 'all' || filterCategory === rowCategory);
        const accountMatches = (filterAccount === 'all' || filterAccount === rowAccount); 

        if (textMatches && categoryMatches && accountMatches) {
            row.style.display = ''; 
        } else {
            row.style.display = 'none';
        }
    });
}

