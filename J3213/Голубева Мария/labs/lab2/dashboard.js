function formatPrice(price) {
  if (Number(price) === 0) {
    return "Бесплатно";
  }

  return new Intl.NumberFormat("ru-RU").format(price) + " ₽";
}

async function loadDashboard() {
  requireAuth();

  const currentUser = getCurrentUser();
  const nameBlock = document.querySelector("#userName");
  const emailBlock = document.querySelector("#userEmail");
  const coursesContainer = document.querySelector("#myCoursesContainer");

  if (nameBlock) {
    nameBlock.textContent = currentUser.name;
  }

  if (emailBlock) {
    emailBlock.textContent = currentUser.email;
  }

  if (coursesContainer) {
    coursesContainer.innerHTML = "<p>Загрузка ваших курсов...</p>";
  }

  try {
    const enrollments = await getEnrollmentsByUserId(currentUser.id);

    if (enrollments.length === 0) {
      coursesContainer.innerHTML = "<p>Вы пока не записаны ни на один курс.</p>";
      return;
    }

    const cards = await Promise.all(
      enrollments.map(async function (enrollment) {
        const course = await getCourseById(enrollment.courseId);

        return `
          <div class="card mb-4 shadow-sm border-0 rounded-4 overflow-hidden">
            <div class="row g-0">
              <div class="col-md-4">
                <img
                  src="${course.image}"
                  alt="${course.title}"
                  class="img-fluid h-100 w-100"
                  style="object-fit: cover; min-height: 220px;"
                >
              </div>

              <div class="col-md-8">
                <div class="card-body p-4">
                  <h4 class="mb-3">${course.title}</h4>
                  <p class="text-muted">${course.description}</p>
                  <p class="mb-2"><strong>Уровень:</strong> ${course.level}</p>
                  <p class="mb-2"><strong>Длительность:</strong> ${course.duration}</p>
                  <p class="mb-2"><strong>Цена:</strong> ${formatPrice(course.price)}</p>
                  <p class="mb-3"><strong>Прогресс:</strong> ${enrollment.progress}%</p>

                  <div class="d-flex flex-wrap gap-2">
                    <button
                      class="btn btn-primary progress-btn"
                      data-id="${enrollment.id}"
                      data-progress="${enrollment.progress}"
                    >
                      Обновить прогресс
                    </button>

                    <button
                      class="btn btn-outline-danger delete-btn"
                      data-id="${enrollment.id}"
                    >
                      Отписаться
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
      })
    );

    coursesContainer.innerHTML = cards.join("");
    setupDashboardButtons();

  } catch (error) {
    console.error("Ошибка загрузки кабинета:", error);
    coursesContainer.innerHTML = "<p>Не удалось загрузить данные кабинета.</p>";
  }
}

function setupDashboardButtons() {
  const progressButtons = document.querySelectorAll(".progress-btn");
  const deleteButtons = document.querySelectorAll(".delete-btn");

  progressButtons.forEach(function (button) {
    button.addEventListener("click", async function () {
      const enrollmentId = button.dataset.id;
      const currentProgress = Number(button.dataset.progress);

      let newProgress = currentProgress + 10;

      if (newProgress > 100) {
        newProgress = 100;
      }

      try {
        await updateEnrollment(enrollmentId, { progress: newProgress });
        loadDashboard();
      } catch (error) {
        console.error("Ошибка обновления прогресса:", error);
        alert("Не удалось обновить прогресс");
      }
    });
  });

  deleteButtons.forEach(function (button) {
    button.addEventListener("click", async function () {
      const enrollmentId = button.dataset.id;

      try {
        await deleteEnrollment(enrollmentId);
        loadDashboard();
      } catch (error) {
        console.error("Ошибка удаления записи:", error);
        alert("Не удалось удалить запись");
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", loadDashboard);