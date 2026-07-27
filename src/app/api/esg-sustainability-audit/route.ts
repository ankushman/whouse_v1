// R112: ESG & Sustainability Audit Module
// Extends Energy & Sustainability with audit-focused capabilities:
//   - ESG Audit Scheduling (Environmental / Social / Governance scopes)
//   - Carbon Footprint Verification (Scope 1 / 2 / 3)
//   - Sustainability KPI Tracking (30 KPIs across 6 dimensions)
//   - GRI Reporting Integration (GRI Standards disclosure mapping)
//   - ESG Risk Assessment (climate, regulatory, reputational, supply chain)
//   - Findings & CAPA (audit findings with corrective/preventive actions)
//   - Compliance Obligations (environmental regulations, ESG disclosure)
//   - SDG Alignment tracking

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
  id: string;
  auditCode: string;
  title: string;
  scope: ESGScope;
  frequency: AuditFrequency;
  status: ESGAuditStatus;
  scheduledDate: string;
  completedDate: string | null;
  daysToAudit: number;
  leadAuditor: string;
  auditTeamSize: number;
  warehouseId: string;
  warehouseName: string;
  outcome: ESGAuditOutcome | null;
  score: number | null;
  findingsCount: number;
  criticalFindings: number;
  majorFindings: number;
  nextAuditDate: string | null;
  notes: string;
}

interface CarbonRecord {
  id: string;
  recordCode: string;
  warehouseId: string;
  warehouseName: string;
  scope: CarbonScope;
  baselineYear: number;
  currentYear: number;
  baselineEmissions: number;
  currentEmissions: number;
  reductionTarget: number;
  reductionAchieved: number;
  unit: string;
  verificationStatus: VerificationStatus;
  verifiedBy: string | null;
  verifiedDate: string | null;
  category: string;
  notes: string;
}

interface SustainabilityKPI {
  id: string;
  kpiCode: string;
  name: string;
  dimension: 'environmental' | 'social' | 'governance' | 'economic' | 'community' | 'workforce';
  unit: string;
  target: number;
  actual: number;
  previousYear: number;
  trend: 'improving' | 'stable' | 'declining';
  status: 'on_track' | 'at_risk' | 'off_track';
  grilink: string | null;
  sdgAlignment: number | null;
  weight: number;
}

interface GRIIndicator {
  id: string;
  griCode: string;
  griStandard: string;
  topic: string;
  disclosureStatus: DisclosureStatus;
  description: string;
  complianceRequirement: string;
  lastReported: string | null;
  nextDue: string | null;
  dataQuality: 'high' | 'medium' | 'low' | 'not_assessed';
  responsibleTeam: string;
  notes: string;
}

interface ESGRisk {
  id: string;
  riskCode: string;
  title: string;
  category: 'climate' | 'regulatory' | 'reputational' | 'supply_chain' | 'financial' | 'operational';
  probability: RiskProbability;
  impact: RiskImpact;
  probabilityScore: number;
  impactScore: number;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  mitigationStatus: MitigationStatus;
  mitigationPlan: string;
  owner: string;
  lastReviewed: string | null;
  nextReview: string | null;
  notes: string;
}

interface ESGFinding {
  id: string;
  findingCode: string;
  auditId: string;
  auditCode: string;
  scope: ESGScope;
  severity: ESGFindingSeverity;
  status: ESGFindingStatus;
  category: string;
  description: string;
  identifiedDate: string;
  dueDate: string;
  daysToDue: number;
  closedDate: string | null;
  rootCause: string | null;
  correctiveAction: string | null;
  preventiveAction: string | null;
  capaId: string | null;
  verificationMethod: string | null;
  verifiedBy: string | null;
  owner: string;
  warehouseName: string;
}

interface ComplianceObligation {
  id: string;
  obligationCode: string;
  regulation: string;
  authority: string;
  category: 'environmental' | 'social' | 'governance' | 'financial' | 'operational';
  status: ComplianceStatus;
  complianceScore: number;
  dueDate: string;
  lastAssessed: string | null;
  nextAssessment: string | null;
  sdgAlignment: number | null;
  penalties: string;
  responsibleTeam: string;
  notes: string;
}

// ============================================================================
// Constants
// ============================================================================
const SCOPE_META: Record<ESGScope, { label: string; color: string }> = {
  Environmental: { label: 'Environmental', color: '#047857' },
  Social: { label: 'Social', color: '#2563eb' },
  Governance: { label: 'Governance', color: '#7c3aed' },
};

const FREQUENCY_META: Record<AuditFrequency, { label: string }> = {
  annual: { label: 'Annual' },
  quarterly: { label: 'Quarterly' },
  monthly: { label: 'Monthly' },
};

const AUDIT_STATUS_META: Record<ESGAuditStatus, { label: string; color: string }> = {
  scheduled: { label: 'Scheduled', color: '#2563eb' },
  in_progress: { label: 'In Progress', color: '#d97706' },
  completed: { label: 'Completed', color: '#047857' },
  cancelled: { label: 'Cancelled', color: '#7c2d12' },
  postponed: { label: 'Postponed', color: '#6b7280' },
};

const AUDIT_OUTCOME_META: Record<ESGAuditOutcome, { label: string; color: string }> = {
  compliant: { label: 'Compliant', color: '#047857' },
  partially_compliant: { label: 'Partially Compliant', color: '#d97706' },
  non_compliant: { label: 'Non-Compliant', color: '#dc2626' },
  not_assessed: { label: 'Not Assessed', color: '#6b7280' },
};

const VERIFICATION_META: Record<VerificationStatus, { label: string; color: string }> = {
  verified: { label: 'Verified', color: '#047857' },
  pending_verification: { label: 'Pending Verification', color: '#d97706' },
  not_verified: { label: 'Not Verified', color: '#dc2626' },
  disputed: { label: 'Disputed', color: '#7c3aed' },
};

const CARBON_SCOPE_META: Record<CarbonScope, { label: string; color: string }> = {
  scope1: { label: 'Scope 1', color: '#ea580c' },
  scope2: { label: 'Scope 2', color: '#2563eb' },
  scope3: { label: 'Scope 3', color: '#7c3aed' },
};

const FINDING_SEVERITY_META: Record<ESGFindingSeverity, { label: string; color: string }> = {
  observation: { label: 'Observation', color: '#6b7280' },
  minor: { label: 'Minor', color: '#d97706' },
  major: { label: 'Major', color: '#ea580c' },
  critical: { label: 'Critical', color: '#dc2626' },
};

const FINDING_STATUS_META: Record<ESGFindingStatus, { label: string; color: string }> = {
  open: { label: 'Open', color: '#2563eb' },
  in_progress: { label: 'In Progress', color: '#d97706' },
  pending_verification: { label: 'Pending Verification', color: '#7c3aed' },
  closed: { label: 'Closed', color: '#047857' },
  overdue: { label: 'Overdue', color: '#dc2626' },
};

const COMPLIANCE_STATUS_META: Record<ComplianceStatus, { label: string; color: string }> = {
  compliant: { label: 'Compliant', color: '#047857' },
  partial: { label: 'Partial', color: '#d97706' },
  non_compliant: { label: 'Non-Compliant', color: '#dc2626' },
  pending_review: { label: 'Pending Review', color: '#2563eb' },
};

const DISCLOSURE_STATUS_META: Record<DisclosureStatus, { label: string; color: string }> = {
  full: { label: 'Full', color: '#047857' },
  partial: { label: 'Partial', color: '#d97706' },
  minimal: { label: 'Minimal', color: '#ea580c' },
  not_disclosed: { label: 'Not Disclosed', color: '#dc2626' },
};

const PROBABILITY_META: Record<RiskProbability, { label: string; score: number }> = {
  rare: { label: 'Rare', score: 1 },
  unlikely: { label: 'Unlikely', score: 2 },
  possible: { label: 'Possible', score: 3 },
  likely: { label: 'Likely', score: 4 },
  almost_certain: { label: 'Almost Certain', score: 5 },
};

const IMPACT_META: Record<RiskImpact, { label: string; score: number }> = {
  negligible: { label: 'Negligible', score: 1 },
  minor: { label: 'Minor', score: 2 },
  moderate: { label: 'Moderate', score: 3 },
  major: { label: 'Major', score: 4 },
  catastrophic: { label: 'Catastrophic', score: 5 },
};

const MITIGATION_STATUS_META: Record<MitigationStatus, { label: string; color: string }> = {
  not_started: { label: 'Not Started', color: '#dc2626' },
  in_progress: { label: 'In Progress', color: '#d97706' },
  implemented: { label: 'Implemented', color: '#047857' },
  monitoring: { label: 'Monitoring', color: '#2563eb' },
};

