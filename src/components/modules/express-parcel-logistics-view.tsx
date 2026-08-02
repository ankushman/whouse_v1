"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#7c3aed", "#8b5cf6", "#a78bfa", "#c4b5fd", "#6d28d9", "#5b21b6", "#ddd6fe", "#ede9fe"];
const HUBS = ["Delhi NCR Hub", "Mumbai Hub", "Bangalore Hub", "Hyderabad Hub", "Kolkata Hub", "Chennai Hub", "Jaipur Hub", "Ahmedabad Hub"];
const CATEGORIES = ["E-commerce", "Pharma / Medical", "Electronics", "Documents / Legal", "FMCG / Grocery", "Auto Parts", "Fashion / Apparel", "Perishables"];
const SHIPMENT_STATUSES = ["In Hub", "In Transit", "Out for Delivery", "Delivered", "Exception / RTO", "Delayed"];
const ZONES = ["North Zone", "West Zone", "South Zone", "East Zone", "Central Zone", "NE Zone"];
const MODES = ["Air Express", "Surface Express", "Rail Express", "Last Mile EV", "Drone Delivery", "Metro Pallet"];
const TABS = ["Dashboard", "Shipment Registry", "Express Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", blue: "bg-blue-100 text-blue-700", slate: "bg-slate-100 text-slate-600", orange: "bg-orange-100 text-orange-700" };
const statusColor: Record<string, string> = { "In Hub": "slate", "In Transit": "blue", "Out for Delivery": "amber", "Delivered": "green", "Exception / RTO": "red", "Delayed": "orange" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyShipments = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], ecommerce: ri(2800, 5200, 3800 + Math.sin(i * 0.5) * 600), pharma: ri(800, 1500, 1100 + Math.cos(i * 0.6) * 200), electronics: ri(1200, 2200, 1600 + Math.sin(i * 0.7) * 300), docs: ri(500, 900, 680 + Math.cos(i * 0.8) * 120) }));
const categoryDist = [{ n: "E-commerce", v: 38 }, { n: "Electronics", v: 16 }, { n: "Pharma / Medical", v: 12 }, { n: "Fashion / Apparel", v: 14 }, { n: "FMCG / Grocery", v: 10 }, { n: "Documents / Legal", v: 4 }, { n: "Auto Parts", v: 3 }, { n: "Perishables", v: 3 }];
const slaTrend = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], actual: +(ri(88, 98, 93 + Math.sin(i * 0.4) * 3)).toFixed(1), target: 95.0 }));
const hubPerf = HUBS.slice(0, 6).map(h => ({ n: h.replace(" Hub", ""), v: +ri(82, 98, 90 + Math.random() * 6).toFixed(0) }));

interface ShipmentRecord { id: string; awbNo: string; hub: string; origin: string; destination: string; category: string; item: string; weight: number; declaredValue: number; mode: string; zone: string; shipDate: string; deliveryDate: string; eta: string; transitHrs: number; codAmount: number; status: string; remarks: string; }

