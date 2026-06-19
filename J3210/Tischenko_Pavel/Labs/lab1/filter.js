document.addEventListener("DOMContentLoaded", function () {
  const directionSelect = document.getElementById("filterDirection");
  const levelSelect = document.getElementById("filterLevel");
  const minPriceInput = document.getElementById("filterMinPrice");
  const filterButton = document.getElementById("filterButton");
  const courseCards = document.querySelectorAll(".course-card[data-direction]");

  if (!directionSelect || !levelSelect || !minPriceInput || !filterButton) {
    return;
  }

  function applyFilter() {
    const selectedDirection = directionSelect.value;
    const selectedLevel = levelSelect.value;
    const minPrice = parseInt(minPriceInput.value, 10) || 0;

    courseCards.forEach(function (card) {
      const cardDirection = card.getAttribute("data-direction");
      const cardLevel = card.getAttribute("data-level");
      const cardPrice = parseInt(card.getAttribute("data-price"), 10) || 0;

      const matchesDirection =
        !selectedDirection || cardDirection === selectedDirection;

      const matchesLevel =
        !selectedLevel ||
        selectedLevel === "any" ||
        cardLevel === selectedLevel ||
        cardLevel === "any";

      const matchesPrice = cardPrice >= minPrice;

      if (matchesDirection && matchesLevel && matchesPrice) {
        card.classList.remove("d-none");
      } else {
        card.classList.add("d-none");
      }
    });
  }

  filterButton.addEventListener("click", applyFilter);
});