const AUDITOR_POOL = [
  'Dr. Meera Krishnan (Lead ESG Auditor)', 'Rajesh Pillai (ESG Auditor)',
  'Anita Sharma (Lead ESG Auditor)', 'Vikram Desai (ESG Auditor)',
  'Priya Menon (Lead Environmental Auditor)', 'Suresh Iyer (Carbon Verifier)',
  'Kavita Nair (Social Compliance Auditor)', 'Arjun Reddy (Governance Auditor)',
  'Deepa Gupta (ESG Auditor)', 'Sanjay Bhat (ESG Specialist)',
];

const WAREHOUSE_NAMES = mockWarehouses.slice(0, 8).map(w => w.name);

const ESG_AUDIT_TITLES: { scope: ESGScope; title: string }[] = [
  { scope: 'Environmental', title: 'GHG Emissions Compliance Audit' },
  { scope: 'Environmental', title: 'Waste Management & Diversion Audit' },
  { scope: 'Environmental', title: 'Water Usage & Efficiency Assessment' },
  { scope: 'Environmental', title: 'Renewable Energy Transition Audit' },
  { scope: 'Environmental', title: 'Hazardous Materials Handling Audit' },
  { scope: 'Environmental', title: 'Biodiversity & Land Use Impact Assessment' },
  { scope: 'Environmental', title: 'Air Quality & Emissions Monitoring Audit' },
  { scope: 'Environmental', title: 'Packaging Sustainability Compliance Review' },
  { scope: 'Social', title: 'Workplace Health & Safety Audit' },
  { scope: 'Social', title: 'Diversity, Equity & Inclusion Assessment' },
  { scope: 'Social', title: 'Labor Rights & Fair Wages Audit' },
  { scope: 'Social', title: 'Community Engagement & Investment Review' },
  { scope: 'Social', title: 'Employee Well-being & Benefits Audit' },
  { scope: 'Social', title: 'Training & Development Compliance Check' },
  { scope: 'Social', title: 'Human Rights Due Diligence Assessment' },
  { scope: 'Social', title: 'Supply Chain Labor Standards Audit' },
  { scope: 'Governance', title: 'Board Independence & Ethics Review' },
  { scope: 'Governance', title: 'Anti-Corruption & Bribery Prevention Audit' },
  { scope: 'Governance', title: 'Whistleblower Program Effectiveness Review' },
  { scope: 'Governance', title: 'Data Privacy & Security Governance Audit' },
  { scope: 'Governance', title: 'ESG Policy & Framework Assessment' },
  { scope: 'Governance', title: 'Stakeholder Engagement & Transparency Review' },
  { scope: 'Governance', title: 'Risk Management Framework Audit' },
  { scope: 'Governance', title: 'Executive Compensation & ESG Linkage Review' },
];

const CARBON_CATEGORIES: Record<CarbonScope, string[]> = {
  scope1: ['Diesel Generators', 'Natural Gas Heating', 'Company Fleet Vehicles', 'Refrigerant Leakage', 'On-site Fuel Combustion'],
  scope2: ['Purchased Electricity', 'Purchased Steam', 'Purchased Cooling'],
  scope3: ['Upstream Transportation', 'Downstream Distribution', 'Business Travel', 'Employee Commuting', 'Waste Disposal', 'Purchased Goods & Services'],
};

const FINDING_DESCRIPTIONS: { scope: ESGScope; category: string; desc: string; severity: ESGFindingSeverity }[] = [
  { scope: 'Environmental', category: 'Emissions', desc: 'GHG emissions from diesel generators exceed permitted threshold by 12% at WH-03.', severity: 'major' },
  { scope: 'Environmental', category: 'Waste', desc: 'Hazardous waste storage area lacks proper labeling and secondary containment at WH-05.', severity: 'critical' },
  { scope: 'Environmental', category: 'Water', desc: 'Water recycling rate at WH-02 is 18% below target (actual 32% vs target 50%).', severity: 'minor' },
  { scope: 'Environmental', category: 'Energy', desc: 'Solar panel installation at WH-01 is 3 months behind schedule, impacting renewable energy target.', severity: 'major' },
  { scope: 'Environmental', category: 'Emissions', desc: 'Scope 3 emissions tracking methodology not aligned with GHG Protocol standards.', severity: 'observation' },
  { scope: 'Environmental', category: 'Waste', desc: 'E-waste disposal documentation missing for Q3 2025 shipments at WH-04.', severity: 'minor' },
  { scope: 'Environmental', category: 'Biodiversity', desc: 'No biodiversity impact assessment conducted for new warehouse construction site.', severity: 'major' },
  { scope: 'Environmental', category: 'Packaging', desc: 'Single-use plastic packaging still used for 35% of outbound shipments (target: <10%).', severity: 'minor' },
  { scope: 'Social', category: 'Safety', desc: 'Fire drill frequency at WH-06 is below regulatory requirement (2/year vs required 4/year).', severity: 'critical' },
  { scope: 'Social', category: 'Diversity', desc: 'Women representation in warehouse supervisory roles is only 12% (target: 25%).', severity: 'observation' },
  { scope: 'Social', category: 'Labor', desc: 'Contract worker safety training records incomplete for 22 workers at WH-07.', severity: 'major' },
  { scope: 'Social', category: 'Community', desc: 'Community investment fund utilization at only 60% of allocated budget.', severity: 'observation' },
  { scope: 'Social', category: 'HR', desc: 'Employee engagement survey response rate dropped from 78% to 52% YoY.', severity: 'minor' },
  { scope: 'Social', category: 'Safety', desc: 'Incident reporting system not capturing near-miss events consistently.', severity: 'minor' },
  { scope: 'Social', category: 'Training', desc: 'ESG awareness training not completed for 35% of new hires in Q1 2026.', severity: 'major' },
  { scope: 'Governance', category: 'Ethics', desc: 'Whistleblower hotline average response time increased to 14 days (SLA: 5 days).', severity: 'major' },
  { scope: 'Governance', category: 'Board', desc: 'Board ESG committee meeting minutes not formally documented for 2 consecutive quarters.', severity: 'critical' },
  { scope: 'Governance', category: 'Policy', desc: 'ESG policy framework last updated 18 months ago (annual review required).', severity: 'minor' },
  { scope: 'Governance', category: 'Data Privacy', desc: 'Third-party data sharing agreements lack GDPR/DPDPA compliance clauses.', severity: 'major' },
  { scope: 'Governance', category: 'Transparency', desc: 'ESG metrics disclosure in annual report incomplete — GRI 305-4 data missing.', severity: 'observation' },
  { scope: 'Governance', category: 'Risk', desc: 'Climate risk scenario analysis not integrated into enterprise risk framework.', severity: 'major' },
  { scope: 'Governance', category: 'Anti-Corruption', desc: 'Anti-bribery training completion rate for procurement team at 67% (target: 100%).', severity: 'minor' },
  { scope: 'Environmental', category: 'Energy', desc: 'LED lighting retrofit at WH-08 delayed due to supply chain issues. Energy savings target at risk.', severity: 'minor' },
  { scope: 'Environmental', category: 'Water', desc: 'Stormwater discharge monitoring data shows intermittent pH exceedances at WH-04.', severity: 'major' },
  { scope: 'Social', category: 'Human Rights', desc: 'Supplier code of conduct not signed by 8 of 45 tier-1 suppliers.', severity: 'minor' },
  { scope: 'Social', category: 'Safety', desc: 'Emergency evacuation plan at WH-03 not updated after recent warehouse expansion.', severity: 'critical' },
  { scope: 'Environmental', category: 'Emissions', desc: 'Refrigerant leakage rate exceeds 5% threshold at WH-02 cold storage unit.', severity: 'major' },
  { scope: 'Governance', category: 'Ethics', desc: 'Conflict of interest declarations not collected from 3 newly appointed board members.', severity: 'observation' },
  { scope: 'Social', category: 'Compensation', desc: 'Gender pay gap analysis shows 8% disparity in warehouse operations (target: <3%).', severity: 'minor' },
  { scope: 'Environmental', category: 'Carbon', desc: 'Carbon offset credits purchased do not meet Gold Standard certification requirements.', severity: 'major' },
  { scope: 'Social', category: 'Well-being', desc: 'Mental health support program utilization rate below 5% — awareness campaign needed.', severity: 'observation' },
  { scope: 'Environmental', category: 'Emissions', desc: 'Scope 2 emissions increased 8% YoY due to grid electricity carbon intensity rise.', severity: 'observation' },
  { scope: 'Governance', category: 'Transparency', desc: 'Stakeholder engagement report not published within required timeframe.', severity: 'minor' },
  { scope: 'Social', category: 'Safety', desc: 'LOTO (Lockout/Tagout) compliance rate at 88% across all warehouses (target: 100%).', severity: 'major' },
  { scope: 'Environmental', category: 'Waste', desc: 'Organic waste composting program at WH-01 has inconsistent participation.', severity: 'observation' },
];

