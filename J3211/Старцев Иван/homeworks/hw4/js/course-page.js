import api from "./api.js";
import auth from "./auth.js";

(() => {
    const courseId = Number(new URLSearchParams(window.location.search).get("id"));
    const message = document.getElementById("courseMessage");
    const commentForm = document.getElementById("commentForm");
    const commentText = document.getElementById("commentText");
    const commentRating = document.getElementById("commentRating");
    const commentModalTitle = document.getElementById("commentModalLabel");
    const openCommentButton = document.getElementById("openCommentModalBtn");
    const submitCommentButton = document.getElementById("submitCommentBtn");
    const startLearningButton = document.getElementById("startLearningBtn");
    const metaDescription = document.getElementById("metaDescription");
    let course = null;
    let users = [];

    const showMessage = (type, text) => {
        message.className = `alert alert-${type} mb-3`;
        message.textContent = text;
        message.classList.remove("d-none");
    };

    const hideMessage = () => {
        message.className = "alert d-none";
        message.textContent = "";
    };

    const getUser = (userId) => users.find((item) => item.id === userId);

    const getUserName = (userId) => {
        const user = getUser(userId);
        return user ? user.name : "Неизвестный пользователь";
    };

    const getCourseRating = () => {
        if (!course.comments.length) {return 0;}
        const total = course.comments.reduce((sum, comment) => sum + comment.rating, 0);
        return total / course.comments.length;
    };

    const getCourseStudents = () => users.filter((user) => user.learningCourseIds.includes(course.id)).length;

    const getCurrentComment = () => {
        const userId = auth.getUserId();
        if (!userId) {return null;}
        return course.comments.find((comment) => comment.userId === userId) || null;
    };

    const updateCommentButton = async () => {
        if (!course) {
            return;
        }

        const currentComment = getCurrentComment();

        const user = await auth.loadCurrentUser();

        if (!user) {
            openCommentButton.classList.add("d-none");
            return
        } else {
            openCommentButton.classList.remove("d-none");
        }

        const text = currentComment ? "Редактировать комментарий" : "Оставить комментарий";
        const label = openCommentButton.querySelector("span");

        openCommentButton.setAttribute("aria-label", text);
        commentModalTitle.textContent = text;
        submitCommentButton.textContent = currentComment ? "Сохранить" : "Отправить";
        commentForm.reset();
        if (label) {
            label.textContent = text;
        }
        if (currentComment) {
            commentText.value = currentComment.text;
            commentRating.value = currentComment.rating;
        }
    };

    const updateStartButton = async () => {
        const user = await auth.loadCurrentUser();

        if (!user) {
            startLearningButton.textContent = "Войти для обучения";
            return;
        }

        startLearningButton.textContent = user.learningCourseIds.includes(course.id) ? "Продолжить обучение" : "Начать обучение";
    };

    const renderComments = () => {
        const commentsList = document.getElementById("commentsList");

        commentsList.innerHTML = course.comments.length
            ? course.comments.map((comment) => `
                <li class="list-group-item px-0">
                    <article>
                        <header class="d-flex justify-content-between gap-2">
                            <strong>${getUserName(comment.userId)}</strong>
                            <span>
                                <svg class="rating__star" aria-hidden="true">
                                    <use href="./sprites.svg#ratingStar"></use>
                                </svg> 
                                ${comment.rating}/5
                            </span>
                        </header>
                        <p class="mb-0 mt-1">${comment.text}</p>
                    </article>
                </li>
            `).join("")
            : '<li class="list-group-item px-0 text-muted">Пока нет комментариев.</li>';
    };

    const renderProgram = () => {
        document.getElementById("programAccordion").innerHTML = course.program.map((section, index) => `
            <div class="accordion-item">
                <h2 class="accordion-header" id="programHeading${index}">
                    <button class="accordion-button" type="button" data-bs-toggle="collapse"
                            data-bs-target="#programSection${index}" aria-expanded="true"
                            aria-controls="programSection${index}">
                        ${section.title}
                    </button>
                </h2>
                <div id="programSection${index}" class="accordion-collapse collapse show"
                     aria-labelledby="programHeading${index}">
                    <div class="accordion-body">
                        <ol class="mb-0 ps-3">
                            ${section.items.map((item) => `<li class="mb-2">${item.title}</li>`).join("")}
                        </ol>
                    </div>
                </div>
            </div>
        `).join("");
    };

    const render = async () => {
        const author = getUser(course.userId);

        document.getElementById("courseImage").src = course.image;
        document.getElementById("courseImage").alt = course.title;
        document.getElementById("courseTitle").textContent = course.title;
        document.getElementById("courseDescription").textContent = course.fullDescription || course.description;
        document.getElementById("courseAuthor").textContent = author ? author.name : "Неизвестный автор";
        document.getElementById("courseRating").innerHTML = `<svg class="rating__star" aria-hidden="true"><use href="./sprites.svg#ratingStar"></use> </svg> ${getCourseRating().toFixed(1)} / 5`;
        document.getElementById("courseStudents").textContent = `${getCourseStudents()} человек`;
        document.getElementById("courseLevel").textContent = course.level;
        document.getElementById("courseLanguage").textContent = course.language;
        document.getElementById("coursePrice").textContent = `${course.price} ₽`;
        startLearningButton.href = `lesson.html?id=${course.id}`;
        renderComments();
        renderProgram();
        await updateCommentButton();
        await updateStartButton();
        if (metaDescription) {
            metaDescription.setAttribute("content", "Информация о курсе: " + course.title);
        }
    };

    const loadPage = async () => {
        course = await api.getCourse(courseId);
        users = await api.getUsers();
        document.title = "Курс" + (course.title ? `: ${course.title}` : "");
        await render();
    };

    openCommentButton.addEventListener("click", async () => {
        if (!auth.getUserId()) {
            window.location.href = "login.html";
            return;
        }

        await updateCommentButton();
    });

    commentForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        hideMessage();

        const user = await auth.requireAuth();

        if (!user) {
            return;
        }

        const text = commentText.value.trim();

        const nextComment = {
            userId: user.id,
            rating: Number(commentRating.value),
            text
        };
        const isEditing = Boolean(getCurrentComment());
        const nextComments = isEditing
            ? course.comments.map((comment) => comment.userId === user.id ? nextComment : comment)
            : [...course.comments, nextComment];

        try {
            course = await api.updateCourse(course.id, {
                comments: nextComments
            });

            await render();

            const modal = window.bootstrap.Modal.getInstance(document.getElementById("commentModal"));

            if (modal) {
                modal.hide();
            }

            showMessage("success", isEditing ? "Комментарий обновлен." : "Комментарий отправлен.");
        } catch {
            showMessage("danger", isEditing ? "Не удалось изменить комментарий." : "Не удалось отправить комментарий.");
        }
    });

    startLearningButton.addEventListener("click", async (event) => {
        event.preventDefault();
        hideMessage();

        const user = await auth.requireAuth();

        if (!user) {
            return;
        }

        if (user.learningCourseIds.includes(course.id)) {
            window.location.href = `lesson.html?id=${course.id}`;
            return;
        }

        try {
            await api.updateUser(user.id, {
                learningCourseIds: [...user.learningCourseIds, course.id]
            });


            window.location.href = `lesson.html?id=${course.id}`;
        } catch {
            showMessage("danger", "Не удалось начать обучение.");
        }
    });

    if (!courseId) {
        showMessage("danger", "Курс не найден.");
        return;
    }

    loadPage().catch(() => {
        showMessage("danger", "Не удалось загрузить курс.");
    });
})();
