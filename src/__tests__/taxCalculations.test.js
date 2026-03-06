import { describe, it, expect } from "vitest";
import { TAX } from "../config/tax2026.js";
import { getMarginalComponents } from "../App.jsx";

describe("getMarginalComponents", () => {
  it("returns bracket 1 rate for low income", () => {
    const c = getMarginalComponents(20000);
    expect(c.bracketRate).toBe(0.3575);
  });

  it("returns bracket 2 rate for middle income", () => {
    const c = getMarginalComponents(50000);
    expect(c.bracketRate).toBe(0.3756);
  });

  it("returns bracket 3 rate for high income", () => {
    const c = getMarginalComponents(100000);
    expect(c.bracketRate).toBe(0.495);
  });

  it("has no phaseouts at zero income", () => {
    const c = getMarginalComponents(0);
    expect(c.algemeenPhaseout).toBe(0);
    expect(c.arbeidPhaseout).toBe(0);
  });

  it("has AHK phaseout in middle range", () => {
    const c = getMarginalComponents(50000);
    expect(c.algemeenPhaseout).toBe(TAX.algemeenPhaseout);
  });

  it("has no AHK phaseout above end", () => {
    const c = getMarginalComponents(80000);
    expect(c.algemeenPhaseout).toBe(0);
  });

  it("has AK phaseout above threshold", () => {
    const c = getMarginalComponents(50000);
    expect(c.arbeidPhaseout).toBe(TAX.arbeidPhaseout);
  });

  it("has no AK phaseout above end", () => {
    const c = getMarginalComponents(140000);
    expect(c.arbeidPhaseout).toBe(0);
  });

  it("has arbeidskorting buildup in low range", () => {
    const c = getMarginalComponents(5000);
    expect(c.arbeidBuildup).toBe(0.08324);
  });

  it("total equals sum of components", () => {
    const c = getMarginalComponents(50000);
    expect(c.total).toBeCloseTo(
      c.bracketRate + c.algemeenPhaseout + c.arbeidPhaseout - c.arbeidBuildup,
    );
  });
});
