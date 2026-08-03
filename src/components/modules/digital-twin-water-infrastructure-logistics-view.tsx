'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface DTWIRecord {
  id: string;
  projectId: string;
  city: string;
  waterSystem: string;
  twinPlatform: string;
  sensorType: string;
  pipeLengthKm: number;
  waterSavedMLD: number;
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

const records: DTWIRecord[] = [
  { id: 'DTWI-0001', projectId: 'DTWI-D26DEL', city: 'Delhi', waterSystem: 'Wazirabad-Wazirabad Ring Main', twinPlatform: 'Bentley iTwin + IoT SCADA', sensorType: 'Ultrasonic Flow + Pressure', pipeLengthKm: 145, waterSavedMLD: 320, investmentCr: 850, status: 'In Transit', priority: 'Critical', origin: 'DJB Kakardooma', destination: 'Wazirabad Treatment Plant', shipDate: '2026-07-28', transitDays: 2, zone: 'North', remarks: '145 km Delhi ring main digital twin with 2,800 IoT sensors monitoring pressure, flow and quality &#8594; 320 MLD non-revenue water reduction saving &#8377;420Cr/yr. Real-time burst detection with AI leak prediction covering 35 lakh citizens in Delhi-NCR water network' },
  { id: 'DTWI-0002', projectId: 'DTWI-M26MUM', city: 'Mumbai', waterSystem: 'Tansa Lake to Bhandup Complex', twinPlatform: 'Siemens MindSphere + GIS', sensorType: 'Acoustic Leak + Turbidity', pipeLengthKm: 120, waterSavedMLD: 280, investmentCr: 720, status: 'Delivered', priority: 'Critical', origin: 'BMC Hydraulic Eng Depot', destination: 'Bhandup Water Complex', shipDate: '2026-07-10', transitDays: 1, zone: 'West', remarks: '120 km Mumbai bulk supply digital twin &#8594; 280 MLD water saved from leak detection on Tansa-Vihar-Powai chain. Acoustic sensors detect pinhole leaks at 0.5 L/min resolution &#8594; preventing 40% of pipe burst events across 1.2 crore Mumbaikars' },
  { id: 'DTWI-0003', projectId: 'DTWI-B26BLR', city: 'Bengaluru', waterSystem: 'Cauvery Stage IV + Groundwater Grid', twinPlatform: 'Aqwise SmartWater + AWS IoT', sensorType: 'Level + Flow + Quality Multi-Param', pipeLengthKm: 95, waterSavedMLD: 210, investmentCr: 580, status: 'Processing', priority: 'High', origin: 'BWSSB Head Office', destination: 'TK Halli Pumping Station', shipDate: '2026-08-01', transitDays: 2, zone: 'South', remarks: '95 km Cauvery IV digital twin with groundwater integration &#8594; 210 MLD saved from优化 pumping schedules. AI-driven demand forecasting for 1.2 crore Bengaluru residents facing acute water scarcity &#8594; zero waste water target by 2027' },
  { id: 'DTWI-0004', projectId: 'DTWI-C26CHN', city: 'Chennai', waterSystem: 'Minjur Desalination + Veeranam Pipeline', twinPlatform: 'Schneider EcoStruxure + Azure', sensorType: 'Conductivity + Chlorine + Flow', pipeLengthKm: 110, waterSavedMLD: 190, investmentCr: 650, status: 'In Transit', priority: 'High', origin: 'CMWSSB Anna Nagar', destination: 'Minjur Desal Plant', shipDate: '2026-07-26', transitDays: 1, zone: 'South', remarks: '110 km Chennai desal&#8594;reservoir twin network &#8594; 190 MLD optimization on Minjur 100 MLD + Nemmeli 150 MLD plants. Predictive maintenance reduces downtime by 60% &#8594; crucial for rain-dependent Chennai&apos;s 65 lakh citizens water security' },
  { id: 'DTWI-0005', projectId: 'DTWI-H26HYD', city: 'Hyderabad', waterSystem: 'Krishna Phase I + Manjeera Scheme', twinPlatform: 'Itron WaterLogic + HCL IoT', sensorType: 'Pressure + Acoustic + SCADA', pipeLengthKm: 135, waterSavedMLD: 175, investmentCr: 480, status: 'Delivered', priority: 'High', origin: 'HMWSSB Khairatabad', destination: 'Nagarjuna Sagar Intake', shipDate: '2026-07-08', transitDays: 2, zone: 'South', remarks: '135 km Hyderabad Krishna supply twin &#8594; 175 MLD NRW reduction through real-time pressure management. AI-based demand prediction for 80 lakh citizens with variable speed pumping &#8594; 22% energy savings on &#8377;12,000Cr annual water budget' },
  { id: 'DTWI-0006', projectId: 'DTWI-K26KOL', city: 'Kolkata', waterSystem: 'Palta Water Works + Garden Reach', twinPlatform: 'GE Digital + Predix', sensorType: 'Turbidity + pH + Chlorine', pipeLengthKm: 105, waterSavedMLD: 160, investmentCr: 420, status: 'Delayed', priority: 'High', origin: 'KMC Water Supply Depot', destination: 'Palta Water Works', shipDate: '2026-07-18', transitDays: 2, zone: 'East', remarks: '105 km Kolkata surface water twin &#8594; 160 MLD saved from Palta 300 MLD plant optimization. Real-time water quality monitoring for 50 lakh citizens along Hooghly &#8594; early arsenic contamination alerts reducing health risks in 12 boroughs' },
  { id: 'DTWI-0007', projectId: 'DTWI-A26AHM', city: 'Ahmedabad', waterSystem: 'Sabarmati Riverfront + Raska Pipeline', twinPlatform: 'OptiWater + Google Cloud IoT', sensorType: 'Flow + Level + Pump Efficiency', pipeLengthKm: 85, waterSavedMLD: 140, investmentCr: 350, status: 'Delivered', priority: 'High', origin: 'AMC Water Department', destination: 'Raska Water Treatment', shipDate: '2026-07-14', transitDays: 1, zone: 'West', remarks: '85 km Ahmedabad water supply twin &#8594; 140 MLD saved from Sabarmati canal network optimization. Integrated riverfront&#8594;treatment plant&#8594;distribution model for 80 lakh Amdavadis &#8594; India&apos;s first city to connect river ecology with digital water management' },
  { id: 'DTWI-0008', projectId: 'DTWI-P26PUN', city: 'Pune', waterSystem: 'Khadakwasla + Panshet Dam Network', twinPlatform: 'DHI MIKE + Bentley OpenFlows', sensorType: 'Rain Gauge + Level + Telemetry', pipeLengthKm: 78, waterSavedMLD: 125, investmentCr: 290, status: 'In Transit', priority: 'Medium', origin: 'PMC Navi Peth Depot', destination: 'Khadakwasla Pump House', shipDate: '2026-07-25', transitDays: 1, zone: 'West', remarks: '78 km Pune dam&#8594;city supply twin &#8594; 125 MLD saved with flood&#8594;supply integrated model. AI predicts dam release timing &#8594; optimizes treatment for 55 lakh Punekars. Critical during monsoon when 90% annual rainfall occurs in 3 months' },
  { id: 'DTWI-0009', projectId: 'DTWI-J26JPR', city: 'Jaipur', waterSystem: 'Bisalpur Dam + Filtration Plant', twinPlatform: 'Tata DigiWater + AWS', sensorType: 'Flow + Pressure + Reservoir Level', pipeLengthKm: 92, waterSavedMLD: 105, investmentCr: 310, status: 'Delivered', priority: 'Medium', origin: 'PHED Jawahar Nagar', destination: 'Bisalpur Treatment Plant', shipDate: '2026-07-12', transitDays: 2, zone: 'North', remarks: '92 km Jaipur Bisalpur supply twin &#8594; 105 MLD NRW reduction for 45 lakh Jaipur residents. Real-time reservoir monitoring prevents over-extraction &#8594; critical for Thar-adjacent desert city dependent on single dam source' },
  { id: 'DTWI-0010', projectId: 'DTWI-L26LKO', city: 'Lucknow', waterSystem: 'Gomti River Treatment + Haidergarh', twinPlatform: 'L&amp;T Smart City + SAP IoT', sensorType: 'Multi-Param Probe + SCADA', pipeLengthKm: 88, waterSavedMLD: 95, investmentCr: 260, status: 'Processing', priority: 'Medium', origin: 'Jal Nigam Lal Kothi', destination: 'Haidergarh Intake', shipDate: '2026-08-02', transitDays: 2, zone: 'North', remarks: '88 km Lucknow Gomti river supply twin &#8594; 95 MLD optimization for 45 lakh Lucknow residents. Integrated surface&#8594;groundwater model with Gomti pollution tracking &#8594; ensuring treated water meets WHO standards for smart city infrastructure' },
  { id: 'DTWI-0011', projectId: 'DTWI-I26IND', city: 'Indore', waterSystem: 'Narmada Phase III + Yashvant Sagar', twinPlatform: 'e-Governance Smart Water + Azure', sensorType: 'Flow + Pressure + Energy Meter', pipeLengthKm: 72, waterSavedMLD: 88, investmentCr: 220, status: 'Delivered', priority: 'Medium', origin: 'IMC Water Works Nanda Nagar', destination: 'Narmada Pump Station', shipDate: '2026-07-08', transitDays: 2, zone: 'West', remarks: '72 km Indore Narmada supply twin &#8594; 88 MLD saved for 35 lakh Indore residents. India&apos;s cleanest city leverages digital twin for 24/7 supply guarantee &#8594; energy optimization on 3-stage pumping from 320 km distance' },
  { id: 'DTWI-0012', projectId: 'DTWI-V26VIZ', city: 'Visakhapatnam', waterSystem: 'Mudasarlova + Raiwada Intake', twinPlatform: 'Hitachi Lumada + Bosch IoT', sensorType: 'Acoustic + Pressure + SCADA RTU', pipeLengthKm: 65, waterSavedMLD: 72, investmentCr: 185, status: 'In Transit', priority: 'Medium', origin: 'VMWSSB MVDM Office', destination: 'Mudasarlova Filter Bed', shipDate: '2026-07-24', transitDays: 2, zone: 'South', remarks: '65 km Vizag supply twin &#8594; 72 MLD saved for 22 lakh Visakhapatnam residents. Coastal city with cyclone-vulnerable network &#8594; digital twin enables pre-cyclone shutdown protocols and rapid post-disaster recovery within 48 hours' },
  { id: 'DTWI-0013', projectId: 'DTWI-S26SUR', city: 'Surat', waterSystem: 'Tapi River Scheme + Kakrapar Pipeline', twinPlatform: 'AquaGenx + Cisco Kinetic', sensorType: 'Flow + Quality + Pump VFD', pipeLengthKm: 68, waterSavedMLD: 80, investmentCr: 195, status: 'Delivered', priority: 'Medium', origin: 'SMC Water Works Athwa', destination: 'Kakrapar Intake', shipDate: '2026-07-12', transitDays: 1, zone: 'West', remarks: '68 km Surat Tapi supply twin &#8594; 80 MLD saved for 70 lakh Surat residents. Textile hub with high TDS demand &#8594; real-time quality blending ensures industrial and domestic supply standards maintained simultaneously' },
  { id: 'DTWI-0014', projectId: 'DTWI-B26BBS', city: 'Bhubaneswar', waterSystem: 'Daya West Canal + Jharana Reservoir', twinPlatform: 'WAPCOS HydroNet + Oracle IoT', sensorType: 'Level + Flow + Valve Actuator', pipeLengthKm: 58, waterSavedMLD: 62, investmentCr: 155, status: 'In Transit', priority: 'Medium', origin: 'PHED Bhubaneswar Saheed Nagar', destination: 'Jharana Treatment Plant', shipDate: '2026-07-27', transitDays: 2, zone: 'East', remarks: '58 km Bhubaneswar Daya canal twin &#8594; 62 MLD saved for 18 lakh Bhubaneswar residents. Smart city capital with temple heritage &#8594; digital twin integrates ancient Kalinga water management principles with modern IoT for sustainable supply' },
];

