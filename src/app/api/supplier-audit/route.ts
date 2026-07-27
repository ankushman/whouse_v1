// R111: Supplier Audit & Onboarding
// New module — extends the supplier ecosystem (Supplier Quality Scorecard +
//   Vendor Management + SCAR/8D + Continual Improvement) with audit
//   scheduling, onboarding workflow, first-article inspection, and supplier
//   self-assessment capabilities.
//
// Lifecycle coverage:
//  1. Onboarding Pipeline: pre-qualification → questionnaire → document
//     collection → site audit → approval → first PO
//  2. Audit Scheduling: recurring audits (annual / bi-annual / ad-hoc) with
//     lead auditor + team + scope + checklist
//  3. First Article Inspection (FAI): per new SKU from a supplier
//  4. Self-Assessment: supplier-submitted questionnaires (5 dimensions)
//  5. Findings & CAPA: audit findings → CAPA tracking → closure verification
//  6. Approval Status: approved / conditional / probation / suspended / debarred
//  7. ISO 9001:2015 §8.4 Control of Externally Provided Processes compliance

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
  id: string;
  supplierCode: string;
  name: string;
  category: SupplierCategory;
  tier: SupplierTier;
  approvalStatus: ApprovalStatus;
  riskLevel: RiskLevel;
  country: string;
  state: string;
  city: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  gstin: string;
  pan: string;
  msmeRegistered: boolean;
  iso9001Certified: boolean;
  iso14001Certified: boolean;
  iso45001Certified: boolean;
  iatf16949Certified: boolean;
  onboardingStage: OnboardingStage;
  onboardingProgress: number;
  onboardedDate: string | null;
  firstPODate: string | null;
  annualSpendInr: number;
  activeSKUs: number;
  criticalityScore: number;
  lastAuditDate: string | null;
  lastAuditScore: number | null;
  nextAuditDue: string | null;
  openFindings: number;
  overdueFindings: number;
  faiPendingCount: number;
  selfAssessmentScore: number | null;
  compositeScore: number;
}

interface OnboardingApplication {
  id: string;
  applicationCode: string;
  supplierName: string;
  category: SupplierCategory;
  stage: OnboardingStage;
  stageProgress: number;
  submittedDate: string;
  targetCompletionDate: string;
  daysInPipeline: number;
  sponsorName: string;
  sponsorDepartment: string;
  initiatedBy: string;
  procurementCategoryManager: string;
  documentsRequired: number;
  documentsReceived: number;
  documentsApproved: number;
  questionnaireSent: boolean;
  questionnaireReceived: boolean;
  questionnaireScore: number | null;
  siteAuditScheduled: boolean;
  siteAuditDate: string | null;
  siteAuditScore: number | null;
  approvalCommitteeReview: boolean;
  approvalDecision: 'pending' | 'approved' | 'conditional' | 'rejected';
  riskAssessmentScore: number | null;
  riskLevel: RiskLevel;
  rejectionReason: string | null;
  notes: string;
}

interface AuditSchedule {
  id: string;
  auditCode: string;
  supplierId: string;
  supplierName: string;
  auditType: AuditType;
  status: AuditStatus;
  scheduledDate: string;
  completedDate: string | null;
  daysToAudit: number;
  durationDays: number;
  leadAuditor: string;
  auditTeamSize: number;
  auditScope: string;
  auditLocation: 'on_site' | 'remote' | 'hybrid';
  facility: string;
  checklistVersion: string;
  totalQuestions: number;
  questionsCompleted: number;
  outcome: AuditOutcome | null;
  score: number | null;
  findingsCount: number;
  criticalFindings: number;
  majorFindings: number;
  minorFindings: number;
  observations: number;
  capasLinked: number;
  reportPath: string | null;
  nextAuditDate: string | null;
}

interface AuditFinding {
  id: string;
  findingCode: string;
  auditId: string;
  auditCode: string;
  supplierId: string;
  supplierName: string;
  severity: FindingSeverity;
  status: FindingStatus;
  category: 'documentation' | 'process_control' | 'quality_system' | 'traceability' | 'calibration' | 'training' | 'environment' | 'safety' | 'data_integrity' | 'supplier_management';
  clauseReference: string;
  description: string;
  identifiedDate: string;
  dueDate: string;
  daysToDue: number;
  closedDate: string | null;
  rootCause: string | null;
  correctiveAction: string | null;
  preventiveAction: string | null;
  capapId: string | null;
  verificationMethod: 'document_review' | 'on_site_verification' | 'next_audit' | 'evidence_submission' | null;
  verifiedBy: string | null;
  owner: string;
}

interface FirstArticleInspection {
  id: string;
  faiCode: string;
  supplierId: string;
  supplierName: string;
  skuCode: string;
  skuDescription: string;
  category: SupplierCategory;
  status: FAIStatus;
  requestDate: string;
  receivedDate: string | null;
  inspectionDate: string | null;
  completedDate: string | null;
  daysInProcess: number;
  inspector: string;
  inspectionLocation: string;
  sampleSize: number;
  drawingRev: string;
  specificationRev: string;
  dimensionalInspection: 'pending' | 'in_progress' | 'passed' | 'failed' | 'na';
  materialCertification: 'pending' | 'received' | 'missing' | 'na';
  functionalTest: 'pending' | 'passed' | 'failed' | 'na';
  visualInspection: 'pending' | 'passed' | 'failed';
  packagingInspection: 'pending' | 'passed' | 'failed';
  documentationReview: 'pending' | 'passed' | 'failed';
  overallResult: 'pending' | 'passed' | 'failed' | 'conditional' | 'waived';
  deviationCount: number;
  criticalDeviations: number;
  reportPath: string | null;
  approvedBy: string | null;
  nextAction: string;
}

interface SelfAssessment {
  id: string;
  assessmentCode: string;
  supplierId: string;
  supplierName: string;
  status: SelfAssessmentStatus;
  sentDate: string;
  dueDate: string;
  submittedDate: string | null;
  daysToDue: number;
  reviewer: string | null;
  reviewDate: string | null;
  qualityScore: number | null;
  deliveryScore: number | null;
  costScore: number | null;
  sustainabilityScore: number | null;
  complianceScore: number | null;
  overallScore: number | null;
  deviationFromInternal: number | null;
  attestationSigned: boolean;
  attachmentsUploaded: number;
  notes: string;
}

interface SupplierScorecard {
  supplierId: string;
  supplierName: string;
  category: SupplierCategory;
  tier: SupplierTier;
  approvalStatus: ApprovalStatus;
  qualityScore: number;
  deliveryScore: number;
  costScore: number;
  auditScore: number;
  riskScore: number;
  compositeScore: number;
  rank: number;
  annualSpendInr: number;
  trendVsLastQuarter: number;
}

interface CrossModuleLink {
  sourceModule: string;
  sourceLabel: string;
  linkedCount: number;
  pendingCount: number;
  closedLoopRate: number;
  color: string;
}

// ----------------------------------------------------------------------------
// Constants metadata
// ----------------------------------------------------------------------------
const CATEGORY_META: Record<SupplierCategory, { label: string; color: string; bg: string; icon: string; criticality: 'critical' | 'high' | 'medium' }> = {
  raw_material:        { label: 'Raw Materials',        color: '#ea580c', bg: '#fed7aa', icon: 'Factory',         criticality: 'high' },
  components:           { label: 'Components',           color: '#2563eb', bg: '#dbeafe', icon: 'Cog',             criticality: 'critical' },
  packaging:            { label: 'Packaging',            color: '#047857', bg: '#d1fae5', icon: 'Boxes',           criticality: 'medium' },
  logistics:            { label: 'Logistics',            color: '#7c3aed', bg: '#ede9fe', icon: 'Truck',           criticality: 'high' },
  services:             { label: 'Services',             color: '#0891b2', bg: '#cffafe', icon: 'Wrench',          criticality: 'medium' },
  capital_equipment:    { label: 'Capital Equipment',    color: '#be185d', bg: '#fce7f3', icon: 'Cpu',             criticality: 'critical' },
};

const TIER_META: Record<SupplierTier, { label: string; color: string; bg: string }> = {
  strategic:    { label: 'Strategic',    color: '#7c3aed', bg: '#ede9fe' },
  preferred:    { label: 'Preferred',    color: '#4f46e5', bg: '#e0e7ff' },
  approved:     { label: 'Approved',     color: '#047857', bg: '#d1fae5' },
  conditional:  { label: 'Conditional',  color: '#d97706', bg: '#fef3c7' },
  probation:    { label: 'Probation',    color: '#dc2626', bg: '#fee2e2' },
};

const APPROVAL_STATUS_META: Record<ApprovalStatus, { label: string; color: string; bg: string }> = {
  pending:     { label: 'Pending',     color: '#2563eb', bg: '#dbeafe' },
  approved:    { label: 'Approved',    color: '#047857', bg: '#d1fae5' },
  conditional: { label: 'Conditional', color: '#d97706', bg: '#fef3c7' },
  probation:   { label: 'Probation',   color: '#dc2626', bg: '#fee2e2' },
  suspended:   { label: 'Suspended',   color: '#7c2d12', bg: '#fed7aa' },
  debarred:    { label: 'Debarred',    color: '#450a0a', bg: '#fee2e2' },
  in_review:   { label: 'In Review',   color: '#6b7280', bg: '#f3f4f6' },
};

const ONBOARDING_STAGE_META: Record<OnboardingStage, { label: string; color: string; order: number }> = {
  pre_qualification:    { label: 'Pre-Qualification',     color: '#6b7280', order: 0 },
  questionnaire:        { label: 'Questionnaire',         color: '#2563eb', order: 1 },
  document_collection:  { label: 'Document Collection',   color: '#0891b2', order: 2 },
  site_audit:           { label: 'Site Audit',            color: '#d97706', order: 3 },
  approval_review:      { label: 'Approval Review',       color: '#7c3aed', order: 4 },
  first_po:             { label: 'First PO',              color: '#be185d', order: 5 },
  completed:            { label: 'Completed',             color: '#047857', order: 6 },
  rejected:             { label: 'Rejected',              color: '#dc2626', order: 7 },
};

