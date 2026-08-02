"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#16a34a", "#22c55e", "#4ade80", "#86efac", "#15803d", "#14532d", "#bbf7d0", "#dcfce7"];
const WAREHOUSES = ["FCI Karnal Haryana", "FCI Kandla Gujarat", "FCI Chennai TN", "FCI Bhopal MP", "CWC Mumbai", "SWC Kolkata", "State Godown Lucknow", "Private Silo Indore"];
const COMMODITIES = ["Wheat", "Rice (Paddy)", "Maize", "Pulses (Arhar/Toor)", "Mustard Seed", "Barley", "Sorghum (Jowar)", "Millet (Bajra)"];
const STORAGE_TYPES = ["Covered Godown", "CAP Storage", "Silos (Mechanized)", "Cold Storage", "Open Plinth", "Flat Warehouse"];
const STATES = ["Punjab", "Haryana", "Madhya Pradesh", "Uttar Pradesh", "Rajasthan", "Gujarat", "Tamil Nadu", "West Bengal"];
const QUALITY_STATUSES = ["A Grade", "B Grade", "C Grade", "Under QC", "Rejected", "Quarantine"];
const TABS = ["Dashboard", "Storage Registry", "Quality Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", blue: "bg-blue-100 text-blue-700", slate: "bg-slate-100 text-slate-600", orange: "bg-orange-100 text-orange-700" };
const statusColor: Record<string, string> = { "A Grade": "green", "B Grade": "blue", "C Grade": "amber", "Under QC": "slate", "Rejected": "red", "Quarantine": "orange" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyProcurement = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], wheat: ri(2200, 5500, 3800 + Math.sin(i * 0.5) * 1200), rice: ri(1800, 4200, 2900 + Math.cos(i * 0.6) * 800), pulses: ri(400, 950, 650 + Math.sin(i * 0.7) * 180) }));
const storageTypeDist = [{ n: "Covered Godown", v: 38 }, { n: "CAP Storage", v: 22 }, { n: "Silos", v: 15 }, { n: "Cold Storage", v: 12 }, { n: "Open Plinth", v: 8 }, { n: "Flat Warehouse", v: 5 }];
const capacityUtil = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], actual: +(ri(68, 95, 82 + Math.sin(i * 0.4) * 8)).toFixed(1), target: 75.0 }));
const commodityMix = COMMODITIES.slice(0, 6).map(c => ({ n: c.split(" ")[0], v: +ri(180, 850, 480 + Math.random() * 280).toFixed(0) }));

interface StorageRecord { id: string; lotNo: string; commodity: string; warehouse: string; state: string; storageType: string; quantity: number; unit: string; moisture: number; foreignMatter: number; procurementDate: string; mspRate: number; procurementValue: number; qualityStatus: string; bufferStock: boolean; fciAllocation: string; expiryDate: string; lastInspection: string; insectActivity: string; fumigationDate: string; bagCondition: string; remarks: string; }

