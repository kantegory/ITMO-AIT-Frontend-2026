import api from "./api.js";
import auth from "./auth.js";

(() => {
    const courseId = Number(new URLSearchParams(window.location.search).get("id"));
    const lessonsNav = document.getElementById("lessonsNav");
    const lessonsNavMobile = document.getElementById("lessonsNavMobile");
    const metaDescription = document.getElementById("metaDescription");
    const state = {
        section: 0,
        item: 0
    };
    const init = async () => {
        const user = await auth.requireAuth();
        if (!user) {return;}
        if (!courseId || !user.learningCourseIds.includes(courseId)) {
            window.location.href = "my-learning.html";
            return;
        }
        const course = await api.getCourse(courseId);
        if (metaDescription) {
            metaDescription.setAttribute("content", "Информация о курсе: " + course.title);
        }

        const getNavHtml = (dismissOnClick = false) => `
                <nav aria-label="Уроки курса">
                    ${course.program.map((section, sectionIndex) => `
                        <section class="mb-3">
                            <h3 class="h6 mb-2 p-2">${section.title}</h3>
                            <ul class="list-group">
                                ${section.items.map((item, itemIndex) => `
                                    <li class="list-group-item p-0">
                                        <button
                                            type="button"
                                            class="list-group-item list-group-item-action${sectionIndex === state.section && itemIndex === state.item ? " active" : ""}"
                                            data-section-index="${sectionIndex}"
                                            data-item-index="${itemIndex}"${dismissOnClick ? ' data-bs-dismiss="modal"' : ""}
                                            ${sectionIndex === state.section && itemIndex === state.item ? 'aria-current="step"' : ""}>
                                            ${itemIndex + 1}. ${item.title}
                                        </button>
                                    </li>
                                `).join("")}
                            </ul>
                        </section>
                    `).join("")}
                </nav>`;
    const renderSidebar = () => {
        lessonsNav.innerHTML = getNavHtml();
        lessonsNavMobile.innerHTML = getNavHtml(true);
    };

    const bindNavButtons = (container) => {
        container.querySelectorAll("button[data-section-index][data-item-index]").forEach((button) => {
            button.addEventListener("click", () => {
                state.section = Number(button.dataset.sectionIndex);
                state.item = Number(button.dataset.itemIndex);
                updateSidebar();
                renderContent();
            });
        });
    };

    const updateSidebar = () => {
        document.querySelectorAll("button[data-section-index][data-item-index]").forEach((button) => {
            const isCurrent =
                Number(button.dataset.sectionIndex) === state.section &&
                Number(button.dataset.itemIndex) === state.item;
            button.classList.toggle("active", isCurrent);
            if (isCurrent) {
                button.setAttribute("aria-current", "location");
            } else {
                button.removeAttribute("aria-current");
            }
        });
    };
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
    bindNavButtons(lessonsNav);
    bindNavButtons(lessonsNavMobile);
    };
    init().catch(() => {
        document.getElementById("contentText").textContent = "Не удалось загрузить урок";
    });
})();
