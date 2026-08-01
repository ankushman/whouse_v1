import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#5b21b6', '#4c1d95', '#f5f3ff']
const PRODUCTS = ['Demand Forecast Model', 'Route Optimisation Engine', 'Inventory Replenishment AI', 'Warehouse Slotting Optimiser', 'Carrier Selection Agent', 'Anomaly Detection Module', 'Predictive Maintenance AI', 'Natural Language Query']
const MODELS = ['GPT-4o Warehouse', 'Claude Logistics', 'Gemini Supply Chain', 'Llama 3 Ops Model', 'Mistral Warehouse AI', 'Mixtral Inventory', 'Phi-3 Mini Agent', 'DeepSeek Planner']
const STATUSES = ['Model Accuracy Verified', 'Hallucination Check Pass', 'Latency SLA Met', 'Data Privacy Audit OK', 'Integration Test Green', 'Production Deploy Approved']

const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))

const ProductBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: COLORS[7], color: COLORS[0] }}>{name}</span>
)

const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-violet-100 text-violet-800">{status}</span>
)

const CostBar = ({ cost, max }: { cost: number; max: number }) => (
  <div className="w-24 h-2 bg-violet-200 rounded-full overflow-hidden"><div className="h-full bg-violet-700 rounded-full" style={{ width: `${ri(0, 100, (cost / max) * 100)}%` }} /></div>
)

const HealthRing = ({ label, value, size = 80 }: { label: string; value: number; size?: number }) => {
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f5f3ff" strokeWidth="6" />
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
  <Card className="p-4 border-l-4" style={{ borderLeftColor: COLORS[2] }}><p className="text-sm text-muted-foreground">{label}</p><p className="text-lg font-semibold mt-1" style={{ color: COLORS[2] }}>{value}</p></Card>
)

const genRecords = (offset: number) =>
  Array.from({ length: 20 }, (_, i) => ({
    id: `AIC-${String(offset + i + 1).padStart(4, '0')}`,
    model: MODELS[(offset + i) % MODELS.length], module: PRODUCTS[(offset + i) % PRODUCTS.length],
    status: STATUSES[(offset + i) % STATUSES.length], qty: ri(1, 50, ((offset + i) * 31) % 50) + 1,
    cost: ri(150000, 4500000, ((offset + i) * 27031) % 4350000) + 150000,
    date: new Date(2024, ((offset + i) % 12), ri(1, 28, (offset + i) % 28)).toISOString().slice(0, 10),
  }))

