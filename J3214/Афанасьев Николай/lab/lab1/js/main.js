/* LearnFlow — shared JS for all pages */

(function () {
  function qs(sel, root = document) {
    return root.querySelector(sel);
  }
  function qsa(sel, root = document) {
    return Array.from(root.querySelectorAll(sel));
  }

  function getInitials(first, last) {
    const f = (first || "").trim();
    const l = (last || "").trim();
    const initials = (f.charAt(0) + l.charAt(0)).toUpperCase();
    return initials || "??";
  }

  function initSidebarMobile() {
    // Optional: if you add a button with [data-sidebar-toggle]
    const btn = qs("[data-sidebar-toggle]");
    if (!btn) return;
    btn.addEventListener("click", () => {
      document.body.classList.toggle("sidebar-open");
    });
  }

  function initDashboardWelcome() {
    const welcomeTitle = qs(".welcome-title");
    if (!welcomeTitle) return;
    const savedName = localStorage.getItem("userFirstName") || "Коля";
    welcomeTitle.textContent = `Привет, ${savedName}!`;
  }

  function initSettings() {
    const nameInput = qs("#set-name");
    if (!nameInput) return;

    qs("#set-name").value = localStorage.getItem("userFirstName") || "Иван";
    qs("#set-lastname").value = localStorage.getItem("userLastName") || "Иванов";
    qs("#set-email").value = localStorage.getItem("userEmail") || "ivan@example.com";
    qs("#set-about").value =
      localStorage.getItem("userAbout") || "Студент, изучаю Python и веб-разработку";

    const avatar = qs("#avatar-preview");
    if (avatar) {
      avatar.textContent = getInitials(qs("#set-name").value, qs("#set-lastname").value);
    }

    window.saveProfileSettings = function saveProfileSettings() {
      const name = qs("#set-name").value;
      const lastName = qs("#set-lastname").value;
      const email = qs("#set-email").value;
      const about = qs("#set-about").value;

      localStorage.setItem("userFirstName", name);
      localStorage.setItem("userLastName", lastName);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userAbout", about);

      if (avatar) avatar.textContent = getInitials(name, lastName);
      alert("Настройки профиля сохранены!");
    };
  }

  function initLogin() {
    const form = qs("#loginForm");
    if (!form) return;

    window.togglePass = function togglePass() {
      const passInput = qs("#passInput");
      if (!passInput) return;
      passInput.type = passInput.type === "password" ? "text" : "password";
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = (qs("#emailInput")?.value || "").trim();
      const pass = (qs("#passInput")?.value || "").trim();

      if (!email || !pass) {
        alert("Заполните все поля!");
        return;
      }

      const savedEmail = localStorage.getItem("userEmail");
      const savedRole = localStorage.getItem("userRole") || "student";

      if (!savedEmail || email !== savedEmail) {
        alert("Пользователь с таким email не найден. Пожалуйста, зарегистрируйтесь.");
        return;
      }

      localStorage.setItem("isLoggedIn", "true");

      if (savedRole === "teacher") window.location.href = "teacher.html";
      else window.location.href = "dashboard.html";
    });
  }

  function initRegister() {
    const registerCard = qs(".register-card");
    if (!registerCard) return;

    let selectedRole = "student";

    window.selectRole = function selectRole(role) {
      selectedRole = role;
      qs("#role-student")?.classList.toggle("active", role === "student");
      qs("#role-teacher")?.classList.toggle("active", role === "teacher");
    };

    window.checkStrength = function checkStrength(pass) {
      const fill = qs("#strengthFill");
      const label = qs("#strengthLabel");
      if (!fill || !label) return;

      let score = 0;
      if (pass.length > 5) score++;
      if (pass.length > 8) score++;
      if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) score++;

      const colors = ["#ff4d4d", "#ffd11a", "#2ecc71"];
      const labels = ["Слабый", "Средний", "Надежный"];
      const widths = ["33%", "66%", "100%"];

      if (pass.length === 0) {
        fill.style.width = "0";
        label.textContent = "";
        return;
      }

      const idx = score === 0 ? 0 : score - 1;
      fill.style.width = widths[idx];
      fill.style.background = colors[idx];
      label.textContent = labels[idx];
    };

    // Reuse same global togglePass from login if already set
    if (!window.togglePass) {
      window.togglePass = function togglePass() {
        const passInput = qs("#passInput");
        if (!passInput) return;
        passInput.type = passInput.type === "password" ? "text" : "password";
      };
    }

    window.handleRegister = function handleRegister() {
      const name = (qs("#reg-name")?.value || "").trim();
      const lastName = (qs("#reg-lastname")?.value || "").trim();
      const email = (qs("#reg-email")?.value || "").trim();
      const agree = !!qs("#agreeCheck")?.checked;

      if (!name || !lastName || !email) {
        alert("Пожалуйста, заполните основные поля");
        return;
      }
      if (!agree) {
        alert("Необходимо согласиться с условиями");
        return;
      }

      localStorage.setItem("userFirstName", name);
      localStorage.setItem("userLastName", lastName);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userRole", selectedRole);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userAbout", localStorage.getItem("userAbout") || "");

      window.location.href = selectedRole === "teacher" ? "teacher.html" : "dashboard.html";
    };
  }

  function initNavActive() {
    const file = window.location.pathname.split("/").pop() || "";
    const links = qsa('.nav-item[href]');
    if (links.length === 0) return;
    links.forEach((a) => a.classList.remove("active"));
    links.forEach((a) => {
      const href = a.getAttribute("href") || "";
      if (href && href !== "#" && href.endsWith(file)) a.classList.add("active");
    });
  }

  function initLogout() {
    qsa('[data-logout]').forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.setItem("isLoggedIn", "false");
        window.location.href = "login.html";
      });
    });
  }

  function initAuthGuard() {
    const file = window.location.pathname.split("/").pop() || "";
    const protectedPages = new Set([
      "dashboard.html",
      "courses.html",
      "course.html",
      "settings.html",
      "teacher.html",
    ]);
    if (!protectedPages.has(file)) return;
    const ok = localStorage.getItem("isLoggedIn") === "true";
    if (!ok) window.location.href = "login.html";
  }

  function initCatalog() {
    const grid = qs("#coursesGrid");
    if (!grid) return;

    const baseCourses = [
      {
        id: "py-begin",
        title: "Python для начинающих",
        author: "Алексей Смирнов",
        subject: "Программирование",
        level: "Начинающий",
        price: 1200,
        lessons: 24,
        rating: 4.8,
        emoji: "🐍",
        thumbBg: "#edeaf8",
      },
      {
        id: "html-css",
        title: "HTML & CSS: быстрый старт",
        author: "Мария Кузнецова",
        subject: "Дизайн",
        level: "Начинающий",
        price: 0,
        lessons: 20,
        rating: 4.7,
        emoji: "🌐",
        thumbBg: "#e1f5ee",
      },
      {
        id: "js-core",
        title: "JavaScript: основы",
        author: "Дмитрий Орлов",
        subject: "Программирование",
        level: "Средний",
        price: 1900,
        lessons: 28,
        rating: 4.9,
        emoji: "🟨",
        thumbBg: "#faeeda",
      },
      {
        id: "sql-start",
        title: "SQL и базы данных",
        author: "Ольга Иванова",
        subject: "Базы данных",
        level: "Начинающий",
        price: 900,
        lessons: 18,
        rating: 4.6,
        emoji: "🗄️",
        thumbBg: "#e0f2fe",
      },
      {
        id: "ml-intro",
        title: "Machine Learning: введение",
        author: "Илья Петров",
        subject: "ML / AI",
        level: "Средний",
        price: 2900,
        lessons: 30,
        rating: 4.7,
        emoji: "🤖",
        thumbBg: "#ffe4e6",
      },
      {
        id: "math-lin",
        title: "Линейная алгебра для ИТ",
        author: "Екатерина Соколова",
        subject: "Математика",
        level: "Продвинутый",
        price: 1500,
        lessons: 16,
        rating: 4.5,
        emoji: "📐",
        thumbBg: "#fef3c7",
      },
    ];

    const teacherPublished = JSON.parse(localStorage.getItem("myCourses") || "[]")
      .filter((c) => c.status === "Опубликован")
      .map((c) => ({
        id: String(c.id),
        title: c.title,
        author: "Вы (преподаватель)",
        subject: c.subject || "Программирование",
        level: c.level || "Начинающий",
        price: 0,
        lessons: 12,
        rating: 5.0,
        emoji: "📚",
        thumbBg: "#edeaf8",
      }));

    const allCourses = [...baseCourses, ...teacherPublished];

    function formatPrice(price) {
      if (!price) return "Бесплатно";
      return new Intl.NumberFormat("ru-RU").format(price) + " ₽";
    }

    function render(courses) {
      grid.innerHTML = "";
      courses.forEach((c) => {
        const col = document.createElement("div");
        col.className = "col-md-4 course-item";
        col.dataset.title = `${c.title} ${c.subject} ${c.author}`.toLowerCase();
        col.dataset.subject = c.subject;
        col.dataset.level = c.level;
        col.dataset.price = String(c.price);

        col.innerHTML = `
          <div class="course-card" role="button" tabindex="0">
            <div class="course-thumb" style="background:${c.thumbBg};">${c.emoji}</div>
            <div style="padding:14px;">
              <div style="margin-bottom:8px;"><span class="badge-level">${c.level}</span></div>
              <div style="font-size:14px;font-weight:700;color:#222;margin-bottom:4px;">${c.title}</div>
              <div style="font-size:12px;color:#888;margin-bottom:8px;">${c.author} · ${c.lessons} уроков</div>
              <div style="margin-bottom:8px;"><span class="tag">${c.subject}</span></div>
              <div class="d-flex justify-content-between align-items-center">
                <span class="rating">★ ${c.rating.toFixed(1)}</span>
                <span class="price">${formatPrice(c.price)}</span>
              </div>
            </div>
          </div>
        `;

        function openCourse() {
          localStorage.setItem("selectedCourse", JSON.stringify(c));
          window.location.href = `course.html?courseId=${encodeURIComponent(c.id)}`;
        }

        col.querySelector(".course-card")?.addEventListener("click", openCourse);
        col.querySelector(".course-card")?.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") openCourse();
        });

        grid.appendChild(col);
      });

      const info = qs("#resultsInfo");
      if (info) info.textContent = "Найдено " + courses.length + " курсов";
    }

    function applyFilter() {
      const search = (qs("#searchInput")?.value || "").trim().toLowerCase();
      const subject = qs("#filterSubject")?.value || "";
      const level = qs("#filterLevel")?.value || "";
      const price = qs("#filterPrice")?.value || "";

      const filtered = allCourses.filter((c) => {
        const hay = `${c.title} ${c.subject} ${c.author}`.toLowerCase();
        if (search && !hay.includes(search)) return false;
        if (subject && c.subject !== subject) return false;
        if (level && c.level !== level) return false;
        if (price === "free" && c.price !== 0) return false;
        if (price === "1000" && c.price > 1000) return false;
        if (price === "3000" && c.price > 3000) return false;
        return true;
      });

      render(filtered);
    }

    window.filterCourses = applyFilter;

    // live filtering
    qs("#searchInput")?.addEventListener("input", applyFilter);
    qs("#filterSubject")?.addEventListener("change", applyFilter);
    qs("#filterLevel")?.addEventListener("change", applyFilter);
    qs("#filterPrice")?.addEventListener("change", applyFilter);

    qs("#clearFiltersBtn")?.addEventListener("click", () => {
      const s = qs("#searchInput");
      const subj = qs("#filterSubject");
      const lvl = qs("#filterLevel");
      const pr = qs("#filterPrice");
      if (s) s.value = "";
      if (subj) subj.value = "";
      if (lvl) lvl.value = "";
      if (pr) pr.value = "";
      applyFilter();
    });

    // first paint
    render(allCourses);
  }

  function initCoursePage() {
    const tabsRoot = qs("[data-course-tabs]");
    if (!tabsRoot) return;

    // If user came from catalog, update a few texts
    try {
      const selected = JSON.parse(localStorage.getItem("selectedCourse") || "null");
      if (selected?.title) {
        // Right sidebar title
        const infoTitle = qs(".col-lg-4 div[style*='font-size:14px']");
        if (infoTitle) infoTitle.textContent = selected.title;
      }
    } catch (_) {}

    window.showTab = function showTab(tabName, btnEl) {
      qsa(".tab-btn").forEach((b) => b.classList.remove("active"));
      if (btnEl) btnEl.classList.add("active");

      qsa('[id^="tab-"]').forEach((panel) => (panel.style.display = "none"));
      const active = qs("#tab-" + tabName);
      if (active) active.style.display = "";
    };
  }

  function initTeacher() {
    if (!window.location.pathname.includes("teacher.html")) return;

    window.openModal = function openModal() {
      const modal = qs("#createModal");
      if (modal) modal.style.display = "flex";
    };
    window.closeModal = function closeModal() {
      const modal = qs("#createModal");
      if (modal) modal.style.display = "none";
    };

    window.saveNewCourse = function saveNewCourse() {
      const title = (qs('input[placeholder*="JavaScript"]')?.value || "").trim();
      const selects = qsa("select.form-control-custom");
      const subject = selects[0]?.value || "Программирование";
      const level = selects[1]?.value || "Начинающий";

      if (!title) {
        alert("Введите название!");
        return;
      }

      const newCourse = { title, subject, level, id: Date.now(), status: "Черновик" };
      const courses = JSON.parse(localStorage.getItem("myCourses") || "[]");
      courses.push(newCourse);
      localStorage.setItem("myCourses", JSON.stringify(courses));

      renderCourse(newCourse);
      window.closeModal();
    };

    function renderCourse(course) {
      const grid = qs(".row.g-3");
      if (!grid) return;

      const col = document.createElement("div");
      col.className = "col-md-6 col-lg-4";
      col.id = `course-card-${course.id}`;

      col.innerHTML = `
        <div class="course-card-teacher" style="padding: 16px;">
          <div class="d-flex justify-content-between mb-3">
            <div style="width:40px;height:40px;background:#f0eefb;border-radius:10px;display:flex;align-items:center;justify-content:center;">📚</div>
            <span class="badge-pill status-label">${course.status || "Черновик"}</span>
          </div>
          <div style="font-weight:700;color:#222;margin-bottom:4px;">${course.title}</div>
          <div style="font-size:12px;color:#888;margin-bottom:15px;">${course.subject} • ${course.level}</div>
          <div class="d-flex gap-2">
            <button class="btn-action publish-btn" style="flex:1; background: #e3f9e5; color: #1f7a33; display: ${
              course.status === "Опубликован" ? "none" : "block"
            }">Опубликовать</button>
            <button class="btn-action" style="flex:1; background: #fff1f0; color: #e24b4a; border: 1px solid #ffccc7;">Удалить</button>
          </div>
        </div>
      `;

      col.querySelector(".publish-btn")?.addEventListener("click", () => publishCourse(course.id));
      col.querySelectorAll("button")[1]?.addEventListener("click", () => deleteCourse(course.id));

      grid.appendChild(col);
    }

    function loadSavedCourses() {
      const courses = JSON.parse(localStorage.getItem("myCourses") || "[]");
      courses.forEach((c) => renderCourse(c));
    }

    function deleteCourse(id) {
      if (!confirm("Вы уверены, что хотите удалить этот курс?")) return;
      let courses = JSON.parse(localStorage.getItem("myCourses") || "[]");
      courses = courses.filter((c) => c.id !== id);
      localStorage.setItem("myCourses", JSON.stringify(courses));
      qs(`#course-card-${id}`)?.remove();
    }

    function publishCourse(id) {
      const courses = JSON.parse(localStorage.getItem("myCourses") || "[]");
      const idx = courses.findIndex((c) => c.id === id);
      if (idx === -1) return;
      courses[idx].status = "Опубликован";
      localStorage.setItem("myCourses", JSON.stringify(courses));

      const card = qs(`#course-card-${id}`);
      if (!card) return;
      const label = card.querySelector(".status-label");
      if (label) {
        label.textContent = "Опубликован";
        label.style.background = "#e3f9e5";
        label.style.color = "#1f7a33";
      }
      const btn = card.querySelector(".publish-btn");
      if (btn) btn.style.display = "none";
    }

    loadSavedCourses();
  }

  document.addEventListener("DOMContentLoaded", () => {
    initAuthGuard();
    initNavActive();
    initLogout();
    initSidebarMobile();
    initDashboardWelcome();
    initSettings();
    initLogin();
    initRegister();
    initCatalog();
    initCoursePage();
    initTeacher();
  });
})();

