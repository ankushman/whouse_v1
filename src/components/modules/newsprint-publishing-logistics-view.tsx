"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#0f766e", "#14b8a6", "#5eead4", "#99f6e4", "#ccfbf1", "#134e4a", "#2dd4bf", "#a7f3d0"];
const PRESSES = ["Dainik Jagran Kanpur UP", "Times of India Delhi Edition", "Malayala Manorama Kottayam", "Hindustan Times Mumbai Press", "The Hindu Chennai Printing", "Eenadu Hyderabad Press", "Ananda Bazar Kolkata", "Sakal Pune Maharashtra"];
const CATEGORIES = ["Broadsheet English", "Broadsheet Hindi", "Tabloid Compact", "Regional Language", "Financial Daily", "Sports Supplement", "Weekend Edition", "Evening Daily"];
const EDITION_STATUSES = ["Platemaking", "Printing", "Dispatched", "In Transit", "At Distribution Hub", "Delivered to Hawker"];
const ZONES = ["NCR Delhi Circuit", "Mumbai Metro Belt", "South India Corridor", "East India Route", "West Maharashtra Link", "Central MP Chhattisgarh"];
const MODES = ["Press Van 5T", "Rail Newspaper Wagon", "3W Cargo Scooter", "Bulker Truck 10T", "E-Rickshaw Last Mile", "Cycle Hawker Bag"];
const TABS = ["Dashboard", "Edition Registry", "Publishing Analytics", "Insights"];

const SC: Record<string, string> = { green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700", blue: "bg-blue-100 text-blue-700", slate: "bg-slate-100 text-slate-600", orange: "bg-orange-100 text-orange-700" };
const statusColor: Record<string, string> = { "Platemaking": "blue", "Printing": "blue", "Dispatched": "blue", "In Transit": "blue", "At Distribution Hub": "green", "Delivered to Hawker": "green" };

function ri(min: number, max: number, value: number) { return Math.min(max, Math.max(min, value)); }

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyEditions = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], english: ri(180, 320, 240 + Math.sin(i * 0.5) * 35), hindi: ri(220, 400, 300 + Math.cos(i * 0.6) * 40), regional: ri(140, 260, 190 + Math.sin(i * 0.7) * 25), tabloid: ri(80, 150, 110 + Math.cos(i * 0.8) * 15) }));
const categoryDist = [{ n: "Broadsheet Hindi", v: 32 }, { n: "Broadsheet English", v: 24 }, { n: "Regional Language", v: 18 }, { n: "Tabloid Compact", v: 12 }, { n: "Financial Daily", v: 7 }, { n: "Sports Supplement", v: 4 }, { n: "Weekend Edition", v: 2 }, { n: "Evening Daily", v: 1 }];
const printEfficiency = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], actual: +(ri(94, 99.5, 97 + Math.sin(i * 0.4) * 1.2)).toFixed(1), target: 97.5 }));
const pressPerf = PRESSES.slice(0, 6).map(p => ({ n: p.split(" ").slice(0, 2).join(" "), v: +ri(82, 98, 91 + Math.random() * 5).toFixed(0) }));

interface EditionRecord { id: string; edition: string; press: string; zone: string; category: string; title: string; copies: number; vendor: string; mode: string; printDate: string; etaDate: string; transitHrs: number; revenueLakhs: number; breakingFlag: boolean; status: string; remarks: string; }

