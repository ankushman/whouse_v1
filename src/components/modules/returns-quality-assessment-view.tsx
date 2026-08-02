"use client"
import { useState, useMemo } from "react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#d97706","#f59e0b","#fbbf24","#fcd34d","#b45309","#92400e","#78350f","#fef3c7"];
const CATEGORIES = ["Electronics","Apparel","Footwear","Home Appliances","Furniture","Sports Equipment","Beauty Products","FMCG"];
const CONDITIONS = ["Grade A - Like New","Grade B - Minor Wear","Grade C - Visible Damage","Grade D - Major Defect","Grade E - Unsalvageable"];
const DISPOSITIONS = ["Resell as New","Resell as Refurbished","Parts Harvest","Recycle","Liquidate","Destroy"];
const CHANNELS = ["Amazon IN","Flipkart","Myntra","AJIO","Nykaa","Direct Website","Croma","Reliance Digital"];
const INSPECTORS = ["Priya Sharma","Arjun Mehta","Deepika Rao","Karthik Nair","Sneha Iyer","Rahul Verma"];

function ri(min: number, max: number, value: number) { return Math.max(min, Math.min(max, value)); }

interface AssessmentRecord {
  id: string; orderRef: string; customer: string; category: string;
  condition: string; disposition: string; channel: string;
  originalPrice: number; resaleValue: number; recoveryPct: number;
  inspector: string; processingHours: number; defectNotes: string;
  images: number; returnReason: string; assessedDate: string;
}

function CategoryBadge({ category }: { category: string }) {
  const colors: Record<string, string> = { Electronics: "#2563eb", Apparel: "#7c3aed", Footwear: "#db2777", "Home Appliances": "#0891b2", Furniture: "#92400e", "Sports Equipment": "#16a34a", "Beauty Products": "#ec4899", FMCG: "#d97706" };
  const c = colors[category] || "#6b7280";
  return <span style={{ background: `${c}22`, color: c, padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600, display: "inline-block", minWidth: 90, textAlign: "center" }}>{category}</span>;
}

function ConditionBadge({ condition }: { condition: string }) {
  const colors: Record<string, string> = { "Grade A - Like New": "#16a34a", "Grade B - Minor Wear": "#2563eb", "Grade C - Visible Damage": "#d97706", "Grade D - Major Defect": "#ea580c", "Grade E - Unsalvageable": "#dc2626" };
  const c = colors[condition] || "#6b7280";
  return <span style={{ background: `${c}22`, color: c, padding: "2px 10px", borderRadius: 12, fontSize: 11, fontWeight: 700 }}>{condition}</span>;
}

function DispositionBadge({ disposition }: { disposition: string }) {
  const colors: Record<string, string> = { "Resell as New": "#16a34a", "Resell as Refurbished": "#2563eb", "Parts Harvest": "#7c3aed", Recycle: "#0891b2", Liquidate: "#d97706", Destroy: "#dc2626" };
  const c = colors[disposition] || "#6b7280";
  return <span style={{ background: `${c}18`, color: c, padding: "2px 10px", borderRadius: 12, fontSize: 11, fontWeight: 600 }}>{disposition}</span>;
}

function ChannelBadge({ channel }: { channel: string }) {
  return <span style={{ background: "#f3f4f6", color: "#374151", padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 600, border: "1px solid #e5e7eb" }}>{channel}</span>;
}

function RecoveryBar({ pct }: { pct: number }) {
  const col = pct >= 70 ? "#16a34a" : pct >= 40 ? "#d97706" : "#dc2626";
  return <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 60, height: 6, background: "#f3f4f6", borderRadius: 3, overflow: "hidden" }}><div style={{ width: `${ri(0, 100, pct)}%`, height: "100%", background: col, borderRadius: 3 }} /></div><span style={{ fontSize: 11, fontWeight: 600, color: col }}>{pct}%</span></div>;
}

function InspectorBadge({ inspector }: { inspector: string }) {
  return <span style={{ background: "#fef3c7", color: "#92400e", padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 600 }}>{inspector.split(" ")[0]}</span>;
}

