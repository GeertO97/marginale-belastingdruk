import { useState, useMemo, useRef, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts";
import { useLanguage } from "./LanguageContext.jsx";
import { useTheme } from "./ThemeContext.jsx";

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
  let bracketRate = 0;
  for (const b of TAX.brackets) {
    if (income >= b.from && income < b.to) {
      bracketRate = b.rate;
      break;
    }
  }
  if (income >= TAX.brackets[2].from) bracketRate = TAX.brackets[2].rate;

  let algemeenPhaseout = 0;
  if (income > TAX.algemeenFullUntil && income < TAX.algemeenEnd) {
    algemeenPhaseout = TAX.algemeenPhaseout;
  }

  let arbeidPhaseout = 0;
  if (income > TAX.arbeidPhaseoutStart && income < TAX.arbeidEnd) {
    arbeidPhaseout = TAX.arbeidPhaseout;
  }

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
      bracketRate: +(c.bracketRate * 100).toFixed(2),
      ahkPhaseout: +(c.algemeenPhaseout * 100).toFixed(2),
      akPhaseout: +(c.arbeidPhaseout * 100).toFixed(2),
      akBuildup: +(-c.arbeidBuildup * 100).toFixed(2),
      total: +(c.total * 100).toFixed(2),
    });
  }
  return data;
}

