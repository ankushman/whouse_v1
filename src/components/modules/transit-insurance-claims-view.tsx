"use client";
import { useState } from "react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#4338ca", "#6366f1", "#818cf8", "#a5b4fc", "#3730a3", "#312e81", "#4f46e5", "#c7d2fe"];
const INSURERS = ["National Insurance", "New India Assurance", "ICICI Lombard", "Bajaj Allianz", "HDFC ERGO", "Tata AIG", "IFFCO Tokio", "Royal Sundaram"];
const CLAIM_STATUS = ["Open", "Under Investigation", "Surveyor Assigned", "Documents Collected", "Approved", "Settled", "Rejected"];
const COVER_TYPES = ["Marine Cargo A", "Marine Cargo B", "Marine Cargo C", "Warehouse to Warehouse", "Storage Only", "Inland Transit", "Air Cargo", "Multi-Modal"];
const RISK_TYPES = ["Fire", "Theft/Pilferage", "Water Damage", "Transit Damage", "Handling Damage", "Act of God"];
const TABS = ["Dashboard", "Policy & Claims Registry", "Claims Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", indigo: "bg-indigo-100 text-indigo-700", slate: "bg-slate-100 text-slate-600", orange: "bg-orange-100 text-orange-700" };
const statusColor: Record<string, string> = { Open: "red", "Under Investigation": "amber", "Surveyor Assigned": "indigo", "Documents Collected": "amber", Approved: "green", Settled: "green", Rejected: "red" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyPremium = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], marine: ri(42, 85, 62 + Math.sin(i * 0.5) * 15), transit: ri(28, 52, 38 + Math.cos(i * 0.6) * 10), warehouse: ri(12, 28, 18 + Math.sin(i * 0.8) * 5) }));
const claimLossDist = RISK_TYPES.map((r, i) => ({ n: r, v: ri(8, 42, 24 - i * 3) }));
const settlementTrend = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], settled: ri(38, 72, 52 + Math.sin(i * 0.6) * 12), pending: ri(8, 24, 14 + Math.cos(i * 0.4) * 5) }));
const lossRatioTrend = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], lr: +(ri(52, 78, 62 + Math.sin(i * 0.5) * 8)).toFixed(1), target: 65.0 }));

interface ClaimRecord { id: string; policyNo: string; claimNo: string; insurer: string; insuredParty: string; coverType: string; sumInsured: number; premiumPaid: number; claimAmount: number; riskType: string; incidentDate: string; incidentLocation: string; status: string; surveyor: string; documentsReceived: number; documentsRequired: number; settlementDate: string; remarks: string; }

