"use client";
import { useState } from "react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#7c3aed", "#8b5cf6", "#a78bfa", "#c4b5fd", "#6d28d9", "#5b21b6", "#a855f7", "#ddd6fe"];
const CARRIERS = ["TCI Express", "Delhivery", "Blue Dart", "VRL Logistics", "Gati", "Rivigo", "Shadowfax", "Ecom Express"];
const MATCH_STATUS = ["3-Way Match", "2-Way Partial", "1-Way Only", "Amount Mismatch", "PO Mismatch", "Pending Review"];
const DISCREPANCY_TYPES = ["Rate Override", "Accessorial Charge", "Weight Discrepancy", "Duplicate Charge", "Currency Error", "Missing PO Link"];
const CORRIDORS = ["Delhi-Mumbai", "Mumbai-Chennai", "Bangalore-Kolkata", "Delhi-Kolkata", "Chennai-Hyderabad", "Pune-Delhi", "Ahmedabad-Jaipur", "Kolkata-Guwahati"];
const TABS = ["Dashboard", "Invoice Ledger", "Discrepancy Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", violet: "bg-violet-100 text-violet-700", slate: "bg-slate-100 text-slate-600", orange: "bg-orange-100 text-orange-700" };
const statusColor: Record<string, string> = { "3-Way Match": "green", "2-Way Partial": "amber", "1-Way Only": "red", "Amount Mismatch": "red", "PO Mismatch": "orange", "Pending Review": "slate" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyInvoices = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], matched: ri(380, 620, 480 + Math.sin(i * 0.5) * 80), discrepancy: ri(40, 120, 75 + Math.cos(i * 0.6) * 25), pending: ri(10, 45, 25 + Math.sin(i * 0.8) * 12) }));
const discrepancyDist = DISCREPANCY_TYPES.map((d, i) => ({ n: d, v: ri(8, 55, 30 - i * 4) }));
const savingsTrend = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], recovered: ri(12, 48, 28 + Math.sin(i * 0.7) * 10), leakage: ri(5, 22, 12 + Math.cos(i * 0.4) * 5) }));
const carrierVol = CARRIERS.map(c => ({ n: c, v: ri(35, 180, 95 + Math.random() * 60), discrepancy: ri(3, 25, 12 + Math.random() * 8) }));

interface InvoiceRecord { id: string; invoiceNo: string; carrier: string; corridor: string; poNumber: string; shipmentId: string; invoiceDate: string; dueDate: string; poAmount: number; grnAmount: number; invoiceAmount: number; variance: number; variancePct: number; discrepancyType: string; matchStatus: string; paymentStatus: string; approver: string; remarks: string; }

