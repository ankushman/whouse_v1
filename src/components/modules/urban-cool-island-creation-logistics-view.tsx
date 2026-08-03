'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface UCICRecord {
  id: string;
  projectId: string;
  city: string;
  coolStrategy: string;
  technologyStack: string;
  targetZone: string;
  tempReductionC: number;
  areaSqKm: number;
  populationBenefited: number;
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

const records: UCICRecord[] = [
  { id: 'UCIC-0001', projectId: 'UCIC-D26AHM', city: 'Ahmedabad', coolStrategy: 'Urban Forest + Water Body Restoration', technologyStack: 'Miyawaki Dense Forest + Stepwell Recharge', targetZone: 'Old City Walled Area', tempReductionC: 3.8, areaSqKm: 12.5, populationBenefited: 2200000, investmentCr: 480, status: 'In Transit', priority: 'Critical', origin: 'Gujarat Ecological Society', destination: 'AMC Kalupur Depot', shipDate: '2026-07-28', transitDays: 1, zone: 'West', remarks: '12.5 sq km Ahmedabad walled city cool zone &#8212; 50 Miyawaki dense forests + 12 restored stepwells + heritage well network creating 3.8&#176;C UHI reduction benefiting 22 lakh residents in India&apos;s hottest city' },
  { id: 'UCIC-0002', projectId: 'UCIC-D26DEL', city: 'Delhi', coolStrategy: 'Reflective Roof + Fog Cooling System', technologyStack: 'High-Albedo Cool Roof + Fog Spray Nozzle', targetZone: 'Central Delhi + Karol Bagh', tempReductionC: 4.2, areaSqKm: 25.0, populationBenefited: 3800000, investmentCr: 720, status: 'Delivered', priority: 'Critical', origin: 'TERI Gurgaon', destination: 'NDMC Palika Kendra', shipDate: '2026-07-10', transitDays: 1, zone: 'North', remarks: '25 sq km Delhi core area with 5M sq m cool roofs + 200 fog cooling stations &#8212; 4.2&#176;C reduction covering 38 lakh citizens. Targeting peak summer 49&#176;C &#8594; 45&#176;C under Heat Action Plan 2.0' },
  { id: 'UCIC-0003', projectId: 'UCIC-J26JPR', city: 'Jaipur', coolStrategy: 'Heritage Tree Canopy + Hawa Mahal Breeze Corridor', technologyStack: 'Native Neem-Peepal Canopy + Wind Corridor', targetZone: 'Pink City Heritage Zone', tempReductionC: 3.5, areaSqKm: 8.2, populationBenefited: 950000, investmentCr: 280, status: 'In Transit', priority: 'High', origin: 'AFRI Jodhpur', destination: 'JMC Nahargarh Nursery', shipDate: '2026-07-26', transitDays: 1, zone: 'North', remarks: '8.2 sq km Pink City canopy enhancement &#8212; 45,000 native trees + strategic wind corridors through heritage lanes creating 3.5&#176;C cooling for 9.5 lakh residents and tourists' },
  { id: 'UCIC-0004', projectId: 'UCIC-B26BLR', city: 'Bengaluru', coolStrategy: 'Lake Network + Permeable Paving', technologyStack: 'Lake Interconnection + Pervious Concrete', targetZone: 'Koramangala + HSR Layout', tempReductionC: 2.8, areaSqKm: 15.0, populationBenefited: 1200000, investmentCr: 350, status: 'Delivered', priority: 'High', origin: 'IFFGTB Bengaluru', destination: 'BBMP Koramangala Depot', shipDate: '2026-07-08', transitDays: 1, zone: 'South', remarks: '15 sq km Bengaluru tech corridor &#8212; 7 interlinked lakes + permeable paving on 500 km roads reducing surface temp 2.8&#176;C while recharging 20 MCM/yr groundwater for 12 lakh IT residents' },
  { id: 'UCIC-0005', projectId: 'UCIC-H26HYD', city: 'Hyderabad', coolStrategy: 'Green Roof Mandate + Vertical Gardens', technologyStack: 'Modular Green Roof + Hydroponic Living Wall', targetZone: 'HITEC City + Gachibowli', tempReductionC: 2.5, areaSqKm: 10.5, populationBenefited: 850000, investmentCr: 420, status: 'Processing', priority: 'High', origin: 'National Institute of Urban Affairs', destination: 'GHMC Madhapur Depot', shipDate: '2026-08-01', transitDays: 2, zone: 'South', remarks: '10.5 sq km Hyderabad IT corridor &#8212; 8,000 mandated green roofs + 1,500 vertical gardens creating 2.5&#176;C reduction for 8.5 lakh tech workers combating AC-driven heat island' },
  { id: 'UCIC-0006', projectId: 'UCIC-C26CHN', city: 'Chennai', coolStrategy: 'Coastal Wind Funnel + Mangrove Bioshield', technologyStack: 'Ventilated Streets + Coastal Mangrove Buffer', targetZone: 'Besant Nagar + Adyar Coastal Belt', tempReductionC: 3.2, areaSqKm: 7.5, populationBenefited: 650000, investmentCr: 190, status: 'Delivered', priority: 'High', origin: 'ICMAM Chennai', destination: 'GCC Adyar Tree Bank', shipDate: '2026-07-12', transitDays: 1, zone: 'South', remarks: '7.5 sq km Chennai coastal cool corridor &#8212; sea breeze funnel design + 4 km mangrove buffer creating 3.2&#176;C reduction for 6.5 lakh coastal residents while preventing storm surge erosion' },
  { id: 'UCIC-0007', projectId: 'UCIC-K26KOL', city: 'Kolkata', coolStrategy: 'Water Body Network + Sprinkler Cooling', technologyStack: 'Heritage Tank Restoration + Road Sprinklers', targetZone: 'Central Kolkata + Salt Lake', tempReductionC: 2.9, areaSqKm: 18.0, populationBenefited: 1500000, investmentCr: 220, status: 'In Transit', priority: 'High', origin: 'IIT Kharagpur', destination: 'KMC Salt Lake Depot', shipDate: '2026-07-27', transitDays: 1, zone: 'East', remarks: '18 sq km Kolkata with 25 restored heritage tanks + 300 road sprinklers creating 2.9&#176;C reduction for 15 lakh residents. Combining heritage water architecture with modern cooling for maximum impact' },
  { id: 'UCIC-0008', projectId: 'UCIC-P26PUN', city: 'Pune', coolStrategy: 'Ridge Forest Conservation + Bio-Corridor', technologyStack: 'Vetal Hill Preservation + River Corridor', targetZone: 'Vetal Tekdi + Mula-Mutha Banks', tempReductionC: 2.2, areaSqKm: 22.0, populationBenefited: 980000, investmentCr: 160, status: 'Delivered', priority: 'Medium', origin: 'BAIF Pune', destination: 'PMC Aundh Depot', shipDate: '2026-07-14', transitDays: 1, zone: 'West', remarks: '22 sq km Pune bio-corridor &#8212; Vetal Tekdi ridge forest protection + Mula-Mutha riverbank restoration creating 2.2&#176;C reduction and micro-climate regulation for 9.8 lakh residents' },
  { id: 'UCIC-0009', projectId: 'UCIC-S26SUR', city: 'Surat', coolStrategy: 'Evaporative Cooling Grid + Urban Wetlands', technologyStack: 'Evaporative Cooling Towers + Constructed Wetlands', targetZone: 'Ring Road Textile Belt', tempReductionC: 3.5, areaSqKm: 14.0, populationBenefited: 1100000, investmentCr: 310, status: 'Delayed', priority: 'Medium', origin: 'Sardar Sarovar Narmada Nigam', destination: 'SMC Ring Road Depot', shipDate: '2026-07-18', transitDays: 2, zone: 'West', remarks: '14 sq km Surat textile zone &#8212; 35 evaporative cooling towers + 8 constructed wetlands creating 3.5&#176;C reduction for 11 lakh textile workers. Reducing heat stress in 200+ dyeing units with passive cooling' },
  { id: 'UCIC-0010', projectId: 'UCIC-M26MUM', city: 'Mumbai', coolStrategy: 'Sea Breeze Channel + Mangrove Buffer', technologyStack: 'Ventilated High-Rise Design + Mangrove Restoration', targetZone: 'Mithi River Floodplain + Worli Sea Face', tempReductionC: 3.0, areaSqKm: 16.0, populationBenefited: 2400000, investmentCr: 520, status: 'In Transit', priority: 'Critical', origin: 'MCGB Mumbai', destination: 'MCGM Worli Depot', shipDate: '2026-07-25', transitDays: 2, zone: 'West', remarks: '16 sq km Mumbai coastal zone &#8212; sea breeze ventilation channels through high-rises + 5 km mangrove buffer creating 3.0&#176;C reduction for 24 lakh Mumbaikars in most vulnerable heat island zones' },
  { id: 'UCIC-0011', projectId: 'UCIC-L26LUD', city: 'Ludhiana', coolStrategy: 'Industrial Green Belt + Tree Canopy', technologyStack: 'Pollution-Tolerant Green Belt + Avenue Trees', targetZone: 'GT Road Industrial Corridor', tempReductionC: 2.5, areaSqKm: 11.0, populationBenefited: 780000, investmentCr: 145, status: 'Processing', priority: 'Medium', origin: 'PAU Ludhiana', destination: 'MC Ludhiana Focal Point', shipDate: '2026-08-02', transitDays: 1, zone: 'North', remarks: '11 sq km Ludhiana industrial zone &#8212; 30 km pollution-tolerant green belt + 15,000 avenue trees creating 2.5&#176;C reduction for 7.8 lakh residents. Combined heat + pollution reduction for factory workers' },
  { id: 'UCIC-0012', projectId: 'UCIC-B26BNG', city: 'Bhubaneswar', coolStrategy: 'Temple Heritage Shade + Lotus Pond Network', technologyStack: 'Heritage Temple Gardens + Sacred Pond Revival', targetZone: 'Old Town + Lingaraj Area', tempReductionC: 3.0, areaSqKm: 6.5, populationBenefited: 420000, investmentCr: 95, status: 'Delivered', priority: 'Medium', origin: 'INTACH Bhubaneswar', destination: 'BMC Saheed Nagar Depot', shipDate: '2026-07-05', transitDays: 1, zone: 'East', remarks: '6.5 sq km Bhubaneswar heritage zone &#8212; 18 temple gardens + 8 sacred lotus pond restorations creating 3.0&#176;C reduction for 4.2 lakh residents. Merging Odia temple architecture with climate adaptation' },
  { id: 'UCIC-0013', projectId: 'UCIC-I26IND', city: 'Indore', coolStrategy: 'Solar Shade Structure + Rooftop Garden Network', technologyStack: 'Solar Panel Canopies + Rooftop Greening', targetZone: 'Sarafa + MG Road + Palasia', tempReductionC: 2.3, areaSqKm: 8.0, populationBenefited: 850000, investmentCr: 175, status: 'In Transit', priority: 'Medium', origin: 'IMC Climate Cell', destination: 'IMC Nawab Bagh Depot', shipDate: '2026-07-24', transitDays: 2, zone: 'West', remarks: '8 sq km Indore commercial zone &#8212; 200 solar panel shade structures + 3,000 rooftop gardens creating 2.3&#176;C reduction for 8.5 lakh citizens. Combined solar energy generation + microclimate cooling' },
  { id: 'UCIC-0014', projectId: 'UCIC-K26KOZ', city: 'Kochi', coolStrategy: 'Backwater Breeze Channel + Mangrove Cooling', technologyStack: 'Vembanad Breeze Corridor + Mangrove Wetland', targetZone: 'Ernakulam + Fort Kochi', tempReductionC: 2.8, areaSqKm: 9.0, populationBenefited: 620000, investmentCr: 130, status: 'Delivered', priority: 'Medium', origin: 'CET Kochi', destination: 'Kochi Corporation Depot', shipDate: '2026-07-14', transitDays: 1, zone: 'South', remarks: '9 sq km Kochi heritage zone &#8212; Vembanad backwater breeze channeling + 3 km mangrove wetland creating 2.8&#176;C reduction for 6.2 lakh residents. Combining coastal ecology with urban cooling for a sustainable tourism model' },
];

