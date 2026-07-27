// R112: ESG & Sustainability Audit View
'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import type { CSSProperties } from 'react';
import {
  RefreshCw, AlertTriangle, Search, Leaf, TrendingUp, TrendingDown,
  ChevronRight, X, Activity, Target, Zap, Info, Gauge,
  Globe, ShieldCheck, Eye, BarChart3, Filter, Clock, CheckCircle2,
  XCircle, AlertCircle, Sparkles, TreePine, Droplets, Wind,
  Trash2, Users, Building2, Gavel, FileWarning, ThermometerSun,
  ArrowUpRight, ArrowDownRight, Minus, ChevronDown, ChevronUp,
  ClipboardCheck, FileText, MapPin, CalendarClock, Hexagon,
  CircleDot, Layers, Shield, ExternalLink, Award, Flame,
  Factory, CloudRain, Recycle, Heart, Brain, Scale,
  TargetIcon, BadgeCheck, TriangleAlert, AlertOctagon, Truck,
} from 'lucide-react';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, ComposedChart, Line, ReferenceLine, AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart,
  ScatterChart, Scatter, ZAxis,
} from 'recharts';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================
type ESGScope = 'Environmental' | 'Social' | 'Governance';
type AuditFrequency = 'annual' | 'quarterly' | 'monthly';
type ESGAuditStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'postponed';
type ESGAuditOutcome = 'compliant' | 'partially_compliant' | 'non_compliant' | 'not_assessed';
type VerificationStatus = 'verified' | 'pending_verification' | 'not_verified' | 'disputed';
type CarbonScope = 'scope1' | 'scope2' | 'scope3';
type ESGFindingSeverity = 'observation' | 'minor' | 'major' | 'critical';
type ESGFindingStatus = 'open' | 'in_progress' | 'pending_verification' | 'closed' | 'overdue';
type ComplianceStatus = 'compliant' | 'partial' | 'non_compliant' | 'pending_review';
type DisclosureStatus = 'full' | 'partial' | 'minimal' | 'not_disclosed';
type RiskProbability = 'rare' | 'unlikely' | 'possible' | 'likely' | 'almost_certain';
type RiskImpact = 'negligible' | 'minor' | 'moderate' | 'major' | 'catastrophic';
type MitigationStatus = 'not_started' | 'in_progress' | 'implemented' | 'monitoring';

interface ESGAudit {
  id: string; auditCode: string; title: string; scope: ESGScope;
  frequency: AuditFrequency; status: ESGAuditStatus;
  scheduledDate: string; completedDate: string | null; daysToAudit: number;
  leadAuditor: string; auditTeamSize: number; warehouseId: string; warehouseName: string;
  outcome: ESGAuditOutcome | null; score: number | null;
  findingsCount: number; criticalFindings: number; majorFindings: number;
  nextAuditDate: string | null; notes: string;
}
interface CarbonRecord {
  id: string; recordCode: string; warehouseId: string; warehouseName: string;
  scope: CarbonScope; baselineYear: number; currentYear: number;
  baselineEmissions: number; currentEmissions: number;
  reductionTarget: number; reductionAchieved: number; unit: string;
  verificationStatus: VerificationStatus; verifiedBy: string | null;
  verifiedDate: string | null; category: string; notes: string;
}
interface SustainabilityKPI {
  id: string; kpiCode: string; name: string;
  dimension: 'environmental' | 'social' | 'governance' | 'economic' | 'community' | 'workforce';
  unit: string; target: number; actual: number; previousYear: number;
  trend: 'improving' | 'stable' | 'declining';
  status: 'on_track' | 'at_risk' | 'off_track';
  grilink: string | null; sdgAlignment: number | null; weight: number;
}
interface GRIIndicator {
  id: string; griCode: string; griStandard: string; topic: string;
  disclosureStatus: DisclosureStatus; description: string;
  complianceRequirement: string; lastReported: string | null; nextDue: string | null;
  dataQuality: 'high' | 'medium' | 'low' | 'not_assessed';
  responsibleTeam: string; notes: string;
}
interface ESGRisk {
  id: string; riskCode: string; title: string;
  category: 'climate' | 'regulatory' | 'reputational' | 'supply_chain' | 'financial' | 'operational';
  probability: RiskProbability; impact: RiskImpact;
  probabilityScore: number; impactScore: number;
  riskScore: number; riskLevel: 'low' | 'medium' | 'high' | 'critical';
  mitigationStatus: MitigationStatus; mitigationPlan: string;
  owner: string; lastReviewed: string | null; nextReview: string | null; notes: string;
}
interface ESGFinding {
  id: string; findingCode: string; auditId: string; auditCode: string;
  scope: ESGScope; severity: ESGFindingSeverity; status: ESGFindingStatus;
  category: string; description: string;
  identifiedDate: string; dueDate: string; daysToDue: number;
  closedDate: string | null; rootCause: string | null;
  correctiveAction: string | null; preventiveAction: string | null;
  capaId: string | null; verificationMethod: string | null;
  verifiedBy: string | null; owner: string; warehouseName: string;
}
interface ComplianceObligation {
  id: string; obligationCode: string; regulation: string; authority: string;
  category: 'environmental' | 'social' | 'governance' | 'financial' | 'operational';
  status: ComplianceStatus; complianceScore: number;
  dueDate: string; lastAssessed: string | null; nextAssessment: string | null;
  sdgAlignment: number | null; penalties: string;
  responsibleTeam: string; notes: string;
}
interface KPIs {
  totalAudits: number; completedAudits: number; openFindings: number;
  criticalFindings: number; overdueFindings: number;
  totalCarbonFootprint_tCO2e: number; reductionVsBaseline_pct: number;
  renewableEnergy_pct: number; wasteDiversionRate_pct: number;
  waterIntensity_perUnit: number; griCompliance_pct: number;
  esgCompositeScore: number; sustainabilityRating: string;
}
interface ApiResponse {
  generatedAt: string;
  kpis: KPIs;
  audits: ESGAudit[];
  carbonRecords: CarbonRecord[];
  sustainabilityKPIs: SustainabilityKPI[];
  griIndicators: GRIIndicator[];
  risks: ESGRisk[];
  findings: ESGFinding[];
  complianceObligations: ComplianceObligation[];
  auditsByScope: { scope: ESGScope; label: string; color: string; count: number }[];
  auditsByStatus: { status: ESGAuditStatus; label: string; color: string; count: number }[];
  auditsByOutcome: { outcome: ESGAuditOutcome; label: string; color: string; count: number }[];
  findingsBySeverity: { severity: ESGFindingSeverity; label: string; color: string; count: number; open: number }[];
  findingsByStatus: { status: ESGFindingStatus; label: string; color: string; count: number }[];
  emissionsByScope: { scope: CarbonScope; label: string; color: string; total: number; baseline: number }[];
  kpiTrend: { month: string; emissions: number; renewable: number; wasteDiversion: number; waterIntensity: number; compositeScore: number }[];
  riskHeatmap: { probability: number; impact: number; score: number; count: number; risks: string[] }[];
  complianceByRegulation: { id: string; regulation: string; authority: string; category: string; status: ComplianceStatus; complianceScore: number; sdgAlignment: number | null; penalties: string; responsibleTeam: string }[];
  auditTrend: { month: string; scheduled: number; completed: number }[];
  emissionsByWarehouse: { warehouse: string; scope1: number; scope2: number; scope3: number }[];
  reductionTrajectory: { year: number; target: number; actual: number }[];
  insights: { type: 'danger' | 'warning' | 'success' | 'info'; title: string; description: string; recommendation: string }[];
  meta: Record<string, unknown>;
}