const COMPLIANCE_REGULATIONS: { regulation: string; authority: string; category: ComplianceObligation['category']; sdg: number | null; penalties: string }[] = [
  { regulation: 'Carbon Credits Trading Scheme (CCTS) 2023', authority: 'Ministry of Environment', category: 'environmental', sdg: 13, penalties: '₹5L–₹50L per violation' },
  { regulation: 'Hazardous Waste Management Rules 2016', authority: 'MoEFCC', category: 'environmental', sdg: 12, penalties: '₹1L–₹25L + imprisonment' },
  { regulation: 'Air (Prevention & Control) Act 1981', authority: 'CPCB', category: 'environmental', sdg: 11, penalties: '₹10K–₹6L per day' },
  { regulation: 'Water (Prevention & Control) Act 1974', authority: 'CPCB', category: 'environmental', sdg: 6, penalties: '₹10K–₹15L' },
  { regulation: 'E-Waste Management Rules 2022', authority: 'MoEFCC', category: 'environmental', sdg: 12, penalties: '₹1L–₹5L' },
  { regulation: 'Extended Producer Responsibility (EPR)', authority: 'CPCB', category: 'environmental', sdg: 12, penalties: '₹5L–₹20L' },
  { regulation: 'Climate Change Disclosure Mandate (SEBI)', authority: 'SEBI BRSR', category: 'governance', sdg: 13, penalties: '₹5L–₹1Cr' },
  { regulation: 'Companies Act ESG Reporting (Sec 134)', authority: 'MCA', category: 'governance', sdg: 16, penalties: '₹5L–₹25L' },
  { regulation: 'Sexual Harassment of Women Act 2013', authority: 'MoWCD', category: 'social', sdg: 5, penalties: '₹50K–₹5L' },
  { regulation: 'Factories Act 1948 — Safety Provisions', authority: 'Factory Inspectorate', category: 'social', sdg: 8, penalties: '₹2L–₹15L' },
  { regulation: 'Child Labor (Prohibition) Act 1986', authority: 'MoLE', category: 'social', sdg: 8, penalties: '₹20K–₹50K + imprisonment' },
  { regulation: 'Equal Remuneration Act 1976', authority: 'MoLE', category: 'social', sdg: 5, penalties: '₹10K–₹1L' },
  { regulation: 'Personal Data Protection Act (DPDPA) 2023', authority: 'MeitY', category: 'governance', sdg: 16, penalties: 'Up to ₹250Cr' },
  { regulation: 'Anti-Corruption / Prevention of Corruption Act', authority: 'CBI / CVC', category: 'governance', sdg: 16, penalties: 'Imprisonment 3–7 years' },
  { regulation: 'Companies (CSR) Rules 2014 — Amended', authority: 'MCA', category: 'social', sdg: 17, penalties: '₹10L–₹1Cr + transfer to PM Relief Fund' },
  { regulation: 'National Green Tribunal Act 2010', authority: 'NGT', category: 'environmental', sdg: 15, penalties: 'Varies — up to ₹25Cr' },
  { regulation: 'Ozone Depleting Substances Rules 2000', authority: 'MoEFCC', category: 'environmental', sdg: 13, penalties: '₹2L–₹20L' },
  { regulation: 'Biodiversity Act 2002', authority: 'NBA', category: 'environmental', sdg: 15, penalties: '₹5L–₹50L' },
  { regulation: 'Workmen Compensation Act 1923', authority: 'MoLE', category: 'social', sdg: 8, penalties: '₹5K–₹50K' },
  { regulation: 'Industrial Safety (OHS) Framework — ILO C155', authority: 'DGFASLI', category: 'social', sdg: 3, penalties: 'Compliance-based' },
];

const RISK_TEMPLATES: { category: ESGRisk['category']; title: string; baseProbability: RiskProbability; baseImpact: RiskImpact; mitigation: string }[] = [
  { category: 'climate', title: 'Physical Climate Risk — Flooding at low-lying warehouses', baseProbability: 'possible', baseImpact: 'major', mitigation: 'Flood risk assessment completed. Contingency plans for WH-02, WH-05 in place.' },
  { category: 'climate', title: 'Transition Risk — Carbon pricing increase', baseProbability: 'likely', baseImpact: 'moderate', mitigation: 'Carbon cost modeling updated. Shadow carbon pricing at ₹1,200/tCO2e adopted.' },
  { category: 'climate', title: 'Regulatory Climate Mandate — Net Zero 2050', baseProbability: 'almost_certain', baseImpact: 'major', mitigation: 'Net-zero roadmap drafted. interim targets set for 2030 (-50%) and 2040 (-80%).' },
  { category: 'climate', title: 'Physical Climate Risk — Extreme heat events', baseProbability: 'likely', baseImpact: 'moderate', mitigation: 'Heat action plans for all warehouses. Cooling systems upgraded at 6 locations.' },
  { category: 'regulatory', title: 'ESG Disclosure Non-Compliance (BRSR)', baseProbability: 'unlikely', baseImpact: 'major', mitigation: 'Dedicated ESG reporting team established. SEBI BRSR framework adopted.' },
  { category: 'regulatory', title: 'Carbon Tax Regulatory Changes', baseProbability: 'possible', baseImpact: 'moderate', mitigation: 'Regulatory monitoring program in place. Quarterly compliance reviews scheduled.' },
  { category: 'regulatory', title: 'Extended Producer Responsibility Non-Compliance', baseProbability: 'unlikely', baseImpact: 'minor', mitigation: 'EPR obligations mapped. Target vs actual tracking dashboard operational.' },
  { category: 'reputational', title: 'Greenwashing Allegation Risk', baseProbability: 'unlikely', baseImpact: 'major', mitigation: 'Third-party ESG verification engaged. All claims substantiated with data.' },
  { category: 'reputational', title: 'Supply Chain Labor Rights Violation', baseProbability: 'possible', baseImpact: 'catastrophic', mitigation: 'Supplier code of conduct deployed. Social audit program covers 90% of spend.' },
  { category: 'reputational', title: 'Data Breach / Privacy Violation', baseProbability: 'possible', baseImpact: 'major', mitigation: 'DPDPA compliance program launched. Penetration testing quarterly.' },
  { category: 'supply_chain', title: 'Supplier ESG Non-Compliance Cascade', baseProbability: 'likely', baseImpact: 'moderate', mitigation: 'Tier-1 supplier ESG scorecards live. Risk-based monitoring for top 50 suppliers.' },
  { category: 'supply_chain', title: 'Critical Material ESG Sourcing Disruption', baseProbability: 'possible', baseImpact: 'moderate', mitigation: 'Dual-sourcing strategy for critical materials. Conflict mineral screening in place.' },
  { category: 'financial', title: 'Stranded Assets from Energy Transition', baseProbability: 'unlikely', baseImpact: 'major', mitigation: 'Asset retirement obligation model updated. Impairment testing includes climate scenarios.' },
  { category: 'financial', title: 'Green Bond / Sustainable Finance Misalignment', baseProbability: 'rare', baseImpact: 'moderate', mitigation: 'Use of proceeds tracking system implemented. Annual assurance by external auditor.' },
  { category: 'operational', title: 'ESG Data Quality & Reporting Failure', baseProbability: 'possible', baseImpact: 'moderate', mitigation: 'ESG data governance framework established. Quarterly data quality audits.' },
];

