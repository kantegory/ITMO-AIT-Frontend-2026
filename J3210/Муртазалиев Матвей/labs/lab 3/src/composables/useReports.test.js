import { describe, expect, it } from "vitest";
import { buildReportPresets } from "./useReports";

describe("buildReportPresets", () => {
  it("builds week, month and quarter presets from API transactions", () => {
    const presets = buildReportPresets(
      [
        { category: "Еда", amount: 1490, type: "expense", date: "2026-03-08" },
        { category: "Транспорт", amount: 320, type: "expense", date: "2026-03-07" },
        { category: "Дом", amount: 8400, type: "expense", date: "2026-03-04" },
        { category: "Доход", amount: 120000, type: "income", date: "2026-03-05" },
      ],
      [{ balance: 126400 }, { balance: 112000 }],
    );

    expect(Object.keys(presets)).toEqual(["week", "month", "quarter"]);
    expect(presets.week.spendValue).toBe(10210);
    expect(presets.week.categoryLabels[0]).toBe("Дом");
    expect(presets.week.categoryData[0]).toBe(8400);
    expect(presets.month.forecastValue).toBeGreaterThan(0);
  });
});