const aicrecords = [
  { id: 'AIC-0001', model: 'GPT-4o Warehouse', module: 'Demand Forecast Model', status: 'Model Accuracy Verified', qty: 12, cost: 3200000, date: '2024-01-08' },
  { id: 'AIC-0002', model: 'Claude Logistics', module: 'Route Optimisation Engine', status: 'Hallucination Check Pass', qty: 8, cost: 2800000, date: '2024-01-20' },
  { id: 'AIC-0003', model: 'Gemini Supply Chain', module: 'Inventory Replenishment AI', status: 'Latency SLA Met', qty: 25, cost: 1500000, date: '2024-02-02' },
  { id: 'AIC-0004', model: 'Llama 3 Ops Model', module: 'Warehouse Slotting Optimiser', status: 'Data Privacy Audit OK', qty: 15, cost: 4200000, date: '2024-02-15' },
  { id: 'AIC-0005', model: 'Mistral Warehouse AI', module: 'Carrier Selection Agent', status: 'Integration Test Green', qty: 30, cost: 900000, date: '2024-02-28' },
  { id: 'AIC-0006', model: 'Mixtral Inventory', module: 'Anomaly Detection Module', status: 'Production Deploy Approved', qty: 10, cost: 3800000, date: '2024-03-12' },
  { id: 'AIC-0007', model: 'Phi-3 Mini Agent', module: 'Predictive Maintenance AI', status: 'Model Accuracy Verified', qty: 20, cost: 1200000, date: '2024-03-25' },
  { id: 'AIC-0008', model: 'DeepSeek Planner', module: 'Natural Language Query', status: 'Hallucination Check Pass', qty: 6, cost: 4500000, date: '2024-04-07' },
  { id: 'AIC-0009', model: 'GPT-4o Warehouse', module: 'Demand Forecast Model', status: 'Latency SLA Met', qty: 18, cost: 2600000, date: '2024-04-20' },
  { id: 'AIC-0010', model: 'Claude Logistics', module: 'Route Optimisation Engine', status: 'Data Privacy Audit OK', qty: 12, cost: 3400000, date: '2024-05-03' },
  { id: 'AIC-0011', model: 'Gemini Supply Chain', module: 'Inventory Replenishment AI', status: 'Integration Test Green', qty: 22, cost: 1800000, date: '2024-05-16' },
  { id: 'AIC-0012', model: 'Llama 3 Ops Model', module: 'Warehouse Slotting Optimiser', status: 'Production Deploy Approved', qty: 14, cost: 4000000, date: '2024-05-29' },
  { id: 'AIC-0013', model: 'Mistral Warehouse AI', module: 'Carrier Selection Agent', status: 'Model Accuracy Verified', qty: 28, cost: 700000, date: '2024-06-11' },
  { id: 'AIC-0014', model: 'Mixtral Inventory', module: 'Anomaly Detection Module', status: 'Hallucination Check Pass', qty: 8, cost: 3600000, date: '2024-06-24' },
  { id: 'AIC-0015', model: 'Phi-3 Mini Agent', module: 'Predictive Maintenance AI', status: 'Latency SLA Met', qty: 16, cost: 1400000, date: '2024-07-07' },
  { id: 'AIC-0016', model: 'DeepSeek Planner', module: 'Natural Language Query', status: 'Data Privacy Audit OK', qty: 5, cost: 4300000, date: '2024-07-20' },
  { id: 'AIC-0017', model: 'GPT-4o Warehouse', module: 'Demand Forecast Model', status: 'Integration Test Green', qty: 20, cost: 3000000, date: '2024-08-02' },
  { id: 'AIC-0018', model: 'Claude Logistics', module: 'Route Optimisation Engine', status: 'Production Deploy Approved', qty: 10, cost: 3100000, date: '2024-08-15' },
  { id: 'AIC-0019', model: 'Gemini Supply Chain', module: 'Inventory Replenishment AI', status: 'Model Accuracy Verified', qty: 24, cost: 1600000, date: '2024-08-28' },
  { id: 'AIC-0020', model: 'Llama 3 Ops Model', module: 'Warehouse Slotting Optimiser', status: 'Hallucination Check Pass', qty: 13, cost: 4100000, date: '2024-09-10' },
]