// ============================================================================
// Generators
// ============================================================================
function generateAudits(count: number): ESGAudit[] {
  const audits: ESGAudit[] = [];
  for (let i = 0; i < count; i++) {
    const template = ESG_AUDIT_TITLES[i % ESG_AUDIT_TITLES.length];
    const frequencies: AuditFrequency[] = ['annual', 'quarterly', 'monthly'];
    const frequency = frequencies[i % 3];
    const scheduledOffset = randInt(-180, 90, i + 50);
    const scheduledDate = scheduledOffset >= 0 ? daysAhead(scheduledOffset) : daysAgo(-scheduledOffset);
    const isPast = scheduledOffset < 0;
    const isCurrent = scheduledOffset >= 0 && scheduledOffset <= 7;
    const status: ESGAuditStatus = isCurrent ? 'in_progress' : isPast ? (seededRand(i + 100) > 0.95 ? 'cancelled' : 'completed') : 'scheduled';
    const completedDate = status === 'completed' ? daysAgo(randInt(1, Math.abs(scheduledOffset), i + 200)).toISOString() : null;
    const outcome: ESGAuditOutcome | null = status === 'completed'
      ? (seededRand(i + 250) > 0.8 ? 'non_compliant' : seededRand(i + 260) > 0.5 ? 'partially_compliant' : 'compliant')
      : null;
    const score = status === 'completed' ? (outcome === 'compliant' ? randInt(85, 98, i + 300) : outcome === 'partially_compliant' ? randInt(65, 84, i + 310) : randInt(35, 64, i + 320)) : null;
    const criticalFindings = status === 'completed' ? (outcome === 'non_compliant' ? randInt(1, 3, i + 350) : 0) : 0;
    const majorFindings = status === 'completed' ? (outcome === 'non_compliant' ? randInt(2, 5, i + 360) : outcome === 'partially_compliant' ? randInt(1, 3, i + 370) : 0) : 0;
    const findingsCount = criticalFindings + majorFindings + (status === 'completed' ? randInt(0, 4, i + 380) : 0);

    audits.push({
      id: `ESG-AUD-${(i + 1).toString().padStart(4, '0')}`,
      auditCode: `ESG-AUD/${TODAY.getFullYear()}/${(i + 1).toString().padStart(3, '0')}`,
      title: template.title,
      scope: template.scope,
      frequency,
      status,
      scheduledDate: scheduledDate.toISOString(),
      completedDate,
      daysToAudit: Math.round((scheduledDate.getTime() - TODAY.getTime()) / MS_PER_DAY),
      leadAuditor: pick(AUDITOR_POOL, i + 400),
      auditTeamSize: randInt(2, 6, i + 450),
      warehouseId: `WH-${String((i % 8) + 1).padStart(2, '0')}`,
      warehouseName: WAREHOUSE_NAMES[i % WAREHOUSE_NAMES.length],
      outcome,
      score,
      findingsCount,
      criticalFindings,
      majorFindings,
      nextAuditDate: status === 'completed' ? daysAhead(frequency === 'monthly' ? 30 : frequency === 'quarterly' ? 90 : 365).toISOString() : null,
      notes: status === 'completed' ? 'Audit completed. Report available in ESG document repository.' : status === 'in_progress' ? 'Audit currently in progress.' : 'Scheduled — awaiting auditor availability.',
    });
  }
  return audits;
}

function generateCarbonRecords(count: number): CarbonRecord[] {
  const records: CarbonRecord[] = [];
  for (let i = 0; i < count; i++) {
    const scopes: CarbonScope[] = ['scope1', 'scope2', 'scope3'];
    const scope = scopes[i % 3];
    const categories = CARBON_CATEGORIES[scope];
    const category = categories[i % categories.length];
    const baselineYear = 2020;
    const currentYear = TODAY.getFullYear();
    const baseMultiplier = scope === 'scope1' ? randInt(500, 3000, i + 100) : scope === 'scope2' ? randInt(2000, 8000, i + 200) : randInt(3000, 15000, i + 300);
    const baselineEmissions = baseMultiplier;
    const reductionFactor = seededRand(i + 400);
    const currentEmissions = Math.round(baselineEmissions * (0.75 + reductionFactor * 0.2));
    const reductionTarget = randInt(15, 40, i + 500);
    const reductionAchieved = Math.round(((baselineEmissions - currentEmissions) / baselineEmissions) * 100);
    const verStatuses: VerificationStatus[] = ['verified', 'pending_verification', 'not_verified', 'verified', 'verified'];
    const verificationStatus = verStatuses[i % verStatuses.length];

    records.push({
      id: `CF-${(i + 1).toString().padStart(4, '0')}`,
      recordCode: `CF/${String((i % 8) + 1).padStart(2, '0')}/${scope}/${category.split(' ')[0].toUpperCase()}`,
      warehouseId: `WH-${String((i % 8) + 1).padStart(2, '0')}`,
      warehouseName: WAREHOUSE_NAMES[i % WAREHOUSE_NAMES.length],
      scope,
      baselineYear,
      currentYear,
      baselineEmissions,
      currentEmissions,
      reductionTarget,
      reductionAchieved,
      unit: 'tCO2e',
      verificationStatus,
      verifiedBy: verificationStatus === 'verified' ? pick(AUDITOR_POOL, i + 600) : null,
      verifiedDate: verificationStatus === 'verified' ? daysAgo(randInt(10, 90, i + 650)).toISOString() : null,
      category,
      notes: verificationStatus === 'verified' ? 'Emissions verified against GHG Protocol methodology.' : 'Awaiting third-party verification.',
    });
  }
  return records;
}

