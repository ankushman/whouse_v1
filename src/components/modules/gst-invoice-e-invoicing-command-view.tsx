"use client";
import { useState } from "react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#0f766e", "#14b8a6", "#5eead4", "#99f6e4", "#115e59", "#134e4a", "#2dd4bf", "#ccfbf1"];
const GST_RATES = ["0%", "5%", "12%", "18%", "28%"];
const INVOICE_TYPES = ["B2B Regular", "B2C Large", "B2B Export", "B2C Export", "SEZ Supply", "Deemed Export"];
const IRN_STATUS = ["Generated", "Pending", "Failed", "Cancelled", "Partially Generated", "Retry Queue"];
const SUPPLIERS = ["Tata Steel Ltd", "Reliance Industries", "Mahindra Logistics", "Blue Dart Express", "TVS Supply Chain", "DHL Supply Chain", "Delhivery Ltd", "TCI Express"];
const STATES = ["Maharashtra", "Karnataka", "Tamil Nadu", "Gujarat", "Delhi", "Telangana", "Rajasthan", "West Bengal"];
const TABS = ["Dashboard", "Invoice Registry", "IRN Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", teal: "bg-teal-100 text-teal-700", slate: "bg-slate-100 text-slate-600", orange: "bg-orange-100 text-orange-700" };
const statusColor: Record<string, string> = { Generated: "green", Pending: "amber", Failed: "red", Cancelled: "slate", "Partially Generated": "orange", "Retry Queue": "amber" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyInvoices = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], b2b: ri(420, 890, 650 + Math.sin(i * 0.6) * 150), b2c: ri(80, 280, 160 + Math.cos(i * 0.4) * 60), export: ri(30, 120, 70 + Math.sin(i * 0.8) * 30) }));
const gstDist = GST_RATES.map((r, i) => ({ n: r, v: ri(60, 380, 220 - i * 45) }));
const irnSuccessTrend = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], success: ri(88, 99, 94 + i * 0.35), failure: ri(1, 8, 4 - i * 0.2) }));
const stateVol = STATES.map(s => ({ n: s, v: ri(45, 320, 180 + Math.random() * 100) }));

interface InvoiceRecord { id: string; irn: string; invoiceNo: string; supplier: string; buyer: string; state: string; gstin: string; invoiceType: string; gstRate: string; taxableAmount: number; cgst: number; sgst: number; igst: number; totalAmount: number; status: string; generatedAt: string; ackNo: string;ewayBillLinked: boolean; itcEligible: boolean; }