export default function LogisticsAiCopilotView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const allRecords = [...aicrecords, ...genRecords(21), ...genRecords(41)]

  const filteredRecords = useMemo(() => {
    if (!searchQuery && Object.keys(activeFilters).every(k => !activeFilters[k].length)) return allRecords
    const sq = searchQuery.toLowerCase()
    return allRecords.filter(r => { if (sq && !r.id.toLowerCase().includes(sq) && !r.module.toLowerCase().includes(sq)) return false; return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(r[key as keyof typeof r] as string)); })
  }, [searchQuery, activeFilters, allRecords])

  const filterGroups = [
    { key: 'module', label: 'AI Module', options: PRODUCTS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.module === p).length })) },
    { key: 'model', label: 'Model', options: MODELS.map(p => ({ value: p, label: p, count: allRecords.filter(r => r.model === p).length })) },
  ]

  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, deployments: ri(4, 20, allRecords.length * 0.10 + i * 3) }))
  const modelChart = MODELS.map(p => ({ name: p.split(' ').slice(0, 2).join(' '), deployments: allRecords.filter(r => r.model === p).length }))
  const statusPie = STATUSES.map(s => ({ name: s, value: allRecords.filter(r => r.status === s).length }))
  const maxCost = Math.max(...allRecords.map(r => r.cost))

  return (
    <div className="aic-root space-y-6 p-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics' }, { label: 'AI Copilot' }]} />
      <PageHeader title="Logistics AI Copilot" description="AI-powered logistics copilot system tracking GPT-4o Claude Gemini and Llama model deployments for demand forecasting route optimisation inventory replenishment warehouse slotting carrier selection anomaly detection predictive maintenance and natural language query across 8 production AI modules with model accuracy verification hallucination detection and data privacy compliance" />
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-violet-100">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <KpiTile label="Total Deployments" value={allRecords.length} />
            <KpiTile label="AI Modules" value={PRODUCTS.length} />
            <KpiTile label="Models Tracked" value={MODELS.length} />
            <KpiTile label="Avg API Cost" value={`₹${Math.round(allRecords.reduce((s, r) => s + r.cost, 0) / allRecords.length).toLocaleString()}`}/>
          </div>
          <div className="grid grid-cols-6 gap-4">
            <HealthRing label="Accuracy" value={94} />
            <HealthRing label="Hallucin" value={88} />
            <HealthRing label="Latency" value={92} />
            <HealthRing label="Privacy" value={97} />
            <HealthRing label="Integr" value={90} />
            <HealthRing label="Deploy" value={93} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <ValueTile label="API Calls/Month" value="2.4M" />
            <ValueTile label="Avg Accuracy" value="94.2%" />
            <ValueTile label="Inference GPU" value="A100 Cluster" />
            <ValueTile label="Refrigerator Edge" value="12 Nodes" />
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
            placeholder="Search AI copilot deployments..."
          />
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-violet-100">
                <tr>
                  <th className="p-3 text-left font-medium">ID</th>
                  <th className="p-3 text-left font-medium">AI Module</th>
                  <th className="p-3 text-left font-medium">Model</th>
                  <th className="p-3 text-left font-medium">Status</th>
                  <th className="p-3 text-left font-medium">Calls</th>
                  <th className="p-3 text-left font-medium">API Cost</th>
                  <th className="p-3 text-left font-medium">Cost Bar</th>
                  <th className="p-3 text-left font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map(record => (
                  <tr key={record.id} className="border-t hover:bg-violet-50/50">
                    <td className="p-3 font-mono text-xs">{record.id}</td>
                    <td className="p-3"><ProductBadge name={record.module} /></td>
                    <td className="p-3">{record.model}</td>
                    <td className="p-3"><StatusBadge status={record.status} /></td>
                    <td className="p-3">{record.qty}K</td>
                    <td className="p-3 font-mono">₹{(record.cost / 100000).toFixed(1)}L</td>
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
              <CardHeader><CardTitle>Deployment Trend</CardTitle></CardHeader>
              <CardContent>
                <LineChart width={500} height={300} data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="deployments" stroke={COLORS[0]} strokeWidth={2} />
                </LineChart>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Model Distribution</CardTitle></CardHeader>
              <CardContent>
                <BarChart width={500} height={300} data={modelChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="deployments" fill={COLORS[0]}>
                    {modelChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader><CardTitle>Validation Status Distribution</CardTitle></CardHeader>
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
              <CardHeader><CardTitle>Multi-Model AI Copilot Architecture for Warehouse Operations</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The multi-model AI copilot architecture for warehouse operations establishes a comprehensive production-grade artificial intelligence deployment framework that integrates eight distinct large language model providers including GPT-4o Claude Gemini Llama 3 Mistral Mixtral Phi-3 and DeepSeek to create a unified intelligent assistant system for the Indian logistics warehouse management platform where each AI model is assigned to specific logistics domain tasks based on its performance profile and cost efficiency with GPT-4o handling demand forecasting due to its superior numerical reasoning capabilities Claude managing route optimisation for its advanced spatial analysis and logical reasoning Gemini processing inventory replenishment decisions for its multimodal supply chain data integration Llama 3 deployed for warehouse slotting optimisation in a self-hosted configuration to ensure data sovereignty for sensitive warehouse layout data Mistral Warehouse AI handling carrier selection and rate comparison across Indian logistics providers Mixtral Inventory performing anomaly detection across warehouse sensor data streams Phi-3 Mini Agent deployed on Refrigerator edge computing nodes for real-time predictive maintenance alerts at individual Refrigerator cold storage units and DeepSeek Planner providing natural language query interface allowing warehouse managers to interact with the copilot system using conversational Hindi English or mixed-language queries where the multi-model architecture routes each incoming logistics query to the optimal model through an intelligent model router that evaluates query type complexity cost sensitivity latency requirements and data privacy classification to select the best model for each request achieving an average inference latency of four hundred milliseconds across all copilot modules while maintaining a ninety-four point two percent overall prediction accuracy across the eight AI modules in production.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Model Accuracy Verification and Hallucination Detection Framework</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The model accuracy verification and hallucination detection framework provides the quality assurance system for all AI copilot model outputs in the logistics warehouse management platform where the model accuracy verification subsystem continuously evaluates each AI model prediction against actual outcomes using a retrospective accuracy tracking methodology that compares demand forecast predictions against actual shipment volumes route optimisation suggestions against actual delivery times inventory replenishment recommendations against actual stockout events and anomaly detection alerts against confirmed warehouse incidents computing rolling accuracy metrics over thirty-day sixty-day and ninety-day windows for each AI module ensuring prediction accuracy remains above the minimum acceptable threshold of ninety percent for demand forecasting ninety-two percent for route optimisation eighty-eight percent for anomaly detection and ninety-five percent for inventory replenishment where any AI module whose accuracy drops below its threshold triggers an automated model retraining request and escalation to the AI operations team for manual review and intervention where the hallucination detection subsystem evaluates every AI copilot response for factual consistency against the warehouse knowledge base using a multi-stage verification pipeline that first checks the AI response against structured database records confirming all referenced SKU numbers warehouse locations carrier names and shipment IDs are valid and existent then evaluates the numerical values in the AI response against actual database values confirming quantities costs dates and status codes match reality within acceptable tolerance ranges and finally performs semantic consistency analysis confirming the AI response logically follows from the query context without generating plausible-sounding but factually incorrect information that could mislead warehouse operations staff into making incorrect logistics decisions where the hallucination detection system currently achieves a detection accuracy of ninety-six percent for factual hallucinations and ninety-one percent for numerical hallucinations across the eight production AI models with an average false positive rate of two point three percent.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Latency SLA Management and Data Privacy Compliance for AI Deployments</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The latency SLA management and data privacy compliance framework ensures that all AI copilot model deployments meet the performance and regulatory requirements for production warehouse operations where the latency SLA management subsystem continuously monitors the end-to-end inference latency for each AI model API call from the moment the user submits a query or the system triggers an automated prediction to the moment the AI response is returned and displayed tracking the latency budget breakdown across network transmission model inference post-processing and response rendering stages confirming each stage completes within its allocated latency budget where the total response latency SLA for interactive copilot queries is set at eight hundred milliseconds for simple queries and two seconds for complex multi-step analytical queries while automated batch predictions such as nightly demand forecasting and anomaly detection scans operate under relaxed latency SLAs of thirty seconds per batch allowing the system to use larger more accurate but slower models for batch processing where the latency monitoring system generates automated alerts when any model exceeds its P95 latency threshold for three consecutive measurement intervals triggering automatic scaling of inference GPU capacity or fallback to a faster secondary model to maintain SLA compliance where the data privacy compliance subsystem ensures all AI copilot data flows comply with the Digital Personal Data Protection Act twenty twenty-three and the Indian IT Act twenty hundred by implementing data classification-based access controls that prevent sensitive warehouse data including inventory values customer information and shipping addresses from being transmitted to external cloud-based AI model APIs without explicit data owner consent and anonymisation where all AI model prompts are processed through a data sanitisation pipeline that replaces sensitive identifiers with pseudonymous tokens before transmission to external models ensuring warehouse operational data privacy is maintained throughout the AI inference pipeline while maintaining the semantic context needed for accurate logistics decision-making.</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Refrigerator Edge Computing Nodes and Production Deployment Pipeline</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground leading-relaxed">The Refrigerator edge computing node deployment and production pipeline management system provides the infrastructure for deploying AI copilot models at the warehouse edge for real-time inference and the automated deployment pipeline for releasing new model versions to production where the Refrigerator edge computing subsystem deploys lightweight AI inference models on twelve edge computing nodes installed directly at Refrigerator cold storage warehouse locations across India running optimised versions of the Phi-3 Mini Agent model for real-time predictive maintenance monitoring of Refrigerator compressor units condenser coils evaporator fans and defrost systems where each edge node processes sensor data streams including temperature humidity compressor vibration and power consumption at one-second intervals running the Phi-3 predictive maintenance model locally to generate real-time maintenance alerts without requiring cloud connectivity ensuring continuous AI-powered monitoring even during network outages at remote Refrigerator warehouse locations where the edge nodes use ONNX Runtime optimised inference achieving sub-fifty-millisecond prediction latency on the embedded GPU hardware while consuming less than thirty watts of power per node enabling continuous twenty-four-seven predictive maintenance monitoring at each Refrigerator cold storage facility where the production deployment pipeline automates the end-to-end process of promoting validated AI model versions from development staging to production using a GitOps-based deployment workflow where each model version undergoes automated unit testing integration testing accuracy benchmarking hallucination testing and latency profiling before being promoted to the production environment with automatic rollback capability if any production metric degrades below threshold within the first four hours of deployment ensuring zero-downtime model updates across the eight AI copilot modules serving the Indian logistics warehouse management platform.</p></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}