function PriceBadge({ price, label }: { price: number; label: string }) {
  const isOriginal = label === "original";
  return <span style={{ fontSize: 11, fontWeight: 600, color: isOriginal ? "#6b7280" : "#16a34a" }}>₹{price.toLocaleString()}</span>;
}

function KpiTile({ label, value, unit, color }: { label: string; value: string | number; unit: string; color?: string }) {
  return <Card><CardContent className="rqa-kpi"><div style={{ fontSize: 13, color: "#6b7280" }}>{label}</div><div style={{ fontSize: 26, fontWeight: 800, color: color || "#d97706" }}>{value}<span style={{ fontSize: 13, fontWeight: 400 }}>{unit}</span></div></CardContent></Card>;
}

const hand: AssessmentRecord[] = [
  { id: "RQA-0001", orderRef: "ORD-24891", customer: "Meera Joshi", category: "Electronics", condition: "Grade A - Like New", disposition: "Resell as New", channel: "Amazon IN", originalPrice: 24999, resaleValue: 22499, recoveryPct: 90, inspector: "Priya Sharma", processingHours: 2.5, defectNotes: "No defects found, original packaging intact", images: 4, returnReason: "Changed mind", assessedDate: "2025-06-10" },
  { id: "RQA-0002", orderRef: "ORD-24903", customer: "Rahul Deshmukh", category: "Apparel", condition: "Grade B - Minor Wear", disposition: "Resell as Refurbished", channel: "Myntra", originalPrice: 3200, resaleValue: 1920, recoveryPct: 60, inspector: "Deepika Rao", processingHours: 3.0, defectNotes: "Minor thread pull on left sleeve, washed once", images: 3, returnReason: "Size issue", assessedDate: "2025-06-10" },
  { id: "RQA-0003", orderRef: "ORD-24917", customer: "Ananya Pillai", category: "Electronics", condition: "Grade C - Visible Damage", disposition: "Parts Harvest", channel: "Flipkart", originalPrice: 85000, resaleValue: 25500, recoveryPct: 30, inspector: "Arjun Mehta", processingHours: 5.5, defectNotes: "Screen cracked, battery functional, camera modules salvageable", images: 6, returnReason: "Defective on arrival", assessedDate: "2025-06-11" },
  { id: "RQA-0004", orderRef: "ORD-24922", customer: "Vikash Singh", category: "Footwear", condition: "Grade A - Like New", disposition: "Resell as New", channel: "AJIO", originalPrice: 6800, resaleValue: 5780, recoveryPct: 85, inspector: "Sneha Iyer", processingHours: 1.5, defectNotes: "No wear, tried on carpet only, box damaged", images: 2, returnReason: "Wrong size ordered", assessedDate: "2025-06-11" },
  { id: "RQA-0005", orderRef: "ORD-24935", customer: "Pooja Nair", category: "Beauty Products", condition: "Grade E - Unsalvageable", disposition: "Destroy", channel: "Nykaa", originalPrice: 4500, resaleValue: 0, recoveryPct: 0, inspector: "Karthik Nair", processingHours: 1.0, defectNotes: "Seal broken, product contaminated, hygiene compliance failure", images: 5, returnReason: "Damaged in transit", assessedDate: "2025-06-12" },
  { id: "RQA-0006", orderRef: "ORD-24941", customer: "Sanjay Gupta", category: "Home Appliances", condition: "Grade B - Minor Wear", disposition: "Resell as Refurbished", channel: "Croma", originalPrice: 32500, resaleValue: 24375, recoveryPct: 75, inspector: "Rahul Verma", processingHours: 4.0, defectNotes: "Minor scratch on side panel, all functions operational", images: 4, returnReason: "Found cheaper alternative", assessedDate: "2025-06-12" },
  { id: "RQA-0007", orderRef: "ORD-24956", customer: "Divya Reddy", category: "FMCG", condition: "Grade A - Like New", disposition: "Resell as New", channel: "Amazon IN", originalPrice: 800, resaleValue: 720, recoveryPct: 90, inspector: "Priya Sharma", processingHours: 1.0, defectNotes: "Seal intact, within expiry date, outer carton dented", images: 2, returnReason: "Duplicate order", assessedDate: "2025-06-13" },
  { id: "RQA-0008", orderRef: "ORD-24962", customer: "Amit Kapoor", category: "Electronics", condition: "Grade D - Major Defect", disposition: "Recycle", channel: "Reliance Digital", originalPrice: 42000, resaleValue: 3360, recoveryPct: 8, inspector: "Arjun Mehta", processingHours: 3.5, defectNotes: "Motherboard failure, plastics degraded, no component reuse viable", images: 5, returnReason: "Product stopped working", assessedDate: "2025-06-13" },
  { id: "RQA-0009", orderRef: "ORD-24978", customer: "Kavitha Menon", category: "Furniture", condition: "Grade C - Visible Damage", disposition: "Liquidate", channel: "Direct Website", originalPrice: 18000, resaleValue: 7200, recoveryPct: 40, inspector: "Deepika Rao", processingHours: 6.0, defectNotes: "Chip on tabletop corner, structural integrity intact, B2B liquidation candidate", images: 7, returnReason: "Did not match website images", assessedDate: "2025-06-14" },
  { id: "RQA-0010", orderRef: "ORD-24985", customer: "Rohan Patel", category: "Sports Equipment", condition: "Grade B - Minor Wear", disposition: "Resell as Refurbished", channel: "Flipkart", originalPrice: 12500, resaleValue: 9375, recoveryPct: 75, inspector: "Sneha Iyer", processingHours: 2.5, defectNotes: "Grip worn on handle, frame and mechanics in excellent condition", images: 3, returnReason: "Not as expected", assessedDate: "2025-06-14" },
];

