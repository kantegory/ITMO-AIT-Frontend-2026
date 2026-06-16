document.addEventListener("DOMContentLoaded", () => {
  const app = window.Lab1App;
  if (!app) return;

  const registerModal = app.getModal("registerSuccessModal");

  document.getElementById("registerForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const role = document.getElementById("accountRole")?.value || "tenant";
    const companyName = document.getElementById("companyName")?.value.trim() || "";
    const email = document.getElementById("contactEmail")?.value.trim() || "";
    const password = document.getElementById("registerPassword")?.value || "";
    const passwordRepeat = document.getElementById("registerPasswordRepeat")?.value || "";

    if (!companyName || !email || !password || !passwordRepeat) {
      app.showToast("Заполните обязательные поля регистрации.");
      return;
    }

    if (password !== passwordRepeat) {
      app.showToast("Пароли не совпадают.");
      return;
    }

    if (!document.getElementById("registerAgreement")?.checked) {
      app.showToast("Подтвердите корректность данных.");
      return;
    }

    const userData = {
      email,
      password,
      role,
      name: companyName,
      room: document.getElementById("companyRoom")?.value.trim() || "",
      phone: document.getElementById("contactPhone")?.value.trim() || "",
      accessRole: document.getElementById("accessRole")?.value || "",
      leaseType: document.getElementById("leaseType")?.value || "",
      companyInn: document.getElementById("companyInn")?.value.trim() || "",
      comment: document.getElementById("registerComment")?.value.trim() || "",
    };

    try {
      const createdUser = await app.registerUser(userData);
      const roleName = app.roleLabel(role);

      app.syncAuthNavigation();

      if (document.getElementById("registerSuccessRole")) {
        document.getElementById("registerSuccessRole").textContent = `Роль: ${roleName}`;
      }

      if (document.getElementById("registerSuccessText")) {
        document.getElementById("registerSuccessText").textContent =
          "Кабинет создан и уже связан с моковым API. Можно сразу перейти внутрь.";
      }

      const demoLink = document.getElementById("registerDemoLink");
      if (demoLink) {
        demoLink.href = app.cabinetLink(createdUser.role);
        demoLink.textContent = `Перейти в кабинет: ${roleName}`;
      }

      registerModal?.show();
    } catch (error) {
      app.showToast(error?.message || "Не удалось завершить регистрацию.");
    }
  });
});