const formatEuro = (v, locale) => `\u20ac${Number(v).toLocaleString(locale)}`;
const formatPct = (v, locale) => `${v.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;

const COMPONENT_COLORS = {
  bracketRate: "#3b82f6",
  ahkPhaseout: "#f59e0b",
  akPhaseout: "#f43f5e",
  akBuildup: "#22c55e",
};

const TOOLTIP_KEYS = [
  { key: "bracketRate", tKey: "tooltipBracketRate" },
  { key: "ahkPhaseout", tKey: "tooltipAhkPhaseout" },
  { key: "akPhaseout", tKey: "tooltipAkPhaseout" },
  { key: "akBuildup", tKey: "tooltipAkBuildup" },
];

const LANGUAGES = [
  { code: "nl", flag: "\ud83c\uddf3\ud83c\uddf1", label: "Nederlands" },
  { code: "en", flag: "\ud83c\uddec\ud83c\udde7", label: "English" },
];

function LanguageDropdown() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = LANGUAGES.find((l) => l.code === lang);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const handleKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => { document.removeEventListener("mousedown", handleClick); document.removeEventListener("keydown", handleKey); };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="text-xs font-medium">{current.code.toUpperCase()}</span>
        <svg className="w-3 h-3 text-gray-400" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 5l3 3 3-3" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden z-20">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => { setLang(l.code); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors ${
                l.code === lang
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <span className="text-base leading-none">{l.flag}</span>
              <span>{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ThemeToggle() {
  const { dark, toggleTheme } = useTheme();
  const { t } = useLanguage();
  return (
    <button
      onClick={toggleTheme}
      className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
      aria-label={dark ? t.themeToggleLabelLight : t.themeToggleLabel}
    >
      {dark ? (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ) : (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}

function CustomTooltip({ active, payload, label }) {
  const { t } = useLanguage();
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload;
  if (!point) return null;
  const components = TOOLTIP_KEYS.filter((c) => point[c.key] !== 0);
  return (
    <div className="bg-gray-900 dark:bg-gray-950 dark:border dark:border-gray-700 text-white rounded-lg shadow-xl px-4 py-3 text-sm min-w-[180px]">
      <p className="text-gray-400 text-xs mb-2">{formatEuro(label, t.locale)}</p>
      <p className="text-2xl font-bold mb-2">{point.total.toLocaleString(t.locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%</p>
      <div className="border-t border-gray-700 pt-2 space-y-1">
        {components.map((c) => (
          <div key={c.key} className="flex justify-between gap-4">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full" style={{ background: COMPONENT_COLORS[c.key] }} />
              <span className="text-gray-300 text-xs">{t[c.tKey]}</span>
            </span>
            <span className="font-mono text-xs">{point[c.key] > 0 ? "+" : ""}{point[c.key].toLocaleString(t.locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const { t } = useLanguage();
  const { dark } = useTheme();
  const [income, setIncome] = useState(50000);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showMonthly, setShowMonthly] = useState(false);
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [includeVakantiegeld, setIncludeVakantiegeld] = useState(true);
  const chartData = useMemo(generateChartData, []);
  const comp = getMarginalComponents(income);

  const calculatedYearly = monthlyIncome
    ? Math.round(+monthlyIncome * 12 * (includeVakantiegeld ? 1.08 : 1))
    : 0;

  const handleMonthlyChange = (e) => {
    const val = e.target.value;
    setMonthlyIncome(val);
    const monthly = Math.max(0, +val);
    if (val) {
      const yearly = Math.round(monthly * 12 * (includeVakantiegeld ? 1.08 : 1));
      setIncome(yearly);
      if (!hasInteracted) setHasInteracted(true);
    }
  };

  const handleVakantiegeldChange = (e) => {
    const checked = e.target.checked;
    setIncludeVakantiegeld(checked);
    if (monthlyIncome) {
      setIncome(Math.round(+monthlyIncome * 12 * (checked ? 1.08 : 1)));
    }
  };

  const handleIncomeChange = (value) => {
    setIncome(value);
    setMonthlyIncome("");
    if (!hasInteracted) setHasInteracted(true);
  };

  const bracketLabel = income < 38883 ? t.bracket1 : income < 78426 ? t.bracket2 : t.bracket3;
  const netParts = t.netPerEuro(formatEuro(income, t.locale), (1 - comp.total).toLocaleString(t.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));

  const chartColors = {
    grid: dark ? "#334155" : "#f1f5f9",
    tick: dark ? "#64748b" : "#94a3b8",
    axis: dark ? "#475569" : "#e2e8f0",
    refLine: dark ? "#475569" : "#cbd5e1",
    refLabel: dark ? "#64748b" : "#94a3b8",
    cursor: dark ? "#64748b" : "#94a3b8",
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8 max-w-4xl mx-auto transition-colors">
      <div className="flex items-start justify-between mb-1">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t.title}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{t.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageDropdown />
        </div>
      </div>

      {/* Intro */}
      <div className="rounded-xl border border-blue-100 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 px-5 py-4 mb-6">
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          <strong className="text-gray-900 dark:text-gray-100">{t.introStrong}</strong>{" "}
          {t.introText}
        </p>
      </div>

      {/* Income input */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.grossIncome}</label>
        <div className="flex items-center gap-4 mb-3">
          <span className="text-lg font-semibold text-gray-900 dark:text-gray-100 w-36">{formatEuro(income, t.locale)}</span>
          <input
            type="range"
            min={0}
            max={150000}
            step={500}
            value={income}
            onChange={(e) => handleIncomeChange(+e.target.value)}
            className="flex-1 h-2 accent-blue-600"
          />
        </div>
        <input
          type="text"
          inputMode="numeric"
          value={Number(income).toLocaleString(t.locale)}
          onChange={(e) => {
            const raw = e.target.value.replace(/\D/g, "");
            handleIncomeChange(raw === "" ? 0 : Math.min(150000, Math.max(0, +raw)));
          }}
          className="w-36 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-1.5 text-sm"
        />

        {/* Monthly salary converter */}
        <button
          onClick={() => setShowMonthly(!showMonthly)}
          className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mt-2 flex items-center gap-1"
        >
          {t.monthlyToggle}
          <span className={`transition-transform ${showMonthly ? "rotate-90" : ""}`}>▸</span>
        </button>

        {showMonthly && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 space-y-2">
            <div className="flex items-center gap-3">
              <label className="text-xs text-gray-500 dark:text-gray-400 w-24">{t.monthlySalary}</label>
              <input
                type="number"
                min={0}
                max={50000}
                step={50}
                value={monthlyIncome}
                onChange={handleMonthlyChange}
                placeholder={t.monthlyPlaceholder}
                className="w-36 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-1.5 text-sm"
              />
            </div>
            <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={includeVakantiegeld}
                onChange={handleVakantiegeldChange}
                className="accent-blue-600"
              />
              {t.vakantiegeldLabel}
            </label>
            {monthlyIncome && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                = <strong>{formatEuro(calculatedYearly, t.locale)}</strong> {t.monthlyResultSuffix}
                {includeVakantiegeld && <span className="text-gray-400 dark:text-gray-500"> {t.monthlyVakantiegeldNote}</span>}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Net per extra euro */}
      {!hasInteracted ? (
        <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 p-5 mb-6">
          <p className="text-sm font-medium text-blue-700 dark:text-blue-300">{t.enterIncome}</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {netParts.prefix}<strong className="text-gray-900 dark:text-gray-100">{netParts.income}</strong>{netParts.middle}
            <strong className="text-green-700 dark:text-green-400">{netParts.net}</strong>{netParts.suffix}
            {comp.total > 0.495 && (
              <span className="text-amber-700 dark:text-amber-400 ml-1">{t.netPerEuroWarning}</span>
            )}
          </p>
        </div>
      )}

      {/* Result cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
        <Card label={t.marginalRate} value={formatPct(comp.total * 100, t.locale)} highlight info={t.marginalRateInfo} />
        <Card label={bracketLabel} value={formatPct(comp.bracketRate * 100, t.locale)} color="text-blue-600 dark:text-blue-400" info={t.bracketRateInfo} />
        <Card label={t.ahkPhaseout} value={formatPct(comp.algemeenPhaseout * 100, t.locale)} color="text-amber-600 dark:text-amber-400" info={t.ahkPhaseoutInfo} />
        <Card label={t.akPhaseout} value={formatPct(comp.arbeidPhaseout * 100, t.locale)} color="text-purple-600 dark:text-purple-400" info={t.akPhaseoutInfo} />
        <Card label={t.akBuildup} value={`-${formatPct(comp.arbeidBuildup * 100, t.locale)}`} color="text-green-600 dark:text-green-400" info={t.akBuildupInfo} />
        <Card
          label={t.deltaLabel}
          value={`${(comp.total - comp.bracketRate) >= 0 ? "+" : ""}${formatPct((comp.total - comp.bracketRate) * 100, t.locale)}`}
          color={(comp.total - comp.bracketRate) >= 0 ? "text-rose-600 dark:text-rose-400" : "text-green-600 dark:text-green-400"}
          info={t.deltaInfo}
          accent
        />
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">{t.chartTitle}</h2>
        <ResponsiveContainer width="100%" height={360}>
          <AreaChart data={chartData} margin={{ top: 25, right: 20, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={dark ? 0.35 : 0.25} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={dark ? 0.08 : 0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={chartColors.grid} />
            <XAxis
              dataKey="income"
              tickFormatter={(v) => `\u20ac${(v / 1000).toFixed(0)}k`}
              tick={{ fontSize: 11, fill: chartColors.tick }}
              axisLine={{ stroke: chartColors.axis }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 65]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 11, fill: chartColors.tick }}
              axisLine={false}
              tickLine={false}
              width={45}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: chartColors.cursor, strokeDasharray: "4 4" }} />
            <ReferenceLine y={49.5} stroke={chartColors.refLine} strokeDasharray="6 3" label={{ value: t.topRateLabel, position: "insideTopRight", fontSize: 10, fill: chartColors.refLabel }} />
            <ReferenceLine x={income} stroke="#3b82f6" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: formatEuro(income, t.locale), position: "top", fontSize: 10, fill: "#3b82f6", fontWeight: 600 }} />
            <Area type="stepAfter" dataKey="total" fill="url(#gradTotal)" stroke="#3b82f6" strokeWidth={2} dot={false} name={t.chartLegendTotal} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Methodology */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 text-sm text-gray-700 dark:text-gray-300 space-y-5">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t.methodologyTitle}</h2>

        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">{t.howItWorksTitle}</h3>
          <p>
            {t.howItWorksP1.split("dT/dY").map((part, i, arr) =>
              i < arr.length - 1 ? <span key={i}>{part}<em>dT/dY</em></span> : <span key={i}>{part}</span>
            )}
          </p>
          <p>{t.howItWorksP2}</p>
          <p className="font-mono text-xs bg-gray-50 dark:bg-gray-900 rounded p-2">{t.formula}</p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">{t.bracketsTitle}</h3>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-600 text-left">
                <th className="py-1.5 pr-4">{t.thBracket}</th>
                <th className="py-1.5 pr-4">{t.thFrom}</th>
                <th className="py-1.5 pr-4">{t.thTo}</th>
                <th className="py-1.5">{t.thRate}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <td className="py-1.5 pr-4">1</td>
                <td className="py-1.5 pr-4">{formatEuro(0, t.locale)}</td>
                <td className="py-1.5 pr-4">{formatEuro(38883, t.locale)}</td>
                <td className="py-1.5">{t.bracketRate1}</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <td className="py-1.5 pr-4">2</td>
                <td className="py-1.5 pr-4">{formatEuro(38883, t.locale)}</td>
                <td className="py-1.5 pr-4">{formatEuro(78426, t.locale)}</td>
                <td className="py-1.5">{t.bracketRate2}</td>
              </tr>
              <tr>
                <td className="py-1.5 pr-4">3</td>
                <td className="py-1.5 pr-4">{formatEuro(78426, t.locale)}</td>
                <td className="py-1.5 pr-4">-</td>
                <td className="py-1.5">{t.bracketRate3}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">{t.ahkTitle}</h3>
          <p>{t.ahkDescription}</p>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-600 text-left">
                <th className="py-1.5 pr-4">{t.thIncome}</th>
                <th className="py-1.5">{t.thEffect}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <td className="py-1.5 pr-4">{t.ahkRow1Income}</td>
                <td className="py-1.5">{t.ahkRow1Effect}</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <td className="py-1.5 pr-4">{t.ahkRow2Income}</td>
                <td className="py-1.5">{t.ahkRow2Effect}</td>
              </tr>
              <tr>
                <td className="py-1.5 pr-4">{t.ahkRow3Income}</td>
                <td className="py-1.5">{t.ahkRow3Effect}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">{t.akTitle}</h3>
          <p>{t.akDescription}</p>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-600 text-left">
                <th className="py-1.5 pr-4">{t.thIncome}</th>
                <th className="py-1.5 pr-4">{t.thRate}</th>
                <th className="py-1.5">{t.thEffectOnMarginal}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <td className="py-1.5 pr-4">{t.akRow1Income}</td>
                <td className="py-1.5 pr-4">{t.akRow1Rate}</td>
                <td className="py-1.5 text-green-700 dark:text-green-400">{t.akRow1Effect}</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <td className="py-1.5 pr-4">{t.akRow2Income}</td>
                <td className="py-1.5 pr-4">{t.akRow2Rate}</td>
                <td className="py-1.5 text-green-700 dark:text-green-400">{t.akRow2Effect}</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <td className="py-1.5 pr-4">{t.akRow3Income}</td>
                <td className="py-1.5 pr-4">{t.akRow3Rate}</td>
                <td className="py-1.5 text-green-700 dark:text-green-400">{t.akRow3Effect}</td>
              </tr>
              <tr>
                <td className="py-1.5 pr-4">{t.akRow4Income}</td>
                <td className="py-1.5 pr-4">{t.akRow4Rate}</td>
                <td className="py-1.5 text-rose-700 dark:text-rose-400">{t.akRow4Effect}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">{t.sourcesTitle}</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <a href="https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/heffingskortingen/arbeidskorting/tabel-arbeidskorting-2026" className="text-blue-600 dark:text-blue-400 underline" target="_blank" rel="noopener noreferrer">
                {t.source1}
              </a>
            </li>
            <li>
              <a href="https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/heffingskortingen/algemene_heffingskorting/tabel-algemene-heffingskorting-2026" className="text-blue-600 dark:text-blue-400 underline" target="_blank" rel="noopener noreferrer">
                {t.source2}
              </a>
            </li>
            <li>
              <a href="https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/boxen_en_tarieven/overzicht_tarieven_en_schijven/u-telefonisch-contact-opnemen" className="text-blue-600 dark:text-blue-400 underline" target="_blank" rel="noopener noreferrer">
                {t.source3}
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">{t.caveatsTitle}</h3>
          <p>{t.caveatsIntro}</p>
          <ul className="list-disc list-inside space-y-1.5">
            <li><strong>{t.caveat1Title}</strong> — {t.caveat1Text}</li>
            <li><strong>{t.caveat2Title}</strong> — {t.caveat2Text}</li>
            <li><strong>{t.caveat3Title}</strong> — {t.caveat3Text}</li>
            <li><strong>{t.caveat4Title}</strong> — {t.caveat4Text}</li>
            <li><strong>{t.caveat5Title}</strong> — {t.caveat5Text}</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">{t.faqTitle}</h3>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              {t.faqPrivacyQ}
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">{t.faqPrivacyA}</p>
          </details>
        </div>
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-6">
        {t.footerSource}<a href="https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/" className="underline hover:text-gray-500 dark:hover:text-gray-400" target="_blank" rel="noopener noreferrer">{t.footerSourceLink}</a>{t.footerDisclaimer}
      </p>
    </div>
  );
}

function Card({ label, value, highlight, accent, color, info }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const handleKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => { document.removeEventListener("mousedown", handleClick); document.removeEventListener("keydown", handleKey); };
  }, [open]);

  const bg = highlight
    ? "bg-gray-900 dark:bg-gray-950 text-white border-gray-800 dark:border-gray-700"
    : accent
      ? "bg-gray-100 dark:bg-gray-700 shadow-sm border-gray-200 dark:border-gray-500"
      : "bg-white dark:bg-gray-800 shadow-sm border-gray-200 dark:border-gray-700";

  return (
    <div ref={ref} className={`relative rounded-xl border p-4 ${bg}`}>
      <div className="flex items-center justify-between mb-1">
        <p className={`text-xs ${highlight ? "text-gray-300" : "text-gray-500 dark:text-gray-400"}`}>{label}</p>
        {info && (
          <button
            onClick={() => setOpen(!open)}
            aria-label={t.infoButtonLabel}
            aria-expanded={open}
            className={`w-4 h-4 rounded-full text-[10px] font-bold leading-none flex items-center justify-center transition-colors ${
              highlight
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            i
          </button>
        )}
      </div>
      <p className={`text-xl font-bold ${highlight ? "" : color || "text-gray-900 dark:text-gray-100"}`}>{value}</p>
      {open && info && (
        <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-gray-900 dark:bg-gray-950 dark:border dark:border-gray-700 text-white text-xs rounded-lg p-3 shadow-xl leading-relaxed">
          {info}
        </div>
      )}
    </div>
  );
}
