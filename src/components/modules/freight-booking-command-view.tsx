"use client";
import { useState } from "react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#4f46e5", "#6366f1", "#818cf8", "#a5b4fc", "#4338ca", "#3730a3", "#312e81", "#e0e7ff"];
const CORRIDORS = ["Mumbai-Delhi NH8","Delhi-Chennai NH44","Bangalore-Hyderabad NH44","Kolkata-Mumbai NH6","Chennai-Kolkata NH16","Delhi-Kolkata NH19","Mumbai-Bangalore NH48","Pune-Hyderabad NH65"];
const CARRIERS = ["Rivigo", "TCI Express", "Delhivery", "BlueDart", "XpressBees", "Shadowfax", "Ecom Express", "Adani Logistics", "VRL Logistics", "Gati"];
const BOOKING_TYPES = ["FTL Spot", "FTL Contract", "PTL Spot", "PTL Contract", "Express", "Cold Chain", "Oversized", "Hazmat"];
const STATUS = ["Confirmed", "Pending Approval", "Rate Negotiation", "Cancelled", "Completed", "In Transit"];
const TABS = ["Dashboard", "Bookings", "Rate Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", blue: "bg-blue-100 text-blue-700", red: "bg-red-100 text-red-700", indigo: "bg-indigo-100 text-indigo-700", cyan: "bg-cyan-100 text-cyan-700" };
const statusColor: Record<string, string> = { Confirmed: "green", "Pending Approval": "amber", "Rate Negotiation": "blue", Cancelled: "red", Completed: "indigo", "In Transit": "cyan" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyVol = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], v: ri(80, 220, 120 + Math.sin(i) * 60) }));
const corridorBookings = CORRIDORS.map(c => ({ c, v: ri(5, 45, 20 + Math.random() * 25 | 0) }));
const typeDist = BOOKING_TYPES.slice(0, 6).map((t, i) => ({ n: t, v: ri(8, 40, 15 + i * 5) }));
const rateTrend = Array.from({ length: 12 }, (_, i) => ({ m: `M${i + 1}`, ftl: ri(2.2, 4.8, 3.2 + Math.sin(i * 0.7) * 0.8), ptl: ri(1.8, 3.5, 2.4 + Math.cos(i * 0.5) * 0.6) }));
const carrierShare = CARRIERS.slice(0, 6).map((c, i) => ({ n: c, v: ri(8, 30, 20 - i * 3) }));
const corridorRates = CORRIDORS.map(c => ({ c, v: +(ri(18, 62, 30 + Math.random() * 20)).toFixed(1) }));

interface Booking { id: string; corridor: string; carrier: string; bookingType: string; status: string; origin: string; destination: string; distanceKm: number; ratePerKm: number; totalCost: number; weightTonnes: number; vehicleType: string; bookingDate: string; pickupDate: string; deliveryDate: string; negotiatedRate: number; savings: number; shipper: string; }

