'use client';
import { useState, useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value));
const C = ['#1e40af','#1d4ed8','#2563eb','#3b82f6','#60a5fa','#1e3a8a','#172554','#dbeafe'];
const PRODS = ['Floral Design Bowl Set','Mughal Motif Dinner Plate','Peacock Pattern Vase','Geometric Tile Mural','Turquoise Glazed Planter','Indigo Candle Holder Set','Cobalt Blue Tea Set','Lapis Wall Hanging Plate'];
const POTS = ['Jaipur Blue Pottery Hub','Sanganer Artisan Colony','Kot Jewar Potter Village','Nahargarh Craft Studio','Amer Blue Art Works','Kishanpole Bazaar Guild','Tripolia Bazaar Atelier','Jaipur Defence Colony'];
const STATS = ['GI Jaipur Blue Pottery','ISI Ceramic Grade A','Bubble-Wrapped Carton','Palletised Truck Transit','Dust-Free Store Room','Glaze Chip QC'];
type Rec = { id: number; product: string; potter: string; status: string; cost: number; weight: number; date: string; temp: number; };
const INSIGHTS = [
  { title: 'Jaipur — The Blue Pottery Capital of India', body: 'Jaipur\'s blue pottery tradition dates to the 14th century, introduced by Persian artisans who settled in Rajasthan under the patronage of the Rajput courts. The craft uses a unique dough of quartz powder (60%), powdered glass (10%), gum (5%), and multani mitti (fuller\'s earth 25%) instead of traditional clay, making it fired at low temperature without kiln baking initially, now modernised to 800-1000°C gas kilns. The cobalt oxide and copper oxide create signature blue and green patterns. GI-tagged Jaipur Blue Pottery registered in 2019. Over 5,000 artisan families in Jaipur district depend on blue pottery, with annual production of 8 lakh pieces valued at Rs 250 crore, exported to 30 countries.' },
  { title: 'IS 15903 Ceramic & Glaze Standards', body: 'IS 15903 specifies requirements for glazed ceramic tableware including lead and cadmium leach limits (below 0.5 mg/L for lead, 0.05 mg/L for cadmium per IS 10518). Glaze thickness must be 0.15-0.25mm for even surface coverage. Water absorption below 10% for utility pottery, below 15% for decorative pieces. Thermal shock resistance requires 3 cycles between 20°C and 120°C without cracking. Colour fastness of oxide glazes tested at 250°C for 4 hours. Food-safe glazes certified by BIS under CRS (Conformity Assessment Scheme) with mandatory lab testing every 6 months for commercial production units.' },
  { title: 'Fragile Pottery Packaging & Temperature Logistics', body: 'Blue pottery is extremely fragile (Mohs hardness 5-6 for glazed surface, 3 for body), requiring individual bubble-wrap with 5mm thickness minimum, foam corner inserts, and double-walled corrugated cartons. Maximum stack height is 5 cartons (25 kg per carton). Transport from Jaipur to Delhi (260 km) takes 6-8 hours via NH48, requiring shock-absorber-equipped trucks for fragile loads. Storage at 20-30°C and 40-60% humidity prevents glaze micro-cracking from thermal cycling. Jaipur to Mumbai port (1,150 km) for sea export requires 3-4 days. Breakage rate reduced from 18% to 3% with improved packaging under the UNIDO cluster development programme.' },
  { title: 'Digital Design & Global Export Growth', body: 'AI-powered colour matching ensures batch consistency of cobalt oxide blue across production runs, reducing colour variance from 15% to 2% using spectrophotometer calibration. Digital pottery printers create stencils for complex Mughal floral patterns, cutting design time from 8 hours to 45 minutes per piece. India\'s blue pottery export from Jaipur grew 220% from Rs 35 crore (2019) to Rs 112 crore (2025), targeting Rs 250 crore by 2028. EU and US are primary markets with retail pricing of $25-150 per piece. E-commerce platforms (Amazon Handmade, Etsy) account for 35% of new export orders, with average order value of $85 for multi-piece dinner sets.' },
];
const FG = [
  { key: 'status', label: 'Status', options: STATS },
  { key: 'potter', label: 'Potter Cluster', options: POTS },
  { key: 'product', label: 'Product', options: PRODS },
];
const gen = (s: number): Rec[] => Array.from({ length: 20 }, (_, i) => { const id = s + i; return { id, product: PRODS[id % 8], potter: POTS[id % 8], status: STATS[id % 6], cost: ri(200, 4500, 800 + (id * 137) % 3700), weight: ri(0.5, 12, 1 + (id * 53) % 1100 / 100), date: `2025-${String(ri(1, 12, (id * 7) % 12 + 1)).padStart(2, '0')}-${String(ri(1, 28, (id * 13) % 28 + 1)).padStart(2, '0')}`, temp: ri(800, 1000, 850 + (id * 23) % 150) }; });
const H: Rec[] = [
  { id: 1, product: 'Floral Design Bowl Set', potter: 'Jaipur Blue Pottery Hub', status: 'GI Jaipur Blue Pottery', cost: 1200, weight: 2.4, date: '2025-01-15', temp: 900 },
  { id: 2, product: 'Mughal Motif Dinner Plate', potter: 'Sanganer Artisan Colony', status: 'ISI Ceramic Grade A', cost: 1800, weight: 1.8, date: '2025-01-22', temp: 920 },
  { id: 3, product: 'Peacock Pattern Vase', potter: 'Kot Jewar Potter Village', status: 'Bubble-Wrapped Carton', cost: 3500, weight: 4.2, date: '2025-02-03', temp: 880 },
  { id: 4, product: 'Geometric Tile Mural', potter: 'Nahargarh Craft Studio', status: 'Palletised Truck Transit', cost: 4200, weight: 8.5, date: '2025-02-14', temp: 950 },
  { id: 5, product: 'Turquoise Glazed Planter', potter: 'Amer Blue Art Works', status: 'Dust-Free Store Room', cost: 980, weight: 3.6, date: '2025-02-28', temp: 860 },
  { id: 6, product: 'Indigo Candle Holder Set', potter: 'Kishanpole Bazaar Guild', status: 'Glaze Chip QC', cost: 750, weight: 1.2, date: '2025-03-05', temp: 910 },
  { id: 7, product: 'Cobalt Blue Tea Set', potter: 'Tripolia Bazaar Atelier', status: 'GI Jaipur Blue Pottery', cost: 2800, weight: 3.8, date: '2025-03-12', temp: 940 },
  { id: 8, product: 'Lapis Wall Hanging Plate', potter: 'Jaipur Defence Colony', status: 'ISI Ceramic Grade A', cost: 1650, weight: 2.1, date: '2025-03-20', temp: 870 },
  { id: 9, product: 'Floral Design Bowl Set', potter: 'Nahargarh Craft Studio', status: 'Bubble-Wrapped Carton', cost: 1100, weight: 2.4, date: '2025-04-01', temp: 900 },
  { id: 10, product: 'Peacock Pattern Vase', potter: 'Jaipur Blue Pottery Hub', status: 'Palletised Truck Transit', cost: 3200, weight: 3.9, date: '2025-04-10', temp: 930 },
  { id: 11, product: 'Mughal Motif Dinner Plate', potter: 'Amer Blue Art Works', status: 'Dust-Free Store Room', cost: 1950, weight: 1.7, date: '2025-04-18', temp: 890 },
  { id: 12, product: 'Cobalt Blue Tea Set', potter: 'Sanganer Artisan Colony', status: 'GI Jaipur Blue Pottery', cost: 2600, weight: 4.0, date: '2025-05-02', temp: 960 },
  { id: 13, product: 'Geometric Tile Mural', potter: 'Kishanpole Bazaar Guild', status: 'Glaze Chip QC', cost: 4400, weight: 9.2, date: '2025-05-15', temp: 850 },
  { id: 14, product: 'Turquoise Glazed Planter', potter: 'Tripolia Bazaar Atelier', status: 'ISI Ceramic Grade A', cost: 890, weight: 3.4, date: '2025-05-22', temp: 910 },
  { id: 15, product: 'Indigo Candle Holder Set', potter: 'Kot Jewar Potter Village', status: 'Bubble-Wrapped Carton', cost: 680, weight: 1.0, date: '2025-06-01', temp: 880 },
  { id: 16, product: 'Lapis Wall Hanging Plate', potter: 'Jaipur Defence Colony', status: 'Palletised Truck Transit', cost: 1500, weight: 2.3, date: '2025-06-10', temp: 940 },
  { id: 17, product: 'Floral Design Bowl Set', potter: 'Jaipur Blue Pottery Hub', status: 'Dust-Free Store Room', cost: 1350, weight: 2.6, date: '2025-06-18', temp: 900 },
  { id: 18, product: 'Peacock Pattern Vase', potter: 'Sanganer Artisan Colony', status: 'Glaze Chip QC', cost: 3800, weight: 4.5, date: '2025-07-02', temp: 920 },
  { id: 19, product: 'Cobalt Blue Tea Set', potter: 'Nahargarh Craft Studio', status: 'GI Jaipur Blue Pottery', cost: 2900, weight: 3.7, date: '2025-07-15', temp: 950 },
  { id: 20, product: 'Mughal Motif Dinner Plate', potter: 'Amer Blue Art Works', status: 'ISI Ceramic Grade A', cost: 1700, weight: 1.9, date: '2025-07-28', temp: 870 },
];
const ALL: Rec[] = [...H, ...gen(21), ...gen(41)];
const PB = ({ p }: { p: string }) => <span className="bpj-pb" style={{ background: C[PRODS.indexOf(p) % C.length], color: '#fff', padding: '2px 10px', borderRadius: 12, fontSize: 12, whiteSpace: 'nowrap' }}>{p}</span>;
const SB = ({ s }: { s: string }) => { const i = STATS.indexOf(s); return <span className="bpj-sb" style={{ background: C[i % C.length], color: i % C.length === 7 ? '#1e3a8a' : '#fff', padding: '2px 10px', borderRadius: 12, fontSize: 12, whiteSpace: 'nowrap' }}>{s}</span>; };
const CostBar = ({ v }: { v: number }) => { const pct = ri(0, 100, v / 4500 * 100); return <div className="bpj-cb"><div className="bpj-cb-fill" style={{ width: `${pct}%`, background: C[0] }} /><span className="bpj-cb-lbl">₹{v.toLocaleString()}</span></div>; };
const HealthRing = ({ value: v, label: l }: { value: number; label: string }) => { const r = ri(0, 100, v), circ = 2 * Math.PI * 40, off = circ - r / 100 * circ; return <div className="bpj-hr"><svg width={100} height={100}><circle cx={50} cy={50} r={40} fill="none" stroke="#e5e7eb" strokeWidth={8} /><circle cx={50} cy={50} r={40} fill="none" stroke={C[0]} strokeWidth={8} strokeDasharray={circ} strokeDashoffset={off} transform="rotate(-90 50 50)" /><text x={50} y={55} textAnchor="middle" fontSize={16} fontWeight="bold" fill={C[0]}>{r}%</text></svg><span className="bpj-hr-lbl">{l}</span></div>; };
const KpiTile = ({ label: l, value: v, icon: ic }: { label: string; value: string; icon: string }) => <div className="bpj-kpi"><span className="bpj-kpi-ic">{ic}</span><span className="bpj-kpi-v">{v}</span><span className="bpj-kpi-l">{l}</span></div>;
const ValueTile = ({ label: l, value: v }: { label: string; value: string }) => <div className="bpj-vt"><span className="bpj-vt-l">{l}</span><span className="bpj-vt-v">{v}</span></div>;
const SearchFilterToolbar = ({ searchQuery, onSearchChange, onClearSearch, activeFilters, filterGroups, onToggleFilter, onClearAllFilters, totalItems, filteredCount, onRefresh, placeholder }: {
  searchQuery: string; onSearchChange: (v: string) => void; onClearSearch: () => void;
  activeFilters: [string, string[]][]; filterGroups: typeof FG;
  onToggleFilter: (g: string, v: string) => void; onClearAllFilters: () => void;
  totalItems: number; filteredCount: number; onRefresh: () => void; placeholder: string;
}) => (<>
  <div className="bpj-tb-bar">
    <input className="bpj-search" placeholder={placeholder} value={searchQuery} onChange={e => onSearchChange(e.target.value)} />
    {searchQuery && <button className="bpj-clr" onClick={onClearSearch}>✕</button>}
    {activeFilters.length > 0 && <button className="bpj-clr" onClick={onClearAllFilters}>Clear All</button>}
    <button className="bpj-fbtn" onClick={onRefresh}>↻ Refresh</button>
    <span className="bpj-info">{filteredCount} of {totalItems} records</span>
  </div>
  {filterGroups.map(g => (
    <div className="bpj-fsec" key={g.key}>
      <div className="bpj-flbl">{g.label}</div>
      <div className="bpj-fpills">
        {g.options.map(o => (
          <button key={o} className={`bpj-fbtn ${activeFilters.some(f => f[0] === g.key && f[1].includes(o)) ? 'on' : ''}`} onClick={() => onToggleFilter(g.key, o)}>{o}</button>
        ))}
      </div>
    </div>
  ))}
</>);
export default function BluePotteryJaipurLogisticsView() {
  const [tab, setTab] = useState('dashboard');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const filtered = useMemo(() => ALL.filter(r => {
    if (search && !r.product.toLowerCase().includes(search.toLowerCase()) && !r.potter.toLowerCase().includes(search.toLowerCase())) return false;
    return Object.entries(filters).every(([k, vs]) => vs.length === 0 || vs.includes(r[k as keyof Rec] as string));
  }), [search, filters]);
  const af: [string, string[]][] = Object.entries(filters).filter(([, v]) => v.length > 0);
  const toggle = (g: string, v: string) => setFilters(p => ({ ...p, [g]: p[g]?.includes(v) ? p[g].filter(x => x !== v) : [...(p[g] || []), v] }));
  const clearAll = () => setFilters({});
  const refresh = () => { setSearch(''); setFilters({}); setTab('dashboard'); };
  const kpis = [
    { label: 'Total Shipments', value: ALL.length.toString(), icon: '📦' },
    { label: 'GI Tagged Pieces', value: ALL.filter(r => r.status === 'GI Jaipur Blue Pottery').length.toString(), icon: '🏷️' },
    { label: 'Avg Firing Temp', value: `${Math.round(ALL.reduce((a, r) => a + r.temp, 0) / ALL.length)}°C`, icon: '🔥' },
    { label: 'Total Value', value: `₹${ALL.reduce((a, r) => a + r.cost, 0).toLocaleString()}`, icon: '💰' },
  ];
  const vals = [
    { label: 'Avg Cost/Piece', value: `₹${Math.round(ALL.reduce((a, r) => a + r.cost, 0) / ALL.length)}` },
    { label: 'Avg Weight', value: `${(ALL.reduce((a, r) => a + r.weight, 0) / ALL.length).toFixed(1)} kg` },
    { label: 'Potter Clusters', value: POTS.length.toString() },
    { label: 'Product Lines', value: PRODS.length.toString() },
  ];
  const hrs = [
    { label: 'GI Compliance', value: Math.round(ALL.filter(r => r.status === 'GI Jaipur Blue Pottery').length / ALL.length * 100) },
    { label: 'ISI Certified', value: Math.round(ALL.filter(r => r.status === 'ISI Ceramic Grade A').length / ALL.length * 100) },
    { label: 'Packaging Ready', value: Math.round(ALL.filter(r => r.status === 'Bubble-Wrapped Carton').length / ALL.length * 100) },
    { label: 'In Transit', value: Math.round(ALL.filter(r => r.status === 'Palletised Truck Transit').length / ALL.length * 100) },
    { label: 'Stored Safely', value: Math.round(ALL.filter(r => r.status === 'Dust-Free Store Room').length / ALL.length * 100) },
    { label: 'QC Passed', value: 100 - Math.round(ALL.filter(r => r.status === 'Glaze Chip QC').length / ALL.length * 100) },
  ];
  const monthlyData = useMemo(() => { const m: Record<string, { shipments: number; revenue: number }> = {}; ALL.forEach(r => { const k = r.date.slice(0, 7); if (!m[k]) m[k] = { shipments: 0, revenue: 0 }; m[k].shipments++; m[k].revenue += r.cost; }); return Object.entries(m).sort(([a], [b]) => a.localeCompare(b)).map(([month, v]) => ({ month, ...v })); }, []);
  const statusPie = useMemo(() => STATS.map(s => ({ name: s, value: ALL.filter(r => r.status === s).length })), []);
  const potterBar = useMemo(() => POTS.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), pieces: ALL.filter(r => r.potter === p).length, revenue: ALL.filter(r => r.potter === p).reduce((a, r) => a + r.cost, 0) })), []);
  return (
    <div className="bpj-root">
      <style>{`
        .bpj-root { font-family: system-ui, -apple-system, sans-serif; padding: 24px; max-width: 1400px; margin: 0 auto; background: linear-gradient(135deg, #f8fafc, #eff6ff); min-height: 100vh; }
        .bpj-bc { display: flex; gap: 6px; align-items: center; font-size: 13px; color: #64748b; margin-bottom: 8px; }
        .bpj-bc a { color: #1e40af; text-decoration: none; } .bpj-bc a:hover { text-decoration: underline; }
        .bpj-hd { font-size: 28px; font-weight: 800; color: #1e40af; margin-bottom: 4px; }
        .bpj-sub { color: #64748b; font-size: 14px; margin-bottom: 20px; }
        .bpj-tabs { display: flex; gap: 0; border-bottom: 2px solid #e2e8f0; margin-bottom: 24px; }
        .bpj-tab { padding: 10px 20px; cursor: pointer; font-weight: 600; color: #64748b; border: none; border-bottom: 2px solid transparent; margin-bottom: -2px; background: none; font-size: 14px; }
        .bpj-tab:hover { color: #1e40af; }
        .bpj-tab.on { color: #1e40af; border-bottom-color: #1e40af; }
        .bpj-kpi-g { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
        .bpj-kpi { background: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); display: flex; flex-direction: column; gap: 4px; border-left: 4px solid #1e40af; }
        .bpj-kpi-ic { font-size: 24px; } .bpj-kpi-v { font-size: 24px; font-weight: 800; color: #1e40af; }
        .bpj-kpi-l { font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
        .bpj-hr-g { display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px; margin-bottom: 24px; }
        .bpj-hr { display: flex; flex-direction: column; align-items: center; gap: 6px; } .bpj-hr-lbl { font-size: 11px; color: #475569; text-align: center; font-weight: 500; }
        .bpj-vt-g { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
        .bpj-vt { background: #fff; border-radius: 12px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); text-align: center; }
        .bpj-vt-l { display: block; font-size: 12px; color: #64748b; margin-bottom: 4px; } .bpj-vt-v { display: block; font-size: 20px; font-weight: 700; color: #1e40af; }
        .bpj-tb-bar { display: flex; gap: 12px; align-items: center; margin-bottom: 16px; flex-wrap: wrap; }
        .bpj-search { padding: 8px 16px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; width: 280px; outline: none; }
        .bpj-search:focus { border-color: #1e40af; box-shadow: 0 0 0 3px rgba(30,64,175,0.1); }
        .bpj-fbtn { padding: 6px 12px; border: 1px solid #cbd5e1; border-radius: 6px; background: #fff; cursor: pointer; font-size: 12px; color: #475569; }
        .bpj-fbtn:hover { background: #dbeafe; } .bpj-fbtn.on { background: #1e40af; color: #fff; border-color: #1e40af; }
        .bpj-clr { padding: 6px 14px; border: 1px solid #ef4444; border-radius: 6px; background: #fff; color: #ef4444; cursor: pointer; font-size: 12px; }
        .bpj-info { font-size: 12px; color: #64748b; margin-left: auto; }
        .bpj-fsec { margin-bottom: 12px; } .bpj-flbl { font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; margin-bottom: 6px; }
        .bpj-fpills { display: flex; gap: 6px; flex-wrap: wrap; }
        .bpj-pb { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 12px; color: #fff; white-space: nowrap; }
        .bpj-sb { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 12px; white-space: nowrap; }
        .bpj-cb { position: relative; width: 120px; height: 20px; background: #e2e8f0; border-radius: 10px; overflow: hidden; }
        .bpj-cb-fill { height: 100%; border-radius: 10px; transition: width 0.3s; }
        .bpj-cb-lbl { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); font-size: 10px; font-weight: 600; color: #fff; }
        .bpj-twrap { overflow-x: auto; background: #fff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .bpj-tbl { width: 100%; border-collapse: collapse; font-size: 13px; }
        .bpj-tbl th { background: #1e40af; color: #fff; padding: 12px 14px; text-align: left; font-weight: 600; white-space: nowrap; }
        .bpj-tbl td { padding: 10px 14px; border-bottom: 1px solid #f1f5f9; }
        .bpj-tbl tr:hover td { background: #eff6ff; }
        .bpj-cg { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
        .bpj-cc { background: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .bpj-ct { font-size: 15px; font-weight: 700; color: #1e40af; margin-bottom: 16px; }
        .bpj-ig { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .bpj-ic { background: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-top: 4px solid #1e40af; }
        .bpj-it { font-size: 17px; font-weight: 700; color: #1e40af; margin-bottom: 12px; }
        .bpj-ib { font-size: 14px; line-height: 1.7; color: #334155; }
      `}</style>
      <nav className="bpj-bc"><a href="/">Home</a><span> / </span><a href="/modules">Modules</a><span> / </span><span>Blue Pottery Jaipur</span></nav>
      <h1 className="bpj-hd">🔰 Blue Pottery Jaipur Logistics</h1>
      <p className="bpj-sub">Track Jaipur's iconic blue pottery from wheel to global market — GI-tagged, ISI-certified artisan heritage</p>
      <div className="bpj-tabs">
        {['Dashboard', 'Shipments', 'Analytics', 'Insights'].map(t => (
          <button key={t} className={`bpj-tab ${tab === t.toLowerCase() ? 'on' : ''}`} onClick={() => setTab(t.toLowerCase())}>{t}</button>
        ))}
      </div>
      {tab === 'dashboard' && (
        <>
          <div className="bpj-kpi-g">{kpis.map((k, i) => <KpiTile key={i} {...k} />)}</div>
          <div className="bpj-hr-g">{hrs.map((h, i) => <HealthRing key={i} {...h} />)}</div>
          <div className="bpj-vt-g">{vals.map((v, i) => <ValueTile key={i} {...v} />)}</div>
        </>
      )}
      {tab === 'shipments' && (
        <>
          <SearchFilterToolbar
            searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch('')}
            activeFilters={af} filterGroups={FG} onToggleFilter={toggle} onClearAllFilters={clearAll}
            totalItems={ALL.length} filteredCount={filtered.length} onRefresh={refresh}
            placeholder="Search products, potters..."
          />
          <div className="bpj-twrap">
            <table className="bpj-tbl">
              <thead><tr><th>ID</th><th>Product</th><th>Potter</th><th>Status</th><th>Cost</th><th>Weight</th><th>Temp</th><th>Date</th></tr></thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td><PB p={r.product} /></td>
                    <td>{r.potter}</td>
                    <td><SB s={r.status} /></td>
                    <td><CostBar v={r.cost} /></td>
                    <td>{r.weight} kg</td>
                    <td>{r.temp}°C</td>
                    <td>{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {tab === 'analytics' && (
        <>
          <div className="bpj-cg">
            <div className="bpj-cc">
              <div className="bpj-ct">Monthly Shipments & Revenue</div>
              <LineChart width={500} height={280} data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="shipments" stroke="#1e40af" strokeWidth={2} />
                <Line type="monotone" dataKey="revenue" stroke="#60a5fa" strokeWidth={2} />
              </LineChart>
            </div>
            <div className="bpj-cc">
              <div className="bpj-ct">Status Distribution</div>
              <PieChart width={500} height={280}>
                <Pie data={statusPie} cx="50%" cy="50%" outerRadius={100} dataKey="value" label fontSize={10}>
                  {statusPie.map((_, i) => <Cell key={i} fill={C[i % C.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          </div>
          <div className="bpj-cc">
            <div className="bpj-ct">Potter Cluster Production</div>
            <BarChart width={1000} height={300} data={potterBar}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={10} angle={-30} textAnchor="end" height={60} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Legend />
              <Bar dataKey="pieces" fill="#1e40af" radius={[4, 4, 0, 0]} />
              <Bar dataKey="revenue" fill="#60a5fa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </div>
        </>
      )}
      {tab === 'insights' && (
        <div className="bpj-ig">
          {INSIGHTS.map((ins, i) => (
            <div className="bpj-ic" key={i}>
              <div className="bpj-it">{ins.title}</div>
              <div className="bpj-ib">{ins.body}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
