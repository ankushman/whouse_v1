"use client";
import { useState } from "react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#7c3aed", "#8b5cf6", "#a78bfa", "#c4b5fd", "#6d28d9", "#5b21b6", "#4c1d95", "#ede9fe"];
const VEHICLE_CLASSES = ["Heavy Motor Vehicle", "Light Motor Vehicle", "Medium Motor Vehicle", "Trailer", "Three Wheeler", "E-Rickshaw", "E-Loader", "Agricultural Tractor"];
const INSPECTION_TYPES = ["Fitness Certificate", "PUC Emission", "Road Tax", "Insurance", "Permit Renewal", "National Permit", "Speed Governor", "Reflective Tape"];
const COMPLIANCE_STATUS = ["Compliant", "Due Soon", "Overdue", "Expired", "Under Review", "Exempt"];
const REGIONS = ["Delhi NCR", "Mumbai Metro", "Bangalore Urban", "Chennai Metro", "Hyderabad Region", "Kolkata Metro", "Pune Region", "Ahmedabad Region"];
const TABS = ["Dashboard", "Vehicle Fleet", "Compliance Calendar", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", violet: "bg-violet-100 text-violet-700", slate: "bg-slate-100 text-slate-700", blue: "bg-blue-100 text-blue-700" };
const statusColor: Record<string, string> = { Compliant: "green", "Due Soon": "amber", Overdue: "red", Expired: "red", "Under Review": "blue", Exempt: "slate" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyInspections = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], fitness: ri(120, 280, 180 + Math.sin(i * 0.6) * 50), puc: ri(200, 450, 320 + Math.cos(i * 0.4) * 80), insurance: ri(60, 180, 110 + Math.sin(i * 0.8) * 40) }));
const classDist = VEHICLE_CLASSES.slice(0, 6).map((v, i) => ({ n: v, v: ri(60, 320, 180 - i * 25) }));
const regionCompliance = REGIONS.map((r, i) => ({ r, v: ri(72, 98, 88 - i * 2.5) }));
const failureReasons = [{ n: "Brake System", v: 22 }, { n: "Emission Level", v: 18 }, { n: "Tyre Condition", v: 15 }, { n: "Lighting", v: 12 }, { n: "Speed Governor", v: 10 }, { n: "Reflective Markers", v: 8 }, { n: "Seat Belts", v: 8 }, { n: "Fire Extinguisher", v: 7 }];

interface Vehicle { id: string; regNumber: string; vehicleClass: string; inspectionType: string; status: string; region: string; owner: string; lastInspection: string; nextDue: string; daysRemaining: number; inspectionCenter: string; cost: number; defectCount: number; emissionLevel: string; fitnessScore: number; rtoCode: string; }