const records: ShipmentRecord[] = [
  { id: "EPL-0001", awbNo: "AWB-DEL/2025/78234501", hub: "Delhi NCR Hub", origin: "Gurgaon Warehouse", destination: "Noida Sector-18", category: "E-commerce", item: "Smartphone - OnePlus 12R", weight: 0.45, declaredValue: 35999, mode: "Last Mile EV", zone: "North Zone", shipDate: "2025-07-12", deliveryDate: "2025-07-13", eta: "2025-07-13", transitHrs: 18, codAmount: 0, status: "In Transit", remarks: "Flipkart smartphone delivery - prepaid" },
  { id: "EPL-0002", awbNo: "AWB-MUM/2025/64512890", hub: "Mumbai Hub", origin: "Andheri CDC", destination: "Pune Hinjewadi IT Park", category: "Electronics", item: "Laptop Dell Inspiron 15", weight: 2.8, declaredValue: 62490, mode: "Surface Express", zone: "West Zone", shipDate: "2025-07-11", deliveryDate: "2025-07-12", eta: "2025-07-12", transitHrs: 12, codAmount: 0, status: "Delivered", remarks: "Dell laptop B2B IT hardware delivery" },
  { id: "EPL-0003", awbNo: "AWB-BLR/2025/91345678", hub: "Bangalore Hub", origin: "Whitefield DC", destination: "Koramangala Residence", category: "Pharma / Medical", item: "Insulin Pens Novo Nordisk", weight: 0.3, declaredValue: 4500, mode: "Air Express", zone: "South Zone", shipDate: "2025-07-12", deliveryDate: "", eta: "2025-07-13", transitHrs: 24, codAmount: 0, status: "Out for Delivery", remarks: "Cold chain pharma - temperature monitored" },
  { id: "EPL-0004", awbNo: "AWB-HYD/2025/82345612", hub: "Hyderabad Hub", origin: "Medchal Sort Center", destination: "Visakhapatnam Port Area", category: "Auto Parts", item: "Hyundai Verna Brake Assembly", weight: 8.5, declaredValue: 12500, mode: "Surface Express", zone: "South Zone", shipDate: "2025-07-10", deliveryDate: "2025-07-12", eta: "2025-07-12", transitHrs: 36, codAmount: 0, status: "Delivered", remarks: "Hyundai OEM spare parts dealer delivery" },
  { id: "EPL-0005", awbNo: "AWB-KOL/2025/45129876", hub: "Kolkata Hub", origin: "Salt Lake DC", destination: "Guwahati Zoo Road", category: "Perishables", item: "Assam Tea Packets 12 KG", weight: 12.0, declaredValue: 4800, mode: "Air Express", zone: "NE Zone", shipDate: "2025-07-11", deliveryDate: "", eta: "2025-07-13", transitHrs: 48, codAmount: 0, status: "In Transit", remarks: "Premium Assam tea Kolkata to Guwahati distributor" },
  { id: "EPL-0006", awbNo: "AWB-CHN/2025/78234590", hub: "Chennai Hub", origin: "Tambaram CDC", destination: "Madurai K Pudur", category: "FMCG / Grocery", item: "Maruti Suzuki Car Shampoo 5L", weight: 5.2, declaredValue: 1200, mode: "Surface Express", zone: "South Zone", shipDate: "2025-07-12", deliveryDate: "2025-07-13", eta: "2025-07-13", transitHrs: 24, codAmount: 1200, status: "In Transit", remarks: "Amazon FMCG COD order - payment on delivery" },
  { id: "EPL-0007", awbNo: "AWB-JPR/2025/34567812", hub: "Jaipur Hub", origin: "Sitapura ICP", destination: "Jodhpur PA Lancer Road", category: "Fashion / Apparel", item: "Zara Men Winter Jacket", weight: 1.2, declaredValue: 5990, mode: "Surface Express", zone: "North Zone", shipDate: "2025-07-11", deliveryDate: "", eta: "2025-07-12", transitHrs: 12, codAmount: 0, status: "Delayed", remarks: "Jaipur to Jodhpur - delayed due to highway blockade" },
  { id: "EPL-0008", awbNo: "AWB-DEL/2025/92345678", hub: "Delhi NCR Hub", origin: "IGI Airport Cargo", destination: "Connaught Place Office", category: "Documents / Legal", item: "Passport - MEA Attested", weight: 0.1, declaredValue: 500, mode: "Air Express", zone: "North Zone", shipDate: "2025-07-12", deliveryDate: "2025-07-12", eta: "2025-07-12", transitHrs: 6, codAmount: 0, status: "Delivered", remarks: "MEA attested passport same-day delivery" },
  { id: "EPL-0009", awbNo: "AWB-AHD/2025/56781234", hub: "Ahmedabad Hub", origin: "SG Highway CDC", destination: "Surat Ring Road", category: "E-commerce", item: "Samsung Galaxy S24 Ultra", weight: 0.35, declaredValue: 131999, mode: "Last Mile EV", zone: "West Zone", shipDate: "2025-07-12", deliveryDate: "", eta: "2025-07-13", transitHrs: 18, codAmount: 0, status: "In Hub", remarks: "High-value smartphone - hub scanning pending" },
  { id: "EPL-0010", awbNo: "AWB-BLR/2025/67890123", hub: "Bangalore Hub", origin: "Electronic City DC", destination: "Mysore Mandi Mohalla", category: "E-commerce", item: "Nike Air Max 270 Shoes", weight: 0.8, declaredValue: 11995, mode: "Surface Express", zone: "South Zone", shipDate: "2025-07-10", deliveryDate: "", eta: "2025-07-11", transitHrs: 8, codAmount: 0, status: "Exception / RTO", remarks: "Customer refused - RTO initiated back to Bangalore" },
  { id: "EPL-0011", awbNo: "AWB-HYD/2025/78901234", hub: "Hyderabad Hub", origin: "Gachibowli CDC", destination: "Secunderabad Marredpally", category: "Electronics", item: "iPad Air M2 256GB", weight: 0.6, declaredValue: 74900, mode: "Last Mile EV", zone: "South Zone", shipDate: "2025-07-12", deliveryDate: "2025-07-12", eta: "2025-07-12", transitHrs: 4, codAmount: 0, status: "Out for Delivery", remarks: "Apple Store fulfillment - same-day delivery" },
  { id: "EPL-0012", awbNo: "AWB-MUM/2025/89012345", hub: "Mumbai Hub", origin: "BKC Corporate Office", destination: "Pune Magarpatta City", category: "Documents / Legal", item: "Share Certificates - BSE Listed", weight: 0.15, declaredValue: 50000, mode: "Air Express", zone: "West Zone", shipDate: "2025-07-11", deliveryDate: "2025-07-11", eta: "2025-07-11", transitHrs: 3, codAmount: 0, status: "Delivered", remarks: "High-value share certificates - armed courier" },
  { id: "EPL-0013", awbNo: "AWB-KOL/2025/90123456", hub: "Kolkata Hub", origin: "Howrah Station CDC", destination: "Dhanbad Rajendra Nagar", category: "FMCG / Grocery", item: "Amul Cheese 1 KG x 24", weight: 24.0, declaredValue: 9600, mode: "Rail Express", zone: "East Zone", shipDate: "2025-07-11", deliveryDate: "2025-07-12", eta: "2025-07-12", transitHrs: 18, codAmount: 9600, status: "Delivered", remarks: "Amul distributor rail express Dhanbad" },
  { id: "EPL-0014", awbNo: "AWB-CHN/2025/12345678", hub: "Chennai Hub", origin: "Anna Nagar CDC", destination: "Tiruchirappalli BHEL", category: "Pharma / Medical", item: "Vaccine Vials Covaxin 50", weight: 3.5, declaredValue: 25000, mode: "Air Express", zone: "South Zone", shipDate: "2025-07-12", deliveryDate: "", eta: "2025-07-13", transitHrs: 12, codAmount: 0, status: "In Transit", remarks: "Cold chain vaccine - 2-8\u00b0C monitored transport" },
];

