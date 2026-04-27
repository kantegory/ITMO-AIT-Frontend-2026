document.addEventListener("DOMContentLoaded", () => {
  initPasswordToggles();
  initTransactionFilters();
});

function initPasswordToggles() {
  const toggleButtons = document.querySelectorAll(".btn-password-toggle");

  toggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const input = button.parentElement.querySelector(".password-field");
      const icon = button.querySelector("i");

      if (!input) return;

      if (input.type === "password") {
        input.type = "text";
        if (icon) {
          icon.classList.remove("bi-eye");
          icon.classList.add("bi-eye-slash");
        }
      } else {
        input.type = "password";
        if (icon) {
          icon.classList.remove("bi-eye-slash");
          icon.classList.add("bi-eye");
        }
      }
    });
  });
}

function initTransactionFilters() {
  const table = document.getElementById("transactionsTable");
  if (!table) return;

  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const minAmount = document.getElementById("minAmount");
  const maxAmount = document.getElementById("maxAmount");
  const dateFrom = document.getElementById("dateFrom");
  const dateTo = document.getElementById("dateTo");
  const resetButton = document.getElementById("resetFilters");
  const countElement = document.getElementById("transactionCount");

  const rows = Array.from(table.querySelectorAll("tbody tr"));

  function applyFilters() {
    const searchValue = searchInput.value.trim().toLowerCase();
    const categoryValue = categoryFilter.value;
    const minValue = minAmount.value ? Number(minAmount.value) : null;
    const maxValue = maxAmount.value ? Number(maxAmount.value) : null;
    const fromValue = dateFrom.value;
    const toValue = dateTo.value;

    let visibleCount = 0;

    rows.forEach((row) => {
      const rowText = row.innerText.toLowerCase();
      const rowCategory = row.dataset.category || "";
      const rowAmount = Number(row.dataset.amount || 0);
      const rowDate = row.dataset.date || "";

      let isVisible = true;

      if (searchValue && !rowText.includes(searchValue)) {
        isVisible = false;
      }

      if (categoryValue && rowCategory !== categoryValue) {
        isVisible = false;
      }

      if (minValue !== null && rowAmount < minValue) {
        isVisible = false;
      }

      if (maxValue !== null && rowAmount > maxValue) {
        isVisible = false;
      }

      if (fromValue && rowDate < fromValue) {
        isVisible = false;
      }

      if (toValue && rowDate > toValue) {
        isVisible = false;
      }

      row.style.display = isVisible ? "" : "none";

      if (isVisible) {
        visibleCount += 1;
      }
    });

    if (countElement) {
      countElement.textContent = visibleCount;
    }
  }

  [searchInput, categoryFilter, minAmount, maxAmount, dateFrom, dateTo].forEach((element) => {
    if (!element) return;
    element.addEventListener("input", applyFilters);
    element.addEventListener("change", applyFilters);
  });

  if (resetButton) {
    resetButton.addEventListener("click", () => {
      searchInput.value = "";
      categoryFilter.value = "";
      minAmount.value = "";
      maxAmount.value = "";
      dateFrom.value = "";
      dateTo.value = "";
      applyFilters();
    });
  }

  applyFilters();
}