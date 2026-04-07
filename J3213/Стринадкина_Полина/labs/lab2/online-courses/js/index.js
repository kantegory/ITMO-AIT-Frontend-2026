const API_URL = 'http://127.0.0.1:4000';

async function loadPopularCourses() {
  try {
    const res = await axios.get(API_URL + '/courses');
    const courses = res.data.slice(0, 3);

    const container = document.getElementById('popular-courses');
    if (!container) return;

    container.innerHTML = '';

    courses.forEach(course => {
      container.innerHTML += `
        <div class="col-md-4">
          <div class="card h-100 shadow-sm">
            <img src="${course.image}" class="card-img-top" alt="${course.title}">
            <div class="card-body">
              <h5 class="card-title">${course.title}</h5>
              <p class="card-text">${course.description}</p>
              <a href="course.html?id=${course.id}" class="btn btn-primary">Подробнее</a>
            </div>
          </div>
        </div>
      `;
    });
  } catch (error) {
    console.error('Ошибка загрузки популярных курсов:', error);
  }
}

loadPopularCourses();