const bookings: Booking[] = [
  { id: "FBC-0001", corridor: "Mumbai-Delhi NH8", carrier: "Rivigo", bookingType: "FTL Spot", status: "Confirmed", origin: "Mumbai", destination: "Delhi", distanceKm: 1420, ratePerKm: 3.8, totalCost: 5396, weightTonnes: 18.5, vehicleType: "20ft Container", bookingDate: "2025-01-10", pickupDate: "2025-01-12", deliveryDate: "2025-01-14", negotiatedRate: 3.5, savings: 426, shipper: "Reliance Industries" },
  { id: "FBC-0002", corridor: "Delhi-Chennai NH44", carrier: "TCI Express", bookingType: "FTL Contract", status: "In Transit", origin: "Delhi", destination: "Chennai", distanceKm: 2180, ratePerKm: 2.9, totalCost: 6322, weightTonnes: 22, vehicleType: "40ft Container", bookingDate: "2025-01-08", pickupDate: "2025-01-09", deliveryDate: "2025-01-13", negotiatedRate: 2.9, savings: 0, shipper: "Tata Steel" },
  { id: "FBC-0003", corridor: "Bangalore-Hyderabad NH44", carrier: "Delhivery", bookingType: "PTL Spot", status: "Rate Negotiation", origin: "Bangalore", destination: "Hyderabad", distanceKm: 570, ratePerKm: 4.2, totalCost: 2394, weightTonnes: 5.2, vehicleType: "Open Truck", bookingDate: "2025-01-11", pickupDate: "2025-01-13", deliveryDate: "2025-01-14", negotiatedRate: 0, savings: 0, shipper: "Wipro Logistics" },
  { id: "FBC-0004", corridor: "Kolkata-Mumbai NH6", carrier: "BlueDart", bookingType: "Express", status: "Completed", origin: "Kolkata", destination: "Mumbai", distanceKm: 1650, ratePerKm: 5.8, totalCost: 9570, weightTonnes: 2.1, vehicleType: "Reefer Truck", bookingDate: "2025-01-05", pickupDate: "2025-01-06", deliveryDate: "2025-01-08", negotiatedRate: 5.4, savings: 660, shipper: "ITC Limited" },
  { id: "FBC-0005", corridor: "Chennai-Kolkata NH16", carrier: "XpressBees", bookingType: "PTL Contract", status: "Cancelled", origin: "Chennai", destination: "Kolkata", distanceKm: 1350, ratePerKm: 3.1, totalCost: 4185, weightTonnes: 8.5, vehicleType: "Flatbed", bookingDate: "2025-01-07", pickupDate: "", deliveryDate: "", negotiatedRate: 0, savings: 0, shipper: "Larsen & Toubro" },
  { id: "FBC-0006", corridor: "Delhi-Kolkata NH19", carrier: "Shadowfax", bookingType: "Cold Chain", status: "Confirmed", origin: "Delhi", destination: "Kolkata", distanceKm: 1460, ratePerKm: 6.2, totalCost: 9052, weightTonnes: 12, vehicleType: "Reefer Truck", bookingDate: "2025-01-09", pickupDate: "2025-01-10", deliveryDate: "2025-01-12", negotiatedRate: 5.8, savings: 584, shipper: "Amul Dairy" },
  { id: "FBC-0007", corridor: "Mumbai-Bangalore NH48", carrier: "Ecom Express", bookingType: "FTL Spot", status: "Pending Approval", origin: "Mumbai", destination: "Bangalore", distanceKm: 980, ratePerKm: 3.4, totalCost: 3332, weightTonnes: 15, vehicleType: "20ft Container", bookingDate: "2025-01-11", pickupDate: "2025-01-13", deliveryDate: "2025-01-15", negotiatedRate: 0, savings: 0, shipper: "Infosys SCM" },
  { id: "FBC-0008", corridor: "Pune-Hyderabad NH65", carrier: "Adani Logistics", bookingType: "FTL Contract", status: "Confirmed", origin: "Pune", destination: "Hyderabad", distanceKm: 560, ratePerKm: 2.6, totalCost: 1456, weightTonnes: 20, vehicleType: "40ft Container", bookingDate: "2025-01-10", pickupDate: "2025-01-11", deliveryDate: "2025-01-12", negotiatedRate: 2.6, savings: 0, shipper: "Mahindra Logistics" },
  { id: "FBC-0009", corridor: "Mumbai-Delhi NH8", carrier: "VRL Logistics", bookingType: "Oversized", status: "Rate Negotiation", origin: "Mumbai", destination: "Delhi", distanceKm: 1420, ratePerKm: 5.1, totalCost: 7242, weightTonnes: 28, vehicleType: "Lowbed Trailer", bookingDate: "2025-01-11", pickupDate: "", deliveryDate: "", negotiatedRate: 0, savings: 0, shipper: "Siemens India" },
  { id: "FBC-0010", corridor: "Delhi-Chennai NH44", carrier: "Gati", bookingType: "Hazmat", status: "Confirmed", origin: "Delhi", destination: "Chennai", distanceKm: 2180, ratePerKm: 4.8, totalCost: 10464, weightTonnes: 8, vehicleType: "Tanker", bookingDate: "2025-01-09", pickupDate: "2025-01-10", deliveryDate: "2025-01-13", negotiatedRate: 4.5, savings: 654, shipper: "Bharat Petroleum" },
  { id: "FBC-0011", corridor: "Bangalore-Hyderabad NH44", carrier: "Rivigo", bookingType: "PTL Spot", status: "Completed", origin: "Bangalore", destination: "Hyderabad", distanceKm: 570, ratePerKm: 2.2, totalCost: 1254, weightTonnes: 3.8, vehicleType: "Open Truck", bookingDate: "2025-01-04", pickupDate: "2025-01-05", deliveryDate: "2025-01-06", negotiatedRate: 2.0, savings: 114, shipper: "Biocon Ltd" },
  { id: "FBC-0012", corridor: "Kolkata-Mumbai NH6", carrier: "TCI Express", bookingType: "FTL Spot", status: "In Transit", origin: "Kolkata", destination: "Mumbai", distanceKm: 1650, ratePerKm: 3.6, totalCost: 5940, weightTonnes: 19, vehicleType: "20ft Container", bookingDate: "2025-01-08", pickupDate: "2025-01-09", deliveryDate: "2025-01-12", negotiatedRate: 3.6, savings: 0, shipper: "JSW Steel" },
  { id: "FBC-0013", corridor: "Mumbai-Bangalore NH48", carrier: "Delhivery", bookingType: "PTL Contract", status: "Cancelled", origin: "Mumbai", destination: "Bangalore", distanceKm: 980, ratePerKm: 2.8, totalCost: 2744, weightTonnes: 6.5, vehicleType: "Enclosed Truck", bookingDate: "2025-01-06", pickupDate: "", deliveryDate: "", negotiatedRate: 0, savings: 0, shipper: "Hindustan Unilever" },
  { id: "FBC-0014", corridor: "Pune-Hyderabad NH65", carrier: "XpressBees", bookingType: "Express", status: "Pending Approval", origin: "Pune", destination: "Hyderabad", distanceKm: 560, ratePerKm: 4.5, totalCost: 2520, weightTonnes: 1.5, vehicleType: "Reefer Truck", bookingDate: "2025-01-11", pickupDate: "", deliveryDate: "", negotiatedRate: 0, savings: 0, shipper: "Dr. Reddy\u2019s Labs" },
];