const transitCount = records.filter(r => r.status === "In Transit" || r.status === "Out for Delivery").length;
const deliveredCount = records.filter(r => r.status === "Delivered").length;
const exceptionCount = records.filter(r => r.status === "Exception / RTO" || r.status === "Delayed").length;
const totalDeclaredValue = records.reduce((s, r) => s + r.declaredValue, 0);

function fmtVal(n: number): string {
  if (n >= 10000000) return `\u20b9${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `\u20b9${(n / 100000).toFixed(1)}L`;
  return `\u20b9${(n / 1000).toFixed(0)}K`;
}

const kpis = [
  { l: "In Transit / OFD", v: transitCount, s: "active shipments" },
  { l: "Delivered", v: deliveredCount, s: "completed today" },
  { l: "Exception / RTO", v: exceptionCount, s: "needs attention" },
  { l: "Total Declared Value", v: fmtVal(totalDeclaredValue), s: "across all parcels" },
];

const INSIGHTS = [
  {
    t: "India Express Logistics: 2.5 Billion Parcels and \u20b945,000 Crore Market",
    c: "India\u2019s express logistics industry handles approximately 2.5 billion parcels annually (2024-25), making it the world\u2019s second-largest parcel market after China. The industry is valued at approximately \u20b945,000 crore (USD 5.4 billion), growing at 18-22% CAGR driven by: (1) E-commerce penetration (120+ million online shoppers, 350+ million orders/month during festive season), (2) Quick commerce and 10-minute delivery (Blinkit, Zepto, BigBasket, Swiggy Instamart), (3) D2C brand expansion (10,000+ brands using third-party logistics), and (4) Pharma/healthcare cold chain delivery (500+ million vaccine and medicine shipments). Major express logistics players include: (1) Delhivery (450+ sorting centers, 25,000+ pin codes, 22% market share), (2) BlueDart (DHL subsidiary, 350+ offices, air express network), (3) DTDC (520+ franchisee offices, 10,000+ pin codes), (4) Ekart (Flipkart logistics arm, 2,800+ distribution centers), (5) Xpressbees (650+ hubs, B2B/B2C express), (6) Ecom Express (600+ hubs, 27,000+ pin codes), (7) Amazon Transportation Services (ATS, 200+ fulfillment centers), and (8) India Post (160,000 post offices, 600,000+ villages, lowest per-parcel cost at \u20b930-40). India\u2019s express logistics employs 500,000+ delivery personnel (often called \u201cdelivery executives\u201d), with the average delivery executive handling 60-80 parcels per day in metro areas and 30-50 in Tier 2/3 cities. The industry processes approximately 6.5 million parcels per day (pre-festive) peaking at 16-18 million per day during Big Billion Days (October) and Great Indian Festival. India\u2019s average order value (AOV) for e-commerce deliveries is \u20b91,200-1,800, with COD still comprising 35-40% of orders (down from 60% in 2020). The government\u2019s Logistics Efficiency Committee targets reducing average delivery time from 48 hours to 24 hours by 2027 through: multimodal express hubs at 50 airports, dedicated express rail corridors, and 100,000+ EV last-mile vehicles.",
  },
  {
    t: "Sort Center and Hub Network: Automated Sortation, IoT Tracking, and EV Fleet",
    c: "India\u2019s express logistics infrastructure has been transformed by technology-driven sort centers and automated hubs. Modern express hubs feature: (1) Automated sortation systems (cross-belt sorters at 15,000-25,000 parcels/hour, tilt-tray sorters, and bomb-belt sorters), (2) IoT-enabled RFID tracking with real-time location updates at every scan point (average 8-12 scans per parcel journey), (3) Dimensional weight (DIM) scanners for accurate volumetric pricing (length x width x height / 5,000), (4) X-ray and AI-powered image scanning for contraband detection, (5) Temperature-controlled zones for pharma cold chain (2-8\u00b0C), and (6) EV charging infrastructure at metro hubs. Key hub infrastructure includes: (1) Delhivery\u2019s Sortation Center network: 35 mega hubs (50,000 sq ft each), 400+ micro fulfillment centers, handling 2 million parcels/day, (2) Ekart\u2019s 2,800+ distribution centers with 3PL for 1,500+ brands, (3) Amazon India\u2019s 200+ fulfillment centers (largest: 800,000 sq ft Hyderabad) with robotic picking and packing, (4) BlueDart\u2019s aviation network: 11 dedicated aircraft (Boeing 737-700SF) with belly-hold on 350+ commercial flights, and (5) India Post\u2019s 160,000 post offices with automated mail processing centers at 28 locations. Express delivery modes include: (1) Air Express (2-4 days, premium, \u20b980-200 per kg), (2) Surface Express (3-5 days, economy, \u20b930-60 per kg), (3) Same-Day Delivery (4-8 hours, select metros, \u20b9150-300 per parcel), (4) Next-Day Delivery (18-24 hours, 80% of metro orders), and (5) 10-Minute Grocery Delivery (Blinkit/Zepto model, 50-100 orders per store per hour). India\u2019s last-mile delivery is undergoing EV transition: 100,000+ electric two-wheelers deployed by 2024 (Hero Electric, Ather Energy, TVS iQube), with companies like Zomato, Swiggy, and Amazon targeting 100% EV last-mile by 2030. Express logistics cost in India averages \u20b950-80 per parcel (versus \u20b9250-350 in Southeast Asia and \u20b9450-600 in Europe), making it one of the most cost-efficient express markets globally.",
  },
  {
    t: "SLA Management and Exception Handling: COD, RTO, and NDR Operations",
    c: "India\u2019s express logistics SLA management is complex due to COD prevalence, address ambiguity, and customer behavior. Key metrics and operations include: (1) SLA compliance (95%+ target for next-day, 98%+ for same-day, measured on-time delivery rate), (2) First Attempt Delivery Rate (FADR): 70-75% in metros, 55-60% in Tier 2/3 cities (improved from 50% in 2020 through advance SMS/WhatsApp notifications), (3) COD operations: 35-40% of e-commerce orders are Cash on Delivery, with \u20b975,000 crore in COD collections monthly, handled through: cash pickup by delivery partner, digital reconciliation via POS machines and UPI, and cash deposit at bank within T+1, (4) Non-Delivery Report (NDR): 15-20% of shipments generate NDR due to customer unavailable, wrong address, refused delivery, or address incomplete, with NDR resolution time target of 24 hours, (5) Return to Origin (RTO): 8-12% of e-commerce shipments are returned, with RTO cost of \u20b980-120 per parcel (round-trip shipping cost), and (6) Exception management: lost parcels (0.3-0.5%), damaged parcels (1-2%), and counterfeit claims handled through video proof of delivery (VPOD), OTP-based delivery confirmation, and GPS-timestamped delivery photos. India\u2019s express logistics companies invest heavily in customer experience: (1) WhatsApp/SMS notifications at 5 touchpoints (order picked up, in transit, out for delivery, delivered, feedback), (2) Real-time map tracking (Google Maps integration showing delivery partner route), (3) Preferred time slot delivery (morning 8-12, afternoon 12-4, evening 4-8), (4) Self-service NDR resolution (reschedule, cancel, change address via app), and (5) Instant refund for lost/damaged parcels (within 24-48 hours). Companies with AI-powered NDR prediction report 25% reduction in RTO rates and 15% improvement in FADR. The India Express Logistics market\u2019s unit economics: average revenue per parcel \u20b965-80, average cost \u20b955-70, contribution margin \u20b98-15 per parcel, with profitability driven by volume and B2B bulk contracts.",
  },
  {
    t: "Cross-Border Express: International Parcels, Customs, and E-Commerce Export",
    c: "India\u2019s cross-border express logistics handles 350+ million international parcels annually (2024-25), comprising: (1) Inbound (250+ million): imports from China (60%), USA (15%), UAE (8%), UK (5%), and others (12%), primarily e-commerce (AliExpress, Amazon Global, Shein, Temu), with average duty of 18-28% IGST + 10% social welfare surcharge, (2) Outbound (100+ million): exports of pharma (35%), textiles/apparel (25%), gems and jewelry (15%), spices (10%), and auto components (5%), primarily to USA (40%), UAE (20%), UK (15%), and EU (10%). Key cross-border express operators include: (1) DHL Express India (30% market share, 18 dedicated aircraft, 60+ gateways), (2) FedEx India (20%, 12 aircraft, 45+ gateways), (3) BlueDart (DHL subsidiary, air express), (4) India Post EMS (150 countries, lowest cost at \u20b9800-1,500 for 500g), (5) Aramex India (Middle East specialist), and (6) Shiprocket Global (aggregator for D2C exporters). Cross-border parcel processing involves: (1) Customs filing (SITA/ICEGATE integration, average clearance time 12-24 hours for air express), (2) HS code classification (6-digit or 8-digit for specific items), (3) Duty calculation (IGST 18% + social welfare surcharge 10% on most items), (4) KYC verification for consignee (Aadhaar/PAN for high-value shipments), and (5) Phytosanitary certification for plant/seed imports. India\u2019s Cross-Border E-commerce policy 2024 has simplified: (1) Duty-free limit increased to \u20b97,000 per consignment (from \u20b92,000), (2) Self-declaration for low-value parcels (under \u20b95,000), (3) Single-window clearance for D2C exporters via India Post and FedEx, and (4) QR code-based track-and-trace for all international parcels. India\u2019s D2C cross-border export opportunity is \u20b915,000 crore by 2028, with Shopify/Amazon Global enabling 50,000+ Indian merchants to sell internationally. Average cross-border delivery time: China to India 5-8 days, India to USA 5-7 days, India to UAE 3-4 days, India to UK 6-9 days. India\u2019s Postal Operations efficiency: 95%+ domestic delivery within 2-5 days, 85%+ international delivery within 7-14 days, making India Post one of the world\u2019s largest and most affordable cross-border logistics networks.",
  },
];

export default function ExpressParcelLogisticsView() {
  const [tab, setTab] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const filterGroups = [
    { key: "status", label: "Status", options: SHIPMENT_STATUSES.map(s => ({ value: s, count: records.filter(r => r.status === s).length })) },
    { key: "category", label: "Category", options: CATEGORIES.map(c => ({ value: c, count: records.filter(r => r.category === c).length })) },
    { key: "mode", label: "Delivery Mode", options: MODES.map(m => ({ value: m, count: records.filter(r => r.mode === m).length })) },
    { key: "zone", label: "Zone", options: ZONES.map(z => ({ value: z, count: records.filter(r => r.zone === z).length })) },
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.awbNo.toLowerCase().includes(q) && !r.hub.toLowerCase().includes(q) && !r.item.toLowerCase().includes(q) && !r.origin.toLowerCase().includes(q) && !r.destination.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof ShipmentRecord] as string));
  });

  return (
    <div className="epl-root p-6 space-y-6">
      <PageHeader title="Express Parcel Logistics" description="India express delivery network, e-commerce parcel sortation and hub operations, same-day next-day surface air express delivery, COD/RTO/NDR management, cross-border international parcels, and EV last-mile fleet" />
      <div className="epl-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`epl-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-violet-700 text-white" : "text-gray-600 hover:bg-violet-50"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="epl-dash space-y-6">
          <div className="epl-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (<div key={k.l} className="epl-kpi bg-white rounded-lg border p-4"><div className="text-xs text-gray-500 epl-kpi-label">{k.l}</div><div className="text-2xl font-bold text-violet-700 epl-kpi-val">{k.v}</div><div className="text-xs text-gray-400 epl-kpi-sub">{k.s}</div></div>))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="epl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Shipments by Category (KT)</h3><BarChart data={monthlyShipments} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="ecommerce" fill="#7c3aed" radius={[4,4,0,0]} name="E-commerce" /><Bar dataKey="pharma" fill="#8b5cf6" radius={[4,4,0,0]} name="Pharma" /><Bar dataKey="electronics" fill="#a78bfa" radius={[4,4,0,0]} name="Electronics" /><Bar dataKey="docs" fill="#c4b5fd" radius={[4,4,0,0]} name="Documents" /></BarChart></div>
            <div className="epl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Category Distribution</h3><PieChart width={400} height={220}><Pie data={categoryDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{categoryDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="epl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">SLA Compliance Rate (%) vs 95% Target</h3><LineChart data={slaTrend} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[85, 100]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#7c3aed" strokeWidth={2} name="Actual %" /><Line type="monotone" dataKey="target" stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" name="Target" /></LineChart></div>
            <div className="epl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Hub Performance Score</h3><BarChart data={hubPerf} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis domain={[80, 100]} /><Tooltip /><Bar dataKey="v" fill="#8b5cf6" radius={[4,4,0,0]} name="Score" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="epl-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "Express Parcel", href: "#" }, { label: "Shipment Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="epl-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{"ID,AWB No,Hub,Origin,Destination,Category,Item,Wt (kg),Mode,Zone,Ship Date,ETA,Transit (h),COD (\u20b9),Status,Value,Remarks"
                .split(",").map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const rowCls = r.status === "Exception / RTO" ? "epl-row-critical bg-red-50" : r.status === "Delayed" ? "epl-row-warning bg-amber-50" : r.status === "In Transit" ? "epl-row-info bg-blue-50" : "";
              return (<tr key={r.id} className={`border-b hover:bg-violet-50/30 ${rowCls}`}>
                <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                <td className="px-3 py-2"><span className="epl-badge inline-block px-2 py-0.5 rounded text-xs bg-violet-700 text-white font-mono">{r.awbNo}</span></td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.hub}</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.origin}</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.destination}</td>
                <td className="px-3 py-2"><span className="epl-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.category}</span></td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.item}</td>
                <td className="px-3 py-2 text-xs text-right font-semibold">{r.weight}</td>
                <td className="px-3 py-2 text-xs">{r.mode}</td>
                <td className="px-3 py-2 text-xs">{r.zone}</td>
                <td className="px-3 py-2 text-xs">{r.shipDate}</td>
                <td className="px-3 py-2 text-xs">{r.eta}</td>
                <td className="px-3 py-2"><span className={`text-xs font-semibold ${r.transitHrs > 24 ? "text-amber-600" : "text-green-600"}`}>{r.transitHrs}h</span></td>
                <td className="px-3 py-2 text-xs font-semibold">{r.codAmount > 0 ? r.codAmount.toLocaleString() : <span className="text-gray-400">-</span>}</td>
                <td className="px-3 py-2"><span className={`epl-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[statusColor[r.status]]}`}>{r.status}</span></td>
                <td className="px-3 py-2 text-xs font-semibold text-violet-700">{fmtVal(r.declaredValue)}</td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-32 truncate">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="epl-analytics space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="epl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Shipments by Hub</h3><BarChart data={HUBS.slice(0,6).map(h => ({ n: h.replace(" Hub",""), v: +ri(28, 85, 52 + Math.random() * 22).toFixed(0) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#7c3aed" radius={[4,4,0,0]} name="Shipments (KT)" /></BarChart></div>
            <div className="epl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Shipments by Zone Corridor</h3><AreaChart data={Array.from({ length: 12 }, (_, i) => ({ m: MO[i], north: ri(220, 380, 280 + Math.sin(i*0.5)*35), west: ri(180, 320, 240 + Math.cos(i*0.6)*30), south: ri(200, 360, 260 + Math.sin(i*0.7)*28) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Area type="monotone" dataKey="north" stackId="1" stroke="#7c3aed" fill="#ede9fe" name="North" /><Area type="monotone" dataKey="west" stackId="1" stroke="#8b5cf6" fill="#ddd6fe" name="West" /><Area type="monotone" dataKey="south" stackId="1" stroke="#a78bfa" fill="#f5f3ff" name="South" /></AreaChart></div>
          </div>
          <div className="epl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Avg Transit Hours by Delivery Mode</h3><BarChart data={[{n:"Air Express",v:12},{n:"Surface Express",v:36},{n:"Rail Express",v:18},{n:"Last Mile EV",v:8},{n:"Drone Delivery",v:2},{n:"Metro Pallet",v:4}].map(d => ({...d, v: +ri(d.v-2, d.v+4, d.v + Math.random()*3).toFixed(0)}))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#8b5cf6" radius={[4,4,0,0]} name="Hours" /></BarChart></div>
        </div>
      )}

      {tab === 3 && (
        <div className="epl-insights grid grid-cols-2 gap-6">{INSIGHTS.map(ins => (<div key={ins.t} className="epl-insight bg-white rounded-lg border p-5"><h3 className="text-base font-bold text-violet-800 mb-2">{ins.t}</h3><p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p></div>))}</div>
      )}
    </div>
  );
}