const AUDIT_TYPE_META: Record<AuditType, { label: string; color: string; description: string }> = {
  initial:           { label: 'Initial',          color: '#4f46e5', description: 'First audit before supplier approval' },
  routine:           { label: 'Routine',          color: '#0891b2', description: 'Scheduled recurring audit (annual/bi-annual)' },
  follow_up:         { label: 'Follow-up',        color: '#d97706', description: 'Verify CAPA closure for prior findings' },
  special:           { label: 'Special',          color: '#be185d', description: 'Triggered by quality incident or complaint' },
  surveillance:      { label: 'Surveillance',     color: '#7c3aed', description: 'ISO 9001 surveillance audit' },
  re_certification:  { label: 'Re-certification', color: '#047857', description: 'ISO 9001 re-certification (3-year cycle)' },
};

const AUDIT_STATUS_META: Record<AuditStatus, { label: string; color: string; bg: string }> = {
  scheduled:    { label: 'Scheduled',   color: '#2563eb', bg: '#dbeafe' },
  in_progress:  { label: 'In Progress', color: '#d97706', bg: '#fef3c7' },
  completed:    { label: 'Completed',   color: '#047857', bg: '#d1fae5' },
  cancelled:    { label: 'Cancelled',   color: '#7c2d12', bg: '#fed7aa' },
  postponed:    { label: 'Postponed',   color: '#6b7280', bg: '#f3f4f6' },
};

const AUDIT_OUTCOME_META: Record<AuditOutcome, { label: string; color: string }> = {
  pass:                    { label: 'Pass',                     color: '#047857' },
  conditional_pass:        { label: 'Conditional Pass',          color: '#0891b2' },
  minor_nonconformities:   { label: 'Minor Non-Conformities',    color: '#d97706' },
  major_nonconformities:   { label: 'Major Non-Conformities',    color: '#ea580c' },
  fail:                    { label: 'Fail',                      color: '#dc2626' },
};

const FINDING_SEVERITY_META: Record<FindingSeverity, { label: string; color: string; bg: string }> = {
  observation: { label: 'Observation', color: '#6b7280', bg: '#f3f4f6' },
  minor:       { label: 'Minor',       color: '#d97706', bg: '#fef3c7' },
  major:       { label: 'Major',       color: '#ea580c', bg: '#fed7aa' },
  critical:    { label: 'Critical',    color: '#dc2626', bg: '#fee2e2' },
};

const FINDING_STATUS_META: Record<FindingStatus, { label: string; color: string; bg: string }> = {
  open:                  { label: 'Open',                  color: '#2563eb', bg: '#dbeafe' },
  in_progress:           { label: 'In Progress',           color: '#d97706', bg: '#fef3c7' },
  pending_verification:  { label: 'Pending Verification',  color: '#7c3aed', bg: '#ede9fe' },
  closed:                { label: 'Closed',                color: '#047857', bg: '#d1fae5' },
  overdue:               { label: 'Overdue',               color: '#dc2626', bg: '#fee2e2' },
};

const FAI_STATUS_META: Record<FAIStatus, { label: string; color: string; bg: string }> = {
  pending:      { label: 'Pending',      color: '#2563eb', bg: '#dbeafe' },
  in_progress:  { label: 'In Progress',  color: '#d97706', bg: '#fef3c7' },
  passed:       { label: 'Passed',       color: '#047857', bg: '#d1fae5' },
  failed:       { label: 'Failed',       color: '#dc2626', bg: '#fee2e2' },
  conditional:  { label: 'Conditional',  color: '#0891b2', bg: '#cffafe' },
  waived:       { label: 'Waived',       color: '#6b7280', bg: '#f3f4f6' },
};

const SELF_ASSESSMENT_STATUS_META: Record<SelfAssessmentStatus, { label: string; color: string; bg: string }> = {
  not_sent:      { label: 'Not Sent',      color: '#6b7280', bg: '#f3f4f6' },
  sent:          { label: 'Sent',          color: '#2563eb', bg: '#dbeafe' },
  in_progress:   { label: 'In Progress',   color: '#d97706', bg: '#fef3c7' },
  submitted:     { label: 'Submitted',     color: '#7c3aed', bg: '#ede9fe' },
  reviewed:      { label: 'Reviewed',      color: '#047857', bg: '#d1fae5' },
  overdue:       { label: 'Overdue',       color: '#dc2626', bg: '#fee2e2' },
};

const RISK_LEVEL_META: Record<RiskLevel, { label: string; color: string; bg: string }> = {
  low:      { label: 'Low',      color: '#047857', bg: '#d1fae5' },
  medium:   { label: 'Medium',   color: '#d97706', bg: '#fef3c7' },
  high:     { label: 'High',     color: '#ea580c', bg: '#fed7aa' },
  critical: { label: 'Critical', color: '#dc2626', bg: '#fee2e2' },
};

// ----------------------------------------------------------------------------
// Data templates
// ----------------------------------------------------------------------------
const SUPPLIER_NAMES = [
  'Bharat Forge Ltd', 'Motherson Sumi Systems', 'Bosch Ltd (Pune)', 'Samvardhana Motherson',
  'Exide Industries', 'ZF Friedrichshafen India', 'TVS Group Components', 'Denso India',
  'Mando India Ltd', 'Gabriel India', 'Lumax Industries', 'Uno Minda',
  'Endurance Technologies', 'Suprajit Engineering', 'Craftsman Automation',
  'Rane Holdings', 'Wabco India', 'Brimix Plastics', 'Tata AutoComp Systems',
  'Mahindra CIE Automotive', 'Rockman Industries', 'Futuristic Polymers',
  'Asahi India Glass', 'Minda Rubber Industries', 'Subros Ltd',
  'Bharat Gears Ltd', 'Heico Locknut Pvt Ltd', 'Saint-Gobain India',
  'Schaeffler India', 'SKF India',
];

const SUPPLIER_CITIES = [
  { city: 'Pune', state: 'Maharashtra', country: 'India' },
  { city: 'Chennai', state: 'Tamil Nadu', country: 'India' },
  { city: 'Gurgaon', state: 'Haryana', country: 'India' },
  { city: 'Bangalore', state: 'Karnataka', country: 'India' },
  { city: 'Ahmedabad', state: 'Gujarat', country: 'India' },
  { city: 'Noida', state: 'Uttar Pradesh', country: 'India' },
  { city: 'Sanand', state: 'Gujarat', country: 'India' },
  { city: 'Halol', state: 'Gujarat', country: 'India' },
  { city: 'Hosur', state: 'Tamil Nadu', country: 'India' },
  { city: 'Manesar', state: 'Haryana', country: 'India' },
];

const CONTACT_NAMES = [
  'Rajesh Sharma', 'Anita Desai', 'Vikram Patel', 'Sunita Reddy', 'Manish Gupta',
  'Deepa Iyer', 'Suresh Pillai', 'Kavita Menon', 'Arun Khanna', 'Lakshmi Narayanan',
  'Sanjay Bhatia', 'Pooja Kulkarni', 'Ramesh Agarwal', 'Geeta Subramanian', 'Anil Mehta',
];

const AUDITOR_POOL = [
  'Anil Sharma (Lead Auditor)', 'Priya Nair (Lead Auditor)', 'Rajesh Kumar (Auditor)',
  'Sneha Patel (Auditor)', 'Vikram Singh (Lead Auditor)', 'Meera Iyer (Auditor)',
  'Arjun Reddy (Auditor)', 'Kavya Menon (Lead Auditor)', 'Sanjay Gupta (Auditor)',
  'Pooja Bhat (Auditor)',
];

const SKU_POOL = [
  { code: 'SKU-FRG-001', desc: 'Forged Steering Knuckle', cat: 'raw_material' as SupplierCategory },
  { code: 'SKU-COMP-101', desc: 'Brake Caliper Assembly', cat: 'components' as SupplierCategory },
  { code: 'SKU-COMP-205', desc: 'Alternator Stator', cat: 'components' as SupplierCategory },
  { code: 'SKU-PKG-301', desc: 'Corrugated Box 600x400x300', cat: 'packaging' as SupplierCategory },
  { code: 'SKU-PKG-302', desc: 'Wooden Pallet EP-2', cat: 'packaging' as SupplierCategory },
  { code: 'SKU-LOG-401', desc: 'Container Haulage Service', cat: 'logistics' as SupplierCategory },
  { code: 'SKU-SVC-501', desc: 'Calibration Services', cat: 'services' as SupplierCategory },
  { code: 'SKU-CE-601', desc: 'CNC Machining Center', cat: 'capital_equipment' as SupplierCategory },
  { code: 'SKU-FRG-002', desc: 'Forged Crankshaft', cat: 'raw_material' as SupplierCategory },
  { code: 'SKU-COMP-102', desc: 'Clutch Plate Assembly', cat: 'components' as SupplierCategory },
  { code: 'SKU-COMP-206', desc: 'Starter Motor Armature', cat: 'components' as SupplierCategory },
  { code: 'SKU-PKG-303', desc: 'Stretch Film Roll 500mm', cat: 'packaging' as SupplierCategory },
  { code: 'SKU-LOG-402', desc: 'Cold Chain Transport', cat: 'logistics' as SupplierCategory },
  { code: 'SKU-CE-602', desc: 'Hydraulic Press 200T', cat: 'capital_equipment' as SupplierCategory },
  { code: 'SKU-FRG-003', desc: 'Forged Connecting Rod', cat: 'raw_material' as SupplierCategory },
  { code: 'SKU-COMP-103', desc: 'Wheel Hub Assembly', cat: 'components' as SupplierCategory },
];

