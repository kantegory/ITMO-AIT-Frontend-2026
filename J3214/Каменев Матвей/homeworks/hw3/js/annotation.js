const classInputs = document.querySelectorAll('input[name="class"]');
const confirmBtn = document.getElementById('confirm-btn');

classInputs.forEach((input) => {
    input.addEventListener('change', () => {
        confirmBtn.disabled = false;
    });
});