const records: InvoiceRecord[] = [
  { id: "FIR-0001", invoiceNo: "FV/2025/TCI/001", carrier: "TCI Express", corridor: "Delhi-Mumbai", poNumber: "PO-2025-4521", shipmentId: "SHP-DM-0891", invoiceDate: "2025-01-10", dueDate: "2025-02-09", poAmount: 245000, grnAmount: 245000, invoiceAmount: 245000, variance: 0, variancePct: 0, discrepancyType: "\u2014", matchStatus: "3-Way Match", paymentStatus: "Paid", approver: "Rajesh Kumar", remarks: "Standard FTL Delhi to Mumbai ICD" },
  { id: "FIR-0002", invoiceNo: "FV/2025/DLV/002", carrier: "Delhivery", corridor: "Mumbai-Chennai", poNumber: "PO-2025-4522", shipmentId: "SHP-MC-0892", invoiceDate: "2025-01-10", dueDate: "2025-02-09", poAmount: 186000, grnAmount: 186000, invoiceAmount: 198500, variance: 12500, variancePct: 6.7, discrepancyType: "Accessorial Charge", matchStatus: "Amount Mismatch", paymentStatus: "On Hold", approver: "\u2014", remarks: "Detention charge added beyond PO scope" },
  { id: "FIR-0003", invoiceNo: "FV/2025/BD/003", carrier: "Blue Dart", corridor: "Bangalore-Kolkata", poNumber: "PO-2025-4523", shipmentId: "SHP-BK-0893", invoiceDate: "2025-01-11", dueDate: "2025-02-10", poAmount: 92000, grnAmount: 92000, invoiceAmount: 92000, variance: 0, variancePct: 0, discrepancyType: "\u2014", matchStatus: "3-Way Match", paymentStatus: "Paid", approver: "Priya Sharma", remarks: "Express air cargo Bangalore to Kolkata" },
  { id: "FIR-0004", invoiceNo: "FV/2025/VRL/004", carrier: "VRL Logistics", corridor: "Delhi-Kolkata", poNumber: "PO-2025-4524", shipmentId: "SHP-DK-0894", invoiceDate: "2025-01-11", dueDate: "2025-02-10", poAmount: 312000, grnAmount: 308000, invoiceAmount: 328000, variance: 20000, variancePct: 6.4, discrepancyType: "Rate Override", matchStatus: "Amount Mismatch", paymentStatus: "Disputed", approver: "\u2014", remarks: "Fuel surcharge revised after PO date" },
  { id: "FIR-0005", invoiceNo: "FV/2025/GAT/005", carrier: "Gati", corridor: "Chennai-Hyderabad", poNumber: "PO-2025-4525", shipmentId: "SHP-CH-0895", invoiceDate: "2025-01-12", dueDate: "2025-02-11", poAmount: 145000, grnAmount: 145000, invoiceAmount: 145000, variance: 0, variancePct: 0, discrepancyType: "\u2014", matchStatus: "3-Way Match", paymentStatus: "Paid", approver: "Amit Patel", remarks: "Part-truckload Chennai to Hyderabad" },
  { id: "FIR-0006", invoiceNo: "FV/2025/RVG/006", carrier: "Rivigo", corridor: "Pune-Delhi", poNumber: "PO-2025-4526", shipmentId: "SHP-PD-0896", invoiceDate: "2025-01-12", dueDate: "2025-02-11", poAmount: 278000, grnAmount: 278000, invoiceAmount: 284500, variance: 6500, variancePct: 2.3, discrepancyType: "Weight Discrepancy", matchStatus: "2-Way Partial", paymentStatus: "Partial Paid", approver: "Neha Gupta", remarks: "Actual weight 12.4T vs PO 11.8T, pro-rata accepted" },
  { id: "FIR-0007", invoiceNo: "FV/2025/SFX/007", carrier: "Shadowfax", corridor: "Ahmedabad-Jaipur", poNumber: "PO-2025-4527", shipmentId: "SHP-AJ-0897", invoiceDate: "2025-01-13", dueDate: "2025-02-12", poAmount: 89000, grnAmount: 89000, invoiceAmount: 112000, variance: 23000, variancePct: 25.8, discrepancyType: "Duplicate Charge", matchStatus: "Amount Mismatch", paymentStatus: "Rejected", approver: "\u2014", remarks: "Handling charge appears twice on same invoice" },
  { id: "FIR-0008", invoiceNo: "FV/2025/ECE/008", carrier: "Ecom Express", corridor: "Kolkata-Guwahati", poNumber: "", shipmentId: "SHP-KG-0898", invoiceDate: "2025-01-13", dueDate: "2025-02-12", poAmount: 0, grnAmount: 62000, invoiceAmount: 62000, variance: 0, variancePct: 0, discrepancyType: "Missing PO Link", matchStatus: "PO Mismatch", paymentStatus: "Pending Review", approver: "\u2014", remarks: "Invoice received without corresponding PO reference" },
  { id: "FIR-0009", invoiceNo: "FV/2025/TCI/009", carrier: "TCI Express", corridor: "Mumbai-Chennai", poNumber: "PO-2025-4529", shipmentId: "SHP-MC-0899", invoiceDate: "2025-01-14", dueDate: "2025-02-13", poAmount: 198000, grnAmount: 198000, invoiceAmount: 198000, variance: 0, variancePct: 0, discrepancyType: "\u2014", matchStatus: "3-Way Match", paymentStatus: "Paid", approver: "Rajesh Kumar", remarks: "Container movement Mumbai port to Chennai ICD" },
  { id: "FIR-0010", invoiceNo: "FV/2025/DLV/010", carrier: "Delhivery", corridor: "Delhi-Kolkata", poNumber: "PO-2025-4530", shipmentId: "SHP-DK-0900", invoiceDate: "2025-01-14", dueDate: "2025-02-13", poAmount: 167000, grnAmount: 164500, invoiceAmount: 167000, variance: 2500, variancePct: 1.5, discrepancyType: "Weight Discrepancy", matchStatus: "2-Way Partial", paymentStatus: "Approved", approver: "Priya Sharma", remarks: "Minor weight variance within 2% tolerance, auto-approved" },
  { id: "FIR-0011", invoiceNo: "FV/2025/BD/011", carrier: "Blue Dart", corridor: "Pune-Delhi", poNumber: "PO-2025-4531", shipmentId: "SHP-PD-0901", invoiceDate: "2025-01-14", dueDate: "2025-02-13", poAmount: 156000, grnAmount: 156000, invoiceAmount: 178000, variance: 22000, variancePct: 14.1, discrepancyType: "Accessorial Charge", matchStatus: "Amount Mismatch", paymentStatus: "Disputed", approver: "\u2014", remarks: "Priority surcharge added without PO amendment" },
  { id: "FIR-0012", invoiceNo: "FV/2025/VRL/012", carrier: "VRL Logistics", corridor: "Chennai-Hyderabad", poNumber: "PO-2025-4532", shipmentId: "SHP-CH-0902", invoiceDate: "2025-01-15", dueDate: "2025-02-14", poAmount: 210000, grnAmount: 210000, invoiceAmount: 210000, variance: 0, variancePct: 0, discrepancyType: "\u2014", matchStatus: "3-Way Match", paymentStatus: "Paid", approver: "Amit Patel", remarks: "Regular FTL service Chennai to Hyderabad warehouse" },
  { id: "FIR-0013", invoiceNo: "FV/2025/GAT/013", carrier: "Gati", corridor: "Delhi-Mumbai", poNumber: "PO-2025-4533", shipmentId: "SHP-DM-0903", invoiceDate: "2025-01-15", dueDate: "2025-02-14", poAmount: 0, grnAmount: 188000, invoiceAmount: 188000, variance: 0, variancePct: 0, discrepancyType: "Missing PO Link", matchStatus: "1-Way Only", paymentStatus: "Pending Review", approver: "\u2014", remarks: "PO yet to be created in ERP, invoice pre-approved by ops" },
  { id: "FIR-0014", invoiceNo: "FV/2025/RVG/014", carrier: "Rivigo", corridor: "Bangalore-Kolkata", poNumber: "PO-2025-4534", shipmentId: "SHP-BK-0904", invoiceDate: "2025-01-15", dueDate: "2025-02-14", poAmount: 335000, grnAmount: 335000, invoiceAmount: 341200, variance: 6200, variancePct: 1.9, discrepancyType: "Rate Override", matchStatus: "2-Way Partial", paymentStatus: "Partial Paid", approver: "Neha Gupta", remarks: "Toll rate change en-route, approved variance under 2%" },
];