const vehicles: Vehicle[] = [
  { id: "VIC-0001", regNumber: "MH-12-AB-1234", vehicleClass: "Heavy Motor Vehicle", inspectionType: "Fitness Certificate", status: "Compliant", region: "Mumbai Metro", owner: "Tata Motors Fleet", lastInspection: "2025-01-05", nextDue: "2026-01-05", daysRemaining: 365, inspectionCenter: "RTO Andheri", cost: 600, defectCount: 0, emissionLevel: "BS-VI", fitnessScore: 96, rtoCode: "MH-12" },
  { id: "VIC-0002", regNumber: "DL-01-CD-5678", vehicleClass: "Light Motor Vehicle", inspectionType: "PUC Emission", status: "Due Soon", region: "Delhi NCR", owner: "Delhivery Express", lastInspection: "2024-10-20", nextDue: "2025-01-20", daysRemaining: 5, inspectionCenter: "Burari Testing", cost: 150, defectCount: 0, emissionLevel: "BS-VI", fitnessScore: 88, rtoCode: "DL-01" },
  { id: "VIC-0003", regNumber: "KA-01-EF-9012", vehicleClass: "Medium Motor Vehicle", inspectionType: "Insurance", status: "Overdue", region: "Bangalore Urban", owner: "Amazon TRS", lastInspection: "2024-06-15", nextDue: "2024-12-15", daysRemaining: -31, inspectionCenter: "Indiranagar RTO", cost: 4500, defectCount: 2, emissionLevel: "BS-IV", fitnessScore: 64, rtoCode: "KA-01" },
  { id: "VIC-0004", regNumber: "TN-04-GH-3456", vehicleClass: "Heavy Motor Vehicle", inspectionType: "National Permit", status: "Compliant", region: "Chennai Metro", owner: "BlueDart Express", lastInspection: "2024-11-10", nextDue: "2025-11-10", daysRemaining: 300, inspectionCenter: "Chennai Central RTO", cost: 1200, defectCount: 0, emissionLevel: "BS-VI", fitnessScore: 94, rtoCode: "TN-04" },
  { id: "VIC-0005", regNumber: "TS-08-IJ-7890", vehicleClass: "Trailer", inspectionType: "Fitness Certificate", status: "Expired", region: "Hyderabad Region", owner: "Adani Logistics", lastInspection: "2023-07-22", nextDue: "2024-07-22", daysRemaining: -177, inspectionCenter: "Khairatabad RTO", cost: 800, defectCount: 5, emissionLevel: "BS-III", fitnessScore: 42, rtoCode: "TS-08" },
  { id: "VIC-0006", regNumber: "WB-02-KL-2345", vehicleClass: "Light Motor Vehicle", inspectionType: "Road Tax", status: "Under Review", region: "Kolkata Metro", owner: "Ecom Express", lastInspection: "2024-12-01", nextDue: "2025-12-01", daysRemaining: 350, inspectionCenter: "Salt Lake RTO", cost: 3500, defectCount: 1, emissionLevel: "BS-VI", fitnessScore: 82, rtoCode: "WB-02" },
  { id: "VIC-0007", regNumber: "MH-14-MN-6789", vehicleClass: "Three Wheeler", inspectionType: "Permit Renewal", status: "Compliant", region: "Pune Region", owner: "Shadowfax Logistics", lastInspection: "2024-09-15", nextDue: "2025-09-15", daysRemaining: 243, inspectionCenter: "Pune RTO Camp", cost: 400, defectCount: 0, emissionLevel: "BS-VI", fitnessScore: 91, rtoCode: "MH-14" },
  { id: "VIC-0008", regNumber: "GJ-01-OP-0123", vehicleClass: "Heavy Motor Vehicle", inspectionType: "Speed Governor", status: "Due Soon", region: "Ahmedabad Region", owner: "VRL Logistics", lastInspection: "2024-10-05", nextDue: "2025-01-05", daysRemaining: 0, inspectionCenter: "SG Highway RTO", cost: 2500, defectCount: 1, emissionLevel: "BS-VI", fitnessScore: 78, rtoCode: "GJ-01" },
  { id: "VIC-0009", regNumber: "DL-04-QR-4567", vehicleClass: "E-Rickshaw", inspectionType: "PUC Emission", status: "Compliant", region: "Delhi NCR", owner: "Zomato Last Mile", lastInspection: "2024-11-28", nextDue: "2025-11-28", daysRemaining: 317, inspectionCenter: "Lajpat Nagar RTO", cost: 100, defectCount: 0, emissionLevel: "N/A", fitnessScore: 98, rtoCode: "DL-04" },
  { id: "VIC-0010", regNumber: "KA-05-ST-8901", vehicleClass: "Medium Motor Vehicle", inspectionType: "Fitness Certificate", status: "Overdue", region: "Bangalore Urban", owner: "BigBasket Supply", lastInspection: "2024-04-10", nextDue: "2024-10-10", daysRemaining: -97, inspectionCenter: "Jayadevar RTO", cost: 700, defectCount: 3, emissionLevel: "BS-IV", fitnessScore: 55, rtoCode: "KA-05" },
  { id: "VIC-0011", regNumber: "TN-09-UV-2345", vehicleClass: "Heavy Motor Vehicle", inspectionType: "Reflective Tape", status: "Compliant", region: "Chennai Metro", owner: "TCI Express", lastInspection: "2024-12-20", nextDue: "2025-12-20", daysRemaining: 340, inspectionCenter: "Guindy RTO", cost: 350, defectCount: 0, emissionLevel: "BS-VI", fitnessScore: 95, rtoCode: "TN-09" },
  { id: "VIC-0012", regNumber: "HR-51-WX-6789", vehicleClass: "Light Motor Vehicle", inspectionType: "Insurance", status: "Due Soon", region: "Delhi NCR", owner: "XpressBees", lastInspection: "2024-08-12", nextDue: "2025-01-12", daysRemaining: 3, inspectionCenter: "Gurgaon RTO", cost: 5200, defectCount: 0, emissionLevel: "BS-VI", fitnessScore: 86, rtoCode: "HR-51" },
  { id: "VIC-0013", regNumber: "MH-43-YZ-0123", vehicleClass: "Agricultural Tractor", inspectionType: "Fitness Certificate", status: "Exempt", region: "Pune Region", owner: "Agri Fresh Co", lastInspection: "2024-03-01", nextDue: "2026-03-01", daysRemaining: 415, inspectionCenter: "Baramati RTO", cost: 200, defectCount: 0, emissionLevel: "N/A", fitnessScore: 100, rtoCode: "MH-43" },
  { id: "VIC-0014", regNumber: "AP-28-AB-4567", vehicleClass: "E-Loader", inspectionType: "Permit Renewal", status: "Under Review", region: "Hyderabad Region", owner: "Dunzo Hyperlocal", lastInspection: "2024-11-05", nextDue: "2025-05-05", daysRemaining: 120, inspectionCenter: "Cyberabad RTO", cost: 500, defectCount: 0, emissionLevel: "N/A", fitnessScore: 92, rtoCode: "AP-28" },
];

