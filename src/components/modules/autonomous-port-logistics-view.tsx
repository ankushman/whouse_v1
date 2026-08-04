'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface APLRecord {
  id: string;
  projectId: string;
  port: string;
  terminal: string;
  operator: string;
  systemType: string;
  throughputTEU: number;
  automationLevel: number;
  costReduction: number;
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

const records: APLRecord[] = [
  { id: 'APL-0001', projectId: 'APL-M26MUM1', port: 'Mumbai', terminal: 'JNPT Container Terminal 4', operator: 'DP World + APM Terminals', systemType: 'Fully Automated RTG + AGV Fleet', throughputTEU: 2400000, automationLevel: 95, costReduction: 42, investmentCr: 1850, status: 'In Transit', priority: 'Critical', origin: 'DP World Head Office Fort', destination: 'JNPT Nhava Sheva Terminal', shipDate: '2026-07-28', transitDays: 1, zone: 'West', remarks: 'India&apos;s first fully autonomous container terminal at JNPT &#8594; 2.4M TEU capacity with 95% automation. 42 automated RTG cranes + 60 AGVs + AI-powered yard planning eliminate manual handling. 42% cost reduction per TEU from &#8377;8,500 to &#8377;4,930. &#8377;1,850Cr investment &#8594; handles 35% of India&apos;s container trade. Turnaround time reduced from 72 hours to 18 hours &#8594; JNPT targets 10M TEU by 2028 with terminal expansion' },
  { id: 'APL-0002', projectId: 'APL-C26CHN1', port: 'Chennai', terminal: 'V.O. Chidambaranar Port Terminal', operator: 'PSA International + L&amp;T', systemType: 'Semi-Auto QC + Automated Stacking', throughputTEU: 1200000, automationLevel: 78, costReduction: 32, investmentCr: 980, status: 'Delivered', priority: 'Critical', origin: 'PSA Chennai Royapuram', destination: 'Chennai Port Ennore', shipDate: '2026-07-10', transitDays: 1, zone: 'South', remarks: 'Chennai port&apos;s semi-autonomous terminal &#8594; 1.2M TEU with automated quay cranes and stacking. 78% automation achieves 32% cost reduction. L&amp;T-built automated stacking cranes with computer vision container identification. &#8377;980Cr investment &#8594; serves Chennai auto hub exports (Hyundai, Ford, Renault-Nissan). Average gate turnaround reduced from 4 hours to 45 minutes &#8594; truck queuing eliminated with automated appointment system' },
  { id: 'APL-0003', projectId: 'APL-G26GAU1', port: 'Gujarat', terminal: 'Mundra Port West Terminal', operator: 'Adani Ports + Siemens', systemType: 'Fully Automated ASC + Rail Loader', throughputTEU: 3200000, automationLevel: 98, costReduction: 48, investmentCr: 2400, status: 'Processing', priority: 'Critical', origin: 'Adani Ports HQ Ahmedabad', destination: 'Mundra West Terminal', shipDate: '2026-08-01', transitDays: 2, zone: 'West', remarks: 'India&apos;s largest automated terminal at Mundra &#8594; 3.2M TEU with 98% automation and Siemens digital twin. Automated rail-mounted stacking cranes with AI berth planning &#8594; 48% cost reduction per TEU. &#8377;2,400Cr investment &#8594; integrates with Western Dedicated Freight Corridor for direct port-rail automated loading. Mundra targets 25M TEU total by 2028 &#8594; this terminal anchors India&apos;s export competitiveness against Colombo and Singapore' },
  { id: 'APL-0004', projectId: 'APL-K26KOL1', port: 'Kolkata', terminal: 'Syama Prasad Mookerjee Port Haldia', operator: 'Kolkata Port Trust + Tata Projects', systemType: 'IoT-Enabled Smart Gates + Auto-RTG', throughputTEU: 650000, automationLevel: 55, costReduction: 22, investmentCr: 420, status: 'In Transit', priority: 'High', origin: 'KoPT Strand Road', destination: 'Haldia Dock Complex', shipDate: '2026-07-26', transitDays: 2, zone: 'East', remarks: 'Kolkata-Haldia IoT-enabled smart terminal &#8594; 650K TEU with 55% automation focusing on gate optimization and RTG automation. Smart RFID gates reduce truck entry time from 45 to 8 minutes. &#8377;420Cr investment &#8594; serves eastern India&apos;s coal, jute and tea exports. Haldia&apos;s tidal challenges require automated draft monitoring &#8594; real-time tide prediction AI optimizes vessel scheduling. Cost reduction of 22% modest but critical for Haldia&apos;s aging infrastructure modernization' },
  { id: 'APL-0005', projectId: 'APL-V26VIZ1', port: 'Visakhapatnam', terminal: 'Vizag Port Container Terminal', operator: 'Visakhapatnam Port + Honeywell', systemType: 'Smart Port Platform + IoT Sensors', throughputTEU: 850000, automationLevel: 65, costReduction: 28, investmentCr: 550, status: 'Delivered', priority: 'High', origin: 'VPPL Gandhigram', destination: 'Vizag Inner Harbour Terminal', shipDate: '2026-07-08', transitDays: 1, zone: 'South', remarks: 'Vizag smart port terminal with Honeywell IoT platform &#8594; 850K TEU at 65% automation. 2,500 IoT sensors monitor container temperature, humidity and location in real-time &#8594; critical for pharma exports from Vizag pharma corridor. &#8377;550Cr investment &#8594; 28% cost reduction. Automated stowage planning reduces vessel turnaround by 30%. Vizag is India&apos;s fastest-growing port &#8594; this terminal supports East Coast economic corridor targeting 3M TEU by 2030' },
  { id: 'APL-0006', projectId: 'APL-T26TUT1', port: 'Tuticorin', terminal: 'V.O. Chidambaranar Port Tuticorin', operator: 'PSA SICAL + Kalmar', systemType: 'Automated Reach Stacker + Smart Gate', throughputTEU: 520000, automationLevel: 52, costReduction: 20, investmentCr: 310, status: 'Delivered', priority: 'High', origin: 'PSA SICAL Office', destination: 'Tuticorin North Terminal', shipDate: '2026-07-14', transitDays: 1, zone: 'South', remarks: 'Tuticorin semi-automated terminal &#8594; 520K TEU at 52% automation with Kalmar reach stackers and smart gates. Serves Tamil Nadu textile and automotive component exports. &#8377;310Cr investment &#8594; 20% cost reduction per TEU. Automated document processing with blockchain-based bill of lading reduces paperwork by 80%. Tuticorin-Colombo short sea route integration enables transshipment optimization &#8594; competing with Colombo port for Indian cargo' },
  { id: 'APL-0007', projectId: 'APL-N26NGP1', port: 'Nagpur', terminal: 'Multi-Modal International Cargo Hub (MIHAN)', operator: 'MIHAN Development + AAI', systemType: 'Air-Rail Automated Transfer + Smart Warehouse', throughputTEU: 380000, automationLevel: 72, costReduction: 35, investmentCr: 380, status: 'Delivered', priority: 'High', origin: 'MIHAN SEZ Office', destination: 'MIHAN Terminal Complex', shipDate: '2026-07-12', transitDays: 1, zone: 'West', remarks: 'Nagpur MIHAN India&apos;s first multi-modal automated hub &#8594; 380K TEU with air-rail automated cargo transfer. AI-powered sorting handles air containers (Boeing 747F) to rail in 45 minutes. &#8377;380Cr investment &#8594; 72% automation with 35% cost reduction. Central India&apos;s logistics gateway &#8594; connects JNPT, Chennai and Delhi via Western/Central rail corridors. Smart warehouse integration with automated storage and retrieval system for temperature-sensitive pharma and perishable cargo' },
  { id: 'APL-0008', projectId: 'APL-C26COC1', port: 'Cochin', terminal: 'Cochin International Container Terminal', operator: 'DP World Cochin + CIAL', systemType: 'Smart Terminal + Automated Gate + RFID', throughputTEU: 420000, automationLevel: 60, costReduction: 25, investmentCr: 285, status: 'In Transit', priority: 'Medium', origin: 'DP World Mattancherry', destination: 'Cochin Vallarpadam Terminal', shipDate: '2026-07-25', transitDays: 2, zone: 'South', remarks: 'Cochin Vallarpadam semi-automated terminal &#8594; 420K TEU at 60% automation. India&apos;s first port with integrated airport-seaport automated cargo chain &#8594; CIAL airport connects 500m from container terminal. &#8377;285Cr investment &#8594; 25% cost reduction. Automated gate system with OCR and RFID handles 200 trucks/hour. Cochin serves Kerala&apos;s spice, seafood and coir exports &#8594; cold chain automation critical for temperature-controlled perishable container management' },
  { id: 'APL-0009', projectId: 'APL-D26DL1', port: 'Delhi', terminal: 'Inland Container Depot (ICD) Tughlakabad', operator: 'CONCOR + DB Cargo', systemType: 'Rail-Auto Terminal + Smart Railyard', throughputTEU: 580000, automationLevel: 68, costReduction: 30, investmentCr: 340, status: 'Delivered', priority: 'Medium', origin: 'CONCOR ICD Tughlakabad', destination: 'ICD Patparganj Automated Yard', shipDate: '2026-07-08', transitDays: 1, zone: 'North', remarks: 'Delhi ICD Tughlakabad rail-auto terminal &#8594; 580K TEU at 68% automation with DB Cargo technology. Automated rail-mounted gantry cranes handle double-stack container trains from JNPT/Mundra in 4 hours vs 12 hours manual. &#8377;340Cr investment &#8594; 30% cost reduction. Smart railyard AI predicts container dwell time and optimizes stacking &#8594; reducing ICD dwell from 7 days to 3 days. Handles 25% of northern India&apos;s containerized trade' },
  { id: 'APL-0010', projectId: 'APL-B26BLR1', port: 'Bengaluru', terminal: 'ICD Whitefield + KIADB Logistics', operator: 'CONCOR + KIADB', systemType: 'Automated Warehouse + EV Fleet Logistics', throughputTEU: 320000, automationLevel: 70, costReduction: 33, investmentCr: 265, status: 'Processing', priority: 'Medium', origin: 'CONCOR ICD Whitefield', destination: 'KIADB Automated Logistics Park', shipDate: '2026-08-02', transitDays: 1, zone: 'South', remarks: 'Bengaluru ICD Whitefield automated logistics park &#8594; 320K TEU at 70% automation with automated warehousing and EV container movement fleet. First Indian ICD with zero-emission internal transport &#8594; 40 electric yard tractors replace diesel. &#8377;265Cr investment &#8594; 33% cost reduction. Serves Bengaluru IT-exports (electronics, pharma, aerospace). AI-powered container allocation reduces rehandling by 60% &#8594; fastest ICD turnaround in India at 28 hours' },
  { id: 'APL-0011', projectId: 'APL-H26HYD1', port: 'Hyderabad', terminal: 'ICD Patancheru + Pharma Terminal', operator: 'CONCOR + Natco Pharma', systemType: 'Cold Chain Automation + Smart Racking', throughputTEU: 280000, automationLevel: 75, costReduction: 38, investmentCr: 290, status: 'Delivered', priority: 'Medium', origin: 'CONCAR Patancheru', destination: 'ICD Pharma Cold Terminal', shipDate: '2026-07-12', transitDays: 1, zone: 'South', remarks: 'Hyderabad ICD Patancheru pharma-specialized automated terminal &#8594; 280K TEU at 75% automation with temperature-controlled cold chain. First Indian ICD with automated pharma-grade container inspection and storage. &#8377;290Cr investment &#8594; 38% cost reduction. IoT sensors monitor 2,000+ containers for temperature compliance (2-8&#176;C) with real-time alerts. Hyderabad is India&apos;s bulk drug capital &#8594; this terminal handles 40% of India&apos;s pharma exports requiring validated cold chain logistics' },
  { id: 'APL-0012', projectId: 'APL-A26AHM1', port: 'Ahmedabad', terminal: 'APM Terminals Pipavav', operator: 'APM Terminals + Gujarat Maritime', systemType: 'Automated Straddle Carrier + Smart Gate', throughputTEU: 720000, automationLevel: 62, costReduction: 27, investmentCr: 480, status: 'Delivered', priority: 'Medium', origin: 'APM Pipavav Office', destination: 'Pipavav Terminal Rajula', shipDate: '2026-07-12', transitDays: 2, zone: 'West', remarks: 'Gujarat Pipavav semi-automated terminal &#8594; 720K TEU at 62% automation with automated straddle carriers and smart gates. APM Terminals&apos; proven technology from Rotterdam adapted for Indian conditions &#8594; handles Gujarat&apos;s textile, ceramic and chemical container exports. &#8377;480Cr investment &#8594; 27% cost reduction. Smart gate processes 180 trucks/hour with pre-arrival customs clearance. Pipavav is India&apos;s west coast gateway for US-Europe trade &#8594; competing with JNPT for Maharashtra cargo' },
  { id: 'APL-0013', projectId: 'APL-P26PUN1', port: 'Pune', terminal: 'ICD Chakan Automotive Terminal', operator: 'CONCOR + Tata Motors', systemType: 'Auto-Carrier Automation + Smart Yard', throughputTEU: 350000, automationLevel: 58, costReduction: 24, investmentCr: 220, status: 'In Transit', priority: 'Medium', origin: 'CONCOR ICD Chakan', destination: 'Tata Motors Export Yard', shipDate: '2026-07-27', transitDays: 1, zone: 'West', remarks: 'Pune Chakan automotive-specialized terminal &#8594; 350K TEU at 58% automation with automated car carriers and smart yard management. Tata Motors and Bajaj auto export hub &#8594; automated RoRo containerization for completely built units and CKD kits. &#8377;220Cr investment &#8594; 24% cost reduction. Automated vehicle inspection with computer vision detects damage at 99.5% accuracy. Connected to JNPT and Pipavav via national highway &#8594; average transit 8 hours to JNPT' },
  { id: 'APL-0014', projectId: 'APL-L26LKO1', port: 'Lucknow', terminal: 'ICD Varanasi + Eastern Corridor Hub', operator: 'CONCOR + IRCON', systemType: 'Dedicated Freight Corridor + Smart Terminal', throughputTEU: 200000, automationLevel: 50, costReduction: 18, investmentCr: 165, status: 'Delivered', priority: 'Medium', origin: 'CONCOR ICD Varanasi', destination: 'Eastern DFC Inland Port', shipDate: '2026-07-08', transitDays: 2, zone: 'North', remarks: 'UP Eastern DFC corridor terminal at Varanasi &#8594; 200K TEU at 50% automation. India&apos;s first inland port connected to Dedicated Freight Corridor with automated rail handling. &#8377;165Cr investment &#8597; 18% cost reduction. Eastern DFC double-stack container trains reach Kolkata in 12 hours vs 48 hours by road. IRCON-built automated yard with rail-mounted cranes &#8594; serves UP&apos;s textile, carpet and agricultural export belt. Modernizes Varanasi as logistics gateway for Nepal-Bangladesh trade corridor' },
];