const records: InvoiceRecord[] = [
  { id: "GIE-0001", irn: "fa37b2c8d1e94a5b8f3c6d2e1a0b4c7f", invoiceNo: "INV/2025/TS/001", supplier: "Tata Steel Ltd", buyer: "Mahindra Logistics", state: "Maharashtra", gstin: "27AABCT1332L1ZA", invoiceType: "B2B Regular", gstRate: "18%", taxableAmount: 485000, cgst: 43650, sgst: 43650, igst: 0, totalAmount: 572300, status: "Generated", generatedAt: "2025-01-15 09:12", ackNo: "1125011519012345", ewayBillLinked: true, itcEligible: true },
  { id: "GIE-0002", irn: "", invoiceNo: "INV/2025/RI/002", supplier: "Reliance Industries", buyer: "Blue Dart Express", state: "Karnataka", gstin: "29AABCR1791Q1Z5", invoiceType: "B2B Regular", gstRate: "18%", taxableAmount: 732000, cgst: 0, sgst: 0, igst: 131760, totalAmount: 863760, status: "Pending", generatedAt: "2025-01-15 09:35", ackNo: "", ewayBillLinked: false, itcEligible: true },
  { id: "GIE-0003", irn: "b8e41f3a7c5d9e2f6b0a4c7d8e1f3a5b", invoiceNo: "INV/2025/ML/003", supplier: "Mahindra Logistics", buyer: "DHL Supply Chain", state: "Tamil Nadu", gstin: "33AABCM5685K1ZD", invoiceType: "B2C Large", gstRate: "12%", taxableAmount: 218000, cgst: 13080, sgst: 13080, igst: 0, totalAmount: 244160, status: "Generated", generatedAt: "2025-01-15 10:02", ackNo: "1125011519023456", ewayBillLinked: true, itcEligible: true },
  { id: "GIE-0004", irn: "", invoiceNo: "INV/2025/BD/004", supplier: "Blue Dart Express", buyer: "TVS Supply Chain", state: "Gujarat", gstin: "24AABCB5821K1ZJ", invoiceType: "B2B Export", gstRate: "0%", taxableAmount: 1250000, cgst: 0, sgst: 0, igst: 0, totalAmount: 1250000, status: "Failed", generatedAt: "2025-01-15 10:28", ackNo: "", ewayBillLinked: false, itcEligible: false },
  { id: "GIE-0005", irn: "d2c6a8f0e4b1d7c9a3f5e8b2d1c6a4f8", invoiceNo: "INV/2025/TV/005", supplier: "TVS Supply Chain", buyer: "Delhivery Ltd", state: "Delhi", gstin: "07AABCT5621P1ZM", invoiceType: "B2B Regular", gstRate: "18%", taxableAmount: 396000, cgst: 35640, sgst: 35640, igst: 0, totalAmount: 467280, status: "Generated", generatedAt: "2025-01-15 11:15", ackNo: "1125011519034567", ewayBillLinked: true, itcEligible: true },
  { id: "GIE-0006", irn: "", invoiceNo: "INV/2025/DH/006", supplier: "DHL Supply Chain", buyer: "TCI Express", state: "Telangana", gstin: "36AABCD1234Q1Z8", invoiceType: "SEZ Supply", gstRate: "0%", taxableAmount: 890000, cgst: 0, sgst: 0, igst: 0, totalAmount: 890000, status: "Generated", generatedAt: "2025-01-15 11:42", ackNo: "1125011519045678", ewayBillLinked: true, itcEligible: false },
  { id: "GIE-0007", irn: "a1b3c5d7e9f0a2b4c6d8e0f1a3b5c7d9", invoiceNo: "INV/2025/DL/007", supplier: "Delhivery Ltd", buyer: "Tata Steel Ltd", state: "Rajasthan", gstin: "08AABCE7890R1ZT", invoiceType: "B2B Regular", gstRate: "28%", taxableAmount: 156000, cgst: 21840, sgst: 21840, igst: 0, totalAmount: 199680, status: "Generated", generatedAt: "2025-01-15 12:08", ackNo: "1125011519056789", ewayBillLinked: false, itcEligible: true },
  { id: "GIE-0008", irn: "", invoiceNo: "INV/2025/TC/008", supplier: "TCI Express", buyer: "Reliance Industries", state: "West Bengal", gstin: "19AABCF2345S1ZU", invoiceType: "Deemed Export", gstRate: "5%", taxableAmount: 640000, cgst: 16000, sgst: 16000, igst: 0, totalAmount: 672000, status: "Retry Queue", generatedAt: "2025-01-15 12:55", ackNo: "", ewayBillLinked: false, itcEligible: true },
  { id: "GIE-0009", irn: "f0e2d4c6b8a0f2e4d6c8b0a2f4e6d8c0", invoiceNo: "INV/2025/TS/009", supplier: "Tata Steel Ltd", buyer: "TVS Supply Chain", state: "Maharashtra", gstin: "27AABCT1332L1ZA", invoiceType: "B2C Large", gstRate: "18%", taxableAmount: 287000, cgst: 25830, sgst: 25830, igst: 0, totalAmount: 338660, status: "Generated", generatedAt: "2025-01-15 13:22", ackNo: "1125011519067890", ewayBillLinked: true, itcEligible: true },
  { id: "GIE-0010", irn: "", invoiceNo: "INV/2025/ML/010", supplier: "Mahindra Logistics", buyer: "Blue Dart Express", state: "Karnataka", gstin: "29AABCM5685K1ZD", invoiceType: "B2B Regular", gstRate: "12%", taxableAmount: 445000, cgst: 26700, sgst: 26700, igst: 0, totalAmount: 498400, status: "Cancelled", generatedAt: "2025-01-15 13:58", ackNo: "", ewayBillLinked: false, itcEligible: false },
  { id: "GIE-0011", irn: "c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7", invoiceNo: "INV/2025/RI/011", supplier: "Reliance Industries", buyer: "DHL Supply Chain", state: "Tamil Nadu", gstin: "33AABCR1791Q1Z5", invoiceType: "B2B Regular", gstRate: "18%", taxableAmount: 920000, cgst: 0, sgst: 0, igst: 165600, totalAmount: 1085600, status: "Partially Generated", generatedAt: "2025-01-15 14:15", ackNo: "1125011519078901", ewayBillLinked: true, itcEligible: true },
  { id: "GIE-0012", irn: "e5f7a1b3c5d7e9f1a3b5c7d9e1f3a5b7", invoiceNo: "INV/2025/BD/012", supplier: "Blue Dart Express", buyer: "Delhivery Ltd", state: "Gujarat", gstin: "24AABCB5821K1ZJ", invoiceType: "B2C Export", gstRate: "0%", taxableAmount: 1850000, cgst: 0, sgst: 0, igst: 0, totalAmount: 1850000, status: "Generated", generatedAt: "2025-01-15 14:48", ackNo: "1125011519089012", ewayBillLinked: true, itcEligible: false },
  { id: "GIE-0013", irn: "", invoiceNo: "INV/2025/TV/013", supplier: "TVS Supply Chain", buyer: "TCI Express", state: "Delhi", gstin: "07AABCT5621P1ZM", invoiceType: "B2B Regular", gstRate: "18%", taxableAmount: 352000, cgst: 31680, sgst: 31680, igst: 0, totalAmount: 415360, status: "Pending", generatedAt: "2025-01-15 15:22", ackNo: "", ewayBillLinked: false, itcEligible: true },
  { id: "GIE-0014", irn: "b9d1e3f5a7c9b1d3e5f7a9b1c3d5e7f9", invoiceNo: "INV/2025/DH/014", supplier: "DHL Supply Chain", buyer: "Tata Steel Ltd", state: "Telangana", gstin: "36AABCD1234Q1Z8", invoiceType: "B2B Regular", gstRate: "28%", taxableAmount: 678000, cgst: 94920, sgst: 94920, igst: 0, totalAmount: 867840, status: "Generated", generatedAt: "2025-01-15 15:55", ackNo: "1125011519090123", ewayBillLinked: true, itcEligible: true },
];

