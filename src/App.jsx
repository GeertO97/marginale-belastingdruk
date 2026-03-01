import { useState, useMemo, useRef, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts";

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
  arbeidBuildup: [
    { from: 0, to: 11965, rate: 0.08324 },
    { from: 11965, to: 25845, rate: 0.31009 },
    { from: 25845, to: 45592, rate: 0.01950 },
  ],
};

function getMarginalComponents(income) {
  // Base bracket rate
  let bracketRate = 0;
  for (const b of TAX.brackets) {
    if (income >= b.from && income < b.to) {
      bracketRate = b.rate;
      break;
    }
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

  // Arbeidskorting buildup (reduces marginal rate)
  let arbeidBuildup = 0;
  for (const b of TAX.arbeidBuildup) {
    if (income >= b.from && income < b.to) {
      arbeidBuildup = b.rate;
      break;
    }
  }

  return {
    bracketRate,
    algemeenPhaseout,
    arbeidPhaseout,
    arbeidBuildup,
    total: bracketRate + algemeenPhaseout + arbeidPhaseout - arbeidBuildup,
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
      "Opbouw AK": +(-c.arbeidBuildup * 100).toFixed(2),
      total: +(c.total * 100).toFixed(2),
    });
  }
  return data;
}

const formatEuro = (v) => `€${Number(v).toLocaleString("nl-NL")}`;
const formatPct = (v) => `${v.toFixed(2)}%`;

