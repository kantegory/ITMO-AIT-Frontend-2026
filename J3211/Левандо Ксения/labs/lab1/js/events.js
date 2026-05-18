let events = [];
async function loadEvents() {
    try {
        const response = await fetch("http://localhost:3000/events");
        events = await response.json();
        renderEvents();
    } catch (error) {
        console.error("Error loading events:", error);
    }
}

loadEvents();
document.getElementById("typeFilter").addEventListener("change", renderEvents);
document.getElementById("cityFilter").addEventListener("input", renderEvents);
document.getElementById("dateFilter").addEventListener("change", renderEvents);

function renderEvents() {
        const type = document.getElementById("typeFilter").value;
        const city = document.getElementById("cityFilter").value.toLowerCase();
        const date = document.getElementById("dateFilter").value;

        const container = document.getElementById("eventsContainer");

        container.innerHTML = "";

        const filteredEvents = events.filter(event => {
            const typeMatch = (type === "All" || !type) || event.type === type;
            const cityMatch = !city || event.city.toLowerCase().includes(city);
            const dateMatch = !date || event.date === date;
            return typeMatch && cityMatch && dateMatch;
            });

        if (filteredEvents.length === 0) {
        container.innerHTML = `<p class="fw-bold">No matching events found</p>`;
        return;
    }

        filteredEvents.forEach((event) => {
            // create alt-text from event info
            const imageAlt = `${event.name} at ${event.venue}, ${event.city} - ${event.type} event poster`
            // get a proper icon for event type
            const typeIcon = getEventTypeIcon(event.type);
            container.innerHTML += `
            <div class="col-md-4">
            <div class="card h-100 shadow-sm">
            <img src="${event.image}" class="card-img-top" alt="${imageAlt}" loading="lazy">
            <div class="card-body">
            <span class="badge bg-secondary mb-2">
                <svg class="icon icon-type" width="16" height="16">
                <use xlink:href="sprite.svg#${typeIcon}"></use>
                </svg>
            ${event.type}</span>
            <h5 class="card-title">${event.name}</h5>

            <p class="text-muted">
            ${event.city} · ${event.venue}
            </p>

            <p class="text-muted">
            ${new Date(event.date).toLocaleDateString()}
            </p>

            <a href="event.html?id=${event.id}" class="btn btn-outline-primary me-2">
            <!-- add an icon -->
            <svg class="icon icon-scaling" width="24" height="24">
            <use xlink:href="sprite.svg#icon-eye"></use>
            </svg>
            View
            </a>

            </div>
            </div>

            </div>

`;
        });
}

// get icon name in sprite
function getEventTypeIcon(eventType) {
    const icons = {
        'Sport': 'icon-sport',
        'Concert': 'icon-music', 
        'Theatre': 'icon-theater',
        'Exhibition': 'icon-gallery',
        'Festival': 'icon-festival',
    };
    
    return icons[eventType] || 'icon-default';
}