const compliantCount = vehicles.filter(v => v.status === "Compliant" || v.status === "Exempt").length;
const overdueCount = vehicles.filter(v => v.status === "Overdue" || v.status === "Expired").length;
const avgFitness = (vehicles.filter(v => v.fitnessScore > 0).reduce((s, v) => s + v.fitnessScore, 0) / vehicles.filter(v => v.fitnessScore > 0).length).toFixed(0);
const dueSoonCount = vehicles.filter(v => v.status === "Due Soon").length;
const kpis = [
  { l: "Fully Compliant", v: compliantCount, s: "vehicles passing all checks" },
  { l: "Due Soon (7 days)", v: dueSoonCount, s: "needs immediate action" },
  { l: "Overdue / Expired", v: overdueCount, s: "critical non-compliance" },
  { l: "Avg Fitness Score", v: `${avgFitness}/100`, s: "across inspected fleet" },
];

const INSIGHTS = [
  {
    t: "India\u2019s Transition to BS-VI Emission Norms",
    c: "India\u2019s landmark shift from BS-IV to BS-VI emission standards on April 1, 2020, reduced permissible NOx emissions by 80% for diesel vehicles and introduced stringent particulate matter limits of 4.5 mg/km (down from 25 mg/km under BS-IV). This transition has profound implications for vehicle inspection compliance across the logistics sector, with approximately 38% of India\u2019s 12 crore registered vehicles still operating under pre-BS-VI specifications. The Parivesh portal, Ministry of Road Transport\u2019s automated emission monitoring system, now mandates real-time PUC data integration for all commercial vehicles operating on National Highways. Fleet operators face compliance costs of \u20b915,000-45,000 per vehicle for BS-VI retrofits, including catalytic converter upgrades, diesel particulate filter installation, and on-board diagnostics (OBD-II) system integration. However, BS-VI compliant fleets report 30-40% lower maintenance costs due to improved engine efficiency, 15-20% better fuel economy, and significantly reduced environmental penalty exposure under the National Green Tribunal\u2019s enhanced pollution surcharge framework.",
  },
  {
    t: "Automated Driving Test Centres (ADTC) Revolution",
    c: "The National Automated Vehicle Inspection and Certification System (NVAIC), with 3,487 automated driving test centres operational across 768 RTO locations as of 2025, is replacing manual inspection processes that historically suffered from 35-45% inconsistency rates. These centres deploy computer vision-based vehicle inspection bays, laser-aligned brake testing platforms, side-slip measurement systems, headlight beam aligners, and suspension testing rigs that generate standardized, tamper-proof fitness certificates. The ADTC system has reduced average inspection time from 4-6 hours to 18-25 minutes per vehicle, while improving defect detection accuracy from 62% to 94%. For logistics fleet operators managing 500+ vehicles, the automated system enables predictive maintenance scheduling based on degradation trend analysis, with the Vahan 4.0 integration providing digital fitness records accessible across all Indian RTO jurisdictions. The system\u2019s AI defect classification engine can identify 147 distinct vehicle defect categories, flagging critical safety issues like brake imbalance exceeding 20%, headlight asymmetry beyond 3 degrees, and structural corrosion scoring above 4 on a standardized scale.",
  },
  {
    t: "National Permit Harmonization via Suvidha Portal",
    c: "The Ministry of Road Transport\u2019s Suvidha portal has unified national permit issuance across 36 states and UTs, replacing the earlier state-by-state authorization process that required 8-15 separate permit applications for pan-India operations. Under the harmonized regime, a single national permit for goods carriages (Form 46/47) costs \u20b915,000-18,000 annually and provides authorization for operations across all Indian states, with automated toll exemptions on National Highways and state roads. The portal\u2019s integration with FASTag, Vahan, and SARATHI databases enables real-time permit validation at 1,200+ RTO check posts, reducing permit verification delays from 15-45 minutes to under 30 seconds. For logistics companies operating inter-state corridors like Mumbai\u2013Delhi (MH, GJ, RJ, HR, DL) or Delhi\u2013Chennai (DL, UP, RJ, MP, MH, KA, TN), the unified permit eliminates an estimated \u20b92.8-4.5 lakh per vehicle per year in administrative overhead, multi-state permit fees, and checkpoint detention costs. The portal processes 4.2 lakh permit applications monthly with 92% same-day approval rates.",
  },
  {
    t: "E-Vehicle Compliance Exemptions and Incentives",
    c: "India\u2019s FAME-II scheme and subsequent state-level EV policies have created favorable compliance exemptions for electric commercial vehicles, including exemption from PUC emission testing, reduced road tax (50-100% discount depending on state), waived fitness certificate fees for battery-electric vehicles, and priority lane access at RTO inspection centres. E-rickshaws and e-loaders classified under L5 category enjoy complete exemption from permit requirements for intra-city operations up to 50 km range, significantly reducing regulatory burden for last-mile logistics operators. States like Delhi, Maharashtra, and Karnataka additionally offer \u20b930,000-75,000 subsidies on commercial EV purchases, accelerated depreciation benefits of 50% in the first year under Income Tax Section 80EEB, and dedicated charging infrastructure grants. However, EV fleet operators face unique compliance requirements including battery safety certification under AIS 156 standards, fire suppression system installation, and quarterly battery health monitoring reports submitted to state transport authorities. The emerging EV inspection framework requires specialized testing equipment for battery diagnostics, motor controller validation, and regenerative braking system verification.",
  },
];