const records: ClaimRecord[] = [
  { id: "TIC-0001", policyNo: "MC-NIA-2025-4501", claimNo: "CLM-2025-001", insurer: "New India Assurance", insuredParty: "TCI Express Ltd", coverType: "Marine Cargo A", sumInsured: 2500000, premiumPaid: 37500, claimAmount: 185000, riskType: "Transit Damage", incidentDate: "2025-01-08", incidentLocation: "NH48 Tumkur", status: "Settled", surveyor: "Surveyor India Ltd", documentsReceived: 6, documentsRequired: 6, settlementDate: "2025-01-22", remarks: "Container damage during rail-rail transfer at Tumkur" },
  { id: "TIC-0002", policyNo: "IT-ICL-2025-2102", claimNo: "CLM-2025-002", insurer: "ICICI Lombard", insuredParty: "Blue Dart Express", coverType: "Air Cargo", sumInsured: 850000, premiumPaid: 17000, claimAmount: 124000, riskType: "Theft/Pilferage", incidentDate: "2025-01-10", incidentLocation: "Mumbai Airport Cargo Terminal", status: "Under Investigation", surveyor: "Macleod Surveyors", documentsReceived: 4, documentsRequired: 7, settlementDate: "", remarks: "High-value pharma shipment pilferage at terminal" },
  { id: "TIC-0003", policyNo: "MC-BAJ-2025-3303", claimNo: "CLM-2025-003", insurer: "Bajaj Allianz", insuredParty: "VRL Logistics", coverType: "Marine Cargo B", sumInsured: 1800000, premiumPaid: 25200, claimAmount: 420000, riskType: "Fire", incidentDate: "2025-01-11", incidentLocation: "VRL Hub Nagpur", status: "Surveyor Assigned", surveyor: "Gill & Co Surveyors", documentsReceived: 3, documentsRequired: 8, settlementDate: "", remarks: "Warehouse fire damaged 12 pallets of FMCG goods" },
  { id: "TIC-0004", policyNo: "WW-NIA-2025-1104", claimNo: "CLM-2025-004", insurer: "New India Assurance", insuredParty: "Delhivery Ltd", coverType: "Warehouse to Warehouse", sumInsured: 3200000, premiumPaid: 48000, claimAmount: 68000, riskType: "Water Damage", incidentDate: "2025-01-09", incidentLocation: "Delhivery Fulfillment Center Bhiwandi", status: "Approved", surveyor: "Quality Surveyors", documentsReceived: 7, documentsRequired: 7, settlementDate: "2025-01-28", remarks: "Rainwater ingress damaged 3 pallets of electronics" },
  { id: "TIC-0005", policyNo: "IT-HDFC-2025-5505", claimNo: "CLM-2025-005", insurer: "HDFC ERGO", insuredParty: "Gati Ltd", coverType: "Inland Transit", sumInsured: 950000, premiumPaid: 14250, claimAmount: 210000, riskType: "Transit Damage", incidentDate: "2025-01-12", incidentLocation: "NH44 Zaheerabad", status: "Documents Collected", surveyor: "United Surveyors", documentsReceived: 6, documentsRequired: 6, settlementDate: "", remarks: "FTL overturn on NH44 causing cargo damage" },
  { id: "TIC-0006", policyNo: "MC-TAIG-2025-7706", claimNo: "CLM-2025-006", insurer: "Tata AIG", insuredParty: "Mahindra Logistics", coverType: "Marine Cargo C", sumInsured: 1500000, premiumPaid: 30000, claimAmount: 0, riskType: "Handling Damage", incidentDate: "2025-01-13", incidentLocation: "Chennai Port Trust", status: "Rejected", surveyor: "Indian Surveyors", documentsReceived: 8, documentsRequired: 8, settlementDate: "2025-01-25", remarks: "Claim rejected - pre-existing damage confirmed by survey" },
  { id: "TIC-0007", policyNo: "MM-ICL-2025-4107", claimNo: "CLM-2025-007", insurer: "ICICI Lombard", insuredParty: "Rivigo Solutions", coverType: "Multi-Modal", sumInsured: 4200000, premiumPaid: 63000, claimAmount: 350000, riskType: "Act of God", incidentDate: "2025-01-14", incidentLocation: "NH8 Gujarat Flood Zone", status: "Open", surveyor: "To be assigned", documentsReceived: 1, documentsRequired: 9, settlementDate: "", remarks: "Flash flood damaged 4 containers in transit" },
  { id: "TIC-0008", policyNo: "SO-NIC-2025-8808", claimNo: "CLM-2025-008", insurer: "National Insurance", insuredParty: "Adani Logistics", coverType: "Storage Only", sumInsured: 6500000, premiumPaid: 97500, claimAmount: 890000, riskType: "Fire", incidentDate: "2025-01-07", incidentLocation: "Adani Mundra Container Yard", status: "Settled", surveyor: "Macleod Surveyors", documentsReceived: 8, documentsRequired: 8, settlementDate: "2025-01-20", remarks: "Electrical fire in storage area, 6 containers affected" },
  { id: "TIC-0009", policyNo: "IT-BAJ-2025-6609", claimNo: "CLM-2025-009", insurer: "Bajaj Allianz", insuredParty: "Ecom Express", coverType: "Inland Transit", sumInsured: 480000, premiumPaid: 7200, claimAmount: 52000, riskType: "Theft/Pilferage", incidentDate: "2025-01-15", incidentLocation: "Ecom Hub Kolkata", status: "Under Investigation", surveyor: "Gill & Co Surveyors", documentsReceived: 3, documentsRequired: 6, settlementDate: "", remarks: "Parcel theft from sorting center, 45 packages missing" },
  { id: "TIC-0010", policyNo: "MC-IFFCO-2025-2210", claimNo: "CLM-2025-010", insurer: "IFFCO Tokio", insuredParty: "DHL Supply Chain", coverType: "Marine Cargo A", sumInsured: 2800000, premiumPaid: 42000, claimAmount: 156000, riskType: "Handling Damage", incidentDate: "2025-01-11", incidentLocation: "DHL Pune Warehouse", status: "Approved", surveyor: "Quality Surveyors", documentsReceived: 7, documentsRequired: 7, settlementDate: "2025-01-30", remarks: "Forklift damage to pharmaceutical shipment" },
  { id: "TIC-0011", policyNo: "WW-HDFC-2025-9911", claimNo: "CLM-2025-011", insurer: "HDFC ERGO", insuredParty: "TVS Supply Chain", coverType: "Warehouse to Warehouse", sumInsured: 1200000, premiumPaid: 18000, claimAmount: 280000, riskType: "Water Damage", incidentDate: "2025-01-12", incidentLocation: "TVS Chennai Warehouse", status: "Settled", surveyor: "United Surveyors", documentsReceived: 6, documentsRequired: 6, settlementDate: "2025-01-26", remarks: "Pipe burst in warehouse ceiling caused water damage" },
  { id: "TIC-0012", policyNo: "MM-RS-2025-3312", claimNo: "CLM-2025-012", insurer: "Royal Sundaram", insuredParty: "Shadowfax", coverType: "Multi-Modal", sumInsured: 750000, premiumPaid: 11250, claimAmount: 0, riskType: "Transit Damage", incidentDate: "2025-01-14", incidentLocation: "Shadowfax Delhi Hub", status: "Rejected", surveyor: "Indian Surveyors", documentsReceived: 5, documentsRequired: 5, settlementDate: "2025-01-27", remarks: "Goods already damaged before insurance coverage period" },
  { id: "TIC-0013", policyNo: "IT-NIC-2025-4413", claimNo: "CLM-2025-013", insurer: "National Insurance", insuredParty: "TCI Express Ltd", coverType: "Inland Transit", sumInsured: 3100000, premiumPaid: 46500, claimAmount: 425000, riskType: "Act of God", incidentDate: "2025-01-15", incidentLocation: "NH27 Bihar Flood Belt", status: "Open", surveyor: "To be assigned", documentsReceived: 0, documentsRequired: 9, settlementDate: "", remarks: "Cyclone damage to 3 containers near Bihar border" },
  { id: "TIC-0014", policyNo: "MC-TAIG-2025-7714", claimNo: "CLM-2025-014", insurer: "Tata AIG", insuredParty: "Allcargo Logistics", coverType: "Marine Cargo B", sumInsured: 5600000, premiumPaid: 84000, claimAmount: 720000, riskType: "Water Damage", incidentDate: "2025-01-13", incidentLocation: "JNPT Container Yard", status: "Surveyor Assigned", surveyor: "Macleod Surveyors", documentsReceived: 4, documentsRequired: 8, settlementDate: "", remarks: "Seawater ingress damaged containers during JNPT flooding" },
];

