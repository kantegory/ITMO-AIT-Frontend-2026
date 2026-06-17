document.addEventListener('DOMContentLoaded', async function() {
    const favoritesList = document.getElementById('favoritesList');
    if (!favoritesList) return;

    const user = getCurrentUser();
    if (!user) return;

    try {
        const favorites = await favoritesAPI.getUserFavorites(user.id);
        
        if (favorites.length === 0) {
            favoritesList.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="bi bi-heart text-muted" style="font-size: 4rem;"></i>
                    <h4 class="mt-3 text-muted">У вас пока нет избранных курсов</h4>
                    <a href="courses.html" class="btn btn-danger mt-3">
                        <i class="bi bi-search"></i> Найти курсы
                    </a>
                </div>
            `;
            return;
        }

        favoritesList.innerHTML = favorites.map(course => `
            <div class="col-md-6 mb-3">
                <div class="card h-100">
                    <img src="${course.image}" class="card-img-top" alt="${course.title}" 
                         style="height: 150px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">${course.title}</h5>
                        <p class="card-text text-muted small">${course.instructor}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="text-danger fw-bold">${course.price} ₽</span>
                            <a href="course-detail.html?id=${course.id}" class="btn btn-sm btn-danger">
                                Подробнее
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Ошибка загрузки избранного:', error);
        favoritesList.innerHTML = '<p class="text-danger">Ошибка загрузки</p>';
    }
});