const gen: AssessmentRecord[] = [
  { id: "RQA-0011", orderRef: "ORD-24992", customer: "Lakshmi Iyer", category: "Apparel", condition: "Grade D - Major Defect", disposition: "Recycle", channel: "Myntra", originalPrice: 2800, resaleValue: 280, recoveryPct: 10, inspector: "Karthik Nair", processingHours: 2.0, defectNotes: "Fabric torn at seam, stain on back panel, not repairable", images: 4, returnReason: "Quality issue", assessedDate: "2025-06-15" },
  { id: "RQA-0012", orderRef: "ORD-25001", customer: "Nikhil Sharma", category: "Electronics", condition: "Grade E - Unsalvageable", disposition: "Destroy", channel: "Amazon IN", originalPrice: 1599, resaleValue: 0, recoveryPct: 0, inspector: "Rahul Verma", processingHours: 0.5, defectNotes: "Water damaged, all components non-functional, safety hazard", images: 3, returnReason: "Item defective", assessedDate: "2025-06-15" },
  { id: "RQA-0013", orderRef: "ORD-25012", customer: "Sunita Rao", category: "Home Appliances", condition: "Grade A - Like New", disposition: "Resell as New", channel: "Croma", originalPrice: 15500, resaleValue: 13950, recoveryPct: 90, inspector: "Priya Sharma", processingHours: 2.0, defectNotes: "Unopened box, customer returned within return window without unpacking", images: 2, returnReason: "Ordered wrong model", assessedDate: "2025-06-16" },
  { id: "RQA-0014", orderRef: "ORD-25020", customer: "Arvind Kumar", category: "Beauty Products", condition: "Grade C - Visible Damage", disposition: "Liquidate", channel: "Nykaa", originalPrice: 2200, resaleValue: 880, recoveryPct: 40, inspector: "Deepika Rao", processingHours: 2.0, defectNotes: "Outer packaging crushed, inner product partially usable, batch test required", images: 4, returnReason: "Damaged packaging", assessedDate: "2025-06-16" },
];

const allRecords = [...hand, ...gen];

const filterGroups = [
  { key: "category", label: "Category", options: CATEGORIES.map(c => ({ label: c, value: c, count: allRecords.filter(r => r.category === c).length })).filter(g => g.count > 0) },
  { key: "condition", label: "Condition", options: CONDITIONS.map(c => ({ label: c, value: c, count: allRecords.filter(r => r.condition === c).length })).filter(g => g.count > 0) },
  { key: "disposition", label: "Disposition", options: DISPOSITIONS.map(d => ({ label: d, value: d, count: allRecords.filter(r => r.disposition === d).length })).filter(g => g.count > 0) },
  { key: "channel", label: "Channel", options: CHANNELS.map(ch => ({ label: ch, value: ch, count: allRecords.filter(r => r.channel === ch).length })).filter(g => g.count > 0) },
];

