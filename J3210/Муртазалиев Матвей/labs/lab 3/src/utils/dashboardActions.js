export function buildTransactionPayload(form, userId) {
  return {
    userId,
    title: form.title.trim(),
    category: form.category.trim(),
    amount: Number(form.amount || 0),
    type: form.type,
    accountName: form.accountName,
    provider: form.provider || "manual",
    date: form.date,
  };
}

export function buildBudgetPayload(form, userId) {
  return {
    userId,
    category: form.category.trim(),
    limit: Number(form.limit || 0),
  };
}
