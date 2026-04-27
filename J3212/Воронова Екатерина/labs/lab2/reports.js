document.addEventListener("DOMContentLoaded", async () => {
  const user = requireAuth();
  const transactions = await apiGet(`/transactions?userId=${user.id}`);

  const income = transactions
    .filter(item => item.type === "Доход")
    .reduce((sum, item) => sum + item.amount, 0);

  const expense = transactions
    .filter(item => item.type === "Расход")
    .reduce((sum, item) => sum + item.amount, 0);

  const averageWeekExpense = Math.round(expense / 4);
  const balance = income - expense;

  const expenseEl = document.getElementById("reportExpense");
  const incomeEl = document.getElementById("reportIncome");
  const averageEl = document.getElementById("reportAverage");
  const balanceEl = document.getElementById("reportBalance");

  if (expenseEl) expenseEl.textContent = `${expense.toLocaleString("ru-RU")} ₽`;
  if (incomeEl) incomeEl.textContent = `${income.toLocaleString("ru-RU")} ₽`;
  if (averageEl) averageEl.textContent = `${averageWeekExpense.toLocaleString("ru-RU")} ₽`;
  if (balanceEl) balanceEl.textContent = `${balance.toLocaleString("ru-RU")} ₽`;
});