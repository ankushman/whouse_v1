#!/usr/bin/env python3
"""R483 Generator: Tantalum Carbide Logistics + Niobium Carbide Logistics"""
import re

TEMPLATE_PATH = 'src/components/modules/zinc-oxide-logistics-view.tsx'

# --- Tantalum Carbide: TaC ---
# Prefix: tac, Icon: Apple, Color: #be185d (pink-dark), MP 3985 degC, density 14.49 g/cm3
# TaC: refractory cermet coating, cutting tool grain refiner, diffusion barrier,
# cemented carbide binder-free tool, CVD wear-resistant film, nuclear reactor cladding,
# HfC-TaC UHTC composite for hypersonic TPS, superconductor Nb-TaC
tac_records = [
    ['TAC-A2401', 'B24-TAC-001', 'Mumbai', 'MIDHANI', 'TaC 99.99% HfC-TaC UHTC Composite Leading Edge', 'Mach 10+ TPS Tile', '99.99%', '3985 degC', '&#8377;1600 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'DRDO HSTDV TaC UHTC'],
    ['TAC-A2402', 'B24-TAC-002', 'Bengaluru', 'DRDO DMRL', 'TaC 99.9% Cutting Tool Grain Refiner Cermet', 'WC-Co-TaC Grade C10', '99.9%', '3985 degC', '&#8377;1120 Cr', 'delivered', 'critical', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'Sandvik TaC refiner'],
    ['TAC-A2403', 'B24-TAC-003', 'Hyderabad', 'Tata Chemicals', 'TaC 99.7% CVD Wear-Resistant Coating Target', 'TiCN-TaC PVD Multilayer', '99.7%', '3985 degC', '&#8377;1040 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'Balzers TaC CVD coat'],
    ['TAC-A2404', 'B24-TAC-004', 'Chennai', 'Bharat Forge', 'TaC 99.5% Nuclear Reactor Cladding Diffusion Barrier', 'SiC-TaC TRISO', '99.5%', '3985 degC', '&#8377;1200 Cr', 'delivered', 'critical', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'BARC TaC TRISO cladding'],
    ['TAC-A2405', 'B24-TAC-005', 'Kolkata', 'Shyam Chemicals', 'TaC 99.8% Binderless Cemented Carbide Tool', 'Pure TaC Insert', '99.8%', '3985 degC', '&#8377;1080 Cr', 'in-transit', 'high', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'Kennametal TaC tool'],
    ['TAC-A2406', 'B24-TAC-006', 'Noida', 'BHEL R&amp;D', 'TaC 99.6% Semiconductor Diffusion Barrier Layer', 'Cu-TaC Interconnect', '99.6%', '3985 degC', '&#8377;1000 Cr', 'delivered', 'high', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'IIT-D TaC barrier'],
    ['TAC-A2407', 'B24-TAC-007', 'Pune', 'Godrej Chemicals', 'TaC 99.4% Rocket Motor Throat Insert Backup', 'HfC-TaC Nozzle', '99.4%', '3985 degC', '&#8377;1200 Cr', 'in-transit', 'critical', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'ISRO TaC nozzle'],
    ['TAC-A2408', 'B24-TAC-008', 'Jaipur', 'Rajasthan Chemicals', 'TaC 99.3% Steelmaking Deoxidizer Additive', 'LD Converter Ta-Al', '99.3%', '3985 degC', '&#8377;840 Cr', 'delivered', 'medium', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'SAIL TaC deox'],
    ['TAC-A2409', 'B24-TAC-009', 'Guwahati', 'Assam Chemicals', 'TaC 99.99% Hypersonic Wind Tunnel Heat Flux Sensor', 'Mach 12 Calorimeter', '99.99%', '3985 degC', '&#8377;1360 Cr', 'in-transit', 'critical', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'DRDO TaC sensor'],
    ['TAC-A2410', 'B24-TAC-010', 'Ahmedabad', 'Gujarat Chemicals', 'TaC 99.5% Chemical Vapor Infiltration Preform', 'C-SiC-TaC Ceramic', '99.5%', '3985 degC', '&#8377;1120 Cr', 'pending', 'high', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'IISc TaC CVI'],
    ['TAC-A2411', 'B24-TAC-011', 'Lucknow', 'UP Chemicals', 'TaC 99.2% Electric Contact Arc-Resistant Tip', 'Cu-TaC Composite', '99.2%', '3985 degC', '&#8377;880 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'ABB TaC contact'],
    ['TAC-A2412', 'B24-TAC-012', 'Visakhapatnam', 'Vizag Chemicals', 'TaC 99.92% Submarine Reactor Core Reflector', 'SSBN TaC Reflector', '99.92%', '3985 degC', '&#8377;1400 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSBN reflector'],
    ['TAC-A2413', 'B24-TAC-013', 'Balasore', 'DRDO TBRL', 'TaC 99.99% Hypersonic Reentry Vehicle Heat Shield', 'Mach 15+ Ablative', '99.99%', '3985 degC', '&#8377;1600 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO RV TaC shield'],
    ['TAC-A2414', 'B24-TAC-014', 'Bhilai', 'SAIL Chemicals', 'TaC 99.0% General Refractory Grade', 'Process Chemical', '99.0%', '3985 degC', '&#8377;700 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL TaC refractory'],
]

# --- Niobium Carbide: NbC ---
# Prefix: nbc, Icon: ArrowRight, Color: #854d0e (amber-dark), MP 3610 degC, density 7.82 g/cm3
# NbC: cemented carbide grain growth inhibitor, cutting tool cermet,
# superconducting Nb-NbC thin film, nuclear reactor structural alloy,
# steel strengthening precipitate, thermoelectric generator, wear-resistant coating
nbc_records = [
    ['NBC-A2401', 'B24-NBC-001', 'Mumbai', 'MIDHANI', 'NbC 99.9% WC-Co Cemented Carbide Grain Inhibitor', 'Sub-Micron WC Grain', '99.9%', '3610 degC', '&#8377;900 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'Sandvik NbC grain inh'],
    ['NBC-A2402', 'B24-NBC-002', 'Bengaluru', 'DRDO DMRL', 'NbC 99.99% Superconducting RF Cavity Thin Film', 'TESLA-Type Nb-NbC', '99.99%', '3610 degC', '&#8377;1200 Cr', 'delivered', 'critical', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'CERN NbC SCRF'],
    ['NBC-A2403', 'B24-NBC-003', 'Hyderabad', 'Tata Chemicals', 'NbC 99.7% Steel Strengthening MC Precipitate', 'HSLA Steel Micro', '99.7%', '3610 degC', '&#8377;860 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'Tata Steel NbC precip'],
    ['NBC-A2404', 'B24-NBC-004', 'Chennai', 'Bharat Forge', 'NbC 99.5% Nuclear Reactor Structural Alloy Additive', 'Nb-1Zr-NbC Clad', '99.5%', '3610 degC', '&#8377;1000 Cr', 'delivered', 'critical', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'BARC NbC alloy'],
    ['NBC-A2405', 'B24-NBC-005', 'Kolkata', 'Shyam Chemicals', 'NbC 99.8% Thermoelectric Generator SEG Leg', 'NbC-TiC SEG Hot', '99.8%', '3610 degC', '&#8377;940 Cr', 'in-transit', 'high', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'DRDO NbC TEG leg'],
    ['NBC-A2406', 'B24-NBC-006', 'Noida', 'BHEL R&amp;D', 'NbC 99.6% Cutting Tool Cermet Tip Insert', 'NbC-TaC-Ni Cermet', '99.6%', '3610 degC', '&#8377;920 Cr', 'delivered', 'high', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'Kennametal NbC cermet'],
    ['NBC-A2407', 'B24-NBC-007', 'Pune', 'Godrej Chemicals', 'NbC 99.4% Wear-Resistant PVD Coating Target', 'NbC-NbN Multilayer', '99.4%', '3610 degC', '&#8377;880 Cr', 'in-transit', 'medium', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'IIT-B NbC PVD coat'],
    ['NBC-A2408', 'B24-NBC-008', 'Jaipur', 'Rajasthan Chemicals', 'NbC 99.3% Molten Metal Crucible Liner', 'Induction Furnace', '99.3%', '3610 degC', '&#8377;840 Cr', 'delivered', 'high', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'Electrotherm NbC cruc'],
    ['NBC-A2409', 'B24-NBC-009', 'Guwahati', 'Assam Chemicals', 'NbC 99.9% Plasma Focus Electrode Erosion Plate', 'Dense Plasma Focus', '99.9%', '3610 degC', '&#8377;960 Cr', 'in-transit', 'critical', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'IIT-G NbC plasma'],
    ['NBC-A2410', 'B24-NBC-010', 'Ahmedabad', 'Gujarat Chemicals', 'NbC 99.5% Diamond-Coated Wire Drawing Die', 'NbC-Diamond Compos', '99.5%', '3610 degC', '&#8377;900 Cr', 'pending', 'high', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'Sterlite NbC die'],
    ['NBC-A2411', 'B24-NBC-011', 'Lucknow', 'UP Chemicals', 'NbC 99.2% Hardfacing Weld Overlay Electrode', 'PTA TaC-NbC Wire', '99.2%', '3610 degC', '&#8377;820 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'BHEL NbC hardface'],
    ['NBC-A2412', 'B24-NBC-012', 'Visakhapatnam', 'Vizag Chemicals', 'NbC 99.92% Submarine Propeller Shaft Bearing Sleeve', 'SSK Water-Lubricated', '99.92%', '3610 degC', '&#8377;960 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK bearing'],
    ['NBC-A2413', 'B24-NBC-013', 'Balasore', 'DRDO TBRL', 'NbC 99.99% Hypersonic Vehicle Thermal Barrier Panel', 'Mach 8+ TPS Panel', '99.99%', '3610 degC', '&#8377;1200 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO HSTDV NbC TPS'],
    ['NBC-A2414', 'B24-NBC-014', 'Bhilai', 'SAIL Chemicals', 'NbC 99.0% General Metallurgical Grade', 'Process Chemical', '99.0%', '3610 degC', '&#8377;560 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL NbC metallurgical'],
]


def fmt_record(r):
    parts = [f"'{r[i]}'" for i in range(len(r))]
    return '  [' + ', '.join(parts) + ']'


def gen_module(records, config):
    with open(TEMPLATE_PATH, 'r') as f:
        template = f.read()
    prefix = config['prefix']
    icon = config['icon']
    color = config['color']
    title = config['title']
    subtitle = config['subtitle']
    fn_name = config['fn_name']
    rec_strs = [fmt_record(r) for r in records]
    rec_block = f"const {prefix}_RECORDS = [\n" + ',\n'.join(rec_strs) + "\n];"
    template = re.sub(r"const [\w]+_RECORDS = \[.*?\];", rec_block, template, flags=re.DOTALL)
    template = re.sub(r"import \{ \w+ \} from 'lucide-react';", f"import {{ {icon} }} from 'lucide-react';", template)
    template = re.sub(r"export default function \w+LogisticsView\(\)", f"export default function {fn_name}()", template)
    template = re.sub(r"zinc_oxide_RECORDS", f"{prefix}_RECORDS", template)
    template = template.replace('Zinc Oxide Logistics', title)
    template = template.replace('ZnO varistor &#8226; UV blocker &#8226; Rubber vulcanization &#8226; TCO electrode supply chain', subtitle)
    template = re.sub(r'<ShieldCheck className="w-5 h-5"', f'<{icon} className="w-5 h-5"', template)
    template = re.sub(r"'16a34a'", f"'{color}'", template)
    template = re.sub(r"backgroundColor: '#6366f122'", f"backgroundColor: '{color}22'", template)
    return template


tac_config = {
    'prefix': 'tac', 'icon': 'Apple', 'color': '#be185d',
    'title': 'Tantalum Carbide Logistics',
    'subtitle': 'TaC UHTC composite &#8226; Cutting tool cermet &#8226; Diffusion barrier &#8226; Nuclear cladding supply chain',
    'fn_name': 'TantalumCarbideLogisticsView',
}
with open('src/components/modules/tantalum-carbide-logistics-view.tsx', 'w') as f:
    f.write(gen_module(tac_records, tac_config))
print("Generated: tantalum-carbide-logistics-view.tsx")

nbc_config = {
    'prefix': 'nbc', 'icon': 'ArrowRight', 'color': '#854d0e',
    'title': 'Niobium Carbide Logistics',
    'subtitle': 'NbC carbide grain inhibitor &#8226; Superconducting RF &#8226; Steel precipitate &#8226; Thermoelectric supply chain',
    'fn_name': 'NiobiumCarbideLogisticsView',
}
with open('src/components/modules/niobium-carbide-logistics-view.tsx', 'w') as f:
    f.write(gen_module(nbc_records, nbc_config))
print("Generated: niobium-carbide-logistics-view.tsx")

for fname in ['src/components/modules/tantalum-carbide-logistics-view.tsx', 'src/components/modules/niobium-carbide-logistics-view.tsx']:
    with open(fname, 'r') as f:
        c = f.read()
    rs = c[c.find('RECORDS = ['):c.find('];')]
    bad = re.findall(r"'[^']*'\s*:\s*'", rs)
    print(f"  {'WARNING: '+str(len(bad))+' typos' if bad else 'OK'}: {fname.split('/')[-1]}, Lines: {c.count(chr(10))+1}")
