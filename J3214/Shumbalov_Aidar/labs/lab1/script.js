const searchInput = document.getElementById('courseSearch');
const subjectFilter = document.getElementById('subjectFilter');
const levelFilter = document.getElementById('levelFilter');
const priceFilter = document.getElementById('priceFilter');
const courseItems = Array.from(document.querySelectorAll('.course-item'));
const resultCount = document.getElementById('resultCount');
const emptyState = document.getElementById('emptyState');

function getWord(count) {
  if (count % 10 === 1 && count % 100 !== 11) return 'курс';
  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return 'курса';
  return 'курсов';
}

function filterCourses() {
  const query = searchInput.value.trim().toLowerCase();
  const subject = subjectFilter.value;
  const level = levelFilter.value;
  const price = priceFilter.value;
  let visibleCount = 0;

  courseItems.forEach((item) => {
    const matchesQuery = item.dataset.title.includes(query);
    const matchesSubject = subject === 'all' || item.dataset.subject === subject;
    const matchesLevel = level === 'all' || item.dataset.level === level;
    const matchesPrice = price === 'all' || item.dataset.price === price;
    const isVisible = matchesQuery && matchesSubject && matchesLevel && matchesPrice;

    item.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });

  resultCount.textContent = `${visibleCount} ${getWord(visibleCount)}`;
  emptyState.hidden = visibleCount > 0;
}

[searchInput, subjectFilter, levelFilter, priceFilter].forEach((control) => {
  control.addEventListener('input', filterCourses);
  control.addEventListener('change', filterCourses);
});