const openCount = records.filter(r => r.status === "Open" || r.status === "Under Investigation" || r.status === "Surveyor Assigned").length;
const totalSumInsured = records.reduce((s, r) => s + r.sumInsured, 0);
const totalClaimed = records.filter(r => r.status === "Settled").reduce((s, r) => s + r.claimAmount, 0);
const totalPremium = records.reduce((s, r) => s + r.premiumPaid, 0);

function fmtAmt(n: number): string { return n >= 10000000 ? `\u20b9${(n / 10000000).toFixed(1)}Cr` : n >= 100000 ? `\u20b9${(n / 100000).toFixed(1)}L` : n >= 1000 ? `\u20b9${(n / 1000).toFixed(1)}K` : `\u20b9${n}`; }

const kpis = [
  { l: "Open Claims", v: openCount, s: "require action" },
  { l: "Total Insured", v: fmtAmt(totalSumInsured), s: "sum insured value" },
  { l: "Total Settled", v: fmtAmt(totalClaimed), s: "across approved claims" },
  { l: "Total Premium", v: fmtAmt(totalPremium), s: "annual premiums" },
];

const INSIGHTS = [
  {
    t: "India Marine Insurance Market: \u20b918,000 Crore Premium and Rising",
    c: "India\u2019s marine and transit insurance market generated approximately \u20b918,000 crore in gross written premium in FY2024-25, with the four public sector general insurers (New India Assurance, National Insurance, United India Insurance, Oriental Insurance) holding 58% market share and private sector players (ICICI Lombard, Bajaj Allianz, HDFC ERGO, Tata AIG) accounting for 32%, with the remaining 10% from specialized insurance brokers and Lloyd\u2019s India market. The Marine Insurance Act 1963 governs marine cargo insurance in India, with Institute Cargo Clauses (A, B, C) providing varying levels of cover: Clause A provides all-risk cover including theft, pilferage, and non-delivery (most comprehensive, premium rate 0.35-0.65% of declared value); Clause B covers major perils excluding theft and pilferage (premium rate 0.20-0.40%); Clause C covers only named perils like fire and collision (premium rate 0.10-0.25%). For Indian logistics companies with annual freight spend exceeding \u20b910 crore, a transit insurance program with blanket open cover policies is standard practice, providing automatic coverage for all shipments within declared parameters without individual policy issuance. The average loss ratio (claims paid / premiums earned) for marine transit insurance in India stands at 62-68%, with road transit claims accounting for 45% of total claims by volume, rail transit 25%, air cargo 15%, and coastal shipping 15%. IRDAI\u2019s sandbox regulations now permit parametric insurance products that trigger automatic payouts based on predefined events (e.g., flood level exceeding threshold at a port location), reducing claim settlement time from 30-45 days to under 72 hours for eligible claims.",
  },
  {
    t: "Claims Surveyor Ecosystem: 850+ Licensed Surveyors in India",
    c: "India\u2019s insurance surveyor ecosystem comprises approximately 850 licensed surveyors and loss assessors regulated by IRDAI, operating through a structured survey process defined by the Marine Insurance Act 1963 and the Insurance Act 1938. The survey workflow for a transit insurance claim involves: (1) Intimation of loss within 24-48 hours of incident detection, (2) Surveyor appointment and preliminary survey within 72 hours, (3) Detailed damage assessment with photographic/video evidence, (4) Quantity and value assessment based on invoice, packing list, and survey measurement, (5) Root cause analysis (transit damage, handling damage, water damage, theft), (6) Report submission to insurer within 15-30 days, and (7) Claim adjustment based on survey findings, policy terms, and applicable deductibles. The average claim settlement timeline in India varies significantly: simple transit damage claims settle in 15-25 working days, theft/pilferage claims requiring police FIR verification take 30-45 days, fire and Act of God claims with extensive damage assessment take 45-90 days, and disputed or rejected claims may extend to 120-180 days including appeals. Key India-specific considerations include GST on claim settlements (18% GST applicable on claim amounts, with ITC implications for registered logistics companies), depreciation assessment based on IRDAI-depreciation tables (10-15% for electronics, 5-10% for FMCG, 15-25% for textiles), and subrogation rights allowing insurers to pursue recovery from third parties (e.g., carriers, warehouse operators) responsible for the loss.",
  },
  {
    t: "Warehouse Insurance: Specialized Storage Risk Coverage",
    c: "India\u2019s warehousing and storage insurance segment has grown at 18-22% CAGR over the past 5 years, driven by the expansion of Grade A warehouse stock (340 million sq ft as of Q4 2024) and increasing value density of stored goods (average \u20b92,800-4,500 per sq ft of inventory). Warehouse insurance policies in India cover named perils including fire, lightning, explosion, flood, cyclone, earthquake (Zone II-IV premium loading), riot and strike, and malicious damage, with optional extensions for spontaneous combustion, leakage and contamination, and Deterioration of Stock. Premium rates for warehouse insurance range from 0.15% to 0.55% of average stock value depending on construction type (RCC/PSC structures at lower rates, tin/shed structures at higher rates), occupancy type (FMCG/electronics at higher rates, raw materials at lower rates), fire protection systems (sprinkler/ hydrant discounts of 25-40%), and geographical zone (earthquake/flood prone areas attract 15-30% loading). For logistics operators managing multi-location warehouses, a floater policy with declared stock locations provides seamless coverage across all facilities under a single premium, with automatic 15-20% additional sum insured for seasonal peak stock periods. The average warehouse claim in India is \u20b912-18 lakh for fire damage incidents, with the most frequent claim triggers being electrical short circuits (38%), external fire spread from adjacent units (22%), and monsoon flooding (18%). Companies deploying IoT-based warehouse monitoring (smoke detectors, temperature/humidity sensors, water leak detection) report 35% reduction in claim frequency and receive 10-15% premium discounts from insurers.",
  },
  {
    t: "IRDAI Sandbox: Parametric Insurance and Automated Claims for Logistics",
    c: "India\u2019s insurance regulator IRDAI has launched a regulatory sandbox framework that enables parametric insurance products specifically designed for the logistics sector, with 12 insurance companies currently testing products in the sandbox as of January 2025. Parametric transit insurance uses predefined triggers (e.g., rainfall exceeding 100mm in 24 hours at a specific pin code, earthquake magnitude exceeding 5.0 in a coastal port zone, vehicle GPS data showing delay exceeding 24 hours at a highway segment) to automatically initiate claim settlement without traditional surveyor-based assessment. For Indian logistics operators, parametric insurance offers three transformative benefits: (1) Near-instant claim settlement (24-72 hours versus 30-90 days for traditional claims), (2) Elimination of surveyor dependency and associated assessment costs (saving \u20b95,000-15,000 per claim in surveyor fees), and (3) Objective, data-driven payout triggers that reduce claim disputes by 85%. Leading implementations include Acko\u2019s route-delay parametric product (triggers if GPS data shows delay exceeding 12 hours beyond ETA), ICICI Lombard\u2019s flood-index product (triggers on IMD rainfall data exceeding zone-specific thresholds), and Bajaj Allianz\u2019s temperature-deviation product for cold chain logistics (triggers if IoT sensor data shows temperature excursion beyond product-specific limits for more than 30 minutes). The claims settlement rate for parametric products in the IRDAI sandbox is 92%, with an average claim processing time of 36 hours from trigger event to payout credit, representing a 95% improvement over traditional marine cargo claims.",
  },
];

