document.addEventListener("DOMContentLoaded", async () => {
  const user = requireAuth();
  const transactions = await apiGet(`/transactions?userId=${user.id}`);
  renderTransactionsTable(transactions);
  initTransactionFilters();
});

function renderTransactionsTable(transactions) {
  const tbody = document.querySelector("#transactionsTable tbody");
  if (!tbody) return;

  tbody.innerHTML = transactions.map(item => `
    <tr data-category="${item.category}" data-amount="${item.amount}" data-date="${item.date}">
      <td>${formatDate(item.date)}</td>
      <td>${item.category}</td>
      <td>${item.description}</td>
      <td>${item.account}</td>
      <td>${item.type}</td>
      <td class="${item.type === "Доход" ? "text-success" : "text-danger"}">
        ${item.type === "Доход" ? "+" : "-"}${item.amount.toLocaleString("ru-RU")} ₽
      </td>
      <td><span class="status-badge light">${item.status}</span></td>
    </tr>
  `).join("");

  const countElement = document.getElementById("transactionCount");
  if (countElement) {
    countElement.textContent = transactions.length;
  }

  const expenseSum = transactions
    .filter(item => item.type === "Расход")
    .reduce((sum, item) => sum + item.amount, 0);

  const incomeSum = transactions
    .filter(item => item.type === "Доход")
    .reduce((sum, item) => sum + item.amount, 0);

  const expenseElement = document.getElementById("expenseSum");
  const incomeElement = document.getElementById("incomeSum");

  if (expenseElement) {
    expenseElement.textContent = `${expenseSum.toLocaleString("ru-RU")} ₽`;
  }

  if (incomeElement) {
    incomeElement.textContent = `${incomeSum.toLocaleString("ru-RU")} ₽`;
  }
}