const DOCUMENT_TYPES = [
  'ISO 9001 Certificate', 'ISO 14001 Certificate', 'ISO 45001 Certificate',
  'IATF 16949 Certificate', 'GST Registration', 'PAN Card', 'MSME Certificate',
  'Factory License', 'Pollution Control Board NOC', 'Fire Safety Certificate',
  'Quality Manual', 'Process Flow Diagrams', 'PF/ESI Registration',
  'Bank Statement (3 months)', 'Audited Financial Statements',
  'Supplier Quality Agreement', 'NDA', 'Cybersecurity Policy',
];

const CHECKLIST_VERSIONS = ['AUDIT-CL-V3.2', 'AUDIT-CL-V3.1', 'AUDIT-CL-V3.0', 'AUDIT-CL-V2.4'];

const FINDING_CATEGORIES: { id: 'documentation' | 'process_control' | 'quality_system' | 'traceability' | 'calibration' | 'training' | 'environment' | 'safety' | 'data_integrity' | 'supplier_management'; label: string; clause: string }[] = [
  { id: 'documentation',     label: 'Documentation',          clause: 'ISO 9001 §7.5' },
  { id: 'process_control',   label: 'Process Control',        clause: 'ISO 9001 §8.5' },
  { id: 'quality_system',    label: 'Quality System',         clause: 'ISO 9001 §4.4' },
  { id: 'traceability',      label: 'Traceability',           clause: 'ISO 9001 §8.5.2' },
  { id: 'calibration',       label: 'Calibration',            clause: 'ISO 9001 §7.1.5' },
  { id: 'training',          label: 'Training',               clause: 'ISO 9001 §7.2' },
  { id: 'environment',       label: 'Environment',            clause: 'ISO 14001 §6' },
  { id: 'safety',            label: 'Safety',                 clause: 'ISO 45001 §6' },
  { id: 'data_integrity',    label: 'Data Integrity',         clause: 'ISO 9001 §7.5.3' },
  { id: 'supplier_management',label: 'Supplier Management',   clause: 'ISO 9001 §8.4' },
];

const FINDING_TEMPLATES: { category: 'documentation' | 'process_control' | 'quality_system' | 'traceability' | 'calibration' | 'training' | 'environment' | 'safety' | 'data_integrity' | 'supplier_management'; description: string; severity: FindingSeverity }[] = [
  { category: 'documentation', description: 'Quality manual does not reflect current org structure (Rev 2023 vs current 2026).', severity: 'minor' },
  { category: 'documentation', description: 'Three SOPs (SOP-014, SOP-022, SOP-031) missing revision history.', severity: 'observation' },
  { category: 'process_control', description: 'SPC charts not maintained for critical dimension CTQ-K01 (Crankshaft journal).', severity: 'major' },
  { category: 'process_control', description: 'In-process inspection frequency reduced from every 50 pcs to every 100 pcs without approval.', severity: 'major' },
  { category: 'quality_system', description: 'Last management review meeting held 14 months ago (required annually per SOP-001).', severity: 'minor' },
  { category: 'quality_system', description: 'Internal audit program incomplete: only 60% of planned audits conducted YTD.', severity: 'minor' },
  { category: 'traceability', description: 'Heat number not recorded on 3 of 25 inspected forgings (lot 24-A-112).', severity: 'major' },
  { category: 'traceability', description: 'Raw material COC missing for 2 incoming lots received on 12-Mar.', severity: 'critical' },
  { category: 'calibration', description: 'Vernier caliper (Asset ID CAL-014) calibration expired 15 days ago.', severity: 'minor' },
  { category: 'calibration', description: 'Three micrometers not in calibration register. Last calibration 18 months ago.', severity: 'major' },
  { category: 'training', description: 'Operator on line 3 (EMP-1142) not trained on revised SOP-022 (Rev F).', severity: 'minor' },
  { category: 'training', description: 'Forklift operator certification expired for 2 of 8 operators.', severity: 'major' },
  { category: 'environment', description: 'Hazardous waste storage area lacks secondary containment.', severity: 'critical' },
  { category: 'environment', description: 'EHS induction not completed for 4 new contract workers.', severity: 'minor' },
  { category: 'safety', description: 'LOTO (Lockout/Tagout) procedure not followed during maintenance on press P-2.', severity: 'critical' },
  { category: 'safety', description: 'Two operators observed without safety glasses in machining area.', severity: 'major' },
  { category: 'data_integrity', description: 'Quality records modified without audit trail in QMS system.', severity: 'critical' },
  { category: 'data_integrity', description: 'Backup of QMS database not verified for last 30 days.', severity: 'minor' },
  { category: 'supplier_management', description: 'Sub-supplier approval list not updated — 3 sub-suppliers active without quality agreement.', severity: 'major' },
  { category: 'supplier_management', description: 'Incoming inspection results not shared with sub-tier for failure trending.', severity: 'observation' },
];

// ----------------------------------------------------------------------------
// Generators
// ----------------------------------------------------------------------------
function generateSuppliers(count: number): Supplier[] {
  const suppliers: Supplier[] = [];
  for (let i = 0; i < count; i++) {
    const name = SUPPLIER_NAMES[i % SUPPLIER_NAMES.length];
    const city = SUPPLIER_CITIES[i % SUPPLIER_CITIES.length];
    const categories = Object.keys(CATEGORY_META) as SupplierCategory[];
    const category = categories[i % categories.length];
    const tierRoll = seededRand(i + 100);
    const tier: SupplierTier = tierRoll > 0.85 ? 'strategic'
                             : tierRoll > 0.65 ? 'preferred'
                             : tierRoll > 0.40 ? 'approved'
                             : tierRoll > 0.15 ? 'conditional'
                             : 'probation';
    const approvalRoll = seededRand(i + 200);
    const approvalStatus: ApprovalStatus = tier === 'strategic' ? 'approved'
                            : tier === 'preferred' ? 'approved'
                            : tier === 'approved' ? (approvalRoll > 0.85 ? 'conditional' : 'approved')
                            : tier === 'conditional' ? (approvalRoll > 0.7 ? 'suspended' : 'conditional')
                            : (approvalRoll > 0.5 ? 'debarred' : 'probation');
    const riskRoll = seededRand(i + 300);
    const riskLevel: RiskLevel = approvalStatus === 'debarred' || approvalStatus === 'suspended' ? 'critical'
                              : approvalStatus === 'probation' ? 'high'
                              : approvalStatus === 'conditional' ? (riskRoll > 0.5 ? 'high' : 'medium')
                              : tier === 'strategic' ? (riskRoll > 0.7 ? 'medium' : 'low')
                              : (riskRoll > 0.7 ? 'medium' : 'low');
    const onboardedDaysAgo = randInt(60, 2200, i + 400);
    const isFullyOnboarded = approvalStatus !== 'pending' && approvalStatus !== 'in_review';
    const onboardingStage: OnboardingStage = isFullyOnboarded ? 'completed'
                                          : approvalStatus === 'suspended' ? 'first_po'
                                          : approvalStatus === 'probation' ? 'first_po'
                                          : (['pre_qualification', 'questionnaire', 'document_collection', 'site_audit', 'approval_review'] as OnboardingStage[])[i % 5];
    const onboardingProgress = onboardingStage === 'completed' ? 100
                              : onboardingStage === 'rejected' ? 0
                              : (ONBOARDING_STAGE_META[onboardingStage].order + 1) * 15;
    const lastAuditDaysAgo = randInt(30, 400, i + 500);
    const lastAuditScore = isFullyOnboarded ? randInt(62, 96, i + 600) : null;
    const nextAuditDue = isFullyOnboarded ? daysAhead(randInt(1, 200, i + 700)).toISOString() : null;
    const openFindings = isFullyOnboarded ? randInt(0, 8, i + 800) : 0;
    const overdueFindings = isFullyOnboarded ? Math.min(openFindings, randInt(0, 3, i + 850)) : 0;
    const faiPending = isFullyOnboarded ? randInt(0, 4, i + 900) : 0;
    const selfAssessmentScore = isFullyOnboarded ? randInt(65, 95, i + 950) : null;
    const compositeScore = Math.round(
      ((lastAuditScore ?? 70) * 0.30) +
      ((selfAssessmentScore ?? 70) * 0.20) +
      ((openFindings === 0 ? 100 : Math.max(20, 100 - openFindings * 8)) * 0.20) +
      ((overdueFindings === 0 ? 100 : Math.max(0, 100 - overdueFindings * 20)) * 0.15) +
      ((faiPending === 0 ? 100 : 80) * 0.15)
    );

    suppliers.push({
      id: `SUP-${(i + 1).toString().padStart(4, '0')}`,
      supplierCode: `SUP/${String.fromCharCode(65 + (i % 26))}${(i + 1).toString().padStart(3, '0')}`,
      name,
      category,
      tier,
      approvalStatus,
      riskLevel,
      country: city.country,
      state: city.state,
      city: city.city,
      contactName: pick(CONTACT_NAMES, i + 1000),
      contactEmail: `procurement@${name.toLowerCase().replace(/[^a-z]/g, '')}.in`,
      contactPhone: `+91 ${randInt(70, 99, i + 1100)}${randInt(10000000, 99999999, i + 1150)}`,
      gstin: `${randInt(10, 99, i + 1200)}${pick(['ABCDE', 'PQRSW', 'LMNOP', 'XYZAB'], i + 1250)}${randInt(1000, 9999, i + 1300)}${randInt(1, 9, i + 1350)}${pick(['Z', 'X'], i + 1400)}`,
      pan: `${pick(['A', 'B', 'C', 'D'], i + 1450)}${pick(['A', 'B', 'C'], i + 1500)}${pick(['P', 'Q', 'R'], i + 1550)}${randInt(1000, 9999, i + 1600)}${pick(['A', 'B', 'C'], i + 1650)}`,
      msmeRegistered: i % 3 === 0,
      iso9001Certified: i % 5 !== 0,
      iso14001Certified: i % 4 === 0,
      iso45001Certified: i % 6 === 0,
      iatf16949Certified: i % 5 === 0,
      onboardingStage,
      onboardingProgress,
      onboardedDate: isFullyOnboarded ? daysAgo(onboardedDaysAgo).toISOString() : null,
      firstPODate: isFullyOnboarded ? daysAgo(randInt(1, onboardedDaysAgo - 30, i + 1700)).toISOString() : null,
      annualSpendInr: isFullyOnboarded ? randInt(500000, 25000000, i + 1800) : 0,
      activeSKUs: isFullyOnboarded ? randInt(2, 28, i + 1900) : 0,
      criticalityScore: randInt(30, 100, i + 2000),
      lastAuditDate: isFullyOnboarded ? daysAgo(lastAuditDaysAgo).toISOString() : null,
      lastAuditScore,
      nextAuditDue,
      openFindings,
      overdueFindings,
      faiPendingCount: faiPending,
      selfAssessmentScore,
      compositeScore,
    });
  }
  return suppliers;
}