const records: EditionRecord[] = [
  { id: "NPL-0001", edition: "EDN-DJ/2025/7821", press: "Dainik Jagran Kanpur UP", zone: "NCR Delhi Circuit", category: "Broadsheet Hindi", title: "Dainik Jagran Kanpur Main Edition 12pg", copies: 285000, vendor: "Hawker Network Kanpur 450 agents", mode: "Press Van 5T", printDate: "2025-07-11", etaDate: "", transitHrs: 3, revenueLakhs: 42, breakingFlag: true, status: "Printing", remarks: "Breaking: UP assembly monsoon session lead coverage extra 4 pages" },
  { id: "NPL-0002", edition: "EDN-TOI/2025/5432", press: "Times of India Delhi Edition", zone: "NCR Delhi Circuit", category: "Broadsheet English", title: "TOI Delhi City+National 24pg", copies: 520000, vendor: "TOI Direct D2H Delhi NCR", mode: "3W Cargo Scooter", printDate: "2025-07-11", etaDate: "", transitHrs: 2, revenueLakhs: 85, breakingFlag: false, status: "Dispatched", remarks: "Regular city edition with standalone city supplement 8 pages" },
  { id: "NPL-0003", edition: "EDN-MM/2025/9087", press: "Malayala Manorama Kottayam", zone: "South India Corridor", category: "Regional Language", title: "Malayala Manorama Kerala 16pg", copies: 380000, vendor: "Manorama Agency Network Kerala", mode: "Rail Newspaper Wagon", printDate: "2025-07-10", etaDate: "2025-07-11", transitHrs: 8, revenueLakhs: 35, breakingFlag: false, status: "Delivered to Hawker", remarks: "Kerala statewide distribution 14 district hubs Ernakulam Thrissur" },
  { id: "NPL-0004", edition: "EDN-HT/2025/3456", press: "Hindustan Times Mumbai Press", zone: "Mumbai Metro Belt", category: "Broadsheet English", title: "HT Mumbai Edition 20pg+Mint supplement", copies: 310000, vendor: "HT Hawker Association Mumbai", mode: "Press Van 5T", printDate: "2025-07-11", etaDate: "", transitHrs: 4, revenueLakhs: 52, breakingFlag: true, status: "Platemaking", remarks: "Breaking: Mumbai monsoon flooding ward-level coverage Mumbai Mirror pullout" },
  { id: "NPL-0005", edition: "EDN-TH/2025/6789", press: "The Hindu Chennai Printing", zone: "South India Corridor", category: "Broadsheet English", title: "The Hindu Chennai+South 28pg", copies: 220000, vendor: "The Hindu Agent Network South", mode: "Rail Newspaper Wagon", printDate: "2025-07-10", etaDate: "2025-07-11", transitHrs: 6, revenueLakhs: 38, breakingFlag: false, status: "In Transit", remarks: "Chennai Hyderabad Bangalore triangle rail distribution via Chengalpattu hub" },
  { id: "NPL-0006", edition: "EDN-EE/2025/1234", press: "Eenadu Hyderabad Press", zone: "South India Corridor", category: "Regional Language", title: "Eenadu Telugu Main+City 20pg", copies: 410000, vendor: "Eenadu Distribution AP Telangana", mode: "Bulker Truck 10T", printDate: "2025-07-11", etaDate: "", transitHrs: 5, revenueLakhs: 28, breakingFlag: true, status: "Dispatched", remarks: "Breaking: Telangana budget session coverage Eenadu TV cross-promotion" },
  { id: "NPL-0007", edition: "EDN-AB/2025/5678", press: "Ananda Bazar Kolkata", zone: "East India Route", category: "Regional Language", title: "Ananda Bazar Patrika 16pg Bengali", copies: 290000, vendor: "ABP Hawker Network Bengal", mode: "Press Van 5T", printDate: "2025-07-10", etaDate: "2025-07-11", transitHrs: 4, revenueLakhs: 32, breakingFlag: false, status: "At Distribution Hub", remarks: "Kolkata Howrah Sealdah distribution hub transit to Siliguri Guwahati" },
  { id: "NPL-0008", edition: "EDN-SK/2025/8901", press: "Sakal Pune Maharashtra", zone: "West Maharashtra Link", category: "Regional Language", title: "Sakal Marathi Pune 14pg", copies: 175000, vendor: "Sakal Patra Prakashan Pune", mode: "E-Rickshaw Last Mile", printDate: "2025-07-11", etaDate: "", transitHrs: 2, revenueLakhs: 12, breakingFlag: false, status: "Delivered to Hawker", remarks: "Pune PCMC daily delivery e-rickshaw last mile 1200 hawkers Pimpri Chinchwad" },
  { id: "NPL-0009", edition: "EDN-TOI/2025/2345", press: "Times of India Delhi Edition", zone: "NCR Delhi Circuit", category: "Financial Daily", title: "Economic Times Delhi 24pg", copies: 185000, vendor: "ET Direct Corporate Delhi", mode: "Press Van 5T", printDate: "2025-07-11", etaDate: "", transitHrs: 2, revenueLakhs: 45, breakingFlag: false, status: "In Transit", remarks: "ET Delhi edition for corporate hubs Nehru Place Connaught Place Gurgaon" },
  { id: "NPL-0010", edition: "EDN-DJ/2025/4567", press: "Dainik Jagran Kanpur UP", zone: "Central MP Chhattisgarh", category: "Broadsheet Hindi", title: "Dainik Jagran Bhopal Edition 12pg", copies: 195000, vendor: "Jagran Network Bhopal Indore", mode: "Rail Newspaper Wagon", printDate: "2025-07-10", etaDate: "", transitHrs: 10, revenueLakhs: 18, breakingFlag: true, status: "In Transit", remarks: "Breaking: MP cabinet expansion exclusive Bhopal Indore Jabalpur rail distribution" },
  { id: "NPL-0011", edition: "EDN-HT/2025/7890", press: "Hindustan Times Mumbai Press", zone: "Mumbai Metro Belt", category: "Tabloid Compact", title: "HT Mint Compact 32pg Financial", copies: 95000, vendor: "Mint Corporate Delivery Mumbai", mode: "3W Cargo Scooter", printDate: "2025-07-11", etaDate: "2025-07-11", transitHrs: 3, revenueLakhs: 28, breakingFlag: false, status: "At Distribution Hub", remarks: "Mint compact financial daily Mumbai BKC Nariman Point corporate towers D2H" },
  { id: "NPL-0012", edition: "EDN-TH/2025/1122", press: "The Hindu Chennai Printing", zone: "South India Corridor", category: "Sports Supplement", title: "The Hindu Sportstar Chennai 48pg", copies: 120000, vendor: "Sportstar Agency Network", mode: "Bulker Truck 10T", printDate: "2025-07-09", etaDate: "", transitHrs: 5, revenueLakhs: 8, breakingFlag: false, status: "Platemaking", remarks: "Sportstar weekly special edition IPL auction coverage 48 page bumper issue" },
  { id: "NPL-0013", edition: "EDN-AB/2025/3344", press: "Ananda Bazar Kolkata", zone: "East India Route", category: "Weekend Edition", title: "ABP Weekend Telegraph 32pg", copies: 240000, vendor: "Telegraph Weekend Hawkers", mode: "Press Van 5T", printDate: "2025-07-11", etaDate: "", transitHrs: 4, revenueLakhs: 22, breakingFlag: false, status: "Delivered to Hawker", remarks: "Saturday Telegraph weekend magazine Kolkata Durga Puja preview 32 pages" },
  { id: "NPL-0014", edition: "EDN-EE/2025/9012", press: "Eenadu Hyderabad Press", zone: "South India Corridor", category: "Broadsheet Hindi", title: "Eenadu Visaalandhra Hyderabad 16pg", copies: 160000, vendor: "Eenadu AP Telugu Network", mode: "Cycle Hawker Bag", printDate: "2025-07-11", etaDate: "2025-07-11", transitHrs: 1, revenueLakhs: 10, breakingFlag: false, status: "Dispatched", remarks: "Visaalandhra Hindi edition Hyderabad Secunderabad cycle hawker local delivery" },
];

