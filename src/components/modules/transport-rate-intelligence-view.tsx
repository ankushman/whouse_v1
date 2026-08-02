"use client";
import { useState } from "react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#0891b2", "#06b6d4", "#22d3ee", "#67e8f9", "#0e7490", "#155e75", "#164e63", "#cffafe"];
const CORRIDORS = ["Mumbai\u2013Delhi NH8", "Delhi\u2013Chennai NH44", "Bangalore\u2013Hyderabad NH44", "Kolkata\u2013Mumbai NH6", "Chennai\u2013Kolkata NH16", "Delhi\u2013Kolkata NH19", "Mumbai\u2013Bangalore NH48", "Pune\u2013Ahmedabad NH48"];
const VEHICLE_TYPES = ["20ft Container", "40ft Container", "Open Truck 20T", "Flatbed Trailer", "Reefer Truck", "Tanker 16KL", "LCV 3.5T", "Multi-Axle 40T"];
const RATE_TYPE = ["Spot FTL", "Contract FTL", "Spot PTL", "Contract PTL", "Express Air", "Rail Freight"];
const TREND = ["Surging", "Stable", "Dropping", "Volatile", "Seasonal Peak", "Seasonal Low"];
const TABS = ["Dashboard", "Rate Benchmarks", "Market Trends", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", cyan: "bg-cyan-100 text-cyan-700", teal: "bg-teal-100 text-teal-700", slate: "bg-slate-100 text-slate-700" };
const trendColor: Record<string, string> = { Surging: "red", Stable: "green", Dropping: "cyan", Volatile: "amber", "Seasonal Peak": "red", "Seasonal Low": "teal" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlySpot = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], spot: ri(28, 58, 38 + Math.sin(i * 0.8) * 12), contract: ri(24, 48, 32 + Math.cos(i * 0.6) * 8), rail: ri(18, 32, 22 + Math.sin(i * 0.4) * 6) }));
const corridorComp = CORRIDORS.map(c => ({ c, spot: +(ri(32, 62, 42 + Math.random() * 16)).toFixed(1), contract: +(ri(26, 48, 34 + Math.random() * 10)).toFixed(1), rail: +(ri(18, 30, 22 + Math.random() * 6)).toFixed(1) }));
const typeShare = RATE_TYPE.map((t, i) => ({ n: t, v: ri(8, 35, 20 - i * 2.5) }));
const fuelImpact = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], diesel: ri(85, 105, 92 + Math.sin(i * 0.9) * 8), rateIndex: ri(94, 118, 104 + Math.cos(i * 0.7) * 10) }));
const regionDist = [{ n: "North India", v: 28 }, { n: "South India", v: 24 }, { n: "West India", v: 22 }, { n: "East India", v: 14 }, { n: "Central India", v: 12 }];

interface RateRecord { id: string; corridor: string; vehicleType: string; rateType: string; trend: string; spotRate: number; contractRate: number; delta: number; volumeTonnage: number; avgTransitHrs: number; fuelSurcharge: number; tollCost: number; driverCost: number; allInCost: number; region: string; effectiveDate: string; source: string; }

