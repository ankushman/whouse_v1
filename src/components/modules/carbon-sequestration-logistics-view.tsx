'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface CSLRecord {
  id: string;
  projectId: string;
  state: string;
  site: string;
  operator: string;
  method: string;
  areaHectares: number;
  co2SequesteredTPA: number;
  investmentCr: number;
  status: string;
  priority: string;
  origin: string;
  destination: string;
  shipDate: string;
  transitDays: number;
  zone: string;
  remarks: string;
}

const records: CSLRecord[] = [
  { id: 'CSL-0001', projectId: 'CSL-M26MH1', state: 'Maharashtra', site: 'Mumbai Mangrove Carbon Park', operator: 'MCZMA + Tata Power', method: 'Mangrove Afforestation + Blue Carbon', areaHectares: 2500, co2SequesteredTPA: 45000, investmentCr: 185, status: 'In Transit', priority: 'Critical', origin: 'MCZMA Mumbai HQ', destination: 'Gorai Mangrove Site', shipDate: '2026-07-28', transitDays: 1, zone: 'West', remarks: 'Mumbai&apos;s largest mangrove carbon sequestration project at 2,500 ha across Gorai, Versova and Thane creeks &#8594; 45,000 TPA CO2 sequestration. Mangrove blue carbon credits at &#8377;1,200/tonne generate &#8377;54Cr annual carbon revenue. &#8377;185Cr investment with 3.4-year payback. MCZMA-Tata Power partnership prevents mangrove destruction from encroachment &#8594; protecting 1.2 crore Mumbaikars from coastal flooding. Mumbai mangroves store 52 lakh tonnes of carbon &#8594; worth &#8377;6,240Cr at current carbon prices' },
  { id: 'CSL-0002', projectId: 'CSL-R26RJ1', state: 'Rajasthan', site: 'Jodhpur Desert Afforestation Belt', operator: 'CAZRI + IFFCO', method: 'Arid Zone Afforestation + Biochar', areaHectares: 5000, co2SequesteredTPA: 28000, investmentCr: 220, status: 'Delivered', priority: 'Critical', origin: 'CAZRI Jodhpur', destination: 'Osiyan Desert Belt Site', shipDate: '2026-07-10', transitDays: 2, zone: 'North', remarks: 'Rajasthan&apos;s Thar desert carbon sequestration belt &#8594; 5,000 ha afforestation with CAZRI-developed drought-resistant species (Prosopis, Acacia, Ziziphus) plus biochar soil amendment. 28,000 TPA CO2 sequestration &#8594; &#8377;220Cr investment. Biochar from agricultural waste converts 20,000 tonnes/year into stable carbon &#8594; soil carbon retention for 1,000+ years. IFFCO partnership adds biochar to 50,000 ha farmland improving soil fertility by 40% &#8594; dual carbon and agricultural benefit' },
  { id: 'CSL-0003', projectId: 'CSL-A26AP1', state: 'Andhra Pradesh', site: 'Vizag Coastal Mangrove Reserve', operator: 'AP Forest Dept + WAPCOS', method: 'Mangrove Restoration + Tidal Wetland', areaHectares: 3200, co2SequesteredTPA: 52000, investmentCr: 245, status: 'Processing', priority: 'High', origin: 'AP Forest Visakhapatnam', destination: 'Kakinada Mangrove Reserve', shipDate: '2026-08-01', transitDays: 2, zone: 'South', remarks: 'AP&apos;s East Godavari mangrove restoration &#8594; 3,200 ha in Kakinada and Bhimavaram tidal wetlands. 52,000 TPA CO2 sequestration &#8594; India&apos;s highest single-site blue carbon project. &#8377;245Cr investment restoring mangroves lost to aquaculture shrimp farms. WAPCOS hydrological engineering restores tidal flow patterns &#8594; mangrove survival rate improved from 40% to 85%. Kakinada mangrove biodiversity includes 120 bird species &#8594; eco-tourism generates additional &#8377;8Cr/yr revenue' },
  { id: 'CSL-0004', projectId: 'CSL-K26KA1', state: 'Karnataka', site: 'Western Ghats Forest Carbon Reserve', operator: 'KFD + IISc', method: 'Tropical Forest Protection + REDD+', areaHectares: 15000, co2SequesteredTPA: 180000, investmentCr: 380, status: 'Delivered', priority: 'High', origin: 'KFD Bengaluru', destination: 'Kudremukh Reserve', shipDate: '2026-07-08', transitDays: 2, zone: 'South', remarks: 'Karnataka Western Ghats REDD+ carbon reserve &#8594; 15,000 ha protected forest preventing deforestation. 180,000 TPA CO2 sequestration through avoided emissions &#8594; India&apos;s largest forest carbon project. &#8377;380Cr investment with Verra VCS-certified carbon credits at &#8377;1,400/tonne. IISc continuous carbon monitoring with LiDAR and flux towers &#8594; real-time forest carbon stock assessment. Kudremukh biodiversity hotspot protects 1,800 endemic species &#8594; carbon conservation linked to biodiversity protection' },
  { id: 'CSL-0005', projectId: 'CSL-U26UP1', state: 'Uttar Pradesh', site: 'Terai Forest Carbon Sink Project', operator: 'UP Forest + TERI', method: 'Mixed Forest Afforestation + Agroforestry', areaHectares: 8000, co2SequesteredTPA: 96000, investmentCr: 310, status: 'In Transit', priority: 'High', origin: 'UP Forest Lucknow', destination: 'Katerniaghat Terai Site', shipDate: '2026-07-26', transitDays: 2, zone: 'North', remarks: 'UP Terai belt afforestation &#8594; 8,000 ha of mixed forest (Sal, Teak, Shisham) plus agroforestry strips with farmers. 96,000 TPA CO2 sequestration &#8594; &#8377;310Cr investment. TERI-designed agroforestry model pays 50,000 farmers &#8377;15,000/ha/year for maintaining tree cover on farmland &#8594; dual carbon sequestration and livelihood support. Terai&apos;s fertile alluvial soil achieves 3x faster tree growth than national average. Project aligns with UP&apos;s 25% forest cover target from current 9% &#8594; adding 1.6M ha by 2030' },
  { id: 'CSL-0006', projectId: 'CSL-M26MP1', state: 'Madhya Pradesh', site: 'Panna Tiger Reserve Carbon Project', operator: 'MP Forest + WWF India', method: 'Tiger Habitat Restoration + Forest Carbon', areaHectares: 12000, co2SequesteredTPA: 150000, investmentCr: 290, status: 'Delivered', priority: 'High', origin: 'MP Forest Bhopal', destination: 'Panna Reserve Buffer Zone', shipDate: '2026-07-14', transitDays: 2, zone: 'North', remarks: 'MP Panna Tiger Reserve carbon project &#8594; 12,000 ha buffer zone restoration connecting Panna with Bandhavgarh corridor. 150,000 TPA CO2 sequestration &#8594; &#8377;290Cr investment. WWF India wildlife-carbon linkage model where tiger conservation generates carbon credits &#8594; Panna tiger population recovered from 0 (2009) to 75 (2026). Forest carbon monitoring with satellite-GIS integration &#8594; Verra and Gold Standard dual certification. Eco-tourism + carbon revenue of &#8377;45Cr/yr funds reserve management' },
  { id: 'CSL-0007', projectId: 'CSL-G26GJ1', state: 'Gujarat', site: 'Gir Forest Carbon + Lion Habitat', operator: 'Gujarat Forest + GEF', method: 'Dry Deciduous Forest Protection + Grazing Management', areaHectares: 10000, co2SequesteredTPA: 110000, investmentCr: 260, status: 'Delivered', priority: 'High', origin: 'Gujarat Forest Gandhinagar', destination: 'Gir National Park Buffer', shipDate: '2026-07-12', transitDays: 1, zone: 'West', remarks: 'Gujarat Gir Forest carbon project &#8594; 10,000 ha protecting Asiatic lion habitat and dry deciduous forest. 110,000 TPA CO2 sequestration &#8594; &#8377;260Cr investment. GEF-funded program manages cattle grazing pressure around Gir &#8594; forest regeneration increases lion prey base (chital, sambar) by 30%. Gujarat&apos;s 674 lions (2026 census) now spill beyond Gir into 5 satellite habitats &#8594; carbon corridor connects them. Maldhari pastoralist communities receive &#8377;8,000/family/yr for livestock-free grazing zones' },
  { id: 'CSL-0008', projectId: 'CSL-T26TN1', state: 'Tamil Nadu', site: 'Cauvery Delta Wetland Carbon', operator: 'TN Forest + Anna University', method: 'Wetland Restoration + Paddy Carbon', areaHectares: 6000, co2SequesteredTPA: 42000, investmentCr: 175, status: 'In Transit', priority: 'Medium', origin: 'TN Forest Chennai', destination: 'Pichavaram Wetland Site', shipDate: '2026-07-25', transitDays: 2, zone: 'South', remarks: 'TN Cauvery delta wetland carbon project &#8594; 6,000 ha restoring Pichavaram and Muthupet mangrove-wetland complexes. 42,000 TPA CO2 sequestration &#8594; &#8377;175Cr investment. Anna University-developed carbon-positive paddy cultivation &#8594; SRI rice method sequesters 2.5 tCO2/ha/yr in soil while reducing methane emissions by 40%. India&apos;s first wetland carbon project combining blue carbon with agricultural soil carbon &#8594; dual VCS certification. Pichavaram is India&apos;s second-largest mangrove forest &#8594; 1,100 ha of restored mangroves generate &#8377;13Cr/yr carbon credits' },
  { id: 'CSL-0009', projectId: 'CSL-H26HR1', state: 'Haryana', site: 'Aravalli Ridge Carbon Afforestation', operator: 'Haryana Forest + IARI', method: 'Ridge Restoration + Urban Carbon Sink', areaHectares: 3500, co2SequesteredTPA: 35000, investmentCr: 145, status: 'Delivered', priority: 'Medium', origin: 'Haryana Forest Panchkula', destination: 'Aravalli Gurugram Ridge', shipDate: '2026-07-08', transitDays: 1, zone: 'North', remarks: 'Haryana Aravalli ridge afforestation &#8594; 3,500 ha restoring degraded Aravalli hills in Gurugram-Faridabad-Panchkula belt. 35,000 TPA CO2 sequestration &#8594; &#8377;145Cr investment. IARI-developed native Aravalli species (Dhau, Kadam, Neem) achieve 85% survival in semi-arid conditions. Urban carbon sink for NCR&apos;s 5 crore population &#8594; reducing PM2.5 by absorbing 12,000 tonnes of particulate matter annually. Aravalli is India&apos;s oldest mountain range &#8594; Supreme Court-protected area now gaining carbon revenue for Haryana' },
  { id: 'CSL-0010', projectId: 'CSL-O26OR1', state: 'Odisha', site: 'Chilika Lake Wetland Carbon Reserve', operator: 'Chilika Dev Authority + NIO', method: 'Lagoon Wetland Conservation + Seagrass', areaHectares: 4500, co2SequesteredTPA: 58000, investmentCr: 195, status: 'Delivered', priority: 'Medium', origin: 'CDA Bhubaneswar', destination: 'Chilika Lake Southern Sector', shipDate: '2026-07-12', transitDays: 2, zone: 'East', remarks: 'Odisha Chilika Lake carbon project &#8594; 4,500 ha protecting Asia&apos;s largest brackish water lagoon. 58,000 TPA CO2 sequestration from mangroves, seagrass beds and algae &#8594; &#8377;195Cr investment. NIO-developed blue carbon methodology measures sediment carbon accumulation at 1.2 tC/ha/yr. Chilika supports 230 bird species including flamingos &#8594; Ramsar Wetland carbon credits premium at &#8377;1,800/tonne. Fisheries-dependent 200,000 people benefit from ecosystem restoration &#8594; fish catch increased 35% since 2024' },
  { id: 'CSL-0011', projectId: 'CSL-W26WB1', state: 'West Bengal', site: 'Sundarbans Tiger Carbon Reserve', operator: 'WB Forest + IUCN', method: 'Mangrove + Estuarine Blue Carbon', areaHectares: 8000, co2SequesteredTPA: 95000, investmentCr: 340, status: 'In Transit', priority: 'Medium', origin: 'WB Forest Kolkata', destination: 'Sundarbans Buffer Reserve', shipDate: '2026-07-24', transitDays: 2, zone: 'East', remarks: 'WB Sundarbans carbon reserve &#8594; 8,000 ha protecting world&apos;s largest mangrove forest. 95,000 TPA CO2 sequestration &#8594; &#8377;340Cr investment. IUCN-redlisted Sundarbans tiger habitat generates premium carbon credits at &#8377;2,200/tonne &#8594; reflecting biodiversity co-benefits. Estuarine blue carbon methodology accounts for tidal sediment trapping &#8594; 3.5 tC/ha/yr in Sundarbans sediment. 4.5 crore people in Sundarbans delta protected from cyclone storm surge by intact mangrove belt &#8594; saving &#8377;500Cr in annual flood damage' },
  { id: 'CSL-0012', projectId: 'CSL-S26SK1', state: 'Sikkim', site: 'Khanchendzonga Alpine Carbon Project', operator: 'Sikkim Forest + WWF India', method: 'Alpine Forest Protection + Soil Carbon', areaHectares: 7500, co2SequesteredTPA: 68000, investmentCr: 165, status: 'Delivered', priority: 'Medium', origin: 'Sikkim Forest Gangtok', destination: 'Khanchendzonga NP Buffer', shipDate: '2026-07-08', transitDays: 3, zone: 'East', remarks: 'Sikkim Khanchendzonga alpine carbon project &#8594; 7,500 ha protecting Himalayan alpine and subalpine forests at 2,000-4,000m elevation. 68,000 TPA CO2 sequestration including 25,000 TPA from permafrost and glacial soil carbon protection. &#8377;165Cr investment &#8594; India&apos;s first high-altitude carbon project. WWF India Himalayan programme protects snow leopard and red panda habitats alongside carbon stocks. Sikkim is India&apos;s first fully organic state &#8594; soil carbon sequestration enhanced by zero-chemical agriculture in buffer zones' },
  { id: 'CSL-0013', projectId: 'CSL-J26JH1', state: 'Jharkhand', site: 'Saranda Forest Mine Rehabilitation Carbon', operator: 'Jharkhand Forest + SAIL', method: 'Mine Spoil Afforestation + Biochar', areaHectares: 4000, co2SequesteredTPA: 38000, investmentCr: 155, status: 'Delivered', priority: 'Medium', origin: 'Jharkhand Forest Ranchi', destination: 'Saranda Iron Ore Belt', shipDate: '2026-07-12', transitDays: 2, zone: 'East', remarks: 'Jharkhand Saranda mine rehabilitation carbon project &#8594; 4,000 ha afforesting iron ore mine spoil dumps with native sal and mahua. 38,000 TPA CO2 sequestration &#8594; &#8377;155Cr investment. SAIL partnership rehabilitates 12 closed iron ore mines &#8594; biochar from mine overburden converts toxic waste into stable carbon. Saranda is India&apos;s largest contiguous sal forest (82,000 ha) &#8594; mine restoration reconnects fragmented corridors for elephants. Carbon credits fund tribal community livelihoods &#8594; 15,000 Santhal families receive &#8377;12,000/year for forest maintenance' },
  { id: 'CSL-0014', projectId: 'CSL-N26NE1', state: 'Nagaland', site: 'Dzukou Valley Cloud Forest Carbon', operator: 'Nagaland Forest + TISS', method: 'Cloud Forest Conservation + Community Forestry', areaHectares: 5500, co2SequesteredTPA: 72000, investmentCr: 125, status: 'Delivered', priority: 'Medium', origin: 'Nagaland Forest Kohima', destination: 'Dzukou Valley Reserve', shipDate: '2026-07-12', transitDays: 3, zone: 'East', remarks: 'Nagaland Dzukou Valley cloud forest carbon project &#8594; 5,500 ha protecting subtropical cloud forests at 2,450m elevation. 72,000 TPA CO2 sequestration &#8594; India&apos;s highest per-hectare rate at 13.1 tCO2/ha/yr due to rapid cloud forest growth. &#8377;125Cr investment &#8594; TISS-designed community forestry model pays Naga tribes &#8377;18,000/ha/yr for forest stewardship. Dzukou&apos;s endemic lily and rhododendron species create premium biodiversity carbon credits at &#8377;2,500/tonne. Northeast India&apos;s 85% forest cover potential for &#8377;5,000Cr annual carbon revenue by 2030' },
];

const COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#047857', '#065f46', '#064e3b', '#022c22'];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 4 }, { value: 'Delivered', count: 9 }, { value: 'Processing', count: 1 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 2 }, { value: 'High', count: 5 }, { value: 'Medium', count: 7 },
  ]},
  { label: 'Method', key: 'method', options: [
    { value: 'Mangrove Afforestation + Blue Carbon', count: 1 }, { value: 'Arid Zone Afforestation + Biochar', count: 1 }, { value: 'Mangrove Restoration + Tidal Wetland', count: 1 }, { value: 'Tropical Forest Protection + REDD+', count: 1 }, { value: 'Mixed Forest Afforestation + Agroforestry', count: 1 }, { value: 'Tiger Habitat Restoration + Forest Carbon', count: 1 }, { value: 'Dry Deciduous Forest Protection + Grazing Management', count: 1 }, { value: 'Wetland Restoration + Paddy Carbon', count: 1 }, { value: 'Ridge Restoration + Urban Carbon Sink', count: 1 }, { value: 'Lagoon Wetland Conservation + Seagrass', count: 1 }, { value: 'Mangrove + Estuarine Blue Carbon', count: 1 }, { value: 'Alpine Forest Protection + Soil Carbon', count: 1 }, { value: 'Mine Spoil Afforestation + Biochar', count: 1 }, { value: 'Cloud Forest Conservation + Community Forestry', count: 1 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'North', count: 4 }, { value: 'South', count: 4 }, { value: 'West', count: 3 }, { value: 'East', count: 3 },
  ]},
];

