"use client";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar";
import { ModuleBreadcrumb } from "@/components/shared/module-breadcrumb";

const COLORS = ["#1e1b4b", "#312e81", "#3730a3", "#4338ca", "#4f46e5", "#6366f1", "#818cf8", "#a5b4fc"];
const OPERATORS = ["ISRO Quantum Bengaluru", "DRDO Bengaluru", "C-DOT Delhi", "TCS Innovation Mumbai", "Wipro Quantum Bengaluru", "IIT Bombay Quantum Lab", "QC Design Kolkata", "Tata Institute Mumbai"];
const CATEGORIES = ["QKD BB84 200km Fiber", "QKD E91 Entanglement 50km", "Quantum Repeater Node 500km", "QRNG Satellite Link 1000km", "Quantum Memory Buffer 10ms", "QKD Network Hub 8-Channel", "Post-Quantum Crypto KEM", "Quantum Trusted Node 100km"];
const SHIPMENT_STATUSES = ["QKD Key Generation Setup", "Fiber Splicing Alignment", "Satellite Ground Station Sync", "Encryption Module Integration", "Network Certification Testing", "Operational Key Exchange Active"];
const ZONES = ["Delhi Mumbai Quantum Corridor", "Bengaluru Chennai Link", "Hyderabad Kolkata Path", "Mumbai Pune Express", "Delhi Kolkata Trunk", "Chennai Thiruvananthapuram", "Ahmedabad Jaipur Route", "Guwahati Shillong NE"];
const MODES = ["Fiber Optic Splicing Van", "Cryogenic Transport Vehicle", "Satellite Uplink Truck", "Secure Courier Armored", "Air Freight Specialized", "Multi-Mode Fiber Reel Trailer"];
const TABS = ["Dashboard", "Node Registry", "Quantum Analytics", "Insights"];

const statusColor: Record<string, string> = { "QKD Key Generation Setup": "orange", "Fiber Splicing Alignment": "orange", "Satellite Ground Station Sync": "blue", "Encryption Module Integration": "blue", "Network Certification Testing": "orange", "Operational Key Exchange Active": "green" };

function formatINR(n: number): string {
  if (n >= 10000000) return "\u20b9" + (n / 10000000).toFixed(1) + "Cr";
  if (n >= 100000) return "\u20b9" + (n / 100000).toFixed(1) + "L";
  return "\u20b9" + (n / 1000).toFixed(0) + "K";
}

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthlyKeys = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], bb84: +(500 + Math.sin(i * 0.5) * 200).toFixed(0), e91: +(200 + Math.cos(i * 0.6) * 80).toFixed(0), qrng: +(800 + Math.sin(i * 0.4) * 300).toFixed(0), repeater: +(50 + Math.cos(i * 0.7) * 20).toFixed(0) }));
const techDist = [{ n: "QKD BB84", v: 30 }, { n: "QKD E91", v: 15 }, { n: "QRNG Sat", v: 25 }, { n: "Repeater", v: 10 }, { n: "PQC KEM", v: 12 }, { n: "Trusted Node", v: 8 }];
const keyRateTrend = Array.from({ length: 12 }, (_, i) => ({ m: MO[i], fiber: +(1.5 + Math.sin(i * 0.3) * 0.5).toFixed(2), satellite: +(0.8 + Math.cos(i * 0.4) * 0.3).toFixed(2), freeSpace: +(0.3 + Math.sin(i * 0.5) * 0.1).toFixed(2) }));
const zoneNodes = [
  { zone: "DLI-BOM", nodes: 24 },
  { zone: "BLR-CHN", nodes: 18 },
  { zone: "HYD-KOL", nodes: 15 },
  { zone: "BOM-PUN", nodes: 12 },
  { zone: "DLI-KOL", nodes: 20 },
  { zone: "CHN-TVM", nodes: 10 },
  { zone: "AMD-JAI", nodes: 8 },
  { zone: "GHY-SHL", nodes: 6 }
];

