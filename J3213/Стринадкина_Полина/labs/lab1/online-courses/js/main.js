function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  if (input.type === "password") {
    input.type = "text";
  } else {
    input.type = "password";
  }
}

function confirmDelete() {
  if (confirm("Вы уверены, что хотите удалить курс?")) {
    alert("Курс удалён.");
  }
}