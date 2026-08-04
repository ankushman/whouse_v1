#!/usr/bin/env python3
"""R471 Generator: Cadmium Sulfide Logistics + Zinc Selenide Logistics"""
import re

TEMPLATE_PATH = 'src/components/modules/zinc-oxide-logistics-view.tsx'

# --- Cadmium Sulfide: CdS ---
# Prefix: cds, Icon: Binoculars, Color: #7c3aed (violet), MP 980 degC, density 4.82 g/cm3
# CdS: thin-film PV photoconductor, cadmium yellow pigment, photoresistor, radiation detector,
# LED phosphor, II-VI semiconductor for CdTe/CdS heterojunction solar cells
cds_records = [
    ['CDS-A2401', 'B24-CDS-001', 'Mumbai', 'MIDHANI', 'CdS 99.99% Thin-Film Solar Cell Window', 'CdTe/CdS Heterojunction', '99.99%', '980 degC', '&#8377;920 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'Tata Power CdS PV window'],
    ['CDS-A2402', 'B24-CDS-002', 'Bengaluru', 'DRDO DMRL', 'CdS 99.95% Photoconductive Radiation Detector', 'Nuclear Dosimetry', '99.95%', '980 degC', '&#8377;960 Cr', 'delivered', 'critical', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'BARC CdS radiation det'],
    ['CDS-A2403', 'B24-CDS-003', 'Hyderabad', 'Tata Chemicals', 'CdS 99.9% High-Purity Cadmium Yellow Pigment', 'Ceramic Glaze Color', '99.9%', '980 degC', '&#8377;840 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'Asian Paints CdS pigment'],
    ['CDS-A2404', 'B24-CDS-004', 'Chennai', 'Bharat Forge', 'CdS 99.85% Photoresistor Light Sensor', 'LDR Photoconductor', '99.85%', '980 degC', '&#8377;800 Cr', 'delivered', 'high', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'BHEL CdS photoresistor'],
    ['CDS-A2405', 'B24-CDS-005', 'Kolkata', 'Shyam Chemicals', 'CdS 99.7% Electroluminescent LED Phosphor', 'EL Display Panel', '99.7%', '980 degC', '&#8377;780 Cr', 'in-transit', 'medium', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'BEL CdS EL phosphor'],
    ['CDS-A2406', 'B24-CDS-006', 'Noida', 'BHEL R&amp;D', 'CdS 99.92% Defense Night Vision Intensifier', 'Image Intensifier', '99.92%', '980 degC', '&#8377;940 Cr', 'delivered', 'critical', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'BEL Optronic CdS NV'],
    ['CDS-A2407', 'B24-CDS-007', 'Pune', 'Godrej Chemicals', 'CdS 99.5% Plastic Stabilizer Additive', 'PVC Heat Stabilizer', '99.5%', '980 degC', '&#8377;720 Cr', 'in-transit', 'medium', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'Reliance CdS stabilizer'],
    ['CDS-A2408', 'B24-CDS-008', 'Jaipur', 'Rajasthan Chemicals', 'CdS 99.8% Flame-Retardant Smoke Suppressant', 'Polymeric FR Agent', '99.8%', '980 degC', '&#8377;860 Cr', 'delivered', 'high', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'DRDO CdS smoke supp'],
    ['CDS-A2409', 'B24-CDS-009', 'Guwahati', 'Assam Chemicals', 'CdS 99.93% Quantum Dot Solar Concentrator', 'QD Luminescent CC', '99.93%', '980 degC', '&#8377;900 Cr', 'in-transit', 'critical', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'IIT-G CdS quantum dot'],
    ['CDS-A2410', 'B24-CDS-010', 'Ahmedabad', 'Gujarat Chemicals', 'CdS 99.6% X-Ray Fluorescence Detector Crystal', 'XRF Scintillator', '99.6%', '980 degC', '&#8377;880 Cr', 'pending', 'high', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'ISRO CdS XRF crystal'],
    ['CDS-A2411', 'B24-CDS-011', 'Lucknow', 'UP Chemicals', 'CdS 99.4% Diode Laser Optocoupler', 'Optoelectronic Switch', '99.4%', '980 degC', '&#8377;760 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'BEL CdS optocoupler'],
    ['CDS-A2412', 'B24-CDS-012', 'Visakhapatnam', 'Vizag Chemicals', 'CdS 99.85% Submarine Periscope CCD Coating', 'EO Mast Sensor', '99.85%', '980 degC', '&#8377;920 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK CCD coat'],
    ['CDS-A2413', 'B24-CDS-013', 'Balasore', 'DRDO TBRL', 'CdS 99.96% Hypersonic Thermal IR Sensor', 'Mach 7+ IR Detect', '99.96%', '980 degC', '&#8377;960 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO HSTDV CdS IR'],
    ['CDS-A2414', 'B24-CDS-014', 'Bhilai', 'SAIL Chemicals', 'CdS 99.0% General Industrial Grade', 'Process Chemical', '99.0%', '980 degC', '&#8377;540 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL CdS pigment gen'],
]

# --- Zinc Selenide: ZnSe ---
# Prefix: zns, Icon: DraftingCompass, Color: #0d9488 (teal), MP 1100 degC, density 5.27 g/cm3
# ZnSe: CO2 laser windows, IR optics, blue/green LED, thin-film PV, optical coatings,
# luminescent materials, II-VI semiconductor for thermal imaging
zns_records = [
    ['ZNS-A2401', 'B24-ZNS-001', 'Mumbai', 'MIDHANI', 'ZnSe 99.99% CO2 Laser Output Coupler', '10.6 um IR Window', '99.99%', '1100 degC', '&#8377;940 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'BEL ZnSe laser window'],
    ['ZNS-A2402', 'B24-ZNS-002', 'Bengaluru', 'DRDO DMRL', 'ZnSe 99.95% Thermal Imaging FLIR Lens', 'MWIR 3-5 um Optic', '99.95%', '1100 degC', '&#8377;960 Cr', 'delivered', 'critical', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'DRDO ZnSe FLIR lens'],
    ['ZNS-A2403', 'B24-ZNS-003', 'Hyderabad', 'Tata Chemicals', 'ZnSe 99.9% Blue-Green LED Epitaxial Wafer', 'II-VI LED Substrate', '99.9%', '1100 degC', '&#8377;880 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'IISc ZnSe LED wafer'],
    ['ZNS-A2404', 'B24-ZNS-004', 'Chennai', 'Bharat Forge', 'ZnSe 99.85% Multi-Spectral Optical Coating', 'AR IR Coating', '99.85%', '1100 degC', '&#8377;840 Cr', 'delivered', 'high', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'ISRO ZnSe optical coat'],
    ['ZNS-A2405', 'B24-ZNS-005', 'Kolkata', 'Shyam Chemicals', 'ZnSe 99.7% Night Vision Image Tube Window', 'Gen-3 NVG Optic', '99.7%', '1100 degC', '&#8377;820 Cr', 'in-transit', 'medium', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'BEL Optronic ZnSe NVG'],
    ['ZNS-A2406', 'B24-ZNS-006', 'Noida', 'BHEL R&amp;D', 'ZnSe 99.92% Submarine Periscope Thermal Window', 'EO Mast IR Optic', '99.92%', '1100 degC', '&#8377;940 Cr', 'delivered', 'critical', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'Mazagon Dock ZnSe IR'],
    ['ZNS-A2407', 'B24-ZNS-007', 'Pune', 'Godrej Chemicals', 'ZnSe 99.5% Laser Cutting Head Focusing Lens', 'Industrial CO2 Lens', '99.5%', '1100 degC', '&#8377;760 Cr', 'in-transit', 'medium', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'L&amp;T ZnSe cut lens'],
    ['ZNS-A2408', 'B24-ZNS-008', 'Jaipur', 'Rajasthan Chemicals', 'ZnSe 99.8% Missile Seeker IR Dome', 'RF-IR Dual Window', '99.8%', '1100 degC', '&#8377;900 Cr', 'delivered', 'high', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'DRDO Astra ZnSe dome'],
    ['ZNS-A2409', 'B24-ZNS-009', 'Guwahati', 'Assam Chemicals', 'ZnSe 99.93% Hollow Cathode Lamp Emission', 'Atomic Absorption', '99.93%', '1100 degC', '&#8377;880 Cr', 'in-transit', 'critical', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'IIT-G ZnSe HCL lamp'],
    ['ZNS-A2410', 'B24-ZNS-010', 'Ahmedabad', 'Gujarat Chemicals', 'ZnSe 99.6% Photoluminescent Thin-Film Layer', 'CIGS Buffer Layer', '99.6%', '1100 degC', '&#8377;820 Cr', 'pending', 'high', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'Tata Power ZnSe CIGS'],
    ['ZNS-A2411', 'B24-ZNS-011', 'Lucknow', 'UP Chemicals', 'ZnSe 99.4% Medical Laser Handpiece Window', 'Dental Surgical LASER', '99.4%', '1100 degC', '&#8377;740 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'BEL ZnSe medical laser'],
    ['ZNS-A2412', 'B24-ZNS-012', 'Visakhapatnam', 'Vizag Chemicals', 'ZnSe 99.85% Submarine Sonar IR Transparent Dome', 'Acoustic-IR Window', '99.85%', '1100 degC', '&#8377;920 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK sonar dome'],
    ['ZNS-A2413', 'B24-ZNS-013', 'Balasore', 'DRDO TBRL', 'ZnSe 99.96% Hypersonic Wind Tunnel IR Port', 'Mach 7+ Test Optic', '99.96%', '1100 degC', '&#8377;960 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO HSTDV ZnSe port'],
    ['ZNS-A2414', 'B24-ZNS-014', 'Bhilai', 'SAIL Chemicals', 'ZnSe 99.0% General Industrial Grade', 'Process Chemical', '99.0%', '1100 degC', '&#8377;560 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL ZnSe industrial'],
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


cds_config = {
    'prefix': 'cds', 'icon': 'Binoculars', 'color': '#7c3aed',
    'title': 'Cadmium Sulfide Logistics',
    'subtitle': 'CdS thin-film PV &#8226; Photoresistor sensor &#8226; Cadmium yellow pigment &#8226; Quantum dot solar supply chain',
    'fn_name': 'CadmiumSulfideLogisticsView',
}
with open('src/components/modules/cadmium-sulfide-logistics-view.tsx', 'w') as f:
    f.write(gen_module(cds_records, cds_config))
print("Generated: cadmium-sulfide-logistics-view.tsx")

zns_config = {
    'prefix': 'zns', 'icon': 'DraftingCompass', 'color': '#0d9488',
    'title': 'Zinc Selenide Logistics',
    'subtitle': 'ZnSe CO2 laser window &#8226; Thermal imaging FLIR &#8226; Blue-green LED &#8226; Night vision optics supply chain',
    'fn_name': 'ZincSelenideLogisticsView',
}
with open('src/components/modules/zinc-selenide-logistics-view.tsx', 'w') as f:
    f.write(gen_module(zns_records, zns_config))
print("Generated: zinc-selenide-logistics-view.tsx")

# Verify: check for colon typos in record arrays
for fname in ['src/components/modules/cadmium-sulfide-logistics-view.tsx', 'src/components/modules/zinc-selenide-logistics-view.tsx']:
    with open(fname, 'r') as f:
        c = f.read()
    rs = c[c.find('RECORDS = ['):c.find('];')]
    bad = re.findall(r"'[^']*'\s*:\s*'", rs)
    print(f"  {'WARNING: '+str(len(bad))+' typos' if bad else 'OK'}: {fname.split('/')[-1]}, Lines: {c.count(chr(10))+1}")