const records: RateRecord[] = [
  { id: "TRI-0001", corridor: "Mumbai\u2013Delhi NH8", vehicleType: "20ft Container", rateType: "Spot FTL", trend: "Surging", spotRate: 42.5, contractRate: 36.8, delta: 15.5, volumeTonnage: 1850, avgTransitHrs: 28, fuelSurcharge: 4200, tollCost: 3100, driverCost: 5600, allInCost: 62500, region: "West-North", effectiveDate: "2025-01-15", source: "BlackBuck" },
  { id: "TRI-0002", corridor: "Delhi\u2013Chennai NH44", vehicleType: "40ft Container", rateType: "Contract FTL", trend: "Stable", spotRate: 38.2, contractRate: 34.5, delta: 10.7, volumeTonnage: 2200, avgTransitHrs: 42, fuelSurcharge: 6800, tollCost: 5200, driverCost: 8400, allInCost: 85600, region: "North-South", effectiveDate: "2025-01-15", source: "Rivigo" },
  { id: "TRI-0003", corridor: "Bangalore\u2013Hyderabad NH44", vehicleType: "Open Truck 20T", rateType: "Spot PTL", trend: "Dropping", spotRate: 28.6, contractRate: 24.2, delta: 18.2, volumeTonnage: 680, avgTransitHrs: 10, fuelSurcharge: 1200, tollCost: 800, driverCost: 2200, allInCost: 18500, region: "South", effectiveDate: "2025-01-15", source: "Delhivery" },
  { id: "TRI-0004", corridor: "Kolkata\u2013Mumbai NH6", vehicleType: "Flatbed Trailer", rateType: "Spot FTL", trend: "Volatile", spotRate: 52.1, contractRate: 44.8, delta: 16.3, volumeTonnage: 920, avgTransitHrs: 36, fuelSurcharge: 7800, tollCost: 4800, driverCost: 7200, allInCost: 88200, region: "East-West", effectiveDate: "2025-01-15", source: "TCI Express" },
  { id: "TRI-0005", corridor: "Chennai\u2013Kolkata NH16", vehicleType: "Reefer Truck", rateType: "Contract FTL", trend: "Seasonal Peak", spotRate: 58.4, contractRate: 52.6, delta: 11.0, volumeTonnage: 540, avgTransitHrs: 26, fuelSurcharge: 5200, tollCost: 3600, driverCost: 6200, allInCost: 78500, region: "South-East", effectiveDate: "2025-01-15", source: "ColdStar" },
  { id: "TRI-0006", corridor: "Delhi\u2013Kolkata NH19", vehicleType: "Multi-Axle 40T", rateType: "Spot FTL", trend: "Stable", spotRate: 34.8, contractRate: 30.2, delta: 15.2, volumeTonnage: 1600, avgTransitHrs: 32, fuelSurcharge: 5400, tollCost: 4200, driverCost: 6800, allInCost: 57800, region: "North-East", effectiveDate: "2025-01-15", source: "BlueDart" },
  { id: "TRI-0007", corridor: "Mumbai\u2013Bangalore NH48", vehicleType: "LCV 3.5T", rateType: "Contract PTL", trend: "Seasonal Low", spotRate: 22.4, contractRate: 19.8, delta: 13.1, volumeTonnage: 320, avgTransitHrs: 18, fuelSurcharge: 2800, tollCost: 2200, driverCost: 3600, allInCost: 24800, region: "West-South", effectiveDate: "2025-01-15", source: "XpressBees" },
  { id: "TRI-0008", corridor: "Pune\u2013Ahmedabad NH48", vehicleType: "Tanker 16KL", rateType: "Spot FTL", trend: "Surging", spotRate: 48.6, contractRate: 42.4, delta: 14.6, volumeTonnage: 780, avgTransitHrs: 14, fuelSurcharge: 3200, tollCost: 2600, driverCost: 4800, allInCost: 42600, region: "West", effectiveDate: "2025-01-15", source: "Adani Logistics" },
  { id: "TRI-0009", corridor: "Mumbai\u2013Delhi NH8", vehicleType: "40ft Container", rateType: "Rail Freight", trend: "Stable", spotRate: 24.8, contractRate: 21.6, delta: 14.8, volumeTonnage: 2800, avgTransitHrs: 18, fuelSurcharge: 0, tollCost: 0, driverCost: 0, allInCost: 35200, region: "West-North", effectiveDate: "2025-01-15", source: "Indian Railways" },
  { id: "TRI-0010", corridor: "Delhi\u2013Chennai NH44", vehicleType: "Reefer Truck", rateType: "Spot FTL", trend: "Volatile", spotRate: 55.2, contractRate: 48.8, delta: 13.1, volumeTonnage: 460, avgTransitHrs: 44, fuelSurcharge: 8200, tollCost: 5800, driverCost: 9200, allInCost: 96800, region: "North-South", effectiveDate: "2025-01-15", source: "Snowman" },
  { id: "TRI-0011", corridor: "Bangalore\u2013Hyderabad NH44", vehicleType: "20ft Container", rateType: "Contract FTL", trend: "Dropping", spotRate: 32.4, contractRate: 28.6, delta: 13.3, volumeTonnage: 1100, avgTransitHrs: 12, fuelSurcharge: 2400, tollCost: 1600, driverCost: 3200, allInCost: 28400, region: "South", effectiveDate: "2025-01-15", source: "VRL Logistics" },
  { id: "TRI-0012", corridor: "Kolkata\u2013Mumbai NH6", vehicleType: "Open Truck 20T", rateType: "Express Air", trend: "Seasonal Peak", spotRate: 125.0, contractRate: 108.5, delta: 15.2, volumeTonnage: 85, avgTransitHrs: 4, fuelSurcharge: 0, tollCost: 0, driverCost: 0, allInCost: 31200, region: "East-West", effectiveDate: "2025-01-15", source: "BlueDart Air" },
  { id: "TRI-0013", corridor: "Chennai\u2013Kolkata NH16", vehicleType: "Multi-Axle 40T", rateType: "Spot FTL", trend: "Surging", spotRate: 46.8, contractRate: 40.2, delta: 16.4, volumeTonnage: 1300, avgTransitHrs: 28, fuelSurcharge: 5800, tollCost: 3800, driverCost: 6400, allInCost: 68200, region: "South-East", effectiveDate: "2025-01-15", source: "Gati" },
  { id: "TRI-0014", corridor: "Delhi\u2013Kolkata NH19", vehicleType: "Flatbed Trailer", rateType: "Contract PTL", trend: "Stable", spotRate: 38.4, contractRate: 33.6, delta: 14.3, volumeTonnage: 750, avgTransitHrs: 30, fuelSurcharge: 4800, tollCost: 3600, driverCost: 5800, allInCost: 52400, region: "North-East", effectiveDate: "2025-01-15", source: "Shadowfax" },
];

