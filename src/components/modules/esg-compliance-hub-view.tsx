"use client";
import { useState, useMemo } from "react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Activity, Leaf, Zap, Recycle, Droplets, Shield, Award, Star, TrendingUp, TrendingDown, Search, ArrowUpDown, Download, Eye, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { useToast } from "@/hooks/use-toast-helper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const sR = (s: number) => { const x = Math.sin(s + 1) * 10000; return x - Math.floor(x); };
const ri = (a: number, b: number, s: number) => Math.floor(sR(s) * (b - a + 1)) + a;
const fmtINR = (n: number) => `\u20B9${n >= 1e7 ? (n / 1e7).toFixed(2) + " Cr" : n >= 1e5 ? (n / 1e5).toFixed(2) + " L" : n.toLocaleString("en-IN")}`;
const CL = ["#059669", "#3b82f6", "#d97706", "#7c3aed", "#0891b2", "#e11d48", "#64748b", "#f59e0b"];
const filterData = <T,>(d: T[], q: string) => q ? d.filter((r) => Object.values(r as Record<string, string | number>).some((v) => String(v).toLowerCase().includes(q.toLowerCase()))) : d;
const sortData = <T,>(d: T[], f: string, dir: string) => [...d].sort((a, b) => {
  const av = (a as unknown as Record<string, string | number>)[f], bv = (b as unknown as Record<string, string | number>)[f];
  return dir === "asc" ? (av > bv ? 1 : av < bv ? -1 : 0) : (av < bv ? 1 : av > bv ? -1 : 0);
});

const ES = [{ n: "Transport", e: "\uD83D\uDE9B" }, { n: "Warehouse", e: "\uD83C\uDFED" }, { n: "Cold Chain", e: "\u2744\uFE0F" }, { n: "Packaging", e: "\uD83D\uDCE6" }, { n: "Equipment", e: "\u2699\uFE0F" }, { n: "Electricity", e: "\u26A1" }, { n: "Travel", e: "\u2708\uFE0F" }, { n: "Waste", e: "\uD83D\uDDD1\uFE0F" }] as const;
const SC = ["Scope 1 Direct", "Scope 2 Electric", "Scope 3 Transport", "Scope 4 Upstream", "Scope 5 Downstream", "Scope 6 Other"] as const;
const EN = [{ n: "Solar", e: "\u2600\uFE0F" }, { n: "Grid", e: "\uD83C\uDFED" }, { n: "Diesel", e: "\uD83D\uDEE2\uFE0F" }, { n: "Wind", e: "\uD83C\uDF2C\uFE0F" }, { n: "Biomass", e: "\uD83C\uDF3F" }, { n: "Gas", e: "\u26FD" }, { n: "Battery", e: "\uD83D\uDD0B" }, { n: "Cogeneration", e: "\uD83D\uDD04" }] as const;
const ST = ["Active", "Maintenance", "Standby", "New", "Upgrading", "Decommissioned"] as const;
const WT = [{ n: "Cardboard", e: "\uD83D\uDCE6" }, { n: "Plastic", e: "\uD83E\uDDF4" }, { n: "Paper", e: "\uD83D\uDCC4" }, { n: "Metal", e: "\uD83D\uDD29" }, { n: "E-Waste", e: "\uD83D\uDCBB" }, { n: "Organic", e: "\uD83C\uDF42" }, { n: "Hazardous", e: "\u2622\uFE0F" }, { n: "Glass", e: "\uD83E\uDEE9" }] as const;
const DM = ["Recycle", "Reuse", "Compost", "Incinerate", "Landfill", "Special Treatment"] as const;
const CATS = ["Labor Rights", "Health & Safety", "Community Impact", "Diversity", "Training", "Fair Wages", "Anti-Corruption", "Data Privacy"] as const;
const CST = ["Compliant", "Partial", "Non-Compliant", "Under Review", "Remediation", "Certified"] as const;
const WHS = ["Mumbai WH", "Delhi WH", "Chennai WH", "Bangalore WH", "Kolkata WH", "Hyderabad WH", "Pune WH", "Ahmedabad WH"] as const;
const AUD = ["SGS India", "Bureau Veritas", "TUV Nord", "Intertek", "DNV GL", "EY India", "KPMG India", "PwC India"] as const;
const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DEPTS = ["Logistics", "Warehousing", "Fleet", "Procurement", "HR", "Finance", "Operations", "IT"];

