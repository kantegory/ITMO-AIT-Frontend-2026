export function showModal(title, message) {

    if (typeof bootstrap === "undefined") {
        alert(title + "\n\n" + message);
        return;
    }

    const prev = document.getElementById("mbe-modal");
    if (prev) prev.remove();

    const html = `
    <div class="modal fade" id="mbe-modal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">${title}</h5>
                    <button class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <p>${message}</p>
                </div>
                <div class="modal-footer">
                   <button class="btn btn-primary fw-semibold"
                            data-bs-dismiss="modal">OK</button>
                </div>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML("beforeend", html);

    const modalEl = document.getElementById("mbe-modal");
    const modal = new bootstrap.Modal(modalEl);

    modal.show();

    modalEl.addEventListener("hidden.bs.modal", () => {
        modalEl.remove();
    });
}