const COMPONENT_COLORS = {
  "Schijftarief": "#3b82f6",
  "Afbouw AHK": "#f59e0b",
  "Afbouw AK": "#f43f5e",
  "Opbouw AK": "#22c55e",
};

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload;
  if (!point) return null;
  const components = [
    { key: "Schijftarief", label: "Schijftarief" },
    { key: "Afbouw AHK", label: "Afbouw AHK" },
    { key: "Afbouw AK", label: "Afbouw AK" },
    { key: "Opbouw AK", label: "Opbouw AK" },
  ].filter((c) => point[c.key] !== 0);
  return (
    <div className="bg-gray-900 text-white rounded-lg shadow-xl px-4 py-3 text-sm min-w-[180px]">
      <p className="text-gray-400 text-xs mb-2">{formatEuro(label)}</p>
      <p className="text-2xl font-bold mb-2">{point.total.toFixed(1)}%</p>
      <div className="border-t border-gray-700 pt-2 space-y-1">
        {components.map((c) => (
          <div key={c.key} className="flex justify-between gap-4">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full" style={{ background: COMPONENT_COLORS[c.key] }} />
              <span className="text-gray-300 text-xs">{c.label}</span>
            </span>
            <span className="font-mono text-xs">{point[c.key] > 0 ? "+" : ""}{point[c.key].toFixed(1)}%</span>
          </div>
        ))}
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
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <Card label="Marginaal tarief" value={formatPct(comp.total * 100)} highlight
          info="Het totale percentage belasting dat je betaalt over je laatstverdiende euro. Dit is de som van het schijftarief, plus afbouw van kortingen, minus opbouw van kortingen." />
        <Card label={bracketLabel} value={formatPct(comp.bracketRate * 100)} color="text-blue-600"
          info="Het bastistarief van de inkomstenbelasting in jouw schijf. Nederland kent 3 schijven: 35,75% (tot €38.883), 37,56% (tot €78.426) en 49,50% (daarboven)." />
        <Card label="Afbouw AHK" value={formatPct(comp.algemeenPhaseout * 100)} color="text-amber-600"
          info="Algemene Heffingskorting — een belastingkorting die iedereen krijgt (max €3.115). Boven €29.736 wordt deze afgebouwd: per extra euro verdienen verlies je 6,4 cent korting, wat je marginale tarief met 6,4% verhoogt." />
        <Card label="Afbouw AK" value={formatPct(comp.arbeidPhaseout * 100)} color="text-rose-600"
          info="Arbeidskorting — een belastingkorting voor werkenden (max €5.685). Boven €45.592 wordt deze afgebouwd: per extra euro verlies je 6,5 cent korting, wat je marginale tarief met 6,5% verhoogt." />
        <Card label="Opbouw AK" value={`-${formatPct(comp.arbeidBuildup * 100)}`} color="text-green-600"
          info="Tot €45.592 wordt de arbeidskorting opgebouwd: per extra euro verdienen krijg je meer korting, wat je marginale tarief verlaagt. Het sterkste effect is tussen €11.965–€25.845 (−31%)." />
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
        <ResponsiveContainer width="100%" height={360}>
          <AreaChart data={chartData} margin={{ top: 25, right: 20, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="income"
              tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 65]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              width={45}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#94a3b8", strokeDasharray: "4 4" }} />
            <ReferenceLine y={49.5} stroke="#cbd5e1" strokeDasharray="6 3" label={{ value: "Toptarief 49,5%", position: "insideTopRight", fontSize: 10, fill: "#94a3b8" }} />
            <ReferenceLine x={income} stroke="#3b82f6" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: formatEuro(income), position: "top", fontSize: 10, fill: "#3b82f6", fontWeight: 600 }} />
            <Area type="stepAfter" dataKey="total" fill="url(#gradTotal)" stroke="#3b82f6" strokeWidth={2} dot={false} name="Marginaal tarief" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Verantwoording & methodologie */}
      <div className="bg-white rounded-xl shadow-sm border p-5 text-sm text-gray-700 space-y-5">
        <h2 className="text-lg font-semibold text-gray-900">Verantwoording & methodologie</h2>

        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800">Hoe werkt het?</h3>
          <p>
            De <strong>marginale belastingdruk</strong> is het percentage belasting dat je betaalt over je laatst verdiende euro.
            Dit is niet hetzelfde als je gemiddelde belastingdruk (effectief tarief). Wiskundig is het de afgeleide van de totale
            belastingfunctie naar het inkomen: <em>dT/dY</em>.
          </p>
          <p>
            Het effectieve marginale tarief bestaat uit het <strong>schijftarief</strong>, plus de <strong>afbouw</strong> van
            heffingskortingen (die het tarief verhogen), minus de <strong>opbouw</strong> van heffingskortingen (die het tarief verlagen):
          </p>
          <p className="font-mono text-xs bg-gray-50 rounded p-2">
            Marginaal tarief = Schijftarief + Afbouw AHK + Afbouw AK − Opbouw AK
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800">Schijftarieven 2026</h3>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="py-1.5 pr-4">Schijf</th>
                <th className="py-1.5 pr-4">Van</th>
                <th className="py-1.5 pr-4">Tot</th>
                <th className="py-1.5">Tarief</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-1.5 pr-4">1</td>
                <td className="py-1.5 pr-4">€0</td>
                <td className="py-1.5 pr-4">€38.883</td>
                <td className="py-1.5">35,75%</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-1.5 pr-4">2</td>
                <td className="py-1.5 pr-4">€38.883</td>
                <td className="py-1.5 pr-4">€78.426</td>
                <td className="py-1.5">37,56%</td>
              </tr>
              <tr>
                <td className="py-1.5 pr-4">3</td>
                <td className="py-1.5 pr-4">€78.426</td>
                <td className="py-1.5 pr-4">-</td>
                <td className="py-1.5">49,50%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800">Algemene heffingskorting (AHK) 2026</h3>
          <p>Maximaal <strong>€3.115</strong>. Wordt afgebouwd met <strong>6,398%</strong> van het inkomen boven €29.736, tot €0 bij €78.426.</p>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="py-1.5 pr-4">Inkomen</th>
                <th className="py-1.5">Effect</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-1.5 pr-4">t/m €29.736</td>
                <td className="py-1.5">Volledig: €3.115</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-1.5 pr-4">€29.736 – €78.426</td>
                <td className="py-1.5">Afbouw: −6,398% per extra euro (verhoogt marginaal tarief)</td>
              </tr>
              <tr>
                <td className="py-1.5 pr-4">Boven €78.426</td>
                <td className="py-1.5">€0 (geen effect meer)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800">Arbeidskorting (AK) 2026</h3>
          <p>Maximaal <strong>€5.685</strong>. Wordt eerst opgebouwd (verlaagt marginaal tarief), daarna afgebouwd (verhoogt marginaal tarief).</p>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="py-1.5 pr-4">Inkomen</th>
                <th className="py-1.5 pr-4">Tarief</th>
                <th className="py-1.5">Effect op marginaal tarief</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-1.5 pr-4">€0 – €11.965</td>
                <td className="py-1.5 pr-4">8,324%</td>
                <td className="py-1.5 text-green-700">−8,32% (opbouw)</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-1.5 pr-4">€11.965 – €25.845</td>
                <td className="py-1.5 pr-4">31,009%</td>
                <td className="py-1.5 text-green-700">−31,01% (opbouw)</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-1.5 pr-4">€25.845 – €45.592</td>
                <td className="py-1.5 pr-4">1,950%</td>
                <td className="py-1.5 text-green-700">−1,95% (opbouw)</td>
              </tr>
              <tr>
                <td className="py-1.5 pr-4">€45.592 – €132.920</td>
                <td className="py-1.5 pr-4">6,510%</td>
                <td className="py-1.5 text-rose-700">+6,51% (afbouw)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800">Bronnen</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <a href="https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/heffingskortingen/arbeidskorting/tabel-arbeidskorting-2026" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                Tabel arbeidskorting 2026
              </a>
            </li>
            <li>
              <a href="https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/heffingskortingen/algemene_heffingskorting/tabel-algemene-heffingskorting-2026" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                Tabel algemene heffingskorting 2026
              </a>
            </li>
            <li>
              <a href="https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/boxen_en_tarieven/overzicht_tarieven_en_schijven/u-telefonisch-contact-opnemen" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                Tarieven en heffingskortingen 2026
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800">Kanttekeningen</h3>
          <p>
            Deze berekening toont alleen de marginale druk vanuit de inkomstenbelasting (Box 1) met arbeidskorting en algemene
            heffingskorting. In de praktijk zijn er meer factoren die de effectieve marginale druk beïnvloeden:
          </p>
          <ul className="list-disc list-inside space-y-1.5">
            <li>
              <strong>Kinderbijslag / kindgebonden budget</strong> — het kindgebonden budget wordt inkomensafhankelijk
              afgebouwd, wat de effectieve marginale druk voor ouders kan verhogen.
            </li>
            <li>
              <strong>Hypotheekrenteaftrek (HRA)</strong> — hypotheekrente is aftrekbaar tegen het basistarief (35,75%).
              Dit verlaagt de totale belastingdruk maar niet het marginale tarief op extra inkomen.
            </li>
            <li>
              <strong>Zorgtoeslag / huurtoeslag</strong> — deze toeslagen worden inkomensafhankelijk afgebouwd, wat de
              effectieve marginale druk bij lagere inkomens fors kan verhogen.
            </li>
            <li>
              <strong>Inkomensafhankelijke bijdrage Zvw</strong> — werkgevers betalen deze premie, maar bij DGA's en
              zelfstandigen kan dit de marginale druk beïnvloeden.
            </li>
            <li>
              <strong>MKB-winstvrijstelling</strong> — voor ondernemers geldt een vrijstelling van 12,7% van de winst,
              waardoor het effectieve marginale tarief lager uitvalt.
            </li>
          </ul>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center mt-6">Bron: Belastingdienst 2026 · Vereenvoudigde berekening · Geen garantie</p>
    </div>
  );
}

function Card({ label, value, highlight, color, info }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className={`relative rounded-xl border p-4 ${highlight ? "bg-gray-900 text-white" : "bg-white shadow-sm"}`}>
      <div className="flex items-center justify-between mb-1">
        <p className={`text-xs ${highlight ? "text-gray-300" : "text-gray-500"}`}>{label}</p>
        {info && (
          <button
            onClick={() => setOpen(!open)}
            className={`w-4 h-4 rounded-full text-[10px] font-bold leading-none flex items-center justify-center transition-colors ${
              highlight
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
            }`}
          >
            i
          </button>
        )}
      </div>
      <p className={`text-xl font-bold ${highlight ? "" : color || "text-gray-900"}`}>{value}</p>
      {open && info && (
        <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl leading-relaxed">
          {info}
        </div>
      )}
    </div>
  );
}
