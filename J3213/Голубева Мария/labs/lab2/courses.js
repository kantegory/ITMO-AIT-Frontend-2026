let allCourses = [];

function formatPrice(price) {
  if (Number(price) === 0) {
    return "Бесплатно";
  }

  return new Intl.NumberFormat("ru-RU").format(price) + " ₽";
}

function createCourseCard(course) {
  return `
    <div class="col-md-4">
      <div class="card h-100 shadow-sm">
        <div class="card-body d-flex flex-column">
          <h5>${course.title}</h5>
          <p>${course.description}</p>
          <p><strong>Цена:</strong> ${formatPrice(course.price)}</p>

          <a href="course.html?id=${course.id}" class="btn btn-primary mt-auto">
            Подробнее
          </a>
        </div>
      </div>
    </div>
  `;
}

function renderCourses(courses) {
  const container = document.querySelector("#coursesContainer");

  if (!container) return;

  if (courses.length === 0) {
    container.innerHTML = "<p>Курсы не найдены.</p>";
    return;
  }

  container.innerHTML = courses.map(createCourseCard).join("");
}

function filterCourses() {
  const language = document.querySelector("#languageFilter").value;
  const level = document.querySelector("#levelFilter").value;
  const price = document.querySelector("#priceFilter").value;

  const filteredCourses = allCourses.filter(function (course) {
    const matchLanguage = language ? course.category === language : true;
    const matchLevel = level ? course.level === level : true;
    const matchPrice = price ? Number(course.price) <= Number(price) : true;

    return matchLanguage && matchLevel && matchPrice;
  });

  renderCourses(filteredCourses);
}

async function loadCourses() {
  const container = document.querySelector("#coursesContainer");

  try {
    container.innerHTML = "<p>Загрузка...</p>";
    allCourses = await getCourses();
    renderCourses(allCourses);
  } catch (error) {
    console.error("Ошибка загрузки курсов:", error);
    container.innerHTML = "<p>Ошибка загрузки курсов.</p>";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  loadCourses();

  document.querySelector("#languageFilter").addEventListener("change", filterCourses);
  document.querySelector("#levelFilter").addEventListener("change", filterCourses);
  document.querySelector("#priceFilter").addEventListener("input", filterCourses);
});