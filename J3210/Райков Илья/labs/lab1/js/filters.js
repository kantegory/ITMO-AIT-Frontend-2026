import { COURSES_DATA } from "./data.js";
import { initModal } from "./modal.js";

export function initFilters() {
    const filterForm = document.getElementById("filterForm");
    const coursesContainer = document.querySelector(".col-lg-9 .row.g-4");
    if (!filterForm || !coursesContainer) return;

    const minPriceInput = document.getElementById("minPriceInput");
    const maxPriceInput = document.getElementById("maxPriceInput");
    const minLabel = document.getElementById("priceMinLabel");
    const maxLabel = document.getElementById("priceMaxLabel");
    const sliderTrack = document.querySelector(".slider-track");

    function updateSlider() {
        let minVal = parseInt(minPriceInput.value);
        let maxVal = parseInt(maxPriceInput.value);
        let minGap = 2000;

        if (maxVal - minVal < minGap) {
            if (this === minPriceInput) minPriceInput.value = maxVal - minGap;
            else maxPriceInput.value = minVal + minGap;
        }

        minLabel.textContent = minPriceInput.value.toLocaleString();
        maxLabel.textContent = maxPriceInput.value.toLocaleString();

        const percent1 = (minPriceInput.value / minPriceInput.max) * 100;
        const percent2 = (maxPriceInput.value / maxPriceInput.max) * 100;
        sliderTrack.style.left = percent1 + "%";
        sliderTrack.style.right = (100 - percent2) + "%";
    }

    minPriceInput.addEventListener("input", updateSlider);
    maxPriceInput.addEventListener("input", updateSlider);
    updateSlider();

    function renderCourses(courses) {
        if (courses.length === 0) {
            coursesContainer.innerHTML = `<div class="col-12 text-center py-5"><h4>Ничего не найдено</h4></div>`;
            return;
        }
        coursesContainer.innerHTML = courses.map(course => `
            <div class="col-md-6 col-xl-4">
                <div class="card h-100 course-card shadow-sm border-0">
                    <img src="${course.imgSrc}" class="card-img-top" alt="${course.title}" style="height: 160px; object-fit: cover;">
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1">${course.category}</span>
                            <span class="text-warning small"><i class="bi bi-star-fill"></i> ${course.rating}</span>
                        </div>
                        <h6 class="card-title fw-bold">${course.title}</h6>
                        <p class="card-text text-muted small">${course.level === 'beginner' ? 'Для начинающих' : 'Для профи'}</p>
                        <div class="mt-auto pt-3 d-flex justify-content-between align-items-center">
                            <span class="fw-bold">${course.price.toLocaleString()} ₽</span>
                            <button class="btn btn-sm btn-outline-dark buy-btn" 
                                data-course-name="${course.title}" 
                                data-course-price="${course.price.toLocaleString()}">Записаться</button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderCourses(COURSES_DATA);

    filterForm.addEventListener("submit", function(event) {
        event.preventDefault();
        
        const searchText = document.getElementById("searchInput").value.toLowerCase();
        
        const selectedCategories = Array.from(document.querySelectorAll('#categoryFilters input:checked')).map(cb => cb.value);
        
        const selectedLevels = Array.from(document.querySelectorAll('input[id^="lvl-"]:checked')).map(cb => cb.value);
        
        const minPrice = parseInt(minPriceInput.value);
        const maxPrice = parseInt(maxPriceInput.value);

        const filtered = COURSES_DATA.filter(course => {
            const matchSearch = course.title.toLowerCase().includes(searchText);
            const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(course.category);
            const matchLevel = selectedLevels.length === 0 || selectedLevels.includes(course.level);
            const matchPrice = course.price >= minPrice && course.price <= maxPrice;

            return matchSearch && matchCategory && matchLevel && matchPrice;
        });

        renderCourses(filtered);
    });

    document.getElementById("resetFiltersBtn").addEventListener("click", () => {
        filterForm.reset();
        minPriceInput.value = 0;
        maxPriceInput.value = 50000;
        updateSlider();
        renderCourses(COURSES_DATA)
    })
}