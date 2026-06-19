document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");

  if (!token || !userRaw) {
    window.location.href = "registration.html";
    return;
  }

  const user = JSON.parse(userRaw);
  document.querySelector(".account-username").textContent = user.name;
  document.querySelector(".account-email").textContent = user.email;

  function getInitials(name) {
    if (!name) return "??";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    const first = parts[0].charAt(0).toUpperCase();
    const second = parts[1].charAt(0).toUpperCase();
    return first + second;
  }

  const initialsEl = document.getElementById("accountAvatarInitials");
  if (initialsEl) {
    initialsEl.textContent = getInitials(user.name);
  }

  try {
    const res = await fetch("http://localhost:3001/me", {
      headers: { Authorization: "Bearer " + token },
    });
    if (!res.ok) console.warn("ME error", await res.text());
  } catch (e) {
    console.error(e);
  }

  const logoutBtn = document.getElementById("logoutBtnSidebar");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "index.html";
    });
  }

  const changeAvatarBtn = document.getElementById("changeAvatarBtn");
  if (changeAvatarBtn) {
    changeAvatarBtn.addEventListener("click", () => {
      alert("Здесь позже появится загрузка аватарки");
    });
  }

  // Переключение вкладок
  const sidebarItems = document.querySelectorAll(".sidebar-item");
  const favoritesPanel = document.getElementById("tabFavorites");
  const uploadsPanel = document.getElementById("tabUploads");
  const tabDescription = document.getElementById("tabDescription");

  if (sidebarItems.length && favoritesPanel && uploadsPanel) {
    sidebarItems.forEach(btn => {
      btn.addEventListener("click", () => {
        sidebarItems.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const tab = btn.getAttribute("data-tab");
        if (tab === "favorites") {
          favoritesPanel.classList.remove("d-none");
          uploadsPanel.classList.add("d-none");
          if (tabDescription) tabDescription.textContent = "Здесь появятся модели, которые вы отметили как понравившиеся.";
        } else {
          favoritesPanel.classList.add("d-none");
          uploadsPanel.classList.remove("d-none");
          if (tabDescription) tabDescription.textContent = "Здесь будут перечислены модели, которые вы загрузили на платформу.";
        }
      });
    });
  }

  // Загрузка избранных моделей
  async function loadFavorites() {
    const favoritesListEl = document.getElementById("favoritesList");
    const favoritesEmptyEl = document.getElementById("favoritesEmpty");
    if (!favoritesListEl || !favoritesEmptyEl) return;

    favoritesListEl.innerHTML = "";
    const favIds = JSON.parse(localStorage.getItem("favoriteModelIds") || "[]");
    if (!favIds.length) {
      favoritesEmptyEl.style.display = "block";
      return;
    }
    favoritesEmptyEl.style.display = "none";

    try {
      for (const id of favIds) {
        const res = await fetch(`http://localhost:3001/api/model/${id}`);
        if (!res.ok) continue;
        const model = await res.json();
        const row = document.createElement("div");
        row.className = "favorite-row card mb-2 shadow-sm";
        row.dataset.id = model.id;
        row.innerHTML = `
          <div class="card-body py-2 px-3 d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-start flex-grow-1">
              <div class="me-3">
                <div class="mb-1">
                  <span class="badge bg-primary me-1">${model.tagLabel || model.shortType || model.category || ""}</span>
                </div>
              </div>
              <div>
                <div class="fw-semibold mb-1" style="font-size:0.95rem;">${model.title}</div>
                <div class="text-muted" style="font-size:0.82rem; max-width:480px;">${model.description || ""}</div>
                <div class="mt-1 d-flex align-items-center gap-3" style="font-size:0.78rem;">
                  <span><i class="bi bi-download me-1"></i>${model.downloads ?? 0}</span>
                  <span class="d-flex align-items-center gap-2">
                    <span class="favorite-toggle-btn" title="Убрать из избранного" style="cursor:pointer;">
                      <i class="bi bi-star-fill text-warning"></i>
                    </span>
                    <span><i class="bi bi-heart-fill text-danger me-1"></i>${model.likes ?? 0}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        `;
        favoritesListEl.appendChild(row);
      }

      document.querySelectorAll(".favorite-toggle-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          const row = e.currentTarget.closest(".favorite-row");
          if (!row) return;
          const id = Number(row.dataset.id);
          let favIds = JSON.parse(localStorage.getItem("favoriteModelIds") || "[]");
          favIds = favIds.filter(x => x !== id);
          localStorage.setItem("favoriteModelIds", JSON.stringify(favIds));
          row.remove();
          if (!favoritesListEl.querySelector(".favorite-row")) {
            favoritesEmptyEl.style.display = "block";
          }
        });
      });
    } catch (e) {
      console.error("loadFavorites error", e);
      favoritesEmptyEl.style.display = "block";
    }
  }

  loadFavorites();
});