const transitCount = records.filter(r => r.status === "In Transit" || r.status === "Dispatched").length;
const pressCount = records.filter(r => r.status === "Platemaking" || r.status === "Printing").length;
const deliveredCount = records.filter(r => r.status === "Delivered to Hawker" || r.status === "At Distribution Hub").length;
const totalRevenue = records.reduce((s, r) => s + r.revenueLakhs, 0);

const kpis = [
  { l: "In Print / Platemaking", v: pressCount, s: "editions active" },
  { l: "In Transit / Dispatched", v: transitCount, s: "on the road" },
  { l: "Delivered / At Hub", v: deliveredCount, s: "reached destination" },
  { l: "Total Ad Revenue", v: `\u20b9${totalRevenue}L`, s: "this edition cycle" },
];

const INSIGHTS = [
  {
    t: "India Print Media: \u20b932,000 Crore Industry, 1,300+ Newspapers, 46 Crore Daily Readers",
    c: "India is the world\u2019s second-largest newspaper market by circulation (after China) and the largest by number of titles (1,300+ registered dailies in 22+ languages, certified by RNI \u2014 Registrar of Newspapers for India). India\u2019s print media industry: \u20b932,000 crore annual revenue (2024-25), with advertising contributing 65% (\u20b920,800 crore) and circulation/cover price 35% (\u20b911,200 crore). India\u2019s daily newspaper circulation: 11 crore copies per day (4.8 crore Hindi, 2.8 crore English, 3.4 crore regional languages). Daily readership (IRS 2024): 46 crore adults read a newspaper daily (readership to circulation ratio: 4.2x, one copy read by 4.2 persons on average). Top 10 newspapers by circulation: (1) Dainik Jagran (Hindi, 4.8 crore daily, 37 editions, UP/Jharkhand/Bihar/Bihar/MP/Delhi/Haryana/Himachal), (2) Dainik Bhaskar (Hindi, 3.9 crore, 28 editions, MP/Rajasthan/Gujarat/Chhattisgarh/Maharashtra), (3) Times of India (English, 2.1 crore, 14 editions, India\u2019s largest English daily), (4) Malayala Manorama (Malayalam, 1.8 crore, Kerala\u2019s highest-read daily, 96% Kerala household penetration), (5) Hindustan (Hindi, 1.6 crore, 21 editions, Delhi/UP/Bihar/Jharkhand), (6) Eenadu (Telugu, 1.5 crore, 23 editions, AP/Telangana market leader), (7) Amar Ujala (Hindi, 1.4 crore, 19 editions), (8) The Hindu (English, 0.9 crore, 21 editions, South India leader), (9) Ananda Bazar Patrika (Bengali, 0.8 crore, West Bengal), and (10) Sakal (Marathi, 0.6 crore, Maharashtra). India\u2019s print media logistics chain: (a) 250+ printing presses (web offset, capacity 30,000-100,000 copies per hour), (b) 5,000+ plate-making units (CTP \u2014 Computer to Plate technology: 95%+ adoption), (c) 300,000+ hawkers and newspaper vendors (last-mile delivery by 5 AM), (d) 50,000+ post office and rail newspaper distribution points, (e) 200+ distribution hubs (city-level sorting and routing centers), and (f) 2,000+ press vans and distribution trucks. India\u2019s newsprint consumption: 28 lakh MT annually (2024-25), with domestic newsprint production at 8 lakh MT and imports at 20 lakh MT (primary sources: Canada, Sweden, Russia, UAE). India\u2019s newsprint logistics cost: 15-20% of cover price (vs 5-8% for FMCG), driven by: (1) Perishability (news is dated, must deliver before 6 AM), (2) Low weight-to-value ratio (newsprint: \u20b940-50 per kg), and (3) Wide distribution (top dailies distribute to 500+ districts).",
  },
  {
    t: "Newspaper Printing Process: Editorial to Press to Plate to Print to Distribution",
    c: "India\u2019s daily newspaper production follows an extremely tight overnight production cycle (6 PM editorial close to 5 AM doorstep delivery \u2014 11 hours end-to-end): (1) Editorial and Pagination (6 PM - 9 PM): news desk finalizes stories, page designers create layouts using DTP software (Adobe InDesign, QuarkXPress). India\u2019s newsrooms: 500+ journalists per major daily (TOI: 2,000+ reporters across India), wire services (PTI, UNI, IANS) feed stories 24/7. (2) Plate-making (9 PM - 11 PM): CTP (Computer-to-Plate) machines laser-etch aluminum printing plates from PDF files. India\u2019s CTP adoption: 95%+ (legacy: manual plate exposure using film, now rare). Plate cycle: 2-3 minutes per plate, 4 plates per page (CMYK), 16-24 pages = 64-96 plates per edition. Plate material: aluminum sheets (0.15-0.30 mm thickness), \u20b980-120 per plate, reusable after grinding. (3) Printing (11 PM - 3 AM): web offset printing presses (coldset for standard newsprint, heatset for glossy supplements). Major press manufacturers: manroland (Germany), Goss (USA), Shanghai Jiefang (China). India\u2019s largest presses: (a) TOI Mumbai (BKC press): 4 web offset machines, 80 pages, 200,000 copies/hour, (b) Dainik Jagran Kanpur: 3 presses, 150,000 copies/hour, (c) Malayala Manorama Kottayam: 2 high-speed presses, 120,000 copies/hour. Printing speed: 30-40 km/hr web speed, 60-80 km/hr for high-speed presses. Paper width: 432mm (broadsheet) or 280mm (tabloid/compact). Newsprint specifications: 42-48.8 gsm, brightness 62-65 ISO, bulk 1.1-1.3 cm3/g. (4) Post-press (3 AM - 4 AM): folding, cutting, inserting supplements, bundling (typically 25-50 copies per bundle). Insertion machines: 20-30 inserts per minute. Bundle wrapping: polythene or jute string. (5) Distribution and last-mile (4 AM - 6 AM): press vans transport bundles from press to 50-200 city hubs within 60-90 minutes. Hub to hawker: 3W cargo scooters, e-rickshaws, bicycle hawkers deliver to homes and stalls by 5:30-6:00 AM. India\u2019s hawker model: 300,000+ hawkers (typically on credit: payment weekly/monthly), 70% home delivery, 30% stall/traffic signal sales. Cover price economics: \u20b93-8 per copy (Hindi: \u20b93-5, English: \u20b96-10, regional: \u20b93-6), with ad rates: \u20b95-50 per sq cm (TOI Delhi front page: \u20b950/sq cm, \u20b925 lakh per full page).",
  },
  {
    t: "Newspaper Distribution Logistics: Press Vans, Rail Wagons, and Hawker Networks",
    c: "India\u2019s newspaper distribution logistics operates through a multi-tier network designed for extreme time pressure (night production, morning delivery): (1) Press-to-Hub (First Mile): press vans (5-10T capacity, 150-300 km radius) transport printed bundles from press to city/town distribution hubs. India\u2019s major dailies operate 200+ press vans each. Journey: 11 PM departure from press, 2-3 AM arrival at hub (3-5 hour transit for 150-300 km). Key logistics: (a) Route optimization: daily route planning based on edition size (varying circulation by day \u2014 Monday low, Saturday high), (b) Temperature control: newsprint is hygroscopic \u2014 vinyl-covered bundles in monsoon to prevent ink smudging, and (c) Night driving: dedicated night drivers, highway toll-free passes for newspaper vehicles in several states. (2) Rail Newspaper Wagons: Indian Railways operates 50+ dedicated newspaper vans on mail/express trains, carrying 50-80 lakh copies daily. Key rail routes: (a) Delhi-Kolkata (Howrah Rajdhani: 500 bundles/night), (b) Delhi-Mumbai (Mumbai Rajdhani: 400 bundles/night), (c) Chennai-Bangalore-Hyderabad triangle, and (d) Delhi-Chennai (Tamil Nadu Express). Rail logistics: (a) Loading at press railway siding or station platform (3-4 AM), (b) Transit 4-8 hours, (c) Unloading at destination station and transfer to local hub, (d) Rail is critical for multi-state dailies (TOI, Hindu, Jagran print at central location and distribute by rail). (3) Hub-to-Hawker (Last Mile): the final delivery leg using 3W cargo scooters (Bajaj RE, Piaggio Ape: 200-500 copies per trip), e-rickshawks (100-200 copies, emerging in Delhi/UP), bicycle hawkers (50-150 copies, traditional, still 40%+ of last-mile), and auto-rickshaw (intermediate, 200-400 copies). Last-mile challenge: narrow urban lanes, early morning darkness, monsoon flooding. Technology adoption: (a) GPS tracking on press vans (real-time ETA for hub managers), (b) Hawker mobile apps (TOI \u2014 Times Active, Jagran \u2014 Jagran Plus: order management, payment, complaint resolution), (c) QR codes on bundles for hub-to-hawker reconciliation, and (d) Digital payment: UPI for hawker-to-distributor settlement (reducing cash cycle from 15 days to 3 days). (4) Emerging trends: (a) E-paper and digital editions (TOI digital: 15 crore monthly active users, 3x print readership), (b) Print-on-demand for NRI diaspora (same-day print in London/Dubai for TOI/Hindu via PDF transfer), (c) Consolidation of small presses (regional dailies sharing printing infrastructure), and (d) Green newsprint: recycled fiber content increasing (40-60% recycled, target: 70% by 2030, reducing import dependence).",
  },
  {
    t: "Print Media Technology: CTP, Web Offset, Digital Integration, and Revenue Models",
    c: "India\u2019s print media technology landscape: (1) Computer-to-Plate (CTP): near-universal adoption (95%+), with thermal laser CTP (Agfa, Kodak, Screen) producing plates at 200+ plates/hour. Advantage: eliminating film reduces lead time by 30 minutes, improves quality (resolution: 2,400 dpi). Emerging: processless CTP plates (no chemical developer, eco-friendly). (2) Web Offset Presses: India has 500+ web offset units (coldset: standard newsprint, heatset: coated paper for supplements and magazines). Press automation: (a) Closed-loop colour control (scanners adjust ink keys in real-time), (b) Automatic register control (maintaining colour alignment across 4-8 webs simultaneously), (c) Web break detection (infrared sensors at 100+ locations, automatic splice within 3 seconds), and (d) Ink consumption monitoring (CIP4/JDF integration with MIS). Press maintenance: planned shutdown every 4-6 weeks (16-24 hours), annual overhaul: 5-7 days. (3) Digital Integration: India\u2019s dailies operate omni-channel newsrooms: (a) Content management systems (CMS: Polopoly, Escenic, WordPress VIP) managing stories across print, web, app, and social simultaneously, (b) Real-time analytics: chartbeat/crazy egg tracking digital story performance, feeding back to print editorial decisions, (c) Social media: TOI (12 crore social media followers across platforms), Aaj Tak/India Today (8 crore), NDTV (6 crore), and (d) Podcast and video: print houses launching YouTube channels and podcasts (The Hindu: 2 lakh YouTube subscribers, IE: 5 lakh). (4) Revenue Model Transformation: India\u2019s print ad revenue peaked in FY2016 (\u20b924,000 crore) and has declined 10-15% since, while digital ad revenue grows 25%+ annually. Mitigation strategies: (a) Premium pricing: TOI Delhi rate card up 40% in 5 years (front page: \u20b925 lakh to \u20b935 lakh), (b) Sponsored content/native advertising (branded content teams at every major daily), (c) Events and conferences (TOI \u2014 Times Litfest, ET \u2014 Global Business Summit: \u20b910-50 crore annual event revenue), (d) Paywalls: The Hindu (2019), Business Standard (2020), and Mint (2022) \u2014 subscription revenue: \u20b9200-500 crore combined for paywall dailies, (e) e-paper subscriptions (bundled with print subscription for institutional buyers: libraries, hotels, airlines), and (f) Revenue diversification: education (TOI \u2014 Bennett University, Jagran \u2014 Jagran Institute of Management). India\u2019s print media outlook: stable at \u20b930,000-35,000 crore through 2030, with digital growing from \u20b925,000 crore (2024) to \u20b955,000 crore (2030). The combined print+digital market: \u20b955,000 crore in 2024, projected \u20b990,000 crore by 2030. Key risk: generational shift \u2014 18-24 year olds: 70% digital-first for news consumption, but print retains credibility advantage for serious journalism and government notices (mandatory gazette publishing).",
  },
];

