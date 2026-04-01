(() => {
    const params = new URLSearchParams(window.location.search);
    const course = window.store.getCourse(params.get("id")) ;

    const renderComments = () => {
        const comments = course.comments || [];
        const commentsList = document.getElementById("commentsList");

        commentsList.innerHTML = comments.length
            ? comments.map((comment) => `
                <div class="list-group-item px-0">
                    <div class="d-flex justify-content-between">
                        <strong>${comment.author}</strong>
                        <span><i class="bi bi-star-fill text-warning"></i> ${comment.rating}/5</span>
                    </div>
                    <p class="mb-0 mt-1">${comment.text}</p>
                </div>
            `).join("")
            : '<p class="text-muted mb-0">Пока нет комментариев.</p>';
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

    document.getElementById("courseImage").src = course.image;
    document.getElementById("courseImage").alt = course.title;
    document.getElementById("courseTitle").textContent = course.title;
    document.getElementById("courseDescription").textContent = course.fullDescription || course.description;
    document.getElementById("courseAuthor").textContent = course.author;
    document.getElementById("courseRating").innerHTML = `<i class="bi bi-star-fill text-warning"></i> ${course.rating} / 5`;
    document.getElementById("courseStudents").textContent = `${course.students} человек`;
    document.getElementById("courseLevel").textContent = course.level;
    document.getElementById("courseLanguage").textContent = course.language;
    document.getElementById("coursePrice").textContent = `${course.price} ₽`;
    document.getElementById("startLearningBtn").href = `lesson.html?id=${course.id}`;

    renderComments();
    renderProgram();
})();
