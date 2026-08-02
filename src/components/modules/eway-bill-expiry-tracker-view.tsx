"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#0369a1", "#0ea5e9", "#38bdf8", "#7dd3fc", "#0284c7", "#075985", "#bae6fd", "#e0f2fe"];
const TRANSPORTERS = ["TCI Express", "Delhivery B2B", "VRL Logistics", "Blue Dart", "Gati", "Rivigo", "Shadowfax", "DTDC Cargo"];
const EWB_STATUS = ["Active", "Expiring Soon", "Expired", "Extended", "Cancelled", "Partially Valid"];
const SUPPLY_STATES = ["Maharashtra", "Gujarat", "Karnataka", "Tamil Nadu", "Delhi NCR", "Telangana", "Rajasthan", "UP"];
const CONSIGNEE_STATES = ["Maharashtra", "Gujarat", "Karnataka", "West Bengal", "Delhi NCR", "Kerala", "MP", "Punjab"];
const GOODS_TYPES = ["FMCG", "Electronics", "Pharma", "Auto Parts", "Textiles", "Agri Products", "Steel", "Chemicals"];
const TABS = ["Dashboard", "E-Way Bill Registry", "Expiry Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", sky: "bg-sky-100 text-sky-700", slate: "bg-slate-100 text-slate-600", teal: "bg-teal-100 text-teal-700" };
const statusColor: Record<string, string> = { "Active": "green", "Expiring Soon": "amber", "Expired": "red", "Extended": "sky", "Cancelled": "slate", "Partially Valid": "teal" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyEwb = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], generated: ri(320, 680, 480 + Math.sin(i * 0.5) * 140), expired: ri(12, 48, 28 + Math.cos(i * 0.7) * 10), extended: ri(25, 85, 50 + Math.sin(i * 0.6) * 18) }));
const expiryDist = [{ n: "< 6 Hours", v: 14 }, { n: "6-12 Hours", v: 22 }, { n: "12-24 Hours", v: 32 }, { n: "1-3 Days", v: 48 }, { n: "3-7 Days", v: 65 }, { n: "7+ Days", v: 19 }];
const complianceTrend = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], compliance: +(ri(88, 98, 91 + i * 0.5)).toFixed(1), target: 95.0 }));
const transporterCompliance = TRANSPORTERS.slice(0, 6).map(t => ({ n: t, score: +(ri(82, 98, 89 + Math.random() * 7)).toFixed(1) }));

interface EwbRecord { id: string; ewbNo: string; genDate: string; validTill: string; transporter: string; fromState: string; toState: string; goodsType: string; hsnCode: string; taxableValue: number; taxAmount: number; totalInvValue: number; vehicleNo: string; distance: number; status: string; extendCount: number; transitScanCount: number; lastScan: string; consignor: string; consignee: string; docType: string; reasonCode: string; }

