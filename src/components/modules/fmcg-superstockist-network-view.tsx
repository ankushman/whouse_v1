"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#dc2626", "#ef4444", "#f87171", "#fca5a5", "#991b1b", "#7f1d1d", "#fecaca", "#fee2e2"];
const SUPERSTOCKISTS = ["Metro Cash & Carry", "Reliance Smart Wholesale", "SPAR Wholesale", "Best Price (Walmart)", "Lotus Superstore", "Vishal Mega Mart", "More Wholesale", "Bharat Wholesale"];
const BRANDS = ["Hindustan Unilever", "ITC Ltd", "Nestle India", "Britannia", "PepsiCo India", "Dabur", "Marico", "Parle Agro"];
const STATES = ["Maharashtra", "Gujarat", "Karnataka", "Tamil Nadu", "Uttar Pradesh", "Rajasthan", "Telangana", "West Bengal"];
const CATEGORIES = ["Personal Care", "Food & Beverages", "Home Care", "Packaged Foods", "Dairy", "Snacks", "Health & Wellness", " Staples"];
const CHANNEL_TYPES = ["Modern Trade", "General Trade", "E-commerce B2B", "HoReCa", "Rural Distribution"];
const TABS = ["Dashboard", "Distribution Registry", "Channel Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", rose: "bg-rose-100 text-rose-700", slate: "bg-slate-100 text-slate-600", orange: "bg-orange-100 text-orange-700" };
const statusColor: Record<string, string> = { "Active": "green", "Pending Delivery": "amber", "Backorder": "red", "Partial Shipment": "orange", "Delivered": "slate", "Cancelled": "slate" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyShipments = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], modernTrade: ri(180, 380, 265 + Math.sin(i * 0.5) * 75), generalTrade: ri(320, 620, 450 + Math.cos(i * 0.6) * 100), ecommerce: ri(60, 180, 110 + Math.sin(i * 0.7) * 35) }));
const channelDist = [{ n: "General Trade", v: 42 }, { n: "Modern Trade", v: 28 }, { n: "E-comm B2B", v: 15 }, { n: "HoReCa", v: 10 }, { n: "Rural", v: 5 }];
const otifTrend = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], otif: +(ri(78, 94, 84 + i * 0.8)).toFixed(1), target: 92.0 }));
const brandPerf = BRANDS.slice(0, 6).map(b => ({ n: b.split(" ")[0], score: +(ri(72, 96, 82 + Math.random() * 10)).toFixed(1) }));

interface DistRecord { id: string; poNo: string; superstockist: string; brand: string; category: string; channel: string; state: string; city: string; skuCount: number; totalCases: number; orderValue: number; margin: number; deliveryDate: string; status: string; primarySKU: string; scheme: string; salesman: string; warehouse: string; transportMode: string; remarks: string; }

