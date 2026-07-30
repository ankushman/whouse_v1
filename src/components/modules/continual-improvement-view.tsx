// R110: Continual Improvement Program (ISO 9001:2015 §10.3) View
'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import type { CSSProperties } from 'react';
import {
  RefreshCw, AlertTriangle, Search, Lightbulb, TrendingUp, TrendingDown,
  ChevronRight, X, Activity, Target, Zap, Info, ShieldCheck, Gauge,
  Award, Crown, Star, BadgeCheck, AlertOctagon, Clock, Eye, Network,
  BarChart3, Filter, ChevronDown, ChevronUp, Building2, Hash, FileCheck,
  FileWarning, Sparkles, CheckCircle2, XCircle, AlertCircle, Coins,
  Workflow, Cpu, HeartHandshake, Leaf, Scale, HardHat, Cog, Heart,
  GitBranch, Rocket, Trophy, Users, CalendarClock, FileText, ExternalLink,
} from 'lucide-react';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, ComposedChart, Line, ReferenceLine,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================
type ProjectPhase = 'charter' | 'plan' | 'do' | 'study' | 'act' | 'closed';
type ProjectStatus = 'on_track' | 'at_risk' | 'delayed' | 'completed' | 'cancelled' | 'on_hold';
type ProjectPriority = 'critical' | 'high' | 'medium' | 'low';
type ProjectCategory = 'process_efficiency' | 'cost_reduction' | 'quality_enhancement' | 'safety_improvement' | 'customer_experience' | 'sustainability' | 'digital_transformation' | 'compliance';
type ProjectMethodology = 'pdsa' | 'dmaic' | 'lean' | 'six_sigma' | 'kaizen_blitz' | 'tocef' | 'agile';
type SuggestionStatus = 'submitted' | 'under_review' | 'approved' | 'rejected' | 'in_progress' | 'implemented' | 'archived';
type SuggestionCategory = 'process' | 'equipment' | 'safety' | 'quality' | 'cost' | 'environment' | 'employee_wellbeing' | 'customer';
type SuggestionImpact = 'incremental' | 'breakthrough' | 'transformational';
type PDSAStage = 'plan' | 'do' | 'study' | 'act';
type BestPracticeMaturity = 'emerging' | 'validated' | 'standardized' | 'embedded' | 'optimizing';

interface ImprovementProject {
  id: string; projectCode: string; title: string; description: string;
  category: ProjectCategory; methodology: ProjectMethodology; priority: ProjectPriority;
  phase: ProjectPhase; status: ProjectStatus;
  sponsor: string; sponsorRole: string; projectLead: string; teamMembers: number;
  warehouseCode: string; department: string;
  startDate: string; targetEndDate: string; actualEndDate: string | null;
  percentComplete: number; daysToTarget: number;
  estimatedCostInr: number; actualCostInr: number;
  estimatedBenefitInr: number; realizedBenefitInr: number; roiPercent: number;
  linkedAuditFinding: string | null; linkedCapaId: string | null;
  linkedDocNumber: string | null; linkedTrainingId: string | null; linkedSuggestionId: string | null;
  successCriteria: string; keyRisks: string;
}
interface KaizenSuggestion {
  id: string; suggestionCode: string; title: string; description: string;
  submittedBy: string; submittedByRole: string; submittedByDepartment: string;
  warehouseCode: string; submittedDate: string;
  category: SuggestionCategory; impact: SuggestionImpact; status: SuggestionStatus;
  estimatedBenefitInr: number; actualBenefitInr: number; implementationDays: number;
  reviewedBy: string; reviewedDate: string | null; implementedDate: string | null;
  linkedProjectId: string | null;
  upvotes: number; comments: number; recognitionPoints: number;
}
interface PDSACycle {
  id: string; projectId: string; projectTitle: string; cycleNumber: number;
  stage: PDSAStage; hypothesis: string;
  planActions: string; planOwner: string; planTargetDate: string;
  doActions: string; doOwner: string; doStartDate: string; doEndDate: string | null;
  studyFindings: string; studyOwner: string; studyDate: string | null;
  studyOutcome: 'validated' | 'invalidated' | 'partial' | 'inconclusive';
  actDecision: 'standardize' | 'iterate' | 'abandon' | 'pilot_extension';
  actActions: string; actOwner: string; actDate: string | null;
  metricsBaseline: number; metricsTarget: number; metricsActual: number; metricsImprovementPct: number;
  iterationCount: number;
}
interface ROIMeasurement {
  id: string; projectId: string; projectTitle: string; category: ProjectCategory;
  costSavedInr: number; revenueLiftInr: number; costAvoidedInr: number;
  productivityGainPct: number; cycleTimeReductionPct: number; defectReductionPct: number;
  customerSatisfactionLift: number;
  totalInvestmentInr: number; totalBenefitInr: number; netBenefitInr: number;
  roiPercent: number; paybackMonths: number; npvInr: number; irrPercent: number;
  measurementPeriod: string; measurementDate: string;
  verified: boolean; verifiedBy: string;
}
interface BestPractice {
  id: string; practiceCode: string; title: string; description: string;
  category: ProjectCategory; originWarehouseCode: string; originProjectId: string;
  maturity: BestPracticeMaturity; replicatedTo: string[]; replicationCount: number;
  documentedDate: string; lastUpdated: string; documentedBy: string;
  approvalStatus: 'draft' | 'in_review' | 'approved' | 'deprecated';
  sopReference: string | null; trainingRequired: boolean; linkedDocNumber: string | null;
  impactSummary: string;
  estimatedSavingsPerSiteInr: number; totalEstimatedSavingsInr: number;
}
interface CrossModuleLink {
  sourceModule: string; sourceLabel: string;
  improvementCount: number; closedLoopCount: number; closedLoopRate: number;
  pendingActionCount: number; totalBenefitInr: number; color: string;
}
interface KPIs {
  totalProjects: number; activeProjects: number; completedProjects: number;
  delayedProjects: number; atRiskProjects: number; onTrackRate: number;
  criticalProjects: number; highProjects: number;
  totalInvestment: number; totalRealizedBenefit: number; totalEstimatedBenefit: number; portfolioROI: number;
  totalSuggestions: number; implementedSuggestions: number; implementationRate: number;
  totalSuggestionBenefit: number; totalRecognitionPoints: number;
  totalPDSACycles: number; validatedCycles: number; standardizationRate: number;
  totalBestPractices: number; embeddedPractices: number; totalReplications: number;
  totalEstimatedReplicationSavings: number;
  crossModuleSources: number; closedLoopRate: number;
  iso_10_3_1: number; iso_10_3_2: number; iso_10_3_3: number;
  overallCompliance: number; effectiveness: number;
}
interface ApiResponse {
  generatedAt: string;
  kpis: KPIs;
  projects: ImprovementProject[];
  suggestions: KaizenSuggestion[];
  cycles: PDSACycle[];
  roi: ROIMeasurement[];
  practices: BestPractice[];
  crossModule: CrossModuleLink[];
  projectsByPhase: { phase: ProjectPhase; label: string; color: string; count: number }[];
  projectsByStatus: { status: ProjectStatus; label: string; color: string; count: number }[];
  projectsByCategory: { category: ProjectCategory; label: string; color: string; count: number; benefit: number }[];
  projectsByMethodology: { methodology: ProjectMethodology; label: string; color: string; count: number }[];
  suggestionsByStatus: { status: SuggestionStatus; label: string; color: string; count: number }[];
  suggestionsByCategory: { category: SuggestionCategory; label: string; color: string; count: number; benefit: number }[];
  suggestionsByImpact: { impact: SuggestionImpact; label: string; color: string; count: number; benefit: number }[];
  projectTrend: { month: string; newProjects: number; newSuggestions: number; implemented: number; benefit: number }[];
  pdsaStageBreakdown: { stage: PDSAStage; label: string; count: number }[];
  studyOutcomeBreakdown: { outcome: string; label: string; count: number }[];
  maturityBreakdown: { maturity: BestPracticeMaturity; label: string; color: string; level: number; count: number }[];
  topROIProjects: { projectId: string; projectTitle: string; category: ProjectCategory; roiPercent: number; netBenefitInr: number; paybackMonths: number; verified: boolean }[];
  topSuggestions: KaizenSuggestion[];
  insights: { type: 'danger' | 'warning' | 'success' | 'info'; title: string; description: string; recommendation: string }[];
}

// ============================================================================
// Constants
// ============================================================================
const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  process_efficiency: 'Process Efficiency', cost_reduction: 'Cost Reduction',
  quality_enhancement: 'Quality Enhancement', safety_improvement: 'Safety Improvement',
  customer_experience: 'Customer Experience', sustainability: 'Sustainability',
  digital_transformation: 'Digital Transformation', compliance: 'Compliance',
};
const CATEGORY_COLORS: Record<ProjectCategory, string> = {
  process_efficiency: '#4f46e5', cost_reduction: '#0891b2',
  quality_enhancement: '#047857', safety_improvement: '#dc2626',
  customer_experience: '#7c3aed', sustainability: '#15803d',
  digital_transformation: '#be185d', compliance: '#9333ea',
};
const METHODOLOGY_LABELS: Record<ProjectMethodology, string> = {
  pdsa: 'PDSA', dmaic: 'DMAIC', lean: 'Lean', six_sigma: 'Six Sigma',
  kaizen_blitz: 'Kaizen Blitz', tocef: 'TOC', agile: 'Agile',
};
const PRIORITY_COLORS: Record<ProjectPriority, string> = {
  critical: '#dc2626', high: '#ea580c', medium: '#d97706', low: '#0891b2',
};
const PRIORITY_LABELS: Record<ProjectPriority, string> = {
  critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low',
};
const PHASE_LABELS: Record<ProjectPhase, string> = {
  charter: 'Charter', plan: 'Plan', do: 'Do', study: 'Study', act: 'Act', closed: 'Closed',
};
const PHASE_COLORS: Record<ProjectPhase, string> = {
  charter: '#6b7280', plan: '#4f46e5', do: '#0891b2', study: '#d97706', act: '#7c3aed', closed: '#047857',
};
const STATUS_LABELS: Record<ProjectStatus, string> = {
  on_track: 'On Track', at_risk: 'At Risk', delayed: 'Delayed',
  completed: 'Completed', cancelled: 'Cancelled', on_hold: 'On Hold',
};
const STATUS_COLORS: Record<ProjectStatus, string> = {
  on_track: '#047857', at_risk: '#d97706', delayed: '#dc2626',
  completed: '#0891b2', cancelled: '#7c2d12', on_hold: '#6b7280',
};
const SUGGESTION_STATUS_LABELS: Record<SuggestionStatus, string> = {
  submitted: 'Submitted', under_review: 'Under Review', approved: 'Approved',
  rejected: 'Rejected', in_progress: 'In Progress', implemented: 'Implemented', archived: 'Archived',
};
const SUGGESTION_STATUS_COLORS: Record<SuggestionStatus, string> = {
  submitted: '#2563eb', under_review: '#d97706', approved: '#047857',
  rejected: '#dc2626', in_progress: '#7c3aed', implemented: '#0891b2', archived: '#6b7280',
};
const SUGGESTION_CATEGORY_LABELS: Record<SuggestionCategory, string> = {
  process: 'Process', equipment: 'Equipment', safety: 'Safety', quality: 'Quality',
  cost: 'Cost', environment: 'Environment', employee_wellbeing: 'Wellbeing', customer: 'Customer',
};
const IMPACT_LABELS: Record<SuggestionImpact, string> = {
  incremental: 'Incremental', breakthrough: 'Breakthrough', transformational: 'Transformational',
};
const IMPACT_COLORS: Record<SuggestionImpact, string> = {
  incremental: '#0891b2', breakthrough: '#7c3aed', transformational: '#be185d',
};
const MATURITY_LABELS: Record<BestPracticeMaturity, string> = {
  emerging: 'Emerging', validated: 'Validated', standardized: 'Standardized',
  embedded: 'Embedded', optimizing: 'Optimizing',
};
const MATURITY_COLORS: Record<BestPracticeMaturity, string> = {
  emerging: '#6b7280', validated: '#0891b2', standardized: '#4f46e5',
  embedded: '#7c3aed', optimizing: '#047857',
};
const STUDY_OUTCOME_COLORS: Record<string, string> = {
  validated: '#047857', partial: '#d97706', inconclusive: '#6b7280', invalidated: '#dc2626',
};

const TABS = [
  { id: 'portfolio', label: 'Project Portfolio', icon: 'Rocket' },
  { id: 'kaizen', label: 'Kaizen Suggestions', icon: 'Lightbulb' },
  { id: 'pdsa', label: 'PDSA Cycles', icon: 'GitBranch' },
  { id: 'roi', label: 'ROI Measurement', icon: 'Coins' },
  { id: 'practices', label: 'Best Practices', icon: 'Trophy' },
  { id: 'cross-module', label: 'Cross-Module', icon: 'Network' },
  { id: 'insights', label: 'Insights', icon: 'Sparkles' },
] as const;
type TabId = typeof TABS[number]['id'];

// ============================================================================
// Helpers
// ============================================================================
function fmtDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
function fmtINR(n: number): string {
  return '₹' + n.toLocaleString('en-IN');
}
function fmtINRCompact(n: number): string {
  if (Math.abs(n) >= 10000000) return '₹' + (n / 10000000).toFixed(2) + ' Cr';
  if (Math.abs(n) >= 100000) return '₹' + (n / 100000).toFixed(2) + ' L';
  if (Math.abs(n) >= 1000) return '₹' + (n / 1000).toFixed(1) + ' K';
  return '₹' + n.toLocaleString('en-IN');
}
function fmtRelative(days: number): string {
  if (days < 0) return `${Math.abs(days)} days overdue`;
  if (days === 0) return 'Today';
  if (days < 30) return `in ${days} days`;
  if (days < 365) return `in ${Math.round(days / 30)} months`;
  return `in ${Math.round(days / 365)} years`;
}
function renderTypeIcon(name: string, size = 14, style?: CSSProperties) {
  const map: Record<string, typeof Activity> = {
    Rocket: Rocket, Lightbulb: Lightbulb, GitBranch: GitBranch, Coins: Coins,
    Trophy: Trophy, Network: Network, Sparkles: Sparkles,
    Workflow: Workflow, Cpu: Cpu, HeartHandshake: HeartHandshake, Leaf: Leaf,
    Scale: Scale, HardHat: HardHat, Cog: Cog, Heart: Heart,
  };
  const Icon = map[name] || Activity;
  return <Icon size={size} style={style} />;
}
function categoryIcon(cat: ProjectCategory, size = 14) {
  const map: Record<ProjectCategory, string> = {
    process_efficiency: 'Workflow', cost_reduction: 'Coins', quality_enhancement: 'ShieldCheck',
    safety_improvement: 'HardHat', customer_experience: 'HeartHandshake', sustainability: 'Leaf',
    digital_transformation: 'Cpu', compliance: 'Scale',
  };
  return renderTypeIcon(map[cat], size, { color: CATEGORY_COLORS[cat] });
}

// ============================================================================
// Main Component
// ============================================================================
export function ContinualImprovementView() {
  const { toast } = useToast();
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('portfolio');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterSuggestionStatus, setFilterSuggestionStatus] = useState<string>('all');
  const [detailModal, setDetailModal] = useState<{ type: string; id: string } | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/continual-improvement');
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
      <div className="ci-loading">
        <RefreshCw className="animate-spin" size={32} />
        <p>Loading Continual Improvement data...</p>
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className="ci-error">
        <AlertTriangle size={32} />
        <p>{error || 'No data available'}</p>
        <Button onClick={fetchData}><RefreshCw size={16} /> Retry</Button>
      </div>
    );
  }

  const k = data.kpis;

  return (
    <div className="ci-container">
      {/* Header */}
      <header className="ci-header">
        <div className="ci-header-title">
          <h1><Rocket size={28} /> Continual Improvement Program</h1>
          <p className="ci-subtitle">ISO 9001:2015 §10.3 — Improvement, Suitability & Adequacy</p>
        </div>
        <div className="ci-header-actions">
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw size={14} /> Refresh
          </Button>
          <div className="ci-compliance-badge">
            <Gauge size={14} />
            <span>ISO 10.3: <strong>{k.overallCompliance}%</strong></span>
          </div>
          <div className="ci-effectiveness-badge">
            <Target size={14} />
            <span>Effectiveness: <strong>{k.effectiveness}%</strong></span>
          </div>
        </div>
      </header>

      {/* KPI Banner */}
      <section className="ci-kpi-banner">
        <div className="ci-kpi-main">
          <div className="ci-kpi-main-value">{k.totalProjects}</div>
          <div className="ci-kpi-main-label">Improvement Projects</div>
          <div className="ci-kpi-main-sublabel">
            <Users size={12} /> {k.activeProjects} active · {k.completedProjects} completed · {k.onTrackRate}% on track
          </div>
        </div>
        <div className="ci-kpi-grid">
          <div className="ci-kpi-tile ci-kpi-tile-info"><Rocket size={16} /><div><div className="ci-kpi-tile-value">{k.activeProjects}</div><div className="ci-kpi-tile-label">Active Projects</div></div></div>
          <div className="ci-kpi-tile ci-kpi-tile-success"><CheckCircle2 size={16} /><div><div className="ci-kpi-tile-value">{k.completedProjects}</div><div className="ci-kpi-tile-label">Completed</div></div></div>
          <div className="ci-kpi-tile ci-kpi-tile-warning"><AlertCircle size={16} /><div><div className="ci-kpi-tile-value">{k.atRiskProjects}</div><div className="ci-kpi-tile-label">At Risk</div></div></div>
          <div className="ci-kpi-tile ci-kpi-tile-danger"><AlertOctagon size={16} /><div><div className="ci-kpi-tile-value">{k.delayedProjects}</div><div className="ci-kpi-tile-label">Delayed</div></div></div>
          <div className="ci-kpi-tile ci-kpi-tile-info"><Lightbulb size={16} /><div><div className="ci-kpi-tile-value">{k.totalSuggestions}</div><div className="ci-kpi-tile-label">Kaizen Suggestions</div></div></div>
          <div className="ci-kpi-tile ci-kpi-tile-success"><TrendingUp size={16} /><div><div className="ci-kpi-tile-value">{k.implementationRate}%</div><div className="ci-kpi-tile-label">Implementation Rate</div></div></div>
          <div className="ci-kpi-tile ci-kpi-tile-warning"><GitBranch size={16} /><div><div className="ci-kpi-tile-value">{k.validatedCycles}/{k.totalPDSACycles}</div><div className="ci-kpi-tile-label">Validated PDSA</div></div></div>
          <div className="ci-kpi-tile ci-kpi-tile-danger"><Trophy size={16} /><div><div className="ci-kpi-tile-value">{k.embeddedPractices}</div><div className="ci-kpi-tile-label">Embedded Practices</div></div></div>
          <div className="ci-kpi-tile ci-kpi-tile-info"><Coins size={16} /><div><div className="ci-kpi-tile-value">{fmtINRCompact(k.totalRealizedBenefit)}</div><div className="ci-kpi-tile-label">Realized Benefit</div></div></div>
          <div className="ci-kpi-tile ci-kpi-tile-success"><TrendingUp size={16} /><div><div className="ci-kpi-tile-value">{k.portfolioROI}%</div><div className="ci-kpi-tile-label">Portfolio ROI</div></div></div>
        </div>
      </section>

      {/* Tabs */}
      <nav className="ci-tabs">
        {TABS.map(t => (
          <button
            key={t.id}
            className={cn('ci-tab', activeTab === t.id && 'ci-tab-active')}
            onClick={() => setActiveTab(t.id)}
          >
            {renderTypeIcon(t.icon, 14)}
            <span>{t.label}</span>
          </button>
        ))}
      </nav>

      {/* Tab content */}
      <div className="ci-tab-content">
        {activeTab === 'portfolio' && (
          <PortfolioTab
            data={data}
            search={search}
            setSearch={setSearch}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterPriority={filterPriority}
            setFilterPriority={setFilterPriority}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            setDetailModal={setDetailModal}
          />
        )}
        {activeTab === 'kaizen' && (
          <KaizenTab
            data={data}
            search={search}
            setSearch={setSearch}
            filterSuggestionStatus={filterSuggestionStatus}
            setFilterSuggestionStatus={setFilterSuggestionStatus}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            setDetailModal={setDetailModal}
          />
        )}
        {activeTab === 'pdsa' && <PDSATab data={data} setDetailModal={setDetailModal} />}
        {activeTab === 'roi' && <ROITab data={data} setDetailModal={setDetailModal} />}
        {activeTab === 'practices' && <PracticesTab data={data} setDetailModal={setDetailModal} />}
        {activeTab === 'cross-module' && <CrossModuleTab data={data} />}
        {activeTab === 'insights' && <InsightsTab data={data} />}
      </div>

      {/* Detail Modal */}
      {detailModal && (
        <DetailModal
          type={detailModal.type}
          id={detailModal.id}
          data={data}
          onClose={() => setDetailModal(null)}
          onToast={(opts) => toast({ ...opts, variant: opts.variant === 'success' ? 'default' : opts.variant } as any)}
        />
      )}
    </div>
  );
}