function generateKPIs(count: number): SustainabilityKPI[] {
  const kpis: SustainabilityKPI[] = [];
  const kpiTemplates: { name: string; dimension: SustainabilityKPI['dimension']; unit: string; targetRange: [number, number]; actualRange: [number, number]; grilink: string | null; sdg: number | null; weight: number }[] = [
    { name: 'GHG Emissions Intensity', dimension: 'environmental', unit: 'tCO2e/M₹', targetRange: [0.02, 0.05], actualRange: [0.03, 0.08], grilink: 'GRI 305-1', sdg: 13, weight: 10 },
    { name: 'Scope 1 Emissions', dimension: 'environmental', unit: 'tCO2e', targetRange: [5000, 8000], actualRange: [5500, 9500], grilink: 'GRI 305-1', sdg: 13, weight: 8 },
    { name: 'Scope 2 Emissions', dimension: 'environmental', unit: 'tCO2e', targetRange: [15000, 25000], actualRange: [12000, 28000], grilink: 'GRI 305-2', sdg: 13, weight: 8 },
    { name: 'Scope 3 Emissions', dimension: 'environmental', unit: 'tCO2e', targetRange: [25000, 50000], actualRange: [22000, 55000], grilink: 'GRI 305-3', sdg: 13, weight: 7 },
    { name: 'Water Usage Intensity', dimension: 'environmental', unit: 'KL/unit', targetRange: [0.5, 1.5], actualRange: [0.8, 2.0], grilink: 'GRI 303-1', sdg: 6, weight: 6 },
    { name: 'Water Recycling Rate', dimension: 'environmental', unit: '%', targetRange: [40, 60], actualRange: [25, 55], grilink: 'GRI 303-3', sdg: 6, weight: 5 },
    { name: 'Waste Diversion Rate', dimension: 'environmental', unit: '%', targetRange: [70, 90], actualRange: [55, 85], grilink: 'GRI 306-4', sdg: 12, weight: 6 },
    { name: 'Hazardous Waste Generation', dimension: 'environmental', unit: 'tonnes/yr', targetRange: [5, 15], actualRange: [8, 22], grilink: 'GRI 306-3', sdg: 12, weight: 5 },
    { name: 'Renewable Energy %', dimension: 'environmental', unit: '%', targetRange: [40, 60], actualRange: [22, 52], grilink: 'GRI 302-1', sdg: 7, weight: 7 },
    { name: 'Energy Intensity', dimension: 'environmental', unit: 'kWh/m²', targetRange: [80, 130], actualRange: [90, 150], grilink: 'GRI 302-1', sdg: 7, weight: 5 },
    { name: 'Packaging Recyclability', dimension: 'environmental', unit: '%', targetRange: [80, 95], actualRange: [60, 90], grilink: 'GRI 301-2', sdg: 12, weight: 4 },
    { name: 'Carbon Reduction vs Baseline', dimension: 'environmental', unit: '%', targetRange: [20, 35], actualRange: [10, 30], grilink: 'GRI 305-4', sdg: 13, weight: 8 },
    { name: 'Gender Diversity Ratio', dimension: 'social', unit: '%', targetRange: [30, 45], actualRange: [18, 40], grilink: 'GRI 405-1', sdg: 5, weight: 6 },
    { name: 'Board Gender Diversity', dimension: 'governance', unit: '%', targetRange: [30, 50], actualRange: [20, 45], grilink: 'GRI 405-1', sdg: 5, weight: 5 },
    { name: 'Board Independence', dimension: 'governance', unit: '%', targetRange: [50, 75], actualRange: [40, 70], grilink: 'GRI 2-9', sdg: 16, weight: 5 },
    { name: 'Employee Turnover Rate', dimension: 'social', unit: '%', targetRange: [8, 15], actualRange: [10, 22], grilink: 'GRI 401-1', sdg: 8, weight: 4 },
    { name: 'New Hire Rate', dimension: 'workforce', unit: '%', targetRange: [10, 20], actualRange: [12, 25], grilink: 'GRI 401-1', sdg: 8, weight: 3 },
    { name: 'Training Hours per Employee', dimension: 'workforce', unit: 'hrs/yr', targetRange: [30, 50], actualRange: [20, 45], grilink: 'GRI 404-1', sdg: 4, weight: 4 },
    { name: 'Lost Time Injury Rate (LTIR)', dimension: 'social', unit: 'per 200K hrs', targetRange: [0.5, 1.5], actualRange: [0.8, 2.5], grilink: 'GRI 403-9', sdg: 3, weight: 6 },
    { name: 'Occupational Health Compliance', dimension: 'social', unit: '%', targetRange: [95, 100], actualRange: [85, 98], grilink: 'GRI 403-1', sdg: 3, weight: 5 },
    { name: 'Whistleblower Cases', dimension: 'governance', unit: 'count/yr', targetRange: [5, 15], actualRange: [3, 18], grilink: 'GRI 2-26', sdg: 16, weight: 4 },
    { name: 'Whistleblower Resolution Rate', dimension: 'governance', unit: '%', targetRange: [90, 100], actualRange: [75, 95], grilink: 'GRI 2-26', sdg: 16, weight: 4 },
    { name: 'Community Investment', dimension: 'community', unit: '₹L/yr', targetRange: [50, 150], actualRange: [30, 120], grilink: 'GRI 413-1', sdg: 11, weight: 4 },
    { name: 'Local Hiring %', dimension: 'community', unit: '%', targetRange: [60, 80], actualRange: [50, 75], grilink: 'GRI 413-1', sdg: 8, weight: 3 },
    { name: 'Anti-Corruption Training', dimension: 'governance', unit: '%', targetRange: [95, 100], actualRange: [80, 98], grilink: 'GRI 205-2', sdg: 16, weight: 4 },
    { name: 'Data Breach Incidents', dimension: 'governance', unit: 'count/yr', targetRange: [0, 1], actualRange: [0, 3], grilink: 'GRI 418-1', sdg: 16, weight: 5 },
    { name: 'Supplier ESG Assessment Rate', dimension: 'economic', unit: '%', targetRange: [70, 90], actualRange: [55, 82], grilink: 'GRI 308-1', sdg: 17, weight: 5 },
    { name: 'Sustainable Procurement %', dimension: 'economic', unit: '%', targetRange: [40, 60], actualRange: [25, 50], grilink: 'GRI 301-1', sdg: 12, weight: 4 },
    { name: 'ESG Linked Financing', dimension: 'economic', unit: '₹Cr', targetRange: [50, 200], actualRange: [20, 150], grilink: 'GRI 2-7', sdg: 7, weight: 4 },
    { name: 'Employee Engagement Score', dimension: 'workforce', unit: '/100', targetRange: [75, 90], actualRange: [60, 85], grilink: 'GRI 404-1', sdg: 8, weight: 4 },
  ];

  for (let i = 0; i < count && i < kpiTemplates.length; i++) {
    const t = kpiTemplates[i];
    const actual = +(t.actualRange[0] + seededRand(i + 100) * (t.actualRange[1] - t.actualRange[0])).toFixed(2);
    const target = +(t.targetRange[0] + seededRand(i + 200) * (t.targetRange[1] - t.targetRange[0])).toFixed(2);
    const prevYear = +(actual * (0.9 + seededRand(i + 300) * 0.2)).toFixed(2);
    const diff = actual - prevYear;
    let trend: 'improving' | 'stable' | 'declining' = 'stable';
    if (t.name.includes('Rate') || t.name.includes('Incident') || t.name.includes('Cases') || t.name.includes('Turnover')) {
      trend = diff < 0 ? 'improving' : diff > 0.05 * actual ? 'declining' : 'stable';
    } else {
      trend = diff > 0.02 * actual ? 'improving' : diff < -0.02 * actual ? 'declining' : 'stable';
    }
    const isOnTrack = (t.name.includes('Rate') || t.name.includes('Incident') || t.name.includes('Cases') || t.name.includes('Turnover'))
      ? actual <= target : actual >= target;
    const status: SustainabilityKPI['status'] = isOnTrack ? 'on_track' : Math.abs(actual - target) < 0.15 * target ? 'at_risk' : 'off_track';

    kpis.push({
      id: `KPI-${(i + 1).toString().padStart(4, '0')}`,
      kpiCode: `ESG-KPI-${String(i + 1).padStart(2, '0')}`,
      name: t.name,
      dimension: t.dimension,
      unit: t.unit,
      target,
      actual,
      previousYear: prevYear,
      trend,
      status,
      grilink: t.grilink,
      sdgAlignment: t.sdg,
      weight: t.weight,
    });
  }
  return kpis;
}

function generateGRIIndicators(count: number): GRIIndicator[] {
  const indicators: GRIIndicator[] = [];
  const griTemplates: { code: string; standard: string; topic: string; description: string; requirement: string; team: string }[] = [
    { code: 'GRI 305-1', standard: 'Emissions', topic: 'Direct (Scope 1) GHG emissions', description: 'Gross direct GHG emissions in tCO2e from owned/controlled sources.', requirement: 'Mandatory (BRSR)', team: 'Environment' },
    { code: 'GRI 305-2', standard: 'Emissions', topic: 'Energy indirect (Scope 2) GHG emissions', description: 'Gross indirect GHG emissions from purchased electricity, steam, heating, cooling.', requirement: 'Mandatory (BRSR)', team: 'Environment' },
    { code: 'GRI 305-3', standard: 'Emissions', topic: 'Other indirect (Scope 3) GHG emissions', description: 'All other relevant indirect GHG emissions by category.', requirement: 'Recommended (BRSR)', team: 'Supply Chain' },
    { code: 'GRI 305-4', standard: 'Emissions', topic: 'GHG emissions reductions', description: 'GHG emissions reductions achieved vs baseline year.', requirement: 'Mandatory (BRSR)', team: 'Environment' },
    { code: 'GRI 301-1', standard: 'Materials', topic: 'Materials used by weight or volume', description: 'Total materials input by type (renewable vs non-renewable).', requirement: 'Recommended (BRSR)', team: 'Procurement' },
    { code: 'GRI 301-2', standard: 'Materials', topic: 'Recycled input materials used', description: 'Percentage of recycled materials in total material inputs.', requirement: 'Recommended', team: 'Procurement' },
    { code: 'GRI 302-1', standard: 'Energy', topic: 'Energy consumption within the organization', description: 'Total energy consumption by fuel type and total (MWh/GJ).', requirement: 'Mandatory (BRSR)', team: 'Facilities' },
    { code: 'GRI 302-3', standard: 'Energy', topic: 'Energy intensity ratio', description: 'Energy consumption per unit of economic output.', requirement: 'Recommended', team: 'Facilities' },
    { code: 'GRI 303-1', standard: 'Water', topic: 'Water withdrawal by source', description: 'Total water withdrawal by source type (ML).', requirement: 'Mandatory (BRSR)', team: 'Environment' },
    { code: 'GRI 303-3', standard: 'Water', topic: 'Water recycled and reused', description: 'Total volume of water recycled and reused (ML).', requirement: 'Recommended', team: 'Facilities' },
    { code: 'GRI 306-3', standard: 'Waste', topic: 'Waste generated', description: 'Total weight of waste generated by type (tonnes).', requirement: 'Mandatory (BRSR)', team: 'Environment' },
    { code: 'GRI 306-4', standard: 'Waste', topic: 'Waste diverted from disposal', description: 'Percentage of waste diverted from disposal (recycled, reused, composted).', requirement: 'Recommended', team: 'Environment' },
    { code: 'GRI 401-1', standard: 'Employment', topic: 'New employee hires and turnover', description: 'Number of new hires and employee turnover rate by category.', requirement: 'Mandatory (BRSR)', team: 'HR' },
    { code: 'GRI 403-1', standard: 'Occupational Health & Safety', topic: 'OHS management system', description: 'Description of OHS management system and certification status.', requirement: 'Mandatory (BRSR)', team: 'Safety' },
    { code: 'GRI 403-9', standard: 'Occupational Health & Safety', topic: 'Work-related injuries', description: 'Work-related injuries, type, rates, and fatalities.', requirement: 'Mandatory (BRSR)', team: 'Safety' },
    { code: 'GRI 405-1', standard: 'Diversity', topic: 'Diversity of governance bodies and employees', description: 'Diversity indicators for governance bodies and employees.', requirement: 'Mandatory (BRSR)', team: 'HR' },
    { code: 'GRI 410-1', standard: 'Security', topic: 'Security personnel trained in human rights', description: 'Percentage of security personnel trained in human rights policies.', requirement: 'Recommended', team: 'Security' },
    { code: 'GRI 413-1', standard: 'Local Communities', topic: 'Operations with local community engagement', description: 'Percentage of operations with local community engagement and impact assessments.', requirement: 'Recommended', team: 'CSR' },
    { code: 'GRI 2-7', standard: 'General', topic: 'Financial implications of climate change', description: 'Financial effects of climate change on the organization and its adaptation plans.', requirement: 'Mandatory (BRSR)', team: 'Finance' },
    { code: 'GRI 205-2', standard: 'Anti-Corruption', topic: 'Communication and training about anti-corruption', description: 'Anti-corruption policies communicated and training conducted.', requirement: 'Recommended', team: 'Compliance' },
  ];

  for (let i = 0; i < count && i < griTemplates.length; i++) {
    const t = griTemplates[i];
    const statuses: DisclosureStatus[] = ['full', 'full', 'partial', 'partial', 'minimal', 'not_disclosed'];
    const disclosureStatus = statuses[i % statuses.length];
    const qualities: GRIIndicator['dataQuality'][] = ['high', 'medium', 'low', 'not_assessed'];
    const dataQuality = qualities[i % qualities.length];
    const reportedDaysAgo = randInt(30, 365, i + 100);

    indicators.push({
      id: `GRI-${(i + 1).toString().padStart(4, '0')}`,
      griCode: t.code,
      griStandard: t.standard,
      topic: t.topic,
      disclosureStatus,
      description: t.description,
      complianceRequirement: t.requirement,
      lastReported: daysAgo(reportedDaysAgo).toISOString(),
      nextDue: daysAhead(randInt(30, 365, i + 200)).toISOString(),
      dataQuality,
      responsibleTeam: t.team,
      notes: disclosureStatus === 'full' ? 'Fully compliant with GRI Standards disclosure requirements.' : disclosureStatus === 'partial' ? 'Partial disclosure — additional data collection in progress.' : 'Disclosure gap identified. Remediation plan in development.',
    });
  }
  return indicators;
}