const records: DistRecord[] = [
  { id: "FSS-0001", poNo: "PO-FY25-44521", superstockist: "Metro Cash & Carry", brand: "Hindustan Unilever", category: "Personal Care", channel: "Modern Trade", state: "Maharashtra", city: "Mumbai", skuCount: 48, totalCases: 320, orderValue: 485000, margin: 12.5, deliveryDate: "2025-01-15", status: "Delivered", primarySKU: "Lifebuoy 500ml", scheme: "10+1 Free", salesman: "Rajesh Kumar", warehouse: "Bhiwandi DC", transportMode: "FTL", remarks: "Monthly replenishment order" },
  { id: "FSS-0002", poNo: "PO-FY25-44522", superstockist: "Reliance Smart Wholesale", brand: "ITC Ltd", category: "Packaged Foods", channel: "E-commerce B2B", state: "Gujarat", city: "Ahmedabad", skuCount: 32, totalCases: 240, orderValue: 620000, margin: 11.8, deliveryDate: "2025-01-16", status: "Active", primarySKU: "Yipee Noodles", scheme: "Trade Discount 8%", salesman: "Amit Patel", warehouse: "Sanand DC", transportMode: "FTL", remarks: "JioMart B2B fulfillment" },
  { id: "FSS-0003", poNo: "PO-FY25-44523", superstockist: "SPAR Wholesale", brand: "Nestle India", category: "Food & Beverages", channel: "General Trade", state: "Karnataka", city: "Bangalore", skuCount: 56, totalCases: 180, orderValue: 380000, margin: 14.2, deliveryDate: "2025-01-14", status: "Pending Delivery", primarySKU: "Maggi 2-Min Noodles", scheme: "Volume Incentive 5%", salesman: "Sunil Rao", warehouse: "Whitefield DC", transportMode: "PTL", remarks: "Partial shipment - 12 SKUs pending" },
  { id: "FSS-0004", poNo: "PO-FY25-44524", superstockist: "Best Price (Walmart)", brand: "PepsiCo India", category: "Snacks", channel: "Modern Trade", state: "Tamil Nadu", city: "Chennai", skuCount: 24, totalCases: 480, orderValue: 295000, margin: 10.5, deliveryDate: "2025-01-17", status: "Active", primarySKU: "Lays Classic", scheme: "Display Bonus", salesman: "Karthik S", warehouse: "Oragadam DC", transportMode: "FTL", remarks: "Quarterly push order" },
  { id: "FSS-0005", poNo: "PO-FY25-44525", superstockist: "Lotus Superstore", brand: "Dabur", category: "Health & Wellness", channel: "General Trade", state: "Uttar Pradesh", city: "Lucknow", skuCount: 38, totalCases: 150, orderValue: 340000, margin: 15.0, deliveryDate: "2025-01-12", status: "Backorder", primarySKU: "Chyawanprash 1kg", scheme: "Free Goods 6%", salesman: "Vikram Singh", warehouse: "Lucknow DC", transportMode: "PTL", remarks: "Amla stockout - restock ETA 20-Jan" },
  { id: "FSS-0006", poNo: "PO-FY25-44526", superstockist: "Vishal Mega Mart", brand: "Britannia", category: "Packaged Foods", channel: "General Trade", state: "Rajasthan", city: "Jaipur", skuCount: 42, totalCases: 280, orderValue: 410000, margin: 13.2, deliveryDate: "2025-01-18", status: "Active", primarySKU: "Marie Gold", scheme: "Case Rate Discount", salesman: "Mahesh Sharma", warehouse: "Jaipur DC", transportMode: "FTL", remarks: "Festive season build-up" },
  { id: "FSS-0007", poNo: "PO-FY25-44527", superstockist: "More Wholesale", brand: "Marico", category: "Personal Care", channel: "Rural Distribution", state: "Telangana", city: "Hyderabad", skuCount: 28, totalCases: 200, orderValue: 260000, margin: 16.5, deliveryDate: "2025-01-13", status: "Delivered", primarySKU: "Parachute Coconut Oil", scheme: "Rural Incentive 7%", salesman: "Srikanth G", warehouse: "Gachibowli DC", transportMode: "Milk Run", remarks: "Rural redistribution order" },
  { id: "FSS-0008", poNo: "PO-FY25-44528", superstockist: "Bharat Wholesale", brand: "Parle Agro", category: "Beverages", channel: "General Trade", state: "West Bengal", city: "Kolkata", skuCount: 18, totalCases: 520, orderValue: 185000, margin: 11.0, deliveryDate: "2025-01-19", status: "Active", primarySKU: "Frooti 200ml", scheme: "Summer Advance Order", salesman: "Ranjan Das", warehouse: "Dankuni ICD", transportMode: "Rail", remarks: "Summer stock pre-positioning" },
  { id: "FSS-0009", poNo: "PO-FY25-44529", superstockist: "Metro Cash & Carry", brand: "Hindustan Unilever", category: "Home Care", channel: "Modern Trade", state: "Maharashtra", city: "Pune", skuCount: 36, totalCases: 420, orderValue: 520000, margin: 12.0, deliveryDate: "2025-01-20", status: "Active", primarySKU: "Surf Excel Matic", scheme: "GM% Off Invoice", salesman: "Prasad Joshi", warehouse: "Chakan DC", transportMode: "FTL", remarks: "Quarterly home care promo" },
  { id: "FSS-0010", poNo: "PO-FY25-44530", superstockist: "Reliance Smart Wholesale", brand: "ITC Ltd", category: "Staples", channel: "E-commerce B2B", state: "Karnataka", city: "Mysore", skuCount: 22, totalCases: 160, orderValue: 290000, margin: 10.8, deliveryDate: "2025-01-11", status: "Delivered", primarySKU: "Aashirvaad Atta 5kg", scheme: "B2B Exclusive 3%", salesman: "Naveen Kumar", warehouse: "Mandya Hub", transportMode: "PTL", remarks: "Tier-2 city B2B order" },
  { id: "FSS-0011", poNo: "PO-FY25-44531", superstockist: "Best Price (Walmart)", brand: "Nestle India", category: "Dairy", channel: "Modern Trade", state: "Gujarat", city: "Surat", skuCount: 30, totalCases: 350, orderValue: 445000, margin: 11.5, deliveryDate: "2025-01-21", status: "Partial Shipment", primarySKU: "Nestle Milk 1L", scheme: "Cold Chain Bonus", salesman: "Dhruv Mehta", warehouse: "Hazira DC", transportMode: "Reefer FTL", remarks: "Cold chain - 14 SKUs delivered, 16 pending" },
  { id: "FSS-0012", poNo: "PO-FY25-44532", superstockist: "SPAR Wholesale", brand: "PepsiCo India", category: "Beverages", channel: "HoReCa", state: "Tamil Nadu", city: "Coimbatore", skuCount: 15, totalCases: 600, orderValue: 210000, margin: 18.0, deliveryDate: "2025-01-10", status: "Delivered", primarySKU: "Pepsi 2L PET", scheme: "HoReCa Volume Rebate", salesman: "Karthik R", warehouse: "Pollachi DC", transportMode: "PTL", remarks: "Hotel/restaurant channel order" },
  { id: "FSS-0013", poNo: "PO-FY25-44533", superstockist: "Lotus Superstore", brand: "Dabur", category: "Health & Wellness", channel: "General Trade", state: "Uttar Pradesh", city: "Agra", skuCount: 32, totalCases: 180, orderValue: 275000, margin: 14.5, deliveryDate: "2025-01-22", status: "Active", primarySKU: "Real Fruit Juice 1L", scheme: "Trade Discount 6%", salesman: "Deepak Verma", warehouse: "Agra Hub", transportMode: "Milk Run", remarks: "Second order of the month" },
  { id: "FSS-0014", poNo: "PO-FY25-44534", superstockist: "Vishal Mega Mart", brand: "Britannia", category: "Snacks", channel: "General Trade", state: "Rajasthan", city: "Jodhpur", skuCount: 26, totalCases: 220, orderValue: 195000, margin: 12.8, deliveryDate: "2025-01-08", status: "Cancelled", primarySKU: "Tiger Glucose", scheme: "\u2014", salesman: "Gopal Rajak", warehouse: "Jodhpur DC", transportMode: "PTL", remarks: "Cancelled - stockist closed outlet" },
];