function generateOnboardingApplications(suppliers: Supplier[]): OnboardingApplication[] {
  const inPipeline = suppliers.filter(s => s.approvalStatus === 'pending' || s.approvalStatus === 'in_review' || s.onboardingStage === 'first_po');
  const apps: OnboardingApplication[] = [];
  // Add some that are still in pipeline + a few recently completed for trend
  const recent = suppliers.filter(s => s.onboardingStage === 'completed').slice(0, 8);
  const all = [...inPipeline, ...recent].slice(0, 18);

  for (let i = 0; i < all.length; i++) {
    const s = all[i];
    const submittedDaysAgo = randInt(7, 180, i + 50);
    const stage = s.onboardingStage;
    const targetDays = randInt(45, 120, i + 100);
    const documentsRequired = randInt(8, 18, i + 150);
    const documentsReceived = stage === 'completed' ? documentsRequired : randInt(Math.floor(documentsRequired * 0.4), documentsRequired, i + 200);
    const documentsApproved = stage === 'completed' ? documentsRequired : Math.floor(documentsReceived * 0.7);
    const questionnaireSent = ['questionnaire', 'document_collection', 'site_audit', 'approval_review', 'first_po', 'completed'].includes(stage);
    const questionnaireReceived = ['document_collection', 'site_audit', 'approval_review', 'first_po', 'completed'].includes(stage);
    const questionnaireScore = questionnaireReceived ? randInt(55, 92, i + 250) : null;
    const siteAuditScheduled = ['site_audit', 'approval_review', 'first_po', 'completed'].includes(stage);
    const siteAuditDate = siteAuditScheduled ? daysAgo(randInt(1, 60, i + 300)).toISOString() : null;
    const siteAuditScore = ['approval_review', 'first_po', 'completed'].includes(stage) ? randInt(60, 95, i + 350) : null;
    const approvalCommitteeReview = ['approval_review', 'first_po', 'completed'].includes(stage);
    const approvalDecision: 'pending' | 'approved' | 'conditional' | 'rejected' =
      stage === 'completed' ? 'approved'
      : stage === 'first_po' ? 'conditional'
      : stage === 'rejected' ? 'rejected'
      : 'pending';
    const riskAssessmentScore = siteAuditScore !== null ? randInt(45, 90, i + 400) : null;
    const riskLevel: RiskLevel = riskAssessmentScore !== null
      ? (riskAssessmentScore >= 80 ? 'low' : riskAssessmentScore >= 60 ? 'medium' : riskAssessmentScore >= 40 ? 'high' : 'critical')
      : 'medium';
    apps.push({
      id: `APP-${(i + 1).toString().padStart(4, '0')}`,
      applicationCode: `OBA/${TODAY.getFullYear()}/${(i + 1).toString().padStart(3, '0')}`,
      supplierName: s.name,
      category: s.category,
      stage,
      stageProgress: s.onboardingProgress,
      submittedDate: daysAgo(submittedDaysAgo).toISOString(),
      targetCompletionDate: daysAhead(targetDays - submittedDaysAgo).toISOString(),
      daysInPipeline: submittedDaysAgo,
      sponsorName: pick(CONTACT_NAMES, i + 450),
      sponsorDepartment: pick(['Operations', 'Quality', 'Engineering', 'Procurement'], i + 500),
      initiatedBy: pick(CONTACT_NAMES, i + 550),
      procurementCategoryManager: pick(CONTACT_NAMES, i + 600),
      documentsRequired,
      documentsReceived,
      documentsApproved,
      questionnaireSent,
      questionnaireReceived,
      questionnaireScore,
      siteAuditScheduled,
      siteAuditDate,
      siteAuditScore,
      approvalCommitteeReview,
      approvalDecision,
      riskAssessmentScore,
      riskLevel,
      rejectionReason: stage === 'rejected' ? 'Insufficient quality system documentation and unresolved major non-conformities during site audit.' : null,
      notes: stage === 'completed' ? 'Onboarding completed successfully. Added to approved supplier list.' : 'In progress — see stage details.',
    });
  }
  return apps;
}

function generateAuditSchedules(suppliers: Supplier[], count: number): AuditSchedule[] {
  const eligibleSuppliers = suppliers.filter(s => s.onboardingStage === 'completed');
  const audits: AuditSchedule[] = [];
  for (let i = 0; i < count; i++) {
    const supplier = eligibleSuppliers[i % Math.max(eligibleSuppliers.length, 1)] || suppliers[0];
    const auditTypes = Object.keys(AUDIT_TYPE_META) as AuditType[];
    const auditType = auditTypes[i % auditTypes.length];
    const scheduledDaysOffset = randInt(-180, 60, i + 50);
    const scheduledDate = scheduledDaysOffset >= 0 ? daysAhead(scheduledDaysOffset) : daysAgo(-scheduledDaysOffset);
    const isPast = scheduledDaysOffset < 0;
    const isInProgress = scheduledDaysOffset >= 0 && scheduledDaysOffset <= 7;
    const isFuture = scheduledDaysOffset > 7;
    const status: AuditStatus = isFuture ? 'scheduled' : isInProgress ? 'in_progress' : (seededRand(i + 100) > 0.95 ? 'cancelled' : 'completed');
    const durationDays = auditType === 'initial' || auditType === 're_certification' ? randInt(2, 4, i + 150) : randInt(1, 2, i + 200);
    const completedDate = status === 'completed' ? daysAgo(randInt(0, -scheduledDaysOffset, i + 250)).toISOString() : null;
    const totalQuestions = randInt(45, 120, i + 300);
    const questionsCompleted = status === 'completed' ? totalQuestions : status === 'in_progress' ? Math.floor(totalQuestions * 0.6) : 0;
    const outcome: AuditOutcome | null = status === 'completed'
      ? (seededRand(i + 350) > 0.85 ? 'fail' : seededRand(i + 360) > 0.7 ? 'major_nonconformities' : seededRand(i + 370) > 0.5 ? 'minor_nonconformities' : seededRand(i + 380) > 0.3 ? 'conditional_pass' : 'pass')
      : null;
    const score = status === 'completed' ? (outcome === 'fail' ? randInt(40, 60, i + 400) : outcome === 'major_nonconformities' ? randInt(60, 72, i + 410) : outcome === 'minor_nonconformities' ? randInt(72, 82, i + 420) : outcome === 'conditional_pass' ? randInt(82, 88, i + 430) : randInt(88, 97, i + 440)) : null;
    const criticalFindings = status === 'completed' ? (outcome === 'fail' ? randInt(2, 5, i + 450) : outcome === 'major_nonconformities' ? randInt(0, 2, i + 460) : 0) : 0;
    const majorFindings = status === 'completed' ? (outcome === 'fail' ? randInt(3, 8, i + 470) : outcome === 'major_nonconformities' ? randInt(2, 5, i + 480) : outcome === 'minor_nonconformities' ? randInt(0, 2, i + 490) : 0) : 0;
    const minorFindings = status === 'completed' ? (outcome === 'pass' ? randInt(0, 3, i + 500) : randInt(2, 8, i + 510)) : 0;
    const observations = status === 'completed' ? randInt(1, 8, i + 520) : 0;
    const findingsCount = criticalFindings + majorFindings + minorFindings + observations;
    const facility = `${supplier.city} Manufacturing Plant`;
    audits.push({
      id: `AUD-${(i + 1).toString().padStart(4, '0')}`,
      auditCode: `AUD/${TODAY.getFullYear()}/${(i + 1).toString().padStart(3, '0')}`,
      supplierId: supplier.id,
      supplierName: supplier.name,
      auditType,
      status,
      scheduledDate: scheduledDate.toISOString(),
      completedDate,
      daysToAudit: Math.round((scheduledDate.getTime() - TODAY.getTime()) / MS_PER_DAY),
      durationDays,
      leadAuditor: pick(AUDITOR_POOL, i + 550),
      auditTeamSize: randInt(2, 5, i + 600),
      auditScope: pick([
        'Quality management system audit (ISO 9001:2015 §4-10)',
        'Process audit: forging, machining, assembly',
        'Product audit: critical-to-quality dimensions + functional test',
        'System audit: documentation, training, calibration, supplier mgmt',
        'Surveillance audit: focus on CAPA closure + mgmt review',
        'Special audit: customer complaint investigation (CC-2026-114)',
      ], i + 650),
      auditLocation: pick(['on_site', 'remote', 'hybrid'], i + 700) as 'on_site' | 'remote' | 'hybrid',
      facility,
      checklistVersion: pick(CHECKLIST_VERSIONS, i + 750),
      totalQuestions,
      questionsCompleted,
      outcome,
      score,
      findingsCount,
      criticalFindings,
      majorFindings,
      minorFindings,
      observations,
      capasLinked: findingsCount > 0 ? randInt(0, findingsCount, i + 800) : 0,
      reportPath: status === 'completed' ? `audit-reports/AUD-${(i + 1).toString().padStart(4, '0')}.pdf` : null,
      nextAuditDate: status === 'completed' ? daysAhead(randInt(180, 365, i + 850)).toISOString() : null,
    });
  }
  return audits;
}