const activeCount = bookings.filter(b => b.status === "Rate Negotiation" || b.status === "Pending Approval").length;
const confirmedToday = bookings.filter(b => b.status === "Confirmed").length;
const avgRate = (bookings.reduce((s, b) => s + b.ratePerKm, 0) / bookings.length).toFixed(2);
const totalSavings = bookings.reduce((s, b) => s + b.savings, 0);
const kpis = [
  { l: "Active Bookings", v: activeCount, s: "pending + negotiation" },
  { l: "Confirmed Today", v: confirmedToday, s: "bookings locked in" },
  { l: "Avg Rate", v: `\u20b9${avgRate}/km`, s: "across all corridors" },
  { l: "Savings This Month", v: `\u20b9${totalSavings.toLocaleString()}`, s: "via negotiation" },
];

const INSIGHTS = [
  {
    t: "FTL Spot Rate Volatility",
    c: "The Mumbai-Delhi NH8 corridor, India\u2019s busiest freight route spanning 1,420 km, exhibits significant seasonal rate volatility of 15-25% driven by agricultural harvest cycles, festival demand surges, and monsoon-related disruptions. During the October-December peak season, spot rates for 20ft container movements regularly surge to \u20b94.2-4.8 per km as demand from FMCG, automotive, and e-commerce sectors intensifies simultaneously. Conversely, the April-June lean period sees rates dip to \u20b92.8-3.2 per km, creating strategic procurement windows for forward-thinking logistics managers. Our analysis of 2,400+ spot transactions over 18 months reveals that booking 72-96 hours ahead of peak demand periods yields average savings of 18.3% compared to same-day spot procurement. Corridor-specific factors like toll plaza congestion at Gwalior and Kota, fuel price variations across Maharashtra-Rajasthan-Delhi, and driver availability during harvest seasons compound the volatility, making predictive rate modeling essential for cost optimization across the entire National Highway network serving northern and western India.",
  },
  {
    t: "Contract vs Spot Optimization",
    c: "A hybrid booking strategy combining long-term contracts (60-70% volume) with strategic spot procurement (30-40%) delivers 12-18% cost savings for Indian 3PL operators managing multi-corridor freight networks. Our benchmarking across 15 major logistics companies operating on NH44, NH48, and NH8 corridors shows that pure-contract strategies sacrifice 8-12% potential savings during seasonal rate dips, while pure-spot approaches incur 22-35% cost premiums during peak periods. The optimal hybrid model locks in base rates via 6-month FTL contracts at \u20b92.6-3.0 per km for guaranteed volumes, then deploys spot bookings during rate troughs to capture additional savings. Key enablers include real-time spot market visibility through digital freight platforms, dynamic volume allocation algorithms that shift 10-15% of contracted volume to spot during favorable conditions, and quarterly contract renegotiation clauses that incorporate fuel price indexation and toll cost adjustments. Companies implementing this model report improved carrier relationships through predictable volume commitments while maintaining cost competitiveness in a rapidly evolving market.",
  },
  {
    t: "Cold Chain Freight Premium",
    c: "Temperature-controlled freight on Indian express lanes commands a 2.8x premium over standard dry freight, reflecting the specialized infrastructure requirements, energy costs for reefer units, and stringent quality compliance mandates. On the Delhi-Chennai and Delhi-Kolkata corridors, cold chain rates average \u20b95.8-6.2 per km compared to \u20b92.0-2.4 for equivalent dry FTL movements. This premium is driven by reefer truck acquisition costs (\u20b945-60 lakh vs \u20b918-25 lakh for standard trucks), diesel generator fuel consumption of 4-6 liters per hour for continuous cooling, and the need for GPS-enabled temperature monitoring systems. The growing pharmaceutical, frozen food, and fresh produce sectors are expanding cold chain demand by 18-22% annually, with the COVID-19 vaccine distribution having permanently elevated cold chain infrastructure investment. Key optimization strategies include multi-temperature zone vehicles, consolidated cold chain corridors reducing empty return legs, and IoT-enabled predictive maintenance reducing reefer breakdown incidents by 40% across major Indian logistics hubs.",
  },
  {
    t: "Digital Freight Marketplace Impact",
    c: "Digital freight marketplaces like BlackBuck, Rivigo, and Uber Freight are fundamentally transforming Indian trucking by eliminating traditional broker margins of 8-15%, improving truck utilization from 60% to 78-85%, and reducing average payment settlement cycles from 45-60 days to 24-72 hours. These platforms have digitized over 35% of India\u2019s \u20b920 lakh crore road freight market, with adoption accelerating post-GST implementation as e-way bill compliance created natural digital touchpoints. The marketplace model provides real-time spot rate discovery across 800+ districts, algorithmic carrier matching that considers vehicle positioning, load compatibility, and historical performance, and transparent pricing that reduces information asymmetry between shippers and fleet operators. For freight booking command centers, marketplace integration enables dynamic multi-carrier rate comparison within seconds, automated bidding for spot loads, and consolidated invoicing across multiple carriers. The data generated by these platforms, covering 50 million+ trip records, powers increasingly accurate ETA predictions and rate forecasting models for the Indian supply chain ecosystem.",
  },
];

