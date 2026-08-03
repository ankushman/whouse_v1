'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface IHDRecord {
  id: string;
  projectId: string;
  industrySector: string;
  heatingProcess: string;
  decarbTechnology: string;
  plant: string;
  location: string;
  tempRangeC: string;
  heatDemandGJ: number;
  emissionReductionTonsCO2: number;
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

const records: IHDRecord[] = [
  { id: 'IHD-0001', projectId: 'IHD-S26JSW', industrySector: 'Steel', heatingProcess: 'Blast Furnace Ironmaking', decarbTechnology: 'H2-DRI + Electric Arc', plant: 'JSW Vijayanagar', location: 'Bellary, Karnataka', tempRangeC: '1200-1500', heatDemandGJ: 85000, emissionReductionTonsCO2: 4200000, investmentCr: 18500, status: 'In Transit', priority: 'Critical', origin: 'SMS Group Germany', destination: 'JSW Toranagallu Works', shipDate: '2026-07-28', transitDays: 5, zone: 'South', remarks: '85,000 GJ/day blast furnace replacement with H2-DRI + EAF &#8212; 4.2 MtCO2/yr reduction at JSW Vijayanagar. 18,500 Cr investment covering electrolyzer + H2 pipeline + DRI shaft furnace for India&apos;s largest green steel project' },
  { id: 'IHD-0002', projectId: 'IHD-C26TATA', industrySector: 'Cement', heatingProcess: 'Clinker Rotary Kiln', decarbTechnology: 'Calciner + 50% Green H2 Blend', plant: 'Tata Cement KCP', location: 'Mundra, Gujarat', tempRangeC: '1450', heatDemandGJ: 42000, emissionReductionTonsCO2: 1800000, investmentCr: 5200, status: 'Delivered', priority: 'Critical', origin: 'FLSmidth Denmark', destination: 'Tata Cement Works', shipDate: '2026-07-12', transitDays: 7, zone: 'West', remarks: '42,000 GJ/day clinker kiln with 50% green H2 blend replacing coal in calciner &#8212; 1.8 MtCO2/yr reduction at Tata Mundra. 5,200 Cr for H2-ready burner + storage + carbon capture pilot' },
  { id: 'IHD-0003', projectId: 'IHD-G26NAL', industrySector: 'Glass', heatingProcess: 'Float Glass Melting Furnace', decarbTechnology: 'Electric Melting + Oxy-Fuel', plant: 'Asahi India Glass', location: 'Kolkata, West Bengal', tempRangeC: '1500-1600', heatDemandGJ: 12000, emissionReductionTonsCO2: 450000, investmentCr: 1800, status: 'In Transit', priority: 'High', origin: 'Sorglaze Italy', destination: 'AIG Kolkata Plant', shipDate: '2026-07-26', transitDays: 6, zone: 'East', remarks: '12,000 GJ/day float glass furnace with 70% electric melting + oxy-fuel boost &#8212; 450 KtCO2/yr at Asahi India Glass Kolkata. 1,800 Cr for all-electric melting + oxy-fuel burner conversion' },
  { id: 'IHD-0004', projectId: 'IHD-A26ADANI', industrySector: 'Aluminium', heatingProcess: 'Alumina Smelting Hall-Heroult', decarbTechnology: 'Inert Anode + 100% RE', plant: 'Adani Aluminium', location: 'Mundra, Gujarat', tempRangeC: '950-960', heatDemandGJ: 55000, emissionReductionTonsCO2: 3200000, investmentCr: 9800, status: 'Processing', priority: 'Critical', origin: 'Elysis Canada', destination: 'Adani Smelter Complex', shipDate: '2026-08-02', transitDays: 7, zone: 'West', remarks: '55,000 GJ/day Hall-Heroult process with inert anodes eliminating CO2 emissions &#8212; 3.2 MtCO2/yr at Adani Aluminium. 9,800 Cr for inert anode blocks + cathode lining + RE power supply' },
  { id: 'IHD-0005', projectId: 'IHD-P26RELIANCE', industrySector: 'Petrochemical', heatingProcess: 'Steam Cracking Olefins', decarbTechnology: 'Electric Cracker + Green H2', plant: 'Reliance Jamnagar', location: 'Jamnagar, Gujarat', tempRangeC: '800-900', heatDemandGJ: 72000, emissionReductionTonsCO2: 5100000, investmentCr: 22000, status: 'In Transit', priority: 'Critical', origin: 'Lummus Technology USA', destination: 'Reliance SEZ Jamnagar', shipDate: '2026-07-25', transitDays: 8, zone: 'West', remarks: '72,000 GJ/day naphtha cracker with e-cracking furnaces + green H2 co-feed &#8212; 5.1 MtCO2/yr at Reliance Jamnagar. 22,000 Cr for 3 electric cracking furnaces + H2 pipeline + CCUS integration' },
  { id: 'IHD-0006', projectId: 'IHD-Z26HINDALCO', industrySector: 'Zinc', heatingProcess: 'Roast-Leach-Electrowin', decarbTechnology: 'Electric Roaster + RE Grid', plant: 'Hindalco Renukoot', location: 'Sonbhadra, UP', tempRangeC: '950-1100', heatDemandGJ: 18000, emissionReductionTonsCO2: 680000, investmentCr: 2400, status: 'Delivered', priority: 'High', origin: 'Outotec Finland', destination: 'Hindalco Smelter Renukoot', shipDate: '2026-07-08', transitDays: 3, zone: 'North', remarks: '18,000 GJ/day zinc roaster electrification with RE grid integration &#8212; 680 KtCO2/yr at Hindalco Renukoot. 2,400 Cr for plasma roaster + induction heater + 250 MW solar park' },
  { id: 'IHD-0007', projectId: 'IHD-F26GRASIM', industrySector: 'Fertilizer', heatingProcess: 'Ammonia Synthesis Haber-Bosch', decarbTechnology: 'Green H2 + Air Separation', plant: 'GSFC Vadodara', location: 'Vadodara, Gujarat', tempRangeC: '400-500', heatDemandGJ: 28000, emissionReductionTonsCO2: 1500000, investmentCr: 6500, status: 'Delivered', priority: 'Critical', origin: 'Haldor Topsoe Denmark', destination: 'GSFC Fertilizer Complex', shipDate: '2026-07-05', transitDays: 5, zone: 'West', remarks: '28,000 GJ/day Haber-Bosch with 100% green H2 from 800 MW electrolyzer &#8212; 1.5 MtCO2/yr at GSFC Vadodara. 6,500 Cr for green H2 plant + heat integration + carbon-free ammonia synthesis loop' },
  { id: 'IHD-0008', projectId: 'IHD-R26SAIL', industrySector: 'Refining', heatingProcess: 'Crude Distillation + FCC', decarbTechnology: 'Electrothermal + H2 Co-Processing', plant: 'IOC Paradip', location: 'Paradip, Odisha', tempRangeC: '350-520', heatDemandGJ: 65000, emissionReductionTonsCO2: 2800000, investmentCr: 14500, status: 'Delayed', priority: 'High', origin: 'CB&amp;I Howden UK', destination: 'IOCL Paradip Refinery', shipDate: '2026-07-18', transitDays: 6, zone: 'East', remarks: '65,000 GJ/day crude distillation + FCC electrification + green H2 co-processing &#8212; 2.8 MtCO2/yr at IOCL Paradip. 14,500 Cr for fired heater replacement + H2 supply + CCUS retrofit' },
  { id: 'IHD-0009', projectId: 'IHD-E26VEDANTA', industrySector: 'Copper', heatingProcess: 'Flash Smelting + Converting', decarbTechnology: 'Electric Flash Smelter + Bio-Coke', plant: 'Vedanta Tuticorin', location: 'Thoothukudi, TN', tempRangeC: '1200-1300', heatDemandGJ: 15000, emissionReductionTonsCO2: 520000, investmentCr: 1650, status: 'In Transit', priority: 'High', origin: 'Metsotech Finland', destination: 'Vedanta Copper Smelter', shipDate: '2026-07-27', transitDays: 3, zone: 'South', remarks: '15,000 GJ/day copper flash smelter with electric heating + bio-coke injection &#8212; 520 KtCO2/yr at Vedanta Tuticorin. 1,650 Cr for plasma torch + bio-coke handling + waste heat recovery' },
  { id: 'IHD-0010', projectId: 'IHD-S26HINDUSTAN', industrySector: 'Sugar', heatingProcess: 'Evaporation &amp; Crystallization', decarbTechnology: 'MVR + Solar Thermal Integration', plant: 'Hindustan Sugar Muzaffarnagar', location: 'Muzaffarnagar, UP', tempRangeC: '80-130', heatDemandGJ: 8000, emissionReductionTonsCO2: 180000, investmentCr: 320, status: 'Delivered', priority: 'Medium', origin: 'GEA Process India', destination: 'HSML Mill Premises', shipDate: '2026-07-10', transitDays: 1, zone: 'North', remarks: '8,000 GJ/day sugar evaporation with MVR (mechanical vapor recompression) + solar thermal integration &#8212; 180 KtCO2/yr at Hindustan Sugar. 320 Cr for MVR units + solar thermal collectors + bagasse-fired superheater' },
  { id: 'IHD-0011', projectId: 'IHD-D26DRREDDY', industrySector: 'Paper', heatingProcess: 'Kraft Pulping Recovery Boiler', decarbTechnology: 'Biomass Gasifier + DCS Optimization', plant: 'JK Paper Rayagada', location: 'Rayagada, Odisha', tempRangeC: '800-900', heatDemandGJ: 6000, emissionReductionTonsCO2: 210000, investmentCr: 480, status: 'Processing', priority: 'Medium', origin: 'Andritz Austria', destination: 'JK Paper Mill Works', shipDate: '2026-08-01', transitDays: 4, zone: 'East', remarks: '6,000 GJ/day recovery boiler with biomass gasifier co-firing + DCS optimization &#8212; 210 KtCO2/yr at JK Paper Rayagada. 480 Cr for bubbling fluidized bed gasifier + lignin recovery + advanced process control' },
  { id: 'IHD-0012', projectId: 'IHD-T26WELSPUN', industrySector: 'Textile', heatingProcess: 'Dyeing &amp; Finishing Stenters', decarbTechnology: 'RF Drying + Digital Printing', plant: 'Welspun Anjar', location: 'Anjar, Gujarat', tempRangeC: '150-200', heatDemandGJ: 4000, emissionReductionTonsCO2: 95000, investmentCr: 210, status: 'Delivered', priority: 'Medium', origin: 'Bruckner Germany', destination: 'Welspun Global Textile', shipDate: '2026-07-14', transitDays: 5, zone: 'West', remarks: '4,000 GJ/day textile drying with radio-frequency drying + digital printing eliminating steam &#8212; 95 KtCO2/yr at Welspun Anjar. 210 Cr for RF dryers + digital printing machines + heat pump recovery' },
  { id: 'IHD-0013', projectId: 'IHD-C26ULTRATECH', industrySector: 'Ceramics', heatingProcess: 'Kiln Firing Sanitaryware', decarbTechnology: 'Hydrogen Kiln + Advanced Insulation', plant: 'UltraTech Katni', location: 'Katni, MP', tempRangeC: '1200-1280', heatDemandGJ: 9500, emissionReductionTonsCO2: 380000, investmentCr: 820, status: 'In Transit', priority: 'High', origin: 'Sacmi Imola Italy', destination: 'UltraTech Cement Works', shipDate: '2026-07-24', transitDays: 4, zone: 'North', remarks: '9,500 GJ/day kiln with 40% H2 co-firing + advanced ceramic insulation &#8212; 380 KtCO2/yr at UltraTech Katni sanitaryware. 820 Cr for hydrogen-ready kiln burners + fiber insulation + waste heat recovery' },
  { id: 'IHD-0014', projectId: 'IHD-M26MAHINDRA', industrySector: 'Mining', heatingProcess: 'Iron Ore Pellet Induration', decarbTechnology: 'Green Pellet + Solar Roaster', plant: 'Mahindra Susten Jaisalmer', location: 'Jaisalmer, Rajasthan', tempRangeC: '1250-1350', heatDemandGJ: 22000, emissionReductionTonsCO2: 920000, investmentCr: 1900, status: 'In Transit', priority: 'High', origin: 'Metso Outotec India', destination: 'Mahindra Pellet Plant', shipDate: '2026-07-22', transitDays: 5, zone: 'North', remarks: '22,000 GJ/day pellet induration furnace with solar thermal pre-heating + green H2 co-firing &#8212; 920 KtCO2/yr at Mahindra Susten. 1,900 Cr for concentrated solar thermal array + H2 burner system + induration grate upgrade' },
];

