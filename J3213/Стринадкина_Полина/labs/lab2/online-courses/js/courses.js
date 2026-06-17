const API_URL = 'http://127.0.0.1:4000';

async function loadCourses() {
  try {
    const res = await axios.get(API_URL + '/courses');
    const courses = res.data;

    const container = document.getElementById('courses-list');
    container.innerHTML = '';

    // Фильтрация
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const categoryFilter = document.getElementById('category-filter').value;
    const levelFilter = document.getElementById('level-filter').value;
    const priceFilter = document.getElementById('price-filter').value;

    const filteredCourses = courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchInput);
      const matchesCategory = categoryFilter ? course.category === categoryFilter : true;
      const matchesLevel = levelFilter ? course.level === levelFilter : true;
      let matchesPrice = true;

      const priceNumber = parseInt(course.price);

      if (priceFilter === "До 3000 ₽") {
        matchesPrice = priceNumber <= 3000;
      }

      if (priceFilter === "От 3000 ₽") {
        matchesPrice = priceNumber >= 3000;
      }

      return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
    });

    filteredCourses.forEach(course => {
      container.innerHTML += `
        <div class="col-md-4">
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <h5 class="card-title">${course.title}</h5>
              <p class="card-text">${course.description}</p>
              <p class="card-text fw-bold">${course.price}</p>
              <a href="course.html?id=${course.id}" class="btn btn-primary">Подробнее</a>
            </div>
          </div>
        </div>
      `;
    });

  } catch (err) {
    console.error('Ошибка:', err);
  }
}

document.getElementById('search-input').addEventListener('input', loadCourses);
document.getElementById('category-filter').addEventListener('change', loadCourses);
document.getElementById('level-filter').addEventListener('change', loadCourses);
document.getElementById('price-filter').addEventListener('change', loadCourses);

loadCourses();