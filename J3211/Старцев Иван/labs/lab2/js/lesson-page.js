(() => {
    const courseId = Number(new URLSearchParams(window.location.search).get("id"));
    const lessonsNav = document.getElementById("lessonsNav");
    const lessonsNavMobile = document.getElementById("lessonsNavMobile");
    const state = {
        section: 0,
        item: 0
    };
    const init = async () => {
        const user = await window.auth.requireAuth();
        if (!user) {return;}
        if (!courseId || !user.learningCourseIds.includes(courseId)) {
            window.location.href = "my-learning.html";
            return;
        }
        const course = await window.api.getCourse(courseId);

    const getNavHtml = (dismissOnClick = false) => course.program.map((section, sectionIndex) => `
            <div class="mb-3">
                <h3 class="h6 mb-2">${section.title}</h3>
                <div class="list-group">
                    ${section.items.map((item, itemIndex) => `
                        <button type="button"
                                class="list-group-item list-group-item-action${sectionIndex === state.section && itemIndex === state.item ? " active" : ""}"
                                data-section-index="${sectionIndex}"
                                data-item-index="${itemIndex}"${dismissOnClick ? ' data-bs-dismiss="modal"' : ""}>
                            ${itemIndex + 1}. ${item.title}
                        </button>
                    `).join("")}
                </div>
            </div>
        `).join("");

    const renderSidebar = () => {
        lessonsNav.innerHTML = getNavHtml();
        lessonsNavMobile.innerHTML = getNavHtml(true);
    };

    const handleNavClick = (event) => {
        const button = event.target.closest("button[data-section-index][data-item-index]");

        if (!button) {return;}
        state.section = Number(button.dataset.sectionIndex);
        state.item = Number(button.dataset.itemIndex);
        renderSidebar();
        renderContent();
    };

    lessonsNav.addEventListener("click", handleNavClick);
    lessonsNavMobile.addEventListener("click", handleNavClick);

    const renderContent = () => {
        const section = course.program[state.section];
        const lesson = section.items[state.item];
        document.title = `${lesson.title}`;
        document.getElementById("contentCourseTitle").textContent = course.title;
        document.getElementById("contentLessonTitle").textContent = lesson.title;
        document.getElementById("contentSectionTitle").textContent = section.title;
        document.getElementById("contentText").textContent = lesson.content;
    };

    document.querySelectorAll("[data-back-to-course-link]").forEach((link) => {link.href = `course.html?id=${course.id}`;});
    renderSidebar();
    renderContent();
    };
    init().catch(() => {
        document.getElementById("contentText").textContent = "Не удалось загрузить урок";
    });
})();