export default function TransitInsuranceClaimsView() {
  const [tab, setTab] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const filterGroups = [
    { key: "insurer", label: "Insurer", options: INSURERS.map(ins => ({ value: ins, count: records.filter(r => r.insurer === ins).length })) },
    { key: "status", label: "Status", options: CLAIM_STATUS.map(s => ({ value: s, count: records.filter(r => r.status === s).length })) },
    { key: "coverType", label: "Cover", options: COVER_TYPES.map(c => ({ value: c, count: records.filter(r => r.coverType === c).length })) },
    { key: "riskType", label: "Risk", options: RISK_TYPES.map(rk => ({ value: rk, count: records.filter(r => r.riskType === rk).length })) },
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.policyNo.toLowerCase().includes(q) && !r.claimNo.toLowerCase().includes(q) && !r.insuredParty.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof ClaimRecord] as string));
  });

  return (
    <div className="tic-root p-6 space-y-6">
      <PageHeader title="Transit Insurance & Claims Command" description="Marine/transit insurance policy management, claims processing, surveyor coordination, loss assessment and automated claims analytics" />
      <div className="tic-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`tic-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-indigo-50"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="tic-dash space-y-6">
          <div className="tic-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (<div key={k.l} className="tic-kpi bg-white rounded-lg border p-4"><div className="text-xs text-gray-500 tic-kpi-label">{k.l}</div><div className="text-2xl font-bold text-indigo-700 tic-kpi-val">{k.v}</div><div className="text-xs text-gray-400 tic-kpi-sub">{k.s}</div></div>))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="tic-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Premium by Category</h3><BarChart data={monthlyPremium} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="marine" fill="#4338ca" radius={[4,4,0,0]} name="Marine" /><Bar dataKey="transit" fill="#818cf8" radius={[4,4,0,0]} name="Transit" /><Bar dataKey="warehouse" fill="#c7d2fe" radius={[4,4,0,0]} name="Warehouse" /></BarChart></div>
            <div className="tic-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Claim Loss by Risk Type</h3><PieChart width={400} height={220}><Pie data={claimLossDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{claimLossDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="tic-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Claims Settled vs Pending Trend</h3><LineChart data={settlementTrend} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Line type="monotone" dataKey="settled" stroke="#4338ca" strokeWidth={2} name="Settled" /><Line type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={2} name="Pending" /></LineChart></div>
            <div className="tic-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Loss Ratio vs Target</h3><LineChart data={lossRatioTrend} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[45, 85]} /><Tooltip /><Legend /><Line type="monotone" dataKey="lr" stroke="#4338ca" strokeWidth={2} name="Loss Ratio %" /><Line type="monotone" dataKey="target" stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" name="Target" /></LineChart></div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="tic-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "Insurance", href: "#" }, { label: "Claims Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="tic-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{"ID,Policy No,Claim No,Insurer,Insured,Cover,Sum Insured,Premium,Claim, Risk,Incident,Location,Status,Surveyor,Docs,Settlement,Remarks"
                .split(",").map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const rowCls = r.status === "Open" || r.status === "Rejected" ? "tic-row-critical bg-red-50" : r.status === "Under Investigation" || r.status === "Surveyor Assigned" ? "tic-row-warning bg-amber-50" : "";
              return (<tr key={r.id} className={`border-b hover:bg-indigo-50/50 ${rowCls}`}>
                <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                <td className="px-3 py-2"><span className="tic-badge inline-block px-2 py-0.5 rounded text-xs bg-indigo-100 text-indigo-700 font-mono">{r.policyNo.split("-").slice(-1)[0]}</span></td>
                <td className="px-3 py-2 font-mono text-xs">{r.claimNo}</td>
                <td className="px-3 py-2 text-xs">{r.insurer}</td>
                <td className="px-3 py-2 text-xs">{r.insuredParty}</td>
                <td className="px-3 py-2"><span className="tic-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.coverType}</span></td>
                <td className="px-3 py-2 text-xs font-medium">{fmtAmt(r.sumInsured)}</td>
                <td className="px-3 py-2 text-xs">{fmtAmt(r.premiumPaid)}</td>
                <td className="px-3 py-2 font-medium">{fmtAmt(r.claimAmount)}</td>
                <td className="px-3 py-2"><span className="tic-badge inline-block px-2 py-0.5 rounded text-xs bg-red-100 text-red-700">{r.riskType}</span></td>
                <td className="px-3 py-2 text-xs text-gray-500">{r.incidentDate}</td>
                <td className="px-3 py-2 text-xs">{r.incidentLocation}</td>
                <td className="px-3 py-2"><span className={`tic-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[statusColor[r.status]]}`}>{r.status}</span></td>
                <td className="px-3 py-2 text-xs">{r.surveyor}</td>
                <td className="px-3 py-2"><span className={`inline-block px-2 py-0.5 rounded text-xs ${r.documentsReceived >= r.documentsRequired ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{r.documentsReceived}/{r.documentsRequired}</span></td>
                <td className="px-3 py-2 text-xs">{r.settlementDate || "\u2014"}</td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-48 truncate">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="tic-analytics space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="tic-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Claims by Insurer</h3><BarChart data={INSURERS.slice(0,6).map(ins => ({ n: ins.split(" ")[0], v: ri(2, 15, 7 + Math.random() * 6) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#6366f1" radius={[4,4,0,0]} /></BarChart></div>
            <div className="tic-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Claim Amount by Cover Type</h3><BarChart data={COVER_TYPES.slice(0,6).map(c => ({ n: c.split(" ").slice(-1)[0], v: +ri(120000, 950000, 450000 + Math.random() * 400000).toFixed(0) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip formatter={(v: number) => fmtAmt(v)} /><Bar dataKey="v" fill="#4338ca" radius={[4,4,0,0]} /></BarChart></div>
          </div>
          <div className="tic-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Premium vs Claims Ratio (Loss Ratio)</h3><AreaChart data={Array.from({ length: 12 }, (_, i) => ({ m: MO[i], premium: ri(70, 120, 92 + Math.sin(i*0.5)*15), claims: ri(45, 85, 62 + Math.cos(i*0.6)*12) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Area type="monotone" dataKey="premium" stackId="1" stroke="#4338ca" fill="#c7d2fe" name="Premium (\u20b9L)" /><Area type="monotone" dataKey="claims" stackId="1" stroke="#e11d48" fill="#ffe4e6" name="Claims (\u20b9L)" /></AreaChart></div>
        </div>
      )}

      {tab === 3 && (
        <div className="tic-insights grid grid-cols-2 gap-6">{INSIGHTS.map(ins => (<div key={ins.t} className="tic-insight bg-white rounded-lg border p-5"><h3 className="text-base font-bold text-indigo-800 mb-2">{ins.t}</h3><p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p></div>))}</div>
      )}
    </div>
  );
}
