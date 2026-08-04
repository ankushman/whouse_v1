#!/usr/bin/env python3
"""R478 Generator: Potassium Fluoride Logistics + Lead Fluoride Logistics"""
import re

TEMPLATE_PATH = 'src/components/modules/zinc-oxide-logistics-view.tsx'

# --- Potassium Fluoride: KF ---
# Prefix: kfl, Icon: Percent, Color: #15803d (green), MP 858 degC, density 1.98 g/cm3
# KF: agrochemical synthesis intermediate, aluminum smelting flux, glass etching,
# nuclear reprocessing flux, pesticide precursor, optical coating
kfl_records = [
    ['KFL-A2401', 'B24-KFL-001', 'Mumbai', 'MIDHANI', 'KF 99.99% Agrochemical Fluorination Agent', 'Organofluorine Pesticide', '99.99%', '858 degC', '&#8377;860 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'Rallis KF pesticide'],
    ['KFL-A2402', 'B24-KFL-002', 'Bengaluru', 'DRDO DMRL', 'KF 99.999% Nuclear Fuel Reprocessing Flux', 'Plutonium Purification', '99.999%', '858 degC', '&#8377;960 Cr', 'delivered', 'critical', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'BARC KF reprocess'],
    ['KFL-A2403', 'B24-KFL-003', 'Hyderabad', 'Tata Chemicals', 'KF 99.95% Aluminum Electrolysis Bath Flux', 'Cryolite-KF Melt', '99.95%', '858 degC', '&#8377;880 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'Hindalco KF Al flux'],
    ['KFL-A2404', 'B24-KFL-004', 'Chennai', 'Bharat Forge', 'KF 99.9% Decorative Glass Etching Compound', 'Acid-Etch Frost', '99.9%', '858 degC', '&#8377;820 Cr', 'delivered', 'high', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'Asahi KF glass etch'],
    ['KFL-A2405', 'B24-KFL-005', 'Kolkata', 'Shyam Chemicals', 'KF 99.7% Soldering Flux Cleaning Agent', 'Residue Remover', '99.7%', '858 degC', '&#8377;760 Cr', 'in-transit', 'medium', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'BEL KF solder clean'],
    ['KFL-A2406', 'B24-KFL-006', 'Noida', 'BHEL R&amp;D', 'KF 99.98% Missile Propellant Oxidizer Bond', 'Composite Solid Fuel', '99.98%', '858 degC', '&#8377;920 Cr', 'delivered', 'critical', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'DRDO KF propellant'],
    ['KFL-A2407', 'B24-KFL-007', 'Pune', 'Godrej Chemicals', 'KF 99.5% Dye Intermediate Fluorinating Agent', 'Textile DyeStuff', '99.5%', '858 degC', '&#8377;720 Cr', 'in-transit', 'medium', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'Atul KF dye fluoro'],
    ['KFL-A2408', 'B24-KFL-008', 'Jaipur', 'Rajasthan Chemicals', 'KF 99.8% Silver Brazing Flux Paste', 'High-Temp Join', '99.8%', '858 degC', '&#8377;840 Cr', 'delivered', 'high', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'BHEL KF braze flux'],
    ['KFL-A2409', 'B24-KFL-009', 'Guwahati', 'Assam Chemicals', 'KF 99.99% Photovoltaic Panel Edge Sealant', 'Solar Module Encap', '99.99%', '858 degC', '&#8377;860 Cr', 'in-transit', 'critical', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'Tata Power KF seal'],
    ['KFL-A2410', 'B24-KFL-010', 'Ahmedabad', 'Gujarat Chemicals', 'KF 99.6% Pharmaceutical Fluorine Source', 'Fluoroquinolone API', '99.6%', '858 degC', '&#8377;880 Cr', 'pending', 'high', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'Zydus KF pharma API'],
    ['KFL-A2411', 'B24-KFL-011', 'Lucknow', 'UP Chemicals', 'KF 99.4% Dry Cell Battery Electrolyte', 'Zn-Carbon Leclanche', '99.4%', '858 degC', '&#8377;700 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'Panasonic KF battery'],
    ['KFL-A2412', 'B24-KFL-012', 'Visakhapatnam', 'Vizag Chemicals', 'KF 99.92% Submarine Diesel Engine Coolant Additive', 'Corrosion Inhibitor', '99.92%', '858 degC', '&#8377;880 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK coolant'],
    ['KFL-A2413', 'B24-KFL-013', 'Balasore', 'DRDO TBRL', 'KF 99.99% Hypersonic Wind Tunnel Model Coating', 'Mach 7+ Test Model', '99.99%', '858 degC', '&#8377;920 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO HSTDV KF coat'],
    ['KFL-A2414', 'B24-KFL-014', 'Bhilai', 'SAIL Chemicals', 'KF 99.0% General Industrial Grade', 'Process Chemical', '99.0%', '858 degC', '&#8377;480 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL KF industrial'],
]

# --- Lead Fluoride: PbF2 ---
# Prefix: pbf, Icon: Bluetooth, Color: #64748b (slate), MP 824 degC, density 8.45 g/cm3
# PbF2: scintillation crystal (Cherenkov), UV laser host, crystal growth flux,
# radiation shielding glass, optical fiber low-index cladding, dental X-ray
pbf_records = [
    ['PBF-A2401', 'B24-PBF-001', 'Mumbai', 'MIDHANI', 'PbF2 99.99% Cherenkov Radiation Scintillator', 'Fast Timing Crystal', '99.99%', '824 degC', '&#8377;920 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'BARC PbF2 Cherenkov'],
    ['PBF-A2402', 'B24-PBF-002', 'Bengaluru', 'DRDO DMRL', 'PbF2 99.999% Deep-UV Solid-State Laser Host', 'Ce:PbF2 280 nm', '99.999%', '824 degC', '&#8377;960 Cr', 'delivered', 'critical', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'IISc PbF2 UV laser'],
    ['PBF-A2403', 'B24-PBF-003', 'Hyderabad', 'Tata Chemicals', 'PbF2 99.95% High-Density Radiation Shield Glass', 'PbO-PbF2 X-Ray', '99.95%', '824 degC', '&#8377;900 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'BEL PbF2 rad shield'],
    ['PBF-A2404', 'B24-PBF-004', 'Chennai', 'Bharat Forge', 'PbF2 99.9% Crystal Growth Flux Compound', 'Perovskite Flux', '99.9%', '824 degC', '&#8377;840 Cr', 'delivered', 'high', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'IIT-M PbF2 crystal flux'],
    ['PBF-A2405', 'B24-PBF-005', 'Kolkata', 'Shyam Chemicals', 'PbF2 99.7% Optical Fiber Low-Index Cladding', 'Fluoride Glass Fiber', '99.7%', '824 degC', '&#8377;820 Cr', 'in-transit', 'medium', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'Sterlite PbF2 clad'],
    ['PBF-A2406', 'B24-PBF-006', 'Noida', 'BHEL R&amp;D', 'PbF2 99.98% Infrared Transmissive Window', '2-12 um IR Optic', '99.98%', '824 degC', '&#8377;940 Cr', 'delivered', 'critical', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'DRDO PbF2 IR window'],
    ['PBF-A2407', 'B24-PBF-007', 'Pune', 'Godrej Chemicals', 'PbF2 99.5% Dental X-Ray Protective Apron Filler', 'Lead-Fluoro Glass', '99.5%', '824 degC', '&#8377;760 Cr', 'in-transit', 'medium', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', '3M PbF2 dental apron'],
    ['PBF-A2408', 'B24-PBF-008', 'Jaipur', 'Rajasthan Chemicals', 'PbF2 99.8% Pyroelectric IR Detector Substrate', 'TGS Alternative', '99.8%', '824 degC', '&#8377;860 Cr', 'delivered', 'high', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'BEL PbF2 pyro det'],
    ['PBF-A2409', 'B24-PBF-009', 'Guwahati', 'Assam Chemicals', 'PbF2 99.99% Gamma-Ray Spectroscopy Detector', 'Sodium Iodide Alt', '99.99%', '824 degC', '&#8377;920 Cr', 'in-transit', 'critical', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'IIT-G PbF2 gamma det'],
    ['PBF-A2410', 'B24-PBF-010', 'Ahmedabad', 'Gujarat Chemicals', 'PbF2 99.6% Molten Salt Nuclear Reactor Coolant', 'FLiNaK-PbF2 Mix', '99.6%', '824 degC', '&#8377;880 Cr', 'pending', 'high', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'BARC PbF2 MSR cool'],
    ['PBF-A2411', 'B24-PBF-011', 'Lucknow', 'UP Chemicals', 'PbF2 99.4% CRT Phosphor Screen Binder', 'Display Glass', '99.4%', '824 degC', '&#8377;720 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'BEL PbF2 CRT bind'],
    ['PBF-A2412', 'B24-PBF-012', 'Visakhapatnam', 'Vizag Chemicals', 'PbF2 99.92% Submarine Periscope Neutron Shield', 'EO Mast Rad Shield', '99.92%', '824 degC', '&#8377;940 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK neutron shld'],
    ['PBF-A2413', 'B24-PBF-013', 'Balasore', 'DRDO TBRL', 'PbF2 99.99% Hypersonic Reentry Radiation Shield', 'Mach 7+ Gamma Dose', '99.99%', '824 degC', '&#8377;960 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO HSTDV PbF2 rad'],
    ['PBF-A2414', 'B24-PBF-014', 'Bhilai', 'SAIL Chemicals', 'PbF2 99.0% General Industrial Grade', 'Process Chemical', '99.0%', '824 degC', '&#8377;540 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL PbF2 industrial'],
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


kfl_config = {
    'prefix': 'kfl', 'icon': 'Percent', 'color': '#15803d',
    'title': 'Potassium Fluoride Logistics',
    'subtitle': 'KF agrochemical synthesis &#8226; Nuclear reprocessing &#8226; Aluminum smelting &#8226; Glass etching supply chain',
    'fn_name': 'PotassiumFluorideLogisticsView',
}
with open('src/components/modules/potassium-fluoride-logistics-view.tsx', 'w') as f:
    f.write(gen_module(kfl_records, kfl_config))
print("Generated: potassium-fluoride-logistics-view.tsx")

pbf_config = {
    'prefix': 'pbf', 'icon': 'Bluetooth', 'color': '#64748b',
    'title': 'Lead Fluoride Logistics',
    'subtitle': 'PbF2 Cherenkov scintillator &#8226; UV laser host &#8226; Radiation shield glass &#8226; IR window supply chain',
    'fn_name': 'LeadFluorideLogisticsView',
}
with open('src/components/modules/lead-fluoride-logistics-view.tsx', 'w') as f:
    f.write(gen_module(pbf_records, pbf_config))
print("Generated: lead-fluoride-logistics-view.tsx")

for fname in ['src/components/modules/potassium-fluoride-logistics-view.tsx', 'src/components/modules/lead-fluoride-logistics-view.tsx']:
    with open(fname, 'r') as f:
        c = f.read()
    rs = c[c.find('RECORDS = ['):c.find('];')]
    bad = re.findall(r"'[^']*'\s*:\s*'", rs)
    print(f"  {'WARNING: '+str(len(bad))+' typos' if bad else 'OK'}: {fname.split('/')[-1]}, Lines: {c.count(chr(10))+1}")
