export function initDashboard() {
    const downloadBtns = document.querySelectorAll(".download-cert-btn");

    downloadBtns.forEach(btn => {
        btn.addEventListener("click", function () {
            const originalHTML = this.innerHTML;

            this.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Подготовка PDF...';
            this.disabled = true;

            setTimeout(() => {
                this.innerHTML = originalHTML;
                this.disabled = false;

                alert("Сертификат успешно скачан");
            }, 1500);
        });
    });

    const coninueBtns = document.querySelectorAll(".continue-btn");

    coninueBtns.forEach(btn => {
        btn.addEventListener("click", function () {
            alert("Открытие плеера с лекциями...");
        });
    });

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function(e) {
            e.preventDefault();

            if (confirm('Вы уверены, что хотите выйти из аккаунта?')) {
                window.location.href = "index.html";
            }
        });
    }
}