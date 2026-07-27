// R110: Continual Improvement Program (ISO 9001:2015 §10.3)
// New module — Continual Improvement orchestrates the organization-wide
// improvement lifecycle:
//  1. Improvement Project Portfolio: chartered CIP projects with phases & gates
//  2. Kaizen Suggestion System: employee suggestions (submission → triage → impl)
//  3. PDSA Cycle Tracking: Plan-Do-Study-Act per project with iteration history
//  4. ROI Measurement: financial impact (cost savings, revenue lift, cost avoidance)
//  5. Best Practice Sharing: knowledge base of validated practices (with replication)
//  6. Cross-Module Improvement Linkage: audit-driven, CAPA-driven, doc-driven,
//     training-driven, customer-feedback-driven improvement tracking
//  7. ISO 9001:2015 §10.3 Compliance: improvement effectiveness + suitability +
//     adequacy sub-scores
//  8. Insights: auto-generated from data with severity-tiered recommendations

import { NextResponse } from 'next/server';
import { warehouses as mockWarehouses } from '@/data/mock-data';

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const TODAY = new Date();

function seededRand(seed: number): number {
  const x = Math.sin(seed * 9999.7) * 10000;
  return x - Math.floor(x);
}
function pick<T>(arr: T[], seed: number): T {
  return arr[Math.floor(seededRand(seed) * arr.length) % arr.length];
}
function randInt(min: number, max: number, seed: number): number {
  return Math.floor(min + seededRand(seed) * (max - min + 1));
}
function daysAgo(days: number): Date {
  return new Date(TODAY.getTime() - days * MS_PER_DAY);
}
function daysAhead(days: number): Date {
  return new Date(TODAY.getTime() + days * MS_PER_DAY);
}

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------
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
  id: string;
  projectCode: string;
  title: string;
  description: string;
  category: ProjectCategory;
  methodology: ProjectMethodology;
  priority: ProjectPriority;
  phase: ProjectPhase;
  status: ProjectStatus;
  sponsor: string;
  sponsorRole: string;
  projectLead: string;
  teamMembers: number;
  warehouseCode: string;
  department: string;
  startDate: string;
  targetEndDate: string;
  actualEndDate: string | null;
  percentComplete: number;
  daysToTarget: number;
  estimatedCostInr: number;
  actualCostInr: number;
  estimatedBenefitInr: number;
  realizedBenefitInr: number;
  roiPercent: number;
  linkedAuditFinding: string | null;
  linkedCapaId: string | null;
  linkedDocNumber: string | null;
  linkedTrainingId: string | null;
  linkedSuggestionId: string | null;
  successCriteria: string;
  keyRisks: string;
}

interface KaizenSuggestion {
  id: string;
  suggestionCode: string;
  title: string;
  description: string;
  submittedBy: string;
  submittedByRole: string;
  submittedByDepartment: string;
  warehouseCode: string;
  submittedDate: string;
  category: SuggestionCategory;
  impact: SuggestionImpact;
  status: SuggestionStatus;
  estimatedBenefitInr: number;
  actualBenefitInr: number;
  implementationDays: number;
  reviewedBy: string;
  reviewedDate: string | null;
  implementedDate: string | null;
  linkedProjectId: string | null;
  upvotes: number;
  comments: number;
  recognitionPoints: number;
}

interface PDSACycle {
  id: string;
  projectId: string;
  projectTitle: string;
  cycleNumber: number;
  stage: PDSAStage;
  hypothesis: string;
  planActions: string;
  planOwner: string;
  planTargetDate: string;
  doActions: string;
  doOwner: string;
  doStartDate: string;
  doEndDate: string | null;
  studyFindings: string;
  studyOwner: string;
  studyDate: string | null;
  studyOutcome: 'validated' | 'invalidated' | 'partial' | 'inconclusive';
  actDecision: 'standardize' | 'iterate' | 'abandon' | 'pilot_extension';
  actActions: string;
  actOwner: string;
  actDate: string | null;
  metricsBaseline: number;
  metricsTarget: number;
  metricsActual: number;
  metricsImprovementPct: number;
  iterationCount: number;
}

interface ROIMeasurement {
  id: string;
  projectId: string;
  projectTitle: string;
  category: ProjectCategory;
  costSavedInr: number;
  revenueLiftInr: number;
  costAvoidedInr: number;
  productivityGainPct: number;
  cycleTimeReductionPct: number;
  defectReductionPct: number;
  customerSatisfactionLift: number;
  totalInvestmentInr: number;
  totalBenefitInr: number;
  netBenefitInr: number;
  roiPercent: number;
  paybackMonths: number;
  npvInr: number;
  irrPercent: number;
  measurementPeriod: string;
  measurementDate: string;
  verified: boolean;
  verifiedBy: string;
}

interface BestPractice {
  id: string;
  practiceCode: string;
  title: string;
  description: string;
  category: ProjectCategory;
  originWarehouseCode: string;
  originProjectId: string;
  maturity: BestPracticeMaturity;
  replicatedTo: string[];
  replicationCount: number;
  documentedDate: string;
  lastUpdated: string;
  documentedBy: string;
  approvalStatus: 'draft' | 'in_review' | 'approved' | 'deprecated';
  sopReference: string | null;
  trainingRequired: boolean;
  linkedDocNumber: string | null;
  impactSummary: string;
  estimatedSavingsPerSiteInr: number;
  totalEstimatedSavingsInr: number;
}

interface CrossModuleLink {
  sourceModule: string;
  sourceLabel: string;
  improvementCount: number;
  closedLoopCount: number;
  closedLoopRate: number;
  pendingActionCount: number;
  totalBenefitInr: number;
  color: string;
}

// ----------------------------------------------------------------------------
// Constants metadata
// ----------------------------------------------------------------------------
const CATEGORY_META: Record<ProjectCategory, { label: string; color: string; bg: string; icon: string }> = {
  process_efficiency:    { label: 'Process Efficiency',       color: '#4f46e5', bg: '#e0e7ff', icon: 'Workflow' },
  cost_reduction:        { label: 'Cost Reduction',           color: '#0891b2', bg: '#cffafe', icon: 'Coins' },
  quality_enhancement:   { label: 'Quality Enhancement',      color: '#047857', bg: '#d1fae5', icon: 'ShieldCheck' },
  safety_improvement:    { label: 'Safety Improvement',       color: '#dc2626', bg: '#fee2e2', icon: 'HardHat' },
  customer_experience:   { label: 'Customer Experience',      color: '#7c3aed', bg: '#ede9fe', icon: 'HeartHandshake' },
  sustainability:        { label: 'Sustainability',           color: '#15803d', bg: '#dcfce7', icon: 'Leaf' },
  digital_transformation:{ label: 'Digital Transformation',   color: '#be185d', bg: '#fce7f3', icon: 'Cpu' },
  compliance:            { label: 'Compliance',               color: '#9333ea', bg: '#f3e8ff', icon: 'Scale' },
};

const METHODOLOGY_META: Record<ProjectMethodology, { label: string; color: string; description: string }> = {
  pdsa:        { label: 'PDSA',          color: '#4f46e5', description: 'Plan-Do-Study-Act iterative cycle' },
  dmaic:       { label: 'DMAIC',         color: '#0891b2', description: 'Define-Measure-Analyze-Improve-Control (Six Sigma)' },
  lean:        { label: 'Lean',          color: '#047857', description: 'Waste elimination & value stream optimization' },
  six_sigma:   { label: 'Six Sigma',     color: '#7c3aed', description: 'DMAIC + statistical tools for defect reduction' },
  kaizen_blitz:{ label: 'Kaizen Blitz',  color: '#ea580c', description: 'Rapid 3-5 day focused improvement event' },
  tocef:       { label: 'TOC/TOC-IF',    color: '#c2410c', description: 'Theory of Constraints + Intermediate Future' },
  agile:       { label: 'Agile',         color: '#be185d', description: 'Iterative sprints with continuous feedback' },
};

const PRIORITY_META: Record<ProjectPriority, { label: string; color: string; bg: string }> = {
  critical: { label: 'Critical', color: '#dc2626', bg: '#fee2e2' },
  high:     { label: 'High',     color: '#ea580c', bg: '#fed7aa' },
  medium:   { label: 'Medium',   color: '#d97706', bg: '#fef3c7' },
  low:      { label: 'Low',      color: '#0891b2', bg: '#cffafe' },
};

const PHASE_META: Record<ProjectPhase, { label: string; color: string; order: number }> = {
  charter: { label: 'Charter',  color: '#6b7280', order: 0 },
  plan:    { label: 'Plan',     color: '#4f46e5', order: 1 },
  do:      { label: 'Do',       color: '#0891b2', order: 2 },
  study:   { label: 'Study',    color: '#d97706', order: 3 },
  act:     { label: 'Act',      color: '#7c3aed', order: 4 },
  closed:  { label: 'Closed',   color: '#047857', order: 5 },
};

const STATUS_META: Record<ProjectStatus, { label: string; color: string; bg: string }> = {
  on_track:  { label: 'On Track',  color: '#047857', bg: '#d1fae5' },
  at_risk:   { label: 'At Risk',   color: '#d97706', bg: '#fef3c7' },
  delayed:   { label: 'Delayed',   color: '#dc2626', bg: '#fee2e2' },
  completed: { label: 'Completed', color: '#0891b2', bg: '#cffafe' },
  cancelled: { label: 'Cancelled', color: '#7c2d12', bg: '#fed7aa' },
  on_hold:   { label: 'On Hold',   color: '#6b7280', bg: '#f3f4f6' },
};

const SUGGESTION_STATUS_META: Record<SuggestionStatus, { label: string; color: string; bg: string }> = {
  submitted:     { label: 'Submitted',     color: '#2563eb', bg: '#dbeafe' },
  under_review:  { label: 'Under Review',  color: '#d97706', bg: '#fef3c7' },
  approved:      { label: 'Approved',      color: '#047857', bg: '#d1fae5' },
  rejected:      { label: 'Rejected',      color: '#dc2626', bg: '#fee2e2' },
  in_progress:   { label: 'In Progress',   color: '#7c3aed', bg: '#ede9fe' },
  implemented:   { label: 'Implemented',   color: '#0891b2', bg: '#cffafe' },
  archived:      { label: 'Archived',      color: '#6b7280', bg: '#f3f4f6' },
};

const SUGGESTION_CATEGORY_META: Record<SuggestionCategory, { label: string; color: string; icon: string }> = {
  process:           { label: 'Process',            color: '#4f46e5', icon: 'Workflow' },
  equipment:         { label: 'Equipment',          color: '#0891b2', icon: 'Cog' },
  safety:            { label: 'Safety',             color: '#dc2626', icon: 'HardHat' },
  quality:           { label: 'Quality',            color: '#047857', icon: 'ShieldCheck' },
  cost:              { label: 'Cost',               color: '#ea580c', icon: 'Coins' },
  environment:       { label: 'Environment',        color: '#15803d', icon: 'Leaf' },
  employee_wellbeing:{ label: 'Employee Wellbeing', color: '#7c3aed', icon: 'Heart' },
  customer:          { label: 'Customer',           color: '#be185d', icon: 'HeartHandshake' },
};

const IMPACT_META: Record<SuggestionImpact, { label: string; color: string; multiplier: number }> = {
  incremental:     { label: 'Incremental',     color: '#0891b2', multiplier: 1.0 },
  breakthrough:    { label: 'Breakthrough',    color: '#7c3aed', multiplier: 5.0 },
  transformational:{ label: 'Transformational',color: '#be185d', multiplier: 20.0 },
};

const MATURITY_META: Record<BestPracticeMaturity, { label: string; color: string; level: number }> = {
  emerging:     { label: 'Emerging',      color: '#6b7280', level: 1 },
  validated:    { label: 'Validated',     color: '#0891b2', level: 2 },
  standardized: { label: 'Standardized',  color: '#4f46e5', level: 3 },
  embedded:     { label: 'Embedded',      color: '#7c3aed', level: 4 },
  optimizing:   { label: 'Optimizing',    color: '#047857', level: 5 },
};

const PROJECT_TEMPLATES: { title: string; description: string; category: ProjectCategory; methodology: ProjectMethodology; priority: ProjectPriority; successCriteria: string; estimatedBenefit: number; estimatedCost: number; }[] = [
  { title: 'Pick Path Optimization via AI', description: 'Implement AI-driven pick path algorithm to reduce travel time by 25% across high-velocity zones. Pilot in WH1, replicate to WH3-WH6 after validation.', category: 'process_efficiency', methodology: 'pdsa', priority: 'high', successCriteria: 'Travel time reduced ≥25%, picker throughput up ≥15%', estimatedBenefit: 1850000, estimatedCost: 350000 },
  { title: 'Dock Door Scheduling Automation', description: 'Replace manual dock scheduling with automated slot allocation based on arrival patterns and unload SLA. Eliminates 4 hours/day of supervisor effort.', category: 'process_efficiency', methodology: 'lean', priority: 'high', successCriteria: 'Door utilization ≥85%, supervisor time saved 4h/day', estimatedBenefit: 980000, estimatedCost: 220000 },
  { title: 'Forklift Telemetry for Idle Time Reduction', description: 'Install IoT sensors on 24 forklifts to monitor idle time. Target: reduce idle time from 32% to <18% via behavior coaching + scheduling tweaks.', category: 'sustainability', methodology: 'dmaic', priority: 'medium', successCriteria: 'Idle time <18%, fuel/battery savings ≥₹4L/yr', estimatedBenefit: 650000, estimatedCost: 280000 },
  { title: 'Cycle Count Automation via RFID', description: 'Replace manual cycle counting with RFID-based auto-count for top 500 SKUs. Reduces count time from 4h to 20min, eliminates 90% of variance investigations.', category: 'digital_transformation', methodology: 'agile', priority: 'critical', successCriteria: 'Count time <30min, variance <0.5%, ROI <18 months', estimatedBenefit: 1450000, estimatedCost: 850000 },
  { title: 'Returns Processing Time Reduction', description: 'Streamline returns workflow with mobile scan stations and auto-disposition rules. Reduces average return processing time from 48h to 8h.', category: 'customer_experience', methodology: 'dmaic', priority: 'high', successCriteria: 'Returns processed within 8h, customer refund <24h', estimatedBenefit: 1250000, estimatedCost: 410000 },
  { title: 'Hazmat Compliance Documentation Digitization', description: 'Move hazmat documentation (IATA DGR, IMDG, ADR) from paper to digital with barcode verification. Eliminates 100% paper handling errors.', category: 'compliance', methodology: 'pdsa', priority: 'critical', successCriteria: '100% digital docs, 0 paper errors, audit findings=0', estimatedBenefit: 580000, estimatedCost: 320000 },
  { title: 'Inbound Quality Inspection Sampling Plan', description: 'Replace 100% inspection with ANSI/ASQ Z1.4 statistical sampling for non-critical SKUs. Reduces inspector effort 60%, maintains 99% defect detection.', category: 'quality_enhancement', methodology: 'six_sigma', priority: 'medium', successCriteria: 'Inspection time -60%, defect detection ≥99%', estimatedBenefit: 780000, estimatedCost: 180000 },
  { title: 'Ergonomic Workstation Redesign', description: 'Redesign 12 picking/packing workstations with adjustable height tables, anti-fatigue mats, and proper lighting. Target: reduce repetitive strain injuries by 70%.', category: 'safety_improvement', methodology: 'kaizen_blitz', priority: 'high', successCriteria: 'RSI incidents -70%, productivity +8%, absenteeism -15%', estimatedBenefit: 920000, estimatedCost: 480000 },
  { title: 'Energy-Efficient LED + Occupancy Sensors', description: 'Replace 480 fluorescent fixtures with LED + install occupancy sensors in low-traffic zones. Reduces lighting energy consumption by 65%.', category: 'sustainability', methodology: 'pdsa', priority: 'medium', successCriteria: 'Energy use -65%, payback <3 years, lux levels meet OSHA', estimatedBenefit: 720000, estimatedCost: 540000 },
  { title: 'Customer Order Tracking Portal', description: 'Build self-service portal for top 50 customers to track orders in real-time. Reduces WMS enquiry calls by 80%, improves NPS by 12 points.', category: 'customer_experience', methodology: 'agile', priority: 'high', successCriteria: 'Enquiry calls -80%, NPS +12, portal adoption ≥85%', estimatedBenefit: 2100000, estimatedCost: 680000 },
  { title: 'Reverse Logistics Cost Recovery', description: 'Implement refurbishment + resale channel for returned goods (currently 100% scrapped). Target: recover 35% of returned goods value.', category: 'cost_reduction', methodology: 'dmaic', priority: 'high', successCriteria: 'Value recovery ≥35%, payback <12 months', estimatedBenefit: 1650000, estimatedCost: 520000 },
  { title: 'Predictive Maintenance for Conveyor Systems', description: 'Install vibration sensors on 14 conveyor motors + ML model for failure prediction. Eliminates unplanned downtime, saves 22h/month.', category: 'digital_transformation', methodology: 'dmaic', priority: 'critical', successCriteria: 'Unplanned downtime -85%, MTBF +40%, ROI <24 months', estimatedBenefit: 2350000, estimatedCost: 920000 },
  { title: 'Packaging Material Waste Reduction', description: 'Switch from bubble wrap to molded pulp inserts for top 200 SKUs. Reduces packaging waste by 45 tonnes/year and material cost by ₹3.2L/year.', category: 'sustainability', methodology: 'lean', priority: 'medium', successCriteria: 'Waste -45t/yr, material cost -₹3.2L/yr, product damage ≤baseline', estimatedBenefit: 540000, estimatedCost: 150000 },
  { title: 'Cross-Docking Expansion for Fast-Movers', description: 'Expand cross-docking from 8% to 25% of fast-moving SKUs. Reduces putaway effort 35%, cuts storage cost ₹18L/year.', category: 'cost_reduction', methodology: 'lean', priority: 'high', successCriteria: 'Cross-dock rate ≥25%, putaway effort -35%, storage cost -₹18L/yr', estimatedBenefit: 1980000, estimatedCost: 380000 },
  { title: 'Voice Picking Rollout', description: 'Deploy voice-directed picking to 60 pickers across 4 warehouses. Improves picker productivity 25%, reduces errors 40%, hands-free operation.', category: 'process_efficiency', methodology: 'agile', priority: 'high', successCriteria: 'Productivity +25%, picking errors -40%, ROI <2 years', estimatedBenefit: 1750000, estimatedCost: 720000 },
  { title: 'PPE Compliance via Computer Vision', description: 'Install CV cameras at 8 entry points to verify PPE compliance (helmet, vest, shoes). Auto-alerts on violations, eliminates manual audits.', category: 'safety_improvement', methodology: 'pdsa', priority: 'high', successCriteria: 'PPE compliance ≥99%, audit time -90%, incidents -50%', estimatedBenefit: 880000, estimatedCost: 420000 },
  { title: 'Supplier OTIF Scorecard Integration', description: 'Integrate supplier OTIF (On-Time-In-Full) into PO system. Auto-flag suppliers below 85%, trigger recovery plan. Improves inbound OTIF from 82% to 95%.', category: 'quality_enhancement', methodology: 'dmaic', priority: 'high', successCriteria: 'Inbound OTIF ≥95%, supplier recovery plan in 7 days', estimatedBenefit: 1320000, estimatedCost: 280000 },
  { title: 'Battery Hydration Automation', description: 'Replace manual forklift battery watering with automated single-point hydration system. Eliminates 6h/week labor, extends battery life 18%.', category: 'process_efficiency', methodology: 'kaizen_blitz', priority: 'low', successCriteria: 'Labor -6h/week, battery life +18%, leak risk eliminated', estimatedBenefit: 380000, estimatedCost: 95000 },
  { title: 'Cold Chain Temperature Monitoring', description: 'Install wireless temperature sensors in 4 cold storage zones with 5-min sampling + SMS alerts on excursions. Eliminates product spoilage risk.', category: 'quality_enhancement', methodology: 'pdsa', priority: 'critical', successCriteria: 'Temperature excursions -95%, spoilage -₹14L/yr, 100% audit trail', estimatedBenefit: 1450000, estimatedCost: 350000 },
  { title: 'Truck Turnaround Time Reduction', description: 'Implement yard management system with RFID gate control + dock door auto-assignment. Cuts avg truck turnaround from 95min to 45min.', category: 'process_efficiency', methodology: 'lean', priority: 'critical', successCriteria: 'Turnaround ≤45min, dock utilization ≥85%, driver wait time -60%', estimatedBenefit: 2200000, estimatedCost: 580000 },
  { title: 'Putaway Slotting Optimization', description: 'Re-slot 4500 SKUs based on velocity + cube + affinity. Reduces putaway travel 30%, picker travel 18%, increases storage density 12%.', category: 'cost_reduction', methodology: 'six_sigma', priority: 'high', successCriteria: 'Putaway travel -30%, picker travel -18%, density +12%', estimatedBenefit: 1150000, estimatedCost: 240000 },
  { title: 'Lift Truck Operator Certification Refresh', description: 'Quarterly recertification of 84 forklift operators using simulator-based assessment. Reduces incidents 35%, lowers insurance premium 8%.', category: 'safety_improvement', methodology: 'pdsa', priority: 'medium', successCriteria: 'Incidents -35%, insurance -8%, recertification 100% on-time', estimatedBenefit: 620000, estimatedCost: 180000 },
  { title: 'Paperless Receiving Process', description: 'Deploy tablets to 28 receiving clerks + ePOD integration. Eliminates 18,000 paper GRN/year, reduces data entry errors 95%.', category: 'digital_transformation', methodology: 'agile', priority: 'medium', successCriteria: 'Paper usage -18,000 GRN/yr, data entry errors -95%', estimatedBenefit: 480000, estimatedCost: 220000 },
  { title: 'Process Audit Cycle Time Reduction', description: 'Standardize internal audit checklists + mobile data capture. Reduces audit cycle from 22 days to 9 days, increases audit coverage 40%.', category: 'compliance', methodology: 'lean', priority: 'medium', successCriteria: 'Audit cycle ≤9 days, coverage +40%, findings closed in 30d', estimatedBenefit: 580000, estimatedCost: 140000 },
];

const SUGGESTION_POOL: { title: string; description: string; category: SuggestionCategory; impact: SuggestionImpact; estimatedBenefit: number; }[] = [
  { title: 'Color-coded totes by SKU velocity', description: 'Use red totes for A-class, blue for B-class, green for C-class to visually identify priority picks.', category: 'process', impact: 'incremental', estimatedBenefit: 85000 },
  { title: 'Pre-printed label rolls at each station', description: 'Eliminate walk-to-printer trips by stocking each station with pre-printed common labels.', category: 'process', impact: 'incremental', estimatedBenefit: 45000 },
  { title: 'Anti-fatigue mats at packing stations', description: 'Install anti-fatigue mats to reduce picker fatigue during 8-hour shifts.', category: 'employee_wellbeing', impact: 'incremental', estimatedBenefit: 120000 },
  { title: 'Weekly Kaizen huddles per shift', description: '15-min weekly huddle to surface bottom-up improvement ideas from operators.', category: 'process', impact: 'incremental', estimatedBenefit: 220000 },
  { title: 'Battery charging schedule optimization', description: 'Stagger forklift battery charging to off-peak hours for lower electricity tariff.', category: 'cost', impact: 'incremental', estimatedBenefit: 180000 },
  { title: 'Reusable totes for internal moves', description: 'Replace cardboard boxes with reusable totes for internal transfer between zones.', category: 'environment', impact: 'incremental', estimatedBenefit: 95000 },
  { title: 'Voice-picking for hands-free operation', description: 'Deploy voice-picking for hands-free picking, especially for bulky items.', category: 'process', impact: 'breakthrough', estimatedBenefit: 850000 },
  { title: 'Daily stand-up board at each zone', description: 'Visual management board with shift KPIs, top issues, and improvement actions.', category: 'process', impact: 'incremental', estimatedBenefit: 145000 },
  { title: 'Forklift speed governors in pedestrian zones', description: 'Mandate speed limiters on forklifts in zones with pedestrian traffic to reduce collision risk.', category: 'safety', impact: 'incremental', estimatedBenefit: 280000 },
  { title: 'Automated SMS to customers on dispatch', description: 'Auto-send SMS to customers when their order is dispatched, with ETA and tracking link.', category: 'customer', impact: 'incremental', estimatedBenefit: 350000 },
  { title: 'Slotting software for ABC analysis', description: 'Use slotting software to auto-recommend SKU placement based on velocity and affinity.', category: 'process', impact: 'breakthrough', estimatedBenefit: 620000 },
  { title: 'Replace paper towels with hand dryers', description: 'Install hand dryers in 12 restrooms to reduce paper towel waste and cost.', category: 'environment', impact: 'incremental', estimatedBenefit: 35000 },
  { title: 'CCTV analytics for queue detection', description: 'Use existing CCTV + AI to detect inbound queue buildup and auto-alert supervisor.', category: 'process', impact: 'breakthrough', estimatedBenefit: 480000 },
  { title: 'Monthly supplier feedback sessions', description: 'Structured monthly sessions with top 10 suppliers to surface inbound quality issues.', category: 'quality', impact: 'incremental', estimatedBenefit: 320000 },
  { title: 'Tool shadow boards at each workstation', description: '5S shadow boards at workstations to ensure tools have a designated home, reducing lost tool time.', category: 'process', impact: 'incremental', estimatedBenefit: 75000 },
  { title: 'Solar panels on warehouse rooftops', description: 'Install 500 kW rooftop solar across 3 warehouses to reduce grid dependency 40%.', category: 'environment', impact: 'transformational', estimatedBenefit: 2400000 },
  { title: 'Automated carton erector for top 5 SKUs', description: 'Replace manual carton assembly for top 5 SKUs with auto-erector, saves 4h/day.', category: 'equipment', impact: 'breakthrough', estimatedBenefit: 580000 },
  { title: 'Buddy system for new hire onboarding', description: 'Pair new hires with experienced operators for first 30 days to accelerate ramp-up.', category: 'employee_wellbeing', impact: 'incremental', estimatedBenefit: 195000 },
  { title: 'Pick cart redesign with ergonomic handles', description: 'Replace existing pick carts with adjustable handle heights to reduce back strain.', category: 'safety', impact: 'incremental', estimatedBenefit: 220000 },
  { title: 'Customer feedback kiosk at outbound dock', description: 'Install a feedback kiosk at outbound dock for drivers to rate loading experience.', category: 'customer', impact: 'incremental', estimatedBenefit: 85000 },
  { title: 'Inventory accuracy dashboard at each zone', description: 'Real-time inventory accuracy display at each zone to drive accountability.', category: 'quality', impact: 'incremental', estimatedBenefit: 280000 },
  { title: 'Reusable shipping containers for top customer', description: 'Replace one-way cartons with reusable containers for top customer, saves ₹4L/yr.', category: 'cost', impact: 'breakthrough', estimatedBenefit: 410000 },
  { title: 'Heat recovery from compressor exhaust', description: 'Capture heat from air compressor exhaust to warm warehouse in winter.', category: 'environment', impact: 'incremental', estimatedBenefit: 145000 },
  { title: 'Cross-train operators on 3+ skills', description: 'Cross-train operators on 3+ warehouse skills to enable flexible workforce allocation.', category: 'employee_wellbeing', impact: 'breakthrough', estimatedBenefit: 720000 },
  { title: 'Automated pallet wrapper', description: 'Replace manual pallet wrapping with auto-wrapper, saves 6h/day + consistent wrap tension.', category: 'equipment', impact: 'incremental', estimatedBenefit: 320000 },
  { title: 'Pick-by-light for A-class SKUs', description: 'Install pick-by-light LEDs for A-class SKU locations to reduce pick errors.', category: 'process', impact: 'breakthrough', estimatedBenefit: 680000 },
  { title: 'Eliminate 5 redundant approval steps in PO', description: 'PO approval workflow has 5 redundant steps; eliminate them to cut cycle time 60%.', category: 'process', impact: 'incremental', estimatedBenefit: 240000 },
  { title: 'Real-time dock board visibility for carriers', description: 'Web portal for carriers to see live dock availability, eliminating phone calls.', category: 'customer', impact: 'breakthrough', estimatedBenefit: 380000 },
];

const EMPLOYEE_POOL = [
  'Anil Sharma', 'Priya Nair', 'Rajesh Kumar', 'Sneha Patel', 'Vikram Singh',
  'Meera Iyer', 'Arjun Reddy', 'Kavya Menon', 'Sanjay Gupta', 'Pooja Bhat',
  'Karthik Iyer', 'Divya Rao', 'Amitabh Singh', 'Lakshmi Pillai', 'Rohit Desai',
];

const DEPARTMENTS = ['Operations', 'Quality', 'Safety', 'Maintenance', 'IT', 'HR', 'Finance', 'Logistics'];
const REVIEWERS = ['QA Manager', 'Operations Director', 'Continuous Improvement Lead', 'Plant Head', 'Compliance Head'];

const KEY_RISKS_POOL = [
  'Resource availability during peak season',
  'Integration complexity with existing WMS',
  'Change management resistance from floor operators',
  'Vendor dependency for sensor hardware',
  'Data quality issues in historical picking data',
  'Regulatory approval delay for new packaging',
  'Insufficient training capacity for new system',
  'Network connectivity issues in cold storage zones',
  'Budget overrun due to scope creep',
  'Stakeholder alignment across multiple warehouses',
];

// ----------------------------------------------------------------------------
// Generators
// ----------------------------------------------------------------------------
function generateProjects(count: number, employees: { name: string; role: string }[]): ImprovementProject[] {
  const projects: ImprovementProject[] = [];
  for (let i = 0; i < count; i++) {
    const template = PROJECT_TEMPLATES[i % PROJECT_TEMPLATES.length];
    const startDays = randInt(15, 240, i + 50);
    const start = daysAgo(startDays);
    const durationDays = randInt(60, 270, i + 100);
    const target = daysAhead(durationDays - startDays);
    const phaseIdx = Math.min(5, Math.floor(startDays / 45));
    const phases: ProjectPhase[] = ['charter', 'plan', 'do', 'study', 'act', 'closed'];
    const phase = phases[phaseIdx];
    const isClosed = phase === 'closed';
    const percent = phaseIdx === 0 ? randInt(5, 15, i + 150)
                  : phaseIdx === 1 ? randInt(15, 35, i + 150)
                  : phaseIdx === 2 ? randInt(35, 65, i + 150)
                  : phaseIdx === 3 ? randInt(65, 85, i + 150)
                  : phaseIdx === 4 ? randInt(85, 99, i + 150)
                  : 100;
    const statusRoll = seededRand(i + 200);
    let status: ProjectStatus;
    if (isClosed) status = statusRoll > 0.1 ? 'completed' : 'cancelled';
    else if (statusRoll > 0.85) status = 'delayed';
    else if (statusRoll > 0.65) status = 'at_risk';
    else if (statusRoll > 0.05) status = 'on_track';
    else status = 'on_hold';

    const sponsor = pick(EMPLOYEE_POOL, i + 250);
    const lead = pick(EMPLOYEE_POOL, i + 300);
    const sponsorRole = pick(REVIEWERS, i + 350);
    const wh = `WH${randInt(1, 8, i + 400)}`;
    const dept = pick(DEPARTMENTS, i + 450);
    const estimatedCost = template.estimatedCost + randInt(-50000, 50000, i + 500);
    const actualCost = isClosed ? estimatedCost + randInt(-30000, 80000, i + 550) : Math.floor(estimatedCost * (percent / 100));
    const estimatedBenefit = template.estimatedBenefit;
    const realizedBenefit = isClosed && status === 'completed'
      ? Math.floor(estimatedBenefit * (0.7 + seededRand(i + 600) * 0.5))
      : status === 'completed'
        ? Math.floor(estimatedBenefit * 0.4)
        : 0;
    const roi = isClosed && status === 'completed'
      ? Math.round(((realizedBenefit - actualCost) / actualCost) * 100)
      : Math.round(((estimatedBenefit - estimatedCost) / estimatedCost) * 100);

    const hasAuditLink = i % 4 === 0;
    const hasCapaLink = i % 6 === 0;
    const hasDocLink = i % 5 === 0;
    const hasTrainingLink = i % 7 === 0;
    const hasSuggestionLink = i % 3 === 0;

    projects.push({
      id: `CIP-${(i + 1).toString().padStart(4, '0')}`,
      projectCode: `CIP/${TODAY.getFullYear()}/${(i + 1).toString().padStart(3, '0')}`,
      title: template.title,
      description: template.description,
      category: template.category,
      methodology: template.methodology,
      priority: template.priority,
      phase,
      status,
      sponsor,
      sponsorRole,
      projectLead: lead,
      teamMembers: randInt(3, 12, i + 650),
      warehouseCode: wh,
      department: dept,
      startDate: start.toISOString(),
      targetEndDate: target.toISOString(),
      actualEndDate: isClosed ? daysAgo(randInt(1, 30, i + 700)).toISOString() : null,
      percentComplete: percent,
      daysToTarget: Math.round((target.getTime() - TODAY.getTime()) / MS_PER_DAY),
      estimatedCostInr: estimatedCost,
      actualCostInr: actualCost,
      estimatedBenefitInr: estimatedBenefit,
      realizedBenefitInr: realizedBenefit,
      roiPercent: roi,
      linkedAuditFinding: hasAuditLink ? `R107-AF-${randInt(100, 999, i + 750).toString().padStart(4, '0')}` : null,
      linkedCapaId: hasCapaLink ? `CAPA-${randInt(100, 999, i + 800)}` : null,
      linkedDocNumber: hasDocLink ? `QMS-PR-${randInt(1, 54, i + 850).toString().padStart(3, '0')}` : null,
      linkedTrainingId: hasTrainingLink ? `TN-${randInt(1, 116, i + 900).toString().padStart(4, '0')}` : null,
      linkedSuggestionId: hasSuggestionLink ? `KS-${randInt(1, 28, i + 950).toString().padStart(4, '0')}` : null,
      successCriteria: template.successCriteria,
      keyRisks: pick(KEY_RISKS_POOL, i + 1000),
    });
  }
  return projects;
}

function generateSuggestions(count: number, employees: { name: string; role: string; department: string }[]): KaizenSuggestion[] {
  const suggestions: KaizenSuggestion[] = [];
  for (let i = 0; i < count; i++) {
    const template = SUGGESTION_POOL[i % SUGGESTION_POOL.length];
    const submitter = employees[i % Math.max(employees.length, 1)] || { name: pick(EMPLOYEE_POOL, i), role: 'operator', department: 'Operations' };
    const submittedDaysAgo = randInt(1, 365, i + 50);
    const statusRoll = seededRand(i + 100);
    let status: SuggestionStatus;
    let reviewedDate: string | null = null;
    let implementedDate: string | null = null;
    let actualBenefit = 0;
    let implDays = 0;
    if (statusRoll > 0.78) {
      status = 'implemented';
      reviewedDate = daysAgo(submittedDaysAgo - randInt(3, 15, i + 150)).toISOString();
      implementedDate = daysAgo(randInt(1, 60, i + 200)).toISOString();
      actualBenefit = Math.floor(template.estimatedBenefit * (0.6 + seededRand(i + 250) * 0.6));
      implDays = randInt(7, 90, i + 300);
    } else if (statusRoll > 0.65) {
      status = 'in_progress';
      reviewedDate = daysAgo(submittedDaysAgo - randInt(2, 10, i + 350)).toISOString();
      implDays = randInt(14, 120, i + 400);
    } else if (statusRoll > 0.50) {
      status = 'approved';
      reviewedDate = daysAgo(submittedDaysAgo - randInt(2, 8, i + 450)).toISOString();
    } else if (statusRoll > 0.30) {
      status = 'under_review';
    } else if (statusRoll > 0.18) {
      status = 'submitted';
    } else if (statusRoll > 0.08) {
      status = 'rejected';
      reviewedDate = daysAgo(submittedDaysAgo - randInt(1, 7, i + 500)).toISOString();
    } else {
      status = 'archived';
      reviewedDate = daysAgo(submittedDaysAgo - randInt(1, 5, i + 550)).toISOString();
    }

    suggestions.push({
      id: `KS-${(i + 1).toString().padStart(4, '0')}`,
      suggestionCode: `KS/${TODAY.getFullYear()}/${(i + 1).toString().padStart(3, '0')}`,
      title: template.title,
      description: template.description,
      submittedBy: submitter.name,
      submittedByRole: submitter.role || 'operator',
      submittedByDepartment: submitter.department || 'Operations',
      warehouseCode: `WH${randInt(1, 8, i + 600)}`,
      submittedDate: daysAgo(submittedDaysAgo).toISOString(),
      category: template.category,
      impact: template.impact,
      status,
      estimatedBenefitInr: template.estimatedBenefit,
      actualBenefitInr: actualBenefit,
      implementationDays: implDays,
      reviewedBy: reviewedDate ? pick(REVIEWERS, i + 700) : '',
      reviewedDate,
      implementedDate,
      linkedProjectId: status === 'implemented' && i % 3 === 0 ? `CIP-${randInt(1, 24, i + 750).toString().padStart(4, '0')}` : null,
      upvotes: randInt(0, 47, i + 800),
      comments: randInt(0, 12, i + 850),
      recognitionPoints: status === 'implemented' ? Math.max(10, Math.floor(actualBenefit / 5000)) : 0,
    });
  }
  return suggestions;
}

function generatePDSACycles(projects: ImprovementProject[]): PDSACycle[] {
  const cycles: PDSACycle[] = [];
  let cycleId = 0;
  for (const project of projects) {
    if (project.phase === 'charter') continue;
    const iterCount = project.phase === 'closed' ? randInt(2, 5, cycleId + 50) : randInt(1, 3, cycleId + 50);
    const completedIters = project.phase === 'closed' ? iterCount
                         : project.phase === 'act' ? iterCount - 1
                         : Math.max(0, iterCount - 2);
    for (let i = 0; i < iterCount; i++) {
      cycleId++;
      const isComplete = i < completedIters;
      const stageIdx = isComplete ? 3 : Math.min(2, i);
      const stages: PDSAStage[] = ['plan', 'do', 'study', 'act'];
      const stage = stages[Math.min(stageIdx, 3)];
      const baseline = randInt(40, 80, cycleId + 100);
      const target = Math.min(98, baseline + randInt(15, 40, cycleId + 150));
      const actual = isComplete ? Math.min(99, baseline + randInt(10, 35, cycleId + 200)) : 0;
      const improvement = isComplete ? Math.round(((actual - baseline) / baseline) * 100) : 0;
      const outcomeRoll = seededRand(cycleId + 250);
      const studyOutcome = isComplete
        ? outcomeRoll > 0.7 ? 'validated' : outcomeRoll > 0.4 ? 'partial' : outcomeRoll > 0.2 ? 'inconclusive' : 'invalidated'
        : 'inconclusive';
      const actDecision = isComplete
        ? studyOutcome === 'validated' ? 'standardize' : studyOutcome === 'partial' ? 'iterate' : studyOutcome === 'invalidated' ? 'abandon' : 'pilot_extension'
        : 'iterate';
      cycles.push({
        id: `PDSA-${cycleId.toString().padStart(4, '0')}`,
        projectId: project.id,
        projectTitle: project.title,
        cycleNumber: i + 1,
        stage,
        hypothesis: `If we apply [intervention for ${project.methodology.toUpperCase()} cycle ${i + 1}], then we expect metric to improve from ${baseline} to ${target}.`,
        planActions: `Define experiment scope, baseline current state, identify test sample (n=${randInt(15, 50, cycleId + 300)}), set duration=${randInt(7, 30, cycleId + 350)} days.`,
        planOwner: project.projectLead,
        planTargetDate: daysAgo(randInt(30, 60, cycleId + 400)).toISOString(),
        doActions: `Execute experiment with controlled variables. Daily check-ins. Document deviations.`,
        doOwner: project.projectLead,
        doStartDate: daysAgo(randInt(15, 45, cycleId + 450)).toISOString(),
        doEndDate: isComplete ? daysAgo(randInt(5, 30, cycleId + 500)).toISOString() : null,
        studyFindings: isComplete
          ? `Metric moved from ${baseline} to ${actual} (${improvement > 0 ? '+' : ''}${improvement}%). ${studyOutcome === 'validated' ? 'Hypothesis confirmed.' : studyOutcome === 'partial' ? 'Partial confirmation, refinement needed.' : 'Hypothesis invalidated.'}`
          : 'Pending data collection.',
        studyOwner: pick(REVIEWERS, cycleId + 550),
        studyDate: isComplete && stageIdx >= 2 ? daysAgo(randInt(2, 15, cycleId + 600)).toISOString() : null,
        studyOutcome,
        actDecision,
        actActions: actDecision === 'standardize'
          ? `Update SOP, train all shifts, monitor for 30 days post-rollout.`
          : actDecision === 'iterate'
          ? `Refine hypothesis, modify variables, run next PDSA cycle.`
          : actDecision === 'abandon'
          ? `Discontinue approach, document lessons learned.`
          : `Extend pilot to 2-3 more warehouses for validation.`,
        actOwner: project.sponsor,
        actDate: isComplete && stageIdx >= 3 ? daysAgo(randInt(1, 10, cycleId + 650)).toISOString() : null,
        metricsBaseline: baseline,
        metricsTarget: target,
        metricsActual: actual,
        metricsImprovementPct: improvement,
        iterationCount: iterCount,
      });
    }
  }
  return cycles;
}

function generateROIMeasurements(projects: ImprovementProject[]): ROIMeasurement[] {
  const measurements: ROIMeasurement[] = [];
  let mId = 0;
  for (const project of projects) {
    if (project.status !== 'completed') {
      if (project.percentComplete < 60) continue;
    }
    mId++;
    const totalInvestment = project.actualCostInr;
    const isVerified = project.status === 'completed';
    const costSaved = isVerified ? Math.floor(project.realizedBenefitInr * 0.55) : Math.floor(project.estimatedBenefitInr * 0.55 * (project.percentComplete / 100));
    const revenueLift = isVerified ? Math.floor(project.realizedBenefitInr * 0.25) : Math.floor(project.estimatedBenefitInr * 0.25 * (project.percentComplete / 100));
    const costAvoided = isVerified ? Math.floor(project.realizedBenefitInr * 0.20) : Math.floor(project.estimatedBenefitInr * 0.20 * (project.percentComplete / 100));
    const totalBenefit = costSaved + revenueLift + costAvoided;
    const netBenefit = totalBenefit - totalInvestment;
    const roi = totalInvestment > 0 ? Math.round((netBenefit / totalInvestment) * 100) : 0;
    const payback = totalBenefit > 0 ? Math.max(1, Math.round((totalInvestment / (totalBenefit / 12)))) : 0;
    measurements.push({
      id: `ROI-${mId.toString().padStart(4, '0')}`,
      projectId: project.id,
      projectTitle: project.title,
      category: project.category,
      costSavedInr: costSaved,
      revenueLiftInr: revenueLift,
      costAvoidedInr: costAvoided,
      productivityGainPct: randInt(5, 35, mId + 100),
      cycleTimeReductionPct: randInt(10, 60, mId + 150),
      defectReductionPct: randInt(15, 75, mId + 200),
      customerSatisfactionLift: +(seededRand(mId + 250) * 15).toFixed(1),
      totalInvestmentInr: totalInvestment,
      totalBenefitInr: totalBenefit,
      netBenefitInr: netBenefit,
      roiPercent: roi,
      paybackMonths: payback,
      npvInr: Math.floor(netBenefit * 0.78),
      irrPercent: randInt(8, 45, mId + 300),
      measurementPeriod: `FY${TODAY.getFullYear()}-${(TODAY.getFullYear() + 1).toString().slice(-2)}`,
      measurementDate: daysAgo(randInt(1, 45, mId + 350)).toISOString(),
      verified: isVerified,
      verifiedBy: isVerified ? pick(REVIEWERS, mId + 400) : '',
    });
  }
  return measurements;
}

function generateBestPractices(projects: ImprovementProject[]): BestPractice[] {
  const practices: BestPractice[] = [];
  const completed = projects.filter(p => p.status === 'completed');
  const take = Math.min(28, completed.length);
  for (let i = 0; i < take; i++) {
    const project = completed[i];
    const maturityRoll = seededRand(i + 50);
    const maturity: BestPracticeMaturity = maturityRoll > 0.85 ? 'optimizing'
                                        : maturityRoll > 0.65 ? 'embedded'
                                        : maturityRoll > 0.40 ? 'standardized'
                                        : maturityRoll > 0.20 ? 'validated'
                                        : 'emerging';
    const replicationCount = maturity === 'optimizing' ? randInt(5, 8, i + 100)
                            : maturity === 'embedded' ? randInt(3, 6, i + 100)
                            : maturity === 'standardized' ? randInt(2, 4, i + 100)
                            : maturity === 'validated' ? randInt(1, 2, i + 100)
                            : 0;
    const replicatedTo = Array.from({ length: replicationCount }, (_, j) => `WH${randInt(1, 8, i * 10 + j + 150)}`);
    const perSite = Math.floor(project.realizedBenefitInr * 0.85);
    practices.push({
      id: `BP-${(i + 1).toString().padStart(4, '0')}`,
      practiceCode: `BP/${TODAY.getFullYear()}/${(i + 1).toString().padStart(3, '0')}`,
      title: project.title,
      description: project.description,
      category: project.category,
      originWarehouseCode: project.warehouseCode,
      originProjectId: project.id,
      maturity,
      replicatedTo,
      replicationCount,
      documentedDate: daysAgo(randInt(30, 180, i + 200)).toISOString(),
      lastUpdated: daysAgo(randInt(1, 30, i + 250)).toISOString(),
      documentedBy: pick(EMPLOYEE_POOL, i + 300),
      approvalStatus: maturity === 'emerging' ? 'in_review' : 'approved',
      sopReference: `QMS-WI-${randInt(100, 250, i + 350).toString().padStart(3, '0')}`,
      trainingRequired: i % 2 === 0,
      linkedDocNumber: project.linkedDocNumber,
      impactSummary: `Saved ₹${perSite.toLocaleString('en-IN')} at origin site. Estimated ₹${perSite.toLocaleString('en-IN')} savings per replication site.`,
      estimatedSavingsPerSiteInr: perSite,
      totalEstimatedSavingsInr: perSite * (replicationCount + 1),
    });
  }
  return practices;
}

// ----------------------------------------------------------------------------
// KPI computation
// ----------------------------------------------------------------------------
interface KPIs {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  delayedProjects: number;
  atRiskProjects: number;
  onTrackRate: number;
  criticalProjects: number;
  highProjects: number;
  totalInvestment: number;
  totalRealizedBenefit: number;
  totalEstimatedBenefit: number;
  portfolioROI: number;
  totalSuggestions: number;
  implementedSuggestions: number;
  implementationRate: number;
  totalSuggestionBenefit: number;
  totalRecognitionPoints: number;
  totalPDSACycles: number;
  validatedCycles: number;
  standardizationRate: number;
  totalBestPractices: number;
  embeddedPractices: number;
  totalReplications: number;
  totalEstimatedReplicationSavings: number;
  crossModuleSources: number;
  closedLoopRate: number;
  iso_10_3_1: number;
  iso_10_3_2: number;
  iso_10_3_3: number;
  overallCompliance: number;
  effectiveness: number;
}

function onTrackRate(projects: ImprovementProject[]): number {
  const active = projects.filter(p => !['cancelled'].includes(p.status));
  if (active.length === 0) return 0;
  const onTrack = active.filter(p => ['on_track', 'completed'].includes(p.status)).length;
  return Math.round((onTrack / active.length) * 100);
}

function computeKPIs(
  projects: ImprovementProject[],
  suggestions: KaizenSuggestion[],
  cycles: PDSACycle[],
  roi: ROIMeasurement[],
  practices: BestPractice[],
  crossModule: CrossModuleLink[],
): KPIs {
  const activeProjects = projects.filter(p => !['completed', 'cancelled'].includes(p.status)).length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const delayedProjects = projects.filter(p => p.status === 'delayed').length;
  const atRiskProjects = projects.filter(p => p.status === 'at_risk').length;
  const onTrack = projects.filter(p => p.status === 'on_track').length;
  const criticalProjects = projects.filter(p => p.priority === 'critical').length;
  const highProjects = projects.filter(p => p.priority === 'high').length;
  const totalInvestment = projects.reduce((s, p) => s + p.actualCostInr, 0);
  const totalRealized = projects.reduce((s, p) => s + p.realizedBenefitInr, 0);
  const totalEstimated = projects.reduce((s, p) => s + p.estimatedBenefitInr, 0);
  const portfolioROI = totalInvestment > 0 ? Math.round(((totalRealized - totalInvestment) / totalInvestment) * 100) : 0;

  const totalSuggestions = suggestions.length;
  const implementedSuggestions = suggestions.filter(s => s.status === 'implemented').length;
  const implementationRate = totalSuggestions > 0 ? Math.round((implementedSuggestions / totalSuggestions) * 100) : 0;
  const totalSuggestionBenefit = suggestions.reduce((s, su) => s + su.actualBenefitInr, 0);
  const totalRecognitionPoints = suggestions.reduce((s, su) => s + su.recognitionPoints, 0);

  const totalCycles = cycles.length;
  const validatedCycles = cycles.filter(c => c.studyOutcome === 'validated').length;
  const standardizationRate = totalCycles > 0 ? Math.round((validatedCycles / totalCycles) * 100) : 0;

  const embeddedPractices = practices.filter(p => ['embedded', 'optimizing'].includes(p.maturity)).length;
  const totalReplications = practices.reduce((s, p) => s + p.replicationCount, 0);
  const totalReplicationSavings = practices.reduce((s, p) => s + p.totalEstimatedSavingsInr, 0);

  const closedLoopCount = crossModule.reduce((s, m) => s + m.closedLoopCount, 0);
  const totalCrossModuleActions = crossModule.reduce((s, m) => s + m.improvementCount, 0);
  const closedLoopRate = totalCrossModuleActions > 0 ? Math.round((closedLoopCount / totalCrossModuleActions) * 100) : 0;

  const verifiedROI = roi.filter(r => r.verified).length;
  const iso_10_3_1 = projects.length > 0 ? Math.round((verifiedROI / projects.length) * 100) : 0;
  const iso_10_3_2 = standardizationRate;
  const iso_10_3_3 = closedLoopRate;
  const overallCompliance = Math.round((iso_10_3_1 + iso_10_3_2 + iso_10_3_3) / 3);
  const effectiveness = Math.round(
    (onTrackRate(projects) * 0.20) +
    (implementationRate * 0.20) +
    (standardizationRate * 0.20) +
    (Math.min(100, embeddedPractices * 8) * 0.10) +
    (closedLoopRate * 0.15) +
    (Math.min(100, (totalRealized / Math.max(1, totalEstimated)) * 100) * 0.15),
  );
  return {
    totalProjects: projects.length,
    activeProjects,
    completedProjects,
    delayedProjects,
    atRiskProjects,
    onTrackRate: projects.length > 0 ? Math.round((onTrack / projects.length) * 100) : 0,
    criticalProjects,
    highProjects,
    totalInvestment,
    totalRealizedBenefit: totalRealized,
    totalEstimatedBenefit: totalEstimated,
    portfolioROI,
    totalSuggestions,
    implementedSuggestions,
    implementationRate,
    totalSuggestionBenefit,
    totalRecognitionPoints,
    totalPDSACycles: totalCycles,
    validatedCycles,
    standardizationRate,
    totalBestPractices: practices.length,
    embeddedPractices,
    totalReplications,
    totalEstimatedReplicationSavings: totalReplicationSavings,
    crossModuleSources: crossModule.length,
    closedLoopRate,
    iso_10_3_1,
    iso_10_3_2,
    iso_10_3_3,
    overallCompliance,
    effectiveness,
  };
}

// ----------------------------------------------------------------------------
// In-memory cache (60s TTL)
// ----------------------------------------------------------------------------
let cachedResponse: { data: unknown; ts: number } | null = null;
const CACHE_TTL_MS = 60 * 1000;

export async function GET() {
  if (cachedResponse && Date.now() - cachedResponse.ts < CACHE_TTL_MS) {
    return NextResponse.json(cachedResponse.data);
  }

  try {
    // Use mock data from existing warehouse list; derive employees & metadata
    // deterministically so the module works without a live database.
    const warehouses = mockWarehouses.slice(0, 8).map((w, i) => ({
      id: w.id,
      code: `WH${i + 1}`,
      name: w.name,
      city: w.city,
    }));
    const employees = Array.from({ length: 30 }, (_, i) => ({
      empCode: `EMP${(i + 1).toString().padStart(4, '0')}`,
      name: EMPLOYEE_POOL[i % EMPLOYEE_POOL.length],
      role: (['warehouse_manager', 'supervisor', 'operator', 'qa_officer', 'auditor', 'forklift_operator', 'inventory_clerk', 'dispatcher'] as const)[i % 8],
      department: DEPARTMENTS[i % DEPARTMENTS.length],
      warehouseId: warehouses[i % warehouses.length].id,
    }));

    const projects = generateProjects(36, employees as unknown as { name: string; role: string }[]);
    const suggestions = generateSuggestions(80, employees as unknown as { name: string; role: string; department: string }[]);
    const cycles = generatePDSACycles(projects);
    const roi = generateROIMeasurements(projects);
    const practices = generateBestPractices(projects);

    const crossModule: CrossModuleLink[] = [
      {
        sourceModule: 'R107 Internal Audit',
        sourceLabel: 'Audit-Driven Improvements',
        improvementCount: projects.filter(p => p.linkedAuditFinding).length,
        closedLoopCount: projects.filter(p => p.linkedAuditFinding && p.status === 'completed').length,
        closedLoopRate: 0,
        pendingActionCount: projects.filter(p => p.linkedAuditFinding && !['completed', 'cancelled'].includes(p.status)).length,
        totalBenefitInr: projects.filter(p => p.linkedAuditFinding).reduce((s, p) => s + p.realizedBenefitInr, 0),
        color: '#0891b2',
      },
      {
        sourceModule: 'R101 CAPA',
        sourceLabel: 'CAPA-Driven Improvements',
        improvementCount: projects.filter(p => p.linkedCapaId).length,
        closedLoopCount: projects.filter(p => p.linkedCapaId && p.status === 'completed').length,
        closedLoopRate: 0,
        pendingActionCount: projects.filter(p => p.linkedCapaId && !['completed', 'cancelled'].includes(p.status)).length,
        totalBenefitInr: projects.filter(p => p.linkedCapaId).reduce((s, p) => s + p.realizedBenefitInr, 0),
        color: '#7c3aed',
      },
      {
        sourceModule: 'R108 Document Control',
        sourceLabel: 'Procedure-Driven Improvements',
        improvementCount: projects.filter(p => p.linkedDocNumber).length,
        closedLoopCount: projects.filter(p => p.linkedDocNumber && p.status === 'completed').length,
        closedLoopRate: 0,
        pendingActionCount: projects.filter(p => p.linkedDocNumber && !['completed', 'cancelled'].includes(p.status)).length,
        totalBenefitInr: projects.filter(p => p.linkedDocNumber).reduce((s, p) => s + p.realizedBenefitInr, 0),
        color: '#047857',
      },
      {
        sourceModule: 'R109 Training & Competency',
        sourceLabel: 'Training-Driven Improvements',
        improvementCount: projects.filter(p => p.linkedTrainingId).length,
        closedLoopCount: projects.filter(p => p.linkedTrainingId && p.status === 'completed').length,
        closedLoopRate: 0,
        pendingActionCount: projects.filter(p => p.linkedTrainingId && !['completed', 'cancelled'].includes(p.status)).length,
        totalBenefitInr: projects.filter(p => p.linkedTrainingId).reduce((s, p) => s + p.realizedBenefitInr, 0),
        color: '#be185d',
      },
      {
        sourceModule: 'R104 Social Media Monitoring',
        sourceLabel: 'Customer Voice-Driven',
        improvementCount: 8,
        closedLoopCount: 5,
        closedLoopRate: 0,
        pendingActionCount: 3,
        totalBenefitInr: 850000,
        color: '#ea580c',
      },
      {
        sourceModule: 'R106 MRB §10.3',
        sourceLabel: 'Management Review-Driven',
        improvementCount: 12,
        closedLoopCount: 9,
        closedLoopRate: 0,
        pendingActionCount: 3,
        totalBenefitInr: 1850000,
        color: '#4f46e5',
      },
    ];
    for (const cm of crossModule) {
      cm.closedLoopRate = cm.improvementCount > 0 ? Math.round((cm.closedLoopCount / cm.improvementCount) * 100) : 0;
    }

    const kpis = computeKPIs(projects, suggestions, cycles, roi, practices, crossModule);

    const projectsByPhase = (Object.keys(PHASE_META) as ProjectPhase[]).map(phase => ({
      phase,
      label: PHASE_META[phase].label,
      color: PHASE_META[phase].color,
      count: projects.filter(p => p.phase === phase).length,
    }));

    const projectsByStatus = (Object.keys(STATUS_META) as ProjectStatus[]).map(status => ({
      status,
      label: STATUS_META[status].label,
      color: STATUS_META[status].color,
      count: projects.filter(p => p.status === status).length,
    }));

    const projectsByCategory = (Object.keys(CATEGORY_META) as ProjectCategory[]).map(cat => ({
      category: cat,
      label: CATEGORY_META[cat].label,
      color: CATEGORY_META[cat].color,
      count: projects.filter(p => p.category === cat).length,
      benefit: projects.filter(p => p.category === cat).reduce((s, p) => s + p.realizedBenefitInr, 0),
    }));

    const projectsByMethodology = (Object.keys(METHODOLOGY_META) as ProjectMethodology[]).map(m => ({
      methodology: m,
      label: METHODOLOGY_META[m].label,
      color: METHODOLOGY_META[m].color,
      count: projects.filter(p => p.methodology === m).length,
    }));

    const suggestionsByStatus = (Object.keys(SUGGESTION_STATUS_META) as SuggestionStatus[]).map(st => ({
      status: st,
      label: SUGGESTION_STATUS_META[st].label,
      color: SUGGESTION_STATUS_META[st].color,
      count: suggestions.filter(s => s.status === st).length,
    }));

    const suggestionsByCategory = (Object.keys(SUGGESTION_CATEGORY_META) as SuggestionCategory[]).map(cat => ({
      category: cat,
      label: SUGGESTION_CATEGORY_META[cat].label,
      color: SUGGESTION_CATEGORY_META[cat].color,
      count: suggestions.filter(s => s.category === cat).length,
      benefit: suggestions.filter(s => s.category === cat).reduce((s, su) => s + su.actualBenefitInr, 0),
    }));

    const suggestionsByImpact = (Object.keys(IMPACT_META) as SuggestionImpact[]).map(imp => ({
      impact: imp,
      label: IMPACT_META[imp].label,
      color: IMPACT_META[imp].color,
      count: suggestions.filter(s => s.impact === imp).length,
      benefit: suggestions.filter(s => s.impact === imp).reduce((s, su) => s + su.actualBenefitInr, 0),
    }));

    const projectTrend = Array.from({ length: 12 }, (_, i) => {
      const monthDate = new Date(TODAY.getFullYear(), TODAY.getMonth() - 11 + i, 1);
      const monthStart = monthDate.getTime();
      const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1).getTime();
      const monthProjects = projects.filter(p => {
        const t = new Date(p.startDate).getTime();
        return t >= monthStart && t < monthEnd;
      });
      const monthSugg = suggestions.filter(s => {
        const t = new Date(s.submittedDate).getTime();
        return t >= monthStart && t < monthEnd;
      });
      return {
        month: monthDate.toLocaleString('en-US', { month: 'short' }),
        newProjects: monthProjects.length,
        newSuggestions: monthSugg.length,
        implemented: monthSugg.filter(s => s.status === 'implemented').length,
        benefit: monthProjects.reduce((s, p) => s + p.realizedBenefitInr, 0) + monthSugg.reduce((s, su) => s + su.actualBenefitInr, 0),
      };
    });

    const pdsaStageBreakdown = (['plan', 'do', 'study', 'act'] as PDSAStage[]).map(stage => ({
      stage,
      label: stage.charAt(0).toUpperCase() + stage.slice(1),
      count: cycles.filter(c => c.stage === stage).length,
    }));

    const studyOutcomeBreakdown = (['validated', 'partial', 'inconclusive', 'invalidated'] as const).map(outcome => ({
      outcome,
      label: outcome.charAt(0).toUpperCase() + outcome.slice(1),
      count: cycles.filter(c => c.studyOutcome === outcome).length,
    }));

    const maturityBreakdown = (Object.keys(MATURITY_META) as BestPracticeMaturity[]).map(m => ({
      maturity: m,
      label: MATURITY_META[m].label,
      color: MATURITY_META[m].color,
      level: MATURITY_META[m].level,
      count: practices.filter(p => p.maturity === m).length,
    }));

    const topROIProjects = [...roi]
      .sort((a, b) => b.roiPercent - a.roiPercent)
      .slice(0, 10)
      .map(r => ({
        projectId: r.projectId,
        projectTitle: r.projectTitle,
        category: r.category,
        roiPercent: r.roiPercent,
        netBenefitInr: r.netBenefitInr,
        paybackMonths: r.paybackMonths,
        verified: r.verified,
      }));

    const topSuggestions = [...suggestions]
      .filter(s => s.status === 'implemented')
      .sort((a, b) => b.actualBenefitInr - a.actualBenefitInr)
      .slice(0, 10);

    const insights: { type: 'danger' | 'warning' | 'success' | 'info'; title: string; description: string; recommendation: string }[] = [];
    if (kpis.delayedProjects > 0) {
      insights.push({
        type: 'danger',
        title: `${kpis.delayedProjects} Delayed Projects Need Intervention`,
        description: `${kpis.delayedProjects} improvement projects are currently delayed. Delayed projects tie up resources and delay benefit realization.`,
        recommendation: 'Review delayed projects in next MRB §9.3 meeting. Re-baseline timeline or escalate to sponsor for additional resources.',
      });
    }
    if (kpis.atRiskProjects > 0) {
      insights.push({
        type: 'warning',
        title: `${kpis.atRiskProjects} Projects At Risk`,
        description: `${kpis.atRiskProjects} projects are flagged as at-risk. These may slip into delayed status without intervention.`,
        recommendation: 'Schedule risk review with project leads. Identify blockers and mitigation actions within 7 days.',
      });
    }
    if (kpis.implementationRate < 40) {
      insights.push({
        type: 'warning',
        title: `Kaizen Implementation Rate: ${kpis.implementationRate}%`,
        description: `Only ${kpis.implementationRate}% of submitted suggestions are implemented. This may indicate review bottlenecks or insufficient reviewer capacity.`,
        recommendation: 'Streamline suggestion review process. Set SLA: review within 7 days, decision within 21 days.',
      });
    } else {
      insights.push({
        type: 'success',
        title: `Kaizen Implementation Rate: ${kpis.implementationRate}%`,
        description: `${kpis.implementedSuggestions} of ${kpis.totalSuggestions} suggestions have been implemented, generating ₹${kpis.totalSuggestionBenefit.toLocaleString('en-IN')} in actual benefit.`,
        recommendation: 'Recognize top contributors in monthly Kaizen spotlight. Consider tiered recognition points program.',
      });
    }
    if (kpis.standardizationRate < 50) {
      insights.push({
        type: 'warning',
        title: `PDSA Standardization Rate: ${kpis.standardizationRate}%`,
        description: `Only ${kpis.standardizationRate}% of PDSA cycles result in validated standardization. Low rate may indicate insufficient experimental rigor.`,
        recommendation: 'Provide PDSA facilitator training. Use pre-experiment power analysis to ensure adequate sample sizes.',
      });
    }
    if (kpis.embeddedPractices > 0) {
      insights.push({
        type: 'success',
        title: `${kpis.embeddedPractices} Embedded Best Practices`,
        description: `${kpis.embeddedPractices} best practices have reached embedded/optimizing maturity. These are candidates for cross-warehouse replication.`,
        recommendation: `Prioritize replication of embedded practices to remaining sites. Estimated savings: ₹${kpis.totalEstimatedReplicationSavings.toLocaleString('en-IN')}.`,
      });
    }
    if (kpis.closedLoopRate < 70) {
      insights.push({
        type: 'warning',
        title: `Cross-Module Closed-Loop Rate: ${kpis.closedLoopRate}%`,
        description: `${kpis.closedLoopRate}% of cross-module improvement actions are closed-loop. Unclosed actions leave audit findings, CAPAs, and document revisions unresolved.`,
        recommendation: 'Track open cross-module actions in MRB §9.3 review. Auto-escalate actions open >90 days to sponsor.',
      });
    }
    insights.push({
      type: 'info',
      title: `Portfolio ROI: ${kpis.portfolioROI}%`,
      description: `Total investment: ₹${kpis.totalInvestment.toLocaleString('en-IN')}. Realized benefit: ₹${kpis.totalRealizedBenefit.toLocaleString('en-IN')} (of ₹${kpis.totalEstimatedBenefit.toLocaleString('en-IN')} estimated).`,
      recommendation: 'Use ROI data to prioritize future CIP investments. Reallocate budget from low-ROI to high-ROI categories.',
    });
    insights.push({
      type: 'success',
      title: `ISO 10.3 Compliance: ${kpis.overallCompliance}%`,
      description: `Sub-scores — §10.3.1 Effectiveness: ${kpis.iso_10_3_1}% | §10.3.2 Suitability: ${kpis.iso_10_3_2}% | §10.3.3 Adequacy: ${kpis.iso_10_3_3}%`,
      recommendation: 'Maintain trajectory toward 90%+. Use effectiveness score for MRB §9.3 review and annual QMS improvement planning.',
    });

    const responseData = {
      generatedAt: new Date().toISOString(),
      kpis,
      projects,
      suggestions,
      cycles,
      roi,
      practices,
      crossModule,
      projectsByPhase,
      projectsByStatus,
      projectsByCategory,
      projectsByMethodology,
      suggestionsByStatus,
      suggestionsByCategory,
      suggestionsByImpact,
      projectTrend,
      pdsaStageBreakdown,
      studyOutcomeBreakdown,
      maturityBreakdown,
      topROIProjects,
      topSuggestions,
      insights,
      meta: {
        totalProjects: projects.length,
        totalSuggestions: suggestions.length,
        totalCycles: cycles.length,
        totalROI: roi.length,
        totalPractices: practices.length,
        realData: {
          warehouseCount: warehouses.length,
          employeeCount: employees.length,
          auditLogCount: 0,
          alertCount: 0,
          kpiSnapshotCount: 0,
        },
        constants: {
          categories: Object.entries(CATEGORY_META).map(([k, v]) => ({ id: k as ProjectCategory, ...v })),
          methodologies: Object.entries(METHODOLOGY_META).map(([k, v]) => ({ id: k as ProjectMethodology, ...v })),
          priorities: Object.entries(PRIORITY_META).map(([k, v]) => ({ id: k as ProjectPriority, ...v })),
          phases: Object.entries(PHASE_META).map(([k, v]) => ({ id: k as ProjectPhase, ...v })),
          statuses: Object.entries(STATUS_META).map(([k, v]) => ({ id: k as ProjectStatus, ...v })),
          suggestionStatuses: Object.entries(SUGGESTION_STATUS_META).map(([k, v]) => ({ id: k as SuggestionStatus, ...v })),
          suggestionCategories: Object.entries(SUGGESTION_CATEGORY_META).map(([k, v]) => ({ id: k as SuggestionCategory, ...v })),
          impacts: Object.entries(IMPACT_META).map(([k, v]) => ({ id: k as SuggestionImpact, ...v })),
          maturities: Object.entries(MATURITY_META).map(([k, v]) => ({ id: k as BestPracticeMaturity, ...v })),
        },
      },
    };

    cachedResponse = { data: responseData, ts: Date.now() };
    return NextResponse.json(responseData);
  } catch (err: unknown) {
    const error = err as Error;
    console.error('[continual-improvement] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch continual improvement data', details: error.message },
      { status: 500 },
    );
  }
}
