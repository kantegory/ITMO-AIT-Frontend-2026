const confirmBtn = document.getElementById('confirm-btn');

document.querySelectorAll('input[name="textclass"]').forEach(input => {
    input.addEventListener('change', () => {
        confirmBtn.disabled = false;
    });
});