const INSIGHTS = [
  { t: "India\u2019s National Quantum Mission: \u20b96,000 Crore for QKD Network", c: "India launched the National Quantum Mission (NQM) in April 2023 with a budget of \u20b96,000 crore ($720 million) spanning 2023-2031, making it one of the world\u2019s largest government-funded quantum technology programs. The NQM encompasses four thematic hubs: Thematic Hub on Quantum Computing at IISc Bengaluru (led by Prof. Animesh Chakraborty), Thematic Hub on Quantum Communication at IIT Delhi (Prof. Arun Pati), Thematic Hub on Quantum Sensing at IIT Madras, and Thematic Hub on Quantum Materials at TIFR Mumbai. The quantum communication hub is deploying a 2,000km inter-city Quantum Key Distribution (QKD) fiber network connecting Delhi-Mumbai-Bengaluru-Chennai-Kolkata-Hyderabad using BB84 and E91 protocols, with operational key rates of 1-2 Mbps on dark fiber channels. DRDO\u2019s Defence Research and Development Establishment (DRDE) Gwalior has developed India\u2019s indigenous QKD system with 150km range on standard telecom fiber at 1Mbps, while ISRO\u2019s Space Applications Centre (SAC) Ahmedabad has conducted satellite-based QKD demonstrations using the indigenous QKD payload on GSAT-3A satellite achieving 10kbps key rate over 1,000km free-space link." },
  { t: "QKD BB84 and E91 Protocols: Fiber-Based Quantum Key Distribution in India", c: "India\u2019s quantum key distribution infrastructure uses two primary protocols: BB84 (Bennett-Brassard 1984) for prepare-and-measure weak coherent pulse QKD, and E91 (Ekert 1991) for entanglement-based QKD with Bell inequality violation verification. The BB84 protocol deployed by C-DOT (Centre for Development of Telematics) Delhi uses 1550nm wavelength weak coherent laser pulses at 1MHz repetition rate, InGaAs single-photon detectors (SPD) with 10% detection efficiency and 100ps timing jitter, and polarization encoding with 4 states (H, V, D, A) achieving 1-2 Mbps secure key rate over 100km of standard SMF-28 fiber. The E91 protocol developed by IIT Bombay uses polarization-entangled photon pairs generated via spontaneous parametric down-conversion (SPDC) in periodically-poled lithium niobate (PPLN) crystals pumped by 775nm CW laser, producing entangled photon pairs at 1550nm with Bell state fidelity exceeding 99%. India\u2019s longest operational QKD fiber link (200km) connects Delhi to Jaipur via BSNL dark fiber, using ID Quantique (Switzerland) Cerberis QKD appliances as trusted nodes with 256-bit AES key refresh every 5 minutes for banking and government secure communications." },
  { t: "Satellite-Based Quantum Communication and QRNG for Indian Defence", c: "ISRO\u2019s Quantum Communication Experiment (QCE) payload aboard GSAT-3A (launched August 2024) is India\u2019s first dedicated quantum communication satellite carrying a QKD transmitter with 850nm downlink and 775nm uplink beacon for ground station acquisition and tracking. The satellite achieves 10-50kbps secure key rate over 1,000km slant range to ISRO\u2019s ground station at SAC Ahmedabad using weak coherent pulse BB84 protocol with decoy states to counter photon-number-splitting (PNS) attacks. DRDO\u2019s Defence Research and Development Laboratory (DRDL) Hyderabad has developed an indigenous Quantum Random Number Generator (QRNG) based on vacuum fluctuation measurements using balanced homodyne detection of coherent laser states at 1550nm, producing provably random numbers at 100Mbps throughput certified by NIST SP 800-90B entropy tests. The QRNG system is being deployed at Indian Navy and Indian Air Force communication hubs for generating one-time pad encryption keys for strategic command and control networks. India\u2019s planned QKD satellite constellation (2 satellites in 500km SSO by 2028) will enable continuous quantum-secure communication across the Indian subcontinent, Bay of Bengal, and Arabian Sea regions." },
  { t: "Post-Quantum Cryptography (PQC) Transition: NIST Standards and Indian Adoption", c: "India\u2019s transition to post-quantum cryptography (PQC) is driven by the NIST standardization of CRYSTALS-Kyber (ML-KEM-768/1024) for key encapsulation and CRYSTALS-Dilithium (ML-DSA-65/87) for digital signatures, finalized in August 2024. The Ministry of Electronics and Information Technology (MeitY) has constituted a PQC Task Force under NIC (National Informatics Centre) to develop migration roadmaps for Indian government IT systems, banking networks (RBI, NPCI), and critical infrastructure (power grid SCADA, telecom signaling). TCS Innovation Mumbai has developed India\u2019s first indigenous PQC library (TCS-QuantumShield) implementing ML-KEM and ML-DSA algorithms optimized for ARM and x86 server platforms with hardware acceleration via AES-NI and AVX-512 instructions, achieving 10,000 key encapsulation operations per second per CPU core. Wipro Quantum Bengaluru is deploying hybrid classical-quantum TLS 1.3 endpoints at ICICI Bank and HDFC Bank data centers for quantum-safe online banking transactions, combining X25519 classical key exchange with ML-KEM-768 encapsulation for dual-layer key agreement. India\u2019s UIDAI (Aadhaar) is evaluating PQC migration for its 1.4 billion enrolled identities, targeting ML-DSA-87 digital signature replacement of existing RSA-2048 based authentication tokens by 2028." }
];