export default function NewsprintPublishingLogisticsView() {
  const [tab, setTab] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");

  const filterGroups = [
    { key: "status", label: "Status", options: EDITION_STATUSES.map(s => ({ value: s, count: records.filter(rec => rec.status === s).length })) },
    { key: "category", label: "Category", options: CATEGORIES.map(c => ({ value: c, count: records.filter(rec => rec.category === c).length })) },
    { key: "zone", label: "Zone", options: ZONES.map(z => ({ value: z, count: records.filter(rec => rec.zone === z).length })) },
    { key: "mode", label: "Transport Mode", options: MODES.map(m => ({ value: m, count: records.filter(rec => rec.mode === m).length })) },
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.edition.toLowerCase().includes(q) && !r.press.toLowerCase().includes(q) && !r.title.toLowerCase().includes(q) && !r.vendor.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof EditionRecord] as string));
  });

  return (
    <div className="npl-root p-6 space-y-6">
      <PageHeader title="Newsprint Publishing Logistics" description="India print media supply chain covering 1,300+ newspapers, 46 crore daily readers, CTP platemaking, web offset presses, press van rail wagon hawker distribution, newsprint logistics and ad revenue management" />
      <div className="npl-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`npl-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-teal-700 text-white" : "text-gray-600 hover:bg-teal-50"}`}>{t}</button>))}
      </div>

      {tab === 0 && (
        <div className="npl-dash space-y-6">
          <div className="npl-kpis grid grid-cols-4 gap-4">
            {kpis.map(k => (<div key={k.l} className="npl-kpi bg-white rounded-lg border p-4"><div className="text-xs text-gray-500 npl-kpi-label">{k.l}</div><div className="text-2xl font-bold text-teal-700 npl-kpi-val">{k.v}</div><div className="text-xs text-gray-400 npl-kpi-sub">{k.s}</div></div>))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="npl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Editions Printed (Lakh Copies)</h3><BarChart data={monthlyEditions} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="english" fill="#0f766e" radius={[4,4,0,0]} name="English" /><Bar dataKey="hindi" fill="#14b8a6" radius={[4,4,0,0]} name="Hindi" /><Bar dataKey="regional" fill="#5eead4" radius={[4,4,0,0]} name="Regional" /><Bar dataKey="tabloid" fill="#99f6e4" radius={[4,4,0,0]} name="Tabloid" /></BarChart></div>
            <div className="npl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Newspaper Category Distribution</h3><PieChart width={400} height={220}><Pie data={categoryDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{categoryDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="npl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Print Efficiency (%) vs 97.5% Target</h3><LineChart data={printEfficiency} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis domain={[92, 100]} /><Tooltip /><Legend /><Line type="monotone" dataKey="actual" stroke="#0f766e" strokeWidth={2} name="Actual %" /><Line type="monotone" dataKey="target" stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" name="Target" /></LineChart></div>
            <div className="npl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Press Performance Score</h3><BarChart data={pressPerf} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis domain={[78, 100]} /><Tooltip /><Bar dataKey="v" fill="#14b8a6" radius={[4,4,0,0]} name="Score" /></BarChart></div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="npl-registry space-y-4">
          <ModuleBreadcrumb items={[{ label: "Newsprint Publishing", href: "#" }, { label: "Edition Registry", href: "#" }]} />
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="npl-table-wrap overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm"><thead><tr className="border-b bg-gray-50">{"ID,Edition,Press,Zone,Category,Title,Copies,Vendor,Mode,Print Date,ETA,Transit (h),Revenue (\u20b9L),Breaking,Status,Remarks"
                .split(",").map(h => (<th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>))}</tr></thead>
            <tbody>{filtered.map(r => {
              const rowCls = r.status === "Platemaking" || r.status === "Printing" ? "npl-row-warning bg-amber-50" : r.status === "In Transit" || r.status === "Dispatched" ? "npl-row-info bg-blue-50" : "";
              return (<tr key={r.id} className={`border-b hover:bg-teal-50/30 ${rowCls}`}>
                <td className="px-3 py-2 font-mono font-medium">{r.id}</td>
                <td className="px-3 py-2"><span className="npl-badge inline-block px-2 py-0.5 rounded text-xs bg-teal-700 text-white font-mono">{r.edition}</span></td>
                <td className="px-3 py-2 text-xs max-w-28 truncate">{r.press}</td>
                <td className="px-3 py-2"><span className="npl-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.zone}</span></td>
                <td className="px-3 py-2"><span className="npl-badge inline-block px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{r.category}</span></td>
                <td className="px-3 py-2 text-xs max-w-32 truncate">{r.title}</td>
                <td className="px-3 py-2 text-xs text-right font-semibold">{(r.copies/1000).toFixed(0)}K</td>
                <td className="px-3 py-2 text-xs max-w-24 truncate">{r.vendor}</td>
                <td className="px-3 py-2 text-xs">{r.mode}</td>
                <td className="px-3 py-2 text-xs">{r.printDate}</td>
                <td className="px-3 py-2 text-xs">{r.etaDate || <span className="text-gray-400">-</span>}</td>
                <td className="px-3 py-2"><span className={`text-xs font-semibold ${r.transitHrs > 6 ? "text-amber-600" : "text-green-600"}`}>{r.transitHrs}h</span></td>
                <td className="px-3 py-2 text-xs font-semibold text-teal-700">{r.revenueLakhs}</td>
                <td className="px-3 py-2 text-center">{r.breakingFlag ? <span className="npl-badge inline-block px-2 py-0.5 rounded text-xs bg-red-600 text-white">BRK</span> : <span className="text-gray-400">REG</span>}</td>
                <td className="px-3 py-2"><span className={`npl-badge inline-block px-2 py-0.5 rounded text-xs font-semibold ${SC[statusColor[r.status]]}`}>{r.status}</span></td>
                <td className="px-3 py-2 text-xs text-gray-500 max-w-32 truncate">{r.remarks}</td>
              </tr>);
            })}</tbody></table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="npl-analytics space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="npl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Edition Volume by Zone</h3><BarChart data={ZONES.map(z => ({ n: z.split(" ")[0], v: +ri(15, 40, 26 + Math.random() * 10).toFixed(0) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#0f766e" radius={[4,4,0,0]} name="Editions" /></BarChart></div>
            <div className="npl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Copies by Category Corridor</h3><AreaChart data={Array.from({ length: 12 }, (_, i) => ({ m: MO[i], english: ri(100, 200, 140 + Math.sin(i*0.5)*25), hindi: ri(150, 280, 210 + Math.cos(i*0.6)*30), regional: ri(80, 180, 120 + Math.sin(i*0.7)*20) }))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Area type="monotone" dataKey="english" stackId="1" stroke="#0f766e" fill="#ccfbf1" name="English" /><Area type="monotone" dataKey="hindi" stackId="1" stroke="#14b8a6" fill="#99f6e4" name="Hindi" /><Area type="monotone" dataKey="regional" stackId="1" stroke="#5eead4" fill="#f0fdfa" name="Regional" /></AreaChart></div>
          </div>
          <div className="npl-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Avg Transit Hours by Transport Mode</h3><BarChart data={[{n:"Press Van",v:3},{n:"Rail Wagon",v:8},{n:"3W Scooter",v:2},{n:"Bulker 10T",v:5},{n:"E-Rickshaw",v:1.5},{n:"Cycle Hawker",v:1}].map(d => ({...d, v: +ri(d.v-0.2, d.v+0.5, d.v + Math.random()*0.3).toFixed(1)}))} height={240}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="n" tick={{ fontSize: 9 }} /><YAxis /><Tooltip /><Bar dataKey="v" fill="#14b8a6" radius={[4,4,0,0]} name="Hours" /></BarChart></div>
        </div>
      )}

      {tab === 3 && (
        <div className="npl-insights grid grid-cols-2 gap-6">{INSIGHTS.map(ins => (<div key={ins.t} className="npl-insight bg-white rounded-lg border p-5"><h3 className="text-base font-bold text-teal-800 mb-2">{ins.t}</h3><p className="text-sm text-gray-600 leading-relaxed">{ins.c}</p></div>))}</div>
      )}
    </div>
  );
}