const genEm = () => Array.from({ length: 75 }, (_, i) => {
  const s = ES[i % 8], sc = SC[i % 6], em = ri(50, 500, i * 7), rd = ri(2, 30, i * 3);
  return { id: i + 1, source: s.n, emoji: s.e, scope: sc, emission: em, cost: em * ri(800, 2500, i * 11), reduction: rd, offset: ri(5, 60, i * 13), netEmission: +(em * (1 - rd / 100)).toFixed(1), period: MO[i % 12] + " 2024", trend: rd >= 15 ? "down" : "up" };
});
const genEn = () => Array.from({ length: 70 }, (_, i) => {
  const s = EN[i % 8], st = ST[i % 6], g = ri(500, 5000, i * 5), ef = ri(40, 98, i * 9);
  return { id: i + 1, source: s.n, emoji: s.e, status: st, generation: g, consumption: g - ri(10, 200, i * 4), cost: g * ri(5, 15, i * 8), efficiency: ef, capacity: +(ri(1, 50, i * 6) / 10).toFixed(1), location: WHS[i % 8], green: ["Solar", "Wind", "Biomass", "Cogeneration"].includes(s.n) };
});
const genWa = () => Array.from({ length: 55 }, (_, i) => {
  const w = WT[i % 8], d = DM[i % 6], q = ri(100, 5000, i * 3), rr = ri(20, 95, i * 7);
  return { id: i + 1, type: w.n, emoji: w.e, disposal: d, quantity: q, cost: q * ri(2, 20, i * 5), recyclingRate: rr, revenue: +(q * rr / 100 * ri(5, 30, i * 9)), warehouse: WHS[i % 8], compliant: rr >= 60 };
});
const genCo = () => Array.from({ length: 65 }, (_, i) => {
  const cat = CATS[i % 8], st = CST[i % 6], sc = ri(30, 100, i * 4);
  return { id: i + 1, category: cat, status: st, score: sc, auditDate: `2024-${String(ri(1, 12, i * 2)).padStart(2, "0")}-${String(ri(1, 28, i * 3)).padStart(2, "0")}`, auditor: AUD[i % 8], findings: ri(0, 15, i * 5), riskLevel: ["Critical", "High", "Medium", "Low"][ri(0, 3, i * 6)] as string, certified: st === "Certified" };
});