const records: EwbRecord[] = [
  { id: "EWT-0001", ewbNo: "371002847654320", genDate: "2025-01-15 09:30", validTill: "2025-01-18 23:59", transporter: "TCI Express", fromState: "Maharashtra", toState: "Gujarat", goodsType: "FMCG", hsnCode: "2106.90", taxableValue: 485000, taxAmount: 87300, totalInvValue: 572300, vehicleNo: "MH-12-AB-1234", distance: 465, status: "Active", extendCount: 0, transitScanCount: 3, lastScan: "2025-01-16 14:20 Nashik Toll", consignor: "Godrej Consumer Products", consignee: "Reliance Retail Ahmedabad", docType: "Invoice", reasonCode: "Supply" },
  { id: "EWT-0002", ewbNo: "291002847654321", genDate: "2025-01-14 11:15", validTill: "2025-01-17 23:59", transporter: "Delhivery B2B", fromState: "Karnataka", toState: "Tamil Nadu", goodsType: "Electronics", hsnCode: "8517.12", taxableValue: 1280000, taxAmount: 230400, totalInvValue: 1510400, vehicleNo: "KA-01-CD-5678", distance: 350, status: "Expiring Soon", extendCount: 0, transitScanCount: 5, lastScan: "2025-01-17 10:00 Hosur Checkpost", consignor: "Wipro Enterprise", consignee: "Chennai Tech Distributors", docType: "Delivery Challan", reasonCode: "Supply" },
  { id: "EWT-0003", ewbNo: "061002847654322", genDate: "2025-01-12 08:45", validTill: "2025-01-15 23:59", transporter: "VRL Logistics", fromState: "Gujarat", toState: "Rajasthan", goodsType: "Pharma", hsnCode: "3004.90", taxableValue: 2340000, taxAmount: 421200, totalInvValue: 2761200, vehicleNo: "GJ-05-EF-9012", distance: 520, status: "Expired", extendCount: 1, transitScanCount: 4, lastScan: "2025-01-15 18:30 Udaipur Depot", consignor: "Zydus Lifesciences", consignee: "Jaipur Medical Supply", docType: "Invoice", reasonCode: "Supply" },
  { id: "EWT-0004", ewbNo: "371002847654323", genDate: "2025-01-16 07:00", validTill: "2025-01-19 23:59", transporter: "Blue Dart", fromState: "Maharashtra", toState: "Delhi NCR", goodsType: "Auto Parts", hsnCode: "8708.99", taxableValue: 672000, taxAmount: 120960, totalInvValue: 792960, vehicleNo: "MH-14-GH-3456", distance: 1200, status: "Active", extendCount: 0, transitScanCount: 2, lastScan: "2025-01-16 16:45 Mumbai T2 Express", consignor: "Bosch Ltd Pune", consignee: "Maruti Suzuki Gurgaon", docType: "Invoice", reasonCode: "Supply" },
  { id: "EWT-0005", ewbNo: "361002847654324", genDate: "2025-01-10 14:30", validTill: "2025-01-13 23:59", transporter: "Gati", fromState: "Telangana", toState: "Karnataka", goodsType: "Textiles", hsnCode: "6203.42", taxableValue: 389000, taxAmount: 70020, totalInvValue: 459020, vehicleNo: "TS-08-IJ-7890", distance: 570, status: "Extended", extendCount: 2, transitScanCount: 7, lastScan: "2025-01-16 08:15 Bangalore DC Entry", consignor: "Gokuldas Exports Hyderabad", consignee: "Myntra Fashion Warehouse", docType: "Invoice", reasonCode: "Export" },
  { id: "EWT-0006", ewbNo: "091002847654325", genDate: "2025-01-13 10:20", validTill: "2025-01-16 23:59", transporter: "Rivigo", fromState: "UP", toState: "West Bengal", goodsType: "Steel", hsnCode: "7208.25", taxableValue: 4500000, taxAmount: 810000, totalInvValue: 5310000, vehicleNo: "UP-81-JK-1122", distance: 880, status: "Active", extendCount: 0, transitScanCount: 4, lastScan: "2025-01-15 22:00 Varanasi NH", consignor: "Tata Steel Jamshedpur", consignee: "Kolkata Steel Merchants", docType: "Invoice", reasonCode: "Supply" },
  { id: "EWT-0007", ewbNo: "331002847654326", genDate: "2025-01-11 06:15", validTill: "2025-01-14 23:59", transporter: "Shadowfax", fromState: "Tamil Nadu", toState: "Kerala", goodsType: "Agri Products", hsnCode: "0803.11", taxableValue: 125000, taxAmount: 22500, totalInvValue: 147500, vehicleNo: "TN-09-LM-3344", distance: 380, status: "Expired", extendCount: 0, transitScanCount: 3, lastScan: "2025-01-14 20:30 Cochin Checkpost", consignor: "Theni Agriculture Coop", consignee: "Trivandrum Fresh Mart", docType: "Invoice", reasonCode: "Supply" },
  { id: "EWT-0008", ewbNo: "241002847654327", genDate: "2025-01-15 12:00", validTill: "2025-01-18 23:59", transporter: "DTDC Cargo", fromState: "Gujarat", toState: "MP", goodsType: "Chemicals", hsnCode: "3824.99", taxableValue: 1890000, taxAmount: 340200, totalInvValue: 2230200, vehicleNo: "GJ-38-NO-5566", distance: 640, status: "Active", extendCount: 0, transitScanCount: 1, lastScan: "2025-01-15 15:00 Vadodara Exit", consignor: "Deepak Nitrite Ltd", consignee: "Indore Chem Distributors", docType: "Delivery Challan", reasonCode: "Job Work" },
  { id: "EWT-0009", ewbNo: "371002847654328", genDate: "2025-01-08 09:00", validTill: "2025-01-11 23:59", transporter: "TCI Express", fromState: "Maharashtra", toState: "Telangana", goodsType: "Electronics", hsnCode: "8544.42", taxableValue: 760000, taxAmount: 136800, totalInvValue: 896800, vehicleNo: "MH-43-PQ-7788", distance: 720, status: "Cancelled", extendCount: 0, transitScanCount: 2, lastScan: "2025-01-10 11:00 Cancelled - Order Reversed", consignor: "L&T Technology Services", consignee: "T-Hub Hyderabad", docType: "Invoice", reasonCode: "Supply" },
  { id: "EWT-0010", ewbNo: "051002847654329", genDate: "2025-01-14 16:30", validTill: "2025-01-17 23:59", transporter: "VRL Logistics", fromState: "Karnataka", toState: "Delhi NCR", goodsType: "FMCG", hsnCode: "3305.10", taxableValue: 562000, taxAmount: 101160, totalInvValue: 663160, vehicleNo: "KA-03-RS-9900", distance: 2100, status: "Expiring Soon", extendCount: 0, transitScanCount: 6, lastScan: "2025-01-17 14:00 Gwalior Bypass", consignor: "Hindustan Unilever Bangalore", consignee: "DMart Distribution Noida", docType: "Invoice", reasonCode: "Supply" },
  { id: "EWT-0011", ewbNo: "071002847654330", genDate: "2025-01-13 08:00", validTill: "2025-01-16 23:59", transporter: "Blue Dart", fromState: "Delhi NCR", toState: "Tamil Nadu", goodsType: "Pharma", hsnCode: "3004.10", taxableValue: 3120000, taxAmount: 561600, totalInvValue: 3681600, vehicleNo: "DL-08-TU-1121", distance: 2150, status: "Active", extendCount: 0, transitScanCount: 4, lastScan: "2025-01-15 20:00 Nagpur Transit", consignor: "Sun Pharma Gurgaon", consignee: "Apollo Pharmacy Chennai", docType: "Invoice", reasonCode: "Supply" },
  { id: "EWT-0012", ewbNo: "271002847654331", genDate: "2025-01-12 13:45", validTill: "2025-01-15 23:59", transporter: "Delhivery B2B", fromState: "Maharashtra", toState: "Punjab", goodsType: "Auto Parts", hsnCode: "8483.10", taxableValue: 445000, taxAmount: 80100, totalInvValue: 525100, vehicleNo: "MH-15-VW-2233", distance: 1600, status: "Partially Valid", extendCount: 1, transitScanCount: 5, lastScan: "2025-01-16 06:30 Jalandhar Entry", consignor: "Bharat Forge Pune", consignee: "Vardhman Auto Ludhiana", docType: "Invoice", reasonCode: "Supply" },
  { id: "EWT-0013", ewbNo: "191002847654332", genDate: "2025-01-15 10:00", validTill: "2025-01-18 23:59", transporter: "Rivigo", fromState: "West Bengal", toState: "Rajasthan", goodsType: "Textiles", hsnCode: "5407.61", taxableValue: 678000, taxAmount: 122040, totalInvValue: 800040, vehicleNo: "WB-06-XY-4455", distance: 1450, status: "Active", extendCount: 0, transitScanCount: 1, lastScan: "2025-01-15 14:30 Howrah Exit", consignor: "Arvind Mills Kolkata", consignee: "Jaipur Textile Traders", docType: "Invoice", reasonCode: "Supply" },
  { id: "EWT-0014", ewbNo: "371002847654333", genDate: "2025-01-09 07:30", validTill: "2025-01-12 23:59", transporter: "Gati", fromState: "Maharashtra", toState: "UP", goodsType: "Steel", hsnCode: "7210.41", taxableValue: 8900000, taxAmount: 1602000, totalInvValue: 10502000, vehicleNo: "MH-12-ZA-6677", distance: 1350, status: "Extended", extendCount: 3, transitScanCount: 8, lastScan: "2025-01-17 12:00 Lucknow ICD Entry", consignor: "JSW Steel Dolvi", consignee: "NTPC procurement Lucknow", docType: "Delivery Challan", reasonCode: "Supply" },
];

