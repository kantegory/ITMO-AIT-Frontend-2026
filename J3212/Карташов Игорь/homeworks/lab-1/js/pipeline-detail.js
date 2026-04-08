// Open modal with task info
var taskModal = new bootstrap.Modal(document.getElementById('taskModal'));

function openTask(id, name, start, duration, status) {
  document.getElementById('modalTitle').textContent = name;
  document.getElementById('modalId').textContent = id;
  document.getElementById('modalStart').textContent = start;
  document.getElementById('modalDuration').textContent = duration;
  document.getElementById('modalStatus').textContent = status;
  taskModal.show();
}
