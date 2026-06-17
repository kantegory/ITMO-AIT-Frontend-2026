
function buyTicket(){
    alert("Билет успешно куплен!");
}

function refundTicket(){
    alert("Билет возвращен!");
}

function filterEvents() {
    let searchValue = document.getElementById("searchInput").value.toLowerCase().trim();
    let typeValue = document.getElementById("typeFilter").value;
    let cityValue = document.getElementById("cityFilter").value.toLowerCase().trim();

    let events = document.querySelectorAll(".event-card");

    events.forEach(function(event) {
        let eventTitle = event.dataset.title;
        let eventType = event.dataset.type;
        let eventCity = event.dataset.city;

        let matchesSearch = searchValue === "" || eventTitle.includes(searchValue);
        let matchesType = typeValue === "all" || eventType === typeValue;
        let matchesCity = cityValue === "" || eventCity.includes(cityValue);

        if (matchesSearch && matchesType && matchesCity) {
            event.style.display = "block";
        } else {
            event.style.display = "none";
        }
    });
}