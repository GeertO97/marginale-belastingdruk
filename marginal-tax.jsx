import { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Legend } from "recharts";

// 2026 Dutch tax parameters
const TAX = {
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
};

function getMarginalComponents(income) {
  // Base bracket rate
  let bracketRate = 0;
  for (const b of TAX.brackets) {
    if (income >= b.from && income < b.to) {
      bracketRate = b.rate;
      break;
    }
    if (income >= b.to && b.to === Infinity) bracketRate = b.rate;
  }
  if (income >= TAX.brackets[2].from) bracketRate = TAX.brackets[2].rate;

  // Algemene heffingskorting phaseout
  let algemeenPhaseout = 0;
  if (income > TAX.algemeenFullUntil && income < TAX.algemeenEnd) {
    algemeenPhaseout = TAX.algemeenPhaseout;
  }

  // Arbeidskorting phaseout
  let arbeidPhaseout = 0;
  if (income > TAX.arbeidPhaseoutStart && income < TAX.arbeidEnd) {
    arbeidPhaseout = TAX.arbeidPhaseout;
  }

  return {
    bracketRate,
    algemeenPhaseout,
    arbeidPhaseout,
    total: bracketRate + algemeenPhaseout + arbeidPhaseout,
  };
}

function generateChartData() {
  const data = [];
  for (let income = 0; income <= 150000; income += 500) {
    const c = getMarginalComponents(income);
    data.push({
      income,
      "Schijftarief": +(c.bracketRate * 100).toFixed(2),
      "Afbouw AHK": +(c.algemeenPhaseout * 100).toFixed(2),
      "Afbouw AK": +(c.arbeidPhaseout * 100).toFixed(2),
      total: +(c.total * 100).toFixed(2),
    });
  }
  return data;
}

const formatEuro = (v) => `€${Number(v).toLocaleString("nl-NL")}`;
const formatPct = (v) => `${v.toFixed(2)}%`;

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s, p) => s + p.value, 0);
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-800 mb-1">{formatEuro(label)}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex justify-between gap-4">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="font-mono">{p.value.toFixed(2)}%</span>
        </div>
      ))}
      <div className="border-t mt-1 pt-1 flex justify-between gap-4 font-semibold">
        <span>Totaal</span>
        <span className="font-mono">{total.toFixed(2)}%</span>
      </div>
    </div>
  );
}

