#!/usr/bin/env python3
"""R481 Generator: Magnesium Fluoride Logistics + Titanium Carbide Logistics"""
import re

TEMPLATE_PATH = 'src/components/modules/zinc-oxide-logistics-view.tsx'

# --- Magnesium Fluoride: MgF2 ---
# Prefix: mgf, Icon: PersonStanding, Color: #6d28d9 (violet-dark), MP 1261 degC, density 3.15 g/cm3
# MgF2: anti-reflective lens coating, VUV transparent window, LiF bonding substrate,
# optical fiber low-index cladding, UV telescope mirror coating, cryogenic transmissive optic
mgf_records = [
    ['MGF-A2401', 'B24-MGF-001', 'Mumbai', 'MIDHANI', 'MgF2 99.99% Anti-Reflective Lens Coating', 'AR Broadband 400-700 nm', '99.99%', '1261 degC', '&#8377;880 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'Carl Zeiss MgF2 AR coat'],
    ['MGF-A2402', 'B24-MGF-002', 'Bengaluru', 'DRDO DMRL', 'MgF2 99.999% VUV Transparent Window 115 nm', 'Synchrotron Beamline', '99.999%', '1261 degC', '&#8377;960 Cr', 'delivered', 'critical', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'IISc MgF2 VUV window'],
    ['MGF-A2403', 'B24-MGF-003', 'Hyderabad', 'Tata Chemicals', 'MgF2 99.95% Optical Fiber Low-Index Cladding', 'Depressed Cladding Fiber', '99.95%', '1261 degC', '&#8377;840 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'Sterlite MgF2 cladding'],
    ['MGF-A2404', 'B24-MGF-004', 'Chennai', 'Bharat Forge', 'MgF2 99.9% UV Space Telescope Mirror Coating', 'Astrosat UV Mirror', '99.9%', '1261 degC', '&#8377;920 Cr', 'delivered', 'critical', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'ISRO MgF2 mirror'],
    ['MGF-A2405', 'B24-MGF-005', 'Kolkata', 'Shyam Chemicals', 'MgF2 99.7% Cryogenic Infrared Transmissive Optic', 'LHe Cold Window', '99.7%', '1261 degC', '&#8377;860 Cr', 'in-transit', 'high', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'IIT-Khar MgF2 cryo'],
    ['MGF-A2406', 'B24-MGF-006', 'Noida', 'BHEL R&amp;D', 'MgF2 99.98% Laser Diode Facet AR Coating', 'InGaN GaN 450 nm', '99.98%', '1261 degC', '&#8377;900 Cr', 'delivered', 'high', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'SSPL MgF2 laser facet'],
    ['MGF-A2407', 'B24-MGF-007', 'Pune', 'Godrej Chemicals', 'MgF2 99.5% Photolithography Stepper Lens Element', 'ASML DUV Pellicle', '99.5%', '1261 degC', '&#8377;840 Cr', 'in-transit', 'medium', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'Intel MgF2 litho'],
    ['MGF-A2408', 'B24-MGF-008', 'Jaipur', 'Rajasthan Chemicals', 'MgF2 99.8% Missile Seeker Dome Anti-Reflect', 'Astra Mk-II UV', '99.8%', '1261 degC', '&#8377;880 Cr', 'delivered', 'high', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'DRDO MgF2 seeker AR'],
    ['MGF-A2409', 'B24-MGF-009', 'Guwahati', 'Assam Chemicals', 'MgF2 99.99% Deep-UV Photodiode Window', 'GaN 280 nm UV PD', '99.99%', '1261 degC', '&#8377;920 Cr', 'in-transit', 'critical', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'IIT-G MgF2 UV PD'],
    ['MGF-A2410', 'B24-MGF-010', 'Ahmedabad', 'Gujarat Chemicals', 'MgF2 99.6% Semiconductor Wafer Bonding Interlayer', 'Si-SiO2-MgF2 Bond', '99.6%', '1261 degC', '&#8377;800 Cr', 'pending', 'high', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'IIT-B MgF2 wafer bond'],
    ['MGF-A2411', 'B24-MGF-011', 'Lucknow', 'UP Chemicals', 'MgF2 99.4% Fluorescence Microscope Filter', 'DAPI FITC Filter Set', '99.4%', '1261 degC', '&#8377;760 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'Leica MgF2 filter'],
    ['MGF-A2412', 'B24-MGF-012', 'Visakhapatnam', 'Vizag Chemicals', 'MgF2 99.92% Submarine Periscope UV Sensor Window', 'Type 209 UV Detect', '99.92%', '1261 degC', '&#8377;920 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK UV sensor'],
    ['MGF-A2413', 'B24-MGF-013', 'Balasore', 'DRDO TBRL', 'MgF2 99.99% Hypersonic Wind Tunnel Schlieren Window', 'Mach 7+ Flow Vis', '99.99%', '1261 degC', '&#8377;940 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO HSTDV Schlieren'],
    ['MGF-A2414', 'B24-MGF-014', 'Bhilai', 'SAIL Chemicals', 'MgF2 99.0% General Optical Coating Grade', 'Process Chemical', '99.0%', '1261 degC', '&#8377;520 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL MgF2 industrial'],
]

# --- Titanium Carbide: TiC ---
# Prefix: tic, Icon: ChevronsRight, Color: #0f766e (teal-dark), MP 3160 degC, density 4.93 g/cm3
# TiC: cutting tool inserts, cermet wear coating, cemented carbide grain refiner,
# CVD coating on WC-Co tools, thermal spray barrier, defense armor ceramic,
# steelmaking deoxidizer, hydrogen storage
tic_records = [
    ['TIC-A2401', 'B24-TIC-001', 'Mumbai', 'MIDHANI', 'TiC 99.9% CNC Cutting Tool Insert', 'Turning Grade P10', '99.9%', '3160 degC', '&#8377;940 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'Sandvik TiC insert'],
    ['TIC-A2402', 'B24-TIC-002', 'Bengaluru', 'DRDO DMRL', 'TiC 99.99% Cermet Wear-Resistant Armor Tile', 'Boron Carbide Bonded', '99.99%', '3160 degC', '&#8377;1080 Cr', 'delivered', 'critical', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'DRDO TiC armor cermet'],
    ['TIC-A2403', 'B24-TIC-003', 'Hyderabad', 'Tata Chemicals', 'TiC 99.7% CVD Coating on WC-Co Milling Tool', 'Multi-Layer TiC/Al2O3', '99.7%', '3160 degC', '&#8377;960 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'Kennametal TiC CVD'],
    ['TIC-A2404', 'B24-TIC-004', 'Chennai', 'Bharat Forge', 'TiC 99.5% Cemented Carbide Grain Refiner', 'WC-Co Binder Phase', '99.5%', '3160 degC', '&#8377;900 Cr', 'delivered', 'high', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'Sandvik TiC WC refiner'],
    ['TIC-A2405', 'B24-TIC-005', 'Kolkata', 'Shyam Chemicals', 'TiC 99.8% Thermal Spray Tungsten Carbide Alt', 'HVOF Sprayed Coating', '99.8%', '3160 degC', '&#8377;880 Cr', 'in-transit', 'high', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'Praxair TiC thermal spray'],
    ['TIC-A2406', 'B24-TIC-006', 'Noida', 'BHEL R&amp;D', 'TiC 99.6% Steelmaking Deoxidizer Addition', 'LD Converter FeTiC', '99.6%', '3160 degC', '&#8377;820 Cr', 'delivered', 'medium', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'SAIL TiC deox additive'],
    ['TIC-A2407', 'B24-TIC-007', 'Pune', 'Godrej Chemicals', 'TiC 99.4% Hydrogen Storage TiC-Doped MgH2', 'Solid-State H2 Tank', '99.4%', '3160 degC', '&#8377;920 Cr', 'in-transit', 'high', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'IISc TiC MgH2 storage'],
    ['TIC-A2408', 'B24-TIC-008', 'Jaipur', 'Rajasthan Chemicals', 'TiC 99.3% Forming Die Wear Coating', 'Stamping Tool PVD', '99.3%', '3160 degC', '&#8377;840 Cr', 'delivered', 'high', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'Bajaj TiC die coat'],
    ['TIC-A2409', 'B24-TIC-009', 'Guwahati', 'Assam Chemicals', 'TiC 99.9% High-Temp Thermocouple Sheath', 'Type S Pt-Rh Shield', '99.9%', '3160 degC', '&#8377;900 Cr', 'in-transit', 'critical', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'IIT-G TiC TC sheath'],
    ['TIC-A2410', 'B24-TIC-010', 'Ahmedabad', 'Gujarat Chemicals', 'TiC 99.5% Electric Contact Arc-Erosion Resistant', 'Cu-TiC Composite', '99.5%', '3160 degC', '&#8377;860 Cr', 'pending', 'high', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'ABB TiC contact'],
    ['TIC-A2411', 'B24-TIC-011', 'Lucknow', 'UP Chemicals', 'TiC 99.2% Pump Impeller Wear Coating', 'Slurry Abrasion Guard', '99.2%', '3160 degC', '&#8377;780 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'Kirloskar TiC impeller'],
    ['TIC-A2412', 'B24-TIC-012', 'Visakhapatnam', 'Vizag Chemicals', 'TiC 99.92% Submarine Propeller Shaft Wear Sleeve', 'Type 209 Shaft Bearing', '99.92%', '3160 degC', '&#8377;1000 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK shaft sleeve'],
    ['TIC-A2413', 'B24-TIC-013', 'Balasore', 'DRDO TBRL', 'TiC 99.99% Hypersonic Vehicle Nose Cone Leading Edge', 'Mach 10+ Ablative', '99.99%', '3160 degC', '&#8377;1060 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO HSTDV TiC TPS'],
    ['TIC-A2414', 'B24-TIC-014', 'Bhilai', 'SAIL Chemicals', 'TiC 99.0% General Metallurgical Grade', 'Process Chemical', '99.0%', '3160 degC', '&#8377;600 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL TiC metallurgical'],
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


mgf_config = {
    'prefix': 'mgf', 'icon': 'PersonStanding', 'color': '#6d28d9',
    'title': 'Magnesium Fluoride Logistics',
    'subtitle': 'MgF2 AR lens coating &#8226; VUV transparent window &#8226; Optical fiber cladding &#8226; Cryogenic optic supply chain',
    'fn_name': 'MagnesiumFluorideLogisticsView',
}
with open('src/components/modules/magnesium-fluoride-logistics-view.tsx', 'w') as f:
    f.write(gen_module(mgf_records, mgf_config))
print("Generated: magnesium-fluoride-logistics-view.tsx")

tic_config = {
    'prefix': 'tic', 'icon': 'ChevronsRight', 'color': '#0f766e',
    'title': 'Titanium Carbide Logistics',
    'subtitle': 'TiC cutting tool insert &#8226; Cermet armor coating &#8226; CVD tool coating &#8226; Hydrogen storage supply chain',
    'fn_name': 'TitaniumCarbideLogisticsView',
}
with open('src/components/modules/titanium-carbide-logistics-view.tsx', 'w') as f:
    f.write(gen_module(tic_records, tic_config))
print("Generated: titanium-carbide-logistics-view.tsx")

for fname in ['src/components/modules/magnesium-fluoride-logistics-view.tsx', 'src/components/modules/titanium-carbide-logistics-view.tsx']:
    with open(fname, 'r') as f:
        c = f.read()
    rs = c[c.find('RECORDS = ['):c.find('];')]
    bad = re.findall(r"'[^']*'\s*:\s*'", rs)
    print(f"  {'WARNING: '+str(len(bad))+' typos' if bad else 'OK'}: {fname.split('/')[-1]}, Lines: {c.count(chr(10))+1}")
