document.addEventListener("DOMContentLoaded", function () {
    let confirmButton = document.getElementById("confirmCourseBtn");

    if (confirmButton) {
        confirmButton.addEventListener("click", function () {
            alert("Вы успешно записались на курс!");
        });
    }
});