function generateRisks(count: number): ESGRisk[] {
  const risks: ESGRisk[] = [];
  for (let i = 0; i < count && i < RISK_TEMPLATES.length; i++) {
    const t = RISK_TEMPLATES[i];
    const prob = PROBABILITY_META[t.baseProbability].score;
    const imp = IMPACT_META[t.baseImpact].score;
    const riskScore = prob * imp;
    const riskLevel: ESGRisk['riskLevel'] = riskScore >= 20 ? 'critical' : riskScore >= 12 ? 'high' : riskScore >= 6 ? 'medium' : 'low';
    const mitStatuses: MitigationStatus[] = ['implemented', 'monitoring', 'in_progress', 'not_started', 'implemented'];
    const mitigationStatus = mitStatuses[i % mitStatuses.length];

    risks.push({
      id: `ESG-RSK-${(i + 1).toString().padStart(4, '0')}`,
      riskCode: `RSK/${String(i + 1).padStart(3, '0')}`,
      title: t.title,
      category: t.category,
      probability: t.baseProbability,
      impact: t.baseImpact,
      probabilityScore: prob,
      impactScore: imp,
      riskScore,
      riskLevel,
      mitigationStatus,
      mitigationPlan: t.mitigation,
      owner: pick(AUDITOR_POOL, i + 100),
      lastReviewed: daysAgo(randInt(15, 180, i + 200)).toISOString(),
      nextReview: daysAhead(randInt(30, 180, i + 250)).toISOString(),
      notes: `Risk assessed using ISO 31000 framework. Category: ${t.category}.`,
    });
  }
  return risks;
}

function generateFindings(audits: ESGAudit[], count: number): ESGFinding[] {
  const findings: ESGFinding[] = [];
  for (let i = 0; i < count; i++) {
    const audit = audits[i % audits.length];
    const template = FINDING_DESCRIPTIONS[i % FINDING_DESCRIPTIONS.length];
    const identifiedDaysAgo = randInt(5, 300, i + 50);
    const dueDays = randInt(15, 90, i + 100);
    const closedDaysAgo = seededRand(i + 150) > 0.4 ? randInt(1, dueDays - 5, i + 200) : 0;
    const isOverdue = identifiedDaysAgo > dueDays && closedDaysAgo === 0;
    const status: ESGFindingStatus = closedDaysAgo > 0 ? 'closed' : isOverdue ? 'overdue' : seededRand(i + 250) > 0.5 ? 'in_progress' : 'open';
    const rootCauses: string[] = [
      'Lack of formal documentation and process standardization.',
      'Insufficient training and awareness among operational staff.',
      'Resource constraints preventing timely implementation.',
      'Process gap identified during audit — SOP requires revision.',
      'Third-party dependency causing delays in compliance.',
    ];
    const correctiveActions: string[] = [
      'Revised SOP issued and training completed for all affected staff.',
      'Additional resources allocated for Q2 implementation.',
      'Third-party engagement initiated with 30-day SLA.',
      'CAPA plan approved by ESG committee. Weekly monitoring activated.',
      'Interim controls implemented pending permanent solution.',
    ];

    findings.push({
      id: `ESG-FND-${(i + 1).toString().padStart(4, '0')}`,
      findingCode: `ESG-FND/${TODAY.getFullYear()}/${String(i + 1).padStart(3, '0')}`,
      auditId: audit.id,
      auditCode: audit.auditCode,
      scope: template.scope,
      severity: template.severity,
      status,
      category: template.category,
      description: template.desc,
      identifiedDate: daysAgo(identifiedDaysAgo).toISOString(),
      dueDate: daysAgo(identifiedDaysAgo - dueDays).toISOString(),
      daysToDue: dueDays - identifiedDaysAgo,
      closedDate: closedDaysAgo > 0 ? daysAgo(closedDaysAgo).toISOString() : null,
      rootCause: status !== 'open' ? pick(rootCauses, i + 300) : null,
      correctiveAction: status !== 'open' ? pick(correctiveActions, i + 350) : null,
      preventiveAction: status === 'closed' ? 'Systemic controls updated across all warehouses. Monitoring frequency increased.' : null,
      capaId: status !== 'open' ? `CAPA-ESG-${String(i + 1).padStart(4, '0')}` : null,
      verificationMethod: status === 'closed' ? 'document_review' : status === 'pending_verification' ? 'on_site_verification' : null,
      verifiedBy: status === 'closed' ? pick(AUDITOR_POOL, i + 400) : null,
      owner: pick(AUDITOR_POOL, i + 450),
      warehouseName: audit.warehouseName,
    });
  }
  return findings;
}

function generateComplianceObligations(count: number): ComplianceObligation[] {
  const obligations: ComplianceObligation[] = [];
  for (let i = 0; i < count && i < COMPLIANCE_REGULATIONS.length; i++) {
    const reg = COMPLIANCE_REGULATIONS[i];
    const statuses: ComplianceStatus[] = ['compliant', 'compliant', 'partial', 'partial', 'non_compliant', 'pending_review'];
    const status = statuses[i % statuses.length];
    const score = status === 'compliant' ? randInt(85, 100, i + 100) : status === 'partial' ? randInt(55, 84, i + 150) : status === 'non_compliant' ? randInt(20, 54, i + 200) : randInt(40, 70, i + 250);

    obligations.push({
      id: `COMP-${(i + 1).toString().padStart(4, '0')}`,
      obligationCode: `COMP/${String(i + 1).padStart(3, '0')}`,
      regulation: reg.regulation,
      authority: reg.authority,
      category: reg.category,
      status,
      complianceScore: score,
      dueDate: daysAhead(randInt(30, 365, i + 300)).toISOString(),
      lastAssessed: daysAgo(randInt(15, 180, i + 350)).toISOString(),
      nextAssessment: daysAhead(randInt(30, 180, i + 400)).toISOString(),
      sdgAlignment: reg.sdg,
      penalties: reg.penalties,
      responsibleTeam: pick(['Compliance', 'Environment', 'HR', 'Legal', 'Operations', 'ESG Team'], i + 450),
      notes: status === 'compliant' ? 'All requirements met. Next assessment scheduled.' : status === 'partial' ? 'Partial compliance — remediation plan in progress.' : status === 'non_compliant' ? 'Non-compliance identified. Immediate action required.' : 'Assessment pending — data collection in progress.',
    });
  }
  return obligations;
}