export default function CarbonSequestrationLogisticsView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [activeTab, setActiveTab] = useState<'dashboard' | 'registry' | 'analytics' | 'insights'>('dashboard');

  const toggleFilter = (key: string, value: string) => {
    setActiveFilters((prev: Record<string, string[]>) => {
      const next = { ...prev };
      const arr = next[key] || [];
      if (arr.includes(value)) {
        next[key] = arr.filter((v: string) => v !== value);
        if (next[key].length === 0) delete next[key];
      } else {
        next[key] = [...arr, value];
      }
      return next;
    });
  };

  const clearAllFilters = () => setActiveFilters({});

  const filteredRecords = useMemo(() => {
    return records.filter((r: CSLRecord) => {
      const matchSearch = !searchQuery || r.id.toLowerCase().includes(searchQuery.toLowerCase()) || r.state.toLowerCase().includes(searchQuery.toLowerCase()) || r.site.toLowerCase().includes(searchQuery.toLowerCase());
      const matchFilters = Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(String(r[key as keyof CSLRecord])));
      return matchSearch && matchFilters;
    });
  }, [searchQuery, activeFilters]);

  const totalHa = records.reduce((s, r) => s + r.areaHectares, 0);
  const totalCO2 = records.reduce((s, r) => s + r.co2SequesteredTPA, 0);
  const totalInv = records.reduce((s, r) => s + r.investmentCr, 0);
  const avgCO2 = Math.round(totalCO2 / totalHa * 100) / 100;

  const kpiData = [
    { label: 'Total Land Area', value: `${(totalHa / 1000).toFixed(0)}K ha`, sub: 'Protected Carbon Land' },
    { label: 'Total CO2 Sequestered', value: `${(totalCO2 / 1000).toFixed(0)}K TPA`, sub: 'Annual Carbon Capture' },
    { label: 'Avg Sequestration', value: `${avgCO2} t/ha/yr`, sub: 'Per Hectare Efficiency' },
    { label: 'Total Investment', value: `&#8377;${totalInv.toLocaleString()}Cr`, sub: 'National Carbon Mission' },
  ];

  const stateData = useMemo(() => records.map(r => ({ state: r.state, co2: r.co2SequesteredTPA, ha: r.areaHectares })).sort((a, b) => b.co2 - a.co2), []);
  const zonePie = useMemo(() => {
    const m: Record<string, number> = {};
    records.forEach(r => { m[r.zone] = (m[r.zone] || 0) + 1; });
    return Object.entries(m).map(([k, v]) => ({ name: k, value: v }));
  }, []);
  const haVsCO2 = useMemo(() => records.map(r => ({ state: r.state, ha: r.areaHectares, co2: r.co2SequesteredTPA })), []);

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard' },
    { id: 'registry' as const, label: 'Registry' },
    { id: 'analytics' as const, label: 'Analytics' },
    { id: 'insights' as const, label: 'Insights' },
  ];

  return (
    <div className="space-y-4 csl-logistics-view">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Carbon Sequestration' }]} />
      <PageHeader title="Carbon Sequestration Logistics" description="India&apos;s nature-based carbon sink projects spanning mangrove blue carbon, forest REDD+, afforestation, mine rehabilitation, alpine soil carbon and community forestry across protected ecosystems" />

      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === t.id ? 'bg-[#059669] text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiData.map((kpi, i) => (
              <Card key={i} className="csl-kpi-card">
                <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{kpi.label}</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold text-[#059669]" dangerouslySetInnerHTML={{ __html: kpi.value }} /><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="csl-chart-card"><CardHeader><CardTitle className="text-base">CO2 Sequestered by State (TPA)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={stateData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="state" tick={{ fontSize: 10 }} /><YAxis /><Tooltip /><Bar dataKey="co2" fill="#059669" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
            <Card className="csl-chart-card"><CardHeader><CardTitle className="text-base">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={zonePie} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }: { name: string; value: number }) => `${name}: ${value}`}><Cell fill="#059669" /><Cell fill="#10b981" /><Cell fill="#34d399" /><Cell fill="#047857" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          </div>
        </div>
      )}

      {(activeTab === 'registry' || activeTab === 'dashboard') && (
        <Card className={activeTab === 'dashboard' ? '' : 'csl-chart-card'}>
          <CardHeader><CardTitle className="text-base">{activeTab === 'registry' ? 'Carbon Sequestration Project Registry' : 'Recent Shipments'}</CardTitle></CardHeader>
          <CardContent>
            <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={clearAllFilters} totalItems={records.length} filteredCount={filteredRecords.length} />
            <div className="mt-4 space-y-2 max-h-[600px] overflow-y-auto">
              {(activeTab === 'dashboard' ? filteredRecords.slice(0, 5) : filteredRecords).map((r) => (
                <div key={r.id} className={`p-3 rounded-lg border text-sm border-l-4 border-l-[#059669] bg-emerald-50/20`}>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2"><span className="font-mono font-medium">{r.id}</span><Badge variant={r.priority === 'Critical' ? 'destructive' : 'secondary'}>{r.priority}</Badge><Badge variant="outline">{r.status}</Badge></div>
                    <span className="text-xs text-muted-foreground">{r.state} &#8594; {r.transitDays}d | {r.areaHectares.toLocaleString()} ha | {r.co2SequesteredTPA.toLocaleString()} TPA CO2</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1" dangerouslySetInnerHTML={{ __html: r.remarks }} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="csl-chart-card"><CardHeader><CardTitle className="text-base">Area vs CO2 Sequestration</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><LineChart data={haVsCO2}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="state" tick={{ fontSize: 9 }} /><YAxis yAxisId="left" /><YAxis yAxisId="right" orientation="right" /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="ha" stroke="#059669" strokeWidth={2} name="Area (ha)" /><Line yAxisId="right" type="monotone" dataKey="co2" stroke="#047857" strokeWidth={2} name="CO2 (TPA)" /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="csl-chart-card"><CardHeader><CardTitle className="text-base">Investment Efficiency (&#8377;Cr per K TPA)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={records.map(r => ({ state: r.state, eff: +(r.investmentCr / (r.co2SequesteredTPA / 1000)).toFixed(2) }))}><XAxis dataKey="state" tick={{ fontSize: 10 }} /><YAxis /><Tooltip /><Bar dataKey="eff" fill="#10b981" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="csl-chart-card"><CardHeader><CardTitle className="text-base">Total Area by Zone (K ha)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.zone] = (m[r.zone] || 0) + r.areaHectares; return m; }, {})).map(([k, v]) => ({ zone: k, kha: +(v / 1000).toFixed(1) }))}><XAxis dataKey="zone" /><YAxis /><Tooltip /><Bar dataKey="kha" fill="#047857" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="csl-chart-card"><CardHeader><CardTitle className="text-base">Status Overview</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={[{ name: 'In Transit', value: 4 }, { name: 'Delivered', value: 9 }, { name: 'Processing', value: 1 }]} cx="50%" cy="50%" outerRadius={90} dataKey="value" label><Cell fill="#059669" /><Cell fill="#22c55e" /><Cell fill="#f59e0b" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="csl-insight-card"><CardHeader><CardTitle className="text-base">Karnataka Western Ghats: India&apos;s Largest Forest Carbon Sink</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Karnataka&apos;s Western Ghats REDD+ project (CSL-0004) is India&apos;s largest at 180,000 TPA CO2 sequestration across 15,000 ha. Verra VCS-certified at &#8377;1,400/tonne &#8594; annual carbon revenue of &#8377;252Cr. IISc LiDAR monitoring provides satellite-grade accuracy for carbon stock assessment. Kudremukh biodiversity hotspot protects 1,800 endemic species &#8594; the project proves forest conservation economics: protecting forests earns more from carbon credits (&#8377;16,800/ha/yr) than clearing them for timber (&#8377;8,500/ha/yr).</p></CardContent></Card>
          <Card className="csl-insight-card"><CardHeader><CardTitle className="text-base">Mumbai Mangroves: Urban Blue Carbon Benchmark</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Mumbai&apos;s 2,500 ha mangrove park (CSL-0001) demonstrates blue carbon&apos;s dual value &#8594; 45,000 TPA CO2 sequestration plus coastal flood protection saving &#8377;500Cr/year for 1.2 crore residents. Carbon credits at &#8377;1,200/tonne generate &#8377;54Cr annually with 3.4-year payback. Mumbai mangroves store 52 lakh tonnes of carbon worth &#8377;6,240Cr &#8594; arguably India&apos;s most valuable urban real estate for carbon economics. MCZMA enforcement prevents encroachment that destroyed 40% of Mumbai&apos;s mangroves between 1990-2020.</p></CardContent></Card>
          <Card className="csl-insight-card"><CardHeader><CardTitle className="text-base">Nagaland Cloud Forest: Highest Per-Hectare Rate</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Nagaland Dzukou Valley (CSL-0014) achieves India&apos;s highest carbon sequestration rate at 13.1 tCO2/ha/yr &#8594; 2.4x the national forest average. Cloud forest rapid growth at 2,450m elevation combined with deep organic soil creates exceptional carbon density. TISS community forestry model pays Naga tribes &#8377;18,000/ha/yr &#8594; highest community payment in the portfolio. Northeast India&apos;s 85% forest cover has untapped potential for &#8377;5,000Cr annual carbon revenue by 2030 &#8594; transforming tribal livelihoods.</p></CardContent></Card>
          <Card className="csl-insight-card"><CardHeader><CardTitle className="text-base">India&apos;s Carbon Sink Mission: 2.5B Tonnes Target</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Portfolio of 99,700 ha and 1.234M TPA CO2 sequestration at &#8377;3,140Cr demonstrates India&apos;s nature-based carbon sink potential. National Carbon Sink Mission targets additional 2.5B tonnes CO2 sink by 2030 &#8594; requiring &#8377;45,000Cr across 5M ha of afforestation, mangrove restoration and soil carbon. India&apos;s carbon credit market (ICX) launched in 2023 &#8594; current portfolio generates &#8377;1,688Cr annual carbon revenue. At &#8377;1,400/tonne average, scaling to 5M ha would generate &#8377;21,000Cr/yr &#8594; making carbon sequestration India&apos;s most profitable land use.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