const COLORS = ['#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd', '#0284c7', '#0369a1', '#075985', '#0c4a6e'];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 5 }, { value: 'Delivered', count: 5 }, { value: 'Processing', count: 2 }, { value: 'Delayed', count: 1 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 3 }, { value: 'High', count: 7 }, { value: 'Medium', count: 4 },
  ]},
  { label: 'Cool Strategy', key: 'coolStrategy', options: [
    { value: 'Urban Forest + Water Body Restoration', count: 1 }, { value: 'Reflective Roof + Fog Cooling System', count: 1 }, { value: 'Heritage Tree Canopy + Hawa Mahal Breeze Corridor', count: 1 }, { value: 'Lake Network + Permeable Paving', count: 1 }, { value: 'Green Roof Mandate + Vertical Gardens', count: 1 }, { value: 'Coastal Wind Funnel + Mangrove Bioshield', count: 1 }, { value: 'Water Body Network + Sprinkler Cooling', count: 1 }, { value: 'Ridge Forest Conservation + Bio-Corridor', count: 1 }, { value: 'Evaporative Cooling Grid + Urban Wetlands', count: 1 }, { value: 'Sea Breeze Channel + Mangrove Buffer', count: 1 }, { value: 'Industrial Green Belt + Tree Canopy', count: 1 }, { value: 'Temple Heritage Shade + Lotus Pond Network', count: 1 }, { value: 'Solar Shade Structure + Rooftop Garden Network', count: 1 }, { value: 'Backwater Breeze Channel + Mangrove Cooling', count: 1 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'North', count: 3 }, { value: 'South', count: 4 }, { value: 'West', count: 4 }, { value: 'East', count: 3 },
  ]},
];