function generateFindings(audits: AuditSchedule[]): AuditFinding[] {
  const findings: AuditFinding[] = [];
  let fId = 0;
  for (const audit of audits) {
    if (audit.status !== 'completed') continue;
    const numFindings = audit.criticalFindings + audit.majorFindings + audit.minorFindings + audit.observations;
    for (let i = 0; i < numFindings; i++) {
      fId++;
      let severity: FindingSeverity;
      if (i < audit.criticalFindings) severity = 'critical';
      else if (i < audit.criticalFindings + audit.majorFindings) severity = 'major';
      else if (i < audit.criticalFindings + audit.majorFindings + audit.minorFindings) severity = 'minor';
      else severity = 'observation';
      const template = FINDING_TEMPLATES[fId % FINDING_TEMPLATES.length];
      const identifiedDate = audit.completedDate!;
      const dueDaysOffset = severity === 'critical' ? 14 : severity === 'major' ? 30 : severity === 'minor' ? 60 : 90;
      const dueDate = new Date(new Date(identifiedDate).getTime() + dueDaysOffset * MS_PER_DAY);
      const daysToDue = Math.round((dueDate.getTime() - TODAY.getTime()) / MS_PER_DAY);
      const isClosed = seededRand(fId + 50) > 0.6;
      const isOverdue = !isClosed && daysToDue < 0;
      const status: FindingStatus = isClosed ? 'closed' : isOverdue ? 'overdue' : seededRand(fId + 60) > 0.5 ? 'in_progress' : seededRand(fId + 70) > 0.5 ? 'pending_verification' : 'open';
      const closedDate = isClosed ? daysAgo(randInt(1, 30, fId + 80)).toISOString() : null;
      const catMeta = FINDING_CATEGORIES.find(c => c.id === template.category)!;
      findings.push({
        id: `FND-${fId.toString().padStart(4, '0')}`,
        findingCode: `${audit.auditCode.replace('/', '-')}-F${(i + 1).toString().padStart(2, '0')}`,
        auditId: audit.id,
        auditCode: audit.auditCode,
        supplierId: audit.supplierId,
        supplierName: audit.supplierName,
        severity,
        status,
        category: template.category,
        clauseReference: catMeta.clause,
        description: template.description,
        identifiedDate,
        dueDate: dueDate.toISOString(),
        daysToDue,
        closedDate,
        rootCause: isClosed ? pick([
          'Inadequate training program documentation.',
          'Procedure not updated after process change.',
          'Resource constraint during peak period.',
          'Communication gap between quality and production teams.',
          'Calibration scheduling tool not enforced.',
        ], fId + 90) : null,
        correctiveAction: isClosed ? pick([
          'Updated SOP and retrained all affected operators.',
          'Re-calibrated all instruments and updated register.',
          'Implemented daily SPC chart review by shift supervisor.',
          'Added automated alerts for upcoming calibration due dates.',
          'Conducted management review with full attendance.',
        ], fId + 100) : null,
        preventiveAction: isClosed ? pick([
          'Added to monthly internal audit checklist.',
          'Integrated with LMS for auto-training triggers.',
          'Added dashboard KPI for real-time monitoring.',
          'Procedure revised to require quarterly review.',
        ], fId + 110) : null,
        capapId: isClosed ? `CAPA-${randInt(100, 999, fId + 120)}` : null,
        verificationMethod: isClosed ? pick(['document_review', 'on_site_verification', 'next_audit', 'evidence_submission'], fId + 130) as 'document_review' | 'on_site_verification' | 'next_audit' | 'evidence_submission' : null,
        verifiedBy: isClosed ? pick(AUDITOR_POOL, fId + 140) : null,
        owner: pick(CONTACT_NAMES, fId + 150),
      });
    }
  }
  return findings;
}

function generateFAIs(suppliers: Supplier[], count: number): FirstArticleInspection[] {
  const eligible = suppliers.filter(s => s.onboardingStage === 'completed');
  const fais: FirstArticleInspection[] = [];
  for (let i = 0; i < count; i++) {
    const supplier = eligible[i % Math.max(eligible.length, 1)] || suppliers[0];
    const sku = SKU_POOL[i % SKU_POOL.length];
    const requestDaysAgo = randInt(1, 90, i + 50);
    const statusRoll = seededRand(i + 100);
    let status: FAIStatus;
    let receivedDate: string | null;
    let inspectionDate: string | null;
    let completedDate: string | null;
    let dimensional: 'pending' | 'in_progress' | 'passed' | 'failed' | 'na';
    let material: 'pending' | 'received' | 'missing' | 'na';
    let functional: 'pending' | 'passed' | 'failed' | 'na';
    let visual: 'pending' | 'passed' | 'failed';
    let packaging: 'pending' | 'passed' | 'failed';
    let documentation: 'pending' | 'passed' | 'failed';
    let overall: 'pending' | 'passed' | 'failed' | 'conditional' | 'waived';
    let deviationCount: number;
    let criticalDeviations: number;
    let approvedBy: string | null;
    let nextAction: string;

    if (statusRoll > 0.7) {
      status = 'passed';
      receivedDate = daysAgo(requestDaysAgo - 3).toISOString();
      inspectionDate = daysAgo(requestDaysAgo - 5).toISOString();
      completedDate = daysAgo(requestDaysAgo - 10).toISOString();
      dimensional = 'passed'; material = 'received'; functional = 'passed';
      visual = 'passed'; packaging = 'passed'; documentation = 'passed';
      overall = 'passed';
      deviationCount = randInt(0, 2, i + 200);
      criticalDeviations = 0;
      approvedBy = pick(AUDITOR_POOL, i + 250);
      nextAction = 'Approved for production use. Monitor first 3 lots.';
    } else if (statusRoll > 0.5) {
      status = 'in_progress';
      receivedDate = daysAgo(requestDaysAgo - 1).toISOString();
      inspectionDate = daysAgo(randInt(0, 1, i + 300)).toISOString();
      completedDate = null;
      dimensional = 'in_progress'; material = 'received'; functional = 'pending';
      visual = 'in_progress'; packaging = 'pending'; documentation = 'passed';
      overall = 'pending';
      deviationCount = 0;
      criticalDeviations = 0;
      approvedBy = null;
      nextAction = 'Complete dimensional inspection and functional test.';
    } else if (statusRoll > 0.35) {
      status = 'failed';
      receivedDate = daysAgo(requestDaysAgo - 2).toISOString();
      inspectionDate = daysAgo(requestDaysAgo - 5).toISOString();
      completedDate = daysAgo(requestDaysAgo - 7).toISOString();
      dimensional = 'failed'; material = 'received'; functional = 'failed';
      visual = 'failed'; packaging = 'passed'; documentation = 'passed';
      overall = 'failed';
      deviationCount = randInt(3, 9, i + 350);
      criticalDeviations = randInt(1, 3, i + 400);
      approvedBy = null;
      nextAction = 'Reject FAI. Supplier must submit corrective action plan within 14 days.';
    } else if (statusRoll > 0.2) {
      status = 'conditional';
      receivedDate = daysAgo(requestDaysAgo - 2).toISOString();
      inspectionDate = daysAgo(requestDaysAgo - 5).toISOString();
      completedDate = daysAgo(requestDaysAgo - 7).toISOString();
      dimensional = 'passed'; material = 'received'; functional = 'passed';
      visual = 'passed'; packaging = 'failed'; documentation = 'passed';
      overall = 'conditional';
      deviationCount = randInt(1, 3, i + 450);
      criticalDeviations = 0;
      approvedBy = pick(AUDITOR_POOL, i + 500);
      nextAction = 'Conditional approval — packaging must be re-qualified within 30 days.';
    } else if (statusRoll > 0.1) {
      status = 'pending';
      receivedDate = null;
      inspectionDate = null;
      completedDate = null;
      dimensional = 'pending'; material = 'pending'; functional = 'pending';
      visual = 'pending'; packaging = 'pending'; documentation = 'pending';
      overall = 'pending';
      deviationCount = 0;
      criticalDeviations = 0;
      approvedBy = null;
      nextAction = 'Awaiting sample receipt from supplier.';
    } else {
      status = 'waived';
      receivedDate = daysAgo(requestDaysAgo - 2).toISOString();
      inspectionDate = null;
      completedDate = daysAgo(requestDaysAgo - 3).toISOString();
      dimensional = 'na'; material = 'na'; functional = 'na';
      visual = 'pending'; packaging = 'pending'; documentation = 'passed';
      overall = 'waived';
      deviationCount = 0;
      criticalDeviations = 0;
      approvedBy = pick(AUDITOR_POOL, i + 550);
      nextAction = 'FAI waived — same SKU from existing approved supplier.';
    }

    fais.push({
      id: `FAI-${(i + 1).toString().padStart(4, '0')}`,
      faiCode: `FAI/${TODAY.getFullYear()}/${(i + 1).toString().padStart(3, '0')}`,
      supplierId: supplier.id,
      supplierName: supplier.name,
      skuCode: sku.code,
      skuDescription: sku.desc,
      category: sku.cat,
      status,
      requestDate: daysAgo(requestDaysAgo).toISOString(),
      receivedDate,
      inspectionDate,
      completedDate,
      daysInProcess: status === 'pending' ? requestDaysAgo : (completedDate ? Math.round((new Date(completedDate).getTime() - new Date(daysAgo(requestDaysAgo).toISOString()).getTime()) / MS_PER_DAY) : requestDaysAgo),
      inspector: pick(AUDITOR_POOL, i + 600),
      inspectionLocation: pick(['WH1 QA Lab', 'WH3 Inspection Bay', 'Supplier Site', 'Third-party Lab Pune'], i + 650),
      sampleSize: randInt(3, 15, i + 700),
      drawingRev: `Rev ${pick(['A', 'B', 'C', 'D', 'E'], i + 750)}`,
      specificationRev: `Rev ${pick(['1.0', '1.1', '2.0', '2.1', '3.0'], i + 800)}`,
      dimensionalInspection: dimensional,
      materialCertification: material,
      functionalTest: functional,
      visualInspection: visual,
      packagingInspection: packaging,
      documentationReview: documentation,
      overallResult: overall,
      deviationCount,
      criticalDeviations,
      reportPath: completedDate ? `fai-reports/FAI-${(i + 1).toString().padStart(4, '0')}.pdf` : null,
      approvedBy,
      nextAction,
    });
  }
  return fais;
}

function generateSelfAssessments(suppliers: Supplier[], count: number): SelfAssessment[] {
  const eligible = suppliers.filter(s => s.onboardingStage === 'completed');
  const assessments: SelfAssessment[] = [];
  for (let i = 0; i < count; i++) {
    const supplier = eligible[i % Math.max(eligible.length, 1)] || suppliers[0];
    const sentDaysAgo = randInt(30, 180, i + 50);
    const dueDaysFromSent = 30;
    const dueDate = daysAgo(sentDaysAgo - dueDaysFromSent);
    const daysToDue = Math.round((dueDate.getTime() - TODAY.getTime()) / MS_PER_DAY);
    const statusRoll = seededRand(i + 100);
    let status: SelfAssessmentStatus;
    let submittedDate: string | null = null;
    let reviewDate: string | null = null;
    let reviewer: string | null = null;
    let qualityScore: number | null = null;
    let deliveryScore: number | null = null;
    let costScore: number | null = null;
    let sustainabilityScore: number | null = null;
    let complianceScore: number | null = null;
    let overallScore: number | null = null;
    let deviationFromInternal: number | null = null;
    let attestationSigned = false;
    let attachmentsUploaded = 0;
    let notes: string;

    if (statusRoll > 0.6) {
      status = 'reviewed';
      submittedDate = daysAgo(sentDaysAgo - 20).toISOString();
      reviewDate = daysAgo(randInt(1, 10, i + 150)).toISOString();
      reviewer = pick(AUDITOR_POOL, i + 200);
      qualityScore = randInt(70, 95, i + 250);
      deliveryScore = randInt(75, 95, i + 300);
      costScore = randInt(70, 90, i + 350);
      sustainabilityScore = randInt(60, 90, i + 400);
      complianceScore = randInt(75, 95, i + 450);
      overallScore = Math.round((qualityScore + deliveryScore + costScore + sustainabilityScore + complianceScore) / 5);
      deviationFromInternal = randInt(-15, 15, i + 500);
      attestationSigned = true;
      attachmentsUploaded = randInt(3, 12, i + 550);
      notes = deviationFromInternal > 5 ? 'Supplier self-assessment higher than internal audit — investigate gap.' : deviationFromInternal < -5 ? 'Self-assessment conservative vs internal audit.' : 'Self-assessment aligned with internal audit results.';
    } else if (statusRoll > 0.4) {
      status = 'submitted';
      submittedDate = daysAgo(randInt(1, 10, i + 600)).toISOString();
      qualityScore = randInt(70, 95, i + 650);
      deliveryScore = randInt(75, 95, i + 700);
      costScore = randInt(70, 90, i + 750);
      sustainabilityScore = randInt(60, 90, i + 800);
      complianceScore = randInt(75, 95, i + 850);
      overallScore = Math.round((qualityScore + deliveryScore + costScore + sustainabilityScore + complianceScore) / 5);
      attestationSigned = true;
      attachmentsUploaded = randInt(3, 10, i + 900);
      notes = 'Pending reviewer assignment.';
    } else if (statusRoll > 0.2) {
      status = 'in_progress';
      notes = 'Supplier started but not yet submitted.';
    } else if (statusRoll > 0.1) {
      status = 'sent';
      notes = 'Awaiting supplier response.';
    } else {
      status = 'overdue';
      notes = 'Overdue — procurement to follow up with supplier.';
    }

    assessments.push({
      id: `SA-${(i + 1).toString().padStart(4, '0')}`,
      assessmentCode: `SA/${TODAY.getFullYear()}/${(i + 1).toString().padStart(3, '0')}`,
      supplierId: supplier.id,
      supplierName: supplier.name,
      status,
      sentDate: daysAgo(sentDaysAgo).toISOString(),
      dueDate: dueDate.toISOString(),
      submittedDate,
      daysToDue,
      reviewer,
      reviewDate,
      qualityScore,
      deliveryScore,
      costScore,
      sustainabilityScore,
      complianceScore,
      overallScore,
      deviationFromInternal,
      attestationSigned,
      attachmentsUploaded,
      notes,
    });
  }
  return assessments;
}

function generateScorecards(suppliers: Supplier[]): SupplierScorecard[] {
  const eligible = suppliers.filter(s => s.onboardingStage === 'completed');
  const scorecards = eligible.map((s, i) => {
    const qualityScore = s.lastAuditScore ?? randInt(70, 95, i + 100);
    const deliveryScore = randInt(75, 98, i + 200);
    const costScore = randInt(70, 92, i + 300);
    const auditScore = s.lastAuditScore ?? 70;
    const riskScore = s.riskLevel === 'low' ? randInt(85, 95, i + 400)
                    : s.riskLevel === 'medium' ? randInt(65, 80, i + 400)
                    : s.riskLevel === 'high' ? randInt(40, 60, i + 400)
                    : randInt(20, 40, i + 400);
    const compositeScore = Math.round((qualityScore * 0.25) + (deliveryScore * 0.25) + (costScore * 0.20) + (auditScore * 0.20) + (riskScore * 0.10));
    return {
      supplierId: s.id,
      supplierName: s.name,
      category: s.category,
      tier: s.tier,
      approvalStatus: s.approvalStatus,
      qualityScore,
      deliveryScore,
      costScore,
      auditScore,
      riskScore,
      compositeScore,
      rank: 0, // assigned after sorting
      annualSpendInr: s.annualSpendInr,
      trendVsLastQuarter: randInt(-8, 12, i + 500),
    };
  });
  scorecards.sort((a, b) => b.compositeScore - a.compositeScore);
  scorecards.forEach((s, i) => { s.rank = i + 1; });
  return scorecards;
}

// ----------------------------------------------------------------------------
// KPI computation
// ----------------------------------------------------------------------------
interface KPIs {
  totalSuppliers: number;
  activeSuppliers: number;
  onboardingInPipeline: number;
  approvedSuppliers: number;
  conditionalSuppliers: number;
  probationSuppliers: number;
  suspendedSuppliers: number;
  debarredSuppliers: number;
  strategicSuppliers: number;
  preferredSuppliers: number;
  criticalRiskSuppliers: number;
  highRiskSuppliers: number;
  auditsScheduledThisYear: number;
  auditsCompletedThisYear: number;
  auditsOnTrack: number;
  auditsOverdue: number;
  openFindings: number;
  overdueFindings: number;
  criticalFindings: number;
  majorFindings: number;
  faiPending: number;
  faiInProgress: number;
  faiPassed: number;
  faiFailed: number;
  faiPassRate: number;
  selfAssessmentSent: number;
  selfAssessmentSubmitted: number;
  selfAssessmentOverdue: number;
  selfAssessmentResponseRate: number;
  averageCompositeScore: number;
  averageAuditScore: number;
  totalAnnualSpend: number;
  iso_8_4_compliance: number;
  compositeEffectiveness: number;
}