export default function VehicleInspectionComplianceView() {
  const [tab, setTab] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const filterGroups = [
    { key: "vehicleClass", label: "Vehicle Class", options: VEHICLE_CLASSES.map(v => ({ value: v, count: vehicles.filter(vh => vh.vehicleClass === v).length })) },
    { key: "inspectionType", label: "Inspection Type", options: INSPECTION_TYPES.map(t => ({ value: t, count: vehicles.filter(vh => vh.inspectionType === t).length })) },
    { key: "status", label: "Status", options: COMPLIANCE_STATUS.map(s => ({ value: s, count: vehicles.filter(vh => vh.status === s).length })) },
    { key: "region", label: "Region", options: REGIONS.map(r => ({ value: r, count: vehicles.filter(vh => vh.region === r).length })) },
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = vehicles.filter(v => {
    if (search) {
      const q = search.toLowerCase();
      if (!v.id.toLowerCase().includes(q) && !v.regNumber.toLowerCase().includes(q) && !v.owner.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(
      ([k, vs]) => vs.includes(v[k as keyof Vehicle] as string)
    );
  });

  const maxFit = Math.max(...vehicles.map(v => v.fitnessScore));

  return (
    <div className="vic-root p-6 space-y-6">
      <PageHeader
        title="Vehicle Inspection & Compliance"
        description="Fleet fitness certification, emission testing, RTO compliance management and regulatory tracking"
      />
      <div className="vic-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`vic-tab px-4 py-2 text-sm font-medium rounded-t ${
              tab === i ? "bg-violet-600 text-white" : "text-gray-600 hover:bg-violet-50"
            }`}
          >{t}</button>
        ))}
      </div>

      {tab === 0 && (
        <div className="vic-dash space-y-6">
          <div className="vic-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (
              <div key={k.l} className="vic-kpi bg-white rounded-lg border p-4">
                <div className="text-xs text-gray-500 vic-kpi-label">{k.l}</div>
                <div className="text-2xl font-bold text-violet-700 vic-kpi-val">{k.v}</div>
                <div className="text-xs text-gray-400 vic-kpi-sub">{k.s}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="vic-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">Monthly Inspections by Type</h3>
              <BarChart data={monthlyInspections} height={220}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="m" /><YAxis /><Tooltip />
                <Bar dataKey="fitness" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Fitness" />
                <Bar dataKey="puc" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="PUC" />
                <Bar dataKey="insurance" fill="#a78bfa" radius={[4, 4, 0, 0]} name="Insurance" />
              </BarChart>
            </div>
            <div className="vic-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">Vehicle Class Distribution</h3>
              <PieChart width={400} height={220}>
                <Pie data={classDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>
                  {classDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="vic-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">Compliance Score by Region</h3>
              <BarChart data={regionCompliance} height={220}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="r" tick={{ fontSize: 9 }} /><YAxis domain={[60, 100]} /><Tooltip />
                <Bar dataKey="v" fill="#6d28d9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </div>
            <div className="vic-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">Top Inspection Failure Reasons</h3>
              <PieChart width={400} height={220}>
                <Pie data={failureReasons} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>
                  {failureReasons.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="vic-fleet space-y-4">
          <ModuleBreadcrumb items={[{ label: "Fleet", href: "#" }, { label: "Vehicle Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={vehicles.length} filteredCount={filtered.length} />
          <div className="vic-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  {"ID,Reg No,Class,Inspection Type,Status,Region,Owner,Last Inspected,Next Due,Days Left,Center,Cost,Defects,Emission,Fitness,RTO"
                    .split(",").map(h => (
                    <th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(v => {
                  const rowCls = v.status === "Overdue" || v.status === "Expired"
                    ? "vic-row-critical bg-red-50"
                    : v.status === "Due Soon"
                      ? "vic-row-warning bg-amber-50" : "";
                  const fp = ri(0, 100, (v.fitnessScore / maxFit) * 100);
                  return (
                    <tr key={v.id} className={`border-b hover:bg-violet-50/50 ${rowCls}`}>
                      <td className="px-3 py-2 font-mono font-medium">{v.id}</td>
                      <td className="px-3 py-2"><span className="vic-badge inline-block px-2 py-0.5 rounded text-xs bg-violet-100 text-violet-700">{v.regNumber}</span></td>
                      <td className="px-3 py-2"><span className="tri-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{v.vehicleClass}</span></td>
                      <td className="px-3 py-2"><span className="vic-badge inline-block px-2 py-0.5 rounded text-xs bg-indigo-100 text-indigo-700">{v.inspectionType}</span></td>
                      <td className="px-3 py-2"><span className={`vic-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[statusColor[v.status]]}`}>{v.status}</span></td>
                      <td className="px-3 py-2 text-xs">{v.region}</td>
                      <td className="px-3 py-2 text-xs">{v.owner}</td>
                      <td className="px-3 py-2 text-xs">{v.lastInspection}</td>
                      <td className="px-3 py-2 text-xs">{v.nextDue}</td>
                      <td className="px-3 py-2">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                          v.daysRemaining < 0 ? "bg-red-100 text-red-700" :
                          v.daysRemaining <= 7 ? "bg-amber-100 text-amber-700" :
                          "bg-green-100 text-green-700"
                        }`}>
                          {v.daysRemaining < 0 ? `${Math.abs(v.daysRemaining)}d late` : `${v.daysRemaining}d`}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-xs">{v.inspectionCenter}</td>
                      <td className="px-3 py-2">{"\u20b9"}{v.cost.toLocaleString()}</td>
                      <td className="px-3 py-2">
                        {v.defectCount > 0 ? (
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${v.defectCount >= 3 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                            {v.defectCount}
                          </span>
                        ) : <span className="text-green-600 text-xs">0</span>}
                      </td>
                      <td className="px-3 py-2">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs ${
                          v.emissionLevel === "BS-VI" ? "bg-green-100 text-green-700" :
                          v.emissionLevel === "BS-IV" ? "bg-amber-100 text-amber-700" :
                          v.emissionLevel === "BS-III" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"
                        }`}>{v.emissionLevel}</span>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${v.fitnessScore >= 85 ? "text-green-700" : v.fitnessScore >= 60 ? "text-amber-700" : "text-red-700"}`}>{v.fitnessScore}</span>
                          <div className="w-16 h-1.5 bg-gray-200 rounded">
                            <div className={`vic-fitnessbar h-1.5 rounded ${v.fitnessScore >= 85 ? "bg-green-500" : v.fitnessScore >= 60 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${fp}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-xs font-mono">{v.rtoCode}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="vic-calendar space-y-6">
          <div className="vic-chart bg-white rounded-lg border p-4">
            <h3 className="text-sm font-semibold mb-3">Monthly Inspection Volume Forecast</h3>
            <AreaChart data={Array.from({ length: 12 }, (_, i) => ({ m: MO[i], v: ri(400, 950, 650 + Math.sin(i * 0.5) * 200) }))} height={240}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="m" /><YAxis /><Tooltip />
              <Area type="monotone" dataKey="v" stroke="#7c3aed" fill="#ede9fe" />
            </AreaChart>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="vic-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">Fitness Certificate Trends</h3>
              <LineChart data={monthlyInspections} height={240}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="m" /><YAxis /><Tooltip />
                <Line type="monotone" dataKey="fitness" stroke="#7c3aed" strokeWidth={2} name="Fitness Tests" />
              </LineChart>
            </div>
            <div className="vic-chart bg-white rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">PUC vs Insurance Trends</h3>
              <LineChart data={monthlyInspections} height={240}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="m" /><YAxis /><Tooltip />
                <Line type="monotone" dataKey="puc" stroke="#8b5cf6" strokeWidth={2} name="PUC Tests" />
                <Line type="monotone" dataKey="insurance" stroke="#a78bfa" strokeWidth={2} name="Insurance" />
              </LineChart>
            </div>
          </div>
        </div>
      )}

      {tab === 3 && (
        <div className="vic-insights grid grid-cols-2 gap-6">
          {INSIGHTS.map(ins => (
            <div key={ins.t} className="vic-insight bg-white rounded-lg border p-5">
              <h3 className="text-base font-bold text-violet-800 mb-2">{ins.t}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
