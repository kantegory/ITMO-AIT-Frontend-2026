document.addEventListener('DOMContentLoaded', () => {
    const $ = id => document.getElementById(id);
    const $$ = sel => document.querySelectorAll(sel);
    const getChecked = sel => [...$$(sel)].filter(el => el.checked).map(el => el.value);

    const els = {
        search: $('courseSearch'),
        sort: $('sortSelect'),
        list: $('coursesList'),
        count: $('resultsCount'),
        noResults: $('noResults'),
        priceMin: $('priceMin'),
        priceMax: $('priceMax'),
        freeOnly: $('filter-free'),
        apply: $('applyFilters'),
        reset1: $('resetFilters'),
        reset2: $('resetFromNoResults')
    };

    const getCourseData = el => ({
        subject: el.dataset.subject,
        level: el.dataset.level,
        price: +el.dataset.price,
        duration: +el.dataset.duration,
        rating: +el.dataset.rating,
        text: [...el.querySelectorAll('h5, p, .fw-bold')].map(e => e.textContent).join(' ').toLowerCase()
    });

    const filterAndSort = () => {
        const search = els.search.value.toLowerCase().trim();
        const subjects = getChecked('input[id^="filter-"]');
        const levels = getChecked('input[id^="level-"]');
        const durations = getChecked('input[id^="duration-"]');
        const minPrice = +els.priceMin.value || 0;
        const maxPrice = +els.priceMax.value || 100000;
        const sort = els.sort.value;

        let visible = 0;
        const courses = [...els.list.children];

        courses.forEach(course => {
            const d = getCourseData(course);
            const durCat = d.duration < 20 ? 'short' : d.duration <= 50 ? 'medium' : 'long';
            const match = (!search || d.text.includes(search)) &&
                (!subjects.length || subjects.includes(d.subject)) &&
                (!levels.length || levels.includes(d.level)) &&
                (!durations.length || durations.includes(durCat)) &&
                d.price >= minPrice && d.price <= maxPrice &&
                (!els.freeOnly.checked || d.price === 0);

            course.classList.toggle('d-none', !match);
            visible += match;
        });

        els.count.textContent = `Найдено курсов: ${visible}`;
        els.noResults.classList.toggle('d-none', visible > 0);
        els.list.classList.toggle('d-none', visible === 0);

        const visibleCourses = courses.filter(c => !c.classList.contains('d-none'));
        const compare = {
            'price-low': (a, b) => a.dataset.price - b.dataset.price,
            'price-high': (a, b) => b.dataset.price - a.dataset.price,
            'rating': (a, b) => b.dataset.rating - a.dataset.rating
        };
        if (compare[sort]) {
            visibleCourses.sort(compare[sort]);
            visibleCourses.forEach(c => els.list.appendChild(c));
        }
    };

    const resetFilters = () => {
        els.search.value = '';
        els.sort.value = 'rating';
        els.priceMin.value = 0;
        els.priceMax.value = 100000;
        els.freeOnly.checked = false;
        $$('input[type="checkbox"]').forEach(cb => cb.id !== 'filter-free' && (cb.checked = true));
        filterAndSort();
    };

    els.search.addEventListener('input', filterAndSort);
    els.sort.addEventListener('change', filterAndSort);
    $$('input[id^="filter-"], input[id^="level-"], input[id^="duration-"]').forEach(el =>
        el.addEventListener('change', filterAndSort));
    els.priceMin.addEventListener('input', filterAndSort);
    els.priceMax.addEventListener('input', filterAndSort);
    els.freeOnly.addEventListener('change', filterAndSort);
    els.apply?.addEventListener('click', filterAndSort);
    els.reset1?.addEventListener('click', resetFilters);
    els.reset2?.addEventListener('click', resetFilters);

    filterAndSort();
});