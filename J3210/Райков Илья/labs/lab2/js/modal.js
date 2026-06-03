import { getCurrentUser, getAuthToken } from "./session.js";

export function initModal() {
    const purchaseModalElement = document.getElementById("purchaseModal");
    const coursesContainer = document.querySelector(".col-lg-9 .row.g-4");

    if (!purchaseModalElement || !coursesContainer) return;

    const purchaseModal = new window.bootstrap.Modal(purchaseModalElement);
    const modalTitle = document.getElementById("modalCourseTitle");
    const modalPrice = document.getElementById("modalCoursePrice");
    let currentSelectedCourse = null;

    coursesContainer.addEventListener("click", function (event) {
        const btn = event.target.closest(".buy-btn");
        
        if (btn) {
            currentSelectedCourse = {
                title: btn.getAttribute("data-course-name"),
                price: btn.getAttribute("data-course-price"),
                imgSrc: btn.closest('.card').querySelector('img').src,
                progress: 0
            };

            modalTitle.textContent = currentSelectedCourse.title;
            modalPrice.textContent = currentSelectedCourse.price;
            purchaseModal.show();
        }
    });

    const confirmBtn = document.getElementById("confirmPurchaseBtn");
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

    if (newConfirmBtn) {
        newConfirmBtn.addEventListener("click", async function () {
            const user = getCurrentUser();
            const token = getAuthToken();

            if (!user || !token) {
                alert("Чтобы купить курс, необходимо войти в систему");
                window.location.href = "login.html";
                return;
            }

            try {
                const userRes = await fetch(`http://127.0.0.1:3000/users/${user.id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                const userData = await userRes.json();
                
                const alreadyBought = userData.courses.some(c => c.title === currentSelectedCourse.title);
                if (alreadyBought) {
                    alert("Вы уже приобрели этот курс");
                    purchaseModal.hide();
                    return;
                }

                userData.courses.push(currentSelectedCourse);

                newConfirmBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Обработка...';
                newConfirmBtn.disabled = true;

                const updateRes = await fetch(`http://127.0.0.1:3000/users/${user.id}`, {
                    method: 'PATCH',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` 
                    },
                    body: JSON.stringify({ courses: userData.courses })
                });

                if (updateRes.ok) {
                    localStorage.setItem("user", JSON.stringify(await updateRes.json()));
                    
                    purchaseModal.hide();
                    alert("Оплата прошла успешно! Курс добавлен в ваш Личный кабинет.");
                    window.location.href = "dashboard.html";
                } else {
                    alert("Ошибка при сохранении курса.");
                }

            } catch (error) {
                console.error("Ошибка:", error);
                alert("Ошибка соединения с сервером");
            } finally {
                newConfirmBtn.innerHTML = 'Перейти к оплате';
                newConfirmBtn.disabled = false;
            }
        });
    }
}