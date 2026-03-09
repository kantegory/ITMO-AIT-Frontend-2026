export function initModal() {
    const purchaseModalElement = document.getElementById("purchaseModal");
    const buyButtons = document.querySelectorAll(".buy-btn");
    
    if (!purchaseModalElement || buyButtons.length === 0) return;

    const purchaseModal = new bootstrap.Modal(purchaseModalElement);
    const modalTitle = document.getElementById("modalCourseTitle");
    const modalPrice = document.getElementById("modalCoursePrice");

    buyButtons.forEach(button => {
        button.addEventListener("click", function () {
            const courseName = this.getAttribute("data-course-name");
            const coursePrice = this.getAttribute("data-course-price");

            modalTitle.textContent = courseName;
            modalPrice.textContent = coursePrice;

            purchaseModal.show();
        });
    });

    const confirmBtn = document.getElementById("confirmPurchaseBtn");
    if (confirmBtn) {
        confirmBtn.addEventListener("click", function() {
            alert("Перенаправление на шлюз оплаты...");
            purchaseModal.hide();
        });
    }
}