// ============================================================================
// Constants
// ============================================================================
const SCOPE_LABELS: Record<ESGScope, string> = { Environmental: 'Environmental', Social: 'Social', Governance: 'Governance' };
const SCOPE_COLORS: Record<ESGScope, string> = { Environmental: '#047857', Social: '#2563eb', Governance: '#7c3aed' };
const SCOPE_ICONS: Record<ESGScope, string> = { Environmental: 'TreePine', Social: 'Users', Governance: 'Building2' };
const STATUS_LABELS: Record<ESGAuditStatus, string> = { scheduled: 'Scheduled', in_progress: 'In Progress', completed: 'Completed', cancelled: 'Cancelled', postponed: 'Postponed' };
const STATUS_COLORS: Record<ESGAuditStatus, string> = { scheduled: '#2563eb', in_progress: '#d97706', completed: '#047857', cancelled: '#7c2d12', postponed: '#6b7280' };
const OUTCOME_LABELS: Record<ESGAuditOutcome, string> = { compliant: 'Compliant', partially_compliant: 'Partially Compliant', non_compliant: 'Non-Compliant', not_assessed: 'Not Assessed' };
const OUTCOME_COLORS: Record<ESGAuditOutcome, string> = { compliant: '#047857', partially_compliant: '#d97706', non_compliant: '#dc2626', not_assessed: '#6b7280' };
const VERIFY_LABELS: Record<VerificationStatus, string> = { verified: 'Verified', pending_verification: 'Pending', not_verified: 'Not Verified', disputed: 'Disputed' };
const VERIFY_COLORS: Record<VerificationStatus, string> = { verified: '#047857', pending_verification: '#d97706', not_verified: '#dc2626', disputed: '#7c3aed' };
const CARBON_LABELS: Record<CarbonScope, string> = { scope1: 'Scope 1', scope2: 'Scope 2', scope3: 'Scope 3' };
const CARBON_COLORS: Record<CarbonScope, string> = { scope1: '#ea580c', scope2: '#2563eb', scope3: '#7c3aed' };
const SEVERITY_LABELS: Record<ESGFindingSeverity, string> = { observation: 'Observation', minor: 'Minor', major: 'Major', critical: 'Critical' };
const SEVERITY_COLORS: Record<ESGFindingSeverity, string> = { observation: '#6b7280', minor: '#d97706', major: '#ea580c', critical: '#dc2626' };
const FSTATUS_LABELS: Record<ESGFindingStatus, string> = { open: 'Open', in_progress: 'In Progress', pending_verification: 'Pending Verification', closed: 'Closed', overdue: 'Overdue' };
const FSTATUS_COLORS: Record<ESGFindingStatus, string> = { open: '#2563eb', in_progress: '#d97706', pending_verification: '#7c3aed', closed: '#047857', overdue: '#dc2626' };
const COMP_LABELS: Record<ComplianceStatus, string> = { compliant: 'Compliant', partial: 'Partial', non_compliant: 'Non-Compliant', pending_review: 'Pending Review' };
const COMP_COLORS: Record<ComplianceStatus, string> = { compliant: '#047857', partial: '#d97706', non_compliant: '#dc2626', pending_review: '#2563eb' };
const DISC_LABELS: Record<DisclosureStatus, string> = { full: 'Full', partial: 'Partial', minimal: 'Minimal', not_disclosed: 'Not Disclosed' };
const DISC_COLORS: Record<DisclosureStatus, string> = { full: '#047857', partial: '#d97706', minimal: '#ea580c', not_disclosed: '#dc2626' };
const MIT_LABELS: Record<MitigationStatus, string> = { not_started: 'Not Started', in_progress: 'In Progress', implemented: 'Implemented', monitoring: 'Monitoring' };
const MIT_COLORS: Record<MitigationStatus, string> = { not_started: '#dc2626', in_progress: '#d97706', implemented: '#047857', monitoring: '#2563eb' };
const PROB_LABELS: Record<RiskProbability, string> = { rare: 'Rare', unlikely: 'Unlikely', possible: 'Possible', likely: 'Likely', almost_certain: 'Almost Certain' };
const IMPACT_LABELS: Record<RiskImpact, string> = { negligible: 'Negligible', minor: 'Minor', moderate: 'Moderate', major: 'Major', catastrophic: 'Catastrophic' };
const RISK_LEVEL_COLORS: Record<string, string> = { low: '#047857', medium: '#d97706', high: '#ea580c', critical: '#dc2626' };
const DIMENSION_COLORS: Record<string, string> = { environmental: '#047857', social: '#2563eb', governance: '#7c3aed', economic: '#0891b2', community: '#be185d', workforce: '#ea580c' };
const CATEGORY_COLORS: Record<string, string> = { climate: '#047857', regulatory: '#2563eb', reputational: '#7c3aed', supply_chain: '#ea580c', financial: '#0891b2', operational: '#d97706' };

const TABS = [
  { id: 'audit-schedule', label: 'Audit Schedule', icon: 'ClipboardCheck' },
  { id: 'carbon-footprint', label: 'Carbon Footprint', icon: 'CloudRain' },
  { id: 'sustainability-kpis', label: 'Sustainability KPIs', icon: 'Target' },
  { id: 'gri-indicators', label: 'GRI Indicators', icon: 'FileText' },
  { id: 'risk-assessment', label: 'Risk Assessment', icon: 'Hexagon' },
  { id: 'findings', label: 'Findings & CAPA', icon: 'FileWarning' },
  { id: 'compliance', label: 'Compliance', icon: 'Gavel' },
  { id: 'insights', label: 'Insights', icon: 'Sparkles' },
] as const;
type TabId = typeof TABS[number]['id'];

const SDG_DATA = [
  { number: 7, name: 'Affordable & Clean Energy', color: '#F5A623', gradient: 'linear-gradient(135deg, #F5A623, #E8891C)' },
  { number: 6, name: 'Clean Water & Sanitation', color: '#26BDE2', gradient: 'linear-gradient(135deg, #26BDE2, #1A97B8)' },
  { number: 13, name: 'Climate Action', color: '#3F7E44', gradient: 'linear-gradient(135deg, #3F7E44, #2D5E30)' },
  { number: 8, name: 'Decent Work & Economic Growth', color: '#A21942', gradient: 'linear-gradient(135deg, #A21942, #7E1433)' },
  { number: 12, name: 'Responsible Consumption', color: '#BF8B2E', gradient: 'linear-gradient(135deg, #BF8B2E, #9C7224)' },
];

// ============================================================================
// Helpers
// ============================================================================
function fmtDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
function fmtNum(n: number): string { return n.toLocaleString('en-IN'); }
function fmtCompact(n: number): string {
  if (Math.abs(n) >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}
function renderIcon(name: string, size = 14, style?: CSSProperties) {
  const map: Record<string, typeof Activity> = {
    ClipboardCheck, FileWarning, Target, FileText, Hexagon, Gavel, Sparkles,
    CloudRain, TreePine, Users, Building2, Eye, Activity, Leaf, Globe,
    ShieldCheck, BarChart3, CheckCircle2, XCircle, AlertCircle, AlertTriangle,
    TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Minus,
    Zap, Droplets, Wind, Trash2, Factory, Recycle, Heart, Brain, Scale,
    ThermometerSun, Flame, BadgeCheck, TriangleAlert, CircleDot, Layers,
  };
  const Icon = map[name] || Activity;
  return <Icon size={size} style={style} />;
}
function trendIcon(trend: string) {
  if (trend === 'improving') return <ArrowUpRight size={12} style={{ color: '#047857' }} />;
  if (trend === 'declining') return <ArrowDownRight size={12} style={{ color: '#dc2626' }} />;
  return <Minus size={12} style={{ color: '#6b7280' }} />;
}

// ============================================================================
// Main Component
// ============================================================================
export function ESGSustainabilityAuditView() {
  const { toast } = useToast();
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('audit-schedule');
  const [search, setSearch] = useState('');
  const [filterScope, setFilterScope] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterFindingStatus, setFilterFindingStatus] = useState<string>('all');
  const [detailModal, setDetailModal] = useState<{ type: string; id: string } | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/esg-sustainability-audit');
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return (
      <div className="esg-loading">
        <RefreshCw className="animate-spin" size={32} />
        <p>Loading ESG Sustainability Audit data...</p>
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className="esg-error">
        <AlertTriangle size={32} />
        <p>{error || 'No data available'}</p>
        <Button onClick={fetchData}><RefreshCw size={16} /> Retry</Button>
      </div>
    );
  }

  const k = data.kpis;

  return (
    <div className="esg-container">
      {/* Header */}
      <header className="esg-header">
        <div className="esg-header-title">
          <h1><Leaf size={28} /> ESG & Sustainability Audit</h1>
          <p className="esg-subtitle">Comprehensive ESG compliance auditing, carbon verification &amp; GRI reporting</p>
        </div>
        <div className="esg-header-actions">
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw size={14} /> Refresh
          </Button>
          <div className="esg-badge esg-badge-esg"><Globe size={14} /><span>ESG</span></div>
          <div className="esg-badge esg-badge-rating"><Award size={14} /><span>{k.sustainabilityRating}</span></div>
          <div className="esg-badge esg-badge-score"><Gauge size={14} /><span>Composite: <strong>{k.esgCompositeScore}</strong></span></div>
        </div>
      </header>

      {/* KPI Banner */}
      <section className="esg-kpi-banner">
        <div className="esg-kpi-main">
          <div className="esg-kpi-main-value">{k.totalAudits}</div>
          <div className="esg-kpi-main-label">Total Audits</div>
          <div className="esg-kpi-main-sublabel">
            <ClipboardCheck size={12} /> {k.completedAudits} completed · {k.openFindings} open findings
          </div>
        </div>
        <div className="esg-kpi-grid">
          <div className="esg-kpi-tile esg-kpi-tile-teal"><TreePine size={16} /><div><div className="esg-kpi-tile-value">{fmtNum(k.totalCarbonFootprint_tCO2e)}</div><div className="esg-kpi-tile-label">Carbon (tCO2e)</div></div></div>
          <div className="esg-kpi-tile esg-kpi-tile-lime"><Zap size={16} /><div><div className="esg-kpi-tile-value">{k.renewableEnergy_pct}%</div><div className="esg-kpi-tile-label">Renewable Energy</div></div></div>
          <div className="esg-kpi-tile esg-kpi-tile-emerald"><Recycle size={16} /><div><div className="esg-kpi-tile-value">{k.wasteDiversionRate_pct}%</div><div className="esg-kpi-tile-label">Waste Diversion</div></div></div>
          <div className="esg-kpi-tile esg-kpi-tile-teal"><Droplets size={16} /><div><div className="esg-kpi-tile-value">{k.waterIntensity_perUnit}</div><div className="esg-kpi-tile-label">Water Intensity</div></div></div>
          <div className="esg-kpi-tile esg-kpi-tile-lime"><FileText size={16} /><div><div className="esg-kpi-tile-value">{k.griCompliance_pct}%</div><div className="esg-kpi-tile-label">GRI Compliance</div></div></div>
          <div className="esg-kpi-tile esg-kpi-tile-danger"><AlertOctagon size={16} /><div><div className="esg-kpi-tile-value">{k.criticalFindings}</div><div className="esg-kpi-tile-label">Critical Findings</div></div></div>
          <div className="esg-kpi-tile esg-kpi-tile-danger"><Clock size={16} /><div><div className="esg-kpi-tile-value">{k.overdueFindings}</div><div className="esg-kpi-tile-label">Overdue Findings</div></div></div>
          <div className="esg-kpi-tile esg-kpi-tile-emerald"><TrendingUp size={16} /><div><div className="esg-kpi-tile-value">{k.reductionVsBaseline_pct}%</div><div className="esg-kpi-tile-label">CO₂ Reduction</div></div></div>
        </div>
      </section>

      {/* Tabs */}
      <nav className="esg-tabs">
        {TABS.map(t => (
          <button key={t.id} className={cn('esg-tab', activeTab === t.id && 'esg-tab-active')} onClick={() => setActiveTab(t.id)}>
            {renderIcon(t.icon, 14)}
            <span>{t.label}</span>
          </button>
        ))}
      </nav>

      {/* Tab content */}
      <div className="esg-tab-content">
        {activeTab === 'audit-schedule' && (
          <AuditScheduleTab data={data} search={search} setSearch={setSearch} filterScope={filterScope} setFilterScope={setFilterScope} filterStatus={filterStatus} setFilterStatus={setFilterStatus} setDetailModal={setDetailModal} />
        )}
        {activeTab === 'carbon-footprint' && (
          <CarbonFootprintTab data={data} setDetailModal={setDetailModal} />
        )}
        {activeTab === 'sustainability-kpis' && (
          <SustainabilityKPIsTab data={data} />
        )}
        {activeTab === 'gri-indicators' && (
          <GRIIndicatorsTab data={data} />
        )}
        {activeTab === 'risk-assessment' && (
          <RiskAssessmentTab data={data} setDetailModal={setDetailModal} />
        )}
        {activeTab === 'findings' && (
          <FindingsTab data={data} search={search} setSearch={setSearch} filterSeverity={filterSeverity} setFilterSeverity={setFilterSeverity} filterFindingStatus={filterFindingStatus} setFilterFindingStatus={setFilterFindingStatus} setDetailModal={setDetailModal} />
        )}
        {activeTab === 'compliance' && (
          <ComplianceTab data={data} />
        )}
        {activeTab === 'insights' && (
          <InsightsTab data={data} />
        )}
      </div>

      {/* Detail Modal */}
      {detailModal && (
        <DetailModal type={detailModal.type} id={detailModal.id} data={data} onClose={() => setDetailModal(null)} onToast={toast} />
      )}
    </div>
  );
}