const generatedCount = records.filter(r => r.status === "Generated" || r.status === "Partially Generated").length;
const totalTaxable = records.reduce((s, r) => s + r.taxableAmount, 0);
const totalGST = records.reduce((s, r) => s + r.cgst + r.sgst + r.igst, 0);
const totalValue = records.reduce((s, r) => s + r.totalAmount, 0);
const avgIrnTime = "4.2s";

function fmtAmt(n: number): string { return n >= 10000000 ? `\u20b9${(n / 10000000).toFixed(1)}Cr` : n >= 100000 ? `\u20b9${(n / 100000).toFixed(1)}L` : n >= 1000 ? `\u20b9${(n / 1000).toFixed(1)}K` : `\u20b9${n}`; }

const kpis = [
  { l: "IRNs Generated", v: generatedCount, s: "of 14 invoices" },
  { l: "Total Taxable Value", v: fmtAmt(totalTaxable), s: "across all invoices" },
  { l: "Total GST Collected", v: fmtAmt(totalGST), s: "CGST + SGST + IGST" },
  { l: "Avg IRN Generation", v: avgIrnTime, s: "per invoice e-sign" },
];

const INSIGHTS = [
  {
    t: "India E-Invoicing Mandate Expands to GST Turnover Above \u20b95 Crore",
    c: "India\u2019s e-invoicing mandate under GST, managed by the CBIC through the Invoice Registration Portal (IRP), now applies to all businesses with aggregate annual turnover exceeding \u20b95 crore (effective from FY 2024-25), down from the initial threshold of \u20b9500 crore when the system launched in October 2020. The system processes over 12 crore e-invoices monthly through its network of 6 government-approved IRPs (NIC-IRP, e-Kencana, Cleartax, IRIS, NeSCAR, and GSTN). Each e-invoice is validated against the GST master registry, assigned a unique Invoice Reference Number (IRN) with a digitally signed QR code, and auto-populated into the GST returns (GSTR-1 and GSTR-2B). For logistics companies generating 5,000-50,000 invoices per month, e-invoicing integration through API eliminates manual data entry errors by 85% and reduces return filing time from 12-15 person-days to 2-3 person-days per month. The upcoming Phase 3 expansion will bring the threshold down to \u20b92 crore, potentially adding 18 lakh more businesses to the e-invoicing ecosystem, making real-time ERP-to-IRP integration mandatory for mid-sized logistics operators.",
  },
  {
    t: "E-Way Bill Automation and IRN Linkage for Logistics",
    c: "The integration of e-invoicing (IRN) with the e-way bill system has created a seamless GST compliance pipeline for India\u2019s logistics sector. Since April 2023, over 78% of e-way bills are auto-generated from IRN data without any manual re-entry, reducing the average e-way bill generation time from 8-12 minutes to under 45 seconds. The NIC e-way bill portal processes 2.8 crore e-way bills monthly, with logistics operators generating an average of 850-1,200 e-way bills per day for pan-India operations. For multi-modal freight movements involving rail-road transfers (ICD to port), a single IRN-linked e-way bill now covers the entire supply chain leg, eliminating the need for intermediate e-way bill generation at transshipment points. This integration also enables automated e-way bill extension for long-distance movements exceeding 1,000 km or 15 days, with the system auto-calculating remaining transit time based on GPS check-post data. Fleet operators leveraging the IRN-e-way bill API integration report 35% reduction in detention penalties at GST check-posts and 92% faster compliance documentation during transit audits by state GST authorities.",
  },
  {
    t: "ITC Reconciliation Through GSTR-2B Auto-Population",
    c: "The introduction of GSTR-2B, an auto-populated dynamic statement of Input Tax Credit (ITC) based on suppliers\u2019 GSTR-1 filings and e-invoice data, has fundamentally transformed ITC reconciliation for logistics businesses. Under the revised GST framework effective from January 2022, ITC eligibility is now determined by the matching of purchase invoices against GSTR-2B data, with a 30-day window for reversal of unmatched credits. For large logistics operators processing 10,000-25,000 purchase invoices monthly from 500+ suppliers across India, GSTR-2B automation has reduced ITC reconciliation effort by 70%, with an average monthly ITC claim accuracy improvement from 82% to 97.8%. Key compliance strategies include real-time IRN verification APIs that validate supplier GSTIN status and e-invoice authenticity before accepting delivery, automated matching of PO-invoice-GRN (three-way match) with GST component validation, and weekly GSTR-2B download automation that flags mismatches in CGST/SGST/IGST amounts between purchase registers and supplier filings. The estimated annual ITC protection for a mid-sized logistics company through automated reconciliation is \u20b912-18 lakh in prevented false credit claims and penalty avoidance.",
  },
  {
    t: "Multi-State GST Compliance and Registration Management",
    c: "India\u2019s GST framework requires logistics operators with operations across multiple states to maintain separate GST registrations in each state where they have a place of business, with 38 state/UT GST authorities currently active. A pan-India logistics company typically holds 12-18 GSTINs, each requiring monthly GSTR-1, GSTR-3B, and annual GSTR-9 filings, creating a complex compliance matrix that demands centralized GST management systems. The unified e-invoicing system provides a critical data backbone, as every IRN-linked invoice is automatically reported to both the supplier\u2019s and buyer\u2019s GSTIN jurisdictions, enabling cross-state reconciliation without manual intervention. Advanced implementations include AI-powered GST rate classification engines that auto-determine the applicable GST slab (0%, 5%, 12%, 18%, or 28%) based on HSN codes in the logistics service description, automated reverse charge mechanism detection for GTA (Goods Transport Agency) services where the recipient pays GST, and inter-state credit transfer optimization that maximizes ITC utilization across GSTINs while minimizing cash-out tax payments. Companies leveraging unified GST compliance platforms report 55% reduction in compliance costs and 40% fewer notices from state GST authorities.",
  },
];