const KpiIcon = ({ n, cls, color }: { n: string; cls: string; color: string }) => {
  const m: Record<string, any> = { Activity, AlertTriangle, Zap, Recycle, Droplets, Shield, Award, Star };
  const Ic = m[n]; return Ic ? <Ic className={cls} style={{ color }} /> : null;
};
const EmissionSourceBadge = ({ emoji, name }: { emoji: string; name: string }) => <Badge className="esg-emission-src" variant="outline"><span className="mr-1">{emoji}</span>{name}</Badge>;
const ScopeBadge = ({ scope }: { scope: string }) => { const i = SC.indexOf(scope as any); return <Badge className="esg-scope-badge" style={{ background: CL[i % 6] + "22", color: CL[i % 6], borderColor: CL[i % 6] }} variant="outline">{scope}</Badge>; };
const TrendIndicator = ({ trend }: { trend: string }) => trend === "up" ? <TrendingUp className="h-4 w-4 text-red-500" /> : <TrendingDown className="h-4 w-4 text-emerald-500" />;
const EmissionTile = ({ value }: { value: number }) => <div className="esg-emission-tile rounded px-2 py-1 text-center text-xs font-semibold" style={{ background: value > 300 ? "#fee2e2" : "#dcfce7", color: value > 300 ? "#dc2626" : "059669" }}>{value} tCO\u2082e</div>;
const OffsetTile = ({ value }: { value: number }) => <div className="esg-offset-tile rounded bg-emerald-100 px-2 py-1 text-center text-xs font-semibold text-emerald-700">{value} tCO\u2082e</div>;
const EnergySourceBadge = ({ emoji, name }: { emoji: string; name: string }) => <Badge className="esg-energy-src" variant="outline"><span className="mr-1">{emoji}</span>{name}</Badge>;
const EnergyStatusBadge = ({ status }: { status: string }) => { const i = ST.indexOf(status as any); return <Badge className={`esg-energy-status ${status === "Active" ? "esg-pulse" : ""}`} style={{ background: CL[i % 6] + "22", color: CL[i % 6] }} variant="outline">{status}</Badge>; };
const EfficiencyBar = ({ val }: { val: number }) => <div className="esg-eff-bar h-2 w-full rounded-full bg-gray-200"><div className="h-2 rounded-full" style={{ width: `${val}%`, background: val > 80 ? "#059669" : val > 60 ? "#3b82f6" : val > 40 ? "#d97706" : "#e11d48" }} /></div>;
const GreenBadge = () => <Badge className="esg-green-badge gap-1 bg-emerald-100 text-emerald-700"><Leaf className="h-3 w-3" />Renewable</Badge>;
const WasteTypeBadge = ({ emoji, name }: { emoji: string; name: string }) => <Badge className="esg-waste-type" variant="outline"><span className="mr-1">{emoji}</span>{name}</Badge>;
const DisposalBadge = ({ method }: { method: string }) => { const i = DM.indexOf(method as any); return <Badge className="esg-disposal-badge" style={{ background: CL[i % 6] + "22", color: CL[i % 6] }} variant="outline">{method}</Badge>; };
const RecyclingRateBar = ({ val }: { val: number }) => <div className="esg-recycle-bar h-2 w-full rounded-full bg-gray-200"><div className="h-2 rounded-full" style={{ width: `${val}%`, background: val > 75 ? "#059669" : val > 50 ? "#3b82f6" : val > 30 ? "#d97706" : "#e11d48" }} /></div>;
const CategoryBadge = ({ cat }: { cat: string }) => { const i = CATS.indexOf(cat as any); return <Badge className="esg-cat-badge" style={{ background: CL[i % 6] + "22", color: CL[i % 6] }} variant="outline">{cat}</Badge>; };
const ComplianceBadge = ({ status }: { status: string }) => { const i = CST.indexOf(status as any); return <Badge className={`esg-compliance-badge ${status === "Compliant" ? "esg-pulse" : ""}`} style={{ background: CL[i % 6] + "22", color: CL[i % 6] }} variant="outline">{status}</Badge>; };
const RiskLevelBadge = ({ level }: { level: string }) => { const c = ({ Critical: "#e11d48", High: "#d97706", Medium: "#3b82f6", Low: "#059669" } as Record<string, string>)[level] || "#64748b"; return <Badge className={`esg-risk-badge ${level === "Critical" ? "esg-critical-glow" : ""}`} style={{ background: c + "22", color: c }} variant="outline">{level}</Badge>; };
const CertBadge = () => <Badge className="esg-cert-badge gap-1 bg-amber-100 text-amber-700"><Award className="h-3 w-3" />Certified</Badge>;