const activeCount = records.filter(r => r.status === "Active").length;
const expiringCount = records.filter(r => r.status === "Expiring Soon").length;
const expiredCount = records.filter(r => r.status === "Expired").length;
const totalInvValue = records.reduce((s, r) => s + r.totalInvValue, 0);

function fmtVal(n: number): string {
  if (n >= 10000000) return `\u20b9${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `\u20b9${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `\u20b9${(n / 1000).toFixed(1)}K`;
  return `\u20b9${n}`;
}

const kpis = [
  { l: "Active E-Way Bills", v: activeCount, s: "in transit currently" },
  { l: "Expiring Soon", v: expiringCount, s: "within 24 hours" },
  { l: "Expired", v: expiredCount, s: "need extension/cancel" },
  { l: "Total Invoice Value", v: fmtVal(totalInvValue), s: "across all consignments" },
];

const INSIGHTS = [
  {
    t: "India E-Way Bill System: 85 Crore+ Bills Generated Since GST Launch 2017",
    c: "India\u2019s e-way bill system, mandated under GST since April 2018 for inter-state movement of goods valued above \u20b950,000, has processed over 85 crore e-way bills as of FY2025, averaging 18-22 lakh bills generated daily on the NIC-operated portal (ewaybill.nic.in). The system covers 37 states and UTs with real-time API integration for GSTN verification, transport ID linking, and transit scan event capture. Each e-way bill is valid for 1 day per 200 km of distance (e.g., a 1,000 km consignment gets 5 days validity), with provisions for extension up to 3 times before expiry, and a partial consignment extension mechanism allowing multi-drop deliveries on a single bill. The compliance landscape is significant: approximately 4.5% of e-way bills expire without extension, triggering potential GST scrutiny, while 12% require at least one extension due to transit delays, vehicle breakdowns, or checkpoint congestion. State commercial tax departments conduct e-way bill verification drives at interstate border checkposts, with Gujarat, Maharashtra, and Karnataka accounting for 65% of all e-way bill interceptions. For logistics operators managing 500+ monthly consignments, an e-way bill expiry tracking system that provides 48-hour, 24-hour, and 6-hour pre-expiry alerts with one-click extension capability reduces compliance risk by 90% and eliminates the average \u20b915,000 penalty per expired bill (2x tax amount or \u20b925,000, whichever is higher under Section 129(3) of CGST Act).",
  },
  {
    t: "E-Way Bill Extension Workflow: Auto-Extension vs Manual Compliance",
    c: "The e-way bill extension process under GST rules allows a transporter or consignor to extend the validity of an e-way bill either before or after expiry. Pre-expiry extension (within the validity period) is free and carries no penalty risk, while post-expiry extension within 24 hours of expiry is allowed with a justified reason code. The NIC portal provides 8 standard reason codes for extension: Transit delay due to natural calamity, Vehicle breakdown, Accident, Transhipment, Strike/Bandh, Checkpost congestion, IT system failure at GST portal, and Any other exceptional circumstance. Indian logistics companies report that 60% of extensions are triggered by checkpost congestion at major interstate borders (Ghaziabad-Delhi border, Hosur-Karnataka border, Vashi-Thane checkpost), while 25% are due to vehicle breakdown and 15% for transhipment during multi-modal transit. Advanced e-way bill management systems implement automated pre-expiry alerts at three thresholds: 48 hours (planning alert), 24 hours (action alert), and 6 hours (critical alert), with direct API integration to the NIC e-way bill system for one-click extension without manual portal login. Companies deploying automated expiry tracking report 95% reduction in expired bills, 88% faster extension processing (from 15 minutes manual to 2 minutes automated), and elimination of penalty notices. The financial impact for a mid-sized operator processing 5,000 monthly e-way bills is approximately \u20b922.5 lakh annual penalty savings and 120 man-hours saved per month in compliance overhead.",
  },
  {
    t: "Transit Scan Compliance: IRN-Linked E-Way Bill Verification at Checkposts",
    c: "The GST e-way bill system mandates transit scan events at every major checkpoint during goods movement, including interstate border checkposts, toll plazas with e-way bill verification capability, ICD/CFS entry and exit gates, and destination warehouse confirmation. Each scan event is captured through the transporter\u2019s mobile app (linked to the GST portal via API), RFID-based checkpost systems (deployed at 200+ locations across 12 states), or manual verification by commercial tax officers at checkposts. The scan compliance rate, measured as the percentage of mandatory scan points covered during a consignment\u2019s transit lifecycle, averages 72-78% across Indian logistics operations, with significant variation by corridor: Delhi-Mumbai industrial corridor achieves 88% scan compliance, while Northeast India routes average only 45-55% due to limited checkpost infrastructure. The integration of e-invoicing (IRN generation) with e-way bill creation (Section 23 of e-way bill rules) has enabled auto-population of consignment details, reducing manual entry errors by 95% and linking each e-way bill to a verified GST invoice. State governments are increasingly deploying AI-powered ANPR (Automatic Number Plate Recognition) cameras at interstate borders to verify vehicle numbers against e-way bill data in real-time, with Gujarat\u2019s SAFE (Smart Application for Field Enforcement) system intercepting 18,000+ non-compliant consignments in FY2024. For logistics operators, maintaining 95%+ scan compliance through driver training, route planning that avoids congested checkposts, and real-time scan status monitoring reduces the risk of detention under Section 129(1) and improves average transit time by 15-20%.",
  },
  {
    t: "Multi-State E-Way Bill Operations: Consolidated Bills and Master Documents",
    c: "For large Indian logistics operators moving goods across multiple states with multiple consignments per vehicle, the GST framework provides two critical mechanisms: (1) Consolidated e-way bill, which allows combining up to 15 individual e-way bills under a single master document for a single vehicle, and (2) E-way bill for goods transferred from one vehicle to another during transit (transhipment scenario). The consolidated e-way bill approach is extensively used by FTL (Full Truckload) operators on trunk routes like Delhi-Mumbai (NH8), Mumbai-Bangalore (NH48), and Kolkata-Chennai (NH16), where a single 20-foot container truck carries consignments from 8-12 consignors destined for multiple consignees across 2-3 states. The master document links all individual e-way bills through a unique consolidated bill number, enabling checkpost officers to verify the entire shipment with a single scan rather than checking each consignment individually, reducing checkpost dwell time from 15-20 minutes to 3-5 minutes. Transhipment tracking, critical for multi-modal operators, requires generating a fresh e-way bill when goods are transferred from one vehicle to another, with the original e-way bill marked as \u201Ctranshipped\u201D and the new bill linked to the same IRN and GST invoice. Companies operating 100+ daily multi-state consignments using consolidated bill management report 40% faster checkpost clearance, 65% reduction in documentation errors, and 30% improvement in fleet utilization due to optimized multi-consignment vehicle planning. The annual documentation savings for a large operator exceeds \u20b92.8 crore in reduced compliance staffing, eliminated penalty costs, and faster invoice processing cycles.",
  },
];

export default function EwayBillExpiryTrackerView() {
  const [tab, setTab] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const filterGroups = [
    { key: "status", label: "Status", options: EWB_STATUS.map(s => ({ value: s, count: records.filter(r => r.status === s).length })) },
    { key: "transporter", label: "Transporter", options: TRANSPORTERS.map(t => ({ value: t, count: records.filter(r => r.transporter === t).length })) },
    { key: "goodsType", label: "Goods Type", options: GOODS_TYPES.map(g => ({ value: g, count: records.filter(r => r.goodsType === g).length })) },
    { key: "fromState", label: "From State", options: SUPPLY_STATES.map(st => ({ value: st, count: records.filter(r => r.fromState === st).length })) },
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.ewbNo.toLowerCase().includes(q) && !r.transporter.toLowerCase().includes(q) && !r.consignor.toLowerCase().includes(q) && !r.consignee.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof EwbRecord] as string));
  });

  return (
    <div className="ewt-root p-6 space-y-6">
      <PageHeader title="E-Way Bill Expiry Tracker" description="GST e-way bill validity monitoring, expiry alerts, auto-extension workflow, transit scan compliance, consolidated bill management and penalty risk mitigation" />
      <div className="ewt-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`ewt-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-sky-700 text-white" : "text-gray-600 hover:bg-sky-50"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="ewt-dash space-y-6">
          <div className="ewt-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (<div key={k.l} className="ewt-kpi bg-white rounded-lg border p-4"><div className="text-xs text-gray-500 ewt-kpi-label">{k.l}</div><div className="text-2xl font-bold text-sky-700 ewt-kpi-val">{k.v}</div><div className="text-xs text-gray-400 ewt-kpi-sub">{k.s}</div></div>))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="ewt-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly E-Way Bills Generated / Expired / Extended</h3><BarChart data={monthlyEwb} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="generated" fill="#0369a1" radius={[4,4,0,0]} name="Generated" /><Bar dataKey="expired" fill="#ef4444" radius={[4,4,0,0]} name="Expired" /><Bar dataKey="extended" fill="#0ea5e9" radius={[4,4,0,0]} name="Extended" /></BarChart></div>
            <div className="ewt-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">E-Way Bill Expiry Distribution</h3><PieChart width={400} height={220}><Pie data={expiryDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{expiryDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="ewt-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">E-Way Bill Compliance Trend (%)</h3><LineChart data={complianceTrend} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[85, 100]} /><Tooltip /><Legend /><Line type="monotone" dataKey="compliance" stroke="#0369a1" strokeWidth={2} name="Compliance %" /><Line type="monotone" dataKey="target" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 5" name="Target 95%" /></LineChart></div>
            <div className="ewt-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Transporter Compliance Scorecard</h3><BarChart data={transporterCompliance} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis domain={[75, 100]} /><Tooltip /><Bar dataKey="score" fill="#0ea5e9" radius={[4,4,0,0]} name="Score %" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="ewt-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "E-Way Bill", href: "#" }, { label: "Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="ewt-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{"ID,E-Way Bill No,Generated,Valid Till,Transporter,From,To,Goods,HSN,Inv Value,Tax,Vehicle,Distance,Status,Extends,Scans,Last Scan,Consignor,Consignee,Doc Type,Reason"
                .split(",").map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const rowCls = r.status === "Expired" ? "ewt-row-critical bg-red-50" : r.status === "Expiring Soon" ? "ewt-row-warning bg-amber-50" : "";
              return (<tr key={r.id} className={`border-b hover:bg-sky-50/50 ${rowCls}`}>
                <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                <td className="px-3 py-2"><span className="ewt-badge inline-block px-2 py-0.5 rounded text-xs bg-sky-100 text-sky-700 font-mono">{r.ewbNo}</span></td>
                <td className="px-3 py-2 text-xs text-gray-500">{r.genDate}</td>
                <td className="px-3 py-2 text-xs font-semibold">{r.validTill}</td>
                <td className="px-3 py-2 text-xs">{r.transporter}</td>
                <td className="px-3 py-2 text-xs">{r.fromState}</td>
                <td className="px-3 py-2 text-xs">{r.toState}</td>
                <td className="px-3 py-2"><span className="ewt-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.goodsType}</span></td>
                <td className="px-3 py-2 text-xs font-mono">{r.hsnCode}</td>
                <td className="px-3 py-2 text-xs font-semibold">{fmtVal(r.totalInvValue)}</td>
                <td className="px-3 py-2 text-xs text-gray-500">{fmtVal(r.taxAmount)}</td>
                <td className="px-3 py-2 text-xs font-mono">{r.vehicleNo}</td>
                <td className="px-3 py-2 text-xs">{r.distance} km</td>
                <td className="px-3 py-2"><span className={`ewt-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[statusColor[r.status]]}`}>{r.status}</span></td>
                <td className="px-3 py-2">{r.extendCount > 0 ? <span className="ewt-badge inline-block px-2 py-0.5 rounded text-xs bg-amber-100 text-amber-700">{r.extendCount}x</span> : <span className="text-slate-400 text-xs">0</span>}</td>
                <td className="px-3 py-2"><div className="flex items-center gap-1"><span className="text-xs">{r.transitScanCount}</span><span className="text-xs text-gray-400">scans</span></div></td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-40 truncate">{r.lastScan}</td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.consignor}</td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.consignee}</td>
                <td className="px-3 py-2 text-xs">{r.docType}</td>
                <td className="px-3 py-2 text-xs">{r.reasonCode}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="ewt-analytics space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="ewt-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">E-Way Bills by Goods Type</h3><BarChart data={GOODS_TYPES.map(g => ({ n: g, v: +ri(28, 95, 55 + Math.random() * 30).toFixed(0) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#0369a1" radius={[4,4,0,0]} /></BarChart></div>
            <div className="ewt-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Expiry Volume by State Corridor</h3><AreaChart data={Array.from({ length: 12 }, (_, i) => ({ m: MO[i], west: ri(18, 52, 32 + Math.sin(i*0.5)*10), south: ri(14, 45, 28 + Math.cos(i*0.6)*9), north: ri(20, 58, 38 + Math.sin(i*0.7)*12) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Area type="monotone" dataKey="west" stackId="1" stroke="#0369a1" fill="#e0f2fe" name="West" /><Area type="monotone" dataKey="south" stackId="1" stroke="#0ea5e9" fill="#bae6fd" name="South" /><Area type="monotone" dataKey="north" stackId="1" stroke="#38bdf8" fill="#7dd3fc" name="North" /></AreaChart></div>
          </div>
          <div className="ewt-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Extension Frequency by Transporter</h3><BarChart data={TRANSPORTERS.slice(0,6).map(tp => ({ n: tp, v: +ri(2, 32, 12 + Math.random()*14).toFixed(0) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#0ea5e9" radius={[4,4,0,0]} /></BarChart></div>
        </div>
      )}

      {tab === 3 && (
        <div className="ewt-insights grid grid-cols-2 gap-6">{INSIGHTS.map(ins => (<div key={ins.t} className="ewt-insight bg-white rounded-lg border p-5"><h3 className="text-base font-bold text-sky-800 mb-2">{ins.t}</h3><p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p></div>))}</div>
      )}
    </div>
  );
}