const COLORS = ['#0284c7', '#0ea5e9', '#38bdf8', '#7dd3fc', '#0369a1', '#075985', '#0c4a6e', '#082f49'];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 4 }, { value: 'Delivered', count: 8 }, { value: 'Processing', count: 2 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 3 }, { value: 'High', count: 4 }, { value: 'Medium', count: 7 },
  ]},
  { label: 'System Type', key: 'systemType', options: [
    { value: 'Fully Automated RTG + AGV Fleet', count: 1 }, { value: 'Semi-Auto QC + Automated Stacking', count: 1 }, { value: 'Fully Automated ASC + Rail Loader', count: 1 }, { value: 'IoT-Enabled Smart Gates + Auto-RTG', count: 1 }, { value: 'Smart Port Platform + IoT Sensors', count: 1 }, { value: 'Automated Reach Stacker + Smart Gate', count: 1 }, { value: 'Air-Rail Automated Transfer + Smart Warehouse', count: 1 }, { value: 'Smart Terminal + Automated Gate + RFID', count: 1 }, { value: 'Rail-Auto Terminal + Smart Railyard', count: 1 }, { value: 'Automated Warehouse + EV Fleet Logistics', count: 1 }, { value: 'Cold Chain Automation + Smart Racking', count: 1 }, { value: 'Automated Straddle Carrier + Smart Gate', count: 1 }, { value: 'Auto-Carrier Automation + Smart Yard', count: 1 }, { value: 'Dedicated Freight Corridor + Smart Terminal', count: 1 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'North', count: 3 }, { value: 'South', count: 5 }, { value: 'West', count: 5 }, { value: 'East', count: 1 },
  ]},
];

