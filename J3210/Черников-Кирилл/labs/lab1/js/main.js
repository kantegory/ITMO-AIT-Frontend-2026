document.addEventListener("DOMContentLoaded", () => {
  initForms();
  initSearchFilters();
  initQuickActions();
  initFakeAnnotationTools();
});

function initForms() {
  const forms = document.querySelectorAll(".needs-validation");

  forms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (form.checkValidity()) {
        const targetModal = form.dataset.successModal;
        if (targetModal) {
          const modalElement = document.getElementById(targetModal);
          if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
          }
        }
      }

      form.classList.add("was-validated");
    });
  });
}

function initSearchFilters() {
  const form = document.getElementById("search-filter-form");
  if (!form) {
    return;
  }

  const cards = Array.from(document.querySelectorAll(".project-card"));
  const emptyState = document.getElementById("empty-results");
  const resetButton = document.getElementById("reset-filters");

  const apply = () => {
    const status = document.getElementById("filter-status").value;
    const annotationType = document.getElementById("filter-type").value;
    const worker = document.getElementById("filter-worker").value.trim().toLowerCase();

    let visibleCount = 0;

    cards.forEach((card) => {
      const cardStatus = card.dataset.status;
      const cardType = card.dataset.type;
      const cardWorker = card.dataset.worker.toLowerCase();

      const statusMatch = !status || cardStatus === status;
      const typeMatch = !annotationType || cardType === annotationType;
      const workerMatch = !worker || cardWorker.includes(worker);

      const isVisible = statusMatch && typeMatch && workerMatch;
      card.classList.toggle("d-none", !isVisible);

      if (isVisible) {
        visibleCount += 1;
      }
    });

    emptyState.classList.toggle("d-none", visibleCount !== 0);
  };

  form.addEventListener("input", apply);
  form.addEventListener("change", apply);

  resetButton.addEventListener("click", () => {
    form.reset();
    apply();
  });

  apply();
}

function initQuickActions() {
  const autoAssignButton = document.getElementById("auto-assign-btn");
  const assignedCount = document.getElementById("assigned-count");

  if (!autoAssignButton || !assignedCount) {
    return;
  }

  autoAssignButton.addEventListener("click", () => {
    const current = Number.parseInt(assignedCount.textContent, 10) || 0;
    assignedCount.textContent = String(current + 5);

    const toastNode = document.getElementById("action-toast");
    if (toastNode) {
      const toast = new bootstrap.Toast(toastNode);
      toast.show();
    }
  });
}

function initFakeAnnotationTools() {
  const toolButtons = document.querySelectorAll("[data-tool]");
  const toolLabel = document.getElementById("active-tool-label");

  if (!toolButtons.length || !toolLabel) {
    return;
  }

  toolButtons.forEach((button) => {
    button.addEventListener("click", () => {
      toolButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      toolLabel.textContent = button.dataset.tool;
    });
  });
}