export default function App() {
  const [income, setIncome] = useState(69984);
  const chartData = useMemo(generateChartData, []);
  const comp = getMarginalComponents(income);

  const bracketLabel = income < 38883 ? "Schijf 1" : income < 78426 ? "Schijf 2" : "Schijf 3";

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Marginale belastingdruk 2026</h1>
      <p className="text-gray-500 text-sm mb-6">Nederland · Box 1 · onder AOW-leeftijd</p>

      {/* Income input */}
      <div className="bg-white rounded-xl shadow-sm border p-5 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Bruto jaarinkomen</label>
        <div className="flex items-center gap-4 mb-3">
          <span className="text-lg font-semibold text-gray-900 w-36">{formatEuro(income)}</span>
          <input
            type="range"
            min={0}
            max={150000}
            step={500}
            value={income}
            onChange={(e) => setIncome(+e.target.value)}
            className="flex-1 h-2 accent-blue-600"
          />
        </div>
        <input
          type="number"
          min={0}
          max={500000}
          step={100}
          value={income}
          onChange={(e) => setIncome(Math.max(0, +e.target.value))}
          className="w-36 border rounded-lg px-3 py-1.5 text-sm"
        />
      </div>

      {/* Result cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Card label="Marginaal tarief" value={formatPct(comp.total * 100)} highlight />
        <Card label={bracketLabel} value={formatPct(comp.bracketRate * 100)} color="text-blue-600" />
        <Card label="Afbouw AHK" value={formatPct(comp.algemeenPhaseout * 100)} color="text-amber-600" />
        <Card label="Afbouw AK" value={formatPct(comp.arbeidPhaseout * 100)} color="text-rose-600" />
      </div>

      {/* Netto per extra euro */}
      <div className="bg-white rounded-xl shadow-sm border p-5 mb-6">
        <p className="text-sm text-gray-600">
          Bij een inkomen van <strong>{formatEuro(income)}</strong> houd je van elke extra euro bruto nog{" "}
          <strong className="text-green-700">€{(1 - comp.total).toFixed(2)}</strong> netto over.
          {comp.total > 0.495 && (
            <span className="text-amber-700 ml-1">
              Dat is minder dan bij het toptarief van 49,50% — door de afbouw van heffingskortingen.
            </span>
          )}
        </p>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl shadow-sm border p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Marginale belastingdruk per inkomensniveau</h2>
        <ResponsiveContainer width="100%" height={340}>
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="income"
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              tick={{ fontSize: 11 }}
              stroke="#9ca3af"
            />
            <YAxis
              domain={[0, 65]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 11 }}
              stroke="#9ca3af"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area type="stepAfter" dataKey="Schijftarief" stackId="1" fill="#3b82f6" stroke="#2563eb" fillOpacity={0.7} />
            <Area type="stepAfter" dataKey="Afbouw AHK" stackId="1" fill="#f59e0b" stroke="#d97706" fillOpacity={0.7} />
            <Area type="stepAfter" dataKey="Afbouw AK" stackId="1" fill="#f43f5e" stroke="#e11d48" fillOpacity={0.7} />
            <ReferenceLine x={income} stroke="#111827" strokeDasharray="4 4" strokeWidth={1.5} />
            <ReferenceLine y={49.5} stroke="#9ca3af" strokeDasharray="2 2" label={{ value: "Toptarief 49,5%", position: "right", fontSize: 10, fill: "#9ca3af" }} />
          </AreaChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-400 mt-2 text-center">Stippellijn = jouw inkomen</p>
      </div>

      {/* Explanation */}
      <div className="bg-white rounded-xl shadow-sm border p-5 text-sm text-gray-700 space-y-3">
        <h2 className="font-semibold text-gray-900">Hoe werkt het?</h2>
        <p>
          De <strong>marginale belastingdruk</strong> is het percentage belasting dat je betaalt over je laatst verdiende euro.
          Dit is niet hetzelfde als je gemiddelde belastingdruk (effectief tarief).
        </p>
        <p>
          In 2026 bestaan er drie schijftarieven: <strong>35,75%</strong> (t/m €38.883), <strong>37,56%</strong> (t/m €78.426)
          en <strong>49,50%</strong> (daarboven). Maar het werkelijke marginale tarief is vaak hoger door de afbouw van twee heffingskortingen:
        </p>
        <p>
          <strong className="text-amber-600">Algemene heffingskorting (AHK)</strong> — maximaal €3.115, wordt afgebouwd
          met 6,398% van het inkomen boven €29.736 tot €78.426.
        </p>
        <p>
          <strong className="text-rose-600">Arbeidskorting (AK)</strong> — maximaal €5.685, wordt afgebouwd
          met 6,51% van het inkomen boven €45.592 tot €132.920.
        </p>
        <p>
          Het gevolg: bij inkomens tussen ~€46k en ~€78k kan je marginale druk oplopen tot <strong>~50,5%</strong> — hoger
          dan het officiële toptarief. Dit wordt ook wel <em>"koude progressie"</em> of het <em>"dip in de koopkrachtcurve"</em> genoemd.
        </p>
      </div>

      <p className="text-xs text-gray-400 text-center mt-6">Bron: Belastingdienst 2026 · Vereenvoudigde berekening · Geen garantie</p>
    </div>
  );
}

function Card({ label, value, highlight, color }) {
  return (
    <div className={`rounded-xl border p-4 ${highlight ? "bg-gray-900 text-white" : "bg-white shadow-sm"}`}>
      <p className={`text-xs ${highlight ? "text-gray-300" : "text-gray-500"} mb-1`}>{label}</p>
      <p className={`text-xl font-bold ${highlight ? "" : color || "text-gray-900"}`}>{value}</p>
    </div>
  );
}
