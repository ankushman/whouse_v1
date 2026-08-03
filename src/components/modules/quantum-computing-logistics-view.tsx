'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface QCLRecord {
  id: string;
  projectId: string;
  city: string;
  institution: string;
  partner: string;
  systemType: string;
  qubits: number;
  application: string;
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

const records: QCLRecord[] = [
  { id: 'QCL-0001', projectId: 'QCL-B26BLR1', city: 'Bengaluru', institution: 'ISRO Quantum Lab', partner: 'IBM Quantum + IISc', systemType: 'Superconducting Transmon 127-Qubit', qubits: 127, application: 'Satellite Communication Optimization', investmentCr: 450, status: 'In Transit', priority: 'Critical', origin: 'ISRO HQ Bengaluru', destination: 'IISc Quantum Computing Centre', shipDate: '2026-07-28', transitDays: 1, zone: 'South', remarks: 'India&apos;s flagship quantum computing lab at ISRO-IISc Bengaluru &#8594; 127-qubit superconducting processor for satellite communication optimization. IBM Quantum partnership provides cloud access to 433-qubit Eagle for algorithm development. &#8377;450Cr investment &#8594; optimizing ISRO&apos;s 54-satellite constellation scheduling with quantum annealing reduces orbital conflict resolution from 72 hours to 4 minutes. First quantum advantage demonstrated for Indian space missions' },
  { id: 'QCL-0002', projectId: 'QCL-H26HYD1', city: 'Hyderabad', institution: 'T-Hub Quantum AI Centre', partner: 'Google Quantum AI + IIIT Hyderabad', systemType: 'Superconducting Sycamore 72-Qubit', qubits: 72, application: 'Drug Discovery Molecular Simulation', investmentCr: 380, status: 'Delivered', priority: 'Critical', origin: 'T-Hub Madhapur', destination: 'IIIT Gachibowli Quantum Lab', shipDate: '2026-07-10', transitDays: 1, zone: 'South', remarks: 'Hyderabad T-Hub quantum AI centre deploys Google Sycamore-derived 72-qubit processor for pharmaceutical molecular simulation. &#8377;380Cr investment &#8594; simulating protein folding for Dr. Reddy&apos;s and Aurobindo Pharma drug candidates in hours vs months on classical HPC. Quantum VQE algorithms reduce molecule-ground-state calculation time by 1000x &#8594; accelerating COVID antiviral and oncology drug pipelines for India&apos;s &#8377;4.5 lakh crore pharma industry' },
  { id: 'QCL-0003', projectId: 'QCL-M26MUM1', city: 'Mumbai', institution: 'TIFR Quantum Computing Lab', partner: 'Microsoft Azure Quantum + TIFR', systemType: 'Topological Qubit Prototype 8-Qubit', qubits: 8, application: 'Financial Risk Modeling', investmentCr: 520, status: 'Processing', priority: 'Critical', origin: 'TIFR Colaba', destination: 'BSE Quantum Analytics Lab', shipDate: '2026-08-01', transitDays: 1, zone: 'West', remarks: 'TIFR-Microsoft India&apos;s first topological qubit lab &#8594; 8 qubits but with inherently error-protected topological architecture. &#8377;520Cr investment &#8594; targeting BSE-NSE portfolio optimization and options pricing with quantum Monte Carlo. RBI partnering for systemic risk simulation across 12 PSU banks &#8594; replacing classical stress tests that take 48 hours with quantum simulations in 30 minutes. India&apos;s gateway to fault-tolerant quantum computing' },
  { id: 'QCL-0004', projectId: 'QCL-D26DL1', city: 'Delhi', institution: 'IIT Delhi Quantum Centre', partner: 'D-Wave Systems + IITD', systemType: 'Quantum Annealing 5000-Qubit', qubits: 5000, application: 'Supply Chain Route Optimization', investmentCr: 290, status: 'In Transit', priority: 'High', origin: 'IITD Hauz Khas', destination: 'DIY Delhi Quantum Hub', shipDate: '2026-07-26', transitDays: 1, zone: 'North', remarks: 'IIT Delhi deploys D-Wave Advantage 5000-qubit quantum annealer for logistics optimization &#8594; India&apos;s largest qubit count system. &#8377;290Cr investment &#8594; optimizing military supply chain routes for 1.4M Indian Army personnel across 73 cantonments. Solves vehicle routing problems with 10,000+ nodes in 2 seconds vs 12 hours classical. Also deployed for Delhi traffic management optimization reducing commute time by 18% in pilot zones' },
  { id: 'QCL-0005', projectId: 'QCL-P26PUN1', city: 'Pune', institution: 'DRDO Quantum Tech Lab', partner: 'IQM Quantum + DRDO', systemType: 'Superconducting 54-Qubit', qubits: 54, application: 'Defense Cryptography QKD', investmentCr: 340, status: 'Delivered', priority: 'High', origin: 'DRDO DRDE Gwalior', destination: 'DRDO Pune QRDL', shipDate: '2026-07-08', transitDays: 2, zone: 'West', remarks: 'DRDO Pune quantum lab deploys IQM 54-qubit system for quantum key distribution and post-quantum cryptography &#8594; &#8377;340Cr investment. India&apos;s first quantum-secure military communication network between Delhi, Pune and Kolkata. QKD generates unhackable encryption keys at 1 Mbps over 500 km fiber &#8594; securing nuclear command authority communication. DRDO targets 1,000 km QKD network by 2028 for strategic forces communication' },
  { id: 'QCL-0006', projectId: 'QCL-C26CHN1', city: 'Chennai', institution: 'IIT Madras Quantum Foundry', partner: 'Rigetti Computing + IITM', systemType: 'Superconducting 80-Qubit', qubits: 80, application: 'Semiconductor Design Optimization', investmentCr: 310, status: 'Delivered', priority: 'High', origin: 'IITM Guindy', destination: 'IITM Research Park Taramani', shipDate: '2026-07-14', transitDays: 1, zone: 'South', remarks: 'IIT Madras quantum foundry deploys Rigetti 80-qubit Aspen processor for semiconductor chip design optimization &#8594; &#8377;310Cr investment. Optimizing VLSI placement and routing for SCL Chandigarh&apos;s 28nm fab &#8594; reducing chip design iteration time from 6 months to 2 weeks. Also deployed for IITM&apos;s Shakti RISC-V processor quantum-accelerated verification &#8594; critical for India&apos;s semiconductor self-reliance mission targeting &#8377;76,000Cr fab ecosystem' },
  { id: 'QCL-0007', projectId: 'QCL-A26AHM1', city: 'Ahmedabad', institution: 'IIT Gandhinagar Quantum Lab', partner: 'IonQ + IITGN', systemType: 'Trapped Ion 32-Qubit', qubits: 32, application: 'Climate Modeling Weather Prediction', investmentCr: 220, status: 'Delivered', priority: 'High', origin: 'IITGN Palaj Campus', destination: 'Gujarat IMD Quantum Unit', shipDate: '2026-07-12', transitDays: 1, zone: 'West', remarks: 'IIT Gandhinagar deploys IonQ trapped-ion 32-qubit system for weather and climate modeling &#8594; &#8377;220Cr investment. Trapped ions offer superior coherence (&gt;10 seconds) vs superconducting qubits (&lt;100 microseconds) &#8594; critical for complex climate simulations. IMD partnership for monsoon prediction improving 5-day forecast accuracy from 85% to 94% &#8594; saving &#8377;2,500Cr annually in flood damage for Gujarat, Rajasthan and Maharashtra' },
  { id: 'QCL-0008', projectId: 'QCL-K26KOL1', city: 'Kolkata', institution: 'SINP Quantum Information Centre', partner: 'QuEra + SN Bose Centre', systemType: 'Neutral Atom 256-Qubit', qubits: 256, application: 'Materials Science Battery Research', investmentCr: 185, status: 'In Transit', priority: 'High', origin: 'SINP Salt Lake', destination: 'SN Bose JD Block', shipDate: '2026-07-25', transitDays: 1, zone: 'East', remarks: 'Kolkata SINP deploys QuEra Aquila 256-qubit neutral atom array for materials science &#8594; &#8377;185Cr investment. Simulating lithium-ion battery cathode materials for BHEL and Exide Industries &#8594; discovering new electrolyte formulations 50x faster than classical DFT calculations. Neutral atoms&apos; programmable geometry enables custom qubit arrangements for simulating crystal lattices &#8594; critical for India&apos;s &#8377;18,000Cr battery manufacturing mission' },
  { id: 'QCL-0009', projectId: 'QCL-K26KA1', city: 'Bengaluru', institution: 'ISRO Navigation Quantum Lab', partner: 'IQC Waterloo + ISRO', systemType: 'Photonic 24-Qubit', qubits: 24, application: 'Navigation Quantum Sensing', investmentCr: 165, status: 'Delivered', priority: 'Medium', origin: 'ISRO NavIC Centre', destination: 'IQC-ISRO Joint Lab Whitefield', shipDate: '2026-07-08', transitDays: 1, zone: 'South', remarks: 'ISRO Bengaluru deploys photonic 24-qubit system for quantum-enhanced navigation sensing &#8594; &#8377;165Cr investment. Quantum inertial sensors improve NavIC satellite positioning accuracy from 5m to 0.5m &#8594; critical for strategic missile guidance and autonomous vehicle navigation. Photonic qubits operate at room temperature &#8594; ideal for space deployment on ISRO&apos;s next-generation navigation satellites. India targets quantum-enhanced GPS-Independent PNT by 2029' },
  { id: 'QCL-0010', projectId: 'QCL-L26LKO1', city: 'Lucknow', institution: 'CDRI Quantum Drug Lab', partner: 'Xanadu + CDRI', systemType: 'Photonic 200-Qubit', qubits: 200, application: 'Antibiotic Resistance Research', investmentCr: 140, status: 'Processing', priority: 'Medium', origin: 'CDRI Sector 10', destination: 'SGPGIMS Quantum Unit', shipDate: '2026-08-02', transitDays: 2, zone: 'North', remarks: 'CDRI Lucknow deploys Xanadu Borealis photonic 200-qubit processor for antibiotic resistance research &#8594; &#8377;140Cr investment. Simulating bacterial enzyme structures to design new antibiotics effective against superbugs &#8594; addressing India&apos;s AMR crisis that causes 700,000 deaths annually. Photonic quantum computing excels at molecular vibronic spectrum calculations &#8594; accelerating new drug candidate identification from 3 years to 6 months. CDRI-UP government partnership under National AMR Action Plan' },
  { id: 'QCL-0011', projectId: 'QCL-G26GAU1', city: 'Gandhinagar', institution: 'Gujarat National Quantum Mission HQ', partner: 'Quantinuum + GNQM', systemType: 'Trapped Ion 56-Qubit', qubits: 56, application: 'National Quantum Network Hub', investmentCr: 680, status: 'Delivered', priority: 'Medium', origin: 'GNQM GIFT City', destination: 'Quantum Network Hub Gandhinagar', shipDate: '2026-07-12', transitDays: 1, zone: 'West', remarks: 'Gujarat GNQM headquarters deploys Quantinuum H2 56-qubit trapped ion system as India&apos;s national quantum network hub &#8594; &#8377;680Cr investment. Backbone node connecting Delhi-Mumbai-Bengaluru-Hyderabad quantum communication network &#8594; 2,000 km fiber QKD backbone. Highest quantum volume (65,536) in India &#8594; demonstrates fault-tolerant quantum advantage for real-world logistics scheduling. GNQM coordinates &#8377;6,000Cr National Quantum Mission across 8 institutions' },
  { id: 'QCL-0012', projectId: 'QCL-J26JPR1', city: 'Jaipur', institution: 'Malaviya National Quantum Lab', partner: 'PsiQuantum + MNIT', systemType: 'Photonic 1000-Qubit', qubits: 1000, application: 'Solar Cell Material Simulation', investmentCr: 195, status: 'In Transit', priority: 'Medium', origin: 'MNIT Jawahar Nagar', destination: 'Jaipur Quantum Photonic Centre', shipDate: '2026-07-24', transitDays: 2, zone: 'North', remarks: 'MNIT Jaipur deploys PsiQuantum photonic 1000-qubit system for perovskite solar cell simulation &#8594; &#8377;195Cr investment. Photonics inherently scalable to million qubits &#8594; simulating defect structures in next-gen perovskite materials 10,000x faster than classical methods. Partnership with Rajasthan&apos;s &#8377;25,000Cr solar manufacturing program &#8594; targeting 30% efficiency tandem cells. Jaipur&apos;s photonic approach avoids cryogenic requirements &#8594; room-temperature operation enables mass deployment' },
  { id: 'QCL-0013', projectId: 'QCL-V26VIZ1', city: 'Visakhapatnam', institution: 'Naval Quantum Technology Lab', partner: 'ColdQuanta + Naval Research Board', systemType: 'Cold Atom 40-Qubit', qubits: 40, application: 'Submarine Detection Quantum Sensing', investmentCr: 210, status: 'Delivered', priority: 'Medium', origin: 'Naval Dockyard Vizag', destination: 'NRB Quantum Lab Vizag', shipDate: '2026-07-08', transitDays: 1, zone: 'South', remarks: 'Vizag Naval Quantum Lab deploys ColdQuanta cold atom 40-qubit system for quantum-enhanced magnetometry &#8594; &#8377;210Cr investment. Quantum magnetometers detect submarine magnetic signatures at 5x classical range &#8594; critical for Indian Navy anti-submarine warfare in Bay of Bengal and Arabian Sea. Cold atom sensors operate on INS Vishakapatnam and upcoming INS Mumbai &#8594; quantum-enhanced ASW capability. NRB coordinates with DRDO for indigenous quantum sensor development' },
  { id: 'QCL-0014', projectId: 'QCL-B26BBS1', city: 'Bhubaneswar', institution: 'IIT Bhubaneswar Quantum Lab', partner: 'Oxford Quantum Circuits + IITBBS', systemType: 'Superconducting 20-Qubit', qubits: 20, application: 'Mining Resource Optimization', investmentCr: 95, status: 'Delivered', priority: 'Medium', origin: 'IITBBS Argul Campus', destination: 'NALCO Quantum Analytics', shipDate: '2026-07-12', transitDays: 2, zone: 'East', remarks: 'IIT Bhubaneswar deploys OQC 20-qubit superconducting system for mining resource optimization &#8594; &#8377;95Cr investment. Optimizing bauxite and iron ore extraction schedules for NALCO and NMDC using quantum-enhanced linear programming. Reducing mine planning computation from 48 hours to 45 minutes &#8594; saving &#8377;450Cr/yr in operational costs. Odisha&apos;s mineral-rich mines generate 30% of India&apos;s mining output &#8594; quantum optimization critical for sustainable extraction planning' },
];

const COLORS = ['#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#6d28d9', '#5b21b6', '#4c1d95', '#581c87'];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 4 }, { value: 'Delivered', count: 8 }, { value: 'Processing', count: 2 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 3 }, { value: 'High', count: 5 }, { value: 'Medium', count: 6 },
  ]},
  { label: 'System Type', key: 'systemType', options: [
    { value: 'Superconducting Transmon 127-Qubit', count: 1 }, { value: 'Superconducting Sycamore 72-Qubit', count: 1 }, { value: 'Topological Qubit Prototype 8-Qubit', count: 1 }, { value: 'Quantum Annealing 5000-Qubit', count: 1 }, { value: 'Superconducting 54-Qubit', count: 1 }, { value: 'Superconducting 80-Qubit', count: 1 }, { value: 'Trapped Ion 32-Qubit', count: 1 }, { value: 'Neutral Atom 256-Qubit', count: 1 }, { value: 'Photonic 24-Qubit', count: 1 }, { value: 'Photonic 200-Qubit', count: 1 }, { value: 'Trapped Ion 56-Qubit', count: 1 }, { value: 'Photonic 1000-Qubit', count: 1 }, { value: 'Cold Atom 40-Qubit', count: 1 }, { value: 'Superconducting 20-Qubit', count: 1 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'North', count: 3 }, { value: 'South', count: 5 }, { value: 'West', count: 4 }, { value: 'East', count: 2 },
  ]},
];