// ============================================================================
// KPI Computation
// ============================================================================
function computeKPIs(audits: ESGAudit[], findings: ESGFinding[], carbonRecords: CarbonRecord[], kpis: SustainabilityKPI[], griIndicators: GRIIndicator[], risks: ESGRisk[]) {
  const totalAudits = audits.length;
  const completedAudits = audits.filter(a => a.status === 'completed').length;
  const openFindings = findings.filter(f => f.status === 'open' || f.status === 'in_progress').length;
  const criticalFindings = findings.filter(f => f.severity === 'critical' && f.status !== 'closed').length;
  const overdueFindings = findings.filter(f => f.status === 'overdue').length;

  const totalEmissions = carbonRecords.reduce((s, r) => s + r.currentEmissions, 0);
  const totalBaseline = carbonRecords.reduce((s, r) => s + r.baselineEmissions, 0);
  const reductionVsBaseline = totalBaseline > 0 ? Math.round(((totalBaseline - totalEmissions) / totalBaseline) * 100) : 0;

  const renewableKPI = kpis.find(k => k.name === 'Renewable Energy %');
  const renewableEnergyPct = renewableKPI ? renewableKPI.actual : 0;

  const wasteDiversionKPI = kpis.find(k => k.name === 'Waste Diversion Rate');
  const wasteDiversionRate = wasteDiversionKPI ? wasteDiversionKPI.actual : 0;

  const waterKPI = kpis.find(k => k.name === 'Water Usage Intensity');
  const waterIntensity = waterKPI ? waterKPI.actual : 0;

  const griFullCount = griIndicators.filter(g => g.disclosureStatus === 'full').length;
  const griCompliancePct = griIndicators.length > 0 ? Math.round((griFullCount / griIndicators.length) * 100) : 0;

  const envScore = kpis.filter(k => k.dimension === 'environmental').reduce((s, k) => s + (k.status === 'on_track' ? k.weight : k.status === 'at_risk' ? k.weight * 0.5 : 0), 0);
  const socScore = kpis.filter(k => k.dimension === 'social').reduce((s, k) => s + (k.status === 'on_track' ? k.weight : k.status === 'at_risk' ? k.weight * 0.5 : 0), 0);
  const govScore = kpis.filter(k => k.dimension === 'governance').reduce((s, k) => s + (k.status === 'on_track' ? k.weight : k.status === 'at_risk' ? k.weight * 0.5 : 0), 0);
  const econScore = kpis.filter(k => k.dimension === 'economic').reduce((s, k) => s + (k.status === 'on_track' ? k.weight : k.status === 'at_risk' ? k.weight * 0.5 : 0), 0);
  const commScore = kpis.filter(k => k.dimension === 'community').reduce((s, k) => s + (k.status === 'on_track' ? k.weight : k.status === 'at_risk' ? k.weight * 0.5 : 0), 0);
  const workScore = kpis.filter(k => k.dimension === 'workforce').reduce((s, k) => s + (k.status === 'on_track' ? k.weight : k.status === 'at_risk' ? k.weight * 0.5 : 0), 0);
  const maxWeight = kpis.reduce((s, k) => s + k.weight, 0);
  const esgCompositeScore = maxWeight > 0 ? Math.round(((envScore + socScore + govScore + econScore + commScore + workScore) / maxWeight) * 100) : 0;

  const sustainabilityRating = esgCompositeScore >= 90 ? 'AAA' : esgCompositeScore >= 82 ? 'AA' : esgCompositeScore >= 74 ? 'A' : esgCompositeScore >= 66 ? 'BBB' : esgCompositeScore >= 58 ? 'BB' : esgCompositeScore >= 50 ? 'B' : 'CCC';

  return {
    totalAudits,
    completedAudits,
    openFindings,
    criticalFindings,
    overdueFindings,
    totalCarbonFootprint_tCO2e: totalEmissions,
    reductionVsBaseline_pct: reductionVsBaseline,
    renewableEnergy_pct: renewableEnergyPct,
    wasteDiversionRate_pct: wasteDiversionRate,
    waterIntensity_perUnit: waterIntensity,
    griCompliance_pct: griCompliancePct,
    esgCompositeScore,
    sustainabilityRating,
  };
}

// ============================================================================
// In-memory cache (60s TTL)
// ============================================================================
let cachedResponse: { data: unknown; ts: number } | null = null;
const CACHE_TTL_MS = 60 * 1000;

