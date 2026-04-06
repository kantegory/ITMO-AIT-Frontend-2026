document.addEventListener("DOMContentLoaded", initTeacherPage);

function initTeacherPage() {
    const courses = getAllCourses();

    fillTeacherStats(courses);
    renderTeacherCourses(courses);
    fillCourseSelects(courses);
}

function fillTeacherStats(courses) {
    document.getElementById("teacherCoursesCount").textContent = String(courses.length);
    document.getElementById("teacherStudentsCount").textContent = "0";
    document.getElementById("teacherActiveCoursesCount").textContent = String(courses.length);
}

function renderTeacherCourses(courses) {
    const container = document.getElementById("teacherCoursesList");
    if (!container) return;

    container.innerHTML = "";

    if (courses.length === 0) {
        container.innerHTML = createEmptyTeacherCoursesState();
        return;
    }

    courses.forEach(course => {
        container.insertAdjacentHTML("beforeend", createTeacherCourseRow(course));
    });
}

function createEmptyTeacherCoursesState() {
    return `
        <tr>
            <td colspan="4" class="text-center text-muted py-4">Курсы пока отсутствуют</td>
        </tr>
    `;
}

function createTeacherCourseRow(course) {
    return `
        <tr>
            <td>
                <div class="fw-semibold">${course.title}</div>
                <div class="small text-muted">${course.subject || "Без категории"}</div>
            </td>
            <td>0</td>
            <td>
                <span class="badge text-bg-success">Активный</span>
            </td>
            <td>
                <a href="course.html?id=${course.id}" class="btn btn-sm btn-outline-custom">
                    Открыть
                </a>
            </td>
        </tr>
    `;
}

function fillCourseSelects(courses) {
    fillCourseSelect(document.getElementById("materialCourseSelect"), courses);
    fillCourseSelect(document.getElementById("lessonCourseSelect"), courses);
}

function fillCourseSelect(select, courses) {
    if (!select) return;

    select.innerHTML = `<option value="">Выберите курс</option>`;

    courses.forEach(course => {
        select.insertAdjacentHTML("beforeend", createCourseOption(course));
    });
}

function createCourseOption(course) {
    return `<option value="${course.id}">${course.title}</option>`;
}