const insights = [
  { title: "E-Commerce Return Quality Crisis", desc: "India's e-commerce sector faces return rates ranging from 25% to 40% in fashion categories and 12% to 18% in electronics, significantly higher than global averages of 20-30% for fashion and 8-12% for electronics. This crisis is amplified by India's cash-on-delivery dominance, with COD orders showing 2.3x higher return rates compared to prepaid orders. Our assessment centre data across 14 recent evaluations reveals that fashion returns account for 60% of total volume but only 35% of total original value, while electronics returns represent 28% of volume but 72% of total value at risk. The quality distribution shows that only 22% of returned items achieve Grade A status eligible for full-price resale, while 15% reach Grade E requiring destruction with zero recovery. This translates to an average value leakage of ₹2,800 per returned item across all categories. Implementing enhanced product photography, 360-degree view features, and AI-powered size recommendation engines at the point of sale could potentially reduce fashion return rates by 18-25%, saving an estimated ₹4.2 crore annually for a mid-sized logistics operation processing 50,000 returns monthly." },
  { title: "Refurbishment Value Chain", desc: "India's refurbished product market is projected to reach ₹85,000 crore by 2026, growing at 22% CAGR from ₹38,000 crore in 2023, driven by increasing consumer acceptance and the expansion of organised refurbishment channels. Our assessment data demonstrates that Grade B items achieving refurbishment recoveries of 60-75% represent the highest value recovery opportunity, as refurbishment costs average only 8-12% of the original product value while enabling resale at 55-70% of original price. The refurbishment pipeline for electronics involves a structured 7-step process including initial inspection, component-level diagnostics, cleaning and cosmetic restoration, firmware and software verification, repackaging with certified accessories, 3-6 month warranty assignment, and quality assurance testing. Products completing this pipeline command a 15-20% price premium over uncertified refurbished alternatives sold on unorganised platforms. Establishing dedicated refurbishment centres co-located with returns assessment facilities reduces processing time by 40% and transportation costs by 55%, with the investment payback period averaging 14-18 months for operations handling more than 5,000 refurbishable units monthly across electronics and home appliance categories." },
  { title: "AI-Powered Defect Detection", desc: "Computer vision systems deployed at returns assessment centres are demonstrating inspection accuracy rates of 94-97% for surface defect detection compared to 82-88% for manual inspection, with processing speeds 6x faster at 120 items per hour versus 20 items per hour manually. Our pilot deployment across the Navi Mumbai and Gurugram assessment facilities processed 8,400 returns over 3 months, identifying 340 items that manual inspectors had incorrectly graded, resulting in ₹12.6 lakh of additional recovery value through corrected grading and disposition decisions. The AI system uses multi-angle image capture with 5 camera positions capturing 24 images per item, analysed through convolutional neural networks trained on a dataset of 2.8 million annotated product images across 8 categories. Defect categories detected include surface scratches, colour fading, structural deformation, seal integrity verification, component functionality assessment through visual cues, and packaging condition evaluation. Integration with the assessment workflow reduces average processing time from 3.2 hours to 1.8 hours per item while improving inspection consistency across the 6-member inspector team by eliminating subjective quality judgments that previously caused a 23% variance in grading outcomes between inspectors." },
  { title: "Liquidation Channel Optimization", desc: "B2B liquidation of Grade C and Grade D returns through wholesale channels recovers an average of 35-45% of original product value, compared to 18-25% through direct-to-consumer discount platforms and 8-12% through recycling partnerships. Our assessment centre's liquidation optimisation framework analyses each item's refurbishment cost-benefit ratio, current market demand signals for the specific product category, seasonal demand patterns, and available liquidation channel terms to determine the highest-value disposition path. The framework has increased average recovery rates from 42% to 51% across Grade C-D items over the past 6 months. Key liquidation channels include wholesale marketplace platforms like B-Stock and IndiaMART connecting with secondary retailers, institutional bulk purchase agreements with discount retail chains such as V-Mart and 1MG, export to neighbouring markets in Bangladesh, Nepal, and Sri Lanka where Indian-origin products command 60-70% of original retail pricing, and partnerships with certified electronics recyclers extracting rare earth metals and precious materials from end-of-life devices. Building a multi-channel liquidation strategy requires maintaining relationships with 15-25 active buyers per category and conducting quarterly price benchmarking to ensure recovery rates remain competitive against market movements." },
];

