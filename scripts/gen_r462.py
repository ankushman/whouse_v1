#!/usr/bin/env python3
"""R462 Generator: Selenium Dioxide Logistics + Ammonium Vanadate Logistics"""
import re

TEMPLATE_PATH = 'src/components/modules/zinc-oxide-logistics-view.tsx'

# --- Selenium Dioxide: SeO2 ---
# Prefix: sed, Icon: Citrus, Color: #a16207 (amber-dark, Se-amber), density 3.95 g/cm3
sed_records = [
    ['SED-A2401', 'B24-SED-001', 'Mumbai', 'MIDHANI', 'SeO2 99.5% Glass Decolorizer', 'Flint Glass Bleach', '99.5%', '3.95 g/cm3', '&#8377;820 Cr', 'in-transit', 'high', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'Asahi glass SeO2 decolor'],
    ['SED-A2402', 'B24-SED-002', 'Bengaluru', 'DRDO DMRL', 'SeO2 99.9% Copy Machine Photoreceptor', 'Se-Drum OPC', '99.9%', '3.95 g/cm3', '&#8377;900 Cr', 'delivered', 'high', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'HP LaserJet Se drum'],
    ['SED-A2403', 'B24-SED-003', 'Hyderabad', 'Tata Chemicals', 'SeO2 99.3% Pigment Cadmium Selenide Red', 'CdSe Glass Colour', '99.3%', '3.95 g/cm3', '&#8377;780 Cr', 'in-transit', 'medium', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'Asahi CdSe ruby glass'],
    ['SED-A2404', 'B24-SED-004', 'Chennai', 'Bharat Forge', 'SeO2 99.7% Rubber Vulcanization Accel', 'Se-SBR Curing', '99.7%', '3.95 g/cm3', '&#8377;840 Cr', 'delivered', 'high', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'MRF Se-accel tyre cure'],
    ['SED-A2405', 'B24-SED-005', 'Kolkata', 'Shyam Chemicals', 'SeO2 99.85% Kesterite Cu2ZnSnSe4 Solar', 'CZTSSe Thin-Film', '99.85%', '3.95 g/cm3', '&#8377;880 Cr', 'in-transit', 'critical', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'Tata Power CZTSSe PV'],
    ['SED-A2406', 'B24-SED-006', 'Noida', 'BHEL R&amp;D', 'SeO2 99.8% Rectifier Selenium Cell', 'Se Rectifier Stack', '99.8%', '3.95 g/cm3', '&#8377;820 Cr', 'delivered', 'medium', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'BHEL legacy Se rectifier'],
    ['SED-A2407', 'B24-SED-007', 'Pune', 'Godrej Chemicals', 'SeO2 99.6% Shampoo Anti-Dandruff ZPTO', 'Zn-Pyrithione Se', '99.6%', '3.95 g/cm3', '&#8377;760 Cr', 'in-transit', 'medium', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'HUL SeS2 anti-dandruff'],
    ['SED-A2408', 'B24-SED-008', 'Jaipur', 'Rajasthan Chemicals', 'SeO2 99.0% Vitamin/Supplement Trace', 'Dietary Se Source', '99.0%', '3.95 g/cm3', '&#8377;700 Cr', 'delivered', 'low', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'Abbott Se vitamin tab'],
    ['SED-A2409', 'B24-SED-009', 'Guwahati', 'Assam Chemicals', 'SeO2 99.4% Stainless Steel Passivate', 'Se Surface Finish', '99.4%', '3.95 g/cm3', '&#8377;780 Cr', 'in-transit', 'medium', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'Jindal SS Se passivate'],
    ['SED-A2410', 'B24-SED-010', 'Ahmedabad', 'Gujarat Chemicals', 'SeO2 99.92% High-Purity Semiconductor', 'CIGS/CZTSSe Absorber', '99.92%', '3.95 g/cm3', '&#8377;960 Cr', 'pending', 'critical', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'IISc CIGS Se target'],
    ['SED-A2411', 'B24-SED-011', 'Lucknow', 'UP Chemicals', 'SeO2 99.2% Agricultural Fungicide', 'Crop Se Foliar', '99.2%', '3.95 g/cm3', '&#8377;720 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'IFFCO Se foliar spray'],
    ['SED-A2412', 'B24-SED-012', 'Visakhapatnam', 'Vizag Chemicals', 'SeO2 99.95% Submarine Photo-Optic Mast', 'Se-Cell Periscope', '99.95%', '3.95 g/cm3', '&#8377;960 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK optronic mast'],
    ['SED-A2413', 'B24-SED-013', 'Balasore', 'DRDO TBRL', 'SeO2 99.8% Warship Night Vision IR Lens', 'Ge-Se Chalcogenide', '99.8%', '3.95 g/cm3', '&#8377;940 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO naval IR GeSe lens'],
    ['SED-A2414', 'B24-SED-014', 'Bhilai', 'SAIL Chemicals', 'SeO2 97.5% General Metallurgical Grade', 'Alloy Trace Add', '97.5%', '3.95 g/cm3', '&#8377;580 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL steel Se deox'],
]

# --- Ammonium Vanadate: NH4VO3 ---
# Prefix: amv, Icon: Clock, Color: #dc2626 (red, V-red), density 2.33 g/cm3
amv_records = [
    ['AMV-A2401', 'B24-AMV-001', 'Mumbai', 'MIDHANI', 'NH4VO3 99.5% Sulfuric Acid Catalyst', 'V2O5 Pellet Precursor', '99.5%', '2.33 g/cm3', '&#8377;840 Cr', 'in-transit', 'high', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'Tata Chemicals V2O5 pellet'],
    ['AMV-A2402', 'B24-AMV-002', 'Bengaluru', 'DRDO DMRL', 'NH4VO3 99.9% Ceramic Pigment Vanadium Blue', 'Zn-V Spinelle', '99.9%', '2.33 g/cm3', '&#8377;900 Cr', 'delivered', 'high', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'Morbi V-blue ceramic'],
    ['AMV-A2403', 'B24-AMV-003', 'Hyderabad', 'Tata Chemicals', 'NH4VO3 99.3% Glass UV Absorber', 'Photovoltaic Glass', '99.3%', '2.33 g/cm3', '&#8377;780 Cr', 'in-transit', 'medium', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'Asahi V-UV blocking glass'],
    ['AMV-A2404', 'B24-AMV-004', 'Chennai', 'Bharat Forge', 'NH4VO3 99.7% Ferrovanadium FeV80 Feed', 'Steel Alloy Additive', '99.7%', '2.33 g/cm3', '&#8377;860 Cr', 'delivered', 'high', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'SAIL FeV80 V feed'],
    ['AMV-A2405', 'B24-AMV-005', 'Kolkata', 'Shyam Chemicals', 'NH4VO3 99.85% Vanadium Redox Flow Battery', 'VRFB Electrolyte', '99.85%', '2.33 g/cm3', '&#8377;920 Cr', 'in-transit', 'critical', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'Tata Power VRFB electrolyte'],
    ['AMV-A2406', 'B24-AMV-006', 'Noida', 'BHEL R&amp;D', 'NH4VO3 99.8% Phthalic Anhydride Catalyst', 'PA Production', '99.8%', '2.33 g/cm3', '&#8377;820 Cr', 'delivered', 'high', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'Thirumalai V2O5 PA cat'],
    ['AMV-A2407', 'B24-AMV-007', 'Pune', 'Godrej Chemicals', 'NH4VO3 99.6% Dye Fixing Mordant V-Based', 'Textile V-Mordant', '99.6%', '2.33 g/cm3', '&#8377;760 Cr', 'in-transit', 'medium', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'Bhilwara V-dye fixative'],
    ['AMV-A2408', 'B24-AMV-008', 'Jaipur', 'Rajasthan Chemicals', 'NH4VO3 99.0% Corrosion Inhibitor Pigment', 'Primer Anti-Rust', '99.0%', '2.33 g/cm3', '&#8377;720 Cr', 'delivered', 'low', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'Asian Paints V-inhibitor'],
    ['AMV-A2409', 'B24-AMV-009', 'Guwahati', 'Assam Chemicals', 'NH4VO3 99.4% Maleic Anhydride Catalyst', 'Petrochemical MA', '99.4%', '2.33 g/cm3', '&#8377;800 Cr', 'in-transit', 'high', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'IOC Haldia V2O5 MA cat'],
    ['AMV-A2410', 'B24-AMV-010', 'Ahmedabad', 'Gujarat Chemicals', 'NH4VO3 99.92% Lithium-Vanadium Battery', 'LVPF Cathode', '99.92%', '2.33 g/cm3', '&#8377;960 Cr', 'pending', 'critical', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'IISc Li-V battery research'],
    ['AMV-A2411', 'B24-AMV-011', 'Lucknow', 'UP Chemicals', 'NH4VO3 99.2% Desulfurization Catalyst', 'Flue Gas DeSOx', '99.2%', '2.33 g/cm3', '&#8377;760 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'NTPC V2O5 DeSOx scrub'],
    ['AMV-A2412', 'B24-AMV-012', 'Visakhapatnam', 'Vizag Chemicals', 'NH4VO3 99.95% Submarine AIP Fuel Cell V-Electrolyte', 'Naval V-Redox', '99.95%', '2.33 g/cm3', '&#8377;960 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK V-AIP stack'],
    ['AMV-A2413', 'B24-AMV-013', 'Balasore', 'DRDO TBRL', 'NH4VO3 99.8% Warship SCR DeNOx Catalyst', 'Naval Gas Turbine', '99.8%', '2.33 g/cm3', '&#8377;940 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO naval LM2500 SCR'],
    ['AMV-A2414', 'B24-AMV-014', 'Bhilai', 'SAIL Chemicals', 'NH4VO3 98.0% General Industrial Grade', 'Process Catalyst', '98.0%', '2.33 g/cm3', '&#8377;600 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL V2O5 process cat'],
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


# --- Generate Selenium Dioxide ---
sed_config = {
    'prefix': 'sed', 'icon': 'Citrus', 'color': '#a16207',
    'title': 'Selenium Dioxide Logistics',
    'subtitle': 'SeO2 photoreceptor &#8226; Glass decolorizer &#8226; CZTSSe solar &#8226; Submarine optronic mast supply chain',
    'fn_name': 'SeleniumDioxideLogisticsView',
}
with open('src/components/modules/selenium-dioxide-logistics-view.tsx', 'w') as f:
    f.write(gen_module(sed_records, sed_config))
print("Generated: selenium-dioxide-logistics-view.tsx")

# --- Generate Ammonium Vanadate ---
amv_config = {
    'prefix': 'amv', 'icon': 'Clock', 'color': '#dc2626',
    'title': 'Ammonium Vanadate Logistics',
    'subtitle': 'NH4VO3 catalyst &#8226; VRFB battery &#8226; Ferrovanadium &#8226; Submarine V-AIP fuel cell supply chain',
    'fn_name': 'AmmoniumVanadateLogisticsView',
}
with open('src/components/modules/ammonium-vanadate-logistics-view.tsx', 'w') as f:
    f.write(gen_module(amv_records, amv_config))
print("Generated: ammonium-vanadate-logistics-view.tsx")

# --- Verify ---
for fname in ['src/components/modules/selenium-dioxide-logistics-view.tsx', 'src/components/modules/ammonium-vanadate-logistics-view.tsx']:
    with open(fname, 'r') as f:
        c = f.read()
    rs = c[c.find('RECORDS = ['):c.find('];')]
    bad = re.findall(r"'[^']*'\s*:\s*'", rs)
    print(f"  {'WARNING: '+str(len(bad))+' typos' if bad else 'OK'}: {fname.split('/')[-1]}")
