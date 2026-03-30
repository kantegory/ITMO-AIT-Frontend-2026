function getCourseIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function formatPrice(price) {
  if (Number(price) === 0) {
    return "Бесплатно";
  }

  return new Intl.NumberFormat("ru-RU").format(price) + " ₽";
}

function renderCourse(course) {
  const container = document.querySelector("#courseContainer");

  if (!container) return;

  container.innerHTML = `
    <div class="card shadow-sm">
      <img 
        src="${course.image}" 
        class="card-img-top" 
        alt="${course.title}"
        style="height: 380px; object-fit: cover;"
      >

      <div class="card-body">
        <h1 class="mb-3">${course.title}</h1>
        <p>${course.description}</p>
        <p><strong>Категория:</strong> ${course.category}</p>
        <p><strong>Уровень:</strong> ${course.level}</p>
        <p><strong>Длительность:</strong> ${course.duration}</p>
        <p><strong>Цена:</strong> ${formatPrice(course.price)}</p>

        <button id="enrollBtn" class="btn btn-primary">Записаться на курс</button>
        <a href="courses.html" class="btn btn-outline-secondary ms-2">Назад</a>

        <p id="courseMessage" class="mt-3"></p>
      </div>
    </div>
  `;
}

async function handleEnroll(courseId) {
  const messageBlock = document.querySelector("#courseMessage");
  const currentUser = getCurrentUser();

  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  try {
    const existingEnrollment = await getEnrollment(currentUser.id, Number(courseId));

    if (existingEnrollment) {
      messageBlock.textContent = "Вы уже записаны на этот курс";
      return;
    }

    const newEnrollment = {
      userId: currentUser.id,
      courseId: Number(courseId),
      progress: 0,
      status: "active"
    };

    await createEnrollment(newEnrollment);
    messageBlock.textContent = "Вы успешно записались на курс";
  } catch (error) {
    console.error("Ошибка записи:", error);
    messageBlock.textContent = "Не удалось записаться на курс";
  }
}

async function loadCoursePage() {
  const container = document.querySelector("#courseContainer");
  const courseId = getCourseIdFromUrl();

  if (!courseId) {
    container.innerHTML = "<p>Курс не найден.</p>";
    return;
  }

  try {
    container.innerHTML = "<p>Загрузка курса...</p>";

    const course = await getCourseById(courseId);
    renderCourse(course);

    const enrollBtn = document.querySelector("#enrollBtn");
    enrollBtn.addEventListener("click", function () {
      handleEnroll(courseId);
    });
  } catch (error) {
    console.error("Ошибка загрузки курса:", error);
    container.innerHTML = "<p>Не удалось загрузить курс.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadCoursePage);