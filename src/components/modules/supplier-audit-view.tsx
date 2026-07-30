// R111: Supplier Audit & Onboarding View
'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import type { CSSProperties } from 'react';
import {
  RefreshCw, AlertTriangle, Search, ShieldCheck, Award, TrendingUp,
  TrendingDown, ChevronRight, X, Activity, Target, Zap, Info,
  Gauge, Crown, Star, BadgeCheck, AlertOctagon, Clock, Eye, Network,
  BarChart3, Filter, ChevronDown, ChevronUp, Building2, Hash, FileCheck,
  FileWarning, Sparkles, CheckCircle2, XCircle, AlertCircle, Coins,
  Factory, Cog, Boxes, Truck, Wrench, Cpu, FileText, ClipboardCheck,
  ClipboardList, UserCheck, CalendarClock, MapPin, Phone, Mail,
  ExternalLink, FileSearch, Gavel, ThumbsUp, ThumbsDown, Scale,
  Lightbulb, Trophy,
} from 'lucide-react';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, ComposedChart, Line, ReferenceLine, AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================
type SupplierCategory = 'raw_material' | 'components' | 'packaging' | 'logistics' | 'services' | 'capital_equipment';
type SupplierTier = 'strategic' | 'preferred' | 'approved' | 'conditional' | 'probation';
type ApprovalStatus = 'pending' | 'approved' | 'conditional' | 'probation' | 'suspended' | 'debarred' | 'in_review';
type OnboardingStage = 'pre_qualification' | 'questionnaire' | 'document_collection' | 'site_audit' | 'approval_review' | 'first_po' | 'completed' | 'rejected';
type AuditType = 'initial' | 'routine' | 'follow_up' | 'special' | 'surveillance' | 're_certification';
type AuditStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'postponed';
type AuditOutcome = 'pass' | 'conditional_pass' | 'minor_nonconformities' | 'major_nonconformities' | 'fail';
type FindingSeverity = 'observation' | 'minor' | 'major' | 'critical';
type FindingStatus = 'open' | 'in_progress' | 'pending_verification' | 'closed' | 'overdue';
type FAIStatus = 'pending' | 'in_progress' | 'passed' | 'failed' | 'conditional' | 'waived';
type SelfAssessmentStatus = 'not_sent' | 'sent' | 'in_progress' | 'submitted' | 'reviewed' | 'overdue';
type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

interface Supplier {
  id: string; supplierCode: string; name: string; category: SupplierCategory;
  tier: SupplierTier; approvalStatus: ApprovalStatus; riskLevel: RiskLevel;
  country: string; state: string; city: string;
  contactName: string; contactEmail: string; contactPhone: string;
  gstin: string; pan: string;
  msmeRegistered: boolean; iso9001Certified: boolean; iso14001Certified: boolean; iso45001Certified: boolean; iatf16949Certified: boolean;
  onboardingStage: OnboardingStage; onboardingProgress: number;
  onboardedDate: string | null; firstPODate: string | null;
  annualSpendInr: number; activeSKUs: number; criticalityScore: number;
  lastAuditDate: string | null; lastAuditScore: number | null; nextAuditDue: string | null;
  openFindings: number; overdueFindings: number; faiPendingCount: number;
  selfAssessmentScore: number | null; compositeScore: number;
}
interface OnboardingApplication {
  id: string; applicationCode: string; supplierName: string; category: SupplierCategory;
  stage: OnboardingStage; stageProgress: number;
  submittedDate: string; targetCompletionDate: string; daysInPipeline: number;
  sponsorName: string; sponsorDepartment: string; initiatedBy: string; procurementCategoryManager: string;
  documentsRequired: number; documentsReceived: number; documentsApproved: number;
  questionnaireSent: boolean; questionnaireReceived: boolean; questionnaireScore: number | null;
  siteAuditScheduled: boolean; siteAuditDate: string | null; siteAuditScore: number | null;
  approvalCommitteeReview: boolean; approvalDecision: 'pending' | 'approved' | 'conditional' | 'rejected';
  riskAssessmentScore: number | null; riskLevel: RiskLevel;
  rejectionReason: string | null; notes: string;
}
interface AuditSchedule {
  id: string; auditCode: string; supplierId: string; supplierName: string;
  auditType: AuditType; status: AuditStatus;
  scheduledDate: string; completedDate: string | null; daysToAudit: number; durationDays: number;
  leadAuditor: string; auditTeamSize: number; auditScope: string;
  auditLocation: 'on_site' | 'remote' | 'hybrid'; facility: string; checklistVersion: string;
  totalQuestions: number; questionsCompleted: number;
  outcome: AuditOutcome | null; score: number | null;
  findingsCount: number; criticalFindings: number; majorFindings: number; minorFindings: number; observations: number;
  capasLinked: number; reportPath: string | null; nextAuditDate: string | null;
}
interface AuditFinding {
  id: string; findingCode: string; auditId: string; auditCode: string;
  supplierId: string; supplierName: string;
  severity: FindingSeverity; status: FindingStatus;
  category: 'documentation' | 'process_control' | 'quality_system' | 'traceability' | 'calibration' | 'training' | 'environment' | 'safety' | 'data_integrity' | 'supplier_management';
  clauseReference: string; description: string;
  identifiedDate: string; dueDate: string; daysToDue: number; closedDate: string | null;
  rootCause: string | null; correctiveAction: string | null; preventiveAction: string | null;
  capapId: string | null; verificationMethod: 'document_review' | 'on_site_verification' | 'next_audit' | 'evidence_submission' | null;
  verifiedBy: string | null; owner: string;
}
interface FirstArticleInspection {
  id: string; faiCode: string; supplierId: string; supplierName: string;
  skuCode: string; skuDescription: string; category: SupplierCategory;
  status: FAIStatus;
  requestDate: string; receivedDate: string | null; inspectionDate: string | null; completedDate: string | null;
  daysInProcess: number; inspector: string; inspectionLocation: string;
  sampleSize: number; drawingRev: string; specificationRev: string;
  dimensionalInspection: 'pending' | 'in_progress' | 'passed' | 'failed' | 'na';
  materialCertification: 'pending' | 'received' | 'missing' | 'na';
  functionalTest: 'pending' | 'passed' | 'failed' | 'na';
  visualInspection: 'pending' | 'passed' | 'failed';
  packagingInspection: 'pending' | 'passed' | 'failed';
  documentationReview: 'pending' | 'passed' | 'failed';
  overallResult: 'pending' | 'passed' | 'failed' | 'conditional' | 'waived';
  deviationCount: number; criticalDeviations: number;
  reportPath: string | null; approvedBy: string | null; nextAction: string;
}
interface SelfAssessment {
  id: string; assessmentCode: string; supplierId: string; supplierName: string;
  status: SelfAssessmentStatus;
  sentDate: string; dueDate: string; submittedDate: string | null; daysToDue: number;
  reviewer: string | null; reviewDate: string | null;
  qualityScore: number | null; deliveryScore: number | null; costScore: number | null;
  sustainabilityScore: number | null; complianceScore: number | null;
  overallScore: number | null; deviationFromInternal: number | null;
  attestationSigned: boolean; attachmentsUploaded: number; notes: string;
}
interface SupplierScorecard {
  supplierId: string; supplierName: string; category: SupplierCategory;
  tier: SupplierTier; approvalStatus: ApprovalStatus;
  qualityScore: number; deliveryScore: number; costScore: number;
  auditScore: number; riskScore: number; compositeScore: number; rank: number;
  annualSpendInr: number; trendVsLastQuarter: number;
}
interface CrossModuleLink {
  sourceModule: string; sourceLabel: string;
  linkedCount: number; pendingCount: number; closedLoopRate: number; color: string;
}
interface KPIs {
  totalSuppliers: number; activeSuppliers: number; onboardingInPipeline: number;
  approvedSuppliers: number; conditionalSuppliers: number; probationSuppliers: number;
  suspendedSuppliers: number; debarredSuppliers: number;
  strategicSuppliers: number; preferredSuppliers: number;
  criticalRiskSuppliers: number; highRiskSuppliers: number;
  auditsScheduledThisYear: number; auditsCompletedThisYear: number; auditsOnTrack: number; auditsOverdue: number;
  openFindings: number; overdueFindings: number; criticalFindings: number; majorFindings: number;
  faiPending: number; faiInProgress: number; faiPassed: number; faiFailed: number; faiPassRate: number;
  selfAssessmentSent: number; selfAssessmentSubmitted: number; selfAssessmentOverdue: number; selfAssessmentResponseRate: number;
  averageCompositeScore: number; averageAuditScore: number; totalAnnualSpend: number;
  iso_8_4_compliance: number; compositeEffectiveness: number;
}
interface ApiResponse {
  generatedAt: string;
  kpis: KPIs;
  suppliers: Supplier[];
  apps: OnboardingApplication[];
  audits: AuditSchedule[];
  findings: AuditFinding[];
  fais: FirstArticleInspection[];
  assessments: SelfAssessment[];
  scorecards: SupplierScorecard[];
  crossModule: CrossModuleLink[];
  suppliersByTier: { tier: SupplierTier; label: string; color: string; count: number }[];
  suppliersByApproval: { approval: ApprovalStatus; label: string; color: string; count: number }[];
  suppliersByCategory: { category: SupplierCategory; label: string; color: string; count: number; spend: number }[];
  suppliersByRisk: { risk: RiskLevel; label: string; color: string; count: number }[];
  auditsByType: { type: AuditType; label: string; color: string; count: number }[];
  auditsByStatus: { status: AuditStatus; label: string; color: string; count: number }[];
  auditsByOutcome: { outcome: AuditOutcome; label: string; color: string; count: number }[];
  findingsBySeverity: { severity: FindingSeverity; label: string; color: string; count: number; open: number }[];
  findingsByStatus: { status: FindingStatus; label: string; color: string; count: number }[];
  findingsByCategory: { category: string; label: string; clause: string; count: number; open: number }[];
  faiByStatus: { status: FAIStatus; label: string; color: string; count: number }[];
  selfAssessmentByStatus: { status: SelfAssessmentStatus; label: string; color: string; count: number }[];
  onboardingTrend: { month: string; newApplications: number; completed: number; rejected: number }[];
  auditTrend: { month: string; scheduled: number; completed: number; avgScore: number; findings: number }[];
  topSuppliers: SupplierScorecard[];
  insights: { type: 'danger' | 'warning' | 'success' | 'info'; title: string; description: string; recommendation: string }[];
}

// ============================================================================
// Constants
// ============================================================================
const CATEGORY_LABELS: Record<SupplierCategory, string> = {
  raw_material: 'Raw Materials', components: 'Components', packaging: 'Packaging',
  logistics: 'Logistics', services: 'Services', capital_equipment: 'Capital Equipment',
};
const CATEGORY_COLORS: Record<SupplierCategory, string> = {
  raw_material: '#ea580c', components: '#2563eb', packaging: '#047857',
  logistics: '#7c3aed', services: '#0891b2', capital_equipment: '#be185d',
};
const TIER_LABELS: Record<SupplierTier, string> = {
  strategic: 'Strategic', preferred: 'Preferred', approved: 'Approved',
  conditional: 'Conditional', probation: 'Probation',
};
const TIER_COLORS: Record<SupplierTier, string> = {
  strategic: '#7c3aed', preferred: '#4f46e5', approved: '#047857',
  conditional: '#d97706', probation: '#dc2626',
};
const APPROVAL_LABELS: Record<ApprovalStatus, string> = {
  pending: 'Pending', approved: 'Approved', conditional: 'Conditional',
  probation: 'Probation', suspended: 'Suspended', debarred: 'Debarred', in_review: 'In Review',
};
const APPROVAL_COLORS: Record<ApprovalStatus, string> = {
  pending: '#2563eb', approved: '#047857', conditional: '#d97706',
  probation: '#dc2626', suspended: '#7c2d12', debarred: '#450a0a', in_review: '#6b7280',
};
const ONBOARDING_LABELS: Record<OnboardingStage, string> = {
  pre_qualification: 'Pre-Qualification', questionnaire: 'Questionnaire',
  document_collection: 'Document Collection', site_audit: 'Site Audit',
  approval_review: 'Approval Review', first_po: 'First PO',
  completed: 'Completed', rejected: 'Rejected',
};
const ONBOARDING_COLORS: Record<OnboardingStage, string> = {
  pre_qualification: '#6b7280', questionnaire: '#2563eb', document_collection: '#0891b2',
  site_audit: '#d97706', approval_review: '#7c3aed', first_po: '#be185d',
  completed: '#047857', rejected: '#dc2626',
};
const AUDIT_TYPE_LABELS: Record<AuditType, string> = {
  initial: 'Initial', routine: 'Routine', follow_up: 'Follow-up',
  special: 'Special', surveillance: 'Surveillance', re_certification: 'Re-Certification',
};
const AUDIT_TYPE_COLORS: Record<AuditType, string> = {
  initial: '#4f46e5', routine: '#0891b2', follow_up: '#d97706',
  special: '#be185d', surveillance: '#7c3aed', re_certification: '#047857',
};
const AUDIT_STATUS_LABELS: Record<AuditStatus, string> = {
  scheduled: 'Scheduled', in_progress: 'In Progress', completed: 'Completed',
  cancelled: 'Cancelled', postponed: 'Postponed',
};
const AUDIT_STATUS_COLORS: Record<AuditStatus, string> = {
  scheduled: '#2563eb', in_progress: '#d97706', completed: '#047857',
  cancelled: '#7c2d12', postponed: '#6b7280',
};
const AUDIT_OUTCOME_LABELS: Record<AuditOutcome, string> = {
  pass: 'Pass', conditional_pass: 'Conditional Pass',
  minor_nonconformities: 'Minor NC', major_nonconformities: 'Major NC', fail: 'Fail',
};
const AUDIT_OUTCOME_COLORS: Record<AuditOutcome, string> = {
  pass: '#047857', conditional_pass: '#0891b2', minor_nonconformities: '#d97706',
  major_nonconformities: '#ea580c', fail: '#dc2626',
};
const FINDING_SEVERITY_LABELS: Record<FindingSeverity, string> = {
  observation: 'Observation', minor: 'Minor', major: 'Major', critical: 'Critical',
};
const FINDING_SEVERITY_COLORS: Record<FindingSeverity, string> = {
  observation: '#6b7280', minor: '#d97706', major: '#ea580c', critical: '#dc2626',
};
const FINDING_STATUS_LABELS: Record<FindingStatus, string> = {
  open: 'Open', in_progress: 'In Progress', pending_verification: 'Pending Verification',
  closed: 'Closed', overdue: 'Overdue',
};
const FINDING_STATUS_COLORS: Record<FindingStatus, string> = {
  open: '#2563eb', in_progress: '#d97706', pending_verification: '#7c3aed',
  closed: '#047857', overdue: '#dc2626',
};
const FAI_STATUS_LABELS: Record<FAIStatus, string> = {
  pending: 'Pending', in_progress: 'In Progress', passed: 'Passed',
  failed: 'Failed', conditional: 'Conditional', waived: 'Waived',
};
const FAI_STATUS_COLORS: Record<FAIStatus, string> = {
  pending: '#2563eb', in_progress: '#d97706', passed: '#047857',
  failed: '#dc2626', conditional: '#0891b2', waived: '#6b7280',
};
const SA_STATUS_LABELS: Record<SelfAssessmentStatus, string> = {
  not_sent: 'Not Sent', sent: 'Sent', in_progress: 'In Progress',
  submitted: 'Submitted', reviewed: 'Reviewed', overdue: 'Overdue',
};
const SA_STATUS_COLORS: Record<SelfAssessmentStatus, string> = {
  not_sent: '#6b7280', sent: '#2563eb', in_progress: '#d97706',
  submitted: '#7c3aed', reviewed: '#047857', overdue: '#dc2626',
};
const RISK_LABELS: Record<RiskLevel, string> = {
  low: 'Low', medium: 'Medium', high: 'High', critical: 'Critical',
};
const RISK_COLORS: Record<RiskLevel, string> = {
  low: '#047857', medium: '#d97706', high: '#ea580c', critical: '#dc2626',
};

const TABS = [
  { id: 'suppliers', label: 'Supplier Directory', icon: 'Factory' },
  { id: 'onboarding', label: 'Onboarding Pipeline', icon: 'UserCheck' },
  { id: 'audits', label: 'Audit Schedules', icon: 'ClipboardCheck' },
  { id: 'findings', label: 'Audit Findings', icon: 'FileWarning' },
  { id: 'fai', label: 'First Article Insp.', icon: 'FileSearch' },
  { id: 'self-assessment', label: 'Self-Assessment', icon: 'ClipboardList' },
  { id: 'scorecards', label: 'Scorecards', icon: 'Award' },
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
  const map: Record<string, typeof Factory> = {
    Factory: Factory, UserCheck: UserCheck, ClipboardCheck: ClipboardCheck,
    FileWarning: FileWarning, FileSearch: FileSearch, ClipboardList: ClipboardList,
    Award: Award, Sparkles: Sparkles,
    Cog: Cog, Boxes: Boxes, Truck: Truck, Wrench: Wrench, Cpu: Cpu,
  };
  const Icon = map[name] || Activity;
  return <Icon size={size} style={style} />;
}
function categoryIcon(cat: SupplierCategory, size = 14) {
  const map: Record<SupplierCategory, string> = {
    raw_material: 'Factory', components: 'Cog', packaging: 'Boxes',
    logistics: 'Truck', services: 'Wrench', capital_equipment: 'Cpu',
  };
  return renderTypeIcon(map[cat], size, { color: CATEGORY_COLORS[cat] });
}

// ============================================================================
// Main Component
// ============================================================================
export function SupplierAuditView() {
  const { toast } = useToast();
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('suppliers');
  const [search, setSearch] = useState('');
  const [filterTier, setFilterTier] = useState<string>('all');
  const [filterApproval, setFilterApproval] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterAuditStatus, setFilterAuditStatus] = useState<string>('all');
  const [filterFindingSeverity, setFilterFindingSeverity] = useState<string>('all');
  const [filterFindingStatus, setFilterFindingStatus] = useState<string>('all');
  const [filterFAIStatus, setFilterFAIStatus] = useState<string>('all');
  const [filterSAStatus, setFilterSAStatus] = useState<string>('all');
  const [detailModal, setDetailModal] = useState<{ type: string; id: string } | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/supplier-audit');
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
      <div className="sa-loading">
        <RefreshCw className="animate-spin" size={32} />
        <p>Loading Supplier Audit & Onboarding data...</p>
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className="sa-error">
        <AlertTriangle size={32} />
        <p>{error || 'No data available'}</p>
        <Button onClick={fetchData}><RefreshCw size={16} /> Retry</Button>
      </div>
    );
  }

  const k = data.kpis;

  return (
    <div className="sa-container">
      {/* Header */}
      <header className="sa-header">
        <div className="sa-header-title">
          <h1><ShieldCheck size={28} /> Supplier Audit & Onboarding</h1>
          <p className="sa-subtitle">ISO 9001:2015 §8.4 — Control of Externally Provided Processes, Products & Services</p>
        </div>
        <div className="sa-header-actions">
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw size={14} /> Refresh
          </Button>
          <div className="sa-compliance-badge">
            <Gauge size={14} />
            <span>ISO 8.4: <strong>{k.iso_8_4_compliance}%</strong></span>
          </div>
          <div className="sa-effectiveness-badge">
            <Target size={14} />
            <span>Effectiveness: <strong>{k.compositeEffectiveness}%</strong></span>
          </div>
        </div>
      </header>

      {/* KPI Banner */}
      <section className="sa-kpi-banner">
        <div className="sa-kpi-main">
          <div className="sa-kpi-main-value">{k.totalSuppliers}</div>
          <div className="sa-kpi-main-label">Total Suppliers</div>
          <div className="sa-kpi-main-sublabel">
            <Factory size={12} /> {k.activeSuppliers} active · {k.approvedSuppliers} approved · {k.strategicSuppliers} strategic
          </div>
        </div>
        <div className="sa-kpi-grid">
          <div className="sa-kpi-tile sa-kpi-tile-info"><ClipboardCheck size={16} /><div><div className="sa-kpi-tile-value">{k.auditsScheduledThisYear}</div><div className="sa-kpi-tile-label">Audits (YTD)</div></div></div>
          <div className="sa-kpi-tile sa-kpi-tile-success"><CheckCircle2 size={16} /><div><div className="sa-kpi-tile-value">{k.auditsCompletedThisYear}</div><div className="sa-kpi-tile-label">Audits Completed</div></div></div>
          <div className="sa-kpi-tile sa-kpi-tile-warning"><FileWarning size={16} /><div><div className="sa-kpi-tile-value">{k.openFindings}</div><div className="sa-kpi-tile-label">Open Findings</div></div></div>
          <div className="sa-kpi-tile sa-kpi-tile-danger"><AlertOctagon size={16} /><div><div className="sa-kpi-tile-value">{k.criticalFindings}</div><div className="sa-kpi-tile-label">Critical Findings</div></div></div>
          <div className="sa-kpi-tile sa-kpi-tile-danger"><Clock size={16} /><div><div className="sa-kpi-tile-value">{k.overdueFindings}</div><div className="sa-kpi-tile-label">Overdue Findings</div></div></div>
          <div className="sa-kpi-tile sa-kpi-tile-warning"><FileSearch size={16} /><div><div className="sa-kpi-tile-value">{k.faiPending + k.faiInProgress}</div><div className="sa-kpi-tile-label">FAI In Process</div></div></div>
          <div className="sa-kpi-tile sa-kpi-tile-info"><ClipboardList size={16} /><div><div className="sa-kpi-tile-value">{k.selfAssessmentSent}</div><div className="sa-kpi-tile-label">Self-Assessments</div></div></div>
          <div className="sa-kpi-tile sa-kpi-tile-danger"><Gavel size={16} /><div><div className="sa-kpi-tile-value">{k.suspendedSuppliers + k.debarredSuppliers}</div><div className="sa-kpi-tile-label">Suspended/Debarred</div></div></div>
          <div className="sa-kpi-tile sa-kpi-tile-warning"><AlertTriangle size={16} /><div><div className="sa-kpi-tile-value">{k.criticalRiskSuppliers}</div><div className="sa-kpi-tile-label">Critical Risk</div></div></div>
          <div className="sa-kpi-tile sa-kpi-tile-info"><Coins size={16} /><div><div className="sa-kpi-tile-value">{fmtINRCompact(k.totalAnnualSpend)}</div><div className="sa-kpi-tile-label">Annual Spend</div></div></div>
        </div>
      </section>

      {/* Tabs */}
      <nav className="sa-tabs">
        {TABS.map(t => (
          <button
            key={t.id}
            className={cn('sa-tab', activeTab === t.id && 'sa-tab-active')}
            onClick={() => setActiveTab(t.id)}
          >
            {renderTypeIcon(t.icon, 14)}
            <span>{t.label}</span>
          </button>
        ))}
      </nav>

      {/* Tab content */}
      <div className="sa-tab-content">
        {activeTab === 'suppliers' && (
          <SuppliersTab
            data={data}
            search={search}
            setSearch={setSearch}
            filterTier={filterTier}
            setFilterTier={setFilterTier}
            filterApproval={filterApproval}
            setFilterApproval={setFilterApproval}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            setDetailModal={setDetailModal}
          />
        )}
        {activeTab === 'onboarding' && (
          <OnboardingTab data={data} setDetailModal={setDetailModal} />
        )}
        {activeTab === 'audits' && (
          <AuditsTab
            data={data}
            search={search}
            setSearch={setSearch}
            filterAuditStatus={filterAuditStatus}
            setFilterAuditStatus={setFilterAuditStatus}
            setDetailModal={setDetailModal}
          />
        )}
        {activeTab === 'findings' && (
          <FindingsTab
            data={data}
            search={search}
            setSearch={setSearch}
            filterFindingSeverity={filterFindingSeverity}
            setFilterFindingSeverity={setFilterFindingSeverity}
            filterFindingStatus={filterFindingStatus}
            setFilterFindingStatus={setFilterFindingStatus}
            setDetailModal={setDetailModal}
          />
        )}
        {activeTab === 'fai' && (
          <FAITab
            data={data}
            search={search}
            setSearch={setSearch}
            filterFAIStatus={filterFAIStatus}
            setFilterFAIStatus={setFilterFAIStatus}
            setDetailModal={setDetailModal}
          />
        )}
        {activeTab === 'self-assessment' && (
          <SelfAssessmentTab
            data={data}
            search={search}
            setSearch={setSearch}
            filterSAStatus={filterSAStatus}
            setFilterSAStatus={setFilterSAStatus}
            setDetailModal={setDetailModal}
          />
        )}
        {activeTab === 'scorecards' && <ScorecardsTab data={data} setDetailModal={setDetailModal} />}
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
// Tab: Suppliers Directory
// ============================================================================
function SuppliersTab({
  data, search, setSearch, filterTier, setFilterTier,
  filterApproval, setFilterApproval, filterCategory, setFilterCategory, setDetailModal,
}: {
  data: ApiResponse;
  search: string;
  setSearch: (s: string) => void;
  filterTier: string;
  setFilterTier: (s: string) => void;
  filterApproval: string;
  setFilterApproval: (s: string) => void;
  filterCategory: string;
  setFilterCategory: (s: string) => void;
  setDetailModal: (m: { type: string; id: string } | null) => void;
}) {
  const filtered = useMemo(() => {
    return data.suppliers.filter(s => {
      if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.supplierCode.toLowerCase().includes(search.toLowerCase()) && !s.city.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterTier !== 'all' && s.tier !== filterTier) return false;
      if (filterApproval !== 'all' && s.approvalStatus !== filterApproval) return false;
      if (filterCategory !== 'all' && s.category !== filterCategory) return false;
      return true;
    });
  }, [data.suppliers, search, filterTier, filterApproval, filterCategory]);

  return (
    <div className="sa-tab-pane">
      {/* Charts row */}
      <div className="sa-charts-row">
        <Card className="sa-chart-card">
          <div className="sa-chart-header"><BarChart3 size={16} /><h3>Suppliers by Tier</h3></div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.suppliersByTier} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {data.suppliersByTier.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="sa-chart-card">
          <div className="sa-chart-header"><BarChart3 size={16} /><h3>Suppliers by Approval Status</h3></div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.suppliersByApproval} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {data.suppliersByApproval.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="sa-chart-card">
          <div className="sa-chart-header"><BarChart3 size={16} /><h3>Annual Spend by Category</h3></div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.suppliersByCategory} layout="vertical" margin={{ top: 10, right: 10, bottom: 0, left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={fmtINRCompact} />
              <YAxis type="category" dataKey="label" tick={{ fontSize: 10 }} width={120} />
              <Tooltip formatter={(v: number) => fmtINR(v)} />
              <Bar dataKey="spend" radius={[0, 4, 4, 0]}>
                {data.suppliersByCategory.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Risk distribution */}
      <Card className="sa-chart-card sa-trend-card">
        <div className="sa-chart-header"><AlertTriangle size={16} /><h3>Supplier Risk Distribution</h3></div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data.suppliersByRisk} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.suppliersByRisk.map((entry, idx) => (
                <Cell key={idx} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Filters */}
      <div className="sa-filter-bar">
        <div className="sa-search-wrapper">
          <Search size={14} />
          <Input
            placeholder="Search by name, code, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sa-search-input"
          />
        </div>
        <select className="sa-select" value={filterTier} onChange={(e) => setFilterTier(e.target.value)}>
          <option value="all">All Tiers</option>
          {Object.entries(TIER_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select className="sa-select" value={filterApproval} onChange={(e) => setFilterApproval(e.target.value)}>
          <option value="all">All Approvals</option>
          {Object.entries(APPROVAL_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select className="sa-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="all">All Categories</option>
          {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <span className="sa-result-count">{filtered.length} suppliers</span>
      </div>

      {/* Suppliers table */}
      <div className="sa-table-wrap">
        <table className="sa-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Supplier</th>
              <th>Category</th>
              <th>Tier</th>
              <th>Approval</th>
              <th>Risk</th>
              <th>City</th>
              <th>Onboarded</th>
              <th>Last Audit</th>
              <th>Audit Score</th>
              <th>Open Findings</th>
              <th>Annual Spend</th>
              <th>Composite</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 50).map(s => (
              <tr key={s.id} className={cn(
                s.approvalStatus === 'suspended' && 'sa-row-danger',
                s.approvalStatus === 'debarred' && 'sa-row-danger',
                s.approvalStatus === 'probation' && 'sa-row-warning',
                s.approvalStatus === 'conditional' && 'sa-row-warning',
                s.riskLevel === 'critical' && 'sa-row-danger',
              )}>
                <td><span className="sa-code-pill">{s.supplierCode}</span></td>
                <td className="sa-cell-title">
                  {categoryIcon(s.category, 12)}
                  <span>{s.name}</span>
                </td>
                <td><span className="sa-pill" style={{ background: CATEGORY_COLORS[s.category] + '20', color: CATEGORY_COLORS[s.category] }}>{CATEGORY_LABELS[s.category]}</span></td>
                <td><span className="sa-pill" style={{ background: TIER_COLORS[s.tier] + '20', color: TIER_COLORS[s.tier] }}>{TIER_LABELS[s.tier]}</span></td>
                <td><span className="sa-pill" style={{ background: APPROVAL_COLORS[s.approvalStatus] + '20', color: APPROVAL_COLORS[s.approvalStatus] }}>{APPROVAL_LABELS[s.approvalStatus]}</span></td>
                <td><span className="sa-pill" style={{ background: RISK_COLORS[s.riskLevel] + '20', color: RISK_COLORS[s.riskLevel] }}>{RISK_LABELS[s.riskLevel]}</span></td>
                <td className="sa-cell-compact">{s.city}, {s.state}</td>
                <td className="sa-cell-compact">{fmtDate(s.onboardedDate)}</td>
                <td className="sa-cell-compact">{fmtDate(s.lastAuditDate)}</td>
                <td className="sa-cell-compact">
                  {s.lastAuditScore !== null ? (
                    <span className={cn('sa-roi-pill', s.lastAuditScore >= 85 && 'sa-roi-positive', s.lastAuditScore < 70 && 'sa-roi-negative')}>{s.lastAuditScore}</span>
                  ) : '—'}
                </td>
                <td className="sa-cell-compact">
                  {s.openFindings > 0 ? (
                    <span className={cn('sa-pill', s.overdueFindings > 0 && 'sa-pill-danger')}>{s.openFindings} ({s.overdueFindings} overdue)</span>
                  ) : <CheckCircle2 size={14} className="sa-icon-success" />}
                </td>
                <td className="sa-cell-compact">{s.annualSpendInr > 0 ? fmtINRCompact(s.annualSpendInr) : '—'}</td>
                <td>
                  <span className={cn('sa-roi-pill', s.compositeScore >= 80 && 'sa-roi-positive', s.compositeScore < 60 && 'sa-roi-negative')}>{s.compositeScore}</span>
                </td>
                <td>
                  <Button variant="ghost" size="sm" onClick={() => setDetailModal({ type: 'supplier', id: s.id })}>
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
// Tab: Onboarding Pipeline
// ============================================================================
function OnboardingTab({ data, setDetailModal }: { data: ApiResponse; setDetailModal: (m: { type: string; id: string } | null) => void }) {
  return (
    <div className="sa-tab-pane">
      {/* Stats */}
      <div className="sa-stat-tiles">
        <div className="sa-stat-tile"><UserCheck size={16} /><div><div className="sa-stat-value">{data.apps.length}</div><div className="sa-stat-label">Total Applications</div></div></div>
        <div className="sa-stat-tile"><Clock size={16} /><div><div className="sa-stat-value">{data.apps.filter(a => a.stage !== 'completed' && a.stage !== 'rejected').length}</div><div className="sa-stat-label">In Pipeline</div></div></div>
        <div className="sa-stat-tile"><CheckCircle2 size={16} /><div><div className="sa-stat-value">{data.apps.filter(a => a.approvalDecision === 'approved').length}</div><div className="sa-stat-label">Approved</div></div></div>
        <div className="sa-stat-tile"><XCircle size={16} /><div><div className="sa-stat-value">{data.apps.filter(a => a.approvalDecision === 'rejected').length}</div><div className="sa-stat-label">Rejected</div></div></div>
        <div className="sa-stat-tile"><CalendarClock size={16} /><div><div className="sa-stat-value">{Math.round(data.apps.reduce((s, a) => s + a.daysInPipeline, 0) / Math.max(data.apps.length, 1))}</div><div className="sa-stat-label">Avg Days in Pipeline</div></div></div>
      </div>

      {/* Onboarding trend */}
      <Card className="sa-chart-card sa-trend-card">
        <div className="sa-chart-header"><Activity size={16} /><h3>Onboarding Pipeline Trend (12 Months)</h3></div>
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={data.onboardingTrend} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="newApplications" fill="#4f46e5" name="New Applications" radius={[4, 4, 0, 0]} />
            <Bar dataKey="completed" fill="#047857" name="Completed" radius={[4, 4, 0, 0]} />
            <Bar dataKey="rejected" fill="#dc2626" name="Rejected" radius={[4, 4, 0, 0]} />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      {/* Onboarding stage visualization */}
      <Card className="sa-chart-card">
        <div className="sa-chart-header"><Network size={16} /><h3>Onboarding Stage Distribution</h3></div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={Object.entries(ONBOARDING_LABELS).map(([k, v]) => ({
            stage: k, label: v, count: data.apps.filter(a => a.stage === k).length,
            color: ONBOARDING_COLORS[k as OnboardingStage],
          }))} margin={{ top: 10, right: 10, bottom: 30, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" height={50} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {Object.entries(ONBOARDING_LABELS).map(([k, v], idx) => (
                <Cell key={idx} fill={ONBOARDING_COLORS[k as OnboardingStage]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Applications table */}
      <div className="sa-table-wrap">
        <table className="sa-table">
          <thead>
            <tr>
              <th>App Code</th>
              <th>Supplier</th>
              <th>Stage</th>
              <th>Progress</th>
              <th>Days in Pipeline</th>
              <th>Sponsor</th>
              <th>Docs</th>
              <th>Questionnaire</th>
              <th>Site Audit</th>
              <th>Risk Score</th>
              <th>Risk Level</th>
              <th>Decision</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.apps.map(a => (
              <tr key={a.id} className={cn(
                a.approvalDecision === 'rejected' && 'sa-row-danger',
                a.stage === 'completed' && 'sa-row-success',
                a.riskLevel === 'critical' && 'sa-row-danger',
                a.riskLevel === 'high' && 'sa-row-warning',
              )}>
                <td><span className="sa-code-pill">{a.applicationCode}</span></td>
                <td className="sa-cell-title">{a.supplierName}</td>
                <td><span className="sa-pill" style={{ background: ONBOARDING_COLORS[a.stage] + '20', color: ONBOARDING_COLORS[a.stage] }}>{ONBOARDING_LABELS[a.stage]}</span></td>
                <td>
                  <div className="sa-progress-mini">
                    <div className="sa-progress-mini-bar">
                      <div style={{ width: `${a.stageProgress}%`, background: ONBOARDING_COLORS[a.stage], height: '100%', borderRadius: 3 }} />
                    </div>
                    <span>{a.stageProgress}%</span>
                  </div>
                </td>
                <td className="sa-cell-compact">{a.daysInPipeline}d</td>
                <td className="sa-cell-compact">{a.sponsorName}<br /><span style={{ fontSize: 11, color: '#64748b' }}>{a.sponsorDepartment}</span></td>
                <td className="sa-cell-compact">{a.documentsApproved}/{a.documentsRequired}</td>
                <td className="sa-cell-compact">{a.questionnaireScore !== null ? <span className="sa-pill sa-pill-info">{a.questionnaireScore}</span> : (a.questionnaireSent ? '⏳' : '—')}</td>
                <td className="sa-cell-compact">{a.siteAuditScore !== null ? <span className="sa-pill sa-pill-info">{a.siteAuditScore}</span> : (a.siteAuditScheduled ? '⏳' : '—')}</td>
                <td className="sa-cell-compact">{a.riskAssessmentScore ?? '—'}</td>
                <td><span className="sa-pill" style={{ background: RISK_COLORS[a.riskLevel] + '20', color: RISK_COLORS[a.riskLevel] }}>{RISK_LABELS[a.riskLevel]}</span></td>
                <td><span className={cn('sa-pill', a.approvalDecision === 'approved' && 'sa-pill-success', a.approvalDecision === 'rejected' && 'sa-pill-danger', a.approvalDecision === 'conditional' && 'sa-pill-warning')}>{a.approvalDecision}</span></td>
                <td>
                  <Button variant="ghost" size="sm" onClick={() => setDetailModal({ type: 'onboarding', id: a.id })}>
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
// Tab: Audit Schedules
// ============================================================================
function AuditsTab({
  data, search, setSearch, filterAuditStatus, setFilterAuditStatus, setDetailModal,
}: {
  data: ApiResponse;
  search: string;
  setSearch: (s: string) => void;
  filterAuditStatus: string;
  setFilterAuditStatus: (s: string) => void;
  setDetailModal: (m: { type: string; id: string } | null) => void;
}) {
  const filtered = useMemo(() => {
    return data.audits.filter(a => {
      if (search && !a.supplierName.toLowerCase().includes(search.toLowerCase()) && !a.auditCode.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterAuditStatus !== 'all' && a.status !== filterAuditStatus) return false;
      return true;
    });
  }, [data.audits, search, filterAuditStatus]);

  return (
    <div className="sa-tab-pane">
      {/* Charts row */}
      <div className="sa-charts-row">
        <Card className="sa-chart-card">
          <div className="sa-chart-header"><BarChart3 size={16} /><h3>Audits by Type</h3></div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={data.auditsByType} dataKey="count" nameKey="label" cx="50%" cy="50%" outerRadius={80} label>
                {data.auditsByType.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card className="sa-chart-card">
          <div className="sa-chart-header"><BarChart3 size={16} /><h3>Audits by Status</h3></div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.auditsByStatus} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {data.auditsByStatus.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="sa-chart-card">
          <div className="sa-chart-header"><BarChart3 size={16} /><h3>Audits by Outcome</h3></div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.auditsByOutcome} layout="vertical" margin={{ top: 10, right: 10, bottom: 0, left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="label" tick={{ fontSize: 10 }} width={100} />
              <Tooltip />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {data.auditsByOutcome.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Audit trend */}
      <Card className="sa-chart-card sa-trend-card">
        <div className="sa-chart-header"><Activity size={16} /><h3>Audit Activity & Score Trend (12 Months)</h3></div>
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={data.auditTrend} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} domain={[0, 100]} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar yAxisId="left" dataKey="scheduled" fill="#4f46e5" name="Scheduled" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="left" dataKey="completed" fill="#0891b2" name="Completed" radius={[4, 4, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="avgScore" stroke="#047857" strokeWidth={2} name="Avg Score" dot={{ r: 3 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      {/* Filters */}
      <div className="sa-filter-bar">
        <div className="sa-search-wrapper">
          <Search size={14} />
          <Input
            placeholder="Search by supplier or audit code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sa-search-input"
          />
        </div>
        <select className="sa-select" value={filterAuditStatus} onChange={(e) => setFilterAuditStatus(e.target.value)}>
          <option value="all">All Statuses</option>
          {Object.entries(AUDIT_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <span className="sa-result-count">{filtered.length} audits</span>
      </div>

      {/* Audits table */}
      <div className="sa-table-wrap">
        <table className="sa-table">
          <thead>
            <tr>
              <th>Audit Code</th>
              <th>Supplier</th>
              <th>Type</th>
              <th>Status</th>
              <th>Scheduled</th>
              <th>Days to Audit</th>
              <th>Duration</th>
              <th>Lead Auditor</th>
              <th>Team</th>
              <th>Location</th>
              <th>Score</th>
              <th>Outcome</th>
              <th>Findings</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 50).map(a => (
              <tr key={a.id} className={cn(
                a.status === 'cancelled' && 'sa-row-danger',
                a.outcome === 'fail' && 'sa-row-danger',
                a.outcome === 'major_nonconformities' && 'sa-row-warning',
                a.status === 'in_progress' && 'sa-row-warning',
              )}>
                <td><span className="sa-code-pill">{a.auditCode}</span></td>
                <td className="sa-cell-title">{a.supplierName}</td>
                <td><span className="sa-pill" style={{ background: AUDIT_TYPE_COLORS[a.auditType] + '20', color: AUDIT_TYPE_COLORS[a.auditType] }}>{AUDIT_TYPE_LABELS[a.auditType]}</span></td>
                <td><span className="sa-pill" style={{ background: AUDIT_STATUS_COLORS[a.status] + '20', color: AUDIT_STATUS_COLORS[a.status] }}>{AUDIT_STATUS_LABELS[a.status]}</span></td>
                <td className="sa-cell-compact">{fmtDate(a.scheduledDate)}</td>
                <td className="sa-cell-compact">{a.daysToAudit > 0 ? `in ${a.daysToAudit}d` : a.daysToAudit < 0 ? `${Math.abs(a.daysToAudit)}d ago` : 'Today'}</td>
                <td className="sa-cell-compact">{a.durationDays}d</td>
                <td className="sa-cell-compact">{a.leadAuditor.split('(')[0]}</td>
                <td className="sa-cell-compact">{a.auditTeamSize}</td>
                <td className="sa-cell-compact">{a.auditLocation.replace('_', '-')}</td>
                <td className="sa-cell-compact">
                  {a.score !== null ? (
                    <span className={cn('sa-roi-pill', a.score >= 85 && 'sa-roi-positive', a.score < 70 && 'sa-roi-negative')}>{a.score}</span>
                  ) : '—'}
                </td>
                <td>{a.outcome ? <span className="sa-pill" style={{ background: AUDIT_OUTCOME_COLORS[a.outcome] + '20', color: AUDIT_OUTCOME_COLORS[a.outcome] }}>{AUDIT_OUTCOME_LABELS[a.outcome]}</span> : '—'}</td>
                <td className="sa-cell-compact">
                  {a.findingsCount > 0 ? (
                    <span className={cn('sa-pill', a.criticalFindings > 0 && 'sa-pill-danger', a.majorFindings > 0 && 'sa-pill-warning')}>
                      {a.findingsCount} ({a.criticalFindings}C/{a.majorFindings}M/{a.minorFindings}m)
                    </span>
                  ) : '—'}
                </td>
                <td>
                  <Button variant="ghost" size="sm" onClick={() => setDetailModal({ type: 'audit', id: a.id })}>
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
// Tab: Findings
// ============================================================================
function FindingsTab({
  data, search, setSearch, filterFindingSeverity, setFilterFindingSeverity,
  filterFindingStatus, setFilterFindingStatus, setDetailModal,
}: {
  data: ApiResponse;
  search: string;
  setSearch: (s: string) => void;
  filterFindingSeverity: string;
  setFilterFindingSeverity: (s: string) => void;
  filterFindingStatus: string;
  setFilterFindingStatus: (s: string) => void;
  setDetailModal: (m: { type: string; id: string } | null) => void;
}) {
  const filtered = useMemo(() => {
    return data.findings.filter(f => {
      if (search && !f.supplierName.toLowerCase().includes(search.toLowerCase()) && !f.findingCode.toLowerCase().includes(search.toLowerCase()) && !f.description.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterFindingSeverity !== 'all' && f.severity !== filterFindingSeverity) return false;
      if (filterFindingStatus !== 'all' && f.status !== filterFindingStatus) return false;
      return true;
    });
  }, [data.findings, search, filterFindingSeverity, filterFindingStatus]);

  return (
    <div className="sa-tab-pane">
      {/* Charts */}
      <div className="sa-charts-row">
        <Card className="sa-chart-card">
          <div className="sa-chart-header"><BarChart3 size={16} /><h3>Findings by Severity</h3></div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.findingsBySeverity} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="count" name="Total" fill="#94a3b8" radius={[4, 4, 0, 0]}>
                {data.findingsBySeverity.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Bar>
              <Bar dataKey="open" name="Open" fill="#dc2626" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="sa-chart-card">
          <div className="sa-chart-header"><BarChart3 size={16} /><h3>Findings by Status</h3></div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={data.findingsByStatus} dataKey="count" nameKey="label" cx="50%" cy="50%" outerRadius={80} label>
                {data.findingsByStatus.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card className="sa-chart-card">
          <div className="sa-chart-header"><BarChart3 size={16} /><h3>Findings by Category</h3></div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.findingsByCategory} layout="vertical" margin={{ top: 10, right: 10, bottom: 0, left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="label" tick={{ fontSize: 10 }} width={100} />
              <Tooltip />
              <Bar dataKey="count" name="Total" fill="#4f46e5" radius={[0, 4, 4, 0]} />
              <Bar dataKey="open" name="Open" fill="#dc2626" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Filters */}
      <div className="sa-filter-bar">
        <div className="sa-search-wrapper">
          <Search size={14} />
          <Input
            placeholder="Search by supplier, finding code, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sa-search-input"
          />
        </div>
        <select className="sa-select" value={filterFindingSeverity} onChange={(e) => setFilterFindingSeverity(e.target.value)}>
          <option value="all">All Severities</option>
          {Object.entries(FINDING_SEVERITY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select className="sa-select" value={filterFindingStatus} onChange={(e) => setFilterFindingStatus(e.target.value)}>
          <option value="all">All Statuses</option>
          {Object.entries(FINDING_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <span className="sa-result-count">{filtered.length} findings</span>
      </div>

      {/* Findings table */}
      <div className="sa-table-wrap">
        <table className="sa-table">
          <thead>
            <tr>
              <th>Finding Code</th>
              <th>Supplier</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Category</th>
              <th>Clause</th>
              <th>Description</th>
              <th>Identified</th>
              <th>Due Date</th>
              <th>Days to Due</th>
              <th>Owner</th>
              <th>CAPA</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 50).map(f => (
              <tr key={f.id} className={cn(
                f.severity === 'critical' && f.status !== 'closed' && 'sa-row-danger',
                f.status === 'overdue' && 'sa-row-danger',
                f.severity === 'major' && f.status !== 'closed' && 'sa-row-warning',
              )}>
                <td><span className="sa-code-pill">{f.findingCode}</span></td>
                <td className="sa-cell-title">{f.supplierName}</td>
                <td><span className="sa-pill" style={{ background: FINDING_SEVERITY_COLORS[f.severity] + '20', color: FINDING_SEVERITY_COLORS[f.severity] }}>{FINDING_SEVERITY_LABELS[f.severity]}</span></td>
                <td><span className="sa-pill" style={{ background: FINDING_STATUS_COLORS[f.status] + '20', color: FINDING_STATUS_COLORS[f.status] }}>{FINDING_STATUS_LABELS[f.status]}</span></td>
                <td className="sa-cell-compact">{f.category.replace('_', ' ')}</td>
                <td className="sa-cell-compact"><span className="sa-pill sa-pill-info">{f.clauseReference}</span></td>
                <td className="sa-cell-truncate" title={f.description}>{f.description}</td>
                <td className="sa-cell-compact">{fmtDate(f.identifiedDate)}</td>
                <td className="sa-cell-compact">{fmtDate(f.dueDate)}</td>
                <td className="sa-cell-compact">
                  <span className={cn('sa-pill', f.daysToDue < 0 && f.status !== 'closed' && 'sa-pill-danger', f.daysToDue >= 0 && f.daysToDue <= 7 && f.status !== 'closed' && 'sa-pill-warning')}>
                    {f.status === 'closed' ? 'Closed' : fmtRelative(f.daysToDue)}
                  </span>
                </td>
                <td className="sa-cell-compact">{f.owner}</td>
                <td className="sa-cell-compact">{f.capapId ? <span className="sa-pill sa-pill-info">🔗 {f.capapId}</span> : '—'}</td>
                <td>
                  <Button variant="ghost" size="sm" onClick={() => setDetailModal({ type: 'finding', id: f.id })}>
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
// Tab: First Article Inspection
// ============================================================================
function FAITab({
  data, search, setSearch, filterFAIStatus, setFilterFAIStatus, setDetailModal,
}: {
  data: ApiResponse;
  search: string;
  setSearch: (s: string) => void;
  filterFAIStatus: string;
  setFilterFAIStatus: (s: string) => void;
  setDetailModal: (m: { type: string; id: string } | null) => void;
}) {
  const filtered = useMemo(() => {
    return data.fais.filter(f => {
      if (search && !f.supplierName.toLowerCase().includes(search.toLowerCase()) && !f.faiCode.toLowerCase().includes(search.toLowerCase()) && !f.skuCode.toLowerCase().includes(search.toLowerCase()) && !f.skuDescription.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterFAIStatus !== 'all' && f.status !== filterFAIStatus) return false;
      return true;
    });
  }, [data.fais, search, filterFAIStatus]);

  return (
    <div className="sa-tab-pane">
      {/* Stats */}
      <div className="sa-stat-tiles">
        <div className="sa-stat-tile"><FileSearch size={16} /><div><div className="sa-stat-value">{data.kpis.faiPending + data.kpis.faiInProgress + data.kpis.faiPassed + data.kpis.faiFailed}</div><div className="sa-stat-label">Total FAIs</div></div></div>
        <div className="sa-stat-tile"><Clock size={16} /><div><div className="sa-stat-value">{data.kpis.faiPending + data.kpis.faiInProgress}</div><div className="sa-stat-label">In Process</div></div></div>
        <div className="sa-stat-tile"><CheckCircle2 size={16} /><div><div className="sa-stat-value">{data.kpis.faiPassed}</div><div className="sa-stat-label">Passed</div></div></div>
        <div className="sa-stat-tile"><XCircle size={16} /><div><div className="sa-stat-value">{data.kpis.faiFailed}</div><div className="sa-stat-label">Failed</div></div></div>
        <div className="sa-stat-tile"><Award size={16} /><div><div className="sa-stat-value">{data.kpis.faiPassRate}%</div><div className="sa-stat-label">Pass Rate</div></div></div>
      </div>

      {/* Chart */}
      <Card className="sa-chart-card sa-trend-card">
        <div className="sa-chart-header"><BarChart3 size={16} /><h3>FAI Status Distribution</h3></div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data.faiByStatus} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.faiByStatus.map((entry, idx) => (
                <Cell key={idx} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Filters */}
      <div className="sa-filter-bar">
        <div className="sa-search-wrapper">
          <Search size={14} />
          <Input
            placeholder="Search by supplier, FAI code, or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sa-search-input"
          />
        </div>
        <select className="sa-select" value={filterFAIStatus} onChange={(e) => setFilterFAIStatus(e.target.value)}>
          <option value="all">All Statuses</option>
          {Object.entries(FAI_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <span className="sa-result-count">{filtered.length} FAIs</span>
      </div>

      {/* FAI table */}
      <div className="sa-table-wrap">
        <table className="sa-table">
          <thead>
            <tr>
              <th>FAI Code</th>
              <th>Supplier</th>
              <th>SKU</th>
              <th>Description</th>
              <th>Status</th>
              <th>Requested</th>
              <th>Completed</th>
              <th>Days In Process</th>
              <th>Sample Size</th>
              <th>Inspector</th>
              <th>Deviations</th>
              <th>Result</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 50).map(f => (
              <tr key={f.id} className={cn(
                f.status === 'failed' && 'sa-row-danger',
                f.status === 'conditional' && 'sa-row-warning',
                f.status === 'passed' && 'sa-row-success',
                f.criticalDeviations > 0 && 'sa-row-danger',
              )}>
                <td><span className="sa-code-pill">{f.faiCode}</span></td>
                <td className="sa-cell-title">{f.supplierName}</td>
                <td className="sa-cell-compact"><span className="sa-pill sa-pill-info">{f.skuCode}</span></td>
                <td className="sa-cell-truncate" title={f.skuDescription}>{f.skuDescription}</td>
                <td><span className="sa-pill" style={{ background: FAI_STATUS_COLORS[f.status] + '20', color: FAI_STATUS_COLORS[f.status] }}>{FAI_STATUS_LABELS[f.status]}</span></td>
                <td className="sa-cell-compact">{fmtDate(f.requestDate)}</td>
                <td className="sa-cell-compact">{fmtDate(f.completedDate)}</td>
                <td className="sa-cell-compact">{f.daysInProcess}d</td>
                <td className="sa-cell-compact">{f.sampleSize}</td>
                <td className="sa-cell-compact">{f.inspector.split('(')[0]}</td>
                <td className="sa-cell-compact">
                  {f.deviationCount > 0 ? (
                    <span className={cn('sa-pill', f.criticalDeviations > 0 && 'sa-pill-danger')}>{f.deviationCount} ({f.criticalDeviations} critical)</span>
                  ) : '—'}
                </td>
                <td><span className="sa-pill" style={{ background: FAI_STATUS_COLORS[f.status] + '20', color: FAI_STATUS_COLORS[f.status] }}>{f.overallResult}</span></td>
                <td>
                  <Button variant="ghost" size="sm" onClick={() => setDetailModal({ type: 'fai', id: f.id })}>
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
// Tab: Self-Assessment
// ============================================================================
function SelfAssessmentTab({
  data, search, setSearch, filterSAStatus, setFilterSAStatus, setDetailModal,
}: {
  data: ApiResponse;
  search: string;
  setSearch: (s: string) => void;
  filterSAStatus: string;
  setFilterSAStatus: (s: string) => void;
  setDetailModal: (m: { type: string; id: string } | null) => void;
}) {
  const filtered = useMemo(() => {
    return data.assessments.filter(a => {
      if (search && !a.supplierName.toLowerCase().includes(search.toLowerCase()) && !a.assessmentCode.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterSAStatus !== 'all' && a.status !== filterSAStatus) return false;
      return true;
    });
  }, [data.assessments, search, filterSAStatus]);

  return (
    <div className="sa-tab-pane">
      {/* Stats */}
      <div className="sa-stat-tiles">
        <div className="sa-stat-tile"><ClipboardList size={16} /><div><div className="sa-stat-value">{data.assessments.length}</div><div className="sa-stat-label">Total Assessments</div></div></div>
        <div className="sa-stat-tile"><CheckCircle2 size={16} /><div><div className="sa-stat-value">{data.kpis.selfAssessmentSubmitted}</div><div className="sa-stat-label">Submitted</div></div></div>
        <div className="sa-stat-tile"><Award size={16} /><div><div className="sa-stat-value">{data.kpis.selfAssessmentResponseRate}%</div><div className="sa-stat-label">Response Rate</div></div></div>
        <div className="sa-stat-tile"><AlertOctagon size={16} /><div><div className="sa-stat-value">{data.kpis.selfAssessmentOverdue}</div><div className="sa-stat-label">Overdue</div></div></div>
        <div className="sa-stat-tile"><Gauge size={16} /><div><div className="sa-stat-value">{data.assessments.filter(a => a.overallScore !== null).length > 0 ? Math.round(data.assessments.filter(a => a.overallScore !== null).reduce((s, a) => s + (a.overallScore ?? 0), 0) / data.assessments.filter(a => a.overallScore !== null).length) : 0}</div><div className="sa-stat-label">Avg Score</div></div></div>
      </div>

      {/* Chart */}
      <Card className="sa-chart-card sa-trend-card">
        <div className="sa-chart-header"><BarChart3 size={16} /><h3>Self-Assessment Status Distribution</h3></div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data.selfAssessmentByStatus} margin={{ top: 10, right: 10, bottom: 30, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" height={50} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.selfAssessmentByStatus.map((entry, idx) => (
                <Cell key={idx} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Filters */}
      <div className="sa-filter-bar">
        <div className="sa-search-wrapper">
          <Search size={14} />
          <Input
            placeholder="Search by supplier or assessment code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sa-search-input"
          />
        </div>
        <select className="sa-select" value={filterSAStatus} onChange={(e) => setFilterSAStatus(e.target.value)}>
          <option value="all">All Statuses</option>
          {Object.entries(SA_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <span className="sa-result-count">{filtered.length} assessments</span>
      </div>

      {/* Assessments table */}
      <div className="sa-table-wrap">
        <table className="sa-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Supplier</th>
              <th>Status</th>
              <th>Sent</th>
              <th>Due</th>
              <th>Submitted</th>
              <th>Days to Due</th>
              <th>Quality</th>
              <th>Delivery</th>
              <th>Cost</th>
              <th>Sustain.</th>
              <th>Compliance</th>
              <th>Overall</th>
              <th>Δ vs Internal</th>
              <th>Attest.</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 50).map(a => (
              <tr key={a.id} className={cn(
                a.status === 'overdue' && 'sa-row-danger',
                a.status === 'reviewed' && 'sa-row-success',
              )}>
                <td><span className="sa-code-pill">{a.assessmentCode}</span></td>
                <td className="sa-cell-title">{a.supplierName}</td>
                <td><span className="sa-pill" style={{ background: SA_STATUS_COLORS[a.status] + '20', color: SA_STATUS_COLORS[a.status] }}>{SA_STATUS_LABELS[a.status]}</span></td>
                <td className="sa-cell-compact">{fmtDate(a.sentDate)}</td>
                <td className="sa-cell-compact">{fmtDate(a.dueDate)}</td>
                <td className="sa-cell-compact">{fmtDate(a.submittedDate)}</td>
                <td className="sa-cell-compact">
                  <span className={cn('sa-pill', a.daysToDue < 0 && a.status !== 'reviewed' && 'sa-pill-danger')}>
                    {a.status === 'reviewed' || a.status === 'submitted' ? '✓' : fmtRelative(a.daysToDue)}
                  </span>
                </td>
                <td className="sa-cell-compact">{a.qualityScore ?? '—'}</td>
                <td className="sa-cell-compact">{a.deliveryScore ?? '—'}</td>
                <td className="sa-cell-compact">{a.costScore ?? '—'}</td>
                <td className="sa-cell-compact">{a.sustainabilityScore ?? '—'}</td>
                <td className="sa-cell-compact">{a.complianceScore ?? '—'}</td>
                <td className="sa-cell-compact">{a.overallScore !== null ? <span className="sa-roi-pill sa-roi-positive">{a.overallScore}</span> : '—'}</td>
                <td className="sa-cell-compact">
                  {a.deviationFromInternal !== null ? (
                    <span className={cn('sa-pill', a.deviationFromInternal > 5 && 'sa-pill-warning', a.deviationFromInternal < -5 && 'sa-pill-info')}>
                      {a.deviationFromInternal > 0 ? '+' : ''}{a.deviationFromInternal}
                    </span>
                  ) : '—'}
                </td>
                <td className="sa-cell-compact">{a.attestationSigned ? <CheckCircle2 size={14} className="sa-icon-success" /> : <XCircle size={14} className="sa-icon-danger" />}</td>
                <td>
                  <Button variant="ghost" size="sm" onClick={() => setDetailModal({ type: 'self-assessment', id: a.id })}>
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
// Tab: Scorecards
// ============================================================================
function ScorecardsTab({ data, setDetailModal }: { data: ApiResponse; setDetailModal: (m: { type: string; id: string } | null) => void }) {
  const top10 = data.scorecards.slice(0, 10);
  const bottom10 = data.scorecards.slice(-10).reverse();

  return (
    <div className="sa-tab-pane">
      {/* Top 10 radar */}
      <Card className="sa-chart-card sa-trend-card">
        <div className="sa-chart-header"><Trophy size={16} /><h3>Top 10 Suppliers — Multi-Dimensional Score</h3></div>
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart data={top10.map(s => ({ supplier: s.supplierName.substring(0, 12), Quality: s.qualityScore, Delivery: s.deliveryScore, Cost: s.costScore, Audit: s.auditScore, Risk: s.riskScore }))}>
            <PolarGrid />
            <PolarAngleAxis dataKey="supplier" tick={{ fontSize: 10 }} />
            <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
            <Radar name="Quality" dataKey="Quality" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.3} />
            <Radar name="Delivery" dataKey="Delivery" stroke="#0891b2" fill="#0891b2" fillOpacity={0.3} />
            <Radar name="Audit" dataKey="Audit" stroke="#047857" fill="#047857" fillOpacity={0.3} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 11 }} />
          </RadarChart>
        </ResponsiveContainer>
      </Card>

      {/* Top 10 table */}
      <Card className="sa-spotlight-card">
        <div className="sa-chart-header"><Crown size={16} /><h3>Top 10 Suppliers (by Composite Score)</h3></div>
        <div className="sa-spotlight-list">
          {top10.map((s, i) => (
            <div key={s.supplierId} className="sa-spotlight-item">
              <div className={cn('sa-spotlight-rank', i === 0 && 'sa-spotlight-rank-gold', i === 1 && 'sa-spotlight-rank-silver', i === 2 && 'sa-spotlight-rank-bronze')}>#{i + 1}</div>
              <div className="sa-spotlight-content">
                <div className="sa-spotlight-title">{s.supplierName}</div>
                <div className="sa-spotlight-meta">
                  <span>{CATEGORY_LABELS[s.category]}</span>
                  <span>·</span>
                  <span>{TIER_LABELS[s.tier]}</span>
                  <span>·</span>
                  <span>Spend: {fmtINRCompact(s.annualSpendInr)}</span>
                  {s.trendVsLastQuarter !== 0 && (
                    <>
                      <span>·</span>
                      <span style={{ color: s.trendVsLastQuarter > 0 ? '#047857' : '#dc2626' }}>
                        {s.trendVsLastQuarter > 0 ? '▲' : '▼'} {Math.abs(s.trendVsLastQuarter)} pts
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="sa-spotlight-benefit">
                <div className="sa-spotlight-amount" style={{ color: '#4f46e5' }}>{s.compositeScore}</div>
                <div className="sa-spotlight-points">composite</div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setDetailModal({ type: 'supplier', id: s.supplierId })}>
                <Eye size={14} />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Bottom 10 — needs attention */}
      <Card className="sa-spotlight-card sa-spotlight-card-warning">
        <div className="sa-chart-header"><AlertTriangle size={16} /><h3>Bottom 10 Suppliers (Need Attention)</h3></div>
        <div className="sa-spotlight-list">
          {bottom10.map((s, i) => (
            <div key={s.supplierId} className="sa-spotlight-item">
              <div className="sa-spotlight-rank sa-spotlight-rank-warning">#{s.rank}</div>
              <div className="sa-spotlight-content">
                <div className="sa-spotlight-title">{s.supplierName}</div>
                <div className="sa-spotlight-meta">
                  <span>{CATEGORY_LABELS[s.category]}</span>
                  <span>·</span>
                  <span>{TIER_LABELS[s.tier]}</span>
                  <span>·</span>
                  <span>{APPROVAL_LABELS[s.approvalStatus]}</span>
                </div>
              </div>
              <div className="sa-spotlight-benefit">
                <div className="sa-spotlight-amount" style={{ color: '#dc2626' }}>{s.compositeScore}</div>
                <div className="sa-spotlight-points">composite</div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setDetailModal({ type: 'supplier', id: s.supplierId })}>
                <Eye size={14} />
              </Button>
            </div>
          ))}
        </div>
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
    <div className="sa-tab-pane">
      {/* Insights list */}
      <div className="sa-insights-list">
        {data.insights.map((ins, idx) => (
          <div key={idx} className={cn('sa-insight-row', `sa-insight-${ins.type}`)}>
            <div className="sa-insight-icon">
              {ins.type === 'danger' && <AlertOctagon size={20} />}
              {ins.type === 'warning' && <AlertTriangle size={20} />}
              {ins.type === 'success' && <CheckCircle2 size={20} />}
              {ins.type === 'info' && <Info size={20} />}
            </div>
            <div className="sa-insight-content">
              <div className="sa-insight-title">{ins.title}</div>
              <div className="sa-insight-description">{ins.description}</div>
              <div className="sa-insight-recommendation">
                <Lightbulb size={12} />
                <span>{ins.recommendation}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ISO 8.4 Health Scorecard */}
      <Card className="sa-health-card">
        <div className="sa-chart-header"><Gauge size={16} /><h3>ISO 9001:2015 §8.4 Health Scorecard</h3></div>
        <div className="sa-health-grid">
          <div className="sa-health-tile">
            <div className="sa-health-label">§8.4.1 Approved Suppliers</div>
            <div className="sa-health-value">{Math.round((k.approvedSuppliers / Math.max(k.activeSuppliers, 1)) * 100)}%</div>
            <div className="sa-health-bar"><div className="sa-health-fill" style={{ width: `${Math.round((k.approvedSuppliers / Math.max(k.activeSuppliers, 1)) * 100)}%`, background: k.approvedSuppliers / k.activeSuppliers >= 0.7 ? '#047857' : '#d97706' }} /></div>
            <div className="sa-health-target">Target: 80% ({k.approvedSuppliers}/{k.activeSuppliers})</div>
          </div>
          <div className="sa-health-tile">
            <div className="sa-health-label">§8.4.2 Audits Completed</div>
            <div className="sa-health-value">{Math.round((k.auditsCompletedThisYear / Math.max(k.auditsScheduledThisYear, 1)) * 100)}%</div>
            <div className="sa-health-bar"><div className="sa-health-fill" style={{ width: `${Math.round((k.auditsCompletedThisYear / Math.max(k.auditsScheduledThisYear, 1)) * 100)}%`, background: k.auditsCompletedThisYear / k.auditsScheduledThisYear >= 0.85 ? '#047857' : '#d97706' }} /></div>
            <div className="sa-health-target">Target: 90% ({k.auditsCompletedThisYear}/{k.auditsScheduledThisYear})</div>
          </div>
          <div className="sa-health-tile">
            <div className="sa-health-label">§8.4.3 Findings On-Time</div>
            <div className="sa-health-value">{k.openFindings > 0 ? Math.round(((k.openFindings - k.overdueFindings) / k.openFindings) * 100) : 100}%</div>
            <div className="sa-health-bar"><div className="sa-health-fill" style={{ width: `${k.openFindings > 0 ? Math.round(((k.openFindings - k.overdueFindings) / k.openFindings) * 100) : 100}%`, background: k.overdueFindings / Math.max(k.openFindings, 1) <= 0.2 ? '#047857' : '#dc2626' }} /></div>
            <div className="sa-health-target">Target: 85% ({k.openFindings - k.overdueFindings}/{k.openFindings})</div>
          </div>
          <div className="sa-health-tile sa-health-tile-overall">
            <div className="sa-health-label">Overall §8.4 Compliance</div>
            <div className="sa-health-value">{k.iso_8_4_compliance}%</div>
            <div className="sa-health-bar"><div className="sa-health-fill" style={{ width: `${k.iso_8_4_compliance}%`, background: k.iso_8_4_compliance >= 80 ? '#047857' : k.iso_8_4_compliance >= 60 ? '#d97706' : '#dc2626' }} /></div>
            <div className="sa-health-target">Target: 85%</div>
          </div>
          <div className="sa-health-tile sa-health-tile-effectiveness">
            <div className="sa-health-label">Composite Effectiveness</div>
            <div className="sa-health-value">{k.compositeEffectiveness}%</div>
            <div className="sa-health-bar"><div className="sa-health-fill" style={{ width: `${k.compositeEffectiveness}%`, background: k.compositeEffectiveness >= 75 ? '#047857' : k.compositeEffectiveness >= 50 ? '#d97706' : '#dc2626' }} /></div>
            <div className="sa-health-target">Target: 80%</div>
          </div>
          <div className="sa-health-tile">
            <div className="sa-health-label">FAI Pass Rate</div>
            <div className="sa-health-value">{k.faiPassRate}%</div>
            <div className="sa-health-bar"><div className="sa-health-fill" style={{ width: `${k.faiPassRate}%`, background: k.faiPassRate >= 80 ? '#047857' : k.faiPassRate >= 60 ? '#d97706' : '#dc2626' }} /></div>
            <div className="sa-health-target">Target: 85%</div>
          </div>
        </div>
      </Card>

      {/* Cross-module integration */}
      <Card className="sa-integration-card">
        <div className="sa-chart-header"><Network size={16} /><h3>Cross-Module Integration Summary</h3></div>
        <div className="sa-integration-grid">
          {data.crossModule.map((cm, idx) => (
            <div key={idx} className="sa-integration-tile" style={{ background: `linear-gradient(135deg, ${cm.color}10, ${cm.color}05)`, borderColor: cm.color + '30' }}>
              <div className="sa-integration-count" style={{ color: cm.color }}>{cm.linkedCount}</div>
              <div className="sa-integration-label">{cm.sourceLabel}</div>
              <div className="sa-integration-sublabel">{cm.sourceModule} · {cm.closedLoopRate}% closed-loop</div>
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
  const title = type === 'supplier' ? 'Supplier Details'
              : type === 'onboarding' ? 'Onboarding Application Details'
              : type === 'audit' ? 'Audit Schedule Details'
              : type === 'finding' ? 'Audit Finding Details'
              : type === 'fai' ? 'First Article Inspection Details'
              : type === 'self-assessment' ? 'Self-Assessment Details'
              : 'Details';

  const renderContent = () => {
    if (type === 'supplier') {
      const s = data.suppliers.find(x => x.id === id);
      if (!s) return <div>Supplier not found</div>;
      return (
        <>
          <div className="sa-modal-meta-grid">
            <div><strong>Code:</strong> {s.supplierCode}</div>
            <div><strong>Category:</strong> {CATEGORY_LABELS[s.category]}</div>
            <div><strong>Tier:</strong> {TIER_LABELS[s.tier]}</div>
            <div><strong>Approval:</strong> {APPROVAL_LABELS[s.approvalStatus]}</div>
            <div><strong>Risk Level:</strong> {RISK_LABELS[s.riskLevel]}</div>
            <div><strong>City:</strong> {s.city}, {s.state}, {s.country}</div>
            <div><strong>Contact:</strong> {s.contactName}</div>
            <div><strong>Email:</strong> {s.contactEmail}</div>
            <div><strong>Phone:</strong> {s.contactPhone}</div>
            <div><strong>GSTIN:</strong> {s.gstin}</div>
            <div><strong>PAN:</strong> {s.pan}</div>
            <div><strong>MSME:</strong> {s.msmeRegistered ? '✓ Registered' : '✗ Not Registered'}</div>
            <div><strong>ISO 9001:</strong> {s.iso9001Certified ? '✓ Certified' : '✗ Not Certified'}</div>
            <div><strong>ISO 14001:</strong> {s.iso14001Certified ? '✓ Certified' : '✗ Not Certified'}</div>
            <div><strong>ISO 45001:</strong> {s.iso45001Certified ? '✓ Certified' : '✗ Not Certified'}</div>
            <div><strong>IATF 16949:</strong> {s.iatf16949Certified ? '✓ Certified' : '✗ Not Certified'}</div>
            <div><strong>Onboarding Stage:</strong> {ONBOARDING_LABELS[s.onboardingStage]}</div>
            <div><strong>Onboarded:</strong> {fmtDate(s.onboardedDate)}</div>
            <div><strong>First PO:</strong> {fmtDate(s.firstPODate)}</div>
            <div><strong>Annual Spend:</strong> {fmtINR(s.annualSpendInr)}</div>
            <div><strong>Active SKUs:</strong> {s.activeSKUs}</div>
            <div><strong>Criticality Score:</strong> {s.criticalityScore}/100</div>
            <div><strong>Last Audit:</strong> {fmtDate(s.lastAuditDate)}</div>
            <div><strong>Last Audit Score:</strong> {s.lastAuditScore ?? '—'}</div>
            <div><strong>Next Audit Due:</strong> {fmtDate(s.nextAuditDue)}</div>
            <div><strong>Open Findings:</strong> {s.openFindings} ({s.overdueFindings} overdue)</div>
            <div><strong>FAI Pending:</strong> {s.faiPendingCount}</div>
            <div><strong>Self-Assessment Score:</strong> {s.selfAssessmentScore ?? '—'}</div>
            <div><strong>Composite Score:</strong> {s.compositeScore}/100</div>
          </div>
        </>
      );
    }
    if (type === 'onboarding') {
      const a = data.apps.find(x => x.id === id);
      if (!a) return <div>Application not found</div>;
      return (
        <>
          <div className="sa-modal-meta-grid">
            <div><strong>Code:</strong> {a.applicationCode}</div>
            <div><strong>Supplier:</strong> {a.supplierName}</div>
            <div><strong>Category:</strong> {CATEGORY_LABELS[a.category]}</div>
            <div><strong>Stage:</strong> {ONBOARDING_LABELS[a.stage]}</div>
            <div><strong>Progress:</strong> {a.stageProgress}%</div>
            <div><strong>Submitted:</strong> {fmtDate(a.submittedDate)}</div>
            <div><strong>Target Completion:</strong> {fmtDate(a.targetCompletionDate)}</div>
            <div><strong>Days in Pipeline:</strong> {a.daysInPipeline}</div>
            <div><strong>Sponsor:</strong> {a.sponsorName} ({a.sponsorDepartment})</div>
            <div><strong>Initiated By:</strong> {a.initiatedBy}</div>
            <div><strong>Procurement Manager:</strong> {a.procurementCategoryManager}</div>
            <div><strong>Documents:</strong> {a.documentsApproved}/{a.documentsReceived}/{a.documentsRequired} (Approved/Received/Required)</div>
            <div><strong>Questionnaire Sent:</strong> {a.questionnaireSent ? '✓' : '✗'}</div>
            <div><strong>Questionnaire Received:</strong> {a.questionnaireReceived ? '✓' : '✗'}</div>
            <div><strong>Questionnaire Score:</strong> {a.questionnaireScore ?? '—'}</div>
            <div><strong>Site Audit Scheduled:</strong> {a.siteAuditScheduled ? '✓' : '✗'}</div>
            <div><strong>Site Audit Date:</strong> {fmtDate(a.siteAuditDate)}</div>
            <div><strong>Site Audit Score:</strong> {a.siteAuditScore ?? '—'}</div>
            <div><strong>Approval Committee Review:</strong> {a.approvalCommitteeReview ? '✓' : '✗'}</div>
            <div><strong>Decision:</strong> {a.approvalDecision}</div>
            <div><strong>Risk Score:</strong> {a.riskAssessmentScore ?? '—'}</div>
            <div><strong>Risk Level:</strong> {RISK_LABELS[a.riskLevel]}</div>
          </div>
          {a.rejectionReason && (
            <div className="sa-modal-section">
              <h4>Rejection Reason</h4>
              <p className="sa-modal-risk">{a.rejectionReason}</p>
            </div>
          )}
          <div className="sa-modal-section">
            <h4>Notes</h4>
            <p>{a.notes}</p>
          </div>
        </>
      );
    }
    if (type === 'audit') {
      const a = data.audits.find(x => x.id === id);
      if (!a) return <div>Audit not found</div>;
      return (
        <>
          <div className="sa-modal-meta-grid">
            <div><strong>Code:</strong> {a.auditCode}</div>
            <div><strong>Supplier:</strong> {a.supplierName}</div>
            <div><strong>Type:</strong> {AUDIT_TYPE_LABELS[a.auditType]}</div>
            <div><strong>Status:</strong> {AUDIT_STATUS_LABELS[a.status]}</div>
            <div><strong>Scheduled:</strong> {fmtDate(a.scheduledDate)}</div>
            <div><strong>Completed:</strong> {fmtDate(a.completedDate)}</div>
            <div><strong>Duration:</strong> {a.durationDays} days</div>
            <div><strong>Lead Auditor:</strong> {a.leadAuditor}</div>
            <div><strong>Team Size:</strong> {a.auditTeamSize}</div>
            <div><strong>Location:</strong> {a.auditLocation.replace('_', '-')}</div>
            <div><strong>Facility:</strong> {a.facility}</div>
            <div><strong>Checklist Version:</strong> {a.checklistVersion}</div>
            <div><strong>Questions:</strong> {a.questionsCompleted}/{a.totalQuestions}</div>
            <div><strong>Outcome:</strong> {a.outcome ? AUDIT_OUTCOME_LABELS[a.outcome] : '—'}</div>
            <div><strong>Score:</strong> {a.score ?? '—'}</div>
            <div><strong>Findings:</strong> {a.findingsCount} ({a.criticalFindings}C/{a.majorFindings}M/{a.minorFindings}m/{a.observations}O)</div>
            <div><strong>CAPAs Linked:</strong> {a.capasLinked}</div>
            <div><strong>Next Audit:</strong> {fmtDate(a.nextAuditDate)}</div>
          </div>
          <div className="sa-modal-section">
            <h4>Audit Scope</h4>
            <p>{a.auditScope}</p>
          </div>
          {a.reportPath && (
            <div className="sa-modal-section">
              <h4>Report</h4>
              <p><ExternalLink size={12} /> {a.reportPath}</p>
            </div>
          )}
        </>
      );
    }
    if (type === 'finding') {
      const f = data.findings.find(x => x.id === id);
      if (!f) return <div>Finding not found</div>;
      return (
        <>
          <div className="sa-modal-meta-grid">
            <div><strong>Code:</strong> {f.findingCode}</div>
            <div><strong>Audit:</strong> {f.auditCode}</div>
            <div><strong>Supplier:</strong> {f.supplierName}</div>
            <div><strong>Severity:</strong> {FINDING_SEVERITY_LABELS[f.severity]}</div>
            <div><strong>Status:</strong> {FINDING_STATUS_LABELS[f.status]}</div>
            <div><strong>Category:</strong> {f.category.replace('_', ' ')}</div>
            <div><strong>Clause:</strong> {f.clauseReference}</div>
            <div><strong>Identified:</strong> {fmtDate(f.identifiedDate)}</div>
            <div><strong>Due Date:</strong> {fmtDate(f.dueDate)}</div>
            <div><strong>Days to Due:</strong> {fmtRelative(f.daysToDue)}</div>
            <div><strong>Closed:</strong> {fmtDate(f.closedDate)}</div>
            <div><strong>Owner:</strong> {f.owner}</div>
            <div><strong>CAPA ID:</strong> {f.capapId ?? '—'}</div>
            <div><strong>Verification Method:</strong> {f.verificationMethod ? f.verificationMethod.replace('_', ' ') : '—'}</div>
            <div><strong>Verified By:</strong> {f.verifiedBy ?? '—'}</div>
          </div>
          <div className="sa-modal-section">
            <h4>Description</h4>
            <p>{f.description}</p>
          </div>
          {f.rootCause && (
            <div className="sa-modal-section">
              <h4>Root Cause</h4>
              <p>{f.rootCause}</p>
            </div>
          )}
          {f.correctiveAction && (
            <div className="sa-modal-section">
              <h4>Corrective Action</h4>
              <p className="sa-modal-action-corrective">{f.correctiveAction}</p>
            </div>
          )}
          {f.preventiveAction && (
            <div className="sa-modal-section">
              <h4>Preventive Action</h4>
              <p className="sa-modal-action-preventive">{f.preventiveAction}</p>
            </div>
          )}
        </>
      );
    }
    if (type === 'fai') {
      const f = data.fais.find(x => x.id === id);
      if (!f) return <div>FAI not found</div>;
      return (
        <>
          <div className="sa-modal-meta-grid">
            <div><strong>Code:</strong> {f.faiCode}</div>
            <div><strong>Supplier:</strong> {f.supplierName}</div>
            <div><strong>SKU:</strong> {f.skuCode}</div>
            <div><strong>Description:</strong> {f.skuDescription}</div>
            <div><strong>Category:</strong> {CATEGORY_LABELS[f.category]}</div>
            <div><strong>Status:</strong> {FAI_STATUS_LABELS[f.status]}</div>
            <div><strong>Requested:</strong> {fmtDate(f.requestDate)}</div>
            <div><strong>Received:</strong> {fmtDate(f.receivedDate)}</div>
            <div><strong>Inspection:</strong> {fmtDate(f.inspectionDate)}</div>
            <div><strong>Completed:</strong> {fmtDate(f.completedDate)}</div>
            <div><strong>Days in Process:</strong> {f.daysInProcess}d</div>
            <div><strong>Inspector:</strong> {f.inspector}</div>
            <div><strong>Location:</strong> {f.inspectionLocation}</div>
            <div><strong>Sample Size:</strong> {f.sampleSize}</div>
            <div><strong>Drawing Rev:</strong> {f.drawingRev}</div>
            <div><strong>Specification Rev:</strong> {f.specificationRev}</div>
            <div><strong>Deviations:</strong> {f.deviationCount} ({f.criticalDeviations} critical)</div>
            <div><strong>Approved By:</strong> {f.approvedBy ?? '—'}</div>
          </div>
          <div className="sa-modal-section">
            <h4>Inspection Results</h4>
            <div className="sa-modal-stat-row">
              <div className="sa-modal-stat-tile"><div className="sa-modal-stat-label">Dimensional</div><div className="sa-modal-stat-value">{f.dimensionalInspection.replace('_', ' ')}</div></div>
              <div className="sa-modal-stat-tile"><div className="sa-modal-stat-label">Material Cert</div><div className="sa-modal-stat-value">{f.materialCertification}</div></div>
              <div className="sa-modal-stat-tile"><div className="sa-modal-stat-label">Functional Test</div><div className="sa-modal-stat-value">{f.functionalTest.replace('_', ' ')}</div></div>
              <div className="sa-modal-stat-tile"><div className="sa-modal-stat-label">Visual</div><div className="sa-modal-stat-value">{f.visualInspection}</div></div>
              <div className="sa-modal-stat-tile"><div className="sa-modal-stat-label">Packaging</div><div className="sa-modal-stat-value">{f.packagingInspection}</div></div>
              <div className="sa-modal-stat-tile"><div className="sa-modal-stat-label">Documentation</div><div className="sa-modal-stat-value">{f.documentationReview}</div></div>
              <div className="sa-modal-stat-tile"><div className="sa-modal-stat-label">Overall Result</div><div className="sa-modal-stat-value" style={{ color: f.overallResult === 'passed' ? '#047857' : f.overallResult === 'failed' ? '#dc2626' : '#475569' }}>{f.overallResult}</div></div>
            </div>
          </div>
          <div className="sa-modal-section">
            <h4>Next Action</h4>
            <p>{f.nextAction}</p>
          </div>
        </>
      );
    }
    if (type === 'self-assessment') {
      const a = data.assessments.find(x => x.id === id);
      if (!a) return <div>Assessment not found</div>;
      return (
        <>
          <div className="sa-modal-meta-grid">
            <div><strong>Code:</strong> {a.assessmentCode}</div>
            <div><strong>Supplier:</strong> {a.supplierName}</div>
            <div><strong>Status:</strong> {SA_STATUS_LABELS[a.status]}</div>
            <div><strong>Sent:</strong> {fmtDate(a.sentDate)}</div>
            <div><strong>Due:</strong> {fmtDate(a.dueDate)}</div>
            <div><strong>Submitted:</strong> {fmtDate(a.submittedDate)}</div>
            <div><strong>Days to Due:</strong> {fmtRelative(a.daysToDue)}</div>
            <div><strong>Reviewer:</strong> {a.reviewer ?? '—'}</div>
            <div><strong>Review Date:</strong> {fmtDate(a.reviewDate)}</div>
            <div><strong>Attestation Signed:</strong> {a.attestationSigned ? '✓ Yes' : '✗ No'}</div>
            <div><strong>Attachments:</strong> {a.attachmentsUploaded}</div>
          </div>
          {a.overallScore !== null && (
            <div className="sa-modal-section">
              <h4>Scores (5 Dimensions)</h4>
              <div className="sa-modal-stat-row">
                <div className="sa-modal-stat-tile"><div className="sa-modal-stat-label">Quality</div><div className="sa-modal-stat-value">{a.qualityScore}</div></div>
                <div className="sa-modal-stat-tile"><div className="sa-modal-stat-label">Delivery</div><div className="sa-modal-stat-value">{a.deliveryScore}</div></div>
                <div className="sa-modal-stat-tile"><div className="sa-modal-stat-label">Cost</div><div className="sa-modal-stat-value">{a.costScore}</div></div>
                <div className="sa-modal-stat-tile"><div className="sa-modal-stat-label">Sustainability</div><div className="sa-modal-stat-value">{a.sustainabilityScore}</div></div>
                <div className="sa-modal-stat-tile"><div className="sa-modal-stat-label">Compliance</div><div className="sa-modal-stat-value">{a.complianceScore}</div></div>
                <div className="sa-modal-stat-tile"><div className="sa-modal-stat-label">Overall</div><div className="sa-modal-stat-value" style={{ color: '#4f46e5' }}>{a.overallScore}</div></div>
                <div className="sa-modal-stat-tile"><div className="sa-modal-stat-label">Δ vs Internal</div><div className="sa-modal-stat-value" style={{ color: (a.deviationFromInternal ?? 0) > 5 ? '#d97706' : (a.deviationFromInternal ?? 0) < -5 ? '#0891b2' : '#047857' }}>{a.deviationFromInternal !== null ? `${a.deviationFromInternal > 0 ? '+' : ''}${a.deviationFromInternal}` : '—'}</div></div>
              </div>
            </div>
          )}
          <div className="sa-modal-section">
            <h4>Notes</h4>
            <p>{a.notes}</p>
          </div>
        </>
      );
    }
    return <div>Unknown detail type</div>;
  };

  return (
    <div className="sa-modal-overlay" onClick={onClose}>
      <div className="sa-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="sa-modal-header">
          <h2>{title}</h2>
          <div className="sa-modal-actions">
            <Button variant="outline" size="sm" onClick={() => onToast({ title: 'Detail exported', description: 'Detail data exported to CSV (mock)', variant: 'success' })}>
              <FileText size={14} /> Export
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X size={16} />
            </Button>
          </div>
        </div>
        <div className="sa-modal-body">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
