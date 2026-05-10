import { describe, expect, it } from "vitest";
import { buildDashboardSummary } from "./financeMetrics";

describe("buildDashboardSummary", () => {
  it("calculates balance, monthly spend, income, savings and budget risks", () => {
    const summary = buildDashboardSummary({
      user: { firstName: "Матвей" },
      accounts: [
        { type: "current", balance: 126400 },
        { type: "savings", balance: 112000, target: 150000 },
      ],
      budgets: [
        { category: "Еда", limit: 3000 },
        { category: "Дом", limit: 20000 },
      ],
      transactions: [
        { category: "Доход", amount: 120000, type: "income", date: "2026-03-05" },
        { category: "Еда", amount: 1490, type: "expense", date: "2026-03-08" },
        { category: "Еда", amount: 1780, type: "expense", date: "2026-03-20" },
        { category: "Дом", amount: 8400, type: "expense", date: "2026-03-04" },
      ],
    });

    expect(summary.greeting).toBe("Добрый вечер, Матвей");
    expect(summary.balance).toBe(238400);
    expect(summary.spend).toBe(11670);
    expect(summary.income).toBe(120000);
    expect(summary.savings).toBe(112000);
    expect(summary.savingsPercent).toBe(75);
    expect(summary.riskCount).toBe(1);
    expect(summary.topCategory?.name).toBe("Дом");
  });
});