export default function ESGComplianceHubView() {
  const [activeTab, setActiveTab] = useState("0");
  const [searchQ, setSearchQ] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortDir, setSortDir] = useState("asc");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selRec, setSelRec] = useState<Record<string, any> | null>(null);
  const { toast } = useToast();

  const emissions = useMemo(() => genEm(), []);
  const energy = useMemo(() => genEn(), []);
  const waste = useMemo(() => genWa(), []);
  const compliance = useMemo(() => genCo(), []);

  const kpis = [
    { label: "ESG Score", value: "78.5", icon: "Activity", color: "#059669" },
    { label: "Carbon Emissions", value: "2,450 tCO\u2082e", icon: "AlertTriangle", color: "#e11d48" },
    { label: "Energy Saved", value: "1.8 L kWh", icon: "Zap", color: "#d97706" },
    { label: "Waste Recycled", value: "72.3%", icon: "Recycle", color: "#0891b2" },
    { label: "Water Saved", value: "45.2 KL", icon: "Droplets", color: "#3b82f6" },
    { label: "Compliance Score", value: "85.6", icon: "Shield", color: "#059669" },
    { label: "Certifications", value: "12", icon: "Award", color: "#7c3aed" },
    { label: "Stakeholder Rating", value: "4.2/5", icon: "Star", color: "#d97706" },
  ];
  const mTrend = MO.map((m, i) => ({ month: m, scope1: ri(100, 300, i * 3), scope2: ri(50, 200, i * 5), scope3: ri(80, 250, i * 7) }));
  const ePillars = [{ name: "Environmental", value: 35 }, { name: "Social", value: 40 }, { name: "Governance", value: 25 }];
  const dScores = DEPTS.map((d, i) => ({ dept: d, score: ri(55, 95, i * 11) }));
  const esgTrend = MO.map((m, i) => ({ month: m, score: +(60 + i * 1.8 + ri(0, 5, i * 2)).toFixed(1) }));
  const cBySrc = ES.map((s, i) => ({ name: s.n, value: ri(200, 2000, i * 9) }));
  const eMix = [{ name: "Energy", green: energy.filter((e) => e.green).reduce((a, e) => a + e.generation, 0), nonGreen: energy.filter((e) => !e.green).reduce((a, e) => a + e.generation, 0) }];
  const compByCat = CATS.map((c, i) => ({ cat: c, score: ri(50, 100, i * 7) }));
  const TABS = ["ESG Dashboard", "Carbon Footprint", "Energy Management", "Waste & Recycling", "Social Compliance", "ESG Analytics"];

  const openRec = (r: any) => { setSelRec(r); setSheetOpen(true); };

  return (
    <div className="esg-hub space-y-4 p-4">
      <PageHeader title="ESG Compliance Hub" description="Environmental, Social & Governance compliance monitoring for Indian logistics and warehousing operations" />
      <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setSearchQ(""); setSortField("id"); setSortDir("asc"); }}>
        <TabsList className="esg-tabs-wrap flex-wrap">{TABS.map((t, i) => <TabsTrigger key={i} value={String(i)} className="esg-tab">{t}</TabsTrigger>)}</TabsList>

        {activeTab === "0" && (
          <div className="esg-dashboard space-y-4">
            <div className="grid grid-cols-4 gap-3">
              {kpis.map((k, i) => <Card key={i}><CardContent className="esg-kpi flex items-center gap-3 p-4"><KpiIcon n={k.icon} cls="h-5 w-5" color={k.color} /><div><p className="text-xs text-muted-foreground">{k.label}</p><p className="text-lg font-bold">{k.value}</p></div></CardContent></Card>)}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Card><CardHeader className="pb-2"><CardTitle className="esg-chart-title text-sm">Monthly Emission Trend (tCO\u2082e)</CardTitle></CardHeader><CardContent><AreaChart data={mTrend} width={320} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={10} /><YAxis fontSize={10} /><Tooltip /><Area type="monotone" dataKey="scope1" stackId="1" stroke="#e11d48" fill="#e11d4844" name="Scope 1" /><Area type="monotone" dataKey="scope2" stackId="1" stroke="#d97706" fill="#d9770644" name="Scope 2" /><Area type="monotone" dataKey="scope3" stackId="1" stroke="#7c3aed" fill="#7c3aed44" name="Scope 3" /></AreaChart></CardContent></Card>
              <Card><CardHeader className="pb-2"><CardTitle className="esg-chart-title text-sm">ESG Pillars</CardTitle></CardHeader><CardContent><PieChart width={320} height={200}><Pie data={ePillars} cx="50%" cy="50%" outerRadius={70} dataKey="value" label>{ePillars.map((_, i) => <Cell key={i} fill={CL[i]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
              <Card><CardHeader className="pb-2"><CardTitle className="esg-chart-title text-sm">Department ESG Scores</CardTitle></CardHeader><CardContent><BarChart data={dScores} width={320} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="dept" fontSize={9} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={10} domain={[0, 100]} /><Tooltip /><Bar dataKey="score" fill="#059669" radius={[4, 4, 0, 0]} /></BarChart></CardContent></Card>
            </div>
          </div>
        )}

        {activeTab === "1" && (() => {
          const data = sortData(filterData(emissions as unknown as Record<string, string | number>[], searchQ) as unknown as Record<string, string | number>[], sortField, sortDir);
          return (
            <div className="esg-carbon space-y-3">
              <div className="flex items-center gap-2">
                <div className="relative flex-1"><Search className="esg-search-icon absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search emissions..." value={searchQ} onChange={(e) => setSearchQ(e.target.value)} className="pl-8" /></div>
                <Select value={sortField} onValueChange={setSortField}><SelectTrigger className="esg-sort-select w-36"><SelectValue /></SelectTrigger><SelectContent>{["id", "emission", "cost", "reduction", "netEmission"].map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent></Select>
                <Button variant="outline" size="sm" onClick={() => setSortDir((d) => d === "asc" ? "desc" : "asc")}><ArrowUpDown className="h-4 w-4" />{sortDir}</Button>
                <Button variant="outline" size="sm" onClick={() => toast.success("Exported", "Carbon emission data exported successfully")}><Download className="h-4 w-4" /></Button>
                <Badge variant="secondary" className="esg-count-badge">{(data as any[]).length} records</Badge>
              </div>
              <div className="esg-table-wrap max-h-[500px] overflow-auto rounded border">
                <Table><TableHeader><TableRow className="esg-carbon-header"><TableHead>Source</TableHead><TableHead>Scope</TableHead><TableHead>Emission</TableHead><TableHead>Cost</TableHead><TableHead>Reduction</TableHead><TableHead>Offset</TableHead><TableHead>Net</TableHead><TableHead>Period</TableHead><TableHead>Trend</TableHead><TableHead></TableHead></TableRow></TableHeader>
                <TableBody>{(data as any[]).slice(0, 30).map((r) => <TableRow key={r.id} className="esg-carbon-row"><TableCell><EmissionSourceBadge emoji={r.emoji} name={r.source} /></TableCell><TableCell><ScopeBadge scope={r.scope} /></TableCell><TableCell><EmissionTile value={r.emission} /></TableCell><TableCell className="text-sm">{fmtINR(r.cost)}</TableCell><TableCell className="text-sm text-emerald-600">{r.reduction}%</TableCell><TableCell><OffsetTile value={r.offset} /></TableCell><TableCell className="text-sm font-semibold">{r.netEmission}</TableCell><TableCell className="text-xs">{r.period}</TableCell><TableCell><TrendIndicator trend={r.trend} /></TableCell><TableCell><Button variant="ghost" size="sm" onClick={() => openRec(r)}><Eye className="h-4 w-4" /></Button></TableCell></TableRow>)}</TableBody></Table>
              </div>
            </div>);
        })()}

        {activeTab === "2" && (() => {
          const data = sortData(filterData(energy as unknown as Record<string, string | number>[], searchQ) as unknown as Record<string, string | number>[], sortField, sortDir);
          return (
            <div className="esg-energy-tab space-y-3">
              <div className="flex items-center gap-2">
                <div className="relative flex-1"><Search className="esg-search-icon absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search energy records..." value={searchQ} onChange={(e) => setSearchQ(e.target.value)} className="pl-8" /></div>
                <Select value={sortField} onValueChange={setSortField}><SelectTrigger className="esg-sort-select w-36"><SelectValue /></SelectTrigger><SelectContent>{["id", "generation", "consumption", "cost", "efficiency", "capacity"].map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent></Select>
                <Button variant="outline" size="sm" onClick={() => setSortDir((d) => d === "asc" ? "desc" : "asc")}><ArrowUpDown className="h-4 w-4" />{sortDir}</Button>
                <Button variant="outline" size="sm" onClick={() => toast.success("Exported", "Energy data exported successfully")}><Download className="h-4 w-4" /></Button>
                <Badge variant="secondary" className="esg-count-badge">{energy.length} records</Badge>
              </div>
              <div className="esg-table-wrap max-h-[500px] overflow-auto rounded border">
                <Table><TableHeader><TableRow className="esg-energy-header"><TableHead>Source</TableHead><TableHead>Status</TableHead><TableHead>Generation</TableHead><TableHead>Consumption</TableHead><TableHead>Cost</TableHead><TableHead>Efficiency</TableHead><TableHead>Capacity</TableHead><TableHead>Location</TableHead><TableHead>Green</TableHead><TableHead></TableHead></TableRow></TableHeader>
                <TableBody>{(data as any[]).slice(0, 30).map((r) => <TableRow key={r.id} className="esg-energy-row"><TableCell><EnergySourceBadge emoji={r.emoji} name={r.source} /></TableCell><TableCell><EnergyStatusBadge status={r.status} /></TableCell><TableCell className="text-sm">{r.generation.toLocaleString()} kWh</TableCell><TableCell className="text-sm">{r.consumption.toLocaleString()} kWh</TableCell><TableCell className="text-sm">{fmtINR(r.cost)}</TableCell><TableCell><div className="w-20 space-y-0.5"><EfficiencyBar val={r.efficiency} /><span className="text-xs">{r.efficiency}%</span></div></TableCell><TableCell className="text-sm">{r.capacity} MW</TableCell><TableCell className="text-xs">{r.location}</TableCell><TableCell>{r.green ? <GreenBadge /> : <span className="text-xs text-muted-foreground">\u2014</span>}</TableCell><TableCell><Button variant="ghost" size="sm" onClick={() => openRec(r)}><Eye className="h-4 w-4" /></Button></TableCell></TableRow>)}</TableBody></Table>
              </div>
            </div>);
        })()}

        {activeTab === "3" && (() => {
          const data = sortData(filterData(waste as unknown as Record<string, string | number>[], searchQ) as unknown as Record<string, string | number>[], sortField, sortDir);
          return (
            <div className="esg-waste-tab space-y-3">
              <div className="flex items-center gap-2">
                <div className="relative flex-1"><Search className="esg-search-icon absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search waste records..." value={searchQ} onChange={(e) => setSearchQ(e.target.value)} className="pl-8" /></div>
                <Select value={sortField} onValueChange={setSortField}><SelectTrigger className="esg-sort-select w-36"><SelectValue /></SelectTrigger><SelectContent>{["id", "quantity", "cost", "recyclingRate", "revenue"].map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent></Select>
                <Button variant="outline" size="sm" onClick={() => setSortDir((d) => d === "asc" ? "desc" : "asc")}><ArrowUpDown className="h-4 w-4" />{sortDir}</Button>
                <Button variant="outline" size="sm" onClick={() => toast.success("Exported", "Waste data exported successfully")}><Download className="h-4 w-4" /></Button>
                <Badge variant="secondary" className="esg-count-badge">{waste.length} records</Badge>
              </div>
              <div className="esg-table-wrap max-h-[500px] overflow-auto rounded border">
                <Table><TableHeader><TableRow className="esg-waste-header"><TableHead>Type</TableHead><TableHead>Disposal</TableHead><TableHead>Quantity</TableHead><TableHead>Cost</TableHead><TableHead>Recycle Rate</TableHead><TableHead>Revenue</TableHead><TableHead>Warehouse</TableHead><TableHead>Compliant</TableHead><TableHead></TableHead></TableRow></TableHeader>
                <TableBody>{(data as any[]).slice(0, 30).map((r) => <TableRow key={r.id} className="esg-waste-row"><TableCell><WasteTypeBadge emoji={r.emoji} name={r.type} /></TableCell><TableCell><DisposalBadge method={r.disposal} /></TableCell><TableCell className="text-sm">{r.quantity.toLocaleString()} kg</TableCell><TableCell className="text-sm">{fmtINR(r.cost)}</TableCell><TableCell><div className="w-20 space-y-0.5"><RecyclingRateBar val={r.recyclingRate} /><span className="text-xs">{r.recyclingRate}%</span></div></TableCell><TableCell className="text-sm text-emerald-600">{fmtINR(r.revenue)}</TableCell><TableCell className="text-xs">{r.warehouse}</TableCell><TableCell>{r.compliant ? <ComplianceBadge status="Compliant" /> : <Badge variant="outline" className="text-red-500">Non-Compliant</Badge>}</TableCell><TableCell><Button variant="ghost" size="sm" onClick={() => openRec(r)}><Eye className="h-4 w-4" /></Button></TableCell></TableRow>)}</TableBody></Table>
              </div>
            </div>);
        })()}

        {activeTab === "4" && (() => {
          const data = sortData(filterData(compliance as unknown as Record<string, string | number>[], searchQ) as unknown as Record<string, string | number>[], sortField, sortDir);
          return (
            <div className="esg-social-tab space-y-3">
              <div className="flex items-center gap-2">
                <div className="relative flex-1"><Search className="esg-search-icon absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search compliance records..." value={searchQ} onChange={(e) => setSearchQ(e.target.value)} className="pl-8" /></div>
                <Select value={sortField} onValueChange={setSortField}><SelectTrigger className="esg-sort-select w-36"><SelectValue /></SelectTrigger><SelectContent>{["id", "score", "findings", "auditDate"].map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent></Select>
                <Button variant="outline" size="sm" onClick={() => setSortDir((d) => d === "asc" ? "desc" : "asc")}><ArrowUpDown className="h-4 w-4" />{sortDir}</Button>
                <Button variant="outline" size="sm" onClick={() => toast.success("Exported", "Compliance data exported successfully")}><Download className="h-4 w-4" /></Button>
                <Badge variant="secondary" className="esg-count-badge">{compliance.length} records</Badge>
              </div>
              <div className="esg-table-wrap max-h-[500px] overflow-auto rounded border">
                <Table><TableHeader><TableRow className="esg-social-header"><TableHead>Category</TableHead><TableHead>Status</TableHead><TableHead>Score</TableHead><TableHead>Audit Date</TableHead><TableHead>Auditor</TableHead><TableHead>Findings</TableHead><TableHead>Risk</TableHead><TableHead>Cert</TableHead><TableHead></TableHead></TableRow></TableHeader>
                <TableBody>{(data as any[]).slice(0, 30).map((r) => <TableRow key={r.id} className="esg-social-row"><TableCell><CategoryBadge cat={r.category} /></TableCell><TableCell><ComplianceBadge status={r.status} /></TableCell><TableCell><div className="w-20 space-y-0.5"><EfficiencyBar val={r.score} /><span className="text-xs">{r.score}/100</span></div></TableCell><TableCell className="text-xs">{r.auditDate}</TableCell><TableCell className="text-xs">{r.auditor}</TableCell><TableCell className="text-sm">{r.findings}</TableCell><TableCell><RiskLevelBadge level={r.riskLevel} /></TableCell><TableCell>{r.certified ? <CertBadge /> : <span className="text-xs text-muted-foreground">\u2014</span>}</TableCell><TableCell><Button variant="ghost" size="sm" onClick={() => openRec(r)}><Eye className="h-4 w-4" /></Button></TableCell></TableRow>)}</TableBody></Table>
              </div>
            </div>);
        })()}

        {activeTab === "5" && (
          <div className="esg-analytics grid grid-cols-2 gap-4">
            <Card><CardHeader className="pb-2"><CardTitle className="esg-chart-title text-sm">ESG Score Trend (12 Months)</CardTitle></CardHeader><CardContent><LineChart data={esgTrend} width={420} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={10} /><YAxis fontSize={10} domain={[50, 100]} /><Tooltip /><Line type="monotone" dataKey="score" stroke="#059669" strokeWidth={2} dot={{ fill: "#059669", r: 3 }} /></LineChart></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="esg-chart-title text-sm">Carbon Emissions by Source</CardTitle></CardHeader><CardContent><PieChart width={420} height={220}><Pie data={cBySrc} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>{cBySrc.map((_, i) => <Cell key={i} fill={CL[i]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="esg-chart-title text-sm">Energy Mix: Green vs Non-Green</CardTitle></CardHeader><CardContent><BarChart data={eMix} width={420} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={10} /><Tooltip /><Bar dataKey="green" fill="#059669" name="Green" radius={[4, 4, 0, 0]} /><Bar dataKey="nonGreen" fill="#e11d48" name="Non-Green" radius={[4, 4, 0, 0]} /></BarChart></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="esg-chart-title text-sm">Compliance by Category</CardTitle></CardHeader><CardContent><BarChart data={compByCat} layout="vertical" width={420} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" fontSize={10} domain={[0, 100]} /><YAxis dataKey="cat" type="category" fontSize={9} width={110} /><Tooltip /><Bar dataKey="score" fill="#3b82f6" radius={[0, 4, 4, 0]} /></BarChart></CardContent></Card>
          </div>
        )}
      </Tabs>

      <Sheet open={!!(sheetOpen && selRec)} onOpenChange={setSheetOpen}>
        <SheetContent className="esg-sheet">
          <div className="esg-sheet-gradient -mx-6 -mt-6 mb-6 h-28 rounded-b-2xl bg-gradient-to-r from-emerald-600 via-blue-600 to-violet-600 flex items-end p-6 pb-4">
            <div><p className="text-xs font-medium uppercase tracking-wider text-white/70">Record Details</p>
            <p className="text-lg font-bold text-white">{activeTab === "1" ? (selRec?.source ?? "") : activeTab === "2" ? (selRec?.source ?? "") : activeTab === "3" ? (selRec?.type ?? "") : activeTab === "4" ? (selRec?.category ?? "") : "Details"}</p></div>
          </div>
          <SheetHeader><SheetTitle className="esg-sheet-title">Record #{selRec?.id}</SheetTitle></SheetHeader>
          {selRec && (
            <div className="esg-sheet-body mt-4 space-y-3">
              {Object.entries(selRec).filter(([k]) => k !== "id" && k !== "emoji").map(([k, v]) => (
                <div key={k} className="esg-sheet-row flex justify-between border-b border-muted pb-2">
                  <span className="text-sm text-muted-foreground capitalize">{k}</span>
                  <span className="text-sm font-medium">{typeof v === "number" && (k.includes("cost") || k.includes("revenue")) ? fmtINR(v) : String(v)}</span>
                </div>
              ))}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
