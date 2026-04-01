let currentEvent = null;

const params = new URLSearchParams(window.location.search);
const eventId = params.get("id");

// get event from API
async function loadEvent() {
    try {
        const response = await fetch(`http://localhost:3000/events/${eventId}`);
        currentEvent = await response.json();

        renderEvent();
        loadReviews();

    } catch (error) {
        console.error("Error loading event:", error);
    }
}

loadEvent();

function renderEvent() {
    const eventImage = document.getElementById("eventImage");
    eventImage.src = currentEvent.image;
    eventImage.alt = `${currentEvent.name} - concert poster at ${currentEvent.venue}, ${currentEvent.city}`;
    document.getElementById("eventTitle").textContent = currentEvent.name;
    document.getElementById("eventDescription").textContent = currentEvent.description;
    document.getElementById("eventVenue").textContent = `Venue: ${currentEvent.venue}`;
    document.getElementById("seatMap").src = currentEvent.seatmap;
    document.getElementById("eventMeta").textContent =
    `${currentEvent.city} · ${new Date(currentEvent.date).toLocaleDateString('en-GB', 
        { day: 'numeric', month: 'short', year: 'numeric' })}`;
}

// REVIEWS
const reviewsContainer = document.getElementById("reviewsContainer");
let reviews = [];

async function loadReviews() {
    const response = await fetch(`http://localhost:3000/reviews?eventId=${eventId}`);
    reviews = await response.json();
    renderReviews();
}

function renderReviews() {
    reviewsContainer.innerHTML = "";
    if (reviews.length === 0) {
        reviewsContainer.innerHTML = `<p class="text-muted">No reviews yet.</p>`;
        return;
    }
    reviews.forEach(r => {
        const div = document.createElement("div");
        div.className = "card mb-2 p-2";
        div.innerHTML = `<strong>${r.user}</strong>: ${r.text}`;
        reviewsContainer.appendChild(div);
    });
}

document.getElementById("submitReview").onclick = async () => {
    if (localStorage.getItem("organizerAuth") === "true") {
        // return alert("Organizers cannot leave reviews.");
        showModal("Error", "Organizers cannot leave reviews.","error");
        return;
    }
    const text = document.getElementById("reviewInput").value.trim();
    if (!text){
        showModal("Warning", "Enter review text", "warning");
        return;
    }
    const user = JSON.parse(localStorage.getItem("user")) || { email: "Guest" };//?

    await fetch("http://localhost:3000/reviews", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            eventId: Number(eventId),
            user: user.email,
            text: text
        })
    });

    document.getElementById("reviewInput").value = "";
    loadReviews();
};

// --- Buy ticket logic with categories ---
const buyBtn = document.getElementById("buyBtn");
const ticketCategory = document.getElementById("ticketCategory");
const ticketPrice = document.getElementById("ticketPrice");
const confirmBuyBtn = document.getElementById("confirmBuyBtn");

buyBtn.onclick = () => {
    if (localStorage.getItem("organizerAuth") === "true") {
        showModal("Error", "Organizers cannot buy tickets.");
        return;
    }

    if (!currentEvent.categories || currentEvent.categories.length === 0) {
        showModal("Info", "No ticket categories available");
        eturn;
    }

    // fill select options
    ticketCategory.innerHTML = "";
    currentEvent.categories.forEach((cat, i) => {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = `${cat.name} - $${cat.price}`;
        ticketCategory.appendChild(option);
    });

    // show price
    ticketPrice.textContent = `Price: $${currentEvent.categories[0].price}`;

    // update price on selection
    ticketCategory.onchange = () => {
        const selected = currentEvent.categories[ticketCategory.value];
        ticketPrice.textContent = `Price: $${selected.price}`;
    };

    // show modal
    const modal = new bootstrap.Modal(document.getElementById("buyTicketModal"));
    modal.show();
};

confirmBuyBtn.onclick = async () => {
    if (localStorage.getItem("auth") !== "true") {
        showModal("Authorization required", "Please login to buy tickets");
    setTimeout(() => {
        window.location.href = "login.html";
    }, 3000);
    return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const selectedCategory = currentEvent.categories[ticketCategory.value];

    await fetch("http://localhost:3000/tickets", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            eventId: Number(currentEvent.id),
            event: currentEvent.name,
            date: currentEvent.date,
            owner: user.email,
            category: selectedCategory.name,
            price: selectedCategory.price

        })

    });
    bootstrap.Modal.getInstance(document.getElementById("buyTicketModal")).hide();
    showModal("Success",
    `Ticket purchased!\nCategory: ${selectedCategory.name}, $${selectedCategory.price}`, "success"
    );
};

// function for modal
function showModal(title, message, type = "primary") {
    const modalEl = document.getElementById("appModal");

    document.getElementById("appModalTitle").textContent = title;
    document.getElementById("appModalBody").textContent = message;

    const header = modalEl.querySelector(".modal-header");

    // reset classes
    header.className = "modal-header";

    // add color
    if (type === "error") header.classList.add("bg-danger", "text-white");
    if (type === "success") header.classList.add("bg-success", "text-white");
    if (type === "warning") header.classList.add("bg-warning");
    if (type === "info") header.classList.add("bg-info", "text-white");

    const modal = new bootstrap.Modal(modalEl);
    modal.show();
}