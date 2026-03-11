import { describe, it, expect } from "vitest";

const VAKANTIEGELD_FACTOR = 1.08;
const calculateYearly = (monthly, includeVakantiegeld) =>
  Math.round(monthly * 12 * (includeVakantiegeld ? VAKANTIEGELD_FACTOR : 1));

describe("monthly to yearly conversion", () => {
  it("calculates with vakantiegeld", () => {
    expect(calculateYearly(4000, true)).toBe(51840);
  });

  it("calculates without vakantiegeld", () => {
    expect(calculateYearly(4000, false)).toBe(48000);
  });

  it("handles zero", () => {
    expect(calculateYearly(0, true)).toBe(0);
  });

  it("rounds correctly", () => {
    expect(calculateYearly(3333, true)).toBe(43196);
  });
});