export async function GET() {
  if (cachedResponse && Date.now() - cachedResponse.ts < CACHE_TTL_MS) {
    return NextResponse.json(cachedResponse.data);
  }

  try {
    const warehouses = mockWarehouses.slice(0, 8).map((w, i) => ({
      id: w.id,
      code: `WH${i + 1}`,
      name: w.name,
      city: w.city,
    }));

    const audits = generateAudits(24);
    const carbonRecords = generateCarbonRecords(18);
    const sustainabilityKPIs = generateKPIs(30);
    const griIndicators = generateGRIIndicators(20);
    const risks = generateRisks(15);
    const findings = generateFindings(audits, 35);
    const complianceObligations = generateComplianceObligations(20);

    const kpis = computeKPIs(audits, findings, carbonRecords, sustainabilityKPIs, griIndicators, risks);

    // Chart aggregates
    const auditsByScope = (Object.keys(SCOPE_META) as ESGScope[]).map(s => ({
      scope: s, label: SCOPE_META[s].label, color: SCOPE_META[s].color,
      count: audits.filter(a => a.scope === s).length,
    }));
    const auditsByStatus = (Object.keys(AUDIT_STATUS_META) as ESGAuditStatus[]).map(s => ({
      status: s, label: AUDIT_STATUS_META[s].label, color: AUDIT_STATUS_META[s].color,
      count: audits.filter(a => a.status === s).length,
    }));
    const auditsByOutcome = (Object.keys(AUDIT_OUTCOME_META) as ESGAuditOutcome[]).map(o => ({
      outcome: o, label: AUDIT_OUTCOME_META[o].label, color: AUDIT_OUTCOME_META[o].color,
      count: audits.filter(a => a.outcome === o).length,
    }));

    const findingsBySeverity = (Object.keys(FINDING_SEVERITY_META) as ESGFindingSeverity[]).map(s => ({
      severity: s, label: FINDING_SEVERITY_META[s].label, color: FINDING_SEVERITY_META[s].color,
      count: findings.filter(f => f.severity === s).length,
      open: findings.filter(f => f.severity === s && f.status !== 'closed').length,
    }));
    const findingsByStatus = (Object.keys(FINDING_STATUS_META) as ESGFindingStatus[]).map(s => ({
      status: s, label: FINDING_STATUS_META[s].label, color: FINDING_STATUS_META[s].color,
      count: findings.filter(f => f.status === s).length,
    }));

    const emissionsByScope = (Object.keys(CARBON_SCOPE_META) as CarbonScope[]).map(s => ({
      scope: s, label: CARBON_SCOPE_META[s].label, color: CARBON_SCOPE_META[s].color,
      total: carbonRecords.filter(r => r.scope === s).reduce((sum, r) => sum + r.currentEmissions, 0),
      baseline: carbonRecords.filter(r => r.scope === s).reduce((sum, r) => sum + r.baselineEmissions, 0),
    }));

    // 12-month KPI trend
    const kpiTrend = Array.from({ length: 12 }, (_, i) => {
      const monthDate = new Date(TODAY.getFullYear(), TODAY.getMonth() - 11 + i, 1);
      const month = monthDate.toLocaleString('en-US', { month: 'short' });
      return {
        month,
        emissions: randInt(800, 2000, i + 50),
        renewable: randInt(20, 55, i + 100),
        wasteDiversion: randInt(55, 88, i + 150),
        waterIntensity: +(0.8 + seededRand(i + 200) * 1.2).toFixed(2),
        compositeScore: randInt(55, 85, i + 250),
      };
    });

    // Risk heatmap data
    const riskHeatmap = Array.from({ length: 5 }, (_, pi) =>
      Array.from({ length: 5 }, (_, ii) => {
        const p = pi + 1;
        const imp = ii + 1;
        const matching = risks.filter(r => r.probabilityScore === p && r.impactScore === imp);
        return { probability: p, impact: imp, score: p * imp, count: matching.length, risks: matching.map(r => r.title) };
      })
    ).flat();

    // Compliance by regulation
    const complianceByRegulation = complianceObligations.map(o => ({
      id: o.id,
      regulation: o.regulation,
      authority: o.authority,
      category: o.category,
      status: o.status,
      complianceScore: o.complianceScore,
      sdgAlignment: o.sdgAlignment,
      penalties: o.penalties,
      responsibleTeam: o.responsibleTeam,
    }));

    // Audit trend (12 months)
    const auditTrend = Array.from({ length: 12 }, (_, i) => {
      const monthDate = new Date(TODAY.getFullYear(), TODAY.getMonth() - 11 + i, 1);
      const monthStart = monthDate.getTime();
      const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1).getTime();
      const monthAudits = audits.filter(a => {
        const t = new Date(a.scheduledDate).getTime();
        return t >= monthStart && t < monthEnd;
      });
      return {
        month: monthDate.toLocaleString('en-US', { month: 'short' }),
        scheduled: monthAudits.length + randInt(0, 2, i + 50),
        completed: monthAudits.filter(a => a.status === 'completed').length + randInt(0, 2, i + 100),
      };
    });

    // Emissions by warehouse
    const emissionsByWarehouse = Array.from({ length: 8 }, (_, i) => ({
      warehouse: WAREHOUSE_NAMES[i],
      scope1: carbonRecords.filter(r => r.warehouseId === `WH-${String(i + 1).padStart(2, '0')}` && r.scope === 'scope1').reduce((s, r) => s + r.currentEmissions, 0),
      scope2: carbonRecords.filter(r => r.warehouseId === `WH-${String(i + 1).padStart(2, '0')}` && r.scope === 'scope2').reduce((s, r) => s + r.currentEmissions, 0),
      scope3: carbonRecords.filter(r => r.warehouseId === `WH-${String(i + 1).padStart(2, '0')}` && r.scope === 'scope3').reduce((s, r) => s + r.currentEmissions, 0),
    }));

    // Carbon reduction trajectory
    const reductionTrajectory = Array.from({ length: 6 }, (_, i) => {
      const year = 2020 + i;
      const baseReduction = i * 4;
      return {
        year,
        target: baseReduction + randInt(2, 8, i + 100),
        actual: baseReduction + randInt(0, 7, i + 150),
      };
    });

    // Auto-generated insights
    const insights: { type: 'danger' | 'warning' | 'success' | 'info'; title: string; description: string; recommendation: string }[] = [];
    if (kpis.criticalFindings > 0) {
      insights.push({ type: 'danger', title: `${kpis.criticalFindings} Open Critical ESG Findings`, description: `Critical findings require immediate executive attention and corrective action to maintain ESG compliance.`, recommendation: 'Escalate to ESG Committee. Initiate emergency CAPA within 48 hours.' });
    }
    if (kpis.overdueFindings > 0) {
      insights.push({ type: 'danger', title: `${kpis.overdueFindings} Overdue ESG Findings`, description: 'Overdue findings indicate CAPA process delays. Regulatory non-compliance risk elevated.', recommendation: 'Assign dedicated resources. Update risk register with overdue impact.' });
    }
    if (kpis.renewableEnergy_pct < 30) {
      insights.push({ type: 'warning', title: `Renewable Energy at ${kpis.renewableEnergy_pct}% — Below 30% Threshold`, description: 'Current renewable energy share is below the 2030 interim target trajectory.', recommendation: 'Accelerate solar rooftop installation. Explore PPA options for renewable electricity procurement.' });
    }
    if (kpis.griCompliance_pct < 70) {
      insights.push({ type: 'warning', title: `GRI Compliance at ${kpis.griCompliance_pct}% — Disclosure Gaps`, description: 'Several GRI indicators lack full disclosure, affecting BRSR reporting readiness.', recommendation: 'Prioritize GRI indicators with "not_disclosed" status. Assign data collection ownership.' });
    }
    insights.push({ type: 'success', title: `ESG Composite Score: ${kpis.esgCompositeScore} (${kpis.sustainabilityRating})`, description: `Composite score reflects performance across Environmental (${Math.round(sustainabilityKPIs.filter(k => k.dimension === 'environmental').reduce((s, k) => s + (k.status === 'on_track' ? 100 : k.status === 'at_risk' ? 50 : 0), 0) / Math.max(sustainabilityKPIs.filter(k => k.dimension === 'environmental').length, 1))}%), Social, and Governance dimensions.`, recommendation: 'Use composite score for stakeholder communication and investor reporting.' });
    insights.push({ type: 'info', title: `Carbon Footprint: ${kpis.totalCarbonFootprint_tCO2e.toLocaleString()} tCO2e`, description: `Total carbon footprint across all warehouses. ${kpis.reductionVsBaseline_pct > 0 ? `${kpis.reductionVsBaseline_pct}% reduction vs baseline year (2020).` : 'Increase from baseline — mitigation actions needed.'}`, recommendation: 'Review carbon reduction trajectory. Identify top-emitting warehouses for targeted intervention.' });
    if (kpis.wasteDiversionRate_pct < 70) {
      insights.push({ type: 'warning', title: `Waste Diversion at ${kpis.wasteDiversionRate_pct}%`, description: 'Waste diversion rate below 70% target. Landfill dependency is high.', recommendation: 'Implement waste segregation at source. Partner with certified recycling vendors.' });
    }
    insights.push({ type: 'info', title: `${risks.filter(r => r.riskLevel === 'critical' || r.riskLevel === 'high').length} High/Critical ESG Risks`, description: 'Multiple ESG risks require board-level attention. Review risk mitigation plans.', recommendation: 'Present ESG risk dashboard at next board meeting. Update risk appetite statement.' });
    insights.push({ type: 'success', title: `SDG Alignment: ${complianceObligations.filter(o => o.sdgAlignment).length} Regulations SDG-Linked`, description: 'Compliance obligations mapped to UN Sustainable Development Goals for integrated reporting.', recommendation: 'Include SDG alignment matrix in annual sustainability report.' });

    const responseData = {
      generatedAt: new Date().toISOString(),
      kpis,
      audits,
      carbonRecords,
      sustainabilityKPIs,
      griIndicators,
      risks,
      findings,
      complianceObligations,
      auditsByScope,
      auditsByStatus,
      auditsByOutcome,
      findingsBySeverity,
      findingsByStatus,
      emissionsByScope,
      kpiTrend,
      riskHeatmap,
      complianceByRegulation,
      auditTrend,
      emissionsByWarehouse,
      reductionTrajectory,
      insights,
      meta: {
        totalAudits: audits.length,
        totalCarbonRecords: carbonRecords.length,
        totalKPIs: sustainabilityKPIs.length,
        totalGRIIndicators: griIndicators.length,
        totalRisks: risks.length,
        totalFindings: findings.length,
        totalComplianceObligations: complianceObligations.length,
        warehouseCount: warehouses.length,
        constants: {
          scopes: Object.entries(SCOPE_META).map(([k, v]) => ({ id: k as ESGScope, ...v })),
          frequencies: Object.entries(FREQUENCY_META).map(([k, v]) => ({ id: k as AuditFrequency, ...v })),
          auditStatuses: Object.entries(AUDIT_STATUS_META).map(([k, v]) => ({ id: k as ESGAuditStatus, ...v })),
          auditOutcomes: Object.entries(AUDIT_OUTCOME_META).map(([k, v]) => ({ id: k as ESGAuditOutcome, ...v })),
          carbonScopes: Object.entries(CARBON_SCOPE_META).map(([k, v]) => ({ id: k as CarbonScope, ...v })),
          verificationStatuses: Object.entries(VERIFICATION_META).map(([k, v]) => ({ id: k as VerificationStatus, ...v })),
          findingSeverities: Object.entries(FINDING_SEVERITY_META).map(([k, v]) => ({ id: k as ESGFindingSeverity, ...v })),
          findingStatuses: Object.entries(FINDING_STATUS_META).map(([k, v]) => ({ id: k as ESGFindingStatus, ...v })),
          complianceStatuses: Object.entries(COMPLIANCE_STATUS_META).map(([k, v]) => ({ id: k as ComplianceStatus, ...v })),
          disclosureStatuses: Object.entries(DISCLOSURE_STATUS_META).map(([k, v]) => ({ id: k as DisclosureStatus, ...v })),
          probabilities: Object.entries(PROBABILITY_META).map(([k, v]) => ({ id: k as RiskProbability, ...v })),
          impacts: Object.entries(IMPACT_META).map(([k, v]) => ({ id: k as RiskImpact, ...v })),
          mitigationStatuses: Object.entries(MITIGATION_STATUS_META).map(([k, v]) => ({ id: k as MitigationStatus, ...v })),
        },
      },
    };

    cachedResponse = { data: responseData, ts: Date.now() };
    return NextResponse.json(responseData);
  } catch (err: unknown) {
    const error = err as Error;
    console.error('[esg-sustainability-audit] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ESG sustainability audit data', details: error.message },
      { status: 500 },
    );
  }
}
