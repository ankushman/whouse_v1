import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#065f46', '#047857', '#059669', '#10b981', '#34d399', '#022c22', '#022c22', '#d1fae5']
const PRODUCTS = ['Carbon Emissions Report', 'ESG Risk Assessment Dossier', 'Supply Chain Audit Report', 'Climate Resilience Scorecard', 'Green Bond Verification', 'Scope 3 Emissions Tracker', 'Social Impact Assessment', 'Governance Compliance Audit']
const ARTISANS = ['BSE ESG Advisory Mumbai MH', 'CRISIL ESG Ratings Mumbai MH', 'KPMG ESG Advisory Bengaluru KA', 'EY Climate Change Delhi NCR', 'DNV Sustainability Chennai TN', 'S&P Global Ratings Mumbai MH', 'TERI Green Audit New Delhi', 'CII-ITC Sustainability Delhi']
const STATUSES = ['SEBI BRSR Filed', 'GRI Standards Aligned', 'TCFD Disclosed', 'CDP Carbon Verified', 'SBTi Validated', 'Pending Third-Party Audit']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-emerald-200 rounded-full overflow-hidden"><div className="h-full bg-emerald-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#d1fae5" strokeWidth="6" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={COLORS[0]} strokeWidth="6" strokeDasharray={`${c}`} strokeDashoffset={c - (value / 100) * c} strokeLinecap="round" />
      </svg>
      <span className="text-xs font-medium" style={{ color: COLORS[0] }}>{label} {value}%</span>
    </div>
  )
}

const KpiTile = ({ label, value }: { label: string; value: string | number }) => (
  <Card className="p-4"><p className="text-sm text-muted-foreground">{label}</p><p className="text-2xl font-bold mt-1">{value}</p></Card>
)

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <Card className="p-4 border-l-4" style={{ borderLeftColor: COLORS[1] }}><p className="text-sm text-muted-foreground">{label}</p><p className="text-lg font-semibold mt-1" style={{ color: COLORS[1] }}>{value}</p></Card>
)

const genRecords = (offset: number) =>
  Array.from({ length: 20 }, (_, i) => ({
    id: `ESG-${String(offset + i + 1).padStart(4, '0')}`,
    painter: ARTISANS[(offset + i) % ARTISANS.length], ware: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 20, ((offset + i) * 19) % 20) + 1,
    cost: ri(4000, 52000, ((offset + i) * 10707) % 48000) + 4000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const esgrecords = [
  { id: 'ESG-0001', painter: 'BSE ESG Advisory Mumbai MH', ware: 'Carbon Emissions Report', status: 'SEBI BRSR Filed', qty: 3, cost: 48000, date: '2024-01-15' },
  { id: 'ESG-0002', painter: 'CRISIL ESG Ratings Mumbai MH', ware: 'ESG Risk Assessment Dossier', status: 'GRI Standards Aligned', qty: 5, cost: 36000, date: '2024-01-28' },
  { id: 'ESG-0003', painter: 'KPMG ESG Advisory Bengaluru KA', ware: 'Supply Chain Audit Report', status: 'TCFD Disclosed', qty: 2, cost: 52000, date: '2024-02-10' },
  { id: 'ESG-0004', painter: 'EY Climate Change Delhi NCR', ware: 'Climate Resilience Scorecard', status: 'CDP Carbon Verified', qty: 7, cost: 22000, date: '2024-02-22' },
  { id: 'ESG-0005', painter: 'DNV Sustainability Chennai TN', ware: 'Green Bond Verification', status: 'SBTi Validated', qty: 4, cost: 44000, date: '2024-03-08' },
  { id: 'ESG-0006', painter: 'S&P Global Ratings Mumbai MH', ware: 'Scope 3 Emissions Tracker', status: 'Pending Third-Party Audit', qty: 6, cost: 28000, date: '2024-03-20' },
  { id: 'ESG-0007', painter: 'TERI Green Audit New Delhi', ware: 'Social Impact Assessment', status: 'SEBI BRSR Filed', qty: 2, cost: 50000, date: '2024-04-03' },
  { id: 'ESG-0008', painter: 'CII-ITC Sustainability Delhi', ware: 'Governance Compliance Audit', status: 'GRI Standards Aligned', qty: 8, cost: 16000, date: '2024-04-16' },
  { id: 'ESG-0009', painter: 'BSE ESG Advisory Mumbai MH', ware: 'ESG Risk Assessment Dossier', status: 'TCFD Disclosed', qty: 4, cost: 40000, date: '2024-04-28' },
  { id: 'ESG-0010', painter: 'CRISIL ESG Ratings Mumbai MH', ware: 'Carbon Emissions Report', status: 'CDP Carbon Verified', qty: 3, cost: 48000, date: '2024-05-10' },
  { id: 'ESG-0011', painter: 'KPMG ESG Advisory Bengaluru KA', ware: 'Supply Chain Audit Report', status: 'SBTi Validated', qty: 5, cost: 32000, date: '2024-05-23' },
  { id: 'ESG-0012', painter: 'EY Climate Change Delhi NCR', ware: 'Climate Resilience Scorecard', status: 'Pending Third-Party Audit', qty: 6, cost: 20000, date: '2024-06-05' },
  { id: 'ESG-0013', painter: 'DNV Sustainability Chennai TN', ware: 'Green Bond Verification', status: 'SEBI BRSR Filed', qty: 3, cost: 46000, date: '2024-06-18' },
  { id: 'ESG-0014', painter: 'S&P Global Ratings Mumbai MH', ware: 'Scope 3 Emissions Tracker', status: 'GRI Standards Aligned', qty: 7, cost: 24000, date: '2024-07-01' },
  { id: 'ESG-0015', painter: 'TERI Green Audit New Delhi', ware: 'Social Impact Assessment', status: 'TCFD Disclosed', qty: 2, cost: 52000, date: '2024-07-14' },
  { id: 'ESG-0016', painter: 'CII-ITC Sustainability Delhi', ware: 'Governance Compliance Audit', status: 'CDP Carbon Verified', qty: 10, cost: 12000, date: '2024-07-26' },
  { id: 'ESG-0017', painter: 'BSE ESG Advisory Mumbai MH', ware: 'Carbon Emissions Report', status: 'SBTi Validated', qty: 4, cost: 42000, date: '2024-08-08' },
  { id: 'ESG-0018', painter: 'CRISIL ESG Ratings Mumbai MH', ware: 'ESG Risk Assessment Dossier', status: 'Pending Third-Party Audit', qty: 5, cost: 30000, date: '2024-08-20' },
  { id: 'ESG-0019', painter: 'KPMG ESG Advisory Bengaluru KA', ware: 'Supply Chain Audit Report', status: 'SEBI BRSR Filed', qty: 3, cost: 50000, date: '2024-09-02' },
  { id: 'ESG-0020', painter: 'EY Climate Change Delhi NCR', ware: 'Climate Resilience Scorecard', status: 'GRI Standards Aligned', qty: 8, cost: 18000, date: '2024-09-14' },
]

export default function EsgComplianceHubView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const allRecords = [...esgrecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.ware.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'ware', label: 'Ware', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.ware === p).length })) },
    { key: 'painter', label: 'Painter', options: ARTISANS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.painter === p).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, shipments: ri(4, 20, allRecords.length * 0.10 + i * 3) }))
  const artisanChart = ARTISANS.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), volume: allRecords.filter(r => r.painter === p).reduce((s, r) => s + r.qty, 0) }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="esg-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'ESG Compliance' }]} />
      <PageHeader title="ESG Compliance Hub" description="India ESG compliance and sustainability reporting supply chain with SEBI BRSR filing, GRI Standards alignment, TCFD climate disclosure, CDP carbon verification, SBTi validation, and third-party audit management across 8 advisory centres including BSE, CRISIL, KPMG and TERI" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-emerald-100">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile label="Total Shipments" value={allRecords.length} />
            <KpiTile label="Active Ware" value={PRODUCTS.length} />
            <KpiTile label="Advisory Centres" value={ARTISANS.length} />
            <KpiTile label="Avg Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="BRSR" value={94} />
            <HealthRing label="GRI" value={89} />
            <HealthRing label="TCFD" value={86} />
            <HealthRing label="CDP" value={91} />
            <HealthRing label="SBTi" value={83} />
            <HealthRing label="Audit" value={88} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="BRSR Filed" value="1,850+ Cos" />
            <ValueTile label="India ESG AUM" value="₹42,000 Cr" />
            <ValueTile label="Advisory Firms" value="200+" />
            <ValueTile label="YoY Growth" value="+38.2%" />
          </div>
        </TabsContent>
        <TabsContent value="shipments" className="space-y-6">
          <SearchFilterToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClearSearch={() => setSearchQuery('')}
            activeFilters={activeFilters}
            filterGroups={filterGroups}
            onToggleFilter={(group, val) => setActiveFilters(prev => ({ ...prev, [group]: prev[group]?.includes(val) ? prev[group].filter(v => v !== val) : [...(prev[group] || []), val] }))}
            onClearAllFilters={() => setActiveFilters({})}
            totalItems={allRecords.length}
            filteredCount={filteredRecords.length}
            onRefresh={() => {}}
            placeholder="Search ESG compliance shipments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-emerald-100">
                <tr>
                  <th className="p-3 text-left font-medium">ID</th>
                  <th className="p-3 text-left font-medium">Ware</th>
                  <th className="p-3 text-left font-medium">Painter</th>
                  <th className="p-3 text-left font-medium">Status</th>
                  <th className="p-3 text-left font-medium">Qty</th>
                  <th className="p-3 text-left font-medium">Cost</th>
                  <th className="p-3 text-left font-medium">Cost Bar</th>
                  <th className="p-3 text-left font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map(record => (
                  <tr key={record.id} className="border-t hover:bg-emerald-50/50">
                    <td className="p-3 font-mono text-xs">{record.id}</td>
                    <td className="p-3"><ProductBadge name={record.ware} /></td>
                    <td className="p-3">{record.painter}</td>
                    <td className="p-3"><StatusBadge status={record.status} /></td>
                    <td className="p-3">{record.qty} {['reports', 'dossiers', 'audits', 'scorecards'][parseInt(record.id.slice(4)) % 4]}</td>
                    <td className="p-3 font-mono">₹{record.cost.toLocaleString()}</td>
                    <td className="p-3"><CostBar cost={record.cost} max={maxCost} /></td>
                    <td className="p-3">{record.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Shipment Trend</CardTitle></CardHeader>
              <CardContent>
                <LineChart width={500} height={300} data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="shipments" stroke={COLORS[0]} strokeWidth={2} />
                </LineChart>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Advisory Volume</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={300} data={artisanChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="volume" fill={COLORS[0]}>
                    {artisanChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader><CardTitle>Status Distribution</CardTitle></CardHeader>
            <CardContent>
              <PieChart width={500} height={300}>
                <Pie data={statusPie} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
                  {statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>India ESG Framework — SEBI BRSR Mandatory Disclosure Regime</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">India ESG compliance and sustainability reporting framework has undergone a transformative expansion since the Securities and Exchange Board of India SEBI mandated Business Responsibility and Sustainability Reporting BRSR for the top one thousand listed companies by market capitalisation from the financial year twenty twenty-two twenty-three onwards establishing India as one of the most comprehensive emerging market ESG disclosure regimes globally where the BRSR framework requires structured annual disclosure across nine principles covering environmental stewardship including greenhouse gas emissions water consumption waste management and biodiversity impact social responsibility including employee welfare supply chain labour standards community development and human rights due diligence and governance integrity including board diversity anti-corruption policies stakeholder engagement and ethical business conduct where the BRSR format is aligned with the globally recognised GRI Standards Global Reporting Initiative providing international comparability of Indian corporate ESG disclosures while incorporating India-specific metrics relevant to the national context including National Ambient Air Quality Standards compliance wastewater treatment plant efficiency solid waste management and recycling rates and corporate social development expenditure aligned with the Companies Act Schedule VII requirements where the SEBI BRSR Lite format introduced for the top one thousand listed companies provides a streamlined disclosure framework with mandatory quantitative parameters and voluntary qualitative narrative sections enabling smaller companies to comply with ESG disclosure requirements without excessive reporting burden where the BRSR assurance framework introduced by SEBI in twenty twenty-three requires limited assurance of quantitative BRSR disclosures by independent third-party assurance providers approved by SEBI enhancing the reliability and credibility of ESG data reported by Indian listed companies where the ESG advisory ecosystem in India has expanded rapidly to serve the growing compliance demand with over two hundred dedicated ESG advisory firms and sustainability consultancies operating across major Indian cities including Mumbai where BSE ESG Advisory provides BRSR filing support and ESG rating services and Bengaluru where KPMG EY Deloitte and PwC maintain dedicated ESG advisory practices serving Indian corporate clients on BRSR compliance GRI alignment TCFD climate disclosure and SBTi target validation creating a comprehensive ESG advisory supply chain that manages the end-to-end process of data collection verification assurance and regulatory filing for Indian corporate sustainability reporting requirements.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>SEBI BRSR Filing & GRI Standards Alignment Protocol</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The SEBI BRSR filing protocol establishes the mandatory annual submission process for Indian listed companies requiring electronic filing of the completed BRSR disclosure through the BSE and NSE exchange filing portals within the prescribed timeline of sixty days from the end of each financial year with the BRSR disclosure comprising one hundred and forty-nine individual data points across the nine BRSR principles where the quantitative environmental parameters require disclosure of Scope one direct greenhouse gas emissions Scope two indirect emissions from purchased electricity and Scope three upstream and downstream supply chain emissions calculated in accordance with the GHG Protocol Corporate Standard providing internationally comparable carbon footprint data for Indian listed companies where the energy consumption disclosure requires reporting of total electricity consumption in megawatt hours renewable energy share as percentage of total energy consumption and energy intensity measured as energy consumed per unit of revenue providing investors with standardised metrics for evaluating corporate energy transition progress where the water consumption disclosure requires reporting of total freshwater withdrawal groundwater recharge rainwater harvesting volume and water recycling rate measured in accordance with the CDP Water Security questionnaire methodology providing comprehensive water stewardship metrics aligned with international reporting frameworks where the waste management disclosure requires reporting of total solid waste generated hazardous waste quantities waste recycling rate and plastic waste management compliance with the Plastic Waste Management Rules twenty sixteen providing detailed waste management transparency for Indian listed companies where the GRI Standards alignment mapping requires Indian companies reporting under BRSR to map their BRSR disclosures to the corresponding GRI Standards disclosure requirements enabling international investors to compare Indian corporate ESG performance against global benchmarks where the alignment mapping covers GRI Standard one Universal two hundred series Topic-specific economic disclosures three hundred series Environmental disclosures and four hundred series Social disclosures providing comprehensive coverage of the GRI Standards framework within the BRSR reporting structure where the BRSR assurance protocol requires independent third-party assurance providers to verify the accuracy completeness and reliability of the quantitative BRSR disclosures using ISAE three thousand assurance engagements methodology providing limited assurance opinion on whether the BRSR quantitative disclosures are free from material misstatement confirming the reliability of the ESG data presented to investors and stakeholders for investment decision-making and corporate sustainability performance evaluation.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>CDP Carbon Verification & TCFD Climate Disclosure Supply Chain</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The CDP carbon verification and TCFD Task Force on Climate-related Financial Disclosures compliance supply chain manages the end-to-end process of carbon footprint measurement verification and climate risk disclosure for Indian companies participating in the global CDP carbon disclosure programme and complying with the SEBI-mandated climate-related financial disclosures aligned with the TCFD recommendations where the CDP India programme manages carbon disclosure responses from over two hundred Indian companies annually across three questionnaires covering climate change water security and forests providing standardised carbon emissions and environmental impact data for institutional investors with combined assets under management exceeding one hundred thirty trillion US dollars globally who use CDP data for investment decision-making and corporate engagement on climate transition progress where the CDP carbon verification process requires Indian companies to submit detailed carbon emissions data including Scope one direct emissions from owned and controlled sources Scope two indirect emissions from purchased electricity steam heating and cooling and Scope three upstream and downstream emissions from the company's value chain calculated using the GHG Protocol Corporate Standard and Corporate Value Chain Standard with all emissions data verified by an accredited third-party verification body in accordance with ISO fourteen thousand six four greenhouse gas verification methodology confirming the accuracy completeness and consistency of the reported emissions data within a reasonable level of assurance providing investors with verified carbon footprint data for evaluating corporate climate transition progress where the TCFD disclosure framework aligned with the SEBI BRSR climate disclosure requirements mandates Indian companies to report across four pillars of climate governance including governance structure for climate-related risks and opportunities strategy for managing climate transition impacts risk management processes for identifying and assessing climate-related financial risks and metrics and targets for tracking climate performance including Scope one two and three greenhouse gas emissions science-based emissions reduction targets validated by the Science Based Targets initiative SBTi and climate scenario analysis using the TCFD recommended two-degree Celsius and four degree Celsius warming scenarios to assess the financial resilience of the company's business model under different climate transition pathways providing investors with comprehensive forward-looking climate risk assessment data for evaluating the long-term climate resilience of Indian listed companies in the context of the global energy transition and net-zero emissions commitment framework.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>SBTi Validation & India Green Finance Market Growth</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The Science Based Targets initiative SBTi validation framework provides the globally recognised gold standard for corporate emissions reduction target setting requiring Indian companies to commit to emissions reduction targets aligned with the latest climate science including the Paris Agreement goals of limiting global warming to one point five degrees Celsius above pre-industrial levels where the SBTi validation process requires companies to submit detailed near-term emissions reduction targets covering Scope one and Scope two emissions for the period twenty twenty-five to twenty thirty and long-term net-zero commitments for twenty fifty covering all three scopes with the targets validated against the SBTi criteria including minimum absolute emissions reduction of forty-two percent by twenty thirty for one point five degree Celsius aligned targets and absolute net-zero emissions by twenty fifty with residual emissions addressed through verified carbon removal credits where the SBTi validation supply chain in India involves ESG advisory firms including BSE ESG Advisory KPMG EY DNV and S&P Global working with Indian corporate clients on target setting methodology selection emissions base year establishment decarbonisation pathway modelling and SBTi submission and validation managing the comprehensive validation process that typically requires twelve to eighteen months from initial target commitment to final SBTi validation providing Indian companies with internationally recognised science-based emissions reduction targets that demonstrate credible climate transition commitment to global investors and stakeholders. The India green finance market has experienced extraordinary growth driven by the convergence of SEBI BRSR mandatory ESG disclosure requirements growing investor demand for ESG-aligned investment products and increasing corporate commitment to science-based emissions reduction targets with the India ESG mutual fund category growing from zero to over forty-two thousand crore rupees in assets under management within three years of the BRSR mandate demonstrating the transformative impact of regulatory ESG disclosure requirements on capital market allocation where SEBI has introduced the BRSR Core framework requiring value chain disclosure by the top two hundred fifty listed companies from financial year twenty twenty-five twenty-six onwards extending ESG transparency requirements to Scope three supply chain emissions and lifecycle impact assessment creating a comprehensive ESG compliance supply chain that will drive continued growth in the Indian ESG advisory sustainability consulting and green finance market serving the growing demand for credible verified corporate sustainability performance data and science-based climate transition planning across the Indian corporate landscape.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}