const matchCount = records.filter(r => r.matchStatus === "3-Way Match").length;
const totalInvoiced = records.reduce((s, r) => s + r.invoiceAmount, 0);
const totalVariance = records.reduce((s, r) => s + r.variance, 0);
const discrepancyCount = records.filter(r => r.matchStatus !== "3-Way Match").length;

function fmtAmt(n: number): string { return n >= 10000000 ? `\u20b9${(n / 10000000).toFixed(1)}Cr` : n >= 100000 ? `\u20b9${(n / 100000).toFixed(1)}L` : n >= 1000 ? `\u20b9${(n / 1000).toFixed(1)}K` : `\u20b9${n}`; }

const kpis = [
  { l: "3-Way Matched", v: matchCount, s: `of ${records.length} invoices` },
  { l: "Total Invoiced", v: fmtAmt(totalInvoiced), s: "current period" },
  { l: "Total Variance", v: fmtAmt(totalVariance), s: "overcharged amounts" },
  { l: "Discrepancies", v: discrepancyCount, s: "require review/action" },
];

const INSIGHTS = [
  {
    t: "Freight Invoice Leakage: India Logistics Loses \u20b918,000 Crore Annually",
    c: "India\u2019s logistics sector, valued at \u20b918.5 lakh crore (as per the LEADS 2024 report), experiences an estimated freight invoice leakage of 2.5-4.5% of total freight spend, translating to \u20b918,000-45,000 crore in annual overcharges across the industry. The primary sources of freight invoice leakage include unauthorized rate overrides by carriers (38% of leakage), duplicate accessorial charges (22%), weight manipulation discrepancies (18%), and billing for services not rendered (12%). For a mid-sized Indian logistics company with annual freight spend of \u20b9200 crore, implementing automated 3-way matching (PO vs Invoice vs GRN) typically recovers \u20b94.5-8 crore per year in prevented overcharges. The National Logistics Policy 2022 targets a logistics cost reduction from 14% to 8% of GDP by 2030, with freight audit automation identified as a key lever. Leading Indian 3PL operators like TCI, Allcargo, and DHL Supply Chain India have implemented real-time freight audit platforms that process 85,000-1,20,000 freight invoices monthly with 98.5% automated matching rates and 72-hour dispute resolution SLAs, reducing manual audit effort by 80% while improving carrier compliance scores by 35%.",
  },
  {
    t: "3-Way Matching: PO vs Invoice vs GRN for Indian Freight",
    c: "The 3-way matching process for freight invoices in Indian logistics involves reconciling three critical documents: the Purchase Order (PO) issued to the carrier with agreed rates and quantities, the Freight Invoice submitted by the carrier for services rendered, and the Goods Receipt Note (GRN) confirming actual shipment delivery with verified weight, dimensions, and condition. In a typical Indian logistics operation handling 5,000-15,000 freight invoices per month across 50-150 carriers, manual 3-way matching requires 8-12 person-days and has a 15-18% error rate in identifying discrepancies. Automated freight audit systems using OCR (Optical Character Recognition) for invoice digitization, AI-based anomaly detection for rate and charge validation, and ERP integration for real-time PO/GRN matching achieve 95-99% first-pass match rates and reduce processing time to under 4 hours per batch. Key challenges unique to India include handling multi-currency invoices for cross-border freight (INR/USD/AED), managing GST component validation across CGST/SGST/IGST splits, reconciling e-way bill linked freight charges with actual invoices, and accommodating carrier-specific charge codes and accessorial terminology across 15+ Indian languages. Advanced platforms like FreightSherpa, Inforfreight, and indigenous solutions like Vaya and BlackBuck incorporate India-specific freight audit rules including NHAI toll reconciliation, state-specific detention charge validation, and FSSAI-mandated cold chain temperature compliance verification.",
  },
  {
    t: "Carrier Scorecard Integration with Invoice Audit",
    c: "Integrating freight invoice audit data with carrier performance scorecards creates a powerful feedback loop that drives continuous improvement in carrier compliance and cost optimization. For Indian logistics operators managing 50+ active carriers, invoice discrepancy analysis reveals that 15-20% of carriers consistently contribute 65-75% of total invoice variances, enabling targeted carrier management interventions. Key carrier scorecard metrics derived from invoice audit include invoice accuracy rate (target: 98%+ first-pass match), average discrepancy amount per invoice (benchmark: below 1.5% of invoice value), dispute resolution time (target: under 72 hours), and accessorial charge ratio (benchmark: below 8% of base freight). A study of 2,500 Indian logistics companies shows that carriers with scorecard-linked payment terms (faster payment for higher accuracy) demonstrate 28% improvement in invoice accuracy within 6 months. Additionally, carriers receiving monthly discrepancy reports with itemized overcharge breakdowns reduce their error rates by 45% compared to those receiving only rejection notices. The integration extends to automated carrier onboarding checks (GSTIN validation, Udyam registration verification, IRN compliance for e-invoicing) and quarterly rate renegotiation recommendations based on actual vs contracted rate analysis across corridors and service types.",
  },
  {
    t: "GST-Compliant Freight Invoice Automation",
    c: "Freight invoice reconciliation in India requires precise GST compliance validation, as freight charges attract different GST rates depending on the service type: GTA (Goods Transport Agency) services under reverse charge mechanism at 5% (2.5% CGST + 2.5% SGST for intra-state, 5% IGST for inter-state), courier services at 18%, and container freight station services at 18%. For a logistics company processing 10,000+ freight invoices monthly, ensuring correct GST rate classification, accurate GSTIN-to-state mapping for CGST/SGST vs IGST determination, and TDS/TCS deduction validation under Section 194C (2%) for freight payments is critical to avoiding compliance penalties. Automated freight audit platforms validate 14 GST-specific checkpoints per invoice including supplier GSTIN status (active/suspended/cancelled) against the GST portal, HSN/SAC code accuracy for freight services (SAC 9965 for goods transport), reverse charge mechanism applicability based on consignor/consignee GSTIN, e-invoice IRN verification for invoices above \u20b95 crore threshold, and input tax credit eligibility for freight invoices used in business operations. Companies leveraging GST-integrated freight audit report 60% reduction in GST-related notices and assessments, with an average annual penalty avoidance of \u20b98-15 lakh for mid-sized operators.",
  },
];

