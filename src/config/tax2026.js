// 2026 Dutch tax parameters
// Source: Belastingdienst — https://www.belastingdienst.nl/
export const TAX = {
  brackets: [
    { from: 0, to: 38883, rate: 0.3575 },
    { from: 38883, to: 78426, rate: 0.3756 },
    { from: 78426, to: Infinity, rate: 0.495 },
  ],
  algemeenMax: 3115,
  algemeenFullUntil: 29736,
  algemeenPhaseout: 0.06398,
  algemeenEnd: 78426,
  arbeidMax: 5685,
  arbeidPhaseoutStart: 45592,
  arbeidPhaseout: 0.0651,
  arbeidEnd: 132920,
  arbeidBuildup: [
    { from: 0, to: 11965, rate: 0.08324 },
    { from: 11965, to: 25845, rate: 0.31009 },
    { from: 25845, to: 45592, rate: 0.01950 },
  ],
};

export const VAKANTIEGELD_FACTOR = 1.08;
