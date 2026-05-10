import { describe, expect, it } from "vitest";
import { filterTransactions } from "./useTransactionsFilter";

const transactions = [
  {
    title: "Пятерочка",
    category: "Еда",
    amount: 1490,
    type: "expense",
    accountName: "Текущий счёт",
    date: "2026-03-08",
  },
  {
    title: "Метро",
    category: "Транспорт",
    amount: 320,
    type: "expense",
    accountName: "Текущий счёт",
    date: "2026-03-07",
  },
  {
    title: "Зарплата",
    category: "Доход",
    amount: 120000,
    type: "income",
    accountName: "Текущий счёт",
    date: "2026-03-05",
  },
];

describe("filterTransactions", () => {
  it("filters by search, category, max amount and date range", () => {
    const result = filterTransactions(transactions, {
      search: "текущий",
      category: "транспорт",
      amount: 1000,
      from: "2026-03-06",
      to: "2026-03-08",
    });

    expect(result).toEqual([transactions[1]]);
  });

  it("returns all transactions for empty filters", () => {
    expect(filterTransactions(transactions, {
      search: "",
      category: "all",
      amount: 0,
      from: "",
      to: "",
    })).toEqual(transactions);
  });
});
