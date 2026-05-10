import { describe, expect, it } from "vitest";
import { buildBudgetPayload, buildTransactionPayload } from "./dashboardActions";

describe("dashboard action payload builders", () => {
  it("builds transaction payload for the current user", () => {
    expect(buildTransactionPayload({
      title: "Кофе",
      category: "Еда",
      amount: "250",
      type: "expense",
      accountName: "Текущий счёт",
      provider: "manual",
      date: "2026-05-11",
    }, 1)).toEqual({
      userId: 1,
      title: "Кофе",
      category: "Еда",
      amount: 250,
      type: "expense",
      accountName: "Текущий счёт",
      provider: "manual",
      date: "2026-05-11",
    });
  });

  it("builds budget payload for the current user", () => {
    expect(buildBudgetPayload({
      category: "Книги",
      limit: "5000",
    }, 1)).toEqual({
      userId: 1,
      category: "Книги",
      limit: 5000,
    });
  });
});