export default function FreightInvoiceReconciliationView() {
  const [tab, setTab] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const filterGroups = [
    { key: "carrier", label: "Carrier", options: CARRIERS.map(c => ({ value: c, count: records.filter(r => r.carrier === c).length })) },
    { key: "corridor", label: "Corridor", options: CORRIDORS.map(c => ({ value: c, count: records.filter(r => r.corridor === c).length })) },
    { key: "matchStatus", label: "Match Status", options: MATCH_STATUS.map(s => ({ value: s, count: records.filter(r => r.matchStatus === s).length })) },
    { key: "discrepancyType", label: "Discrepancy", options: DISCREPANCY_TYPES.map(d => ({ value: d, count: records.filter(r => r.discrepancyType === d).length })) },
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.invoiceNo.toLowerCase().includes(q) && !r.carrier.toLowerCase().includes(q) && !r.poNumber.toLowerCase().includes(q) && !r.shipmentId.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(
      ([k, vs]) => vs.includes(r[k as keyof InvoiceRecord] as string)
    );
  });

  const maxVar = Math.max(...records.map(r => r.variance));

  return (
    <div className="fir-root p-6 space-y-6">
      <PageHeader
        title="Freight Invoice Reconciliation"
        description="3-way matching (PO vs Invoice vs GRN), discrepancy detection, carrier audit and freight cost recovery analytics"
      />
      <div className="fir-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`fir-tab px-4 py-2 text-sm font-medium rounded-t ${
              tab === i ? "bg-violet-600 text-white" : "text-gray-600 hover:bg-violet-50"
            }`}
          >{t}</button>
        ))}
      </div>

      {tab === 0 && (
        <div className="fir-dash space-y-6">
          <div className="fir-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (
              <div key={k.l} className="fir-kpi bg-white rounded-lg border p-4">
                <div className="text-xs text-gray-500 fir-kpi-label">{k.l}</div>
                <div className="text-2xl font-bold text-violet-700 fir-kpi-val">{k.v}</div>
                <div className="text-xs text-gray-400 fir-kpi-sub">{k.s}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="fir-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">Monthly Invoice Processing (Match vs Discrepancy)</h3>
              <BarChart data={monthlyInvoices} height={220}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="m" /><YAxis /><Tooltip /><Legend />
                <Bar dataKey="matched" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Matched" />
                <Bar dataKey="discrepancy" fill="#ef4444" radius={[4, 4, 0, 0]} name="Discrepancy" />
                <Bar dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Pending" />
              </BarChart>
            </div>
            <div className="fir-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">Discrepancy Type Distribution</h3>
              <PieChart width={400} height={220}>
                <Pie data={discrepancyDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>
                  {discrepancyDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="fir-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">Cost Recovery vs Leakage Trend</h3>
              <LineChart data={savingsTrend} height={220}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="m" /><YAxis /><Tooltip /><Legend />
                <Line type="monotone" dataKey="recovered" stroke="#7c3aed" strokeWidth={2} name="Recovered (\u20b9L)" />
                <Line type="monotone" dataKey="leakage" stroke="#ef4444" strokeWidth={2} name="Leakage (\u20b9L)" />
              </LineChart>
            </div>
            <div className="fir-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">Carrier Volume vs Discrepancy Rate</h3>
              <BarChart data={carrierVol} height={220}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Legend />
                <Bar dataKey="v" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Invoices" />
                <Bar dataKey="discrepancy" fill="#ef4444" radius={[4, 4, 0, 0]} name="Discrepancies" />
              </BarChart>
            </div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="fir-ledger space-y-4">
          <ModuleBreadcrumb items={[{ label: "Freight", href: "#" }, { label: "Invoice Ledger", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="fir-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  {"ID,Invoice No,Carrier,Corridor,PO No,Shipment ID,PO Amt,GRN Amt,Inv Amt,Variance,Var %,Discrepancy,Status,Payment,Approver,Remarks"
                    .split(",").map(h => (
                    <th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => {
                  const rowCls = r.matchStatus === "Amount Mismatch" || r.matchStatus === "1-Way Only"
                    ? "fir-row-critical bg-red-50"
                    : r.matchStatus === "2-Way Partial" || r.matchStatus === "PO Mismatch" || r.matchStatus === "Pending Review"
                      ? "fir-row-warning bg-amber-50" : "";
                  const vp = ri(0, 100, maxVar > 0 ? (r.variance / maxVar) * 100 : 0);
                  return (
                    <tr key={r.id} className={`border-b hover:bg-violet-50/50 ${rowCls}`}>
                      <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                      <td className="px-3 py-2 font-mono text-xs">{r.invoiceNo}</td>
                      <td className="px-3 py-2"><span className="fir-badge inline-block px-2 py-0.5 rounded text-xs bg-violet-100 text-violet-700">{r.carrier}</span></td>
                      <td className="px-3 py-2 text-xs">{r.corridor}</td>
                      <td className="px-3 py-2"><span className="fir-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700 font-mono">{r.poNumber || "\u2014"}</span></td>
                      <td className="px-3 py-2 text-xs font-mono">{r.shipmentId}</td>
                      <td className="px-3 py-2 text-xs text-gray-600">{r.poAmount > 0 ? fmtAmt(r.poAmount) : "\u2014"}</td>
                      <td className="px-3 py-2 text-xs text-gray-600">{r.grnAmount > 0 ? fmtAmt(r.grnAmount) : "\u2014"}</td>
                      <td className="px-3 py-2 font-medium">{fmtAmt(r.invoiceAmount)}</td>
                      <td className="px-3 py-2">
                        {r.variance > 0 ? (
                          <div className="flex items-center gap-2">
                            <span className="text-red-600 font-medium">+{fmtAmt(r.variance)}</span>
                            <div className="w-16 h-1.5 bg-gray-200 rounded">
                              <div className="fir-varbar h-1.5 bg-red-500 rounded" style={{ width: `${vp}%` }} />
                            </div>
                          </div>
                        ) : <span className="text-green-600 text-xs">{"\u20b9"}0</span>}
                      </td>
                      <td className="px-3 py-2">
                        {r.variancePct > 0 ? (
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${r.variancePct > 10 ? "bg-red-100 text-red-700" : r.variancePct > 3 ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
                            +{r.variancePct}%
                          </span>
                        ) : <span className="text-slate-400 text-xs">0%</span>}
                      </td>
                      <td className="px-3 py-2">
                        {r.discrepancyType !== "\u2014" ? (
                          <span className="fir-badge inline-block px-2 py-0.5 rounded text-xs bg-orange-100 text-orange-700">{r.discrepancyType}</span>
                        ) : <span className="text-slate-400 text-xs">\u2014</span>}
                      </td>
                      <td className="px-3 py-2"><span className={`fir-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[statusColor[r.matchStatus]]}`}>{r.matchStatus}</span></td>
                      <td className="px-3 py-2">
                        <span className={`fir-badge inline-block px-2 py-0.5 rounded text-xs ${
                          r.paymentStatus === "Paid" ? "bg-green-100 text-green-700" :
                          r.paymentStatus === "Disputed" || r.paymentStatus === "Rejected" ? "bg-red-100 text-red-700" :
                          r.paymentStatus === "Partial Paid" || r.paymentStatus === "Approved" ? "bg-amber-100 text-amber-700" :
                          "bg-slate-100 text-slate-500"
                        }`}>{r.paymentStatus}</span>
                      </td>
                      <td className="px-3 py-2 text-xs">{r.approver}</td>
                      <td className="px-3 py-2 text-xs text-gray-500 max-w-48 truncate" title={r.remarks}>{r.remarks}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="fir-analytics space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="fir-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">Variance by Corridor</h3>
              <BarChart data={CORRIDORS.map(c => ({ n: c, v: +ri(12000, 95000, 42000 + Math.random() * 40000).toFixed(0) }))} height={240}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip formatter={(v: number) => fmtAmt(v)} />
                <Bar dataKey="v" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </div>
            <div className="fir-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">Match Rate Trend (12 Months)</h3>
              <AreaChart data={Array.from({ length: 12 }, (_, i) => ({ m: MO[i], rate: +(ri(82, 97, 88 + i * 0.5)).toFixed(1) }))} height={240}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="m" /><YAxis domain={[75, 100]} /><Tooltip />
                <Area type="monotone" dataKey="rate" stroke="#7c3aed" fill="#ddd6fe" name="Match Rate %" />
              </AreaChart>
            </div>
          </div>
          <div className="fir-chart bg-white rounded-lg border p-4">
            <h3 className="text-sm font-semibold mb-3">Discrepancy Recovery Timeline (Days to Resolve)</h3>
            <BarChart data={DISCREPANCY_TYPES.map((d, i) => ({ n: d, v: ri(1, 22, 6 + i * 2.5) }))} height={240}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip />
              <Bar dataKey="v" fill="#a78bfa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </div>
        </div>
      )}

      {tab === 3 && (
        <div className="fir-insights grid grid-cols-2 gap-6">
          {INSIGHTS.map(ins => (
            <div key={ins.t} className="fir-insight bg-white rounded-lg border p-5">
              <h3 className="text-base font-bold text-violet-800 mb-2">{ins.t}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
