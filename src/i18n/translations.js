export const translations = {
  nl: {
    locale: "nl-NL",
    langCode: "nl",
    pageTitle: "Marginale belastingdruk 2026",

    // Header
    title: "Marginale belastingdruk 2026",
    subtitle: "Nederland \u00b7 Box 1 \u00b7 onder AOW-leeftijd",

    // Income input
    grossIncome: "Bruto jaarinkomen",

    // Card labels
    marginalRate: "Marginaal tarief",
    bracket1: "Schijf 1",
    bracket2: "Schijf 2",
    bracket3: "Schijf 3",
    ahkPhaseout: "Afbouw AHK",
    akPhaseout: "Afbouw AK",
    akBuildup: "Opbouw AK",

    // Card info tooltips
    marginalRateInfo:
      "Het totale percentage belasting dat je betaalt over je laatstverdiende euro. Dit is de som van het schijftarief, plus afbouw van kortingen, minus opbouw van kortingen.",
    bracketRateInfo:
      "Het basistarief van de inkomstenbelasting in jouw schijf. Nederland kent 3 schijven: 35,75% (tot \u20ac38.883), 37,56% (tot \u20ac78.426) en 49,50% (daarboven).",
    ahkPhaseoutInfo:
      "Algemene Heffingskorting \u2014 een belastingkorting die iedereen krijgt (max \u20ac3.115). Boven \u20ac29.736 wordt deze afgebouwd: per extra euro verdienen verlies je 6,4 cent korting, wat je marginale tarief met 6,4% verhoogt.",
    akPhaseoutInfo:
      "Arbeidskorting \u2014 een belastingkorting voor werkenden (max \u20ac5.685). Boven \u20ac45.592 wordt deze afgebouwd: per extra euro verlies je 6,5 cent korting, wat je marginale tarief met 6,5% verhoogt.",
    akBuildupInfo:
      "Tot \u20ac45.592 wordt de arbeidskorting opgebouwd: per extra euro verdienen krijg je meer korting, wat je marginale tarief verlaagt. Het sterkste effect is tussen \u20ac11.965\u2013\u20ac25.845 (\u221231%).",

    // Chart
    chartTitle: "Marginale belastingdruk per inkomensniveau",
    topRateLabel: "Toptarief 49,5%",
    chartLegendTotal: "Marginaal tarief",

    // Chart tooltip component labels
    tooltipBracketRate: "Schijftarief",
    tooltipAhkPhaseout: "Afbouw AHK",
    tooltipAkPhaseout: "Afbouw AK",
    tooltipAkBuildup: "Opbouw AK",

    // Net per euro section
    netPerEuro: (income, netAmount) => ({
      prefix: "Bij een inkomen van ",
      income,
      middle: " houd je van elke extra euro bruto nog ",
      net: `\u20ac${netAmount}`,
      suffix: " netto over.",
    }),
    netPerEuroWarning:
      "Dat is minder dan bij het toptarief van 49,50% \u2014 door de afbouw van heffingskortingen.",

    // Methodology section
    methodologyTitle: "Verantwoording & methodologie",
    howItWorksTitle: "Hoe werkt het?",
    howItWorksP1:
      "De marginale belastingdruk is het percentage belasting dat je betaalt over je laatst verdiende euro. Dit is niet hetzelfde als je gemiddelde belastingdruk (effectief tarief). Wiskundig is het de afgeleide van de totale belastingfunctie naar het inkomen: dT/dY.",
    howItWorksP2:
      "Het effectieve marginale tarief bestaat uit het schijftarief, plus de afbouw van heffingskortingen (die het tarief verhogen), minus de opbouw van heffingskortingen (die het tarief verlagen):",
    formula: "Marginaal tarief = Schijftarief + Afbouw AHK + Afbouw AK \u2212 Opbouw AK",

    // Tax brackets table
    bracketsTitle: "Schijftarieven 2026",
    thBracket: "Schijf",
    thFrom: "Van",
    thTo: "Tot",
    thRate: "Tarief",

    // AHK table
    ahkTitle: "Algemene heffingskorting (AHK) 2026",
    ahkDescription:
      "Maximaal \u20ac3.115. Wordt afgebouwd met 6,398% van het inkomen boven \u20ac29.736, tot \u20ac0 bij \u20ac78.426.",
    thIncome: "Inkomen",
    thEffect: "Effect",
    ahkRow1Income: "t/m \u20ac29.736",
    ahkRow1Effect: "Volledig: \u20ac3.115",
    ahkRow2Income: "\u20ac29.736 \u2013 \u20ac78.426",
    ahkRow2Effect:
      "Afbouw: \u22126,398% per extra euro (verhoogt marginaal tarief)",
    ahkRow3Income: "Boven \u20ac78.426",
    ahkRow3Effect: "\u20ac0 (geen effect meer)",

    // AK table
    akTitle: "Arbeidskorting (AK) 2026",
    akDescription:
      "Maximaal \u20ac5.685. Wordt eerst opgebouwd (verlaagt marginaal tarief), daarna afgebouwd (verhoogt marginaal tarief).",
    thEffectOnMarginal: "Effect op marginaal tarief",
    akRow1Income: "\u20ac0 \u2013 \u20ac11.965",
    akRow1Rate: "8,324%",
    akRow1Effect: "\u22128,32% (opbouw)",
    akRow2Income: "\u20ac11.965 \u2013 \u20ac25.845",
    akRow2Rate: "31,009%",
    akRow2Effect: "\u221231,01% (opbouw)",
    akRow3Income: "\u20ac25.845 \u2013 \u20ac45.592",
    akRow3Rate: "1,950%",
    akRow3Effect: "\u22121,95% (opbouw)",
    akRow4Income: "\u20ac45.592 \u2013 \u20ac132.920",
    akRow4Rate: "6,510%",
    akRow4Effect: "+6,51% (afbouw)",

    // Sources
    sourcesTitle: "Bronnen",
    source1: "Tabel arbeidskorting 2026",
    source2: "Tabel algemene heffingskorting 2026",
    source3: "Tarieven en heffingskortingen 2026",

    // Caveats
    caveatsTitle: "Kanttekeningen",
    caveatsIntro:
      "Deze berekening toont alleen de marginale druk vanuit de inkomstenbelasting (Box 1) met arbeidskorting en algemene heffingskorting. In de praktijk zijn er meer factoren die de effectieve marginale druk be\u00efnvloeden:",
    caveat1Title: "Kinderbijslag / kindgebonden budget",
    caveat1Text:
      "het kindgebonden budget wordt inkomensafhankelijk afgebouwd, wat de effectieve marginale druk voor ouders kan verhogen.",
    caveat2Title: "Hypotheekrenteaftrek (HRA)",
    caveat2Text:
      "hypotheekrente is aftrekbaar tegen het basistarief (35,75%). Dit verlaagt de totale belastingdruk maar niet het marginale tarief op extra inkomen.",
    caveat3Title: "Zorgtoeslag / huurtoeslag",
    caveat3Text:
      "deze toeslagen worden inkomensafhankelijk afgebouwd, wat de effectieve marginale druk bij lagere inkomens fors kan verhogen.",
    caveat4Title: "Inkomensafhankelijke bijdrage Zvw",
    caveat4Text:
      "werkgevers betalen deze premie, maar bij DGA\u2019s en zelfstandigen kan dit de marginale druk be\u00efnvloeden.",
    caveat5Title: "MKB-winstvrijstelling",
    caveat5Text:
      "voor ondernemers geldt een vrijstelling van 12,7% van de winst, waardoor het effectieve marginale tarief lager uitvalt.",

    // Income placeholder
    enterIncome: "Vul je inkomen in om je marginale belastingdruk te berekenen",

    // FAQ
    faqTitle: "Veelgestelde vragen",
    faqPrivacyQ: "Worden mijn gegevens opgeslagen of verwerkt?",
    faqPrivacyA: "Nee. Alle berekeningen worden volledig in je browser uitgevoerd. Er worden geen gegevens naar een server gestuurd, opgeslagen of op enige wijze verwerkt. Deze tool heeft geen backend.",

    // Footer
    footerSource: "Bron: ",
    footerSourceLink: "Belastingdienst",
    footerDisclaimer: " 2026 \u00b7 Vereenvoudigde berekening \u00b7 Geen garantie",
  },

  en: {
    locale: "en-US",
    langCode: "en",
    pageTitle: "Marginal Tax Rate 2026",

    // Header
    title: "Marginal Tax Rate 2026",
    subtitle: "Netherlands \u00b7 Box 1 \u00b7 below state pension age",

    // Income input
    grossIncome: "Gross annual income",

    // Card labels
    marginalRate: "Marginal rate",
    bracket1: "Bracket 1",
    bracket2: "Bracket 2",
    bracket3: "Bracket 3",
    ahkPhaseout: "GTC phaseout",
    akPhaseout: "EPTC phaseout",
    akBuildup: "EPTC buildup",

    // Card info tooltips
    marginalRateInfo:
      "The total tax percentage on your last euro earned. This is the sum of the bracket rate, plus phaseout of tax credits, minus buildup of tax credits.",
    bracketRateInfo:
      "The base income tax rate in your bracket. The Netherlands has 3 brackets: 35.75% (up to \u20ac38,883), 37.56% (up to \u20ac78,426) and 49.50% (above).",
    ahkPhaseoutInfo:
      "General Tax Credit \u2014 a credit everyone receives (max \u20ac3,115). Above \u20ac29,736 it phases out: for every extra euro earned you lose 6.4 cents of credit, raising your marginal rate by 6.4%.",
    akPhaseoutInfo:
      "Employed Person\u2019s Tax Credit \u2014 a credit for workers (max \u20ac5,685). Above \u20ac45,592 it phases out: for every extra euro you lose 6.5 cents of credit, raising your marginal rate by 6.5%.",
    akBuildupInfo:
      "Up to \u20ac45,592 the Employed Person\u2019s Tax Credit builds up: every extra euro earned gives you more credit, lowering your marginal rate. The strongest effect is between \u20ac11,965\u2013\u20ac25,845 (\u221231%).",

    // Chart
    chartTitle: "Marginal tax rate by income level",
    topRateLabel: "Top rate 49.5%",
    chartLegendTotal: "Marginal rate",

    // Chart tooltip component labels
    tooltipBracketRate: "Bracket rate",
    tooltipAhkPhaseout: "GTC phaseout",
    tooltipAkPhaseout: "EPTC phaseout",
    tooltipAkBuildup: "EPTC buildup",

    // Net per euro section
    netPerEuro: (income, netAmount) => ({
      prefix: "At an income of ",
      income,
      middle: ", each extra gross euro leaves you with ",
      net: `\u20ac${netAmount}`,
      suffix: " net.",
    }),
    netPerEuroWarning:
      "That is less than at the top rate of 49.50% \u2014 due to the phaseout of tax credits.",

    // Methodology section
    methodologyTitle: "Methodology & sources",
    howItWorksTitle: "How does it work?",
    howItWorksP1:
      "The marginal tax rate is the percentage of tax you pay on your last euro earned. This is not the same as your average tax rate (effective rate). Mathematically it is the derivative of the total tax function with respect to income: dT/dY.",
    howItWorksP2:
      "The effective marginal rate consists of the bracket rate, plus the phaseout of tax credits (which raises the rate), minus the buildup of tax credits (which lowers the rate):",
    formula:
      "Marginal rate = Bracket rate + GTC phaseout + EPTC phaseout \u2212 EPTC buildup",

    // Tax brackets table
    bracketsTitle: "Tax brackets 2026",
    thBracket: "Bracket",
    thFrom: "From",
    thTo: "To",
    thRate: "Rate",

    // AHK table
    ahkTitle: "General Tax Credit (GTC) 2026",
    ahkDescription:
      "Maximum \u20ac3,115. Phases out at 6.398% of income above \u20ac29,736, reaching \u20ac0 at \u20ac78,426.",
    thIncome: "Income",
    thEffect: "Effect",
    ahkRow1Income: "up to \u20ac29,736",
    ahkRow1Effect: "Full: \u20ac3,115",
    ahkRow2Income: "\u20ac29,736 \u2013 \u20ac78,426",
    ahkRow2Effect:
      "Phaseout: \u22126.398% per extra euro (raises marginal rate)",
    ahkRow3Income: "Above \u20ac78,426",
    ahkRow3Effect: "\u20ac0 (no further effect)",

    // AK table
    akTitle: "Employed Person\u2019s Tax Credit (EPTC) 2026",
    akDescription:
      "Maximum \u20ac5,685. First builds up (lowers marginal rate), then phases out (raises marginal rate).",
    thEffectOnMarginal: "Effect on marginal rate",
    akRow1Income: "\u20ac0 \u2013 \u20ac11,965",
    akRow1Rate: "8.324%",
    akRow1Effect: "\u22128.32% (buildup)",
    akRow2Income: "\u20ac11,965 \u2013 \u20ac25,845",
    akRow2Rate: "31.009%",
    akRow2Effect: "\u221231.01% (buildup)",
    akRow3Income: "\u20ac25,845 \u2013 \u20ac45,592",
    akRow3Rate: "1.950%",
    akRow3Effect: "\u22121.95% (buildup)",
    akRow4Income: "\u20ac45,592 \u2013 \u20ac132,920",
    akRow4Rate: "6.510%",
    akRow4Effect: "+6.51% (phaseout)",

    // Sources
    sourcesTitle: "Sources",
    source1: "Employment tax credit table 2026",
    source2: "General tax credit table 2026",
    source3: "Rates and tax credits 2026",

    // Caveats
    caveatsTitle: "Caveats",
    caveatsIntro:
      "This calculation only shows the marginal burden from income tax (Box 1) with the employment tax credit and general tax credit. In practice, more factors affect the effective marginal burden:",
    caveat1Title: "Child benefit / child-related budget",
    caveat1Text:
      "the child-related budget is phased out based on income, which can raise the effective marginal burden for parents.",
    caveat2Title: "Mortgage interest deduction",
    caveat2Text:
      "mortgage interest is deductible at the base rate (35.75%). This lowers the total tax burden but not the marginal rate on extra income.",
    caveat3Title: "Healthcare / housing allowance",
    caveat3Text:
      "these allowances are phased out based on income, which can substantially raise the effective marginal burden at lower incomes.",
    caveat4Title: "Income-dependent healthcare contribution (Zvw)",
    caveat4Text:
      "employers pay this premium, but for director-shareholders and self-employed it can affect the marginal burden.",
    caveat5Title: "SME profit exemption",
    caveat5Text:
      "entrepreneurs receive a 12.7% profit exemption, which effectively lowers the marginal rate.",

    // Income placeholder
    enterIncome: "Enter your income to calculate your marginal tax rate",

    // FAQ
    faqTitle: "Frequently asked questions",
    faqPrivacyQ: "Is my data stored or processed?",
    faqPrivacyA: "No. All calculations run entirely in your browser. No data is sent to a server, stored, or processed in any way. This tool has no backend.",

    // Footer
    footerSource: "Source: ",
    footerSourceLink: "Belastingdienst",
    footerDisclaimer: " 2026 \u00b7 Simplified calculation \u00b7 No guarantee",
  },
};