const activeCount = records.filter(r => r.status === "Active").length;
const pendingCount = records.filter(r => r.status === "Pending Delivery" || r.status === "Partial Shipment").length;
const backorderCount = records.filter(r => r.status === "Backorder").length;
const totalOrderValue = records.reduce((s, r) => s + r.orderValue, 0);

function fmtVal(n: number): string {
  if (n >= 10000000) return `\u20b9${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `\u20b9${(n / 100000).toFixed(1)}L`;
  return `\u20b9${(n / 1000).toFixed(0)}K`;
}

const kpis = [
  { l: "Active Orders", v: activeCount, s: "in pipeline" },
  { l: "Pending / Partial", v: pendingCount, s: "need tracking" },
  { l: "Backorder", v: backorderCount, s: "stockout items" },
  { l: "Total Order Value", v: fmtVal(totalOrderValue), s: "across all POs" },
];

const INSIGHTS = [
  {
    t: "India FMCG Distribution: \u20b95.4 Lakh Crore Market with 12 Million Kirana Stores",
    c: "India\u2019s FMCG (Fast-Moving Consumer Goods) distribution market, valued at approximately \u20b95.4 lakh crore in FY2024, operates through a complex multi-layered distribution network reaching 12 million kirana (neighbourhood) stores, 1.2 million modern trade outlets, and 85,000+ HoReCa (Hotel/Restaurant/Caf\u00e9) establishments. The distribution hierarchy typically follows a 4-tier structure: FMCG Manufacturer \u2192 National Distributor/C&FA (Carrying & Forwarding Agent) \u2192 Superstockist/Wholesaler \u2192 Retailer/Distributor \u2192 Consumer. The superstockist layer, serving as the critical middle tier between C&FAs and the fragmented retail base, handles 45-55% of total FMCG secondary sales volume in India. Major FMCG companies operate 2,500-4,000 SKUs (Stock Keeping Units) with a typical superstockist carrying 500-1,200 active SKUs across categories like personal care (22% of FMCG), food & beverages (35%), home care (15%), packaged staples (18%), and health & wellness (10%). The Indian FMCG market grows at 8-11% annually, driven by urbanization (35% urban population, growing at 3% annually), rising per capita income (\u20b92,00,000 in FY2024, up from \u20b91,52,000 in FY2020), and premiumization trends where consumers trade up from economy to mid-premium segments. For superstockist operations, inventory turnover optimization (targeting 18-22 turns/year for A-category SKUs, 12-15 turns for B-category) and working capital management (typical superstockist operates at \u20b940-80 lakh monthly revenue with \u20b912-20 lakh working capital requirement) are the primary financial levers, with FMCG companies offering trade schemes (6-15% margins) and secondary discounts (3-8%) to incentivize distribution depth.",
  },
  {
    t: "Secondary Sales & GT Management: Beat Planning and Territory Coverage",
    c: "Secondary sales (wholesale-to-retail) in India\u2019s FMCG distribution involve the management of 8-12 lakh weekly sales transactions by a typical large FMCG company through its distributor/superstockist network, facilitated by Salesman Route Planning (beat plans) covering 25-35 outlets per salesman per day across 250-350 outlet beats per territory. The beat planning system, often managed through SFA (Sales Force Automation) apps deployed on smartphones with GPS-enabled visit tracking, ensures that each retail outlet in a territory receives a weekly visit frequency aligned with its sales potential classification: Class A outlets (top 20% by revenue) receive 3 visits/week, Class B outlets (middle 40%) receive 2 visits/week, and Class C outlets (bottom 40%) receive 1 visit/week. India\u2019s leading FMCG companies achieve territory coverage of 85-92% of total outlets in their operating geography, with HUL (Hindustan Unilever) covering 9.5 million outlets, ITC covering 4.2 million, and Nestle India covering 3.8 million outlets through their combined distributor networks of 12,000+ superstockists and distributors. Key GT (General Trade) management metrics include: Sales per Call (\u20b98,000-15,000 per salesman per day), Lines per Call (8-12 SKU lines ordered per visit), Strike Rate (72-85% of visited outlets placing an order), and Outlet Productivity (\u20b918,000-28,000 monthly revenue per Class A outlet). Companies deploying AI-powered beat optimization algorithms report 12-18% improvement in sales per salesman, 25-35% reduction in missed outlet visits, and 8-12% improvement in outlet-level revenue through better SKU assortment recommendations based on historical sales data and local demand patterns.",
  },
  {
    t: "FMCG Trade Schemes & Promotions: Primary vs Secondary Off-Invoice Management",
    c: "Trade schemes and promotions constitute 18-25% of an FMCG company\u2019s total sales cost in India, with two primary mechanisms: Primary sales schemes (manufacturer to C&FA/distributor, typically 3-8% off-invoice) and Secondary sales schemes (distributor/superstockist to retailer, typically 6-15% margins + seasonal promotions). The Indian FMCG trade promotion calendar follows a structured seasonal cycle aligned with Indian festival seasons: Q1 (Jan-Mar): Spring cleaning (home care push), Q2 (Apr-Jun): Summer peak (beverages, ice cream, cold beverages achieving 40-60% sales uplift), Q3 (Jul-Sep): Monsoon (staples and immunity-boosting products), Q4 (Oct-Dec): Festive season (Diwali, Dussehra, Christmas driving 30-50% category uplift for gifting products, chocolates, premium personal care). Key trade promotion types in India include: (1) Free Goods schemes (10+1, 6+1 free SKUs on bulk orders), (2) GM% Off-Invoice (gross margin percentage discount on primary billing), (3) Trade Discount (flat % discount on MRP for specific period), (4) Display Bonus (\u20b92,000-5,000 for in-store display compliance), (5) Volume Incentive (progressive % discount for achieving quarterly volume targets), and (6) Schemes linked to primary sales targets with retrospective rebates. FMCG companies in India allocate 8-12% of net sales revenue to trade promotion budgets, with ROI measurement through incremental sales lift (target: 2.5-4x return on trade spend), new outlet addition (target: 8-12% new outlets per quarter), and brand market share gain (measured through Nielsen/IRI retail audit data). Digital trade promotion management platforms that automate scheme computation, reduce scheme leakage by 30-40%, and provide real-time scheme performance dashboards are increasingly replacing manual Excel-based trade management systems at leading Indian FMCG companies.",
  },
  {
    t: "FMCG Warehouse & Last-Mile Distribution: Temperature-Controlled and Ambient",
    c: "India\u2019s FMCG distribution network relies on approximately 850-950 FMCG-dedicated warehouses and distribution centers across 500+ cities, operated by a combination of FMCG company-owned C&FAs (30%), third-party logistics providers like DHL Supply Chain, TVS Supply Chain, and Allcargo Gati (45%), and superstockist-owned warehouses (25%). The warehouse operation model for FMCG follows a hub-and-spoke architecture: Central Distribution Centre (CDC, typically 50,000-100,000 sq ft in metros) feeds 5-8 Regional Distribution Centres (RDC, 15,000-30,000 sq ft in tier-1 cities), which in turn supply 15-25 Area Distribution Centres (ADC, 5,000-10,000 sq ft in tier-2/3 cities). The ambient FMCG warehouse operates at 60-65% average capacity utilization, with temperature-controlled sections (2-8\u00b0C for dairy and 15-25\u00b0C for chocolates/confectionery) occupying 15-20% of total warehouse area for companies like Nestle, Amul, and Britannia. Last-mile distribution from superstockist warehouse to retail outlets is primarily road-based (95%), using a mixed fleet of FTL (Full Truck Load, for 800+ case orders), PTL (Part Truck Load, for 200-800 cases), and Milk Run multi-drop deliveries (for less-than-200 case orders covering 8-12 outlets per route). The average last-mile delivery cost for FMCG in India is \u20b91.80-2.50 per case, with city-specific variation: Mumbai (\u20b91.90), Delhi NCR (\u20b91.70), Bangalore (\u20b92.10), Chennai (\u20b91.85), and tier-2 cities (\u20b92.40-3.20). FMCG companies deploying route optimization software for last-mile delivery report 18-25% reduction in delivery cost per case and 30-40% improvement in vehicle utilization through better consolidation and multi-drop route planning.",
  },
];

export default function FmcgSuperstockistNetworkView() {
  const [tab, setTab] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const filterGroups = [
    { key: "status", label: "Status", options: Object.keys(statusColor).map(s => ({ value: s, count: records.filter(r => r.status === s).length })) },
    { key: "superstockist", label: "Superstockist", options: SUPERSTOCKISTS.map(s => ({ value: s, count: records.filter(r => r.superstockist === s).length })) },
    { key: "category", label: "Category", options: CATEGORIES.map(c => ({ value: c, count: records.filter(r => r.category === c).length })) },
    { key: "channel", label: "Channel", options: CHANNEL_TYPES.map(ch => ({ value: ch, count: records.filter(r => r.channel === ch).length })) },
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.poNo.toLowerCase().includes(q) && !r.superstockist.toLowerCase().includes(q) && !r.brand.toLowerCase().includes(q) && !r.primarySKU.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof DistRecord] as string));
  });

  return (
    <div className="fsn-root p-6 space-y-6">
      <PageHeader title="FMCG Superstockist Network" description="FMCG secondary sales distribution, superstockist order management, trade scheme tracking, beat planning, channel analytics and last-mile retail fulfillment across India" />
      <div className="fsn-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`fsn-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-red-600 text-white" : "text-gray-600 hover:bg-red-50"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="fsn-dash space-y-6">
          <div className="fsn-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (<div key={k.l} className="fsn-kpi bg-white rounded-lg border p-4"><div className="text-xs text-gray-500 fsn-kpi-label">{k.l}</div><div className="text-2xl font-bold text-red-700 fsn-kpi-val">{k.v}</div><div className="text-xs text-gray-400 fsn-kpi-sub">{k.s}</div></div>))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="fsn-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Shipments by Channel</h3><BarChart data={monthlyShipments} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="modernTrade" fill="#dc2626" radius={[4,4,0,0]} name="Modern Trade" /><Bar dataKey="generalTrade" fill="#ef4444" radius={[4,4,0,0]} name="General Trade" /><Bar dataKey="ecommerce" fill="#f87171" radius={[4,4,0,0]} name="E-comm B2B" /></BarChart></div>
            <div className="fsn-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Channel Revenue Distribution</h3><PieChart width={400} height={220}><Pie data={channelDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{channelDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="fsn-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">OTIF Trend vs 92% Target</h3><LineChart data={otifTrend} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[75, 100]} /><Tooltip /><Legend /><Line type="monotone" dataKey="otif" stroke="#dc2626" strokeWidth={2} name="OTIF %" /><Line type="monotone" dataKey="target" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 5" name="Target 92%" /></LineChart></div>
            <div className="fsn-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Brand OTIF Scorecard</h3><BarChart data={brandPerf} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis domain={[65, 100]} /><Tooltip /><Bar dataKey="score" fill="#ef4444" radius={[4,4,0,0]} name="Score %" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="fsn-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "FMCG", href: "#" }, { label: "Distribution Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="fsn-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{"ID,PO No,Superstockist,Brand,Category,Channel,State,City,SKUs,Cases,Value,Margin%,Delivery,Status,Primary SKU,Scheme,Salesman,Warehouse,Transport,Remarks"
                .split(",").map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const rowCls = r.status === "Backorder" ? "fsn-row-critical bg-red-50" : r.status === "Pending Delivery" ? "fsn-row-warning bg-amber-50" : r.status === "Partial Shipment" ? "fsn-row-info bg-orange-50" : "";
              return (<tr key={r.id} className={`border-b hover:bg-red-50/50 ${rowCls}`}>
                <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                <td className="px-3 py-2"><span className="fsn-badge inline-block px-2 py-0.5 rounded text-xs bg-red-100 text-red-700 font-mono">{r.poNo}</span></td>
                <td className="px-3 py-2 text-xs">{r.superstockist}</td>
                <td className="px-3 py-2 text-xs">{r.brand}</td>
                <td className="px-3 py-2"><span className="fsn-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.category}</span></td>
                <td className="px-3 py-2"><span className="fsn-badge inline-block px-2 py-0.5 rounded text-xs bg-red-50 text-red-600">{r.channel}</span></td>
                <td className="px-3 py-2 text-xs">{r.state}</td>
                <td className="px-3 py-2 text-xs">{r.city}</td>
                <td className="px-3 py-2 text-xs font-medium">{r.skuCount}</td>
                <td className="px-3 py-2 text-xs">{r.totalCases}</td>
                <td className="px-3 py-2 text-xs font-semibold">{fmtVal(r.orderValue)}</td>
                <td className="px-3 py-2 text-xs">{r.margin}%</td>
                <td className="px-3 py-2 text-xs text-gray-500">{r.deliveryDate}</td>
                <td className="px-3 py-2"><span className={`fsn-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[statusColor[r.status]]}`}>{r.status}</span></td>
                <td className="px-3 py-2 text-xs">{r.primarySKU}</td>
                <td className="px-3 py-2 text-xs text-gray-500">{r.scheme}</td>
                <td className="px-3 py-2 text-xs">{r.salesman}</td>
                <td className="px-3 py-2 text-xs">{r.warehouse}</td>
                <td className="px-3 py-2 text-xs">{r.transportMode}</td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-32 truncate">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="fsn-analytics space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="fsn-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Order Value by Superstockist</h3><BarChart data={SUPERSTOCKISTS.slice(0,6).map(s => ({ n: s.split(" ")[0], v: +ri(28, 95, 55 + Math.random() * 30).toFixed(0) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#dc2626" radius={[4,4,0,0]} /></BarChart></div>
            <div className="fsn-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Revenue by State</h3><AreaChart data={Array.from({ length: 12 }, (_, i) => ({ m: MO[i], west: ri(55, 135, 88 + Math.sin(i*0.5)*22), south: ri(42, 108, 72 + Math.cos(i*0.6)*18), north: ri(38, 92, 62 + Math.sin(i*0.7)*15) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Area type="monotone" dataKey="west" stackId="1" stroke="#dc2626" fill="#fee2e2" name="West" /><Area type="monotone" dataKey="south" stackId="1" stroke="#ef4444" fill="#fecaca" name="South" /><Area type="monotone" dataKey="north" stackId="1" stroke="#f87171" fill="#fca5a5" name="North" /></AreaChart></div>
          </div>
          <div className="fsn-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Margin % by Category</h3><BarChart data={CATEGORIES.map(c => ({ n: c, v: +ri(8, 18, 12 + Math.random() * 4).toFixed(1) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis domain={[5, 20]} /><Tooltip /><Bar dataKey="v" fill="#ef4444" radius={[4,4,0,0]} name="Margin %" /></BarChart></div>
        </div>
      )}

      {tab === 3 && (
        <div className="fsn-insights grid grid-cols-2 gap-6">{INSIGHTS.map(ins => (<div key={ins.t} className="fsn-insight bg-white rounded-lg border p-5"><h3 className="text-base font-bold text-red-800 mb-2">{ins.t}</h3><p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p></div>))}</div>
      )}
    </div>
  );
}