interface QCNRecord { id: string; batchNo: string; operator: string; zone: string; category: string; description: string; linkLengthKm: number; keyRateKbps: number; nodeCount: number; protocolType: string; encryptionLevel: string; origin: string; project: string; state: string; mode: string; prodDate: string; shipDate: string; transitDays: number; contractValue: number; hardwareMake: string; status: string; remarks: string; }

const records: QCNRecord[] = [
  { id: "QCN-0001", batchNo: "ISR/BLR/2025/QKD-0012", operator: "ISRO Quantum Bengaluru", zone: "Delhi Mumbai Quantum Corridor", category: "QKD BB84 200km Fiber", description: "BB84 QKD fiber link Delhi to Mumbai 200km dark fiber via BSNL network with ID Quantique Cerberis trusted nodes 1Mbps secure key rate polarization encoding", linkLengthKm: 200, keyRateKbps: 1500, nodeCount: 4, protocolType: "BB84 Decoy State", encryptionLevel: "AES-256 Quantum", origin: "ID Quantique Geneva CH", project: "NQM Delhi-Mumbai BB84 Phase-I", state: "Delhi", mode: "Fiber Optic Splicing Van", prodDate: "2025-01-10", shipDate: "2025-03-20", transitDays: 4, contractValue: 450000000, hardwareMake: "IDQ Cerberis XG", status: "Operational Key Exchange Active", remarks: "BB84 ISRO Delhi-Mumbai operational" },
  { id: "QCN-0002", batchNo: "DRD/BLR/2025/E91-0018", operator: "DRDO Bengaluru", zone: "Bengaluru Chennai Link", category: "QKD E91 Entanglement 50km", description: "E91 entanglement-based QKD Bengaluru to Chennai 50km fiber with PPLN entangled photon source SPDC 775nm pump Bell state fidelity 99.2% IIT Bombay design", linkLengthKm: 50, keyRateKbps: 800, nodeCount: 2, protocolType: "E91 Entangled", encryptionLevel: "One-Time Pad QKD", origin: "IIT Bombay Lab MH", project: "DRDO E91 Bengaluru-Chennai Demo", state: "Karnataka", mode: "Cryogenic Transport Vehicle", prodDate: "2025-02-15", shipDate: "2025-05-10", transitDays: 3, contractValue: 320000000, hardwareMake: "IITB E91 System IN", status: "Network Certification Testing", remarks: "E91 DRDO Bengaluru-Chennai cert testing" },
  { id: "QCN-0003", batchNo: "CDT/NDL/2025/QRP-0025", operator: "C-DOT Delhi", zone: "Hyderabad Kolkata Path", category: "Quantum Repeater Node 500km", description: "Quantum repeater node for Hyderabad-Kolkata 500km link with solid-state quantum memory NV diamond 10ms coherence time entanglement swapping 2x250km segments", linkLengthKm: 500, keyRateKbps: 100, nodeCount: 3, protocolType: "Repeater BB84", encryptionLevel: "AES-256 Hybrid", origin: "C-DOT Delhi Lab DL", project: "NQM Hyderabad-Kolkata Repeater", state: "Telangana", mode: "Secure Courier Armored", prodDate: "2025-03-01", shipDate: "2025-06-18", transitDays: 5, contractValue: 580000000, hardwareMake: "C-DOT Repeater IN", status: "QKD Key Generation Setup", remarks: "Repeater C-DOT Hyderabad setup active" },
  { id: "QCN-0004", batchNo: "TCS/MUM/2025/QRN-0032", operator: "TCS Innovation Mumbai", zone: "Mumbai Pune Express", category: "QRNG Satellite Link 1000km", description: "QRNG satellite uplink receiver Mumbai to GSAT-3A 1000km slant range 50kbps vacuum fluctuation balanced homodyne detection NIST SP 800-90B certified", linkLengthKm: 1000, keyRateKbps: 50, nodeCount: 1, protocolType: "QRNG Satellite", encryptionLevel: "OTP 256-bit", origin: "TCS Innovation Lab MH", project: "TCS GSAT-3A QRNG Mumbai Ground", state: "Maharashtra", mode: "Satellite Uplink Truck", prodDate: "2025-01-25", shipDate: "2025-04-05", transitDays: 1, contractValue: 280000000, hardwareMake: "TCS QuantumShield IN", status: "Operational Key Exchange Active", remarks: "QRNG TCS Mumbai satellite active" },
  { id: "QCN-0005", batchNo: "WPR/BLR/2025/QMM-0041", operator: "Wipro Quantum Bengaluru", zone: "Delhi Mumbai Quantum Corridor", category: "Quantum Memory Buffer 10ms", description: "Quantum memory node at Jaipur trusted node with NV-center diamond memory 10ms coherence buffer for 200km Delhi-Jaipur QKD link key storage and retrieval", linkLengthKm: 150, keyRateKbps: 1200, nodeCount: 2, protocolType: "BB84 + Memory", encryptionLevel: "AES-256 QKD", origin: "Wipro Quantum Lab KA", project: "NQM Jaipur Quantum Memory Node", state: "Rajasthan", mode: "Cryogenic Transport Vehicle", prodDate: "2025-04-10", shipDate: "2025-07-15", transitDays: 3, contractValue: 420000000, hardwareMake: "Wipro QMem IN", status: "Encryption Module Integration", remarks: "Memory Wipro Jaipur integration phase" },
  { id: "QCN-0006", batchNo: "IIT/MUM/2025/QNH-0048", operator: "IIT Bombay Quantum Lab", zone: "Delhi Kolkata Trunk", category: "QKD Network Hub 8-Channel", description: "8-channel QKD network hub at Delhi for trunk switching between Mumbai Kolkata Bengaluru Chennai links with time-bin encoding 2GHz clock SPD array 8 channels", linkLengthKm: 0, keyRateKbps: 8000, nodeCount: 8, protocolType: "Multi-Ch BB84", encryptionLevel: "AES-256 Network", origin: "IIT Bombay Lab MH", project: "NQM Delhi 8-Port QKD Hub", state: "Delhi", mode: "Air Freight Specialized", prodDate: "2025-02-20", shipDate: "2025-05-22", transitDays: 2, contractValue: 650000000, hardwareMake: "IITB Multi-Ch IN", status: "Network Certification Testing", remarks: "Hub IITB Delhi cert testing" },
  { id: "QCN-0007", batchNo: "QCD/KOL/2025/PQC-0055", operator: "QC Design Kolkata", zone: "Chennai Thiruvananthapuram", category: "Post-Quantum Crypto KEM", description: "PQC ML-KEM-768 key encapsulation module for Chennai-Trivandrum banking network RBI compliant hybrid classical-quantum TLS 1.3 endpoint deployment", linkLengthKm: 700, keyRateKbps: 10000, nodeCount: 6, protocolType: "PQC Hybrid TLS", encryptionLevel: "ML-KEM-768+X25519", origin: "QC Design Kolkata WB", project: "PQC Chennai-Trivandrum Banking", state: "Tamil Nadu", mode: "Secure Courier Armored", prodDate: "2025-03-15", shipDate: "2025-06-28", transitDays: 4, contractValue: 350000000, hardwareMake: "QC Design PQC IN", status: "Fiber Splicing Alignment", remarks: "PQC QC Design Chennai fiber alignment" },
  { id: "QCN-0008", batchNo: "TAT/MUM/2025/QTN-0062", operator: "Tata Institute Mumbai", zone: "Mumbai Pune Express", category: "Quantum Trusted Node 100km", description: "Trusted node QKD system Mumbai-Pune 100km fiber with measurement-device-independent QKD MDI protocol removing all detector side-channels", linkLengthKm: 100, keyRateKbps: 2000, nodeCount: 2, protocolType: "MDI-QKD", encryptionLevel: "Detector-Independent", origin: "TIFR Mumbai MH", project: "TIFR MDI-QKD Mumbai-Pune", state: "Maharashtra", mode: "Fiber Optic Splicing Van", prodDate: "2025-05-01", shipDate: "2025-07-20", transitDays: 1, contractValue: 280000000, hardwareMake: "TIFR MDI System IN", status: "Satellite Ground Station Sync", remarks: "MDI-QKD TIFR Mumbai ground sync" },
  { id: "QCN-0009", batchNo: "ISR/BLR/2025/QKD-0075", operator: "ISRO Quantum Bengaluru", zone: "Bengaluru Chennai Link", category: "QKD BB84 200km Fiber", description: "BB84 QKD extension Bengaluru to Chennai Phase-II 200km additional dark fiber with decoy-state protocol 1.5Mbps secure key rate for ISRO secure telemetry", linkLengthKm: 200, keyRateKbps: 1500, nodeCount: 3, protocolType: "BB84 Decoy State", encryptionLevel: "AES-256 ISRO", origin: "ID Quantique Geneva CH", project: "NQM Bengaluru-Chennai BB84 Phase-II", state: "Tamil Nadu", mode: "Multi-Mode Fiber Reel Trailer", prodDate: "2025-02-10", shipDate: "2025-05-15", transitDays: 3, contractValue: 380000000, hardwareMake: "IDQ Cerberis XG", status: "Fiber Splicing Alignment", remarks: "BB84 ISRO Bengaluru-Chennai splicing" },
  { id: "QCN-0010", batchNo: "DRD/BLR/2025/E91-0083", operator: "DRDO Bengaluru", zone: "Delhi Mumbai Quantum Corridor", category: "QKD E91 Entanglement 50km", description: "E91 QKD for Indian Navy Western Command Mumbai with entangled photon Bell state verification tamper detection and DRDO secure submarine communication key distribution", linkLengthKm: 50, keyRateKbps: 800, nodeCount: 2, protocolType: "E91 Military", encryptionLevel: "OTP Naval", origin: "DRDL Hyderabad TS", project: "DRDO Navy Mumbai E91 Secure", state: "Maharashtra", mode: "Secure Courier Armored", prodDate: "2025-03-25", shipDate: "2025-06-18", transitDays: 2, contractValue: 520000000, hardwareMake: "DRDO E91 Mil IN", status: "Operational Key Exchange Active", remarks: "E91 DRDO Navy Mumbai operational" },
  { id: "QCN-0011", batchNo: "CDT/NDL/2025/QRP-0091", operator: "C-DOT Delhi", zone: "Ahmedabad Jaipur Route", category: "Quantum Repeater Node 500km", description: "Quantum repeater for Ahmedabad-Jaipur 500km trunk with teleportation-based entanglement swapping and quantum error correction surface code distance-5", linkLengthKm: 500, keyRateKbps: 80, nodeCount: 3, protocolType: "Teleport Repeat", encryptionLevel: "AES-256 ECC", origin: "C-DOT Delhi Lab DL", project: "NQM Ahmedabad-Jaipur Repeater", state: "Gujarat", mode: "Air Freight Specialized", prodDate: "2025-04-15", shipDate: "2025-07-25", transitDays: 2, contractValue: 480000000, hardwareMake: "C-DOT Repeater IN", status: "QKD Key Generation Setup", remarks: "Repeater C-DOT Ahmedabad setup" },
  { id: "QCN-0012", batchNo: "TCS/MUM/2025/QRN-0098", operator: "TCS Innovation Mumbai", zone: "Guwahati Shillong NE", category: "QRNG Satellite Link 1000km", description: "QRNG ground station Guwahati for NE India quantum-secure network with GSAT-3A satellite link and NIST-certified random number generation for border security", linkLengthKm: 1000, keyRateKbps: 30, nodeCount: 1, protocolType: "QRNG Satellite", encryptionLevel: "OTP 256-bit NE", origin: "TCS Innovation Lab MH", project: "TCS QRNG Guwahati NE Border", state: "Assam", mode: "Satellite Uplink Truck", prodDate: "2025-05-10", shipDate: "2025-08-08", transitDays: 6, contractValue: 220000000, hardwareMake: "TCS QuantumShield IN", status: "Satellite Ground Station Sync", remarks: "QRNG TCS Guwahati ground sync" },
  { id: "QCN-0013", batchNo: "WPR/BLR/2025/QMM-0105", operator: "Wipro Quantum Bengaluru", zone: "Hyderabad Kolkata Path", category: "Quantum Memory Buffer 10ms", description: "Quantum memory trusted node Hyderabad with rare-earth doped crystal memory 10ms coherence buffer for Kolkata trunk link entanglement storage and on-demand retrieval", linkLengthKm: 600, keyRateKbps: 150, nodeCount: 2, protocolType: "Memory E91", encryptionLevel: "AES-256 Hybrid", origin: "Wipro Quantum Lab KA", project: "Wipro Hyderabad Memory Node", state: "Telangana", mode: "Cryogenic Transport Vehicle", prodDate: "2025-01-30", shipDate: "2025-04-18", transitDays: 2, contractValue: 380000000, hardwareMake: "Wipro QMem IN", status: "Operational Key Exchange Active", remarks: "Memory Wipro Hyderabad operational" },
  { id: "QCN-0014", batchNo: "QCD/KOL/2025/PQC-0118", operator: "QC Design Kolkata", zone: "Delhi Kolkata Trunk", category: "Post-Quantum Crypto KEM", description: "PQC ML-DSA-87 digital signature module for Delhi-Kolkata government network NIC compliant Aadhaar quantum-safe authentication token deployment", linkLengthKm: 1500, keyRateKbps: 12000, nodeCount: 10, protocolType: "PQC ML-DSA", encryptionLevel: "ML-DSA-87 NIC", origin: "QC Design Kolkata WB", project: "PQC Delhi-Kolkata NIC Aadhaar", state: "West Bengal", mode: "Secure Courier Armored", prodDate: "2025-03-20", shipDate: "2025-06-25", transitDays: 4, contractValue: 420000000, hardwareMake: "QC Design PQC IN", status: "Encryption Module Integration", remarks: "PQC QC Design Delhi integration" }
];

