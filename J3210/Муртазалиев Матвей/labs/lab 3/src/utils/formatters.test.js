import { describe, expect, it } from "vitest";
import { formatCurrency } from "./formatters";

describe("formatCurrency", () => {
  it("places the ruble sign after the amount", () => {
    expect(formatCurrency(126400)).toBe("126 400 ₽");
  });
});
