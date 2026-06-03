document.addEventListener("DOMContentLoaded", initTeacherPage);

async function initTeacherPage() {
    if (!requireAuth()) return;

    const user = getUser();
    initForms();

    const coursesContainer = document.getElementById("teacherCoursesList");
    coursesContainer.innerHTML = `<tr><td colspan="4" class="text-center py-4">Загрузка...</td></tr>`;

    try {
        const [coursesData, allEnrollmentsRaw] = await Promise.all([
            getCourses(1, 1000, { userId: user.id }),
            apiRequest("/enrollments")
        ]);

        const myCourses = coursesData.courses || [];
        const allEnrollments = Array.isArray(allEnrollmentsRaw) ? allEnrollmentsRaw : (allEnrollmentsRaw.data || []);
        fillTeacherStats(myCourses, allEnrollments);
        renderTeacherCourses(myCourses, allEnrollments);
        fillCourseSelects(myCourses);
    } catch (err) {
        console.error(err);
        renderTeacherError();
    }
}

function fillTeacherStats(courses, enrollments) {
    const studentSet = new Set();
    enrollments.forEach(e => {
        if (courses.find(c => c.id === e.courseId)) studentSet.add(e.userId);
    });

    document.getElementById("teacherCoursesCount").textContent = courses.length;
    document.getElementById("teacherStudentsCount").textContent = studentSet.size;
    document.getElementById("teacherActiveCoursesCount").textContent = courses.length;
}

function renderTeacherCourses(courses, enrollments) {
    const container = document.getElementById("teacherCoursesList");
    container.innerHTML = "";

    if (!courses.length) {
        container.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-4">У вас пока нет курсов</td></tr>`;
        return;
    }

    courses.forEach(course => {
        const studentsCount = enrollments.filter(e => e.courseId === course.id).length;
        container.insertAdjacentHTML("beforeend", `
            <tr>
                <td>
                    <div class="fw-semibold">${course.title}</div>
                    <div class="small text-muted">${course.subject || "—"}</div>
                </td>
                <td>${studentsCount}</td>
                <td><span class="badge text-bg-success">Активный</span></td>
                <td>
                    <div class="d-flex flex-wrap gap-1">
                        <button onclick="openEditModal(${course.id})" class="btn btn-sm btn-outline-custom">Изменить</button>
                        <a href="course.html?id=${course.id}" class="btn btn-sm btn-outline-custom">Открыть</a>
                        <button onclick="confirmDeleteCourse(${course.id}, '${course.title.replace(/'/g, "\\'")}')" class="btn btn-sm btn-outline-danger">Удалить</button>
                    </div>
                </td>
            </tr>
        `);
    });
}

function fillCourseSelects(courses) {
    fillSelect(document.getElementById("materialCourseSelect"), courses);
    fillSelect(document.getElementById("lessonCourseSelect"), courses);
}

function fillSelect(select, courses) {
    if (!select) return;
    select.innerHTML = `<option value="">Выберите курс</option>`;
    courses.forEach(c => select.insertAdjacentHTML("beforeend", `<option value="${c.id}">${c.title}</option>`));
}

function renderTeacherError() {
    document.getElementById("teacherCoursesCount").textContent = "0";
    document.getElementById("teacherStudentsCount").textContent = "0";
    document.getElementById("teacherActiveCoursesCount").textContent = "0";
    document.getElementById("teacherCoursesList").innerHTML = `<tr><td colspan="4" class="text-center text-danger py-4">Не удалось загрузить данные</td></tr>`;
}