export default function QuantumCommunicationNetworkLogisticsView() {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  const totalKm = records.reduce((s, r) => s + r.linkLengthKm, 0);
  const totalContract = records.reduce((s, r) => s + r.contractValue, 0);
  const activeNodes = records.filter(r => r.status !== "Operational Key Exchange Active").length;
  const operational = records.filter(r => r.status === "Operational Key Exchange Active").length;

  const kpis = [
    { l: "Total Link (km)", v: totalKm.toLocaleString("en-IN"), s: "Across " + records.length + " QKD records" },
    { l: "In Preparation", v: activeNodes, s: "Setup to certification" },
    { l: "Operational", v: operational, s: "Key exchange active" },
    { l: "Total Contract", v: formatINR(totalContract), s: "Aggregate contract value" }
  ];

  const filterGroups = [
    { key: "operator", label: "Operator", options: OPERATORS.map(d => ({ value: d, count: records.filter(r => r.operator === d).length })) },
    { key: "category", label: "Category", options: CATEGORIES.map(c => ({ value: c, count: records.filter(r => r.category === c).length })) },
    { key: "status", label: "Status", options: SHIPMENT_STATUSES.map(s => ({ value: s, count: records.filter(r => r.status === s).length })) },
    { key: "zone", label: "Zone", options: ZONES.map(z => ({ value: z, count: records.filter(r => r.zone === z).length })) },
    { key: "hardwareMake", label: "Hardware", options: ["IDQ Cerberis XG", "IITB E91 System IN", "C-DOT Repeater IN", "TCS QuantumShield IN", "Wipro QMem IN", "IITB Multi-Ch IN", "QC Design PQC IN", "TIFR MDI System IN", "DRDO E91 Mil IN"].map(h => ({ value: h, count: records.filter(r => r.hardwareMake === h).length })) }
  ];

  const toggleFilter = (k: string, v: string) => setActiveFilters(p => (function(){ const n={...p}; n[k]=(p[k]||[]).filter(x=>x!==v); if(n[k].length===0) delete n[k]; return n })());

  const filtered = records.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.id.toLowerCase().includes(q) && !r.batchNo.toLowerCase().includes(q) && !r.operator.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q) && !r.category.toLowerCase().includes(q) && !r.project.toLowerCase().includes(q) && !r.protocolType.toLowerCase().includes(q)) return false;
    }
    return Object.entries(activeFilters).every(([k, vs]) => vs.includes(r[k as keyof QCNRecord] as string));
  });

  const COLS = ["ID", "Batch No", "Operator", "Zone", "Category", "Description", "Link (km)", "Key Rate (kbps)", "Nodes", "Protocol", "Encryption", "Origin", "Project", "State", "Mode", "Prod Date", "Ship Date", "Transit (d)", "Contract (\u20b9)", "Hardware", "Status", "Remarks"];

  const renderCharts = () => (
    <>
      <div className="grid grid-cols-2 gap-6">
        <div className="qcn-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Monthly Quantum Keys Generated (thousands)</h3><BarChart data={monthlyKeys} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Bar dataKey="bb84" fill="#1e1b4b" radius={[4,4,0,0]} name="BB84" /><Bar dataKey="e91" fill="#312e81" radius={[4,4,0,0]} name="E91" /><Bar dataKey="qrng" fill="#4338ca" radius={[4,4,0,0]} name="QRNG" /><Bar dataKey="repeater" fill="#6366f1" radius={[4,4,0,0]} name="Repeater" /></BarChart></div>
        <div className="qcn-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">QKD Technology Distribution (%)</h3><PieChart width={400} height={220}><Pie data={techDist} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label>{techDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="qcn-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Secure Key Rate by Medium (Mbps)</h3><LineChart data={keyRateTrend} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="m" /><YAxis /><Tooltip /><Legend /><Line type="monotone" dataKey="fiber" stroke="#1e1b4b" strokeWidth={2} name="Fiber" /><Line type="monotone" dataKey="satellite" stroke="#4338ca" strokeWidth={2} strokeDasharray="5 5" name="Satellite" /><Line type="monotone" dataKey="freeSpace" stroke="#818cf8" strokeWidth={2} strokeDasharray="2 2" name="Free-Space" /></LineChart></div>
        <div className="qcn-chart bg-white rounded-lg border p-4"><h3 className="text-sm font-semibold mb-3">Quantum Nodes by Corridor</h3><BarChart data={zoneNodes} height={220}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="zone" /><YAxis /><Tooltip /><Legend /><Bar dataKey="nodes" fill="#312e81" radius={[4,4,0,0]} name="Active Nodes" /></BarChart></div>
      </div>
    </>
  );

  return (
    <div className="qcn-root p-6 space-y-6">
      <PageHeader title="Quantum Communication Network Logistics" description="Indian quantum communication network logistics covering QKD BB84 200km fiber E91 entanglement 50km quantum repeater 500km QRNG satellite 1000km quantum memory buffer 10ms QKD hub 8-channel post-quantum ML-KEM-768 ML-DSA-87 trusted node 100km MDI-QKD ISRO DRDO C-DOT TCS Wipro IIT Bombay TIFR NQM 6000Cr National Quantum Mission Delhi Mumbai Bengaluru Chennai Kolkata Hyderabad GSAT-3A" />
      <div className="qcn-tabs flex gap-1 border-b border-gray-200">
        {TABS.map((t, i) => (<button key={t} onClick={() => setTab(i)} className={`qcn-tab px-4 py-2 text-sm font-medium rounded-t ${tab === i ? "bg-[#1e1b4b] text-white" : "text-gray-600 hover:bg-indigo-50"}`}>{t}</button>))}
      </div>
      <ModuleBreadcrumb items={[{ label: "Logistics", href: "#" }, { label: "Quantum Communication" }]} />
      {tab === 0 && (
        <div className="qcn-dash space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {kpis.map((k, i) => <div key={i} className="bg-white rounded-lg border p-4"><p className="text-xs text-gray-500">{k.l}</p><p className="text-2xl font-bold text-[#1e1b4b]">{k.v}</p><p className="text-xs text-gray-400">{k.s}</p></div>)}
          </div>
          {renderCharts()}
          <div className="grid grid-cols-2 gap-6">
            {INSIGHTS.map((ins, i) => <div key={i} className="bg-white rounded-lg border p-4"><h4 className="text-sm font-semibold mb-2 text-[#1e1b4b]">{ins.t}</h4><p className="text-xs text-gray-600 leading-relaxed">{ins.c}</p></div>)}
          </div>
        </div>
      )}
      {tab === 1 && (
        <div className="qcn-reg space-y-4">
          <SearchFilterToolbar searchQuery={search} onSearchChange={setSearch} onClearSearch={() => setSearch("")} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
          <div className="qcn-table-wrap overflow-auto rounded-lg border bg-white"><table className="w-full text-xs"><thead><tr className="bg-gray-50 border-b">{COLS.map((c) => <th key={c} className="px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap">{c}</th>)}</tr></thead><tbody>{filtered.map((r) => { const sc = statusColor[r.status]; return <tr key={r.id} className={`border-b ${sc === "green" ? "bg-green-50 border-l-4 border-l-green-500" : sc === "orange" ? "bg-orange-50 border-l-4 border-l-orange-400" : sc === "blue" ? "bg-blue-50 border-l-4 border-l-blue-400" : ""}`}><td className="px-3 py-2 font-mono">{r.id}</td><td className="px-3 py-2">{r.batchNo}</td><td className="px-3 py-2">{r.operator}</td><td className="px-3 py-2">{r.zone}</td><td className="px-3 py-2">{r.category}</td><td className="px-3 py-2 max-w-[200px] truncate">{r.description}</td><td className="px-3 py-2 text-right">{r.linkLengthKm}</td><td className="px-3 py-2 text-right">{r.keyRateKbps.toLocaleString("en-IN")}</td><td className="px-3 py-2 text-right">{r.nodeCount}</td><td className="px-3 py-2">{r.protocolType}</td><td className="px-3 py-2">{r.encryptionLevel}</td><td className="px-3 py-2">{r.origin}</td><td className="px-3 py-2">{r.project}</td><td className="px-3 py-2">{r.state}</td><td className="px-3 py-2">{r.mode}</td><td className="px-3 py-2">{r.prodDate}</td><td className="px-3 py-2">{r.shipDate}</td><td className="px-3 py-2 text-right">{r.transitDays}</td><td className="px-3 py-2 text-right">{formatINR(r.contractValue)}</td><td className="px-3 py-2">{r.hardwareMake}</td><td className="px-3 py-2"><span className={`px-2 py-0.5 rounded-full text-xs ${sc === "green" ? "bg-green-100 text-green-700" : sc === "orange" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"}`}>{r.status}</span></td><td className="px-3 py-2 max-w-[150px] truncate">{r.remarks}</td></tr>; })}</tbody></table></div>
        </div>
      )}
      {tab === 2 && (
        <div className="qcn-analytics space-y-6">{renderCharts()}</div>
      )}
      {tab === 3 && (
        <div className="qcn-insights space-y-4">
          {INSIGHTS.map((ins, i) => <div key={i} className="bg-white rounded-lg border p-5"><h4 className="text-sm font-semibold mb-2 text-[#1e1b4b]">{ins.t}</h4><p className="text-xs text-gray-600 leading-relaxed">{ins.c}</p></div>)}
        </div>
      )}
    </div>
  );
}