export default function AutonomousPortLogisticsView() {
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
    return records.filter((r: APLRecord) => {
      const matchSearch = !searchQuery || r.id.toLowerCase().includes(searchQuery.toLowerCase()) || r.port.toLowerCase().includes(searchQuery.toLowerCase()) || r.terminal.toLowerCase().includes(searchQuery.toLowerCase());
      const matchFilters = Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(String(r[key as keyof APLRecord])));
      return matchSearch && matchFilters;
    });
  }, [searchQuery, activeFilters]);

  const totalTEU = records.reduce((s, r) => s + r.throughputTEU, 0);
  const totalInv = records.reduce((s, r) => s + r.investmentCr, 0);
  const avgAuto = Math.round(records.reduce((s, r) => s + r.automationLevel, 0) / records.length);
  const avgCost = Math.round(records.reduce((s, r) => s + r.costReduction, 0) / records.length);

  const kpiData = [
    { label: 'Total Throughput', value: `${(totalTEU / 1000000).toFixed(1)}M TEU`, sub: 'Container Handling Capacity' },
    { label: 'Avg Automation Level', value: `${avgAuto}%`, sub: 'Across 14 Port Terminals' },
    { label: 'Avg Cost Reduction', value: `${avgCost}%`, sub: 'Per TEU Operating Cost' },
    { label: 'Total Investment', value: `&#8377;${totalInv.toLocaleString()}Cr`, sub: 'Smart Port Infrastructure' },
  ];

  const portData = useMemo(() => records.map(r => ({ port: r.port, teu: r.throughputTEU, auto: r.automationLevel })).sort((a, b) => b.teu - a.teu), []);
  const zonePie = useMemo(() => {
    const m: Record<string, number> = {};
    records.forEach(r => { m[r.zone] = (m[r.zone] || 0) + 1; });
    return Object.entries(m).map(([k, v]) => ({ name: k, value: v }));
  }, []);
  const teuVsAuto = useMemo(() => records.map(r => ({ port: r.port, teu: r.throughputTEU, auto: r.automationLevel })), []);

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard' },
    { id: 'registry' as const, label: 'Registry' },
    { id: 'analytics' as const, label: 'Analytics' },
    { id: 'insights' as const, label: 'Insights' },
  ];

  return (
    <div className="space-y-4 apl-logistics-view">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Autonomous Port' }]} />
      <PageHeader title="Autonomous Port Logistics" description="Smart container terminals with automated RTG cranes, AGV fleets, IoT platforms and AI-powered yard management for India&apos;s major ports and inland container depots" />

      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === t.id ? 'bg-[#0284c7] text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiData.map((kpi, i) => (
              <Card key={i} className="apl-kpi-card">
                <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{kpi.label}</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold text-[#0284c7]" dangerouslySetInnerHTML={{ __html: kpi.value }} /><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="apl-chart-card"><CardHeader><CardTitle className="text-base">Throughput by Port (TEU)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={portData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="port" tick={{ fontSize: 10 }} /><YAxis /><Tooltip /><Bar dataKey="teu" fill="#0284c7" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
            <Card className="apl-chart-card"><CardHeader><CardTitle className="text-base">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={zonePie} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }: { name: string; value: number }) => `${name}: ${value}`}><Cell fill="#0284c7" /><Cell fill="#0ea5e9" /><Cell fill="#38bdf8" /><Cell fill="#0369a1" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          </div>
        </div>
      )}

      {(activeTab === 'registry' || activeTab === 'dashboard') && (
        <Card className={activeTab === 'dashboard' ? '' : 'apl-chart-card'}>
          <CardHeader><CardTitle className="text-base">{activeTab === 'registry' ? 'Autonomous Port Terminal Registry' : 'Recent Shipments'}</CardTitle></CardHeader>
          <CardContent>
            <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={clearAllFilters} totalItems={records.length} filteredCount={filteredRecords.length} />
            <div className="mt-4 space-y-2 max-h-[600px] overflow-y-auto">
              {(activeTab === 'dashboard' ? filteredRecords.slice(0, 5) : filteredRecords).map((r) => (
                <div key={r.id} className={`p-3 rounded-lg border text-sm ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-[#0284c7] bg-sky-50/20'}`}>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2"><span className="font-mono font-medium">{r.id}</span><Badge variant={r.priority === 'Critical' ? 'destructive' : 'secondary'}>{r.priority}</Badge><Badge variant="outline">{r.status}</Badge></div>
                    <span className="text-xs text-muted-foreground">{r.port} &#8594; {r.transitDays}d | {r.automationLevel}% auto | {r.costReduction}% cost &#8595;</span>
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
          <Card className="apl-chart-card"><CardHeader><CardTitle className="text-base">Throughput vs Automation Level</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><LineChart data={teuVsAuto}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="port" tick={{ fontSize: 9 }} /><YAxis yAxisId="left" /><YAxis yAxisId="right" orientation="right" /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="teu" stroke="#0284c7" strokeWidth={2} name="Throughput (TEU)" /><Line yAxisId="right" type="monotone" dataKey="auto" stroke="#0369a1" strokeWidth={2} name="Automation (%)" /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="apl-chart-card"><CardHeader><CardTitle className="text-base">Cost Reduction vs Investment (&#8377;Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={records.map(r => ({ port: r.port, cost: r.costReduction, inv: r.investmentCr }))}><XAxis dataKey="port" tick={{ fontSize: 10 }} /><YAxis yAxisId="left" /><YAxis yAxisId="right" orientation="right" /><Tooltip /><Legend /><Bar yAxisId="left" dataKey="cost" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Cost Reduction (%)" /><Bar yAxisId="right" dataKey="inv" fill="#0369a1" radius={[4, 4, 0, 0]} name="Investment (Cr)" /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="apl-chart-card"><CardHeader><CardTitle className="text-base">Total TEU by Zone (Million)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.zone] = (m[r.zone] || 0) + r.throughputTEU; return m; }, {})).map(([k, v]) => ({ zone: k, teu: +(v / 1000000).toFixed(2) }))}><XAxis dataKey="zone" /><YAxis /><Tooltip /><Bar dataKey="teu" fill="#0369a1" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="apl-chart-card"><CardHeader><CardTitle className="text-base">Status Overview</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={[{ name: 'In Transit', value: 4 }, { name: 'Delivered', value: 8 }, { name: 'Processing', value: 2 }]} cx="50%" cy="50%" outerRadius={90} dataKey="value" label><Cell fill="#0284c7" /><Cell fill="#22c55e" /><Cell fill="#f59e0b" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="apl-insight-card"><CardHeader><CardTitle className="text-base">Mundradeva Sets India&apos;s Automation Benchmark at 98%</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Adani-Siemens Mundra West Terminal (APL-0003) achieves 98% automation &#8594; India&apos;s highest &#8594; with 3.2M TEU capacity. Siemens digital twin creates real-time virtual replica for predictive maintenance and berth optimization. 48% cost reduction from &#8377;8,500 to &#8377;4,420 per TEU &#8594; the lowest operating cost in India. Direct integration with Western Dedicated Freight Corridor enables port-to-rail automated container loading in 90 seconds per container &#8594; competing directly with Singapore and Colombo for transshipment traffic.</p></CardContent></Card>
          <Card className="apl-insight-card"><CardHeader><CardTitle className="text-base">JNPT Leads India&apos;s Container Automation Transformation</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">DP World JNPT Terminal 4 (APL-0001) is India&apos;s first fully autonomous container terminal with 42 automated RTG cranes and 60 AGVs. &#8377;1,850Cr investment delivers 42% cost reduction &#8594; handling 35% of India&apos;s container trade at 2.4M TEU. Turnaround reduced from 72 to 18 hours &#8594; enabling JNPT to target 10M TEU by 2028. The AI-powered yard planning system optimizes 50,000 container movements daily &#8594; reducing rehandling by 85% and crane idle time by 60%.</p></CardContent></Card>
          <Card className="apl-insight-card"><CardHeader><CardTitle className="text-base">Hyderabad Pharma Terminal: Cold Chain Automation Leader</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Hyderabad ICD Patancheru (APL-0011) is India&apos;s first pharma-grade automated cold chain terminal &#8594; 280K TEU at 75% automation monitoring 2,000+ containers for 2-8&#176;C compliance. IoT sensors with 15-second reporting intervals and automated alerts ensure WHO GDP compliance for India&apos;s &#8377;2.5 lakh crore pharma export industry. 38% cost reduction from automated inspection and storage &#8594; handling 40% of India&apos;s pharma container exports with validated temperature chain custody.</p></CardContent></Card>
          <Card className="apl-insight-card"><CardHeader><CardTitle className="text-base">National Maritime Agenda 2030: 50 Automated Terminals</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Portfolio of 13.07M TEU across 14 terminals at &#8377;8,630Cr demonstrates average automation of 68% and 30% cost reduction. India Maritime Vision 2030 targets 3,300M TEU port capacity with 50 automated terminals &#8594; requiring &#8377;85,000Cr investment. Current portfolio proves automation achieves 2-4x cost advantages over manual operations &#8594; critical for India to compete with Singapore (95% automated), Dubai (88%) and Shanghai (92%) for global transshipment traffic.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