const records: StorageRecord[] = [
  { id: "AWC-0001", lotNo: "LOT-WH-2025-0142", commodity: "Wheat", warehouse: "FCI Karnal Haryana", state: "Haryana", storageType: "Covered Godown", quantity: 12500, unit: "MT", moisture: 12.2, foreignMatter: 0.8, procurementDate: "2025-04-10", mspRate: 2275, procurementValue: 28437500, qualityStatus: "A Grade", bufferStock: true, fciAllocation: "PDS Central Pool", expiryDate: "2026-04-10", lastInspection: "2025-07-15", insectActivity: "None", fumigationDate: "2025-06-01", bagCondition: "Good", remarks: "Rabi 2025 procurement - Grade A quality" },
  { id: "AWC-0002", lotNo: "LOT-RC-2025-0088", commodity: "Rice (Paddy)", warehouse: "FCI Chennai TN", state: "Tamil Nadu", storageType: "Silos (Mechanized)", quantity: 8200, unit: "MT", moisture: 13.8, foreignMatter: 1.2, procurementDate: "2025-01-20", mspRate: 2320, procurementValue: 19024000, qualityStatus: "A Grade", bufferStock: false, fciAllocation: "State PDS Pool", expiryDate: "2026-01-20", lastInspection: "2025-07-10", insectActivity: "None", fumigationDate: "2025-05-15", bagCondition: "Good", remarks: "Kharif Samba rice - silo stored" },
  { id: "AWC-0003", lotNo: "LOT-PL-2025-0045", commodity: "Pulses (Arhar/Toor)", warehouse: "FCI Bhopal MP", state: "Madhya Pradesh", storageType: "Covered Godown", quantity: 3200, unit: "MT", moisture: 11.5, foreignMatter: 0.6, procurementDate: "2025-03-15", mspRate: 7550, procurementValue: 24160000, qualityStatus: "Under QC", bufferStock: false, fciAllocation: "PM Garib Kalyan Anna", expiryDate: "2026-03-15", lastInspection: "2025-07-18", insectActivity: "None", fumigationDate: "2025-06-20", bagCondition: "Good", remarks: "Quality check pending - moisture at threshold" },
  { id: "AWC-0004", lotNo: "LOT-MZ-2025-0033", commodity: "Maize", warehouse: "CWC Mumbai", state: "Gujarat", storageType: "CAP Storage", quantity: 5600, unit: "MT", moisture: 14.5, foreignMatter: 1.8, procurementDate: "2025-02-28", mspRate: 1962, procurementValue: 10987200, qualityStatus: "C Grade", bufferStock: false, fciAllocation: "Feed Industry", expiryDate: "2025-08-28", lastInspection: "2025-07-05", insectActivity: "Minor", fumigationDate: "2025-07-10", bagCondition: "Fair", remarks: "High moisture - CAP with tarpaulin cover" },
  { id: "AWC-0005", lotNo: "LOT-MS-2025-0056", commodity: "Mustard Seed", warehouse: "SWC Kolkata", state: "West Bengal", storageType: "Flat Warehouse", quantity: 2800, unit: "MT", moisture: 9.8, foreignMatter: 0.4, procurementDate: "2025-03-01", mspRate: 5650, procurementValue: 15820000, qualityStatus: "A Grade", bufferStock: false, fciAllocation: "Oilseed Buffer", expiryDate: "2026-03-01", lastInspection: "2025-07-12", insectActivity: "None", fumigationDate: "2025-06-10", bagCondition: "Good", remarks: "Rabi mustard - low moisture excellent quality" },
  { id: "AWC-0006", lotNo: "LOT-WH-2025-0198", commodity: "Wheat", warehouse: "FCI Kandla Gujarat", state: "Gujarat", storageType: "Covered Godown", quantity: 15000, unit: "MT", moisture: 12.8, foreignMatter: 0.9, procurementDate: "2025-04-25", mspRate: 2275, procurementValue: 34125000, qualityStatus: "B Grade", bufferStock: true, fciAllocation: "PDS Central Pool", expiryDate: "2026-04-25", lastInspection: "2025-07-08", insectActivity: "None", fumigationDate: "2025-05-20", bagCondition: "Good", remarks: "Gujarat wheat - slight foreign matter" },
  { id: "AWC-0007", lotNo: "LOT-BL-2025-0022", commodity: "Barley", warehouse: "State Godown Lucknow", state: "Uttar Pradesh", storageType: "Covered Godown", quantity: 4100, unit: "MT", moisture: 11.2, foreignMatter: 0.5, procurementDate: "2025-03-20", mspRate: 1735, procurementValue: 7113500, qualityStatus: "A Grade", bufferStock: false, fciAllocation: "State Buffer", expiryDate: "2026-03-20", lastInspection: "2025-07-14", insectActivity: "None", fumigationDate: "2025-06-15", bagCondition: "Good", remarks: "Barley for brewery industry allocation" },
  { id: "AWC-0008", lotNo: "LOT-JW-2025-0018", commodity: "Sorghum (Jowar)", warehouse: "Private Silo Indore", state: "Madhya Pradesh", storageType: "Silos (Mechanized)", quantity: 3500, unit: "MT", moisture: 13.2, foreignMatter: 1.4, procurementDate: "2025-02-10", mspRate: 2970, procurementValue: 10395000, qualityStatus: "B Grade", bufferStock: false, fciAllocation: "PDS Tribal Area", expiryDate: "2026-02-10", lastInspection: "2025-07-16", insectActivity: "None", fumigationDate: "2025-06-05", bagCondition: "Good", remarks: "Kharif jowar - private silo storage" },
  { id: "AWC-0009", lotNo: "LOT-RC-2025-0105", commodity: "Rice (Paddy)", warehouse: "FCI Chennai TN", state: "Tamil Nadu", storageType: "Covered Godown", quantity: 9800, unit: "MT", moisture: 15.2, foreignMatter: 2.1, procurementDate: "2025-01-05", mspRate: 2320, procurementValue: 22736000, qualityStatus: "Quarantine", bufferStock: false, fciAllocation: "Under Review", expiryDate: "2026-01-05", lastInspection: "2025-07-18", insectActivity: "Detected", fumigationDate: "2025-07-18", bagCondition: "Damaged", remarks: "Moisture breach 15.2% - insect activity found - quarantine" },
  { id: "AWC-0010", lotNo: "LOT-WH-2025-0210", commodity: "Wheat", warehouse: "FCI Karnal Haryana", state: "Haryana", storageType: "Covered Godown", quantity: 18000, unit: "MT", moisture: 11.8, foreignMatter: 0.6, procurementDate: "2025-04-15", mspRate: 2275, procurementValue: 40950000, qualityStatus: "A Grade", bufferStock: true, fciAllocation: "PDS Central Pool", expiryDate: "2026-04-15", lastInspection: "2025-07-12", insectActivity: "None", fumigationDate: "2025-06-25", bagCondition: "Good", remarks: "Punjab-Haryana wheat belt - premium quality" },
  { id: "AWC-0011", lotNo: "LOT-BJ-2025-0029", commodity: "Millet (Bajra)", warehouse: "FCI Kandla Gujarat", state: "Rajasthan", storageType: "Open Plinth", quantity: 2200, unit: "MT", moisture: 12.5, foreignMatter: 1.6, procurementDate: "2025-03-10", mspRate: 2583, procurementValue: 5682600, qualityStatus: "B Grade", bufferStock: false, fciAllocation: "State PDS", expiryDate: "2025-09-10", lastInspection: "2025-07-06", insectActivity: "Minor", fumigationDate: "2025-07-06", bagCondition: "Fair", remarks: "Open plinth storage - monsoon protection needed" },
  { id: "AWC-0012", lotNo: "LOT-PL-2025-0062", commodity: "Pulses (Arhar/Toor)", warehouse: "Private Silo Indore", state: "Madhya Pradesh", storageType: "Cold Storage", quantity: 1500, unit: "MT", moisture: 10.2, foreignMatter: 0.3, procurementDate: "2025-04-05", mspRate: 7550, procurementValue: 11325000, qualityStatus: "A Grade", bufferStock: false, fciAllocation: "PM GKAY Allocation", expiryDate: "2026-04-05", lastInspection: "2025-07-17", insectActivity: "None", fumigationDate: "2025-06-18", bagCondition: "Good", remarks: "Cold stored pulses - premium quality maintained" },
  { id: "AWC-0013", lotNo: "LOT-WH-2025-0225", commodity: "Wheat", warehouse: "FCI Bhopal MP", state: "Madhya Pradesh", storageType: "Covered Godown", quantity: 11200, unit: "MT", moisture: 12.4, foreignMatter: 0.7, procurementDate: "2025-04-20", mspRate: 2275, procurementValue: 25480000, qualityStatus: "Rejected", bufferStock: false, fciAllocation: "Pending Disposal", expiryDate: "", lastInspection: "2025-07-18", insectActivity: "Detected", fumigationDate: "2025-07-15", bagCondition: "Damaged", remarks: "Fungal growth detected - rejected for PDS use" },
  { id: "AWC-0014", lotNo: "LOT-MZ-2025-0041", commodity: "Maize", warehouse: "SWC Kolkata", state: "West Bengal", storageType: "Covered Godown", quantity: 4800, unit: "MT", moisture: 13.0, foreignMatter: 1.0, procurementDate: "2025-03-25", mspRate: 1962, procurementValue: 9417600, qualityStatus: "B Grade", bufferStock: false, fciAllocation: "Feed & Poultry", expiryDate: "2026-03-25", lastInspection: "2025-07-10", insectActivity: "None", fumigationDate: "2025-06-12", bagCondition: "Good", remarks: "Rabi maize - poultry feed allocation" },
];