function computeKPIs(
  suppliers: Supplier[],
  apps: OnboardingApplication[],
  audits: AuditSchedule[],
  findings: AuditFinding[],
  fais: FirstArticleInspection[],
  assessments: SelfAssessment[],
  scorecards: SupplierScorecard[],
): KPIs {
  const activeSuppliers = suppliers.filter(s => ['approved', 'conditional', 'probation'].includes(s.approvalStatus)).length;
  const onboardingInPipeline = apps.filter(a => a.stage !== 'completed' && a.stage !== 'rejected').length;
  const approvedSuppliers = suppliers.filter(s => s.approvalStatus === 'approved').length;
  const conditionalSuppliers = suppliers.filter(s => s.approvalStatus === 'conditional').length;
  const probationSuppliers = suppliers.filter(s => s.approvalStatus === 'probation').length;
  const suspendedSuppliers = suppliers.filter(s => s.approvalStatus === 'suspended').length;
  const debarredSuppliers = suppliers.filter(s => s.approvalStatus === 'debarred').length;
  const strategicSuppliers = suppliers.filter(s => s.tier === 'strategic').length;
  const preferredSuppliers = suppliers.filter(s => s.tier === 'preferred').length;
  const criticalRiskSuppliers = suppliers.filter(s => s.riskLevel === 'critical').length;
  const highRiskSuppliers = suppliers.filter(s => s.riskLevel === 'high').length;

  const thisYear = TODAY.getFullYear();
  const auditsThisYear = audits.filter(a => new Date(a.scheduledDate).getFullYear() === thisYear);
  const auditsScheduledThisYear = auditsThisYear.length;
  const auditsCompletedThisYear = auditsThisYear.filter(a => a.status === 'completed').length;
  const auditsOnTrack = auditsThisYear.filter(a => a.status === 'scheduled' || a.status === 'in_progress' || a.status === 'completed').length;
  const auditsOverdue = audits.filter(a => a.status === 'scheduled' && new Date(a.scheduledDate).getTime() < TODAY.getTime()).length;

  const openFindings = findings.filter(f => f.status !== 'closed').length;
  const overdueFindings = findings.filter(f => f.status === 'overdue').length;
  const criticalFindings = findings.filter(f => f.severity === 'critical' && f.status !== 'closed').length;
  const majorFindings = findings.filter(f => f.severity === 'major' && f.status !== 'closed').length;

  const faiPending = fais.filter(f => f.status === 'pending').length;
  const faiInProgress = fais.filter(f => f.status === 'in_progress').length;
  const faiPassed = fais.filter(f => f.status === 'passed').length;
  const faiFailed = fais.filter(f => f.status === 'failed').length;
  const faiPassRate = (faiPassed + faiFailed) > 0 ? Math.round((faiPassed / (faiPassed + faiFailed)) * 100) : 0;

  const selfAssessmentSent = assessments.filter(a => a.status !== 'not_sent').length;
  const selfAssessmentSubmitted = assessments.filter(a => ['submitted', 'reviewed'].includes(a.status)).length;
  const selfAssessmentOverdue = assessments.filter(a => a.status === 'overdue').length;
  const selfAssessmentResponseRate = selfAssessmentSent > 0 ? Math.round((selfAssessmentSubmitted / selfAssessmentSent) * 100) : 0;

  const completedScorecards = scorecards.length;
  const averageCompositeScore = completedScorecards > 0 ? Math.round(scorecards.reduce((s, sc) => s + sc.compositeScore, 0) / completedScorecards) : 0;
  const completedAudits = audits.filter(a => a.status === 'completed' && a.score !== null);
  const averageAuditScore = completedAudits.length > 0 ? Math.round(completedAudits.reduce((s, a) => s + (a.score ?? 0), 0) / completedAudits.length) : 0;
  const totalAnnualSpend = suppliers.reduce((s, sup) => s + sup.annualSpendInr, 0);

  // ISO 9001 §8.4 compliance
  const iso8_4_1 = activeSuppliers > 0 ? Math.round((approvedSuppliers / activeSuppliers) * 100) : 0; // approved suppliers
  const iso8_4_2 = auditsScheduledThisYear > 0 ? Math.round((auditsCompletedThisYear / auditsScheduledThisYear) * 100) : 0; // audits completed
  const iso8_4_3 = openFindings > 0 ? Math.round(((openFindings - overdueFindings) / openFindings) * 100) : 100; // findings not overdue
  const iso_8_4_compliance = Math.round((iso8_4_1 + iso8_4_2 + iso8_4_3) / 3);
  const compositeEffectiveness = Math.round(
    (averageCompositeScore * 0.25) +
    (averageAuditScore * 0.20) +
    (faiPassRate * 0.15) +
    (selfAssessmentResponseRate * 0.15) +
    (Math.min(100, 100 - overdueFindings * 5) * 0.15) +
    (Math.min(100, 100 - criticalFindings * 10) * 0.10)
  );

  return {
    totalSuppliers: suppliers.length,
    activeSuppliers,
    onboardingInPipeline,
    approvedSuppliers,
    conditionalSuppliers,
    probationSuppliers,
    suspendedSuppliers,
    debarredSuppliers,
    strategicSuppliers,
    preferredSuppliers,
    criticalRiskSuppliers,
    highRiskSuppliers,
    auditsScheduledThisYear,
    auditsCompletedThisYear,
    auditsOnTrack,
    auditsOverdue,
    openFindings,
    overdueFindings,
    criticalFindings,
    majorFindings,
    faiPending,
    faiInProgress,
    faiPassed,
    faiFailed,
    faiPassRate,
    selfAssessmentSent,
    selfAssessmentSubmitted,
    selfAssessmentOverdue,
    selfAssessmentResponseRate,
    averageCompositeScore,
    averageAuditScore,
    totalAnnualSpend,
    iso_8_4_compliance,
    compositeEffectiveness,
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
    // Use mock warehouse data (existing pattern)
    const warehouses = mockWarehouses.slice(0, 8).map((w, i) => ({
      id: w.id,
      code: `WH${i + 1}`,
      name: w.name,
      city: w.city,
    }));

    const suppliers = generateSuppliers(30);
    const apps = generateOnboardingApplications(suppliers);
    const audits = generateAuditSchedules(suppliers, 40);
    const findings = generateFindings(audits);
    const fais = generateFAIs(suppliers, 30);
    const assessments = generateSelfAssessments(suppliers, 20);
    const scorecards = generateScorecards(suppliers);

    const kpis = computeKPIs(suppliers, apps, audits, findings, fais, assessments, scorecards);

    // Charts and breakdowns
    const suppliersByTier = (Object.keys(TIER_META) as SupplierTier[]).map(t => ({
      tier: t, label: TIER_META[t].label, color: TIER_META[t].color,
      count: suppliers.filter(s => s.tier === t).length,
    }));
    const suppliersByApproval = (Object.keys(APPROVAL_STATUS_META) as ApprovalStatus[]).map(a => ({
      approval: a, label: APPROVAL_STATUS_META[a].label, color: APPROVAL_STATUS_META[a].color,
      count: suppliers.filter(s => s.approvalStatus === a).length,
    }));
    const suppliersByCategory = (Object.keys(CATEGORY_META) as SupplierCategory[]).map(c => ({
      category: c, label: CATEGORY_META[c].label, color: CATEGORY_META[c].color,
      count: suppliers.filter(s => s.category === c).length,
      spend: suppliers.filter(s => s.category === c).reduce((sum, s) => sum + s.annualSpendInr, 0),
    }));
    const suppliersByRisk = (Object.keys(RISK_LEVEL_META) as RiskLevel[]).map(r => ({
      risk: r, label: RISK_LEVEL_META[r].label, color: RISK_LEVEL_META[r].color,
      count: suppliers.filter(s => s.riskLevel === r).length,
    }));

    const auditsByType = (Object.keys(AUDIT_TYPE_META) as AuditType[]).map(t => ({
      type: t, label: AUDIT_TYPE_META[t].label, color: AUDIT_TYPE_META[t].color,
      count: audits.filter(a => a.auditType === t).length,
    }));
    const auditsByStatus = (Object.keys(AUDIT_STATUS_META) as AuditStatus[]).map(s => ({
      status: s, label: AUDIT_STATUS_META[s].label, color: AUDIT_STATUS_META[s].color,
      count: audits.filter(a => a.status === s).length,
    }));
    const auditsByOutcome = (Object.keys(AUDIT_OUTCOME_META) as AuditOutcome[]).map(o => ({
      outcome: o, label: AUDIT_OUTCOME_META[o].label, color: AUDIT_OUTCOME_META[o].color,
      count: audits.filter(a => a.outcome === o).length,
    }));

    const findingsBySeverity = (Object.keys(FINDING_SEVERITY_META) as FindingSeverity[]).map(s => ({
      severity: s, label: FINDING_SEVERITY_META[s].label, color: FINDING_SEVERITY_META[s].color,
      count: findings.filter(f => f.severity === s).length,
      open: findings.filter(f => f.severity === s && f.status !== 'closed').length,
    }));
    const findingsByStatus = (Object.keys(FINDING_STATUS_META) as FindingStatus[]).map(s => ({
      status: s, label: FINDING_STATUS_META[s].label, color: FINDING_STATUS_META[s].color,
      count: findings.filter(f => f.status === s).length,
    }));
    const findingsByCategory = FINDING_CATEGORIES.map(c => ({
      category: c.id, label: c.label, clause: c.clause,
      count: findings.filter(f => f.category === c.id).length,
      open: findings.filter(f => f.category === c.id && f.status !== 'closed').length,
    })).filter(c => c.count > 0);

    const faiByStatus = (Object.keys(FAI_STATUS_META) as FAIStatus[]).map(s => ({
      status: s, label: FAI_STATUS_META[s].label, color: FAI_STATUS_META[s].color,
      count: fais.filter(f => f.status === s).length,
    }));

    const selfAssessmentByStatus = (Object.keys(SELF_ASSESSMENT_STATUS_META) as SelfAssessmentStatus[]).map(s => ({
      status: s, label: SELF_ASSESSMENT_STATUS_META[s].label, color: SELF_ASSESSMENT_STATUS_META[s].color,
      count: assessments.filter(a => a.status === s).length,
    }));

    // Onboarding pipeline trend
    const onboardingTrend = Array.from({ length: 12 }, (_, i) => {
      const monthDate = new Date(TODAY.getFullYear(), TODAY.getMonth() - 11 + i, 1);
      const monthStart = monthDate.getTime();
      const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1).getTime();
      const monthApps = apps.filter(a => {
        const t = new Date(a.submittedDate).getTime();
        return t >= monthStart && t < monthEnd;
      });
      return {
        month: monthDate.toLocaleString('en-US', { month: 'short' }),
        newApplications: monthApps.length + randInt(0, 3, i + 50),
        completed: Math.floor((monthApps.length + randInt(0, 2, i + 100)) * 0.6),
        rejected: Math.floor((monthApps.length + randInt(0, 1, i + 150)) * 0.1),
      };
    });

    // Audit trend (last 12 months)
    const auditTrend = Array.from({ length: 12 }, (_, i) => {
      const monthDate = new Date(TODAY.getFullYear(), TODAY.getMonth() - 11 + i, 1);
      const monthStart = monthDate.getTime();
      const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1).getTime();
      const monthAudits = audits.filter(a => {
        const t = new Date(a.scheduledDate).getTime();
        return t >= monthStart && t < monthEnd;
      });
      const completed = monthAudits.filter(a => a.status === 'completed');
      return {
        month: monthDate.toLocaleString('en-US', { month: 'short' }),
        scheduled: monthAudits.length,
        completed: completed.length,
        avgScore: completed.length > 0 ? Math.round(completed.reduce((s, a) => s + (a.score ?? 0), 0) / completed.length) : 0,
        findings: completed.reduce((s, a) => s + a.findingsCount, 0),
      };
    });

    // Top suppliers by composite score
    const topSuppliers = scorecards.slice(0, 10);

    // Cross-module links
    const crossModule: CrossModuleLink[] = [
      { sourceModule: 'Supplier Quality Scorecard', sourceLabel: 'Scorecard Suppliers', linkedCount: scorecards.length, pendingCount: scorecards.filter(s => s.compositeScore < 70).length, closedLoopRate: 0, color: '#4f46e5' },
      { sourceModule: 'SCAR / 8D', sourceLabel: 'SCAR-Linked Findings', linkedCount: findings.filter(f => f.capapId).length, pendingCount: findings.filter(f => f.capapId && f.status !== 'closed').length, closedLoopRate: 0, color: '#7c3aed' },
      { sourceModule: 'Vendor Management', sourceLabel: 'Active Vendors', linkedCount: suppliers.filter(s => s.onboardingStage === 'completed').length, pendingCount: suppliers.filter(s => s.approvalStatus === 'suspended' || s.approvalStatus === 'probation').length, closedLoopRate: 0, color: '#0891b2' },
      { sourceModule: 'Continual Improvement R110', sourceLabel: 'Audit-Driven Improvements', linkedCount: findings.filter(f => f.status === 'closed' && f.capapId).length, pendingCount: findings.filter(f => f.status !== 'closed').length, closedLoopRate: 0, color: '#be185d' },
      { sourceModule: 'Procurement / PO', sourceLabel: 'PO-Linked Suppliers', linkedCount: suppliers.filter(s => s.firstPODate).length, pendingCount: suppliers.filter(s => !s.firstPODate && s.approvalStatus === 'approved').length, closedLoopRate: 0, color: '#047857' },
    ];
    for (const cm of crossModule) {
      cm.closedLoopRate = cm.linkedCount > 0 ? Math.round(((cm.linkedCount - cm.pendingCount) / cm.linkedCount) * 100) : 0;
    }

    // Auto-generated insights
    const insights: { type: 'danger' | 'warning' | 'success' | 'info'; title: string; description: string; recommendation: string }[] = [];
    if (kpis.criticalFindings > 0) {
      insights.push({
        type: 'danger',
        title: `${kpis.criticalFindings} Open Critical Findings`,
        description: `${kpis.criticalFindings} critical-severity audit findings remain open. Critical findings require immediate corrective action per ISO 9001 §8.4.`,
        recommendation: 'Suspend new POs to affected suppliers until critical findings are closed. Schedule emergency follow-up audits within 7 days.',
      });
    }
    if (kpis.overdueFindings > 0) {
      insights.push({
        type: 'danger',
        title: `${kpis.overdueFindings} Overdue Findings`,
        description: `${kpis.overdueFindings} audit findings have passed their due date without closure. Overdue findings indicate CAPA process breakdown.`,
        recommendation: 'Escalate overdue findings to QA Head. Consider supplier probation status until closure is verified.',
      });
    }
    if (kpis.suspendedSuppliers > 0 || kpis.debarredSuppliers > 0) {
      insights.push({
        type: 'warning',
        title: `${kpis.suspendedSuppliers} Suspended + ${kpis.debarredSuppliers} Debarred Suppliers`,
        description: `${kpis.suspendedSuppliers} suppliers are currently suspended and ${kpis.debarredSuppliers} are debarred. POs should not be released to these suppliers.`,
        recommendation: 'Verify procurement system blocks POs for suspended/debarred suppliers. Initiate re-qualification process if applicable.',
      });
    }
    if (kpis.auditsOverdue > 0) {
      insights.push({
        type: 'warning',
        title: `${kpis.auditsOverdue} Overdue Audits`,
        description: `${kpis.auditsOverdue} scheduled audits have passed their scheduled date without completion. This may leave supplier risks unmonitored.`,
        recommendation: 'Reschedule overdue audits within 14 days. If lead auditor unavailable, consider third-party audit firm.',
      });
    }
    if (kpis.faiFailed > 0) {
      insights.push({
        type: 'warning',
        title: `${kpis.faiFailed} Failed FAIs`,
        description: `${kpis.faiFailed} First Article Inspections have failed. Failed FAIs indicate quality issues with new SKUs or new suppliers.`,
        recommendation: 'Reject affected SKUs. Require supplier corrective action plan before re-submitting FAI samples.',
      });
    }
    if (kpis.selfAssessmentOverdue > 0) {
      insights.push({
        type: 'warning',
        title: `${kpis.selfAssessmentOverdue} Overdue Self-Assessments`,
        description: `${kpis.selfAssessmentOverdue} supplier self-assessments are overdue. Low response rate may indicate disengaged suppliers.`,
        recommendation: 'Procurement to follow up with non-responsive suppliers. Consider self-assessment response rate in supplier scorecard.',
      });
    }
    if (kpis.criticalRiskSuppliers > 0) {
      insights.push({
        type: 'danger',
        title: `${kpis.criticalRiskSuppliers} Critical-Risk Suppliers`,
        description: `${kpis.criticalRiskSuppliers} suppliers are classified as critical-risk. These require executive escalation and risk mitigation planning.`,
        recommendation: 'Develop risk mitigation plan for each critical-risk supplier. Consider dual-sourcing strategy for critical SKUs.',
      });
    }
    insights.push({
      type: 'info',
      title: `ISO 8.4 Compliance: ${kpis.iso_8_4_compliance}%`,
      description: `Sub-scores — §8.4.1 Approved Suppliers: ${kpis.approvedSuppliers}/${kpis.activeSuppliers} | §8.4.2 Audits Completed: ${kpis.auditsCompletedThisYear}/${kpis.auditsScheduledThisYear} | §8.4.3 Findings On-Time: ${kpis.openFindings - kpis.overdueFindings}/${kpis.openFindings}`,
      recommendation: 'Maintain trajectory toward 90%+. Use compliance score for MRB §9.3 review and supplier strategy planning.',
    });
    insights.push({
      type: 'success',
      title: `Composite Effectiveness: ${kpis.compositeEffectiveness}%`,
      description: `Average composite score: ${kpis.averageCompositeScore} | Average audit score: ${kpis.averageAuditScore} | FAI pass rate: ${kpis.faiPassRate}% | Self-assessment response: ${kpis.selfAssessmentResponseRate}%`,
      recommendation: 'Use composite score to prioritize supplier development. Identify top-10 and bottom-10 suppliers for recognition / intervention.',
    });
    insights.push({
      type: 'info',
      title: `Annual Spend: ₹${kpis.totalAnnualSpend.toLocaleString('en-IN')}`,
      description: `Total annual spend across ${kpis.activeSuppliers} active suppliers. Average spend per supplier: ₹${kpis.activeSuppliers > 0 ? Math.round(kpis.totalAnnualSpend / kpis.activeSuppliers).toLocaleString('en-IN') : 0}.`,
      recommendation: 'Use spend data to prioritize supplier development. Top 20% of suppliers (by spend) should be in strategic tier.',
    });

    const responseData = {
      generatedAt: new Date().toISOString(),
      kpis,
      suppliers,
      apps,
      audits,
      findings,
      fais,
      assessments,
      scorecards,
      crossModule,
      suppliersByTier,
      suppliersByApproval,
      suppliersByCategory,
      suppliersByRisk,
      auditsByType,
      auditsByStatus,
      auditsByOutcome,
      findingsBySeverity,
      findingsByStatus,
      findingsByCategory,
      faiByStatus,
      selfAssessmentByStatus,
      onboardingTrend,
      auditTrend,
      topSuppliers,
      insights,
      meta: {
        totalSuppliers: suppliers.length,
        totalApps: apps.length,
        totalAudits: audits.length,
        totalFindings: findings.length,
        totalFAIs: fais.length,
        totalAssessments: assessments.length,
        realData: {
          warehouseCount: warehouses.length,
        },
        constants: {
          categories: Object.entries(CATEGORY_META).map(([k, v]) => ({ id: k as SupplierCategory, ...v })),
          tiers: Object.entries(TIER_META).map(([k, v]) => ({ id: k as SupplierTier, ...v })),
          approvalStatuses: Object.entries(APPROVAL_STATUS_META).map(([k, v]) => ({ id: k as ApprovalStatus, ...v })),
          onboardingStages: Object.entries(ONBOARDING_STAGE_META).map(([k, v]) => ({ id: k as OnboardingStage, ...v })),
          auditTypes: Object.entries(AUDIT_TYPE_META).map(([k, v]) => ({ id: k as AuditType, ...v })),
          auditStatuses: Object.entries(AUDIT_STATUS_META).map(([k, v]) => ({ id: k as AuditStatus, ...v })),
          auditOutcomes: Object.entries(AUDIT_OUTCOME_META).map(([k, v]) => ({ id: k as AuditOutcome, ...v })),
          findingSeverities: Object.entries(FINDING_SEVERITY_META).map(([k, v]) => ({ id: k as FindingSeverity, ...v })),
          findingStatuses: Object.entries(FINDING_STATUS_META).map(([k, v]) => ({ id: k as FindingStatus, ...v })),
          faiStatuses: Object.entries(FAI_STATUS_META).map(([k, v]) => ({ id: k as FAIStatus, ...v })),
          selfAssessmentStatuses: Object.entries(SELF_ASSESSMENT_STATUS_META).map(([k, v]) => ({ id: k as SelfAssessmentStatus, ...v })),
          riskLevels: Object.entries(RISK_LEVEL_META).map(([k, v]) => ({ id: k as RiskLevel, ...v })),
        },
      },
    };

    cachedResponse = { data: responseData, ts: Date.now() };
    return NextResponse.json(responseData);
  } catch (err: unknown) {
    const error = err as Error;
    console.error('[supplier-audit] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch supplier audit data', details: error.message },
      { status: 500 },
    );
  }
}