const COLORS = ['#0891b2', '#06b6d4', '#22d3ee', '#67e8f9', '#0e7490', '#155e75', '#164e63', '#083344'];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 5 }, { value: 'Delivered', count: 5 }, { value: 'Processing', count: 2 }, { value: 'Delayed', count: 1 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 2 }, { value: 'High', count: 5 }, { value: 'Medium', count: 7 },
  ]},
  { label: 'Twin Platform', key: 'twinPlatform', options: [
    { value: 'Bentley iTwin + IoT SCADA', count: 1 }, { value: 'Siemens MindSphere + GIS', count: 1 }, { value: 'Aqwise SmartWater + AWS IoT', count: 1 }, { value: 'Schneider EcoStruxure + Azure', count: 1 }, { value: 'Itron WaterLogic + HCL IoT', count: 1 }, { value: 'GE Digital + Predix', count: 1 }, { value: 'OptiWater + Google Cloud IoT', count: 1 }, { value: 'DHI MIKE + Bentley OpenFlows', count: 1 }, { value: 'Tata DigiWater + AWS', count: 1 }, { value: 'L&T Smart City + SAP IoT', count: 1 }, { value: 'e-Governance Smart Water + Azure', count: 1 }, { value: 'Hitachi Lumada + Bosch IoT', count: 1 }, { value: 'AquaGenx + Cisco Kinetic', count: 1 }, { value: 'WAPCOS HydroNet + Oracle IoT', count: 1 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'North', count: 3 }, { value: 'South', count: 4 }, { value: 'West', count: 4 }, { value: 'East', count: 3 },
  ]},
];