// ============================================================================
// Tab 1: Audit Schedule
// ============================================================================
function AuditScheduleTab({ data, search, setSearch, filterScope, setFilterScope, filterStatus, setFilterStatus, setDetailModal }: {
  data: ApiResponse; search: string; setSearch: (s: string) => void;
  filterScope: string; setFilterScope: (s: string) => void;
  filterStatus: string; setFilterStatus: (s: string) => void;
  setDetailModal: (m: { type: string; id: string } | null) => void;
}) {
  const filtered = useMemo(() => {
    return data.audits.filter(a => {
      if (search && !a.title.toLowerCase().includes(search.toLowerCase()) && !a.auditCode.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterScope !== 'all' && a.scope !== filterScope) return false;
      if (filterStatus !== 'all' && a.status !== filterStatus) return false;
      return true;
    });
  }, [data.audits, search, filterScope, filterStatus]);

  return (
    <div className="esg-tab-pane">
      <div className="esg-charts-row">
        <Card className="esg-chart-card">
          <div className="esg-chart-header"><BarChart3 size={16} /><h3>Audits by Scope</h3></div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart><Pie data={data.auditsByScope} dataKey="count" nameKey="label" cx="50%" cy="50%" outerRadius={80} label>
              {data.auditsByScope.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie>
              <Tooltip /><Legend wrapperStyle={{ fontSize: 11 }} /></PieChart>
          </ResponsiveContainer>
        </Card>
        <Card className="esg-chart-card">
          <div className="esg-chart-header"><BarChart3 size={16} /><h3>Audits by Status</h3></div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.auditsByStatus} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 11 }} /><Tooltip />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {data.auditsByStatus.map((e, i) => <Cell key={i} fill={e.color} />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="esg-chart-card">
          <div className="esg-chart-header"><BarChart3 size={16} /><h3>Audits by Outcome</h3></div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.auditsByOutcome} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 11 }} /><Tooltip />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {data.auditsByOutcome.map((e, i) => <Cell key={i} fill={e.color} />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="esg-chart-card esg-trend-card">
        <div className="esg-chart-header"><Activity size={16} /><h3>12-Month Audit Activity Trend</h3></div>
        <ResponsiveContainer width="100%" height={250}>
          <ComposedChart data={data.auditTrend} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip /><Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="scheduled" fill="#2563eb" name="Scheduled" radius={[4, 4, 0, 0]} />
            <Bar dataKey="completed" fill="#047857" name="Completed" radius={[4, 4, 0, 0]} />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      <div className="esg-filter-bar">
        <div className="esg-search-wrapper"><Search size={14} /><Input placeholder="Search audits..." value={search} onChange={e => setSearch(e.target.value)} className="esg-search-input" /></div>
        <select className="esg-select" value={filterScope} onChange={e => setFilterScope(e.target.value)}>
          <option value="all">All Scopes</option>
          {Object.entries(SCOPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select className="esg-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">All Statuses</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <span className="esg-result-count">{filtered.length} audits</span>
      </div>

      <div className="esg-table-wrap">
        <table className="esg-table">
          <thead><tr>
            <th>Code</th><th>Title</th><th>Scope</th><th>Frequency</th><th>Status</th>
            <th>Outcome</th><th>Score</th><th>Lead Auditor</th><th>Warehouse</th>
            <th>Scheduled</th><th>Findings</th><th>Action</th>
          </tr></thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id} className={cn(a.status === 'in_progress' && 'esg-row-active', a.outcome === 'non_compliant' && 'esg-row-danger')}>
                <td><span className="esg-code-pill">{a.auditCode}</span></td>
                <td className="esg-cell-title">{a.title}</td>
                <td><span className="esg-pill" style={{ background: SCOPE_COLORS[a.scope] + '20', color: SCOPE_COLORS[a.scope] }}>{renderIcon(SCOPE_ICONS[a.scope], 12)} {SCOPE_LABELS[a.scope]}</span></td>
                <td className="esg-cell-compact">{a.frequency}</td>
                <td><span className="esg-pill" style={{ background: STATUS_COLORS[a.status] + '20', color: STATUS_COLORS[a.status] }}>{STATUS_LABELS[a.status]}</span></td>
                <td>{a.outcome ? <span className="esg-pill" style={{ background: OUTCOME_COLORS[a.outcome] + '20', color: OUTCOME_COLORS[a.outcome] }}>{OUTCOME_LABELS[a.outcome]}</span> : '—'}</td>
                <td className="esg-cell-compact">{a.score !== null ? <span className={cn('esg-score-pill', a.score >= 85 && 'esg-score-good', a.score < 65 && 'esg-score-bad')}>{a.score}</span> : '—'}</td>
                <td className="esg-cell-compact">{a.leadAuditor.split('(')[0].trim()}</td>
                <td className="esg-cell-compact">{a.warehouseName}</td>
                <td className="esg-cell-compact">{fmtDate(a.scheduledDate)}</td>
                <td className="esg-cell-compact">{a.findingsCount > 0 ? <span className={cn('esg-pill', a.criticalFindings > 0 && 'esg-pill-danger')}>{a.findingsCount}</span> : '—'}</td>
                <td><Button variant="ghost" size="sm" onClick={() => setDetailModal({ type: 'audit', id: a.id })}><Eye size={14} /></Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================================
// Tab 2: Carbon Footprint
// ============================================================================
function CarbonFootprintTab({ data, setDetailModal }: { data: ApiResponse; setDetailModal: (m: { type: string; id: string } | null) => void }) {
  const s1 = data.emissionsByScope.find(e => e.scope === 'scope1');
  const s2 = data.emissionsByScope.find(e => e.scope === 'scope2');
  const s3 = data.emissionsByScope.find(e => e.scope === 'scope3');
  const total = (s1?.total ?? 0) + (s2?.total ?? 0) + (s3?.total ?? 0);

  return (
    <div className="esg-tab-pane">
      <div className="esg-charts-row">
        <Card className="esg-chart-card esg-summary-card">
          <div className="esg-summary-icon" style={{ background: CARBON_COLORS.scope1 + '20', color: CARBON_COLORS.scope1 }}><Flame size={20} /></div>
          <div className="esg-summary-label">Scope 1 (Direct)</div>
          <div className="esg-summary-value">{fmtNum(s1?.total ?? 0)}</div>
          <div className="esg-summary-unit">tCO2e</div>
        </Card>
        <Card className="esg-chart-card esg-summary-card">
          <div className="esg-summary-icon" style={{ background: CARBON_COLORS.scope2 + '20', color: CARBON_COLORS.scope2 }}><Zap size={20} /></div>
          <div className="esg-summary-label">Scope 2 (Indirect Energy)</div>
          <div className="esg-summary-value">{fmtNum(s2?.total ?? 0)}</div>
          <div className="esg-summary-unit">tCO2e</div>
        </Card>
        <Card className="esg-chart-card esg-summary-card">
          <div className="esg-summary-icon" style={{ background: CARBON_COLORS.scope3 + '20', color: CARBON_COLORS.scope3 }}><Truck size={20} /></div>
          <div className="esg-summary-label">Scope 3 (Value Chain)</div>
          <div className="esg-summary-value">{fmtNum(s3?.total ?? 0)}</div>
          <div className="esg-summary-unit">tCO2e</div>
        </Card>
        <Card className="esg-chart-card esg-summary-card">
          <div className="esg-summary-icon" style={{ background: '#04785720', color: '#047857' }}><Globe size={20} /></div>
          <div className="esg-summary-label">Total Carbon Footprint</div>
          <div className="esg-summary-value">{fmtNum(total)}</div>
          <div className="esg-summary-unit">tCO2e</div>
        </Card>
      </div>

      <div className="esg-charts-row">
        <Card className="esg-chart-card">
          <div className="esg-chart-header"><BarChart3 size={16} /><h3>Emissions by Warehouse</h3></div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.emissionsByWarehouse} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="warehouse" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="scope1" stackId="a" fill={CARBON_COLORS.scope1} name="Scope 1" />
              <Bar dataKey="scope2" stackId="a" fill={CARBON_COLORS.scope2} name="Scope 2" />
              <Bar dataKey="scope3" stackId="a" fill={CARBON_COLORS.scope3} name="Scope 3" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="esg-chart-card">
          <div className="esg-chart-header"><TrendingDown size={16} /><h3>Carbon Reduction Trajectory</h3></div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data.reductionTrajectory} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} unit="%" />
              <Tooltip /><Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="target" stroke="#047857" strokeWidth={2} name="Target" dot={{ r: 4 }} />
              <Line type="monotone" dataKey="actual" stroke="#2563eb" strokeWidth={2} name="Actual" dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="esg-table-wrap">
        <table className="esg-table">
          <thead><tr>
            <th>Record</th><th>Warehouse</th><th>Scope</th><th>Category</th>
            <th>Baseline</th><th>Current</th><th>Target %</th><th>Achieved %</th>
            <th>Verification</th><th>Verified By</th><th>Action</th>
          </tr></thead>
          <tbody>
            {data.carbonRecords.map(r => (
              <tr key={r.id} className={cn(r.verificationStatus === 'not_verified' && 'esg-row-warning', r.reductionAchieved < r.reductionTarget && 'esg-row-warning')}>
                <td><span className="esg-code-pill">{r.recordCode}</span></td>
                <td className="esg-cell-title">{r.warehouseName}</td>
                <td><span className="esg-pill" style={{ background: CARBON_COLORS[r.scope] + '20', color: CARBON_COLORS[r.scope] }}>{CARBON_LABELS[r.scope]}</span></td>
                <td className="esg-cell-compact">{r.category}</td>
                <td className="esg-cell-compact">{fmtNum(r.baselineEmissions)}</td>
                <td className="esg-cell-compact">{fmtNum(r.currentEmissions)}</td>
                <td className="esg-cell-compact">{r.reductionTarget}%</td>
                <td><span className={cn('esg-score-pill', r.reductionAchieved >= r.reductionTarget && 'esg-score-good', r.reductionAchieved < r.reductionTarget && 'esg-score-bad')}>{r.reductionAchieved}%</span></td>
                <td><span className="esg-pill" style={{ background: VERIFY_COLORS[r.verificationStatus] + '20', color: VERIFY_COLORS[r.verificationStatus] }}>{VERIFY_LABELS[r.verificationStatus]}</span></td>
                <td className="esg-cell-compact">{r.verifiedBy?.split('(')[0].trim() ?? '—'}</td>
                <td><Button variant="ghost" size="sm" onClick={() => setDetailModal({ type: 'carbon', id: r.id })}><Eye size={14} /></Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================================
// Tab 3: Sustainability KPIs
// ============================================================================
function SustainabilityKPIsTab({ data }: { data: ApiResponse }) {
  const dims = ['environmental', 'social', 'governance', 'economic', 'community', 'workforce'] as const;
  const radarData = dims.map(d => ({
    dimension: d.charAt(0).toUpperCase() + d.slice(1),
    onTrack: data.sustainabilityKPIs.filter(k => k.dimension === d && k.status === 'on_track').length,
    atRisk: data.sustainabilityKPIs.filter(k => k.dimension === d && k.status === 'at_risk').length,
    offTrack: data.sustainabilityKPIs.filter(k => k.dimension === d && k.status === 'off_track').length,
  }));

  return (
    <div className="esg-tab-pane">
      {/* KPI Grid */}
      <div className="esg-kpi-detail-grid">
        {data.sustainabilityKPIs.map(k => (
          <Card key={k.id} className="esg-kpi-detail-card">
            <div className="esg-kpi-detail-header">
              <div className="esg-kpi-detail-dim" style={{ background: DIMENSION_COLORS[k.dimension] + '20', color: DIMENSION_COLORS[k.dimension] }}>{k.dimension}</div>
              {trendIcon(k.trend)}
            </div>
            <div className="esg-kpi-detail-name">{k.name}</div>
            <div className="esg-kpi-detail-values">
              <span className="esg-kpi-detail-actual">{k.actual}</span>
              <span className="esg-kpi-detail-unit">{k.unit}</span>
              <span className="esg-kpi-detail-divider">/</span>
              <span className="esg-kpi-detail-target">Target: {k.target}</span>
            </div>
            <div className="esg-progress-bar">
              <div className="esg-progress-fill" style={{ width: `${Math.min(100, (k.actual / k.target) * 100)}%`, background: k.status === 'on_track' ? '#047857' : k.status === 'at_risk' ? '#d97706' : '#dc2626' }} />
            </div>
            <div className="esg-kpi-detail-footer">
              <span className="esg-pill" style={{ background: k.status === 'on_track' ? '#04785720' : k.status === 'at_risk' ? '#d9770620' : '#dc262620', color: k.status === 'on_track' ? '#047857' : k.status === 'at_risk' ? '#d97706' : '#dc2626' }}>{k.status.replace('_', ' ')}</span>
              {k.grilink && <span className="esg-gri-tag">{k.grilink}</span>}
              {k.sdgAlignment && <span className="esg-sdg-tag">SDG {k.sdgAlignment}</span>}
            </div>
          </Card>
        ))}
      </div>

      {/* Radar Chart */}
      <Card className="esg-chart-card esg-trend-card">
        <div className="esg-chart-header"><Target size={16} /><h3>KPI Performance by Dimension</h3></div>
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart data={radarData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11 }} />
            <PolarRadiusAxis tick={{ fontSize: 10 }} />
            <Radar name="On Track" dataKey="onTrack" stroke="#047857" fill="#047857" fillOpacity={0.3} />
            <Radar name="At Risk" dataKey="atRisk" stroke="#d97706" fill="#d97706" fillOpacity={0.2} />
            <Radar name="Off Track" dataKey="offTrack" stroke="#dc2626" fill="#dc2626" fillOpacity={0.15} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </Card>

      {/* KPI Table */}
      <div className="esg-table-wrap">
        <table className="esg-table">
          <thead><tr>
            <th>Code</th><th>KPI</th><th>Dimension</th><th>Target</th><th>Actual</th>
            <th>Previous</th><th>Trend</th><th>Status</th><th>GRI</th><th>SDG</th>
          </tr></thead>
          <tbody>
            {data.sustainabilityKPIs.map(k => (
              <tr key={k.id} className={cn(k.status === 'off_track' && 'esg-row-danger')}>
                <td><span className="esg-code-pill">{k.kpiCode}</span></td>
                <td className="esg-cell-title">{k.name}</td>
                <td><span className="esg-pill" style={{ background: DIMENSION_COLORS[k.dimension] + '20', color: DIMENSION_COLORS[k.dimension] }}>{k.dimension}</span></td>
                <td className="esg-cell-compact">{k.target} {k.unit}</td>
                <td className="esg-cell-compact">{k.actual} {k.unit}</td>
                <td className="esg-cell-compact">{k.previousYear} {k.unit}</td>
                <td>{trendIcon(k.trend)} <span style={{ fontSize: 12 }}>{k.trend}</span></td>
                <td><span className="esg-pill" style={{ background: k.status === 'on_track' ? '#04785720' : k.status === 'at_risk' ? '#d9770620' : '#dc262620', color: k.status === 'on_track' ? '#047857' : k.status === 'at_risk' ? '#d97706' : '#dc2626' }}>{k.status.replace('_', ' ')}</span></td>
                <td className="esg-cell-compact">{k.grilink ?? '—'}</td>
                <td className="esg-cell-compact">{k.sdgAlignment ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================================
// Tab 4: GRI Indicators
// ============================================================================
function GRIIndicatorsTab({ data }: { data: ApiResponse }) {
  const fullCount = data.griIndicators.filter(g => g.disclosureStatus === 'full').length;
  const partialCount = data.griIndicators.filter(g => g.disclosureStatus === 'partial').length;
  const minimalCount = data.griIndicators.filter(g => g.disclosureStatus === 'minimal').length;
  const notDisclosed = data.griIndicators.filter(g => g.disclosureStatus === 'not_disclosed').length;

  return (
    <div className="esg-tab-pane">
      <div className="esg-stat-tiles">
        <div className="esg-stat-tile"><FileText size={16} /><div><div className="esg-stat-value">{data.griIndicators.length}</div><div className="esg-stat-label">Total GRI Indicators</div></div></div>
        <div className="esg-stat-tile esg-stat-tile-emerald"><CheckCircle2 size={16} /><div><div className="esg-stat-value">{fullCount}</div><div className="esg-stat-label">Full Disclosure</div></div></div>
        <div className="esg-stat-tile esg-stat-tile-warning"><AlertCircle size={16} /><div><div className="esg-stat-value">{partialCount}</div><div className="esg-stat-label">Partial Disclosure</div></div></div>
        <div className="esg-stat-tile esg-stat-tile-danger"><XCircle size={16} /><div><div className="esg-stat-value">{minimalCount + notDisclosed}</div><div className="esg-stat-label">Minimal / Not Disclosed</div></div></div>
        <div className="esg-stat-tile"><Gauge size={16} /><div><div className="esg-stat-value">{data.kpis.griCompliance_pct}%</div><div className="esg-stat-label">GRI Compliance</div></div></div>
      </div>

      {/* GRI Disclosure Pie */}
      <div className="esg-charts-row">
        <Card className="esg-chart-card">
          <div className="esg-chart-header"><PieChart size={16} /><h3>Disclosure Status Distribution</h3></div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={[
                { name: 'Full', value: fullCount, fill: DISC_COLORS.full },
                { name: 'Partial', value: partialCount, fill: DISC_COLORS.partial },
                { name: 'Minimal', value: minimalCount, fill: DISC_COLORS.minimal },
                { name: 'Not Disclosed', value: notDisclosed, fill: DISC_COLORS.not_disclosed },
              ]} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                <Cell fill={DISC_COLORS.full} /><Cell fill={DISC_COLORS.partial} /><Cell fill={DISC_COLORS.minimal} /><Cell fill={DISC_COLORS.not_disclosed} />
              </Pie>
              <Tooltip /><Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card className="esg-chart-card">
          <div className="esg-chart-header"><BarChart3 size={16} /><h3>GRI Standards Coverage</h3></div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={['Emissions', 'Materials', 'Energy', 'Water', 'Waste', 'Employment', 'OHS', 'Diversity', 'Security', 'Communities', 'Anti-Corruption', 'General'].map(std => ({
              standard: std,
              count: data.griIndicators.filter(g => g.griStandard === std).length,
              full: data.griIndicators.filter(g => g.griStandard === std && g.disclosureStatus === 'full').length,
            }))} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="standard" tick={{ fontSize: 9 }} angle={-20} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 11 }} /><Tooltip />
              <Bar dataKey="count" fill="#e5e7eb" name="Total" radius={[4, 4, 0, 0]} />
              <Bar dataKey="full" fill="#047857" name="Full" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* GRI Indicator Cards */}
      <div className="esg-gri-grid">
        {data.griIndicators.map(g => (
          <Card key={g.id} className="esg-gri-card">
            <div className="esg-gri-card-header">
              <span className="esg-gri-code">{g.griCode}</span>
              <span className="esg-pill" style={{ background: DISC_COLORS[g.disclosureStatus] + '20', color: DISC_COLORS[g.disclosureStatus] }}>{DISC_LABELS[g.disclosureStatus]}</span>
            </div>
            <div className="esg-gri-card-topic">{g.topic}</div>
            <div className="esg-gri-card-desc">{g.description}</div>
            <div className="esg-gri-card-footer">
              <span className="esg-gri-tag">{g.complianceRequirement}</span>
              <span className="esg-gri-team">{g.responsibleTeam}</span>
            </div>
            <div className="esg-gri-card-meta">
              <span>Last Reported: {fmtDate(g.lastReported)}</span>
              <span>Next Due: {fmtDate(g.nextDue)}</span>
              <span className="esg-pill" style={{ background: g.dataQuality === 'high' ? '#04785720' : g.dataQuality === 'medium' ? '#d9770620' : '#dc262620', color: g.dataQuality === 'high' ? '#047857' : g.dataQuality === 'medium' ? '#d97706' : '#dc2626' }}>Quality: {g.dataQuality}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Tab 5: Risk Assessment
// ============================================================================
function RiskAssessmentTab({ data, setDetailModal }: { data: ApiResponse; setDetailModal: (m: { type: string; id: string } | null) => void }) {
  const heatmapRows = [5, 4, 3, 2, 1];
  const heatmapCols = [1, 2, 3, 4, 5];
  const getHeatColor = (score: number) => {
    if (score >= 20) return '#dc2626';
    if (score >= 12) return '#ea580c';
    if (score >= 6) return '#d97706';
    return '#047857';
  };

  const mitigationDist = [
    { status: 'implemented', label: 'Implemented', color: '#047857', count: data.risks.filter(r => r.mitigationStatus === 'implemented').length },
    { status: 'monitoring', label: 'Monitoring', color: '#2563eb', count: data.risks.filter(r => r.mitigationStatus === 'monitoring').length },
    { status: 'in_progress', label: 'In Progress', color: '#d97706', count: data.risks.filter(r => r.mitigationStatus === 'in_progress').length },
    { status: 'not_started', label: 'Not Started', color: '#dc2626', count: data.risks.filter(r => r.mitigationStatus === 'not_started').length },
  ];

  const scatterData = data.risks.map(r => ({ x: r.probabilityScore, y: r.impactScore, z: r.riskScore, name: r.title, level: r.riskLevel }));

  return (
    <div className="esg-tab-pane">
      <div className="esg-stat-tiles">
        <div className="esg-stat-tile"><Hexagon size={16} /><div><div className="esg-stat-value">{data.risks.length}</div><div className="esg-stat-label">Total ESG Risks</div></div></div>
        <div className="esg-stat-tile esg-stat-tile-danger"><AlertTriangle size={16} /><div><div className="esg-stat-value">{data.risks.filter(r => r.riskLevel === 'critical').length}</div><div className="esg-stat-label">Critical</div></div></div>
        <div className="esg-stat-tile esg-stat-tile-warning"><AlertCircle size={16} /><div><div className="esg-stat-value">{data.risks.filter(r => r.riskLevel === 'high').length}</div><div className="esg-stat-label">High</div></div></div>
        <div className="esg-stat-tile esg-stat-tile-emerald"><CheckCircle2 size={16} /><div><div className="esg-stat-value">{data.risks.filter(r => r.mitigationStatus === 'implemented').length}</div><div className="esg-stat-label">Mitigated</div></div></div>
      </div>

      {/* Risk Heatmap Matrix */}
      <Card className="esg-chart-card esg-trend-card">
        <div className="esg-chart-header"><Hexagon size={16} /><h3>ESG Risk Matrix (Probability × Impact)</h3></div>
        <div className="esg-heatmap-container">
          <div className="esg-heatmap-label-y">Probability</div>
          <div className="esg-heatmap-grid">
            {heatmapRows.map(p => (
              <div key={p} className="esg-heatmap-row">
                <div className="esg-heatmap-row-label">{PROB_LABELS[['', '', 'rare', 'unlikely', 'possible', 'likely', 'almost_certain'][p] as RiskProbability]}</div>
                {heatmapCols.map(imp => {
                  const cell = data.riskHeatmap.find(h => h.probability === p && h.impact === imp);
                  const score = p * imp;
                  return (
                    <div key={imp} className="esg-heatmap-cell" style={{ background: getHeatColor(score) + (cell?.count ? '40' : '10'), borderColor: getHeatColor(score) }}>
                      <div className="esg-heatmap-cell-score">{score}</div>
                      <div className="esg-heatmap-cell-count">{cell?.count ?? 0}</div>
                    </div>
                  );
                })}
              </div>
            ))}
            <div className="esg-heatmap-col-labels">
              {heatmapCols.map(imp => (
                <div key={imp} className="esg-heatmap-col-label">{IMPACT_LABELS[['', 'negligible', 'minor', 'moderate', 'major', 'catastrophic'][imp] as RiskImpact]}</div>
              ))}
            </div>
          </div>
          <div className="esg-heatmap-label-x">Impact</div>
        </div>
      </Card>

      <div className="esg-charts-row">
        <Card className="esg-chart-card">
          <div className="esg-chart-header"><PieChart size={16} /><h3>Mitigation Status</h3></div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart><Pie data={mitigationDist} dataKey="count" nameKey="label" cx="50%" cy="50%" outerRadius={80} label>
              {mitigationDist.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie>
              <Tooltip /><Legend wrapperStyle={{ fontSize: 11 }} /></PieChart>
          </ResponsiveContainer>
        </Card>
        <Card className="esg-chart-card">
          <div className="esg-chart-header"><Hexagon size={16} /><h3>Probability-Impact Scatter</h3></div>
          <ResponsiveContainer width="100%" height={240}>
            <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="x" name="Probability" tick={{ fontSize: 11 }} domain={[0, 6]} label={{ value: 'Probability', position: 'bottom', fontSize: 11 }} />
              <YAxis dataKey="y" name="Impact" tick={{ fontSize: 11 }} domain={[0, 6]} label={{ value: 'Impact', angle: -90, position: 'left', fontSize: 11 }} />
              <ZAxis dataKey="z" range={[40, 400]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(v: number, name: string) => [name === 'x' ? PROB_LABELS[['', 'rare', 'unlikely', 'possible', 'likely', 'almost_certain'][v] as RiskProbability] : name === 'y' ? IMPACT_LABELS[['', 'negligible', 'minor', 'moderate', 'major', 'catastrophic'][v] as RiskImpact] : v, name]} />
              <Scatter data={scatterData} fill="#7c3aed" />
            </ScatterChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Risk Register Table */}
      <div className="esg-table-wrap">
        <table className="esg-table">
          <thead><tr>
            <th>Code</th><th>Risk</th><th>Category</th><th>Probability</th><th>Impact</th>
            <th>Score</th><th>Level</th><th>Mitigation</th><th>Owner</th><th>Action</th>
          </tr></thead>
          <tbody>
            {data.risks.map(r => (
              <tr key={r.id} className={cn(r.riskLevel === 'critical' && 'esg-row-danger', r.riskLevel === 'high' && 'esg-row-warning')}>
                <td><span className="esg-code-pill">{r.riskCode}</span></td>
                <td className="esg-cell-title">{r.title}</td>
                <td><span className="esg-pill" style={{ background: CATEGORY_COLORS[r.category] + '20', color: CATEGORY_COLORS[r.category] }}>{r.category}</span></td>
                <td className="esg-cell-compact">{PROB_LABELS[r.probability]} ({r.probabilityScore})</td>
                <td className="esg-cell-compact">{IMPACT_LABELS[r.impact]} ({r.impactScore})</td>
                <td><span className="esg-score-pill" style={{ background: RISK_LEVEL_COLORS[r.riskLevel] + '20', color: RISK_LEVEL_COLORS[r.riskLevel] }}>{r.riskScore}</span></td>
                <td><span className="esg-pill" style={{ background: RISK_LEVEL_COLORS[r.riskLevel] + '20', color: RISK_LEVEL_COLORS[r.riskLevel] }}>{r.riskLevel}</span></td>
                <td><span className="esg-pill" style={{ background: MIT_COLORS[r.mitigationStatus] + '20', color: MIT_COLORS[r.mitigationStatus] }}>{MIT_LABELS[r.mitigationStatus]}</span></td>
                <td className="esg-cell-compact">{r.owner.split('(')[0].trim()}</td>
                <td><Button variant="ghost" size="sm" onClick={() => setDetailModal({ type: 'risk', id: r.id })}><Eye size={14} /></Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================================
// Tab 6: Findings & CAPA
// ============================================================================
function FindingsTab({ data, search, setSearch, filterSeverity, setFilterSeverity, filterFindingStatus, setFilterFindingStatus, setDetailModal }: {
  data: ApiResponse; search: string; setSearch: (s: string) => void;
  filterSeverity: string; setFilterSeverity: (s: string) => void;
  filterFindingStatus: string; setFilterFindingStatus: (s: string) => void;
  setDetailModal: (m: { type: string; id: string } | null) => void;
}) {
  const filtered = useMemo(() => {
    return data.findings.filter(f => {
      if (search && !f.description.toLowerCase().includes(search.toLowerCase()) && !f.findingCode.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterSeverity !== 'all' && f.severity !== filterSeverity) return false;
      if (filterFindingStatus !== 'all' && f.status !== filterFindingStatus) return false;
      return true;
    });
  }, [data.findings, search, filterSeverity, filterFindingStatus]);

  const closedCount = data.findings.filter(f => f.status === 'closed').length;
  const totalNonClosed = data.findings.filter(f => f.status !== 'closed').length;
  const closureRate = data.findings.length > 0 ? Math.round((closedCount / data.findings.length) * 100) : 0;

  return (
    <div className="esg-tab-pane">
      <div className="esg-stat-tiles">
        <div className="esg-stat-tile"><FileWarning size={16} /><div><div className="esg-stat-value">{data.findings.length}</div><div className="esg-stat-label">Total Findings</div></div></div>
        <div className="esg-stat-tile esg-stat-tile-danger"><AlertOctagon size={16} /><div><div className="esg-stat-value">{data.findings.filter(f => f.severity === 'critical' && f.status !== 'closed').length}</div><div className="esg-stat-label">Critical Open</div></div></div>
        <div className="esg-stat-tile esg-stat-tile-warning"><Clock size={16} /><div><div className="esg-stat-value">{data.findings.filter(f => f.status === 'overdue').length}</div><div className="esg-stat-label">Overdue</div></div></div>
        <div className="esg-stat-tile esg-stat-tile-emerald"><CheckCircle2 size={16} /><div><div className="esg-stat-value">{closureRate}%</div><div className="esg-stat-label">Closure Rate</div></div></div>
      </div>

      <div className="esg-charts-row">
        <Card className="esg-chart-card">
          <div className="esg-chart-header"><BarChart3 size={16} /><h3>Findings by Severity</h3></div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.findingsBySeverity} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} /><Tooltip />
              <Bar dataKey="count" name="Total" radius={[4, 4, 0, 0]}>
                {data.findingsBySeverity.map((e, i) => <Cell key={i} fill={e.color} />)}</Bar>
              <Bar dataKey="open" name="Open" radius={[4, 4, 0, 0]} fillOpacity={0.5}>
                {data.findingsBySeverity.map((e, i) => <Cell key={i} fill={e.color} />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="esg-chart-card">
          <div className="esg-chart-header"><BarChart3 size={16} /><h3>Findings by Status</h3></div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart><Pie data={data.findingsByStatus} dataKey="count" nameKey="label" cx="50%" cy="50%" outerRadius={80} label>
              {data.findingsByStatus.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie>
              <Tooltip /><Legend wrapperStyle={{ fontSize: 11 }} /></PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="esg-filter-bar">
        <div className="esg-search-wrapper"><Search size={14} /><Input placeholder="Search findings..." value={search} onChange={e => setSearch(e.target.value)} className="esg-search-input" /></div>
        <select className="esg-select" value={filterSeverity} onChange={e => setFilterSeverity(e.target.value)}>
          <option value="all">All Severities</option>
          {Object.entries(SEVERITY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select className="esg-select" value={filterFindingStatus} onChange={e => setFilterFindingStatus(e.target.value)}>
          <option value="all">All Statuses</option>
          {Object.entries(FSTATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <span className="esg-result-count">{filtered.length} findings</span>
      </div>

      <div className="esg-table-wrap">
        <table className="esg-table">
          <thead><tr>
            <th>Code</th><th>Description</th><th>Scope</th><th>Severity</th><th>Status</th>
            <th>Category</th><th>Identified</th><th>Due</th><th>CAPA ID</th><th>Owner</th><th>Action</th>
          </tr></thead>
          <tbody>
            {filtered.map(f => (
              <tr key={f.id} className={cn(f.status === 'overdue' && 'esg-row-danger', f.severity === 'critical' && 'esg-row-warning')}>
                <td><span className="esg-code-pill">{f.findingCode}</span></td>
                <td className="esg-cell-title" style={{ maxWidth: 300 }}>{f.description}</td>
                <td><span className="esg-pill" style={{ background: SCOPE_COLORS[f.scope] + '20', color: SCOPE_COLORS[f.scope] }}>{SCOPE_LABELS[f.scope]}</span></td>
                <td><span className="esg-pill" style={{ background: SEVERITY_COLORS[f.severity] + '20', color: SEVERITY_COLORS[f.severity] }}>{SEVERITY_LABELS[f.severity]}</span></td>
                <td><span className="esg-pill" style={{ background: FSTATUS_COLORS[f.status] + '20', color: FSTATUS_COLORS[f.status] }}>{FSTATUS_LABELS[f.status]}</span></td>
                <td className="esg-cell-compact">{f.category}</td>
                <td className="esg-cell-compact">{fmtDate(f.identifiedDate)}</td>
                <td className="esg-cell-compact">{fmtDate(f.dueDate)}</td>
                <td className="esg-cell-compact">{f.capaId ?? '—'}</td>
                <td className="esg-cell-compact">{f.owner.split('(')[0].trim()}</td>
                <td><Button variant="ghost" size="sm" onClick={() => setDetailModal({ type: 'finding', id: f.id })}><Eye size={14} /></Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================================
// Tab 7: Compliance
// ============================================================================
function ComplianceTab({ data }: { data: ApiResponse }) {
  const compDist = (Object.keys(COMP_LABELS) as ComplianceStatus[]).map(s => ({
    status: s, label: COMP_LABELS[s], color: COMP_COLORS[s],
    count: data.complianceObligations.filter(o => o.status === s).length,
  }));

  const upcoming = data.complianceObligations.filter(o => o.status !== 'compliant').slice(0, 8);

  return (
    <div className="esg-tab-pane">
      <div className="esg-stat-tiles">
        <div className="esg-stat-tile"><Gavel size={16} /><div><div className="esg-stat-value">{data.complianceObligations.length}</div><div className="esg-stat-label">Total Obligations</div></div></div>
        <div className="esg-stat-tile esg-stat-tile-emerald"><CheckCircle2 size={16} /><div><div className="esg-stat-value">{data.complianceObligations.filter(o => o.status === 'compliant').length}</div><div className="esg-stat-label">Compliant</div></div></div>
        <div className="esg-stat-tile esg-stat-tile-warning"><AlertCircle size={16} /><div><div className="esg-stat-value">{data.complianceObligations.filter(o => o.status === 'partial').length}</div><div className="esg-stat-label">Partial</div></div></div>
        <div className="esg-stat-tile esg-stat-tile-danger"><XCircle size={16} /><div><div className="esg-stat-value">{data.complianceObligations.filter(o => o.status === 'non_compliant').length}</div><div className="esg-stat-label">Non-Compliant</div></div></div>
        <div className="esg-stat-tile"><Gauge size={16} /><div><div className="esg-stat-value">{Math.round(data.complianceObligations.reduce((s, o) => s + o.complianceScore, 0) / Math.max(data.complianceObligations.length, 1))}%</div><div className="esg-stat-label">Avg Compliance Score</div></div></div>
      </div>

      <div className="esg-charts-row">
        <Card className="esg-chart-card">
          <div className="esg-chart-header"><BarChart3 size={16} /><h3>Compliance Status Distribution</h3></div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={compDist} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} /><Tooltip />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {compDist.map((e, i) => <Cell key={i} fill={e.color} />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="esg-chart-card">
          <div className="esg-chart-header"><Clock size={16} /><h3>Upcoming Deadlines</h3></div>
          <div className="esg-deadline-list">
            {upcoming.map(o => (
              <div key={o.id} className="esg-deadline-item">
                <div className="esg-deadline-dot" style={{ background: COMP_COLORS[o.status] }} />
                <div className="esg-deadline-content">
                  <div className="esg-deadline-title">{o.regulation}</div>
                  <div className="esg-deadline-meta">Due: {fmtDate(o.dueDate)} · Score: {o.complianceScore}%</div>
                </div>
                <span className="esg-pill" style={{ background: COMP_COLORS[o.status] + '20', color: COMP_COLORS[o.status] }}>{COMP_LABELS[o.status]}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="esg-table-wrap">
        <table className="esg-table">
          <thead><tr>
            <th>Code</th><th>Regulation</th><th>Authority</th><th>Category</th><th>Status</th>
            <th>Score</th><th>Due Date</th><th>SDG</th><th>Penalties</th><th>Team</th>
          </tr></thead>
          <tbody>
            {data.complianceObligations.map(o => (
              <tr key={o.id} className={cn(o.status === 'non_compliant' && 'esg-row-danger', o.status === 'partial' && 'esg-row-warning')}>
                <td><span className="esg-code-pill">{o.obligationCode}</span></td>
                <td className="esg-cell-title">{o.regulation}</td>
                <td className="esg-cell-compact">{o.authority}</td>
                <td><span className="esg-pill" style={{ background: DIMENSION_COLORS[o.category] + '20', color: DIMENSION_COLORS[o.category] }}>{o.category}</span></td>
                <td><span className="esg-pill" style={{ background: COMP_COLORS[o.status] + '20', color: COMP_COLORS[o.status] }}>{COMP_LABELS[o.status]}</span></td>
                <td><span className={cn('esg-score-pill', o.complianceScore >= 80 && 'esg-score-good', o.complianceScore < 55 && 'esg-score-bad')}>{o.complianceScore}%</span></td>
                <td className="esg-cell-compact">{fmtDate(o.dueDate)}</td>
                <td className="esg-cell-compact">{o.sdgAlignment ? <span className="esg-sdg-tag">SDG {o.sdgAlignment}</span> : '—'}</td>
                <td className="esg-cell-compact" style={{ fontSize: 11 }}>{o.penalties}</td>
                <td className="esg-cell-compact">{o.responsibleTeam}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================================
// Tab 8: Insights
// ============================================================================
function InsightsTab({ data }: { data: ApiResponse }) {
  const healthTiles = [
    { label: 'Environmental Score', value: Math.round(data.sustainabilityKPIs.filter(k => k.dimension === 'environmental').reduce((s, k) => s + (k.status === 'on_track' ? 100 : k.status === 'at_risk' ? 50 : 0), 0) / Math.max(data.sustainabilityKPIs.filter(k => k.dimension === 'environmental').length, 1)), icon: TreePine, color: '#047857' },
    { label: 'Social Score', value: Math.round(data.sustainabilityKPIs.filter(k => k.dimension === 'social').reduce((s, k) => s + (k.status === 'on_track' ? 100 : k.status === 'at_risk' ? 50 : 0), 0) / Math.max(data.sustainabilityKPIs.filter(k => k.dimension === 'social').length, 1)), icon: Users, color: '#2563eb' },
    { label: 'Governance Score', value: Math.round(data.sustainabilityKPIs.filter(k => k.dimension === 'governance').reduce((s, k) => s + (k.status === 'on_track' ? 100 : k.status === 'at_risk' ? 50 : 0), 0) / Math.max(data.sustainabilityKPIs.filter(k => k.dimension === 'governance').length, 1)), icon: Building2, color: '#7c3aed' },
    { label: 'Risk Readiness', value: Math.round(data.risks.filter(r => r.mitigationStatus === 'implemented' || r.mitigationStatus === 'monitoring').length / Math.max(data.risks.length, 1) * 100), icon: ShieldCheck, color: '#0891b2' },
    { label: 'Disclosure Readiness', value: data.kpis.griCompliance_pct, icon: FileText, color: '#be185d' },
  ];

  return (
    <div className="esg-tab-pane">
      {/* ESG Insights */}
      <div className="esg-insights-section">
        <h3 className="esg-section-title"><Sparkles size={18} /> ESG Auto-Generated Insights</h3>
        <div className="esg-insight-list">
          {data.insights.map((insight, i) => (
            <div key={i} className={`esg-insight-row esg-insight-${insight.type}`}>
              <div className="esg-insight-icon">
                {insight.type === 'danger' && <AlertTriangle size={18} />}
                {insight.type === 'warning' && <AlertCircle size={18} />}
                {insight.type === 'success' && <CheckCircle2 size={18} />}
                {insight.type === 'info' && <Info size={18} />}
              </div>
              <div className="esg-insight-content">
                <div className="esg-insight-title">{insight.title}</div>
                <div className="esg-insight-desc">{insight.description}</div>
                <div className="esg-insight-rec"><strong>Recommendation:</strong> {insight.recommendation}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ESG Health Scorecard */}
      <div className="esg-health-section">
        <h3 className="esg-section-title"><Gauge size={18} /> ESG Health Scorecard</h3>
        <div className="esg-health-tiles">
          {healthTiles.map(tile => (
            <Card key={tile.label} className="esg-health-tile">
              <div className="esg-health-tile-icon" style={{ background: tile.color + '20', color: tile.color }}>
                <tile.icon size={20} />
              </div>
              <div className="esg-health-tile-value" style={{ color: tile.color }}>{tile.value}</div>
              <div className="esg-health-tile-label">{tile.label}</div>
              <div className="esg-health-tile-bar">
                <div className="esg-health-tile-fill" style={{ width: `${tile.value}%`, background: tile.color }} />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* SDG Alignment Grid */}
      <div className="esg-sdg-section">
        <h3 className="esg-section-title"><Globe size={18} /> SDG Alignment</h3>
        <div className="esg-sdg-grid">
          {SDG_DATA.map(sdg => {
            const linkedObligations = data.complianceObligations.filter(o => o.sdgAlignment === sdg.number).length;
            const linkedKPIs = data.sustainabilityKPIs.filter(k => k.sdgAlignment === sdg.number).length;
            return (
              <div key={sdg.number} className="esg-sdg-tile" style={{ background: sdg.gradient }}>
                <div className="esg-sdg-tile-number">SDG {sdg.number}</div>
                <div className="esg-sdg-tile-name">{sdg.name}</div>
                <div className="esg-sdg-tile-stats">
                  <span>{linkedObligations} regulations</span>
                  <span>{linkedKPIs} KPIs</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Detail Modal
// ============================================================================
function DetailModal({ type, id, data, onClose, onToast }: {
  type: string; id: string; data: ApiResponse;
  onClose: () => void; onToast: (opts: { title: string; description: string }) => void;
}) {
  if (type === 'audit') {
    const a = data.audits.find(x => x.id === id);
    if (!a) return null;
    const linkedFindings = data.findings.filter(f => f.auditId === id);
    return (
      <div className="esg-modal-overlay" onClick={onClose}>
        <div className="esg-modal" onClick={e => e.stopPropagation()}>
          <div className="esg-modal-header">
            <h3><ClipboardCheck size={18} /> {a.auditCode}</h3>
            <button onClick={onClose}><X size={18} /></button>
          </div>
          <div className="esg-modal-body">
            <div className="esg-modal-field"><span className="esg-modal-label">Title</span><span>{a.title}</span></div>
            <div className="esg-modal-row">
              <div className="esg-modal-field"><span className="esg-modal-label">Scope</span><span className="esg-pill" style={{ background: SCOPE_COLORS[a.scope] + '20', color: SCOPE_COLORS[a.scope] }}>{SCOPE_LABELS[a.scope]}</span></div>
              <div className="esg-modal-field"><span className="esg-modal-label">Status</span><span className="esg-pill" style={{ background: STATUS_COLORS[a.status] + '20', color: STATUS_COLORS[a.status] }}>{STATUS_LABELS[a.status]}</span></div>
              <div className="esg-modal-field"><span className="esg-modal-label">Outcome</span><span>{a.outcome ? <span className="esg-pill" style={{ background: OUTCOME_COLORS[a.outcome] + '20', color: OUTCOME_COLORS[a.outcome] }}>{OUTCOME_LABELS[a.outcome]}</span> : '—'}</span></div>
            </div>
            <div className="esg-modal-row">
              <div className="esg-modal-field"><span className="esg-modal-label">Frequency</span><span>{a.frequency}</span></div>
              <div className="esg-modal-field"><span className="esg-modal-label">Score</span><span>{a.score ?? '—'}</span></div>
              <div className="esg-modal-field"><span className="esg-modal-label">Findings</span><span>{a.findingsCount} (C:{a.criticalFindings} M:{a.majorFindings})</span></div>
            </div>
            <div className="esg-modal-row">
              <div className="esg-modal-field"><span className="esg-modal-label">Warehouse</span><span>{a.warehouseName}</span></div>
              <div className="esg-modal-field"><span className="esg-modal-label">Lead Auditor</span><span>{a.leadAuditor}</span></div>
              <div className="esg-modal-field"><span className="esg-modal-label">Team Size</span><span>{a.auditTeamSize}</span></div>
            </div>
            <div className="esg-modal-row">
              <div className="esg-modal-field"><span className="esg-modal-label">Scheduled</span><span>{fmtDate(a.scheduledDate)}</span></div>
              <div className="esg-modal-field"><span className="esg-modal-label">Completed</span><span>{fmtDate(a.completedDate)}</span></div>
              <div className="esg-modal-field"><span className="esg-modal-label">Next Audit</span><span>{fmtDate(a.nextAuditDate)}</span></div>
            </div>
            {linkedFindings.length > 0 && (
              <div className="esg-modal-subsection">
                <h4>Linked Findings ({linkedFindings.length})</h4>
                {linkedFindings.map(f => (
                  <div key={f.id} className="esg-modal-finding-row">
                    <span className="esg-pill" style={{ background: SEVERITY_COLORS[f.severity] + '20', color: SEVERITY_COLORS[f.severity] }}>{SEVERITY_LABELS[f.severity]}</span>
                    <span className="esg-pill" style={{ background: FSTATUS_COLORS[f.status] + '20', color: FSTATUS_COLORS[f.status] }}>{FSTATUS_LABELS[f.status]}</span>
                    <span className="esg-finding-summary">{f.description}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'carbon') {
    const r = data.carbonRecords.find(x => x.id === id);
    if (!r) return null;
    return (
      <div className="esg-modal-overlay" onClick={onClose}>
        <div className="esg-modal" onClick={e => e.stopPropagation()}>
          <div className="esg-modal-header">
            <h3><CloudRain size={18} /> {r.recordCode}</h3>
            <button onClick={onClose}><X size={18} /></button>
          </div>
          <div className="esg-modal-body">
            <div className="esg-modal-row">
              <div className="esg-modal-field"><span className="esg-modal-label">Warehouse</span><span>{r.warehouseName}</span></div>
              <div className="esg-modal-field"><span className="esg-modal-label">Scope</span><span className="esg-pill" style={{ background: CARBON_COLORS[r.scope] + '20', color: CARBON_COLORS[r.scope] }}>{CARBON_LABELS[r.scope]}</span></div>
              <div className="esg-modal-field"><span className="esg-modal-label">Category</span><span>{r.category}</span></div>
            </div>
            <div className="esg-modal-row">
              <div className="esg-modal-field"><span className="esg-modal-label">Baseline ({r.baselineYear})</span><span>{fmtNum(r.baselineEmissions)} {r.unit}</span></div>
              <div className="esg-modal-field"><span className="esg-modal-label">Current ({r.currentYear})</span><span>{fmtNum(r.currentEmissions)} {r.unit}</span></div>
              <div className="esg-modal-field"><span className="esg-modal-label">Achieved</span><span className={cn('esg-score-pill', r.reductionAchieved >= r.reductionTarget && 'esg-score-good', r.reductionAchieved < r.reductionTarget && 'esg-score-bad')}>{r.reductionAchieved}% (target: {r.reductionTarget}%)</span></div>
            </div>
            <div className="esg-modal-row">
              <div className="esg-modal-field"><span className="esg-modal-label">Verification</span><span className="esg-pill" style={{ background: VERIFY_COLORS[r.verificationStatus] + '20', color: VERIFY_COLORS[r.verificationStatus] }}>{VERIFY_LABELS[r.verificationStatus]}</span></div>
              <div className="esg-modal-field"><span className="esg-modal-label">Verified By</span><span>{r.verifiedBy ?? '—'}</span></div>
              <div className="esg-modal-field"><span className="esg-modal-label">Verified Date</span><span>{fmtDate(r.verifiedDate)}</span></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'risk') {
    const r = data.risks.find(x => x.id === id);
    if (!r) return null;
    return (
      <div className="esg-modal-overlay" onClick={onClose}>
        <div className="esg-modal" onClick={e => e.stopPropagation()}>
          <div className="esg-modal-header">
            <h3><Hexagon size={18} /> {r.riskCode}</h3>
            <button onClick={onClose}><X size={18} /></button>
          </div>
          <div className="esg-modal-body">
            <div className="esg-modal-field"><span className="esg-modal-label">Risk</span><span>{r.title}</span></div>
            <div className="esg-modal-row">
              <div className="esg-modal-field"><span className="esg-modal-label">Category</span><span className="esg-pill" style={{ background: CATEGORY_COLORS[r.category] + '20', color: CATEGORY_COLORS[r.category] }}>{r.category}</span></div>
              <div className="esg-modal-field"><span className="esg-modal-label">Risk Score</span><span className="esg-score-pill" style={{ background: RISK_LEVEL_COLORS[r.riskLevel] + '20', color: RISK_LEVEL_COLORS[r.riskLevel] }}>{r.riskScore} ({r.riskLevel})</span></div>
              <div className="esg-modal-field"><span className="esg-modal-label">Mitigation</span><span className="esg-pill" style={{ background: MIT_COLORS[r.mitigationStatus] + '20', color: MIT_COLORS[r.mitigationStatus] }}>{MIT_LABELS[r.mitigationStatus]}</span></div>
            </div>
            <div className="esg-modal-row">
              <div className="esg-modal-field"><span className="esg-modal-label">Probability</span><span>{PROB_LABELS[r.probability]} ({r.probabilityScore})</span></div>
              <div className="esg-modal-field"><span className="esg-modal-label">Impact</span><span>{IMPACT_LABELS[r.impact]} ({r.impactScore})</span></div>
              <div className="esg-modal-field"><span className="esg-modal-label">Owner</span><span>{r.owner.split('(')[0].trim()}</span></div>
            </div>
            <div className="esg-modal-field"><span className="esg-modal-label">Mitigation Plan</span><span>{r.mitigationPlan}</span></div>
            <div className="esg-modal-row">
              <div className="esg-modal-field"><span className="esg-modal-label">Last Reviewed</span><span>{fmtDate(r.lastReviewed)}</span></div>
              <div className="esg-modal-field"><span className="esg-modal-label">Next Review</span><span>{fmtDate(r.nextReview)}</span></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'finding') {
    const f = data.findings.find(x => x.id === id);
    if (!f) return null;
    return (
      <div className="esg-modal-overlay" onClick={onClose}>
        <div className="esg-modal" onClick={e => e.stopPropagation()}>
          <div className="esg-modal-header">
            <h3><FileWarning size={18} /> {f.findingCode}</h3>
            <button onClick={onClose}><X size={18} /></button>
          </div>
          <div className="esg-modal-body">
            <div className="esg-modal-field"><span className="esg-modal-label">Description</span><span>{f.description}</span></div>
            <div className="esg-modal-row">
              <div className="esg-modal-field"><span className="esg-modal-label">Scope</span><span className="esg-pill" style={{ background: SCOPE_COLORS[f.scope] + '20', color: SCOPE_COLORS[f.scope] }}>{SCOPE_LABELS[f.scope]}</span></div>
              <div className="esg-modal-field"><span className="esg-modal-label">Severity</span><span className="esg-pill" style={{ background: SEVERITY_COLORS[f.severity] + '20', color: SEVERITY_COLORS[f.severity] }}>{SEVERITY_LABELS[f.severity]}</span></div>
              <div className="esg-modal-field"><span className="esg-modal-label">Status</span><span className="esg-pill" style={{ background: FSTATUS_COLORS[f.status] + '20', color: FSTATUS_COLORS[f.status] }}>{FSTATUS_LABELS[f.status]}</span></div>
            </div>
            <div className="esg-modal-row">
              <div className="esg-modal-field"><span className="esg-modal-label">Identified</span><span>{fmtDate(f.identifiedDate)}</span></div>
              <div className="esg-modal-field"><span className="esg-modal-label">Due Date</span><span>{fmtDate(f.dueDate)}</span></div>
              <div className="esg-modal-field"><span className="esg-modal-label">Closed</span><span>{fmtDate(f.closedDate)}</span></div>
            </div>
            <div className="esg-modal-field"><span className="esg-modal-label">Root Cause</span><span>{f.rootCause ?? 'Not yet determined'}</span></div>
            <div className="esg-modal-field"><span className="esg-modal-label">Corrective Action</span><span>{f.correctiveAction ?? 'Not yet assigned'}</span></div>
            <div className="esg-modal-field"><span className="esg-modal-label">Preventive Action</span><span>{f.preventiveAction ?? 'Not yet assigned'}</span></div>
            <div className="esg-modal-row">
              <div className="esg-modal-field"><span className="esg-modal-label">CAPA ID</span><span>{f.capaId ?? '—'}</span></div>
              <div className="esg-modal-field"><span className="esg-modal-label">Owner</span><span>{f.owner.split('(')[0].trim()}</span></div>
              <div className="esg-modal-field"><span className="esg-modal-label">Warehouse</span><span>{f.warehouseName}</span></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