function initForms() {
    const courseForm = document.getElementById("createCourseForm");
    courseForm?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const title = document.getElementById("newCourseTitle").value.trim();
        const subject = document.getElementById("newCourseSubject").value.trim();
        const desc = document.getElementById("newCourseDesc").value.trim();
        const level = document.getElementById("newCourseLevel").value || "Новичок";
        const price = Number(document.getElementById("newCoursePrice").value) || 0;

        if (title.length < 5) return alert("Название курса должно быть не короче 5 символов");
        if (!subject) return alert("Укажите предмет");
        if (desc.length < 15) return alert("Описание должно быть не короче 15 символов");

        const user = getUser();
        const courseData = {
            title, subject, desc, userId: user.id, level, price,
            lessons: [], materials: [], tasks: []
        };

        try {
            await createCourse(courseData);
            alert("✅ Курс успешно создан!");
            location.reload();
        } catch (err) {
            alert("Ошибка создания: " + err.message);
        }
    });

    const lessonForm = document.getElementById("addLessonForm");
    lessonForm?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const courseId = document.getElementById("lessonCourseSelect").value;
        if (!courseId) return alert("Выберите курс");

        const title = document.getElementById("lessonTitle").value.trim();
        const duration = document.getElementById("lessonDuration").value.trim();
        const videoUrl = document.getElementById("lessonVideoUrl").value.trim();

        if (!title || !duration || !videoUrl) return alert("Заполните все поля урока");

        try {
            const course = await getCourseById(courseId);
            const newLesson = { title, duration, videoId: videoUrl };
            const updated = { ...course, lessons: [...(course.lessons || []), newLesson] };
            await updateCourse(courseId, updated);
            alert("✅ Урок добавлен!");
            lessonForm.reset();
            location.reload();
        } catch (err) {
            alert("Ошибка: " + err.message);
        }
    });

    const materialForm = document.getElementById("uploadMaterialForm");
    materialForm?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const courseId = document.getElementById("materialCourseSelect").value;
        if (!courseId) return alert("Выберите курс");

        const title = document.getElementById("materialTitle").value.trim();
        const link = document.getElementById("materialLink").value.trim();
        if (!title || !link) return alert("Заполните все поля материала");

        try {
            const course = await getCourseById(courseId);
            const newMaterial = { title, link };
            const updated = { ...course, materials: [...(course.materials || []), newMaterial] };
            await updateCourse(courseId, updated);
            alert("✅ Материал добавлен!");
            materialForm.reset();
            location.reload();
        } catch (err) {
            alert("Ошибка: " + err.message);
        }
    });

    const editForm = document.getElementById("editCourseForm");
    editForm?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const courseId = document.getElementById("editCourseId").value;
        const originalData = JSON.parse(editForm.dataset.originalData || "{}");

        const updatedData = {
            ...originalData,
            title: document.getElementById("editCourseTitle").value.trim(),
            subject: document.getElementById("editCourseSubject").value.trim(),
            level: document.getElementById("editCourseLevel").value,
            price: Number(document.getElementById("editCoursePrice").value) || 0,
            desc: document.getElementById("editCourseDesc").value.trim()
        };

        try {
            await updateCourse(courseId, updatedData);
            alert("✅ Курс успешно обновлен!");
            bootstrap.Modal.getInstance(document.getElementById('editCourseModal')).hide();
            location.reload();
        } catch (err) {
            alert("Ошибка обновления: " + err.message);
        }
    });
}

async function confirmDeleteCourse(courseId, courseTitle) {
    const confirmed = confirm(`Вы уверены, что хотите удалить курс «${courseTitle}»?\n\nВсе записи студентов на этот курс будут также удалены.\nДействие необратимо.`);
    if (!confirmed) return;

    try {
        await deleteEnrollmentsByCourse(courseId);
        await deleteCourse(courseId);
        alert("Курс «" + courseTitle + "» удалён.");
        location.reload();
    } catch (err) {
        alert("Ошибка при удалении курса: " + err.message);
    }
}

async function openEditModal(courseId) {
    try {
        const course = await getCourseById(courseId);
        document.getElementById("editCourseId").value = course.id;
        document.getElementById("editCourseTitle").value = course.title;
        document.getElementById("editCourseSubject").value = course.subject || "";
        document.getElementById("editCourseLevel").value = course.level || "Новичок";
        document.getElementById("editCoursePrice").value = course.price || 0;
        document.getElementById("editCourseDesc").value = course.desc || "";

        document.getElementById("editCourseForm").dataset.originalData = JSON.stringify({
            userId: course.userId,
            lessons: course.lessons || [],
            materials: course.materials || [],
            tasks: course.tasks || []
        });

        new bootstrap.Modal(document.getElementById('editCourseModal')).show();
    } catch (err) {
        alert("Ошибка загрузки курса: " + err.message);
    }
}