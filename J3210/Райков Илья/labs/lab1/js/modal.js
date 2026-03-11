import { getCurrentUser } from "./session.js";

export function initModal() {
    const purchaseModalElement = document.getElementById("purchaseModal");
    const buyBtns = document.querySelectorAll(".buy-btn");

    if (!purchaseModalElement || buyBtns.length === 0) return;

    const purchaseModal = new window.bootstrap.Modal(purchaseModalElement);
    const modalTitle = document.getElementById("modalCourseTitle");
    const modalPrice = document.getElementById("modalCoursePrice");
    let currentSelectedCourse = null;

    buyBtns.forEach(btn => {
        btn.addEventListener("click", function () {
            currentSelectedCourse = {
                title: this.getAttribute("data-course-name"),
                price: this.getAttribute("data-course-price"),
                imgSrc: this.closest('.card').querySelector('img').src,
                progress: 0
            };

            modalTitle.textContent = currentSelectedCourse.title;
            modalPrice.textContent = currentSelectedCourse.price;
            purchaseModal.show();
        });
    });

    const confirmBtn = document.getElementById("confirmPurchaseBtn");
    if (confirmBtn) {
        confirmBtn.addEventListener("click", function () {
            const user = getCurrentUser();
            if (!user) {
                alert("Чтобы купить курс, необходимо войти в систему");
                window.location.href = "login.html";
                return;
            }

            let allUsers = JSON.parse(localStorage.getItem("edu_users")) || [];
            let userIdx = allUsers.findIndex(u => u.email === user.email);

            if (userIdx !== -1) {
                const alreadyBought = allUsers[userIdx].courses.some(c => c.title === currentSelectedCourse.title);
                if (alreadyBought) {
                    alert("Вы уже приобрели этот курс");
                    purchaseModal.hide();
                    return;
                }

                allUsers[userIdx].courses.push(currentSelectedCourse);
                localStorage.setItem("edu_users", JSON.stringify(allUsers));
                localStorage.setItem("edu_current_user", JSON.stringify(allUsers[userIdx]));

                confirmBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Обработка платежа...';
                confirmBtn.disabled = true;

                setTimeout(() => {
                    confirmBtn.innerHTML = 'Перейти к оплате';
                    confirmBtn.disabled = false;
                    purchaseModal.hide();
                    
                    alert("Оплата прошла успешно! Курс добавлен в ваш Личный кабинет.");
                    window.location.href = "dashboard.html";
                }, 1500);
            }
        });
    }
}