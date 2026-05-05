// page protection from unauthorized users
if (localStorage.getItem("auth") !== "true") {
    window.location.href = "index.html";
}

// loading a user
const user = JSON.parse(localStorage.getItem("user"));
document.getElementById("userName").textContent = user.name;
document.getElementById("userEmail").textContent = user.email;

// load tickets from API
async function loadTickets() {
    try {
        const response = await fetch(`http://localhost:3000/tickets?owner=${user.email}`);
        const userTickets = await response.json();

        renderTickets(userTickets);
    } catch (error) {
        console.error("Error loading tickets:", error);
    }
}

// create a ticket list on the page
function renderTickets(tickets) {
    const container = document.getElementById("ticketsList");

    if (tickets.length === 0) {
        container.innerHTML = `
            <p class="text-muted">You haven't purchased any tickets yet.</p>
        `;
        return;
    }

    container.innerHTML = "";

    tickets.forEach(ticket => {
        container.innerHTML += `
            <div class="border rounded p-3 mb-2 d-flex justify-content-between align-items-center">
                <div>
                    <strong>${ticket.event}</strong><br>
                    <small class="text-muted">${ticket.date}</small>
                </div>

                <button class="btn btn-sm btn-outline-danger"
                        onclick="refundTicket('${ticket.id}')">
                    Refund
                </button>
            </div>
        `;
    });
}

// ticket refunding
async function refundTicket(id) {
    showConfirmModal(
        "Refund ticket",
        "Are you sure you want to refund this ticket?",
        async () => {
            try {
                await fetch(`http://localhost:3000/tickets/${id}`, {
                    method: "DELETE"
                });

                loadTickets();
            } catch (error) {
                console.error("Refund error:", error);
                showModal("Error", "Failed to refund ticket", "danger");
            }
        }
    );
}

function logout() {
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
    window.location.href = "index.html";
}

function showConfirmModal(title, message, onConfirm) {
    document.getElementById("confirmTitle").textContent = title;
    document.getElementById("confirmMessage").textContent = message;

    const confirmBtn = document.getElementById("confirmActionBtn");

    confirmBtn.onclick = null;

    confirmBtn.onclick = () => {
        onConfirm();
        bootstrap.Modal.getInstance(document.getElementById("confirmModal")).hide();
    };

    const modal = new bootstrap.Modal(document.getElementById("confirmModal"));
    modal.show();
}

loadTickets();