export default function GstInvoiceEInvoicingCommandView() {
  const [tab, setTab] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const filterGroups = [
    { key: "invoiceType", label: "Type", options: INVOICE_TYPES.map(t => ({ value: t, count: records.filter(r => r.invoiceType === t).length })) },
    { key: "gstRate", label: "GST Rate", options: GST_RATES.map(gr => ({ value: gr, count: records.filter(r => r.gstRate === gr).length })) },
    { key: "status", label: "IRN Status", options: IRN_STATUS.map(s => ({ value: s, count: records.filter(r => r.status === s).length })) },
    { key: "state", label: "State", options: STATES.map(s => ({ value: s, count: records.filter(r => r.state === s).length })) },
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.invoiceNo.toLowerCase().includes(q) && !r.supplier.toLowerCase().includes(q) && !r.buyer.toLowerCase().includes(q) && !r.gstin.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(
      ([k, vs]) => vs.includes(r[k as keyof InvoiceRecord] as string)
    );
  });

  const maxAmt = Math.max(...records.map(r => r.totalAmount));

  return (
    <div className="gie-root p-6 space-y-6">
      <PageHeader
        title="GST Invoice & E-Invoicing Command"
        description="IRN generation, GST compliance, e-invoice registry, e-way bill linkage and ITC reconciliation for Indian logistics"
      />
      <div className="gie-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`gie-tab px-4 py-2 text-sm font-medium rounded-t ${
              tab === i ? "bg-teal-700 text-white" : "text-gray-600 hover:bg-teal-50"
            }`}
          >{t}</button>
        ))}
      </div>

      {tab === 0 && (
        <div className="gie-dash space-y-6">
          <div className="gie-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (
              <div key={k.l} className="gie-kpi bg-white rounded-lg border p-4">
                <div className="text-xs text-gray-500 gie-kpi-label">{k.l}</div>
                <div className="text-2xl font-bold text-teal-700 gie-kpi-val">{k.v}</div>
                <div className="text-xs text-gray-400 gie-kpi-sub">{k.s}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="gie-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">Monthly Invoice Volume by Type</h3>
              <BarChart data={monthlyInvoices} height={220}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="m" /><YAxis /><Tooltip /><Legend />
                <Bar dataKey="b2b" fill="#0f766e" radius={[4, 4, 0, 0]} name="B2B" />
                <Bar dataKey="b2c" fill="#14b8a6" radius={[4, 4, 0, 0]} name="B2C" />
                <Bar dataKey="export" fill="#5eead4" radius={[4, 4, 0, 0]} name="Export" />
              </BarChart>
            </div>
            <div className="gie-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">GST Rate Distribution</h3>
              <PieChart width={400} height={220}>
                <Pie data={gstDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>
                  {gstDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="gie-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">IRN Success Rate Trend (12 Months)</h3>
              <LineChart data={irnSuccessTrend} height={220}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="m" /><YAxis domain={[0, 100]} /><Tooltip /><Legend />
                <Line type="monotone" dataKey="success" stroke="#0f766e" strokeWidth={2} name="Success %" />
                <Line type="monotone" dataKey="failure" stroke="#dc2626" strokeWidth={2} name="Failure %" />
              </LineChart>
            </div>
            <div className="gie-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">Invoice Volume by State</h3>
              <BarChart data={stateVol} height={220}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip />
                <Bar dataKey="v" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="gie-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "GST", href: "#" }, { label: "Invoice Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="gie-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  {"ID,IRN,Invoice No,Supplier,Buyer,GSTIN,Type,GST Rate,Taxable,CGST,SGST,IGST,Total,Status,IRN Date,Ack No,E-Way,ITC"
                    .split(",").map(h => (
                    <th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => {
                  const rowCls = r.status === "Failed"
                    ? "gie-row-critical bg-red-50"
                    : r.status === "Pending" || r.status === "Retry Queue"
                      ? "gie-row-warning bg-amber-50" : "";
                  const tp = ri(0, 100, (r.totalAmount / maxAmt) * 100);
                  return (
                    <tr key={r.id} className={`border-b hover:bg-teal-50/50 ${rowCls}`}>
                      <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                      <td className="px-3 py-2">
                        {r.irn ? (
                          <span className="gie-irn inline-block px-2 py-0.5 rounded text-xs bg-teal-100 text-teal-700 font-mono" title={r.irn}>{r.irn.substring(0, 12)}...</span>
                        ) : (
                          <span className="text-slate-400 text-xs">Pending</span>
                        )}
                      </td>
                      <td className="px-3 py-2 font-mono text-xs">{r.invoiceNo}</td>
                      <td className="px-3 py-2 text-xs">{r.supplier}</td>
                      <td className="px-3 py-2 text-xs">{r.buyer}</td>
                      <td className="px-3 py-2"><span className="gie-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700 font-mono">{r.gstin}</span></td>
                      <td className="px-3 py-2"><span className="gie-badge inline-block px-2 py-0.5 rounded text-xs bg-indigo-100 text-indigo-700">{r.invoiceType}</span></td>
                      <td className="px-3 py-2"><span className="gie-badge inline-block px-2 py-0.5 rounded text-xs font-semibold bg-teal-100 text-teal-700">{r.gstRate}</span></td>
                      <td className="px-3 py-2 font-medium">{fmtAmt(r.taxableAmount)}</td>
                      <td className="px-3 py-2 text-xs text-gray-500">{r.cgst > 0 ? fmtAmt(r.cgst) : "\u2014"}</td>
                      <td className="px-3 py-2 text-xs text-gray-500">{r.sgst > 0 ? fmtAmt(r.sgst) : "\u2014"}</td>
                      <td className="px-3 py-2 text-xs text-gray-500">{r.igst > 0 ? fmtAmt(r.igst) : "\u2014"}</td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{fmtAmt(r.totalAmount)}</span>
                          <div className="w-16 h-1.5 bg-gray-200 rounded">
                            <div className="gie-amount-bar h-1.5 bg-teal-500 rounded" style={{ width: `${tp}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2"><span className={`gie-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[statusColor[r.status]]}`}>{r.status}</span></td>
                      <td className="px-3 py-2 text-xs text-gray-500">{r.generatedAt}</td>
                      <td className="px-3 py-2 text-xs font-mono">{r.ackNo || "\u2014"}</td>
                      <td className="px-3 py-2">
                        {r.ewayBillLinked ? (
                          <span className="gie-eway inline-block px-2 py-0.5 rounded text-xs bg-green-100 text-green-700">Linked</span>
                        ) : (
                          <span className="text-slate-400 text-xs">Not Linked</span>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        {r.itcEligible ? (
                          <span className="gie-itc inline-block px-2 py-0.5 rounded text-xs bg-teal-100 text-teal-700">Eligible</span>
                        ) : (
                          <span className="gie-no-itc inline-block px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-500">N/A</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="gie-analytics space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="gie-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">CGST vs SGST vs IGST Collection (12 Months)</h3>
              <AreaChart data={Array.from({ length: 12 }, (_, i) => ({ m: MO[i], cgst: ri(18, 42, 28 + Math.sin(i * 0.5) * 10), sgst: ri(16, 40, 26 + Math.cos(i * 0.5) * 8), igst: ri(8, 28, 16 + Math.sin(i * 0.7) * 6) }))} height={240}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="m" /><YAxis /><Tooltip /><Legend />
                <Area type="monotone" dataKey="cgst" stackId="1" stroke="#0f766e" fill="#ccfbf1" name="CGST" />
                <Area type="monotone" dataKey="sgst" stackId="1" stroke="#14b8a6" fill="#99f6e4" name="SGST" />
                <Area type="monotone" dataKey="igst" stackId="1" stroke="#5eead4" fill="#5eead4" name="IGST" />
              </AreaChart>
            </div>
            <div className="gie-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">IRN Generation Latency Trend</h3>
              <LineChart data={Array.from({ length: 12 }, (_, i) => ({ m: MO[i], latency: +(ri(3.2, 6.8, 4.5 - i * 0.08)).toFixed(1) }))} height={240}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="m" /><YAxis domain={[2, 8]} /><Tooltip />
                <Line type="monotone" dataKey="latency" stroke="#0f766e" strokeWidth={2} name="Avg Latency (s)" />
              </LineChart>
            </div>
          </div>
          <div className="gie-chart bg-white rounded-lg border p-4">
            <h3 className="text-sm font-semibold mb-3">Invoice Value by Supplier</h3>
            <BarChart data={SUPPLIERS.map(s => ({ n: s, v: +ri(1800000, 8500000, 4500000 + Math.random() * 3000000).toFixed(0) }))} height={240}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip formatter={(v: number) => fmtAmt(v)} />
              <Bar dataKey="v" fill="#14b8a6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </div>
        </div>
      )}

      {tab === 3 && (
        <div className="gie-insights grid grid-cols-2 gap-6">
          {INSIGHTS.map(ins => (
            <div key={ins.t} className="gie-insight bg-white rounded-lg border p-5">
              <h3 className="text-base font-bold text-teal-800 mb-2">{ins.t}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
