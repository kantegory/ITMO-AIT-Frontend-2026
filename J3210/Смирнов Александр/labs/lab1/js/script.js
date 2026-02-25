document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById("searchInput");

    const cards = document.querySelectorAll(".searchable-item");

    if (searchInput) {
        searchInput.addEventListener("keyup", function(event) {
            // Convert user input to lowercase for case-insensitive search
            const query = event.target.value.toLowerCase();

            cards.forEach(card => {
                // Get the text inside the card
                const cardText = card.textContent.toLowerCase();

                if (cardText.includes(query)) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }
            });
        });
    }
});