const COLORS = ['#ea580c', '#f97316', '#fb923c', '#fdba74', '#c2410c', '#9a3412', '#fed7aa', '#ffedd5'];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 7 }, { value: 'Delivered', count: 4 }, { value: 'Processing', count: 2 }, { value: 'Delayed', count: 1 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 6 }, { value: 'High', count: 6 }, { value: 'Medium', count: 2 },
  ]},
  { label: 'Industry Sector', key: 'industrySector', options: [
    { value: 'Steel', count: 1 }, { value: 'Cement', count: 1 }, { value: 'Glass', count: 1 }, { value: 'Aluminium', count: 1 }, { value: 'Petrochemical', count: 1 }, { value: 'Zinc', count: 1 }, { value: 'Fertilizer', count: 1 }, { value: 'Refining', count: 1 }, { value: 'Copper', count: 1 }, { value: 'Sugar', count: 1 }, { value: 'Paper', count: 1 }, { value: 'Textile', count: 1 }, { value: 'Ceramics', count: 1 }, { value: 'Mining', count: 1 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'North', count: 4 }, { value: 'South', count: 3 }, { value: 'West', count: 4 }, { value: 'East', count: 3 },
  ]},
];

export default function IndustrialHeatDecarbonizationLogisticsView() {
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
    return records.filter((r: IHDRecord) => {
      const matchSearch = !searchQuery || r.id.toLowerCase().includes(searchQuery.toLowerCase()) || r.industrySector.toLowerCase().includes(searchQuery.toLowerCase()) || r.plant.toLowerCase().includes(searchQuery.toLowerCase());
      const matchFilters = Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(String(r[key as keyof IHDRecord])));
      return matchSearch && matchFilters;
    });
  }, [searchQuery, activeFilters]);

  const totalCO2 = records.reduce((s, r) => s + r.emissionReductionTonsCO2, 0);
  const totalInv = records.reduce((s, r) => s + r.investmentCr, 0);
  const totalHeat = records.reduce((s, r) => s + r.heatDemandGJ, 0);

  const kpiData = [
    { label: 'Total CO2 Reduction', value: `${(totalCO2 / 1000000).toFixed(1)}Mt/yr`, sub: 'Across 14 Industrial Plants' },
    { label: 'Total Investment', value: `&#8377;${(totalInv / 1000).toFixed(1)}K Cr`, sub: 'Green Heat Transition' },
    { label: 'Heat Demand Covered', value: `${(totalHeat / 1000).toFixed(0)}K GJ/day`, sub: 'Industrial Process Heat' },
    { label: 'Avg Reduction', value: `${Math.round(totalCO2 / records.length / 1000)}Kt`, sub: 'tCO2/yr per Plant' },
  ];

  const sectorCO2 = useMemo(() => records.map(r => ({ sector: r.industrySector, co2: r.emissionReductionTonsCO2 / 1000000, inv: r.investmentCr })).sort((a, b) => b.co2 - a.co2), []);
  const techMix = useMemo(() => {
    const m: Record<string, number> = {};
    records.forEach(r => {
      const tech = r.decarbTechnology.split(' ')[0];
      m[tech] = (m[tech] || 0) + 1;
    });
    return Object.entries(m).map(([k, v]) => ({ name: k, value: v }));
  }, []);
  const zonePie = useMemo(() => {
    const m: Record<string, number> = {};
    records.forEach(r => { m[r.zone] = (m[r.zone] || 0) + 1; });
    return Object.entries(m).map(([k, v]) => ({ name: k, value: v }));
  }, []);
  const tempVsCO2 = useMemo(() => records.map(r => ({ plant: r.plant.split(' ')[0], co2: r.emissionReductionTonsCO2 / 1000, heat: r.heatDemandGJ })), []);

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard' },
    { id: 'registry' as const, label: 'Registry' },
    { id: 'analytics' as const, label: 'Analytics' },
    { id: 'insights' as const, label: 'Insights' },
  ];

  return (
    <div className="space-y-4 ihd-logistics-view">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Industrial Heat Decarbonization' }]} />
      <PageHeader title="Industrial Heat Decarbonization Logistics" description="Green heat transition for Indian industrial process heating &#8212; steel, cement, glass, aluminium, petrochemical, and more" />

      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === t.id ? 'bg-[#ea580c] text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiData.map((kpi, i) => (
              <Card key={i} className="ihd-kpi-card">
                <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{kpi.label}</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold text-[#ea580c]" dangerouslySetInnerHTML={{ __html: kpi.value }} /><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="ihd-chart-card"><CardHeader><CardTitle className="text-base">Sector CO2 Reduction (MtCO2/yr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={sectorCO2}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="sector" tick={{ fontSize: 10 }} /><YAxis /><Tooltip /><Bar dataKey="co2" fill="#ea580c" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
            <Card className="ihd-chart-card"><CardHeader><CardTitle className="text-base">Technology Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={techMix} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }: { name: string; value: number }) => `${name}: ${value}`}><Cell fill="#ea580c" /><Cell fill="#f97316" /><Cell fill="#fb923c" /><Cell fill="#c2410c" /><Cell fill="#9a3412" /><Cell fill="#fed7aa" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          </div>
        </div>
      )}

      {(activeTab === 'registry' || activeTab === 'dashboard') && (
        <Card className={activeTab === 'dashboard' ? '' : 'ihd-chart-card'}>
          <CardHeader><CardTitle className="text-base">{activeTab === 'registry' ? 'Project Registry' : 'Recent Shipments'}</CardTitle></CardHeader>
          <CardContent>
            <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={clearAllFilters} totalItems={records.length} filteredCount={filteredRecords.length} />
            <div className="mt-4 space-y-2 max-h-[600px] overflow-y-auto">
              {(activeTab === 'dashboard' ? filteredRecords.slice(0, 5) : filteredRecords).map((r) => (
                <div key={r.id} className={`p-3 rounded-lg border text-sm ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-[#ea580c] bg-orange-50/20'}`}>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2"><span className="font-mono font-medium">{r.id}</span><Badge variant={r.priority === 'Critical' ? 'destructive' : 'secondary'}>{r.priority}</Badge><Badge variant="outline">{r.status}</Badge><Badge variant="secondary">{r.industrySector}</Badge></div>
                    <span className="text-xs text-muted-foreground">{r.location} &#8594; {r.transitDays}d</span>
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
          <Card className="ihd-chart-card"><CardHeader><CardTitle className="text-base">Heat Demand vs CO2 Reduction</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><LineChart data={tempVsCO2}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="plant" tick={{ fontSize: 9 }} /><YAxis yAxisId="left" /><YAxis yAxisId="right" orientation="right" /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="co2" stroke="#ea580c" strokeWidth={2} name="KtCO2/yr" /><Line yAxisId="right" type="monotone" dataKey="heat" stroke="#f97316" strokeWidth={2} name="GJ/day" /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="ihd-chart-card"><CardHeader><CardTitle className="text-base">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={zonePie} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }: { name: string; value: number }) => `${name}: ${value}`}><Cell fill="#ea580c" /><Cell fill="#f97316" /><Cell fill="#fb923c" /><Cell fill="#c2410c" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="ihd-chart-card"><CardHeader><CardTitle className="text-base">Investment by Sector (&#8377;Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={sectorCO2}><XAxis dataKey="sector" tick={{ fontSize: 10 }} /><YAxis /><Tooltip /><Bar dataKey="inv" fill="#c2410c" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="ihd-chart-card"><CardHeader><CardTitle className="text-base">Status Overview</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={[{ name: 'In Transit', value: 7 }, { name: 'Delivered', value: 4 }, { name: 'Processing', value: 2 }, { name: 'Delayed', value: 1 }]} cx="50%" cy="50%" outerRadius={90} dataKey="value" label><Cell fill="#f97316" /><Cell fill="#22c55e" /><Cell fill="#f59e0b" /><Cell fill="#ef4444" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="ihd-insight-card"><CardHeader><CardTitle className="text-base">Steel + Petrochemical Dominance</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">JSW Steel H2-DRI (IHD-0001, 4.2 MtCO2/yr) and Reliance Jamnagar e-cracker (IHD-0005, 5.1 MtCO2/yr) together represent 41% of total portfolio CO2 reduction at &#8377;40,500Cr. These two mega-projects alone surpass the entire cement sector&apos;s reduction target, demonstrating that process heat decarbonization in steel and petrochemicals yields the highest climate impact per rupee invested.</p></CardContent></Card>
          <Card className="ihd-insight-card"><CardHeader><CardTitle className="text-base">Green Ammonia as Cross-Sector Enabler</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">GSFC Vadodara&apos;s green H2 ammonia plant (IHD-0007) at &#8377;6,500Cr produces 1.5 MtCO2/yr reduction while simultaneously enabling fertilizer, shipping, and power sectors. This cross-sector decarbonization hub model &#8212; where a single green H2 plant serves multiple industries &#8212; maximizes CO2 leverage and should be replicated at NALCO, RCF, and NFL sites.</p></CardContent></Card>
          <Card className="ihd-insight-card"><CardHeader><CardTitle className="text-base">Low-Temperature Heat is Under-Exploited</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Sugar (IHD-0010) and textile (IHD-0012) sectors with process heat below 200&#176;C offer the fastest ROI for electrification via heat pumps and MVR. Combined investment of &#8377;530Cr yields 275 KtCO2/yr &#8212; a CO2/rupee ratio 4.8x better than steel. Government should prioritize these low-hanging fruits under the PM-USTRA scheme for immediate climate impact.</p></CardContent></Card>
          <Card className="ihd-insight-card"><CardHeader><CardTitle className="text-base">EU CBAM Impact on Indian Exports</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">With EU CBAM at &#8377;4,800/tonne CO2, unmitigated steel and aluminium exports face &#8377;19,200Cr annual carbon tariff burden. The combined green steel (JSW) and green aluminium (Adani) investments of &#8377;28,300Cr will eliminate this exposure while positioning India as a zero-carbon metals exporter. Cement and ceramics face similar CBAM phasing by 2030.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