export default function QuantumComputingLogisticsView() {
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
    return records.filter((r: QCLRecord) => {
      const matchSearch = !searchQuery || r.id.toLowerCase().includes(searchQuery.toLowerCase()) || r.city.toLowerCase().includes(searchQuery.toLowerCase()) || r.institution.toLowerCase().includes(searchQuery.toLowerCase());
      const matchFilters = Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(String(r[key as keyof QCLRecord])));
      return matchSearch && matchFilters;
    });
  }, [searchQuery, activeFilters]);

  const totalQubits = records.reduce((s, r) => s + r.qubits, 0);
  const totalInv = records.reduce((s, r) => s + r.investmentCr, 0);
  const avgQubits = Math.round(totalQubits / records.length);
  const maxQubits = Math.max(...records.map(r => r.qubits));

  const kpiData = [
    { label: 'Total Qubits Deployed', value: `${totalQubits.toLocaleString()}`, sub: 'Across 14 Quantum Labs' },
    { label: 'Highest Qubit Count', value: `${maxQubits.toLocaleString()}`, sub: 'Single System Peak' },
    { label: 'Avg per Installation', value: `${avgQubits.toLocaleString()}`, sub: 'Qubits per Lab' },
    { label: 'Total Investment', value: `&#8377;${totalInv.toLocaleString()}Cr`, sub: 'National Quantum Mission' },
  ];

  const cityData = useMemo(() => records.map(r => ({ city: r.city, qubits: r.qubits, inv: r.investmentCr })).sort((a, b) => b.qubits - a.qubits), []);
  const zonePie = useMemo(() => {
    const m: Record<string, number> = {};
    records.forEach(r => { m[r.zone] = (m[r.zone] || 0) + 1; });
    return Object.entries(m).map(([k, v]) => ({ name: k, value: v }));
  }, []);
  const invVsQubits = useMemo(() => records.map(r => ({ city: r.city, inv: r.investmentCr, qubits: r.qubits })), []);

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard' },
    { id: 'registry' as const, label: 'Registry' },
    { id: 'analytics' as const, label: 'Analytics' },
    { id: 'insights' as const, label: 'Insights' },
  ];

  return (
    <div className="space-y-4 qcl-logistics-view">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Quantum Computing' }]} />
      <PageHeader title="Quantum Computing Logistics" description="India&apos;s National Quantum Mission infrastructure spanning superconducting, trapped-ion, photonic, neutral atom and quantum annealing systems for defense, pharma, finance and space applications" />

      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === t.id ? 'bg-[#7c3aed] text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiData.map((kpi, i) => (
              <Card key={i} className="qcl-kpi-card">
                <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{kpi.label}</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold text-[#7c3aed]" dangerouslySetInnerHTML={{ __html: kpi.value }} /><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="qcl-chart-card"><CardHeader><CardTitle className="text-base">Qubits by City</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cityData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="city" tick={{ fontSize: 10 }} /><YAxis /><Tooltip /><Bar dataKey="qubits" fill="#7c3aed" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
            <Card className="qcl-chart-card"><CardHeader><CardTitle className="text-base">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={zonePie} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }: { name: string; value: number }) => `${name}: ${value}`}><Cell fill="#7c3aed" /><Cell fill="#8b5cf6" /><Cell fill="#a78bfa" /><Cell fill="#6d28d9" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          </div>
        </div>
      )}

      {(activeTab === 'registry' || activeTab === 'dashboard') && (
        <Card className={activeTab === 'dashboard' ? '' : 'qcl-chart-card'}>
          <CardHeader><CardTitle className="text-base">{activeTab === 'registry' ? 'Quantum Computing Lab Registry' : 'Recent Shipments'}</CardTitle></CardHeader>
          <CardContent>
            <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={clearAllFilters} totalItems={records.length} filteredCount={filteredRecords.length} />
            <div className="mt-4 space-y-2 max-h-[600px] overflow-y-auto">
              {(activeTab === 'dashboard' ? filteredRecords.slice(0, 5) : filteredRecords).map((r) => (
                <div key={r.id} className={`p-3 rounded-lg border text-sm border-l-4 border-l-[#7c3aed] bg-violet-50/20`}>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2"><span className="font-mono font-medium">{r.id}</span><Badge variant={r.priority === 'Critical' ? 'destructive' : 'secondary'}>{r.priority}</Badge><Badge variant="outline">{r.status}</Badge></div>
                    <span className="text-xs text-muted-foreground">{r.city} &#8594; {r.transitDays}d | {r.qubits} qubits | {r.application}</span>
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
          <Card className="qcl-chart-card"><CardHeader><CardTitle className="text-base">Investment vs Qubit Count</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><LineChart data={invVsQubits}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="city" tick={{ fontSize: 9 }} /><YAxis yAxisId="left" /><YAxis yAxisId="right" orientation="right" /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="inv" stroke="#7c3aed" strokeWidth={2} name="Investment (Cr)" /><Line yAxisId="right" type="monotone" dataKey="qubits" stroke="#6d28d9" strokeWidth={2} name="Qubits" /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="qcl-chart-card"><CardHeader><CardTitle className="text-base">Cost per Qubit (&#8377;Cr/qubit)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={records.map(r => ({ city: r.city, cpq: +(r.investmentCr / r.qubits).toFixed(2) }))}><XAxis dataKey="city" tick={{ fontSize: 10 }} /><YAxis /><Tooltip /><Bar dataKey="cpq" fill="#8b5cf6" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="qcl-chart-card"><CardHeader><CardTitle className="text-base">Total Investment by Zone (&#8377;Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.zone] = (m[r.zone] || 0) + r.investmentCr; return m; }, {})).map(([k, v]) => ({ zone: k, inv: v }))}><XAxis dataKey="zone" /><YAxis /><Tooltip /><Bar dataKey="inv" fill="#6d28d9" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="qcl-chart-card"><CardHeader><CardTitle className="text-base">Status Overview</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={[{ name: 'In Transit', value: 4 }, { name: 'Delivered', value: 8 }, { name: 'Processing', value: 2 }]} cx="50%" cy="50%" outerRadius={90} dataKey="value" label><Cell fill="#7c3aed" /><Cell fill="#22c55e" /><Cell fill="#f59e0b" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="qcl-insight-card"><CardHeader><CardTitle className="text-base">ISRO-IISc Bengaluru: India&apos;s Quantum Space Leadership</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">ISRO-IISc 127-qubit superconducting lab (QCL-0001) is India&apos;s quantum space command center &#8594; optimizing 54-satellite constellation scheduling with quantum annealing. Orbital conflict resolution reduced from 72 hours to 4 minutes &#8594; enabling ISRO to launch 12 satellites per month vs current 3. IBM partnership provides cloud access to 433-qubit Eagle for algorithm development. &#8377;450Cr investment establishes Bengaluru as Asia&apos;s quantum space capital alongside NASA-Google partnership.</p></CardContent></Card>
          <Card className="qcl-insight-card"><CardHeader><CardTitle className="text-base">Delhi D-Wave: 5000 Qubits for Military Logistics</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">IIT Delhi&apos;s D-Wave Advantage (QCL-0004) deploys India&apos;s highest qubit count system at 5,000 qubits for military supply chain optimization. Solves 10,000-node vehicle routing problems in 2 seconds &#8594; optimizing logistics for 1.4M Indian Army personnel across 73 cantonments. Quantum annealing excels at combinatorial optimization &#8594; also deployed for Delhi traffic management reducing commute time by 18% in 5 pilot zones. &#8377;290Cr investment delivers highest qubits-per-rupee ratio in the portfolio.</p></CardContent></Card>
          <Card className="qcl-insight-card"><CardHeader><CardTitle className="text-base">TIFR Mumbai: India&apos;s Topological Quantum Gateway</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">TIFR-Microsoft 8-qubit topological lab (QCL-0003) has India&apos;s smallest qubit count but highest strategic importance &#8594; topological qubits are inherently error-protected, representing the path to fault-tolerant quantum computing. &#8377;520Cr investment targets BSE-NSE portfolio optimization and RBI systemic risk simulation. Quantum Monte Carlo replaces 48-hour classical stress tests with 30-minute quantum simulations across 12 PSU banks &#8594; India&apos;s financial stability gets a quantum advantage.</p></CardContent></Card>
          <Card className="qcl-insight-card"><CardHeader><CardTitle className="text-base">National Quantum Mission: &#8377;6,000Cr Scale-Up Plan</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Portfolio of 7,583 total qubits across 14 installations at &#8377;3,880Cr demonstrates India&apos;s quantum computing readiness. National Quantum Mission targets 50 logical qubits by 2028 and quantum advantage in 3 domains (defense, pharma, finance) by 2030 &#8594; requiring &#8377;6,000Cr additional investment. Current diversity of 5 qubit modalities (superconducting, trapped-ion, photonic, neutral atom, cold atom) provides technology hedging &#8594; India avoids single-platform dependency.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
