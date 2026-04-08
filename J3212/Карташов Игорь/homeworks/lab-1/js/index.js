// Search by name
document.getElementById('searchInput').addEventListener('input', function () {
  var query = this.value.toLowerCase();
  var rows = document.querySelectorAll('tbody tr');

  for (var i = 0; i < rows.length; i++) {
    var name = rows[i].querySelector('.pipeline-name').textContent.toLowerCase();
    if (name.indexOf(query) !== -1) {
      rows[i].style.display = '';
    } else {
      rows[i].style.display = 'none';
    }
  }
});

// Filter by status
var filterButtons = document.querySelectorAll('[data-filter]');

for (var i = 0; i < filterButtons.length; i++) {
  filterButtons[i].addEventListener('click', function () {
    // Remove active from all buttons
    for (var j = 0; j < filterButtons.length; j++) {
      filterButtons[j].classList.remove('active');
    }
    this.classList.add('active');

    var filter = this.getAttribute('data-filter');
    var rows = document.querySelectorAll('tbody tr');

    for (var k = 0; k < rows.length; k++) {
      var badge = rows[k].querySelector('.badge');
      var status = badge.textContent.toLowerCase();

      if (filter === 'all' || status === filter) {
        rows[k].style.display = '';
      } else {
        rows[k].style.display = 'none';
      }
    }
  });
}