export default function DigitalTwinWaterInfrastructureLogisticsView() {
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
    return records.filter((r: DTWIRecord) => {
      const matchSearch = !searchQuery || r.id.toLowerCase().includes(searchQuery.toLowerCase()) || r.city.toLowerCase().includes(searchQuery.toLowerCase()) || r.waterSystem.toLowerCase().includes(searchQuery.toLowerCase());
      const matchFilters = Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(String(r[key as keyof DTWIRecord])));
      return matchSearch && matchFilters;
    });
  }, [searchQuery, activeFilters]);

  const totalPipe = records.reduce((s, r) => s + r.pipeLengthKm, 0);
  const totalSaved = records.reduce((s, r) => s + r.waterSavedMLD, 0);
  const totalInv = records.reduce((s, r) => s + r.investmentCr, 0);
  const avgSaved = (totalSaved / records.length).toFixed(0);

  const kpiData = [
    { label: 'Pipe Network Covered', value: `${totalPipe.toLocaleString()} km`, sub: 'Across 14 Indian Cities' },
    { label: 'Daily Water Saved', value: `${totalSaved.toLocaleString()} MLD`, sub: 'Non-Revenue Water Reduction' },
    { label: 'Avg Savings per City', value: `${avgSaved} MLD`, sub: 'Per Digital Twin Deployment' },
    { label: 'Total Investment', value: `&#8377;${totalInv.toLocaleString()}Cr`, sub: 'National Smart Water Mission' },
  ];

  const cityData = useMemo(() => records.map(r => ({ city: r.city, saved: r.waterSavedMLD, pipe: r.pipeLengthKm })).sort((a, b) => b.saved - a.saved), []);
  const zonePie = useMemo(() => {
    const m: Record<string, number> = {};
    records.forEach(r => { m[r.zone] = (m[r.zone] || 0) + 1; });
    return Object.entries(m).map(([k, v]) => ({ name: k, value: v }));
  }, []);
  const pipeVsSavings = useMemo(() => records.map(r => ({ city: r.city, pipe: r.pipeLengthKm, saved: r.waterSavedMLD })), []);

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard' },
    { id: 'registry' as const, label: 'Registry' },
    { id: 'analytics' as const, label: 'Analytics' },
    { id: 'insights' as const, label: 'Insights' },
  ];

  return (
    <div className="space-y-4 dtwi-logistics-view">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Digital Twin Water Infrastructure' }]} />
      <PageHeader title="Digital Twin Water Infrastructure Logistics" description="AI-powered virtual replicas of urban water supply networks for real-time monitoring, leak detection &amp; NRW reduction across India" />

      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === t.id ? 'bg-[#0891b2] text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiData.map((kpi, i) => (
              <Card key={i} className="dtwi-kpi-card">
                <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{kpi.label}</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold text-[#0891b2]" dangerouslySetInnerHTML={{ __html: kpi.value }} /><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="dtwi-chart-card"><CardHeader><CardTitle className="text-base">Water Savings by City (MLD)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cityData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="city" tick={{ fontSize: 10 }} /><YAxis /><Tooltip /><Bar dataKey="saved" fill="#0891b2" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
            <Card className="dtwi-chart-card"><CardHeader><CardTitle className="text-base">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={zonePie} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }: { name: string; value: number }) => `${name}: ${value}`}><Cell fill="#0891b2" /><Cell fill="#06b6d4" /><Cell fill="#22d3ee" /><Cell fill="#0e7490" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          </div>
        </div>
      )}

      {(activeTab === 'registry' || activeTab === 'dashboard') && (
        <Card className={activeTab === 'dashboard' ? '' : 'dtwi-chart-card'}>
          <CardHeader><CardTitle className="text-base">{activeTab === 'registry' ? 'Digital Twin Project Registry' : 'Recent Shipments'}</CardTitle></CardHeader>
          <CardContent>
            <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={clearAllFilters} totalItems={records.length} filteredCount={filteredRecords.length} />
            <div className="mt-4 space-y-2 max-h-[600px] overflow-y-auto">
              {(activeTab === 'dashboard' ? filteredRecords.slice(0, 5) : filteredRecords).map((r) => (
                <div key={r.id} className={`p-3 rounded-lg border text-sm ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-[#0891b2] bg-cyan-50/20'}`}>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2"><span className="font-mono font-medium">{r.id}</span><Badge variant={r.priority === 'Critical' ? 'destructive' : 'secondary'}>{r.priority}</Badge><Badge variant="outline">{r.status}</Badge></div>
                    <span className="text-xs text-muted-foreground">{r.city} &#8594; {r.transitDays}d | {r.pipeLengthKm} km | {r.waterSavedMLD} MLD saved</span>
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
          <Card className="dtwi-chart-card"><CardHeader><CardTitle className="text-base">Pipe Length vs Water Savings</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><LineChart data={pipeVsSavings}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="city" tick={{ fontSize: 9 }} /><YAxis yAxisId="left" /><YAxis yAxisId="right" orientation="right" /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="pipe" stroke="#0891b2" strokeWidth={2} name="Pipe (km)" /><Line yAxisId="right" type="monotone" dataKey="saved" stroke="#0e7490" strokeWidth={2} name="Saved (MLD)" /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="dtwi-chart-card"><CardHeader><CardTitle className="text-base">Investment Efficiency (MLD per &#8377;Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={records.map(r => ({ city: r.city, eff: +(r.waterSavedMLD / r.investmentCr).toFixed(3) }))}><XAxis dataKey="city" tick={{ fontSize: 10 }} /><YAxis /><Tooltip /><Bar dataKey="eff" fill="#06b6d4" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="dtwi-chart-card"><CardHeader><CardTitle className="text-base">Sensor Network by Zone</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={Object.entries(records.reduce((m, r) => { m[r.zone] = (m[r.zone] || 0) + r.pipeLengthKm; return m; }, {})).map(([k, v]) => ({ zone: k, pipeKm: v }))}><XAxis dataKey="zone" /><YAxis /><Tooltip /><Bar dataKey="pipeKm" fill="#0e7490" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="dtwi-chart-card"><CardHeader><CardTitle className="text-base">Status Overview</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={[{ name: 'In Transit', value: 5 }, { name: 'Delivered', value: 5 }, { name: 'Processing', value: 2 }, { name: 'Delayed', value: 1 }]} cx="50%" cy="50%" outerRadius={90} dataKey="value" label><Cell fill="#0891b2" /><Cell fill="#22c55e" /><Cell fill="#f59e0b" /><Cell fill="#ef4444" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="dtwi-insight-card"><CardHeader><CardTitle className="text-base">Delhi Leads with 320 MLD Savings</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Delhi&apos;s Wazirabad ring main digital twin (DTWI-0001) achieves the highest water savings at 320 MLD across 145 km of piped network. At &#8377;850Cr investment, the annual NRW savings of &#8377;420Cr deliver payback in under 2 years &#8212; the fastest ROI among all Indian deployments. The 2,800-sensor IoT grid provides 15-second resolution data for burst detection.</p></CardContent></Card>
          <Card className="dtwi-insight-card"><CardHeader><CardTitle className="text-base">Mumbai Acoustic Leak Detection Benchmark</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Mumbai&apos;s Tansa-Bhandup corridor (DTWI-0002) sets the benchmark for acoustic leak detection with 0.5 L/min pinhole resolution across 120 km of century-old pipes. The Siemens MindSphere platform has prevented 40% of burst events since 2025 &#8594; critical for Mumbai where pipe bursts cause massive flooding during monsoon in low-lying areas like Dadar and Parel.</p></CardContent></Card>
          <Card className="dtwi-insight-card"><CardHeader><CardTitle className="text-base">Bengaluru Groundwater Integration Model</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Bengaluru&apos;s Cauvery IV + groundwater digital twin (DTWI-0003) uniquely integrates surface supply with aquifer monitoring &#8594; a first in India. The AWS IoT platform tracks 4,500 borewells alongside Cauvery supply &#8594; optimizing the city&apos;s 50:50 surface-groundwater ratio. Critical for Bengaluru&apos;s 1.2 crore residents facing 70% groundwater depletion.</p></CardContent></Card>
          <Card className="dtwi-insight-card"><CardHeader><CardTitle className="text-base">National Smart Water Mission Opportunity</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Total portfolio of 1,316 km monitored and 2,102 MLD daily savings across 14 cities at &#8377;6,375Cr represents &#8377;3.03 per liter saved annually. Scaling to India&apos;s 100 most water-stressed cities could save 15,000 MLD &#8594; enough to supply 15 crore people &#8594; at &#8377;45,000Cr investment. This is less than 0.5% of India&apos;s annual water infrastructure budget but addresses 40% of NRW losses.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