// ============================================================================
// Tab: Portfolio
// ============================================================================
function PortfolioTab({
  data, search, setSearch, filterStatus, setFilterStatus,
  filterPriority, setFilterPriority, filterCategory, setFilterCategory, setDetailModal,
}: {
  data: ApiResponse;
  search: string;
  setSearch: (s: string) => void;
  filterStatus: string;
  setFilterStatus: (s: string) => void;
  filterPriority: string;
  setFilterPriority: (s: string) => void;
  filterCategory: string;
  setFilterCategory: (s: string) => void;
  setDetailModal: (m: { type: string; id: string } | null) => void;
}) {
  const filtered = useMemo(() => {
    return data.projects.filter(p => {
      if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.projectCode.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterStatus !== 'all' && p.status !== filterStatus) return false;
      if (filterPriority !== 'all' && p.priority !== filterPriority) return false;
      if (filterCategory !== 'all' && p.category !== filterCategory) return false;
      return true;
    });
  }, [data.projects, search, filterStatus, filterPriority, filterCategory]);

  return (
    <div className="ci-tab-pane">
      {/* Charts row */}
      <div className="ci-charts-row">
        <Card className="hover-lift-sm ci-chart-card">
          <div className="ci-chart-header"><BarChart3 size={16} /><h3>Projects by Phase</h3></div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.projectsByPhase} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {data.projectsByPhase.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="hover-lift-sm ci-chart-card">
          <div className="ci-chart-header"><BarChart3 size={16} /><h3>Projects by Status</h3></div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.projectsByStatus} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {data.projectsByStatus.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="hover-lift-sm ci-chart-card">
          <div className="ci-chart-header"><BarChart3 size={16} /><h3>Benefit by Category (₹)</h3></div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.projectsByCategory} layout="vertical" margin={{ top: 10, right: 10, bottom: 0, left: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={fmtINRCompact} />
              <YAxis type="category" dataKey="label" tick={{ fontSize: 10 }} width={100} />
              <Tooltip formatter={(v: number) => fmtINR(v)} />
              <Bar dataKey="benefit" radius={[0, 4, 4, 0]}>
                {data.projectsByCategory.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Trend chart */}
      <Card className="hover-lift-sm ci-chart-card ci-trend-card">
        <div className="ci-chart-header"><Activity size={16} /><h3>12-Month Activity Trend</h3></div>
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={data.projectTrend} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} tickFormatter={fmtINRCompact} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar yAxisId="left" dataKey="newProjects" fill="#4f46e5" name="New Projects" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="left" dataKey="newSuggestions" fill="#0891b2" name="New Suggestions" radius={[4, 4, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="benefit" stroke="#047857" strokeWidth={2} name="Benefit (₹)" dot={{ r: 3 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      {/* Filters */}
      <div className="ci-filter-bar">
        <div className="ci-search-wrapper">
          <Search size={14} />
          <Input
            placeholder="Search by project title or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ci-search-input"
          />
        </div>
        <select className="ci-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All Statuses</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select className="ci-select" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
          <option value="all">All Priorities</option>
          {Object.entries(PRIORITY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select className="ci-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="all">All Categories</option>
          {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <span className="ci-result-count">{filtered.length} projects</span>
      </div>

      {/* Projects table */}
      <div className="ci-table-wrap">
        <table className="ci-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Title</th>
              <th>Category</th>
              <th>Method</th>
              <th>Priority</th>
              <th>Phase</th>
              <th>Status</th>
              <th>Progress</th>
              <th>Sponsor</th>
              <th>Target</th>
              <th>ROI</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 50).map(p => (
              <tr key={p.id} className={cn(p.status === 'delayed' && 'ci-row-danger', p.status === 'at_risk' && 'ci-row-warning')}>
                <td><span className="ci-code-pill">{p.projectCode}</span></td>
                <td className="ci-cell-title">
                  {categoryIcon(p.category, 12)}
                  <span>{p.title}</span>
                </td>
                <td><span className="ci-pill" style={{ background: CATEGORY_COLORS[p.category] + '20', color: CATEGORY_COLORS[p.category] }}>{CATEGORY_LABELS[p.category]}</span></td>
                <td><span className="ci-pill ci-pill-info">{METHODOLOGY_LABELS[p.methodology]}</span></td>
                <td><span className="ci-pill" style={{ background: PRIORITY_COLORS[p.priority] + '20', color: PRIORITY_COLORS[p.priority] }}>{PRIORITY_LABELS[p.priority]}</span></td>
                <td><span className="ci-pill" style={{ background: PHASE_COLORS[p.phase] + '20', color: PHASE_COLORS[p.phase] }}>{PHASE_LABELS[p.phase]}</span></td>
                <td><span className="ci-pill" style={{ background: STATUS_COLORS[p.status] + '20', color: STATUS_COLORS[p.status] }}>{STATUS_LABELS[p.status]}</span></td>
                <td>
                  <div className="ci-progress-mini">
                    <div className="ci-progress-mini-bar" style={{ width: `${p.percentComplete}%`, background: STATUS_COLORS[p.status] }} />
                    <span>{p.percentComplete}%</span>
                  </div>
                </td>
                <td className="ci-cell-compact">{p.sponsor}</td>
                <td className="ci-cell-compact">{fmtDate(p.targetEndDate)}</td>
                <td className="ci-cell-compact">
                  <span className={cn('ci-roi-pill', p.roiPercent >= 100 && 'ci-roi-positive', p.roiPercent < 0 && 'ci-roi-negative')}>
                    {p.roiPercent > 0 ? '+' : ''}{p.roiPercent}%
                  </span>
                </td>
                <td>
                  <Button variant="ghost" size="sm" onClick={() => setDetailModal({ type: 'project', id: p.id })}>
                    <Eye size={14} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================================
// Tab: Kaizen Suggestions
// ============================================================================
function KaizenTab({
  data, search, setSearch, filterSuggestionStatus, setFilterSuggestionStatus,
  filterCategory, setFilterCategory, setDetailModal,
}: {
  data: ApiResponse;
  search: string;
  setSearch: (s: string) => void;
  filterSuggestionStatus: string;
  setFilterSuggestionStatus: (s: string) => void;
  filterCategory: string;
  setFilterCategory: (s: string) => void;
  setDetailModal: (m: { type: string; id: string } | null) => void;
}) {
  const filtered = useMemo(() => {
    return data.suggestions.filter(s => {
      if (search && !s.title.toLowerCase().includes(search.toLowerCase()) && !s.suggestionCode.toLowerCase().includes(search.toLowerCase()) && !s.submittedBy.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterSuggestionStatus !== 'all' && s.status !== filterSuggestionStatus) return false;
      if (filterCategory !== 'all' && s.category !== filterCategory) return false;
      return true;
    });
  }, [data.suggestions, search, filterSuggestionStatus, filterCategory]);

  return (
    <div className="ci-tab-pane">
      {/* Stats tiles */}
      <div className="ci-stat-tiles">
        <div className="ci-stat-tile"><Lightbulb size={16} /><div><div className="ci-stat-value">{data.kpis.totalSuggestions}</div><div className="ci-stat-label">Total Suggestions</div></div></div>
        <div className="ci-stat-tile"><CheckCircle2 size={16} /><div><div className="ci-stat-value">{data.kpis.implementedSuggestions}</div><div className="ci-stat-label">Implemented</div></div></div>
        <div className="ci-stat-tile"><Clock size={16} /><div><div className="ci-stat-value">{data.suggestions.filter(s => s.status === 'in_progress').length}</div><div className="ci-stat-label">In Progress</div></div></div>
        <div className="ci-stat-tile"><Coins size={16} /><div><div className="ci-stat-value">{fmtINRCompact(data.kpis.totalSuggestionBenefit)}</div><div className="ci-stat-label">Realized Benefit</div></div></div>
        <div className="ci-stat-tile"><Award size={16} /><div><div className="ci-stat-value">{data.kpis.totalRecognitionPoints}</div><div className="ci-stat-label">Recognition Points</div></div></div>
      </div>

      {/* Charts */}
      <div className="ci-charts-row">
        <Card className="hover-lift-sm ci-chart-card">
          <div className="ci-chart-header"><BarChart3 size={16} /><h3>Suggestions by Status</h3></div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.suggestionsByStatus} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {data.suggestionsByStatus.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="hover-lift-sm ci-chart-card">
          <div className="ci-chart-header"><BarChart3 size={16} /><h3>Benefit by Impact Type</h3></div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.suggestionsByImpact} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={fmtINRCompact} />
              <Tooltip formatter={(v: number) => fmtINR(v)} />
              <Bar dataKey="benefit" radius={[4, 4, 0, 0]}>
                {data.suggestionsByImpact.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Filters */}
      <div className="ci-filter-bar">
        <div className="ci-search-wrapper">
          <Search size={14} />
          <Input
            placeholder="Search by title, code, or submitter..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ci-search-input"
          />
        </div>
        <select className="ci-select" value={filterSuggestionStatus} onChange={(e) => setFilterSuggestionStatus(e.target.value)}>
          <option value="all">All Statuses</option>
          {Object.entries(SUGGESTION_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select className="ci-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="all">All Categories</option>
          {Object.entries(SUGGESTION_CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <span className="ci-result-count">{filtered.length} suggestions</span>
      </div>

      {/* Suggestions table */}
      <div className="ci-table-wrap">
        <table className="ci-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Title</th>
              <th>Submitter</th>
              <th>Category</th>
              <th>Impact</th>
              <th>Status</th>
              <th>Est. Benefit</th>
              <th>Actual</th>
              <th>Upvotes</th>
              <th>Recog.</th>
              <th>Submitted</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 50).map(s => (
              <tr key={s.id} className={cn(s.status === 'rejected' && 'ci-row-danger', s.status === 'implemented' && 'ci-row-success')}>
                <td><span className="ci-code-pill">{s.suggestionCode}</span></td>
                <td className="ci-cell-title">{s.title}</td>
                <td className="ci-cell-compact">
                  <div style={{ fontWeight: 500 }}>{s.submittedBy}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{s.submittedByRole}</div>
                </td>
                <td><span className="ci-pill ci-pill-info">{SUGGESTION_CATEGORY_LABELS[s.category]}</span></td>
                <td><span className="ci-pill" style={{ background: IMPACT_COLORS[s.impact] + '20', color: IMPACT_COLORS[s.impact] }}>{IMPACT_LABELS[s.impact]}</span></td>
                <td><span className="ci-pill" style={{ background: SUGGESTION_STATUS_COLORS[s.status] + '20', color: SUGGESTION_STATUS_COLORS[s.status] }}>{SUGGESTION_STATUS_LABELS[s.status]}</span></td>
                <td className="ci-cell-compact">{fmtINRCompact(s.estimatedBenefitInr)}</td>
                <td className="ci-cell-compact"><strong>{s.actualBenefitInr > 0 ? fmtINRCompact(s.actualBenefitInr) : '—'}</strong></td>
                <td className="ci-cell-compact">▲ {s.upvotes}</td>
                <td className="ci-cell-compact">{s.recognitionPoints > 0 ? <span className="ci-recog-pill">⭐ {s.recognitionPoints}</span> : '—'}</td>
                <td className="ci-cell-compact">{fmtDate(s.submittedDate)}</td>
                <td>
                  <Button variant="ghost" size="sm" onClick={() => setDetailModal({ type: 'suggestion', id: s.id })}>
                    <Eye size={14} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Top suggestions spotlight */}
      <Card className="hover-lift-sm ci-spotlight-card">
        <div className="ci-chart-header"><Trophy size={16} /><h3>Top 10 Implemented Suggestions by Benefit</h3></div>
        <div className="ci-spotlight-list">
          {data.topSuggestions.map((s, i) => (
            <div key={s.id} className="ci-spotlight-item">
              <div className="ci-spotlight-rank">#{i + 1}</div>
              <div className="ci-spotlight-content">
                <div className="ci-spotlight-title">{s.title}</div>
                <div className="ci-spotlight-meta">
                  <span>{s.submittedBy}</span>
                  <span>·</span>
                  <span>{SUGGESTION_CATEGORY_LABELS[s.category]}</span>
                  <span>·</span>
                  <span>{IMPACT_LABELS[s.impact]}</span>
                </div>
              </div>
              <div className="ci-spotlight-benefit">
                <div className="ci-spotlight-amount">{fmtINRCompact(s.actualBenefitInr)}</div>
                <div className="ci-spotlight-points">⭐ {s.recognitionPoints} pts</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ============================================================================
// Tab: PDSA Cycles
// ============================================================================
function PDSATab({ data, setDetailModal }: { data: ApiResponse; setDetailModal: (m: { type: string; id: string } | null) => void }) {
  return (
    <div className="ci-tab-pane">
      {/* Stats */}
      <div className="ci-stat-tiles">
        <div className="ci-stat-tile"><GitBranch size={16} /><div><div className="ci-stat-value">{data.kpis.totalPDSACycles}</div><div className="ci-stat-label">Total Cycles</div></div></div>
        <div className="ci-stat-tile"><CheckCircle2 size={16} /><div><div className="ci-stat-value">{data.kpis.validatedCycles}</div><div className="ci-stat-label">Validated</div></div></div>
        <div className="ci-stat-tile"><TrendingUp size={16} /><div><div className="ci-stat-value">{data.kpis.standardizationRate}%</div><div className="ci-stat-label">Standardization Rate</div></div></div>
        <div className="ci-stat-tile"><Clock size={16} /><div><div className="ci-stat-value">{data.cycles.filter(c => c.stage !== 'act').length}</div><div className="ci-stat-label">In-Progress</div></div></div>
      </div>

      {/* Charts */}
      <div className="ci-charts-row">
        <Card className="hover-lift-sm ci-chart-card">
          <div className="ci-chart-header"><BarChart3 size={16} /><h3>PDSA Stage Distribution</h3></div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.pdsaStageBreakdown} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#4f46e5">
                {data.pdsaStageBreakdown.map((_, idx) => {
                  const colors = ['#4f46e5', '#0891b2', '#d97706', '#7c3aed'];
                  return <Cell key={idx} fill={colors[idx % colors.length]} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="hover-lift-sm ci-chart-card">
          <div className="ci-chart-header"><BarChart3 size={16} /><h3>Study Outcome Breakdown</h3></div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={data.studyOutcomeBreakdown} dataKey="count" nameKey="label" cx="50%" cy="50%" outerRadius={80} label>
                {data.studyOutcomeBreakdown.map((entry, idx) => (
                  <Cell key={idx} fill={STUDY_OUTCOME_COLORS[entry.outcome] || '#6b7280'} />
                ))}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Cycles table */}
      <div className="ci-table-wrap">
        <table className="ci-table">
          <thead>
            <tr>
              <th>Cycle ID</th>
              <th>Project</th>
              <th>Iteration</th>
              <th>Stage</th>
              <th>Hypothesis</th>
              <th>Baseline</th>
              <th>Target</th>
              <th>Actual</th>
              <th>Improvement</th>
              <th>Study Outcome</th>
              <th>Act Decision</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.cycles.slice(0, 50).map(c => (
              <tr key={c.id} className={cn(c.studyOutcome === 'invalidated' && 'ci-row-danger', c.studyOutcome === 'validated' && 'ci-row-success')}>
                <td><span className="ci-code-pill">{c.id}</span></td>
                <td className="ci-cell-title">{c.projectTitle}</td>
                <td className="ci-cell-compact">#{c.cycleNumber} of {c.iterationCount}</td>
                <td><span className="ci-pill ci-pill-info">{c.stage.toUpperCase()}</span></td>
                <td className="ci-cell-truncate" title={c.hypothesis}>{c.hypothesis}</td>
                <td className="ci-cell-compact">{c.metricsBaseline}</td>
                <td className="ci-cell-compact">{c.metricsTarget}</td>
                <td className="ci-cell-compact"><strong>{c.metricsActual || '—'}</strong></td>
                <td className="ci-cell-compact">
                  {c.metricsImprovementPct !== 0 ? (
                    <span className={cn('ci-roi-pill', c.metricsImprovementPct > 0 && 'ci-roi-positive', c.metricsImprovementPct < 0 && 'ci-roi-negative')}>
                      {c.metricsImprovementPct > 0 ? '+' : ''}{c.metricsImprovementPct}%
                    </span>
                  ) : '—'}
                </td>
                <td><span className="ci-pill" style={{ background: (STUDY_OUTCOME_COLORS[c.studyOutcome] || '#6b7280') + '20', color: STUDY_OUTCOME_COLORS[c.studyOutcome] || '#6b7280' }}>{c.studyOutcome}</span></td>
                <td><span className="ci-pill ci-pill-info">{c.actDecision.replace('_', ' ')}</span></td>
                <td>
                  <Button variant="ghost" size="sm" onClick={() => setDetailModal({ type: 'pdsa', id: c.id })}>
                    <Eye size={14} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================================
// Tab: ROI Measurement
// ============================================================================
function ROITab({ data, setDetailModal }: { data: ApiResponse; setDetailModal: (m: { type: string; id: string } | null) => void }) {
  const totalInvestment = data.kpis.totalInvestment;
  const totalRealized = data.kpis.totalRealizedBenefit;
  const totalBenefitROI = data.roi.reduce((s, r) => s + r.totalBenefitInr, 0);
  const totalNetBenefit = data.roi.reduce((s, r) => s + r.netBenefitInr, 0);

  return (
    <div className="ci-tab-pane">
      {/* Portfolio summary */}
      <div className="ci-roi-summary-grid">
        <Card className="hover-lift-sm ci-roi-summary-card ci-roi-investment">
          <Coins size={20} />
          <div>
            <div className="ci-roi-amount">{fmtINRCompact(totalInvestment)}</div>
            <div className="ci-roi-label">Total Investment</div>
          </div>
        </Card>
        <Card className="hover-lift-sm ci-roi-summary-card ci-roi-benefit">
            <TrendingUp size={20} />
          <div>
            <div className="ci-roi-amount">{fmtINRCompact(totalBenefitROI)}</div>
            <div className="ci-roi-label">Total Benefit (Realized + Projected)</div>
          </div>
        </Card>
        <Card className="hover-lift-sm ci-roi-summary-card ci-roi-net">
          <Award size={20} />
          <div>
            <div className="ci-roi-amount">{fmtINRCompact(totalNetBenefit)}</div>
            <div className="ci-roi-label">Net Benefit</div>
          </div>
        </Card>
        <Card className="hover-lift-sm ci-roi-summary-card ci-roi-roi">
          <Gauge size={20} />
          <div>
            <div className="ci-roi-amount">{data.kpis.portfolioROI}%</div>
            <div className="ci-roi-label">Portfolio ROI</div>
          </div>
        </Card>
      </div>

      {/* Top ROI projects */}
      <Card className="hover-lift-sm ci-chart-card">
        <div className="ci-chart-header"><Trophy size={16} /><h3>Top 10 Projects by ROI</h3></div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.topROIProjects} layout="vertical" margin={{ top: 10, right: 30, bottom: 0, left: 100 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11 }} unit="%" />
            <YAxis type="category" dataKey="projectTitle" tick={{ fontSize: 10 }} width={200} />
            <Tooltip formatter={(v: number) => `${v}%`} />
            <Bar dataKey="roiPercent" radius={[0, 4, 4, 0]}>
              {data.topROIProjects.map((p, idx) => (
                <Cell key={idx} fill={p.roiPercent >= 200 ? '#047857' : p.roiPercent >= 100 ? '#0891b2' : p.roiPercent >= 0 ? '#d97706' : '#dc2626'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* ROI detail table */}
      <div className="ci-table-wrap">
        <table className="ci-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Category</th>
              <th>Investment</th>
              <th>Cost Saved</th>
              <th>Revenue Lift</th>
              <th>Cost Avoided</th>
              <th>Total Benefit</th>
              <th>Net Benefit</th>
              <th>ROI</th>
              <th>Payback</th>
              <th>NPV</th>
              <th>IRR</th>
              <th>Verified</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.roi.slice(0, 30).map(r => (
              <tr key={r.id} className={cn(!r.verified && 'ci-row-warning')}>
                <td className="ci-cell-title">{r.projectTitle}</td>
                <td><span className="ci-pill ci-pill-info">{CATEGORY_LABELS[r.category]}</span></td>
                <td className="ci-cell-compact">{fmtINRCompact(r.totalInvestmentInr)}</td>
                <td className="ci-cell-compact">{fmtINRCompact(r.costSavedInr)}</td>
                <td className="ci-cell-compact">{fmtINRCompact(r.revenueLiftInr)}</td>
                <td className="ci-cell-compact">{fmtINRCompact(r.costAvoidedInr)}</td>
                <td className="ci-cell-compact"><strong>{fmtINRCompact(r.totalBenefitInr)}</strong></td>
                <td className="ci-cell-compact" style={{ color: r.netBenefitInr >= 0 ? '#047857' : '#dc2626' }}><strong>{fmtINRCompact(r.netBenefitInr)}</strong></td>
                <td><span className={cn('ci-roi-pill', r.roiPercent >= 0 && 'ci-roi-positive', r.roiPercent < 0 && 'ci-roi-negative')}>{r.roiPercent > 0 ? '+' : ''}{r.roiPercent}%</span></td>
                <td className="ci-cell-compact">{r.paybackMonths} mo</td>
                <td className="ci-cell-compact">{fmtINRCompact(r.npvInr)}</td>
                <td className="ci-cell-compact">{r.irrPercent}%</td>
                <td>{r.verified ? <CheckCircle2 size={14} className="ci-icon-success" /> : <Clock size={14} className="ci-icon-warning" />}</td>
                <td>
                  <Button variant="ghost" size="sm" onClick={() => setDetailModal({ type: 'roi', id: r.id })}>
                    <Eye size={14} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================================
// Tab: Best Practices
// ============================================================================
function PracticesTab({ data, setDetailModal }: { data: ApiResponse; setDetailModal: (m: { type: string; id: string } | null) => void }) {
  return (
    <div className="ci-tab-pane">
      {/* Stats */}
      <div className="ci-stat-tiles">
        <div className="ci-stat-tile"><Trophy size={16} /><div><div className="ci-stat-value">{data.kpis.totalBestPractices}</div><div className="ci-stat-label">Total Practices</div></div></div>
        <div className="ci-stat-tile"><Award size={16} /><div><div className="ci-stat-value">{data.kpis.embeddedPractices}</div><div className="ci-stat-label">Embedded/Optimizing</div></div></div>
        <div className="ci-stat-tile"><Network size={16} /><div><div className="ci-stat-value">{data.kpis.totalReplications}</div><div className="ci-stat-label">Total Replications</div></div></div>
        <div className="ci-stat-tile"><Coins size={16} /><div><div className="ci-stat-value">{fmtINRCompact(data.kpis.totalEstimatedReplicationSavings)}</div><div className="ci-stat-label">Est. Replication Savings</div></div></div>
      </div>

      {/* Maturity breakdown chart */}
      <Card className="hover-lift-sm ci-chart-card">
        <div className="ci-chart-header"><BarChart3 size={16} /><h3>Best Practice Maturity Distribution</h3></div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data.maturityBreakdown} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.maturityBreakdown.map((entry, idx) => (
                <Cell key={idx} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Practices table */}
      <div className="ci-table-wrap">
        <table className="ci-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Title</th>
              <th>Category</th>
              <th>Origin WH</th>
              <th>Maturity</th>
              <th>Replications</th>
              <th>Replicated To</th>
              <th>SOP Ref</th>
              <th>Per-Site Savings</th>
              <th>Total Est. Savings</th>
              <th>Documented</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.practices.map(p => (
              <tr key={p.id} className={cn(p.maturity === 'emerging' && 'ci-row-warning', (p.maturity === 'embedded' || p.maturity === 'optimizing') && 'ci-row-success')}>
                <td><span className="ci-code-pill">{p.practiceCode}</span></td>
                <td className="ci-cell-title">{p.title}</td>
                <td><span className="ci-pill" style={{ background: CATEGORY_COLORS[p.category] + '20', color: CATEGORY_COLORS[p.category] }}>{CATEGORY_LABELS[p.category]}</span></td>
                <td className="ci-cell-compact">{p.originWarehouseCode}</td>
                <td><span className="ci-pill" style={{ background: MATURITY_COLORS[p.maturity] + '20', color: MATURITY_COLORS[p.maturity] }}>{MATURITY_LABELS[p.maturity]}</span></td>
                <td className="ci-cell-compact">{p.replicationCount}</td>
                <td className="ci-cell-compact">{p.replicatedTo.length > 0 ? p.replicatedTo.join(', ') : '—'}</td>
                <td className="ci-cell-compact"><span className="ci-pill ci-pill-info">{p.sopReference}</span></td>
                <td className="ci-cell-compact">{fmtINRCompact(p.estimatedSavingsPerSiteInr)}</td>
                <td className="ci-cell-compact"><strong style={{ color: '#047857' }}>{fmtINRCompact(p.totalEstimatedSavingsInr)}</strong></td>
                <td className="ci-cell-compact">{fmtDate(p.documentedDate)}</td>
                <td>
                  <Button variant="ghost" size="sm" onClick={() => setDetailModal({ type: 'practice', id: p.id })}>
                    <Eye size={14} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================================
// Tab: Cross-Module Linkage
// ============================================================================
function CrossModuleTab({ data }: { data: ApiResponse }) {
  return (
    <div className="ci-tab-pane">
      <Card className="hover-lift-sm ci-info-card">
        <div className="ci-chart-header"><Network size={16} /><h3>Cross-Module Improvement Linkage</h3></div>
        <p className="ci-info-text">
          This view shows how improvement actions originating from other modules (Audit, CAPA, Document Control, etc.)
          flow into the Continual Improvement Program. Closed-loop rate indicates the percentage of source actions
          that have been resolved via a completed CIP project.
        </p>
      </Card>

      <div className="ci-cross-module-grid">
        {data.crossModule.map((cm, idx) => (
          <Card key={idx} className="hover-lift-sm ci-cross-module-card" style={{ borderTopColor: cm.color }}>
            <div className="ci-cross-module-header">
              <div className="ci-cross-module-icon" style={{ background: cm.color + '20', color: cm.color }}>
                <Network size={20} />
              </div>
              <div>
                <div className="ci-cross-module-name">{cm.sourceModule}</div>
                <div className="ci-cross-module-label">{cm.sourceLabel}</div>
              </div>
            </div>
            <div className="ci-cross-module-stats">
              <div className="ci-cross-module-stat">
                <div className="ci-cross-module-stat-value">{cm.improvementCount}</div>
                <div className="ci-cross-module-stat-label">Improvements</div>
              </div>
              <div className="ci-cross-module-stat">
                <div className="ci-cross-module-stat-value" style={{ color: cm.color }}>{cm.closedLoopCount}</div>
                <div className="ci-cross-module-stat-label">Closed-Loop</div>
              </div>
              <div className="ci-cross-module-stat">
                <div className="ci-cross-module-stat-value" style={{ color: cm.pendingActionCount > 0 ? '#dc2626' : '#047857' }}>{cm.pendingActionCount}</div>
                <div className="ci-cross-module-stat-label">Pending</div>
              </div>
              <div className="ci-cross-module-stat">
                <div className="ci-cross-module-stat-value">{fmtINRCompact(cm.totalBenefitInr)}</div>
                <div className="ci-cross-module-stat-label">Benefit</div>
              </div>
            </div>
            <div className="ci-cross-module-rate">
              <div className="ci-cross-module-rate-label">Closed-Loop Rate</div>
              <div className="ci-cross-module-rate-bar">
                <div className="ci-cross-module-rate-fill" style={{ width: `${cm.closedLoopRate}%`, background: cm.color }} />
              </div>
              <div className="ci-cross-module-rate-value">{cm.closedLoopRate}%</div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="hover-lift-sm ci-chart-card">
        <div className="ci-chart-header"><BarChart3 size={16} /><h3>Closed-Loop Rate by Source Module</h3></div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.crossModule} margin={{ top: 10, right: 30, bottom: 30, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis dataKey="sourceModule" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" height={50} />
            <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} unit="%" />
            <Tooltip />
            <ReferenceLine y={70} stroke="#dc2626" strokeDasharray="3 3" label={{ value: 'Target 70%', fontSize: 11, fill: '#dc2626' }} />
            <Bar dataKey="closedLoopRate" radius={[4, 4, 0, 0]}>
              {data.crossModule.map((entry, idx) => (
                <Cell key={idx} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

// ============================================================================
// Tab: Insights
// ============================================================================
function InsightsTab({ data }: { data: ApiResponse }) {
  const k = data.kpis;
  return (
    <div className="ci-tab-pane">
      {/* Insights list */}
      <div className="ci-insights-list">
        {data.insights.map((ins, idx) => (
          <div key={idx} className={cn('ci-insight-row', `ci-insight-${ins.type}`)}>
            <div className="ci-insight-icon">
              {ins.type === 'danger' && <AlertOctagon size={20} />}
              {ins.type === 'warning' && <AlertTriangle size={20} />}
              {ins.type === 'success' && <CheckCircle2 size={20} />}
              {ins.type === 'info' && <Info size={20} />}
            </div>
            <div className="ci-insight-content">
              <div className="ci-insight-title">{ins.title}</div>
              <div className="ci-insight-description">{ins.description}</div>
              <div className="ci-insight-recommendation">
                <Lightbulb size={12} />
                <span>{ins.recommendation}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ISO 10.3 Health Scorecard */}
      <Card className="hover-lift-sm ci-health-card">
        <div className="ci-chart-header"><Gauge size={16} /><h3>ISO 9001:2015 §10.3 Health Scorecard</h3></div>
        <div className="ci-health-grid">
          <div className="ci-health-tile">
            <div className="ci-health-label">§10.3.1 Effectiveness</div>
            <div className="ci-health-value">{k.iso_10_3_1}%</div>
            <div className="ci-health-bar"><div className="ci-health-fill" style={{ width: `${k.iso_10_3_1}%`, background: k.iso_10_3_1 >= 70 ? '#047857' : k.iso_10_3_1 >= 50 ? '#d97706' : '#dc2626' }} /></div>
            <div className="ci-health-target">Target: 90%</div>
          </div>
          <div className="ci-health-tile">
            <div className="ci-health-label">§10.3.2 Suitability</div>
            <div className="ci-health-value">{k.iso_10_3_2}%</div>
            <div className="ci-health-bar"><div className="ci-health-fill" style={{ width: `${k.iso_10_3_2}%`, background: k.iso_10_3_2 >= 70 ? '#047857' : k.iso_10_3_2 >= 50 ? '#d97706' : '#dc2626' }} /></div>
            <div className="ci-health-target">Target: 85%</div>
          </div>
          <div className="ci-health-tile">
            <div className="ci-health-label">§10.3.3 Adequacy</div>
            <div className="ci-health-value">{k.iso_10_3_3}%</div>
            <div className="ci-health-bar"><div className="ci-health-fill" style={{ width: `${k.iso_10_3_3}%`, background: k.iso_10_3_3 >= 70 ? '#047857' : k.iso_10_3_3 >= 50 ? '#d97706' : '#dc2626' }} /></div>
            <div className="ci-health-target">Target: 80%</div>
          </div>
          <div className="ci-health-tile ci-health-tile-overall">
            <div className="ci-health-label">Overall §10.3 Compliance</div>
            <div className="ci-health-value">{k.overallCompliance}%</div>
            <div className="ci-health-bar"><div className="ci-health-fill" style={{ width: `${k.overallCompliance}%`, background: k.overallCompliance >= 70 ? '#047857' : k.overallCompliance >= 50 ? '#d97706' : '#dc2626' }} /></div>
            <div className="ci-health-target">Target: 85%</div>
          </div>
          <div className="ci-health-tile ci-health-tile-effectiveness">
            <div className="ci-health-label">Composite Effectiveness</div>
            <div className="ci-health-value">{k.effectiveness}%</div>
            <div className="ci-health-bar"><div className="ci-health-fill" style={{ width: `${k.effectiveness}%`, background: k.effectiveness >= 70 ? '#047857' : k.effectiveness >= 50 ? '#d97706' : '#dc2626' }} /></div>
            <div className="ci-health-target">Target: 80%</div>
          </div>
          <div className="ci-health-tile">
            <div className="ci-health-label">Cross-Module Closed-Loop</div>
            <div className="ci-health-value">{k.closedLoopRate}%</div>
            <div className="ci-health-bar"><div className="ci-health-fill" style={{ width: `${k.closedLoopRate}%`, background: k.closedLoopRate >= 70 ? '#047857' : k.closedLoopRate >= 50 ? '#d97706' : '#dc2626' }} /></div>
            <div className="ci-health-target">Target: 75%</div>
          </div>
        </div>
      </Card>

      {/* Cross-module integration summary */}
      <Card className="hover-lift-sm ci-integration-card">
        <div className="ci-chart-header"><Network size={16} /><h3>Cross-Module Integration Summary</h3></div>
        <div className="ci-integration-grid">
          {data.crossModule.map((cm, idx) => (
            <div key={idx} className="ci-integration-tile" style={{ background: `linear-gradient(135deg, ${cm.color}10, ${cm.color}05)`, borderColor: cm.color + '30' }}>
              <div className="ci-integration-count" style={{ color: cm.color }}>{cm.improvementCount}</div>
              <div className="ci-integration-label">{cm.sourceLabel}</div>
              <div className="ci-integration-sublabel">{cm.sourceModule}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ============================================================================
// Detail Modal
// ============================================================================
function DetailModal({
  type, id, data, onClose, onToast,
}: {
  type: string;
  id: string;
  data: ApiResponse;
  onClose: () => void;
  onToast: (opts: { title: string; description?: string; variant?: 'default' | 'success' | 'destructive' }) => void;
}) {
  const title = type === 'project' ? 'Project Details'
              : type === 'suggestion' ? 'Kaizen Suggestion Details'
              : type === 'pdsa' ? 'PDSA Cycle Details'
              : type === 'roi' ? 'ROI Measurement Details'
              : type === 'practice' ? 'Best Practice Details'
              : 'Details';

  const renderContent = () => {
    if (type === 'project') {
      const p = data.projects.find(x => x.id === id);
      if (!p) return <div>Project not found</div>;
      return (
        <>
          <div className="ci-modal-meta-grid">
            <div><strong>Code:</strong> {p.projectCode}</div>
            <div><strong>Category:</strong> {CATEGORY_LABELS[p.category]}</div>
            <div><strong>Methodology:</strong> {METHODOLOGY_LABELS[p.methodology]}</div>
            <div><strong>Priority:</strong> {PRIORITY_LABELS[p.priority]}</div>
            <div><strong>Phase:</strong> {PHASE_LABELS[p.phase]}</div>
            <div><strong>Status:</strong> {STATUS_LABELS[p.status]}</div>
            <div><strong>Sponsor:</strong> {p.sponsor} ({p.sponsorRole})</div>
            <div><strong>Lead:</strong> {p.projectLead}</div>
            <div><strong>Team Size:</strong> {p.teamMembers}</div>
            <div><strong>Warehouse:</strong> {p.warehouseCode}</div>
            <div><strong>Department:</strong> {p.department}</div>
            <div><strong>Start Date:</strong> {fmtDate(p.startDate)}</div>
            <div><strong>Target End:</strong> {fmtDate(p.targetEndDate)}</div>
            <div><strong>Actual End:</strong> {fmtDate(p.actualEndDate)}</div>
            <div><strong>Days to Target:</strong> {fmtRelative(p.daysToTarget)}</div>
            <div><strong>Progress:</strong> {p.percentComplete}%</div>
          </div>
          <div className="ci-modal-section">
            <h4>Description</h4>
            <p>{p.description}</p>
          </div>
          <div className="ci-modal-section">
            <h4>Success Criteria</h4>
            <p>{p.successCriteria}</p>
          </div>
          <div className="ci-modal-section">
            <h4>Key Risks</h4>
            <p className="ci-modal-risk">{p.keyRisks}</p>
          </div>
          <div className="ci-modal-section ci-modal-financials">
            <h4>Financial Summary</h4>
            <div className="ci-modal-stat-row">
              <div className="ci-modal-stat-tile"><div className="ci-modal-stat-label">Estimated Cost</div><div className="ci-modal-stat-value">{fmtINR(p.estimatedCostInr)}</div></div>
              <div className="ci-modal-stat-tile"><div className="ci-modal-stat-label">Actual Cost</div><div className="ci-modal-stat-value">{fmtINR(p.actualCostInr)}</div></div>
              <div className="ci-modal-stat-tile"><div className="ci-modal-stat-label">Estimated Benefit</div><div className="ci-modal-stat-value">{fmtINR(p.estimatedBenefitInr)}</div></div>
              <div className="ci-modal-stat-tile"><div className="ci-modal-stat-label">Realized Benefit</div><div className="ci-modal-stat-value">{fmtINR(p.realizedBenefitInr)}</div></div>
              <div className="ci-modal-stat-tile"><div className="ci-modal-stat-label">ROI</div><div className="ci-modal-stat-value" style={{ color: p.roiPercent >= 0 ? '#047857' : '#dc2626' }}>{p.roiPercent > 0 ? '+' : ''}{p.roiPercent}%</div></div>
            </div>
          </div>
          <div className="ci-modal-section">
            <h4>Cross-Module Links</h4>
            <div className="ci-modal-links">
              {p.linkedAuditFinding && <span className="ci-pill ci-pill-info">🔗 {p.linkedAuditFinding}</span>}
              {p.linkedCapaId && <span className="ci-pill ci-pill-info">🔗 {p.linkedCapaId}</span>}
              {p.linkedDocNumber && <span className="ci-pill ci-pill-info">🔗 {p.linkedDocNumber}</span>}
              {p.linkedTrainingId && <span className="ci-pill ci-pill-info">🔗 {p.linkedTrainingId}</span>}
              {p.linkedSuggestionId && <span className="ci-pill ci-pill-info">🔗 {p.linkedSuggestionId}</span>}
              {!p.linkedAuditFinding && !p.linkedCapaId && !p.linkedDocNumber && !p.linkedTrainingId && !p.linkedSuggestionId && <span className="ci-modal-empty">No cross-module links</span>}
            </div>
          </div>
        </>
      );
    }
    if (type === 'suggestion') {
      const s = data.suggestions.find(x => x.id === id);
      if (!s) return <div>Suggestion not found</div>;
      return (
        <>
          <div className="ci-modal-meta-grid">
            <div><strong>Code:</strong> {s.suggestionCode}</div>
            <div><strong>Category:</strong> {SUGGESTION_CATEGORY_LABELS[s.category]}</div>
            <div><strong>Impact:</strong> {IMPACT_LABELS[s.impact]}</div>
            <div><strong>Status:</strong> {SUGGESTION_STATUS_LABELS[s.status]}</div>
            <div><strong>Submitted by:</strong> {s.submittedBy}</div>
            <div><strong>Role:</strong> {s.submittedByRole}</div>
            <div><strong>Department:</strong> {s.submittedByDepartment}</div>
            <div><strong>Warehouse:</strong> {s.warehouseCode}</div>
            <div><strong>Submitted:</strong> {fmtDate(s.submittedDate)}</div>
            <div><strong>Reviewed by:</strong> {s.reviewedBy || '—'}</div>
            <div><strong>Reviewed:</strong> {fmtDate(s.reviewedDate)}</div>
            <div><strong>Implemented:</strong> {fmtDate(s.implementedDate)}</div>
            <div><strong>Implementation Days:</strong> {s.implementationDays || '—'}</div>
            <div><strong>Upvotes:</strong> ▲ {s.upvotes}</div>
            <div><strong>Comments:</strong> {s.comments}</div>
            <div><strong>Recognition Points:</strong> ⭐ {s.recognitionPoints}</div>
          </div>
          <div className="ci-modal-section">
            <h4>Description</h4>
            <p>{s.description}</p>
          </div>
          <div className="ci-modal-section ci-modal-financials">
            <h4>Benefit Summary</h4>
            <div className="ci-modal-stat-row">
              <div className="ci-modal-stat-tile"><div className="ci-modal-stat-label">Estimated Benefit</div><div className="ci-modal-stat-value">{fmtINR(s.estimatedBenefitInr)}</div></div>
              <div className="ci-modal-stat-tile"><div className="ci-modal-stat-label">Actual Benefit</div><div className="ci-modal-stat-value" style={{ color: s.actualBenefitInr > 0 ? '#047857' : '#64748b' }}>{s.actualBenefitInr > 0 ? fmtINR(s.actualBenefitInr) : '—'}</div></div>
            </div>
          </div>
          {s.linkedProjectId && (
            <div className="ci-modal-section">
              <h4>Linked Project</h4>
              <span className="ci-pill ci-pill-info">🔗 {s.linkedProjectId}</span>
            </div>
          )}
        </>
      );
    }
    if (type === 'pdsa') {
      const c = data.cycles.find(x => x.id === id);
      if (!c) return <div>Cycle not found</div>;
      return (
        <>
          <div className="ci-modal-meta-grid">
            <div><strong>Cycle ID:</strong> {c.id}</div>
            <div><strong>Project:</strong> {c.projectTitle}</div>
            <div><strong>Iteration:</strong> #{c.cycleNumber} of {c.iterationCount}</div>
            <div><strong>Stage:</strong> {c.stage.toUpperCase()}</div>
            <div><strong>Plan Owner:</strong> {c.planOwner}</div>
            <div><strong>Do Owner:</strong> {c.doOwner}</div>
            <div><strong>Study Owner:</strong> {c.studyOwner}</div>
            <div><strong>Act Owner:</strong> {c.actOwner}</div>
            <div><strong>Plan Target:</strong> {fmtDate(c.planTargetDate)}</div>
            <div><strong>Do Start:</strong> {fmtDate(c.doStartDate)}</div>
            <div><strong>Do End:</strong> {fmtDate(c.doEndDate)}</div>
            <div><strong>Study Date:</strong> {fmtDate(c.studyDate)}</div>
            <div><strong>Act Date:</strong> {fmtDate(c.actDate)}</div>
            <div><strong>Outcome:</strong> {c.studyOutcome}</div>
            <div><strong>Decision:</strong> {c.actDecision.replace('_', ' ')}</div>
            <div><strong>Improvement:</strong> {c.metricsImprovementPct > 0 ? '+' : ''}{c.metricsImprovementPct}%</div>
          </div>
          <div className="ci-modal-section">
            <h4>Hypothesis</h4>
            <p>{c.hypothesis}</p>
          </div>
          <div className="ci-modal-pdsa-grid">
            <div className="ci-modal-pdsa-stage ci-modal-pdsa-plan">
              <h4>P — Plan</h4>
              <p>{c.planActions}</p>
            </div>
            <div className="ci-modal-pdsa-stage ci-modal-pdsa-do">
              <h4>D — Do</h4>
              <p>{c.doActions}</p>
            </div>
            <div className="ci-modal-pdsa-stage ci-modal-pdsa-study">
              <h4>S — Study</h4>
              <p>{c.studyFindings}</p>
            </div>
            <div className="ci-modal-pdsa-stage ci-modal-pdsa-act">
              <h4>A — Act</h4>
              <p>{c.actActions}</p>
            </div>
          </div>
          <div className="ci-modal-section ci-modal-financials">
            <h4>Metrics</h4>
            <div className="ci-modal-stat-row">
              <div className="ci-modal-stat-tile"><div className="ci-modal-stat-label">Baseline</div><div className="ci-modal-stat-value">{c.metricsBaseline}</div></div>
              <div className="ci-modal-stat-tile"><div className="ci-modal-stat-label">Target</div><div className="ci-modal-stat-value">{c.metricsTarget}</div></div>
              <div className="ci-modal-stat-tile"><div className="ci-modal-stat-label">Actual</div><div className="ci-modal-stat-value" style={{ color: c.metricsActual >= c.metricsBaseline ? '#047857' : '#dc2626' }}>{c.metricsActual || '—'}</div></div>
              <div className="ci-modal-stat-tile"><div className="ci-modal-stat-label">Improvement</div><div className="ci-modal-stat-value" style={{ color: c.metricsImprovementPct >= 0 ? '#047857' : '#dc2626' }}>{c.metricsImprovementPct > 0 ? '+' : ''}{c.metricsImprovementPct}%</div></div>
            </div>
          </div>
        </>
      );
    }
    if (type === 'roi') {
      const r = data.roi.find(x => x.id === id);
      if (!r) return <div>ROI record not found</div>;
      return (
        <>
          <div className="ci-modal-meta-grid">
            <div><strong>ROI ID:</strong> {r.id}</div>
            <div><strong>Project:</strong> {r.projectTitle}</div>
            <div><strong>Category:</strong> {CATEGORY_LABELS[r.category]}</div>
            <div><strong>Period:</strong> {r.measurementPeriod}</div>
            <div><strong>Measurement Date:</strong> {fmtDate(r.measurementDate)}</div>
            <div><strong>Verified:</strong> {r.verified ? '✓ Yes' : '⏳ Pending'}</div>
            <div><strong>Verified By:</strong> {r.verifiedBy || '—'}</div>
          </div>
          <div className="ci-modal-section ci-modal-financials">
            <h4>Investment & Benefit</h4>
            <div className="ci-modal-stat-row">
              <div className="ci-modal-stat-tile"><div className="ci-modal-stat-label">Total Investment</div><div className="ci-modal-stat-value">{fmtINR(r.totalInvestmentInr)}</div></div>
              <div className="ci-modal-stat-tile"><div className="ci-modal-stat-label">Cost Saved</div><div className="ci-modal-stat-value">{fmtINR(r.costSavedInr)}</div></div>
              <div className="ci-modal-stat-tile"><div className="ci-modal-stat-label">Revenue Lift</div><div className="ci-modal-stat-value">{fmtINR(r.revenueLiftInr)}</div></div>
              <div className="ci-modal-stat-tile"><div className="ci-modal-stat-label">Cost Avoided</div><div className="ci-modal-stat-value">{fmtINR(r.costAvoidedInr)}</div></div>
              <div className="ci-modal-stat-tile"><div className="ci-modal-stat-label">Total Benefit</div><div className="ci-modal-stat-value">{fmtINR(r.totalBenefitInr)}</div></div>
              <div className="ci-modal-stat-tile"><div className="ci-modal-stat-label">Net Benefit</div><div className="ci-modal-stat-value" style={{ color: r.netBenefitInr >= 0 ? '#047857' : '#dc2626' }}>{fmtINR(r.netBenefitInr)}</div></div>
              <div className="ci-modal-stat-tile"><div className="ci-modal-stat-label">NPV</div><div className="ci-modal-stat-value">{fmtINR(r.npvInr)}</div></div>
              <div className="ci-modal-stat-tile"><div className="ci-modal-stat-label">ROI</div><div className="ci-modal-stat-value" style={{ color: r.roiPercent >= 0 ? '#047857' : '#dc2626' }}>{r.roiPercent > 0 ? '+' : ''}{r.roiPercent}%</div></div>
              <div className="ci-modal-stat-tile"><div className="ci-modal-stat-label">Payback</div><div className="ci-modal-stat-value">{r.paybackMonths} mo</div></div>
              <div className="ci-modal-stat-tile"><div className="ci-modal-stat-label">IRR</div><div className="ci-modal-stat-value">{r.irrPercent}%</div></div>
            </div>
          </div>
          <div className="ci-modal-section">
            <h4>Operational Impact</h4>
            <div className="ci-modal-stat-row">
              <div className="ci-modal-stat-tile"><div className="ci-modal-stat-label">Productivity Gain</div><div className="ci-modal-stat-value">+{r.productivityGainPct}%</div></div>
              <div className="ci-modal-stat-tile"><div className="ci-modal-stat-label">Cycle Time Reduction</div><div className="ci-modal-stat-value">-{r.cycleTimeReductionPct}%</div></div>
              <div className="ci-modal-stat-tile"><div className="ci-modal-stat-label">Defect Reduction</div><div className="ci-modal-stat-value">-{r.defectReductionPct}%</div></div>
              <div className="ci-modal-stat-tile"><div className="ci-modal-stat-label">CSAT Lift</div><div className="ci-modal-stat-value">+{r.customerSatisfactionLift}</div></div>
            </div>
          </div>
        </>
      );
    }
    if (type === 'practice') {
      const p = data.practices.find(x => x.id === id);
      if (!p) return <div>Practice not found</div>;
      return (
        <>
          <div className="ci-modal-meta-grid">
            <div><strong>Code:</strong> {p.practiceCode}</div>
            <div><strong>Category:</strong> {CATEGORY_LABELS[p.category]}</div>
            <div><strong>Origin Warehouse:</strong> {p.originWarehouseCode}</div>
            <div><strong>Origin Project:</strong> {p.originProjectId}</div>
            <div><strong>Maturity:</strong> {MATURITY_LABELS[p.maturity]}</div>
            <div><strong>Replications:</strong> {p.replicationCount}</div>
            <div><strong>Documented by:</strong> {p.documentedBy}</div>
            <div><strong>Documented:</strong> {fmtDate(p.documentedDate)}</div>
            <div><strong>Last Updated:</strong> {fmtDate(p.lastUpdated)}</div>
            <div><strong>Approval:</strong> {p.approvalStatus.replace('_', ' ')}</div>
            <div><strong>SOP Reference:</strong> {p.sopReference || '—'}</div>
            <div><strong>Training Required:</strong> {p.trainingRequired ? 'Yes' : 'No'}</div>
          </div>
          <div className="ci-modal-section">
            <h4>Description</h4>
            <p>{p.description}</p>
          </div>
          <div className="ci-modal-section">
            <h4>Impact Summary</h4>
            <p>{p.impactSummary}</p>
          </div>
          <div className="ci-modal-section ci-modal-financials">
            <h4>Replication Savings</h4>
            <div className="ci-modal-stat-row">
              <div className="ci-modal-stat-tile"><div className="ci-modal-stat-label">Per-Site Savings</div><div className="ci-modal-stat-value">{fmtINR(p.estimatedSavingsPerSiteInr)}</div></div>
              <div className="ci-modal-stat-tile"><div className="ci-modal-stat-label">Replication Count</div><div className="ci-modal-stat-value">{p.replicationCount}</div></div>
              <div className="ci-modal-stat-tile"><div className="ci-modal-stat-label">Total Est. Savings</div><div className="ci-modal-stat-value" style={{ color: '#047857' }}>{fmtINR(p.totalEstimatedSavingsInr)}</div></div>
            </div>
          </div>
          {p.replicatedTo.length > 0 && (
            <div className="ci-modal-section">
              <h4>Replicated To</h4>
              <div className="ci-modal-links">
                {p.replicatedTo.map((wh, i) => <span key={i} className="ci-pill ci-pill-info">📍 {wh}</span>)}
              </div>
            </div>
          )}
          {p.linkedDocNumber && (
            <div className="ci-modal-section">
              <h4>Linked Document</h4>
              <span className="ci-pill ci-pill-info">🔗 {p.linkedDocNumber}</span>
            </div>
          )}
        </>
      );
    }
    return <div>Unknown detail type</div>;
  };

  return (
    <div className="ci-modal-overlay" onClick={onClose}>
      <div className="ci-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="ci-modal-header">
          <h2>{title}</h2>
          <div className="ci-modal-actions">
            <Button variant="outline" size="sm" onClick={() => onToast({ title: 'Detail exported', description: 'Detail data exported to CSV (mock)', variant: 'success' })}>
              <FileText size={14} /> Export
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X size={16} />
            </Button>
          </div>
        </div>
        <div className="ci-modal-body">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
