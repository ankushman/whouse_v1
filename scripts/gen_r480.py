#!/usr/bin/env python3
"""R480 Generator: Uranium Dioxide Logistics + Zirconium Silicate Logistics"""
import re

TEMPLATE_PATH = 'src/components/modules/zinc-oxide-logistics-view.tsx'

# --- Uranium Dioxide: UO2 ---
# Prefix: uo2, Icon: CalendarDays, Color: #b91c1c (dark red), MP 2865 degC, density 10.97 g/cm3
# UO2: PHWR fuel pellets, BWR fuel, fast breeder MOX, nuclear reprocessing,
# depleted uranium armor penetrator, radiation shielding, nuclear waste form
uo2_records = [
    ['UO2-A2401', 'B24-UO2-001', 'Mumbai', 'MIDHANI', 'UO2 99.99% PHWR Fuel Pellet Tarapur', 'NPCIL 220 MW PHWR', '99.99%', '2865 degC', '&#8377;1400 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'NPCIL Tarapur PHWR'],
    ['UO2-A2402', 'B24-UO2-002', 'Bengaluru', 'DRDO DMRL', 'UO2 99.999% Depleted Uranium APFSDS Core', 'Kinetic Energy Penetrator', '99.999%', '2865 degC', '&#8377;1600 Cr', 'delivered', 'critical', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'DRDO Mk-1 APFSDS'],
    ['UO2-A2403', 'B24-UO2-003', 'Hyderabad', 'Tata Chemicals', 'UO2 99.95% BWR Fuel Assembly Blanket', 'TAPS Boiling Water', '99.95%', '2865 degC', '&#8377;1320 Cr', 'in-transit', 'critical', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'NPCIL TAPS BWR fuel'],
    ['UO2-A2404', 'B24-UO2-004', 'Chennai', 'Bharat Forge', 'UO2 99.9% Fast Breeder MOX Blend Pellet', 'PFBR MOX Core', '99.9%', '2865 degC', '&#8377;1500 Cr', 'delivered', 'critical', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'IGCAR PFBR MOX'],
    ['UO2-A2405', 'B24-UO2-005', 'Kolkata', 'Shyam Chemicals', 'UO2 99.7% Radiation Shielding Container Liner', 'Dry Cask Storage', '99.7%', '2865 degC', '&#8377;1200 Cr', 'in-transit', 'high', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'NPCIL dry cask liner'],
    ['UO2-A2406', 'B24-UO2-006', 'Noida', 'BHEL R&amp;D', 'UO2 99.98% Kalpakkam MAPS PHWR Reload', '220 MW Indigenous', '99.98%', '2865 degC', '&#8377;1360 Cr', 'delivered', 'critical', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'MAPS PHWR reload'],
    ['UO2-A2407', 'B24-UO2-007', 'Pune', 'Godrej Chemicals', 'UO2 99.5% Nuclear Waste Glass Synrock Form', 'Immobilization Matrix', '99.5%', '2865 degC', '&#8377;1100 Cr', 'in-transit', 'medium', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'BARC Synroc waste'],
    ['UO2-A2408', 'B24-UO2-008', 'Jaipur', 'Rajasthan Chemicals', 'UO2 99.8% Rawatbhata RAPS-5 PHWR Fuel', '700 MW RAPS', '99.8%', '2865 degC', '&#8377;1280 Cr', 'delivered', 'high', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'RAPS PHWR fuel'],
    ['UO2-A2409', 'B24-UO2-009', 'Guwahati', 'Assam Chemicals', 'UO2 99.99% Research Reactor Apsara-U Fuel', 'DHRUVA Critical Assembly', '99.99%', '2865 degC', '&#8377;1440 Cr', 'in-transit', 'critical', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'BARC Apsara-U fuel'],
    ['UO2-A2410', 'B24-UO2-010', 'Ahmedabad', 'Gujarat Chemicals', 'UO2 99.6% Kakrapar KAPP-3 Fuel Pellet', '700 MW PHWR', '99.6%', '2865 degC', '&#8377;1300 Cr', 'pending', 'critical', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'KAPP-3 PHWR pellet'],
    ['UO2-A2411', 'B24-UO2-011', 'Lucknow', 'UP Chemicals', 'UO2 99.4% Narora NAPS PHWR Refuel', '220 MW NAPS', '99.4%', '2865 degC', '&#8377;1180 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'NAPS PHWR refuel'],
    ['UO2-A2412', 'B24-UO2-012', 'Visakhapatnam', 'Vizag Chemicals', 'UO2 99.92% Submarine Nuclear Reactor LEU Fuel', 'INS Arihant 83 MW PWR', '99.92%', '2865 degC', '&#8377;1600 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSBN PWR fuel'],
    ['UO2-A2413', 'B24-UO2-013', 'Balasore', 'DRDO TBRL', 'UO2 99.99% Hypersonic DU Ballast Weight', 'Mach 8+ Nose Mass', '99.99%', '2865 degC', '&#8377;1400 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO HSTDV DU ballast'],
    ['UO2-A2414', 'B24-UO2-014', 'Bhilai', 'SAIL Chemicals', 'UO2 99.0% Depleted Uranium Industrial Counterweight', 'Radiation Shield Block', '99.0%', '2865 degC', '&#8377;800 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL DU counterweight'],
]

# --- Zirconium Silicate: ZrSiO4 ---
# Prefix: zrs, Icon: Martini, Color: #4d7c0f (dark lime), MP 2550 degC, density 4.68 g/cm3
# ZrSiO4: foundry mold facing sand, ceramic opacifier, refractory zircon,
# thermal barrier coating, TV glass CRT, dental ceramic, catalytic support
zrs_records = [
    ['ZRS-A2401', 'B24-ZRS-001', 'Mumbai', 'MIDHANI', 'ZrSiO4 99.9% Foundry Mold Facing Sand', 'Investment Casting Shell', '99.9%', '2550 degC', '&#8377;860 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'MIDHANI casting sand'],
    ['ZRS-A2402', 'B24-ZRS-002', 'Bengaluru', 'DRDO DMRL', 'ZrSiO4 99.99% Aerospace Turbine Blade Casting Shell', 'Single Crystal Shell', '99.99%', '2550 degC', '&#8377;940 Cr', 'delivered', 'critical', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'DRDO GTRE blade shell'],
    ['ZRS-A2403', 'B24-ZRS-003', 'Hyderabad', 'Tata Chemicals', 'ZrSiO4 99.95% Ceramic Tile Opacifier', 'Glazed Wall Tile', '99.95%', '2550 degC', '&#8377;780 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'Kajaria zircon opacifier'],
    ['ZRS-A2404', 'B24-ZRS-004', 'Chennai', 'Bharat Forge', 'ZrSiO4 99.7% Refractory Zircon Kiln Furniture', 'Sagger Plate Setter', '99.7%', '2550 degC', '&#8377;840 Cr', 'delivered', 'high', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'Carborundum ZrSiO4 kiln'],
    ['ZRS-A2405', 'B24-ZRS-005', 'Kolkata', 'Shyam Chemicals', 'ZrSiO4 99.5% Thermal Barrier Coating Zirconia Source', 'TBC Bond Coat', '99.5%', '2550 degC', '&#8377;900 Cr', 'in-transit', 'high', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'DRDO TBC zircon'],
    ['ZRS-A2406', 'B24-ZRS-006', 'Noida', 'BHEL R&amp;D', 'ZrSiO4 99.8% Anti-Corrosion Welding Electrode Flux', 'Zircon Sand Flux', '99.8%', '2550 degC', '&#8377;820 Cr', 'delivered', 'medium', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'BHEL welding flux'],
    ['ZRS-A2407', 'B24-ZRS-007', 'Pune', 'Godrej Chemicals', 'ZrSiO4 99.4% Dental Ceramic Coping Framework', 'Zirconia Disc CAD/CAM', '99.4%', '2550 degC', '&#8377;880 Cr', 'in-transit', 'high', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'Dentsply ZrSiO4 dental'],
    ['ZRS-A2408', 'B24-ZRS-008', 'Jaipur', 'Rajasthan Chemicals', 'ZrSiO4 99.6% TV Glass CRT Panel Opacifier', 'Display Glass X-Ray', '99.6%', '2550 degC', '&#8377;760 Cr', 'delivered', 'medium', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'Samsung zircon CRT'],
    ['ZRS-A2409', 'B24-ZRS-009', 'Guwahati', 'Assam Chemicals', 'ZrSiO4 99.99% Catalytic Converter Support Substrate', 'Three-Way Catalyst', '99.99%', '2550 degC', '&#8377;900 Cr', 'in-transit', 'high', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'Bosch ZrSiO4 catalyst'],
    ['ZRS-A2410', 'B24-ZRS-010', 'Ahmedabad', 'Gujarat Chemicals', 'ZrSiO4 99.3% Frit Glaze Enamel Binder', 'Porcelain Vitrified', '99.3%', '2550 degC', '&#8377;740 Cr', 'pending', 'medium', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'Somany frit glaze'],
    ['ZRS-A2411', 'B24-ZRS-011', 'Lucknow', 'UP Chemicals', 'ZrSiO4 99.2% High-Alumina Refractory Castable', 'Steel Ladle Lining', '99.2%', '2550 degC', '&#8377;800 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'Tata Steel ladle'],
    ['ZRS-A2412', 'B24-ZRS-012', 'Visakhapatnam', 'Vizag Chemicals', 'ZrSiO4 99.92% Submarine Sonar Dome Casting Shell', 'Acoustic Transparent', '99.92%', '2550 degC', '&#8377;940 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK sonar dome'],
    ['ZRS-A2413', 'B24-ZRS-013', 'Balasore', 'DRDO TBRL', 'ZrSiO4 99.99% Hypersonic Leading Edge Ablative Shell', 'Mach 10+ TPS Mold', '99.99%', '2550 degC', '&#8377;920 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO HSTDV ablat shell'],
    ['ZRS-A2414', 'B24-ZRS-014', 'Bhilai', 'SAIL Chemicals', 'ZrSiO4 99.0% General Foundry Grade Sand', 'Green Sand Core', '99.0%', '2550 degC', '&#8377;520 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL foundry sand'],
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


uo2_config = {
    'prefix': 'uo2', 'icon': 'CalendarDays', 'color': '#b91c1c',
    'title': 'Uranium Dioxide Logistics',
    'subtitle': 'UO2 PHWR fuel pellet &#8226; APFSDS penetrator &#8226; Fast breeder MOX &#8226; Radiation shielding supply chain',
    'fn_name': 'UraniumDioxideLogisticsView',
}
with open('src/components/modules/uranium-dioxide-logistics-view.tsx', 'w') as f:
    f.write(gen_module(uo2_records, uo2_config))
print("Generated: uranium-dioxide-logistics-view.tsx")

zrs_config = {
    'prefix': 'zrs', 'icon': 'Martini', 'color': '#4d7c0f',
    'title': 'Zirconium Silicate Logistics',
    'subtitle': 'ZrSiO4 foundry casting &#8226; Ceramic opacifier &#8226; Thermal barrier &#8226; Dental ceramic supply chain',
    'fn_name': 'ZirconiumSilicateLogisticsView',
}
with open('src/components/modules/zirconium-silicate-logistics-view.tsx', 'w') as f:
    f.write(gen_module(zrs_records, zrs_config))
print("Generated: zirconium-silicate-logistics-view.tsx")

for fname in ['src/components/modules/uranium-dioxide-logistics-view.tsx', 'src/components/modules/zirconium-silicate-logistics-view.tsx']:
    with open(fname, 'r') as f:
        c = f.read()
    rs = c[c.find('RECORDS = ['):c.find('];')]
    bad = re.findall(r"'[^']*'\s*:\s*'", rs)
    print(f"  {'WARNING: '+str(len(bad))+' typos' if bad else 'OK'}: {fname.split('/')[-1]}, Lines: {c.count(chr(10))+1}")