export default function UrbanCoolIslandCreationLogisticsView() {
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
    return records.filter((r: UCICRecord) => {
      const matchSearch = !searchQuery || r.id.toLowerCase().includes(searchQuery.toLowerCase()) || r.city.toLowerCase().includes(searchQuery.toLowerCase()) || r.coolStrategy.toLowerCase().includes(searchQuery.toLowerCase());
      const matchFilters = Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(String(r[key as keyof UCICRecord])));
      return matchSearch && matchFilters;
    });
  }, [searchQuery, activeFilters]);

  const totalPop = records.reduce((s, r) => s + r.populationBenefited, 0);
  const totalArea = records.reduce((s, r) => s + r.areaSqKm, 0);
  const totalInv = records.reduce((s, r) => s + r.investmentCr, 0);
  const avgReduction = (records.reduce((s, r) => s + r.tempReductionC, 0) / records.length).toFixed(1);

  const kpiData = [
    { label: 'Population Covered', value: `${(totalPop / 100000).toFixed(1)}M`, sub: 'Across 14 Indian Cities' },
    { label: 'Total Cool Area', value: `${totalArea.toFixed(0)} sq km`, sub: 'Urban Cool Zone Network' },
    { label: 'Avg Temp Reduction', value: `${avgReduction}&#176;C`, sub: 'Per Cool Zone' },
    { label: 'Total Investment', value: `&#8377;${totalInv}Cr`, sub: 'National Cool Island Mission' },
  ];

  const cityData = useMemo(() => records.map(r => ({ city: r.city, temp: r.tempReductionC, area: r.areaSqKm, pop: r.populationBenefited / 100000 })).sort((a, b) => b.temp - a.temp), []);
  const zonePie = useMemo(() => {
    const m: Record<string, number> = {};
    records.forEach(r => { m[r.zone] = (m[r.zone] || 0) + 1; });
    return Object.entries(m).map(([k, v]) => ({ name: k, value: v }));
  }, []);
  const areaVsPop = useMemo(() => records.map(r => ({ city: r.city, area: r.areaSqKm, pop: r.populationBenefited / 100000 })), []);

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard' },
    { id: 'registry' as const, label: 'Registry' },
    { id: 'analytics' as const, label: 'Analytics' },
    { id: 'insights' as const, label: 'Insights' },
  ];

  return (
    <div className="space-y-4 ucic-logistics-view">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Urban Cool Island Creation' }]} />
      <PageHeader title="Urban Cool Island Creation Logistics" description="Heat island mitigation through green infrastructure, water bodies, reflective surfaces &amp; wind corridors for Indian cities" />

      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === t.id ? 'bg-[#0ea5e9] text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiData.map((kpi, i) => (
              <Card key={i} className="ucic-kpi-card">
                <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{kpi.label}</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold text-[#0ea5e9]" dangerouslySetInnerHTML={{ __html: kpi.value }} /><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="ucic-chart-card"><CardHeader><CardTitle className="text-base">Temperature Reduction by City (&#176;C)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cityData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="city" tick={{ fontSize: 10 }} /><YAxis /><Tooltip /><Bar dataKey="temp" fill="#0ea5e9" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
            <Card className="ucic-chart-card"><CardHeader><CardTitle className="text-base">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={zonePie} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }: { name: string; value: number }) => `${name}: ${value}`}><Cell fill="#0ea5e9" /><Cell fill="#38bdf8" /><Cell fill="#7dd3fc" /><Cell fill="#0284c7" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          </div>
        </div>
      )}

      {(activeTab === 'registry' || activeTab === 'dashboard') && (
        <Card className={activeTab === 'dashboard' ? '' : 'ucic-chart-card'}>
          <CardHeader><CardTitle className="text-base">{activeTab === 'registry' ? 'Cool Island Project Registry' : 'Recent Shipments'}</CardTitle></CardHeader>
          <CardContent>
            <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={clearAllFilters} totalItems={records.length} filteredCount={filteredRecords.length} />
            <div className="mt-4 space-y-2 max-h-[600px] overflow-y-auto">
              {(activeTab === 'dashboard' ? filteredRecords.slice(0, 5) : filteredRecords).map((r) => (
                <div key={r.id} className={`p-3 rounded-lg border text-sm ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-[#0ea5e9] bg-sky-50/20'}`}>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2"><span className="font-mono font-medium">{r.id}</span><Badge variant={r.priority === 'Critical' ? 'destructive' : 'secondary'}>{r.priority}</Badge><Badge variant="outline">{r.status}</Badge></div>
                    <span className="text-xs text-muted-foreground">{r.city} &#8594; {r.transitDays}d | {r.tempReductionC}&#176;C reduction</span>
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
          <Card className="ucic-chart-card"><CardHeader><CardTitle className="text-base">Cool Zone Area vs Population</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><LineChart data={areaVsPop}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="city" tick={{ fontSize: 9 }} /><YAxis yAxisId="left" /><YAxis yAxisId="right" orientation="right" /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="area" stroke="#0ea5e9" strokeWidth={2} name="sq km" /><Line yAxisId="right" type="monotone" dataKey="pop" stroke="#0369a1" strokeWidth={2} name="Population (Lakh)" /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="ucic-chart-card"><CardHeader><CardTitle className="text-base">Investment Efficiency (&#176;C per &#8377;Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={records.map(r => ({ city: r.city, eff: +(r.tempReductionC / r.investmentCr * 100).toFixed(2) }))}><XAxis dataKey="city" tick={{ fontSize: 10 }} /><YAxis /><Tooltip /><Bar dataKey="eff" fill="#38bdf8" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="ucic-chart-card"><CardHeader><CardTitle className="text-base">Area Coverage by Zone</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={Object.entries(records.reduce((m, r) => { m[r.zone] = (m[r.zone] || 0) + r.areaSqKm; return m; }, {})).map(([k, v]) => ({ zone: k, sqKm: v }))}><XAxis dataKey="zone" /><YAxis /><Tooltip /><Bar dataKey="sqKm" fill="#0284c7" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="ucic-chart-card"><CardHeader><CardTitle className="text-base">Status Overview</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={[{ name: 'In Transit', value: 5 }, { name: 'Delivered', value: 5 }, { name: 'Processing', value: 2 }, { name: 'Delayed', value: 1 }]} cx="50%" cy="50%" outerRadius={90} dataKey="value" label><Cell fill="#0ea5e9" /><Cell fill="#22c55e" /><Cell fill="#f59e0b" /><Cell fill="#ef4444" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="ucic-insight-card"><CardHeader><CardTitle className="text-base">Delhi Leads with 4.2&#176;C Reduction</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Delhi&apos;s reflective roof + fog cooling system (UCIC-0002) achieves the highest temperature reduction of 4.2&#176;C across 25 sq km covering 38 lakh citizens. At &#8377;720Cr, this translates to just &#8377;0.19 per person per year &#8212; the most cost-effective heat reduction per capita in India. The fog cooling stations are particularly effective during peak afternoon hours when mortality risk is highest.</p></CardContent></Card>
          <Card className="ucic-insight-card"><CardHeader><CardTitle className="text-base">Ahmedabad Walled City Model</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Ahmedabad&apos;s old city Miyawaki + stepwell restoration approach (UCIC-0001) demonstrates how heritage infrastructure can double as climate adaptation. 50 dense Miyawaki forests grow 10x faster than conventional planting, achieving 3.8&#176;C cooling in just 3 years. Combined with restored stepwells providing evaporative cooling, this creates a self-sustaining microclimate system requiring minimal maintenance.</p></CardContent></Card>
          <Card className="ucic-insight-card"><CardHeader><CardTitle className="text-base">Bengaluru Lake Interconnection Model</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Bengaluru&apos;s 7-lake interconnection network (UCIC-0004) with permeable paving on 500 km roads serves a dual purpose: cool island creation AND flood prevention. This integrated water-heat management approach should be replicated in Hyderabad (Hussain Sagar chain) and Jaipur (Jal Mahal system). Cost-effectiveness is high at &#8377;350Cr for 12 lakh IT corridor residents.</p></CardContent></Card>
          <Card className="ucic-insight-card"><CardHeader><CardTitle className="text-base">National Cool Island Mission Opportunity</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Total portfolio of 15.7M citizens and 173 sq km cool area across 14 cities at &#8377;3,895Cr represents &#8377;248/person or &#8377;22.5/sq km. A nationalized cool island program covering India&apos;s 100 most heat-vulnerable cities could protect 500M+ citizens at &#8377;25,000Cr total investment &#8212; comparable to a single metro line but protecting exponentially more lives from heat-related mortality.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