const gradeACount = records.filter(r => r.qualityStatus === "A Grade").length;
const pendingQCCount = records.filter(r => r.qualityStatus === "Under QC" || r.qualityStatus === "Quarantine" || r.qualityStatus === "Rejected").length;
const bufferStockCount = records.filter(r => r.bufferStock).length;
const totalProcurementValue = records.reduce((s, r) => s + r.procurementValue, 0);

function fmtVal(n: number): string {
  if (n >= 10000000) return `\u20b9${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `\u20b9${(n / 100000).toFixed(1)}L`;
  return `\u20b9${(n / 1000).toFixed(0)}K`;
}

const kpis = [
  { l: "A Grade Lots", v: gradeACount, s: "premium quality stock" },
  { l: "QC / Rejected", v: pendingQCCount, s: "pending or flagged" },
  { l: "Buffer Stock", v: bufferStockCount, s: "central pool lots" },
  { l: "Total Procurement", v: fmtVal(totalProcurementValue), s: "across all lots" },
];

const INSIGHTS = [
  {
    t: "India Foodgrain Storage: 738 LMT Buffer Stock Across FCI, CWC and SWC",
    c: "India\u2019s foodgrain storage infrastructure, managed primarily by the Food Corporation of India (FCI), Central Warehousing Corporation (CWC), and 17 State Warehousing Corporations (SWCs), maintains an aggregate storage capacity of approximately 1,050 lakh metric tonnes (LMT) across 2,400+ warehouses, with current buffer stock holdings of 738 LMT (318 LMT wheat + 420 LMT rice as of January 2025). FCI operates 725 godowns with 365 LMT capacity, CWC manages 400 warehouses with 112 LMT capacity, SWCs collectively hold 1,800 godowns with 420 LMT capacity, and private silo operators (Adani Agri Logistics, Punj Llyod, National Bulk Handling Corp) operate 65 modern silo complexes with 100 LMT of mechanized storage. India\u2019s foodgrain procurement for FY2024-25 rabi marketing season has reached 342 LMT of wheat at MSP \u20b92,275/quintal (total value \u20b977,800 crore) and kharif marketing season procurement of 512 LMT rice at MSP \u20b92,320/quintal (total value \u20b91,18,800 crore). The Public Distribution System (PDS), under the National Food Security Act (NFSA) 2013, distributes 540 LMT annually to 81.35 crore beneficiaries through 5.33 lakh fair price shops. Key storage infrastructure challenges include: 15-18% storage losses due to inadequate covered storage (India loses approximately 40-50 LMT of foodgrains annually worth \u20b99,000-12,000 crore), 25% of FCI godowns are over 30 years old requiring modernization, and only 10% of total storage capacity is mechanized (silos with automated conveyors, aeration, and temperature monitoring). The Government of India has allocated \u20b915,000 crore under the Agricultural Infrastructure Fund (AIF) for construction of 2,500 new warehouses and 200 silo complexes by 2028, targeting 100% covered and mechanized storage for all foodgrains under the PM Kisan Sampada Yojana.",
  },
  {
    t: "Quality Control and Fumigation: Moisture, Foreign Matter, Insect Management",
    c: "Foodgrain quality management in Indian storage facilities follows the Food Safety and Standards Authority of India (FSSAI) guidelines and FCI\u2019s Quality Assurance Division (QAD) protocols, which mandate quarterly inspections for all buffer stock lots covering 14 quality parameters: moisture content (wheat: max 14%, rice: max 14.5%, pulses: max 14%), foreign matter (max 1.0% for Grade A, 2.0% for Grade B, 3.0% for Grade C), insect damage (max 1% by weight), fungal growth, aflatoxin levels (max 20 ppb for wheat, 30 ppb for maize), urea contamination, gloss and finish (for rice),Broken percentage (rice: max 25% for Grade A), milling recovery (rice: min 67% for Grade A), and germination test (min 80% for seed-grade storage). The fumigation schedule at FCI warehouses follows a systematic cycle: prophylactic fumigation with Aluminum Phosphide (ALP) tablets every 6 months (April and October), curative fumigation upon insect activity detection (immediate treatment within 48 hours), and post-fumigation aeration for 72 hours before re-sealing. India\u2019s stored grain pest management faces challenges from 12 major insect species: Sitophilus oryzae (rice weevil, 35% of infestations), Rhyzopertha dominica (lesser grain borer, 25%), Tribolium castaneum (red flour beetle, 20%), Trogoderma granarium (khapra beetle, regulated quarantine pest), and Corcyra cephalonica (rice moth). Modern FCI warehouses deploy pheromone traps (150-200 per godown), metal bin storage with hermetic sealing (zero-insect technology), and automated temperature/humidity monitoring systems (sensors every 100 sqm). Facilities with integrated pest management (IPM) systems report 85% reduction in insect activity incidents, 40% reduction in quality downgrade (Grade A to Grade B), and 60% extension in safe storage period (from 6 months to 10+ months). The adoption of solar-powered aeration systems and dehumidification units in modern silo complexes has further improved storage life by maintaining constant 12-13% moisture and 25-28\u00b0C temperature throughout the year.",
  },
  {
    t: "MSP Procurement and PDS Distribution: \u20b92.27 Lakh Crore Annual Operation",
    c: "India\u2019s Minimum Support Price (MSP) based foodgrain procurement and Public Distribution System (PDS) constitute the world\u2019s largest food safety net, with annual procurement operations valued at \u20b91.96 lakh crore (FY2024: wheat \u20b978,000 crore + rice \u20b91,18,000 crore) and distribution of 540 LMT foodgrains to 81.35 crore NFSA beneficiaries (67% of India\u2019s population). The MSP procurement process involves: (1) State government notification of procurement centers (Punjab operates 4,200 procurement centers for wheat, Haryana 1,800, MP 2,500, UP 3,200), (2) Payment to farmers within 48 hours of procurement through direct benefit transfer (DBT) to PM-KISAN registered bank accounts, (3) Quality inspection by FCI\u2019s Quality Control Inspectors (QCIs) at the mandi/procurement center, (4) Transportation to nearest FCI depot by state agencies (PUNSUP, HAFED, MARKFED), and (5) Storage in FCI/CWC/SWC godowns for buffer stock. The MSP for Rabi 2025-26 crops: Wheat \u20b92,275/quintal (+5.4% YoY), Barley \u20b91,735/quintal, Mustard \u20b95,650/quintal, and Gram \u20b95,415/quintal. The PDS distribution involves: monthly allocation of 35 kg foodgrains per Antyodaya household and 5 kg per person for Priority Household families, transportation from FCI godowns to 5.33 lakh FPS (Fair Price Shops), electronic Point of Sale (ePoS) devices at 99.5% of FPS for biometric authentication (Aadhaar-based), and end-to-end computerization of PDS supply chain through the integrated ANTES portal. States with highest PDS offtake include Uttar Pradesh (85 LMT/year), Bihar (62 LMT), Maharashtra (48 LMT), West Bengal (45 LMT), and Madhya Pradesh (38 LMT). The PM Garib Kalyan Anna Yojana (PM-GKAY) free foodgrain scheme (5 kg per person per month for all 81.35 crore NFSA beneficiaries) has been extended until December 2028, adding \u20b92 lakh crore annually to the food subsidy bill.",
  },
  {
    t: "Agricultural Infrastructure Fund: Modern Silos, Cold Storage, and Grid Integration",
    c: "India\u2019s Agricultural Infrastructure Fund (AIF), launched in July 2020 with a corpus of \u20b91 lakh crore, has sanctioned \u20b945,000 crore in loans for 11,200+ agricultural infrastructure projects across India as of January 2025, with \u20b928,000 crore disbursed and 7,800 projects completed. Key infrastructure investments include: (1) Modern silo complexes \u2014 Adani Agri Logistics operates 25 silo complexes (total 25 LMT capacity) across Punjab, Haryana, MP, and Gujarat with automated bulk handling, conveying, and cleaning systems; Punj Llyod operates 8 silo complexes (10 LMT); and National Bulk Handling Corporation operates 5 complexes (5 LMT), with FCI awarding 100 additional silo complexes (50 LMT capacity) through the Public-Private Partnership (PPP) model under the Silo Pilot Project Phase II. (2) Cold storage expansion \u2014 India\u2019s 8,200+ cold storages (total 370 LMT capacity, mostly for potatoes and onions) are being augmented with 1,200 new multi-commodity cold storages under AIF, with focus on horticulture produce (fruits, vegetables, flowers) with controlled atmosphere (CA) storage and modified atmosphere packaging (MAP) technology. (3) Warehouse Receipt System \u2014 WDRA (Warehousing Development and Regulatory Authority) has registered 6,500+ warehouses for negotiable warehouse receipt (eWR) issuance, enabling farmers to pledge stored commodities for bank loans (cumulative eWR financing: \u20b912,000 crore in FY2024, \u20b98,500 crore of which through NCDEX and \u20b93,500 crore through state agricultural marketing boards). (4) Grain storage grid integration \u2014 the integration of FCI godowns with Indian Railways Dedicated Freight Corridor (DFC) network for efficient movement from surplus to deficit states, with automated loading/unloading at 35 new rail sidings being developed. Companies operating modern integrated agricultural logistics (silo + rail + cold chain + eWR) report 30% reduction in storage losses, 25% faster procurement-to-distribution cycle (from 21 days to 15 days), and 40% improvement in farmer price realization through eWR-pledged bank financing.",
  },
];

export default function AgriWarehousingCommandView() {
  const [tab, setTab] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const filterGroups = [
    { key: "qualityStatus", label: "Quality", options: QUALITY_STATUSES.map(s => ({ value: s, count: records.filter(r => r.qualityStatus === s).length })) },
    { key: "commodity", label: "Commodity", options: COMMODITIES.map(c => ({ value: c, count: records.filter(r => r.commodity === c).length })) },
    { key: "storageType", label: "Storage Type", options: STORAGE_TYPES.map(t => ({ value: t, count: records.filter(r => r.storageType === t).length })) },
    { key: "state", label: "State", options: STATES.map(s => ({ value: s, count: records.filter(r => r.state === s).length })) },
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.lotNo.toLowerCase().includes(q) && !r.commodity.toLowerCase().includes(q) && !r.warehouse.toLowerCase().includes(q) && !r.fciAllocation.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof StorageRecord] as string));
  });

  return (
    <div className="awc-root p-6 space-y-6">
      <PageHeader title="Agri Warehousing Command" description="Foodgrain storage management, FCI/CWC/SWC warehouse operations, MSP procurement tracking, quality inspection, buffer stock monitoring, fumigation scheduling, and PDS distribution logistics across India" />
      <div className="awc-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`awc-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-green-700 text-white" : "text-gray-600 hover:bg-green-50"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="awc-dash space-y-6">
          <div className="awc-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (<div key={k.l} className="awc-kpi bg-white rounded-lg border p-4"><div className="text-xs text-gray-500 awc-kpi-label">{k.l}</div><div className="text-2xl font-bold text-green-700 awc-kpi-val">{k.v}</div><div className="text-xs text-gray-400 awc-kpi-sub">{k.s}</div></div>))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="awc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Procurement by Commodity (K MT)</h3><BarChart data={monthlyProcurement} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="wheat" fill="#16a34a" radius={[4,4,0,0]} name="Wheat" /><Bar dataKey="rice" fill="#22c55e" radius={[4,4,0,0]} name="Rice" /><Bar dataKey="pulses" fill="#4ade80" radius={[4,4,0,0]} name="Pulses" /></BarChart></div>
            <div className="awc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Storage Type Distribution</h3><PieChart width={400} height={220}><Pie data={storageTypeDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{storageTypeDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="awc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Capacity Utilization vs 75% Target</h3><LineChart data={capacityUtil} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[60, 100]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#16a34a" strokeWidth={2} name="Actual %" /><Line type="monotone" dataKey="target" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" name="Target 75%" /></LineChart></div>
            <div className="awc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Stock by Commodity (K MT)</h3><BarChart data={commodityMix} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#22c55e" radius={[4,4,0,0]} /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="awc-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "Agri Storage", href: "#" }, { label: "Storage Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="awc-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{"ID,Lot No,Commodity,Warehouse,State,Type,Qty (MT),Moisture %,FM %,MSP,Value,Quality,Buffer,FCI Allocation,Inspection,Insects,Fumigation,Bag,Expiry,Remarks"
                .split(",").map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const rowCls = r.qualityStatus === "Rejected" ? "awc-row-critical bg-red-50" : r.qualityStatus === "Quarantine" ? "awc-row-warning bg-amber-50" : r.qualityStatus === "Under QC" ? "awc-row-info bg-blue-50" : "";
              return (<tr key={r.id} className={`border-b hover:bg-green-50/50 ${rowCls}`}>
                <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                <td className="px-3 py-2"><span className="awc-badge inline-block px-2 py-0.5 rounded text-xs bg-green-700 text-white font-mono">{r.lotNo.split("-").pop()}</span></td>
                <td className="px-3 py-2 text-xs">{r.commodity}</td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.warehouse}</td>
                <td className="px-3 py-2 text-xs">{r.state}</td>
                <td className="px-3 py-2"><span className="awc-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.storageType}</span></td>
                <td className="px-3 py-2 text-xs font-semibold">{r.quantity.toLocaleString()}</td>
                <td className="px-3 py-2"><span className={`text-xs font-semibold ${r.moisture > 14 ? "text-red-600" : r.moisture > 13 ? "text-amber-600" : "text-green-600"}`}>{r.moisture}%</span></td>
                <td className="px-3 py-2 text-xs">{r.foreignMatter}%</td>
                <td className="px-3 py-2 text-xs">\u20b9{r.mspRate}</td>
                <td className="px-3 py-2 text-xs font-semibold">{fmtVal(r.procurementValue)}</td>
                <td className="px-3 py-2"><span className={`awc-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[statusColor[r.qualityStatus]]}`}>{r.qualityStatus}</span></td>
                <td className="px-3 py-2">{r.bufferStock ? <span className="awc-badge inline-block px-2 py-0.5 rounded text-xs bg-green-100 text-green-700">Buffer</span> : <span className="text-gray-400 text-xs">\u2014</span>}</td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.fciAllocation}</td>
                <td className="px-3 py-2 text-xs">{r.lastInspection}</td>
                <td className="px-3 py-2">{r.insectActivity !== "None" ? <span className="awc-badge inline-block px-2 py-0.5 rounded text-xs bg-red-100 text-red-700">{r.insectActivity}</span> : <span className="text-green-600 text-xs">Clean</span>}</td>
                <td className="px-3 py-2 text-xs">{r.fumigationDate}</td>
                <td className="px-3 py-2"><span className={`inline-block px-2 py-0.5 rounded text-xs ${r.bagCondition === "Good" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{r.bagCondition}</span></td>
                <td className="px-3 py-2 text-xs">{r.expiryDate || <span className="text-slate-400">\u2014</span>}</td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-32 truncate">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="awc-analytics space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="awc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Stock Volume by Warehouse</h3><BarChart data={WAREHOUSES.slice(0,6).map(w => ({ n: w.split(" ")[1] + " " + w.split(" ")[2], v: +ri(8200, 28000, 15000 + Math.random() * 10000).toFixed(0) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#16a34a" radius={[4,4,0,0]} /></BarChart></div>
            <div className="awc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Stock by State Corridor</h3><AreaChart data={Array.from({ length: 12 }, (_, i) => ({ m: MO[i], north: ri(18000, 45000, 31000 + Math.sin(i*0.5)*5000), central: ri(12000, 30000, 21000 + Math.cos(i*0.6)*4000), south: ri(8000, 22000, 14000 + Math.sin(i*0.7)*3500) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Area type="monotone" dataKey="north" stackId="1" stroke="#16a34a" fill="#dcfce7" name="North (PB/HR)" /><Area type="monotone" dataKey="central" stackId="1" stroke="#22c55e" fill="#bbf7d0" name="Central (MP/UP)" /><Area type="monotone" dataKey="south" stackId="1" stroke="#4ade80" fill="#86efac" name="South (TN/GJ)" /></AreaChart></div>
          </div>
          <div className="awc-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Avg Moisture % by Commodity</h3><BarChart data={[{n:"Wheat",v:12.2},{n:"Rice",v:13.5},{n:"Maize",v:13.8},{n:"Pulses",v:11.0},{n:"Mustard",v:9.8},{n:"Barley",v:11.5}].map(d => ({...d, v: +ri(d.v-0.5, d.v+1.2, d.v + Math.random()*0.8).toFixed(1)}))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis domain={[8, 16]} /><Tooltip /><Bar dataKey="v" fill="#22c55e" radius={[4,4,0,0]} /></BarChart></div>
        </div>
      )}

      {tab === 3 && (
        <div className="awc-insights grid grid-cols-2 gap-6">{INSIGHTS.map(ins => (<div key={ins.t} className="awc-insight bg-white rounded-lg border p-5"><h3 className="text-base font-bold text-green-800 mb-2">{ins.t}</h3><p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p></div>))}</div>
      )}
    </div>
  );
}