const surgingCount = records.filter(r => r.trend === "Surging" || r.trend === "Seasonal Peak").length;
const avgDelta = (records.reduce((s, r) => s + r.delta, 0) / records.length).toFixed(1);
const totalVol = records.reduce((s, r) => s + r.volumeTonnage, 0);
const avgAllIn = records.reduce((s, r) => s + r.allInCost, 0) / records.length;
const kpis = [
  { l: "Surging Corridors", v: surgingCount, s: "need rate renegotiation" },
  { l: "Avg Spot\u2013Contract Delta", v: `${avgDelta}%`, s: "above contract benchmark" },
  { l: "Total Volume Tracked", v: `${(totalVol / 1000).toFixed(1)}K tonnes`, s: "across 8 corridors" },
  { l: "Avg All-In Cost", v: `\u20b9${(avgAllIn / 1000).toFixed(1)}K`, s: "fuel+toll+driver included" },
];

const INSIGHTS = [
  {
    t: "Diesel Price Ripple Effect on NH8",
    c: "The Mumbai\u2013Delhi NH8 corridor, India\u2019s highest-volume freight route at 1,420 km with over 18,000 daily truck movements, exhibits an almost perfect 0.87 correlation between diesel retail price fluctuations and spot FTL rate adjustments within a 48-hour lag window. When diesel prices in Maharashtra rise by \u20b92-3 per liter (typical monthly variation), spot rates for 20ft container movements increase by \u20b90.8-1.2 per km within 2 days as fleet operators pass through fuel costs. However, the pass-through asymmetry is notable: rate increases materialize rapidly (24-48 hours) while decreases during fuel price dips take 7-10 days to reflect, creating a systematic \u20b90.4-0.6 per km premium bias favoring carriers. The October 2024 diesel price surge to \u20b990.27 per liter in Delhi triggered a cascading 18% spot rate increase across the corridor, while the subsequent January 2025 correction to \u20b976.34 saw only an 11% rate reduction. Logistics managers leveraging this asymmetric pattern by locking in contract rates during correction periods can capture 8-12% cost advantages over the annual average.",
  },
  {
    t: "Rail Freight Competitiveness Surge",
    c: "Indian Railways\u2019 dedicated freight corridor (DFC) network, covering 3,306 route km on the Western (JNPT to Dadri) and Eastern (Ludhiana to Sonn Nagar) corridors, has fundamentally shifted the surface freight cost structure for corridor distances exceeding 800 km. Rail freight on the Mumbai\u2013Delhi route now costs \u20b921.6-24.8 per tonne-km compared to road\u2019s \u20b934-42.5, a 38-52% cost advantage. The DFC\u2019s double-stack container operations, 100 km/h running speed, and 1,500-metre-long train configurations enable movement of 3,000-4,500 tonnes per train, equivalent to 120-180 truck trips. Transit time differential has narrowed from 5-7 days to just 12-18 hours longer than road, making rail viable for time-sensitive supply chains. Key enablers include private freight terminal operators (PFTOs) offering last-mile connectivity, CONCOR\u2019s guaranteed transit time products, and the rapid adoption of road\u2013rail multimodal logistics parks at Pragyaraj, Ahmedabad, and Tumbdi near JNPT. Companies shifting 30-40% of corridor volumes to rail report 22-28% reduction in freight expenditure with manageable service level adjustments.",
  },
  {
    t: "E-Way Bill Data as Rate Oracle",
    c: "India\u2019s GST e-way bill system, processing 22-26 lakh electronic waybills daily across 1.4 crore GST-registered transporters, has emerged as the most comprehensive freight rate oracle in the developing world. By anonymizing and aggregating e-way bill data from major origin-destination pairs, rate intelligence platforms can construct real-time spot rate indices with 92% accuracy compared to actual transaction prices. The data encompasses vehicle type, commodity classification (HSN code), consignment weight, actual transit times, and distance calculations based on PIN code-to-PIN code mapping. Machine learning models trained on 36 months of e-way bill historical data (covering 240+ crore individual bill records) can now predict corridor-level rate movements 7-14 days ahead with 78% directional accuracy. For logistics managers, this means moving from reactive spot procurement to predictive rate hedging, locking in favorable rates before market surges, and benchmarking carrier quotes against market indices in real-time. The next frontier involves integrating FASTag toll data, Vahan vehicle registration analytics, and Sarathi driver license databases for holistic supply chain intelligence.",
  },
  {
    t: "Express Air Rate Arbitrage",
    c: "The express air freight segment on India\u2019s top 20 domestic routes commands rates of \u20b985-145 per kg compared to \u20b93.5-8.5 per kg for surface FTL, a 12-20x premium that creates significant arbitrage opportunities for time-critical shipments below 500 kg. The Kolkata\u2013Mumbai air corridor at \u20b9125/kg for same-day delivery versus 4-hour surface transit at \u20b96.2/kg presents the steepest premium ratio in the network, primarily driven by pharma vaccine distribution and semiconductor component fulfillment. However, hybrid air-surface models using the first available morning flight for long-haul legs combined with dedicated surface delivery for last-mile are capturing 15-22% cost savings while maintaining 95%+ on-time performance. The emergence of dedicated cargo terminals at Tier-2 airports (Jaipur, Coimbatore, Bhubaneswar) and India Post\u2019s air cargo network expansion is democratizing access to express air capacity, reducing minimum weight thresholds from 100 kg to 25 kg and enabling SME participation in time-definite logistics.",
  },
];

