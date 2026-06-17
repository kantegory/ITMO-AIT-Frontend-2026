document.addEventListener('DOMContentLoaded', function() {
    
    const togglePasswordBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('passwordInput');

    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', function() {

            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            this.textContent = type === 'password' ? 'Show' : 'Hide';
        });
    }
});

function openProductModal(title, code, price) {
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalCode').innerText = code;
    document.getElementById('modalPrice').innerText = price;

    var myModal = new bootstrap.Modal(document.getElementById('productModal'));
    myModal.show();
}

function applyFilters() {
    const btn = document.querySelector('#filterForm button');
    const originalText = btn.innerText;
    
    btn.innerText = 'Applying...';
    btn.disabled = true;

    setTimeout(() => {
        btn.innerText = originalText;
        btn.disabled = false;
        alert('Filters applied! (JS Mock for Lab 1)');
    }, 800);
}