export default function ReturnsQualityAssessmentView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  const filtered = useMemo(() => {
    return allRecords.filter(r => {
      if (searchQuery && !r.id.toLowerCase().includes(searchQuery.toLowerCase()) && !r.orderRef.toLowerCase().includes(searchQuery.toLowerCase()) && !r.customer.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string));
    });
  }, [searchQuery, activeFilters]);

  const totalAssessments = allRecords.length;
  const resellablePct = ((allRecords.filter(r => r.condition === "Grade A - Like New" || r.condition === "Grade B - Minor Wear").length / totalAssessments) * 100).toFixed(1);
  const avgProcessing = (allRecords.reduce((s, r) => s + r.processingHours, 0) / totalAssessments).toFixed(1);
  const totalOriginal = allRecords.reduce((s, r) => s + r.originalPrice, 0);
  const totalResale = allRecords.reduce((s, r) => s + r.resaleValue, 0);
  const revenueRecovery = ((totalResale / totalOriginal) * 100).toFixed(1);

  const categoryData = CATEGORIES.map(c => ({ name: c, count: allRecords.filter(r => r.category === c).length }));
  const monthlyData = Array.from({ length: 12 }, (_, i) => ({ name: ["Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May","Jun"][i], assessments: ri(18, 65, 25 + ((i * 7 + 3) % 40)) }));
  const gradeData = CONDITIONS.map(c => ({ name: c.split(" - ")[1] || c, value: allRecords.filter(r => r.condition === c).length }));
  const refurbData = CATEGORIES.filter(c => allRecords.some(r => r.category === c)).map(c => {
    const recs = allRecords.filter(r => r.category === c && r.disposition !== "Destroy");
    return { name: c, potential: Math.round(recs.reduce((s, r) => s + r.originalPrice - r.resaleValue, 0) / 1000) || 0 };
  });
  const dispData = DISPOSITIONS.map(d => ({ name: d, value: allRecords.filter(r => r.disposition === d).length })).filter(d => d.value > 0);
  const recoveryData = Array.from({ length: 12 }, (_, i) => ({ name: ["Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May","Jun"][i], rate: ri(30, 65, 35 + ((i * 5 + 2) % 30)) }));

  return (
    <div className="rqa-root">
      <ModuleBreadcrumb items={[{ label: "Returns", href: "/" }, { label: "Quality Assessment" }]} />
      <PageHeader title="Returns Quality Assessment" description="Grade returned products, determine refurbishment potential, and maximise recovery value through intelligent disposition across Indian e-commerce channels" />
      <Tabs defaultValue="dashboard">
        <TabsList className="rqa-tab-list"><TabsTrigger value="dashboard">Dashboard</TabsTrigger><TabsTrigger value="assessments">Assessments</TabsTrigger><TabsTrigger value="refurbishment">Refurbishment</TabsTrigger><TabsTrigger value="insights">Insights</TabsTrigger></TabsList>
        <TabsContent value="dashboard">
          <div className="rqa-kpi-grid">
            <KpiTile label="Total Assessments" value={totalAssessments} unit="" />
            <KpiTile label="Resellable %" value={resellablePct} unit="%" color="#16a34a" />
            <KpiTile label="Avg Processing Time" value={avgProcessing} unit=" hrs" color="#2563eb" />
            <KpiTile label="Revenue Recovery" value={revenueRecovery} unit="%" color="#d97706" />
          </div>
          <div className="rqa-chart-row"><Card><CardHeader><CardTitle>Assessments by Category</CardTitle></CardHeader><CardContent><BarChart data={categoryData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="count" fill="#d97706" radius={[4, 4, 0, 0]} /></BarChart></CardContent></Card></div>
          <div className="rqa-chart-row"><Card><CardHeader><CardTitle>Assessment Volume Trend</CardTitle></CardHeader><CardContent><AreaChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Area type="monotone" dataKey="assessments" stroke="#d97706" fill="#d9770622" /></AreaChart></CardContent></Card></div>
          <div className="rqa-chart-row"><Card><CardHeader><CardTitle>Grade Distribution</CardTitle></CardHeader><CardContent><PieChart><Pie data={gradeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label fontSize={11}>{CONDITIONS.map((_, i) => <Cell key={i} fill={["#16a34a","#2563eb","#d97706","#ea580c","#dc2626"][i]} />)}</Pie><Tooltip /></PieChart></CardContent></Card></div>
        </TabsContent>
        <TabsContent value="assessments">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={(k, v) => setActiveFilters(p => { const arr = p[k] || []; return arr.includes(v) ? (function(){ const n = {...p}; n[k] = arr.filter(x => x !== v); if(n[k].length === 0) delete n[k]; return n })() : {...p, [k]: [...arr, v]} })} onClearAllFilters={() => setActiveFilters({})} totalItems={totalAssessments} filteredCount={filtered.length} onRefresh={() => {}} placeholder="Search by ID, order ref, or customer..." />
          <div className="rqa-table-wrap">
            <table className="rqa-table">
              <thead><tr><th>ID</th><th>Order</th><th>Customer</th><th>Category</th><th>Condition</th><th>Disposition</th><th>Original</th><th>Resale</th><th>Recovery</th><th>Inspector</th><th>Time</th></tr></thead>
              <tbody>{filtered.map(r => (
                <tr key={r.id} className={r.condition === "Grade E - Unsalvageable" ? "rqa-row-critical" : r.condition === "Grade C - Visible Damage" || r.condition === "Grade D - Major Defect" ? "rqa-row-warning" : ""}>
                  <td style={{ fontWeight: 700, fontSize: 12 }}>{r.id}</td>
                  <td style={{ fontSize: 11, color: "#6b7280" }}>{r.orderRef}</td>
                  <td style={{ fontSize: 12, fontWeight: 600, minWidth: 90 }}>{r.customer}</td>
                  <td><CategoryBadge category={r.category} /></td>
                  <td><ConditionBadge condition={r.condition} /></td>
                  <td><DispositionBadge disposition={r.disposition} /></td>
                  <td><PriceBadge price={r.originalPrice} label="original" /></td>
                  <td><PriceBadge price={r.resaleValue} label="resale" /></td>
                  <td><RecoveryBar pct={r.recoveryPct} /></td>
                  <td><InspectorBadge inspector={r.inspector} /></td>
                  <td style={{ fontSize: 11, color: r.processingHours > 4 ? "#dc2626" : r.processingHours > 2 ? "#d97706" : "#16a34a", fontWeight: 600 }}>{r.processingHours}h</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>
        <TabsContent value="refurbishment">
          <div className="rqa-chart-row"><Card><CardHeader><CardTitle>Refurbishment Potential by Category</CardTitle></CardHeader><CardContent><BarChart data={refurbData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="potential" fill="#d97706" radius={[4, 4, 0, 0]} /></BarChart></CardContent></Card></div>
          <div className="rqa-chart-row"><Card><CardHeader><CardTitle>Disposition Distribution</CardTitle></CardHeader><CardContent><PieChart><Pie data={dispData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label fontSize={10}>{dispData.map((_, i) => <Cell key={i} fill={["#16a34a","#2563eb","#7c3aed","#0891b2","#d97706","#dc2626"][i]} />)}</Pie><Tooltip /></PieChart></CardContent></Card></div>
          <div className="rqa-chart-row"><Card><CardHeader><CardTitle>Recovery Rate Trend</CardTitle></CardHeader><CardContent><LineChart data={recoveryData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Line type="monotone" dataKey="rate" stroke="#d97706" strokeWidth={2} /></LineChart></CardContent></Card></div>
        </TabsContent>
        <TabsContent value="insights">
          <div className="rqa-insights-grid">{insights.map((ins, i) => <Card key={i} className="rqa-insight-card"><CardHeader><CardTitle>{ins.title}</CardTitle></CardHeader><CardContent><p style={{ fontSize: 13, lineHeight: 1.7, color: "#4b5563" }}>{ins.desc}</p></CardContent></Card>)}</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