export default function TransportRateIntelligenceView() {
  const [tab, setTab] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const filterGroups = [
    { key: "corridor", label: "Corridor", options: CORRIDORS.map(c => ({ value: c, count: records.filter(r => r.corridor === c).length })) },
    { key: "vehicleType", label: "Vehicle", options: VEHICLE_TYPES.map(v => ({ value: v, count: records.filter(r => r.vehicleType === v).length })) },
    { key: "rateType", label: "Rate Type", options: RATE_TYPE.map(t => ({ value: t, count: records.filter(r => r.rateType === t).length })) },
    { key: "trend", label: "Trend", options: TREND.map(t => ({ value: t, count: records.filter(r => r.trend === t).length })) },
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.corridor.toLowerCase().includes(q) && !r.source.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(
      ([k, vs]) => vs.includes(r[k as keyof RateRecord] as string)
    );
  });

  const maxSpot = Math.max(...records.map(r => r.spotRate));

  return (
    <div className="tri-root p-6 space-y-6">
      <PageHeader
        title="Transport Rate Intelligence"
        description="Real-time freight rate benchmarking, spot vs contract analytics, and corridor cost intelligence"
      />
      <div className="tri-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`tri-tab px-4 py-2 text-sm font-medium rounded-t ${
              tab === i ? "bg-cyan-600 text-white" : "text-gray-600 hover:bg-cyan-50"
            }`}
          >{t}</button>
        ))}
      </div>

      {tab === 0 && (
        <div className="tri-dash space-y-6">
          <div className="tri-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (
              <div key={k.l} className="tri-kpi bg-white rounded-lg border p-4">
                <div className="text-xs text-gray-500 tri-kpi-label">{k.l}</div>
                <div className="text-2xl font-bold text-cyan-700 tri-kpi-val">{k.v}</div>
                <div className="text-xs text-gray-400 tri-kpi-sub">{k.s}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="tri-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">Monthly Rate Trend (Spot vs Contract vs Rail)</h3>
              <LineChart data={monthlySpot} height={220}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="m" /><YAxis /><Tooltip /><Legend />
                <Line type="monotone" dataKey="spot" stroke="#0891b2" strokeWidth={2} name="Spot FTL" />
                <Line type="monotone" dataKey="contract" stroke="#0e7490" strokeWidth={2} name="Contract FTL" />
                <Line type="monotone" dataKey="rail" stroke="#155e75" strokeWidth={2} strokeDasharray="5 5" name="Rail Freight" />
              </LineChart>
            </div>
            <div className="tri-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">Rate by Corridor Comparison</h3>
              <BarChart data={corridorComp} height={220}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="c" tick={{ fontSize: 9 }} /><YAxis /><Tooltip />
                <Bar dataKey="spot" fill="#0891b2" radius={[4, 4, 0, 0]} name="Spot" />
                <Bar dataKey="contract" fill="#0e7490" radius={[4, 4, 0, 0]} name="Contract" />
              </BarChart>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="tri-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">Rate Type Market Share</h3>
              <PieChart width={400} height={220}>
                <Pie data={typeShare} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>
                  {typeShare.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
            <div className="tri-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">Volume Distribution by Region</h3>
              <PieChart width={400} height={220}>
                <Pie data={regionDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>
                  {regionDist.map((_, i) => <Cell key={i} fill={COLORS[(i + 3) % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="tri-bench space-y-4">
          <ModuleBreadcrumb items={[{ label: "Transport", href: "#" }, { label: "Rate Benchmarks", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="tri-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  {"ID,Corridor,Vehicle,Rate Type,Trend,Spot Rate,Contract Rate,Delta,Volume,Transit,Fuel Surch.,Toll,Driver,All-In Cost,Source"
                    .split(",").map(h => (
                    <th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => {
                  const rowCls = r.trend === "Surging" || r.trend === "Seasonal Peak"
                    ? "tri-row-critical bg-red-50"
                    : r.trend === "Volatile"
                      ? "tri-row-warning bg-amber-50" : "";
                  const sp = ri(0, 100, (r.spotRate / maxSpot) * 100);
                  return (
                    <tr key={r.id} className={`border-b hover:bg-cyan-50/50 ${rowCls}`}>
                      <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                      <td className="px-3 py-2"><span className="tri-badge inline-block px-2 py-0.5 rounded text-xs bg-cyan-100 text-cyan-700">{r.corridor.split("\u2013")[0]}</span></td>
                      <td className="px-3 py-2"><span className="tri-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.vehicleType}</span></td>
                      <td className="px-3 py-2"><span className="tri-badge inline-block px-2 py-0.5 rounded text-xs bg-indigo-100 text-indigo-700">{r.rateType}</span></td>
                      <td className="px-3 py-2"><span className={`tri-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[trendColor[r.trend]]}`}>{r.trend}</span></td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{"\u20b9"}{r.spotRate}</span>
                          <div className="w-16 h-1.5 bg-gray-200 rounded">
                            <div className="tri-ratebar h-1.5 bg-cyan-500 rounded" style={{ width: `${sp}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2">{"\u20b9"}{r.contractRate}</td>
                      <td className="px-3 py-2">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${r.delta > 15 ? "bg-red-100 text-red-700" : r.delta > 12 ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
                          {r.delta > 0 ? "+" : ""}{r.delta}%
                        </span>
                      </td>
                      <td className="px-3 py-2">{r.volumeTonnage.toLocaleString()}t</td>
                      <td className="px-3 py-2">{r.avgTransitHrs}h</td>
                      <td className="px-3 py-2 text-xs">{"\u20b9"}{r.fuelSurcharge.toLocaleString()}</td>
                      <td className="px-3 py-2 text-xs">{"\u20b9"}{r.tollCost.toLocaleString()}</td>
                      <td className="px-3 py-2 text-xs">{"\u20b9"}{r.driverCost.toLocaleString()}</td>
                      <td className="px-3 py-2 font-medium">{"\u20b9"}{r.allInCost.toLocaleString()}</td>
                      <td className="px-3 py-2"><span className="tri-badge inline-block px-2 py-0.5 rounded text-xs bg-teal-100 text-teal-700">{r.source}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="tri-trends space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="tri-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">Diesel Price vs Rate Index (12 Months)</h3>
              <LineChart data={fuelImpact} height={240}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="m" /><YAxis /><Tooltip /><Legend />
                <Line type="monotone" dataKey="diesel" stroke="#f59e0b" strokeWidth={2} name="Diesel \u20b9/L" />
                <Line type="monotone" dataKey="rateIndex" stroke="#0891b2" strokeWidth={2} name="Rate Index" />
              </LineChart>
            </div>
            <div className="tri-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">Spot-Contract Delta by Corridor</h3>
              <BarChart data={corridorComp.map(c => ({ c: c.c, v: +(((c.spot - c.contract) / c.contract) * 100).toFixed(1) }))} height={240}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="c" tick={{ fontSize: 9 }} /><YAxis /><Tooltip />
                <Bar dataKey="v" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </div>
          </div>
          <div className="tri-chart bg-white rounded-lg border p-4">
            <h3 className="text-sm font-semibold mb-3">Monthly Volume Trend</h3>
            <AreaChart data={Array.from({ length: 12 }, (_, i) => ({ m: MO[i], v: ri(8000, 22000, 14000 + Math.sin(i * 0.7) * 5000) }))} height={240}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="m" /><YAxis /><Tooltip />
              <Area type="monotone" dataKey="v" stroke="#0891b2" fill="#cffafe" />
            </AreaChart>
          </div>
        </div>
      )}

      {tab === 3 && (
        <div className="tri-insights grid grid-cols-2 gap-6">
          {INSIGHTS.map(ins => (
            <div key={ins.t} className="tri-insight bg-white rounded-lg border p-5">
              <h3 className="text-base font-bold text-cyan-800 mb-2">{ins.t}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