export default function FreightBookingCommandView() {
  const [tab, setTab] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const filterGroups = [
    { key: "corridor", label: "Corridor", options: CORRIDORS.map(c => ({ value: c, count: bookings.filter(b => b.corridor === c).length })) },
    { key: "carrier", label: "Carrier", options: CARRIERS.map(c => ({ value: c, count: bookings.filter(b => b.carrier === c).length })) },
    { key: "bookingType", label: "Type", options: BOOKING_TYPES.map(t => ({ value: t, count: bookings.filter(b => b.bookingType === t).length })) },
    { key: "status", label: "Status", options: STATUS.map(s => ({ value: s, count: bookings.filter(b => b.status === s).length })) },
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = bookings.filter(b => {
    if (search) {
      const q = search.toLowerCase();
      if (!b.id.toLowerCase().includes(q) && !b.corridor.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(
      ([k, vs]) => vs.includes(b[k as keyof Booking] as string)
    );
  });

  const maxRate = Math.max(...bookings.map(b => b.ratePerKm));

  return (
    <div className="fbc-root p-6 space-y-6">
      <PageHeader
        title="Freight Booking Command"
        description="Manage spot rates, contract bookings, and carrier selection across major freight corridors"
      />
      <div className="fbc-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`fbc-tab px-4 py-2 text-sm font-medium rounded-t ${
              tab === i ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-indigo-50"
            }`}
          >{t}</button>
        ))}
      </div>

      {tab === 0 && (
        <div className="fbc-dash space-y-6">
          <div className="fbc-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (
              <div key={k.l} className="fbc-kpi bg-white rounded-lg border p-4">
                <div className="text-xs text-gray-500 fbc-kpi-label">{k.l}</div>
                <div className="text-2xl font-bold text-indigo-700 fbc-kpi-val">{k.v}</div>
                <div className="text-xs text-gray-400 fbc-kpi-sub">{k.s}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="fbc-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">Bookings by Corridor</h3>
              <BarChart data={corridorBookings} height={220}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="c" tick={{ fontSize: 10 }} />
                <YAxis /><Tooltip />
                <Bar dataKey="v" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </div>
            <div className="fbc-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">Monthly Volume Trend</h3>
              <AreaChart data={monthlyVol} height={220}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="m" /><YAxis /><Tooltip />
                <Area type="monotone" dataKey="v" stroke="#4f46e5" fill="#e0e7ff" />
              </AreaChart>
            </div>
          </div>
          <div className="fbc-chart bg-white rounded-lg border p-4">
            <h3 className="text-sm font-semibold mb-3">Booking Type Distribution</h3>
            <PieChart width={400} height={220}>
              <Pie data={typeDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>
                {typeDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="fbc-bookings space-y-4">
          <ModuleBreadcrumb items={[{ label: "Freight", href: "#" }, { label: "Bookings", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={bookings.length} filteredCount={filtered.length} />
          <div className="fbc-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  {"ID,Corridor,Carrier,Type,Status,Origin\u2192Dest,Distance,Rate/km,Cost,Weight,Pickup,Delivery,Savings"
                    .split(",").map(h => (
                    <th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(b => {
                  const rowCls = b.status === "Cancelled"
                    ? "fbc-row-critical bg-red-50"
                    : b.status === "Rate Negotiation" || b.status === "Pending Approval"
                      ? "fbc-row-warning bg-amber-50" : "";
                  const rp = ri(0, 100, (b.ratePerKm / maxRate) * 100);
                  return (
                    <tr key={b.id} className={`border-b hover:bg-indigo-50/50 ${rowCls}`}>
                      <td className="px-3 py-2 font-mono font-medium">{b.id}</td>
                      <td className="px-3 py-2"><span className="fbc-badge inline-block px-2 py-0.5 rounded text-xs bg-indigo-100 text-indigo-700">{b.corridor.split(" ")[0]}</span></td>
                      <td className="px-3 py-2"><span className="fbc-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{b.carrier}</span></td>
                      <td className="px-3 py-2"><span className="fbc-badge inline-block px-2 py-0.5 rounded text-xs bg-purple-100 text-purple-700">{b.bookingType}</span></td>
                      <td className="px-3 py-2"><span className={`fbc-badge inline-block px-2 py-0.5 rounded text-xs ${SC[statusColor[b.status]]}`}>{b.status}</span></td>
                      <td className="px-3 py-2 whitespace-nowrap">{b.origin}{"\u2192"}{b.destination}</td>
                      <td className="px-3 py-2">{b.distanceKm} km</td>
                      <td className="px-3 py-2"><div className="flex items-center gap-2"><span>{"\u20b9"}{b.ratePerKm}</span><div className="w-16 h-1.5 bg-gray-200 rounded"><div className="fbc-ratebar h-1.5 bg-indigo-500 rounded" style={{width:`${rp}%`}}/></div></div></td>
                      <td className="px-3 py-2 font-medium">{"\u20b9"}{b.totalCost.toLocaleString()}</td>
                      <td className="px-3 py-2">{b.weightTonnes}t</td>
                      <td className="px-3 py-2 text-xs">{b.pickupDate||"-"}</td>
                      <td className="px-3 py-2 text-xs">{b.deliveryDate||"-"}</td>
                      <td className="px-3 py-2">{b.savings>0?<span className="fbc-badge inline-block px-2 py-0.5 rounded text-xs bg-green-100 text-green-700">{"\u20b9"}{b.savings}</span>:"-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="fbc-analytics space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="fbc-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">Avg Rate/km by Corridor</h3>
              <BarChart data={corridorRates} height={240}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="c" tick={{ fontSize: 9 }} />
                <YAxis /><Tooltip />
                <Bar dataKey="v" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </div>
            <div className="fbc-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">Carrier Market Share</h3>
              <PieChart width={400} height={240}>
                <Pie data={carrierShare} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={85} label>
                  {carrierShare.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          </div>
          <div className="fbc-chart bg-white rounded-lg border p-4">
            <h3 className="text-sm font-semibold mb-3">Rate Trend (12 Months)</h3>
            <LineChart data={rateTrend} height={240}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="m" /><YAxis /><Tooltip />
              <Line type="monotone" dataKey="ftl" stroke="#4f46e5" strokeWidth={2} />
              <Line type="monotone" dataKey="ptl" stroke="#818cf8" strokeWidth={2} />
            </LineChart>
          </div>
        </div>
      )}

      {tab === 3 && (
        <div className="fbc-insights grid grid-cols-2 gap-6">
          {INSIGHTS.map(ins => (
            <div key={ins.t} className="fbc-insight bg-white rounded-lg border p-5">
              <h3 className="text-base font-bold text-indigo-800 mb-2">{ins.t}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
