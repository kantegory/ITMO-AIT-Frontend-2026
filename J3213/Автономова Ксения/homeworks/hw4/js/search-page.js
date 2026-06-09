(() => {
  window.tp = window.tp || {};

  window.tp.applyFilters = async function () {
    try {
      const typeSelect = document.getElementById('filterType');
      const dateInput = document.getElementById('filterDate');
      const locInput = document.getElementById('filterLocation');
      const events = await window.api.getEvents();
      const filtered = (events || []).filter((evt) => {
        const typeMatch = !typeSelect || typeSelect.value === '' || evt.type === typeSelect.value;
        const dateMatch = !dateInput || dateInput.value === '' || (evt.date || '') >= dateInput.value;
        const locMatch = !locInput || locInput.value === '' || ((evt.location || '').toLowerCase().includes(locInput.value.toLowerCase()));
        return typeMatch && dateMatch && locMatch;
      });
      const resultsContainer = document.getElementById('searchResults');
      if (resultsContainer) {
        window.tp.renderEventCards(resultsContainer, filtered);
      }
    } catch (err) {
      console.error(err);
    }
  };
})();