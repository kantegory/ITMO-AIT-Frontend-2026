(() => {
    const pageAlert = document.getElementById("profileAlert");
    const nameField = document.getElementById("profileName");
    const emailField = document.getElementById("profileEmail");
    const avatar = document.getElementById("profileAvatar");
    const learningCount = document.getElementById("learningCount");
    const createdCount = document.getElementById("createdCount");
    const editForm = document.getElementById("editProfileForm");
    const passwordInput = document.getElementById("editPassword");
    let currentUser = null;

    const showMessage = (type, text) => {
        pageAlert.className = `alert alert-${type} mb-4`;
        pageAlert.textContent = text;
    };

    const hideMessage = () => {
        pageAlert.className = "alert d-none";
        pageAlert.textContent = "";
    };

    passwordInput.addEventListener("input", () => {
        passwordInput.value = passwordInput.value.replace(/\s/g, "");
    });

    const fillForm = () => {
        document.getElementById("editName").value = currentUser.name;
        document.getElementById("editEmail").value = currentUser.email;
        document.getElementById("editAvatar").value = currentUser.avatar;
        document.getElementById("editPassword").value = "";
    };

    const render = () => {
        avatar.src = currentUser.avatar;
        avatar.alt = currentUser.name;
        nameField.textContent = currentUser.name;
        emailField.textContent = currentUser.email;
        learningCount.textContent = currentUser.learningCourseIds.length;
        createdCount.textContent = currentUser.createdCourseIds.length;
        fillForm();
    };

    editForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        hideMessage();

        const formData = new FormData(editForm);
        const payload = {
            name: formData.get("name").trim(),
            email: formData.get("email").trim(),
            avatar: formData.get("avatar").trim()
        };
        const password = formData.get("password");
        if (password) {payload.password = password;}
        try {
            currentUser = await window.api.updateUser(currentUser.id, payload);
            window.auth.updateCurrentUser(currentUser);
            render();
            showMessage("success", "Профиль обновлен.");
        } catch {showMessage("danger", "Не удалось сохранить измненеия.");}
    });

    const init = async () => {
        currentUser = await window.auth.requireAuth();
        if (!currentUser) {
            return
        }
        render();
    };
    init().catch(() => {showMessage("danger", "Не удалось загрузить информацию.");});
})();
