#!/usr/bin/env python3
"""R482 Generator: Molybdenum Disilicide Logistics + Hafnium Carbide Logistics"""
import re

TEMPLATE_PATH = 'src/components/modules/zinc-oxide-logistics-view.tsx'

# --- Molybdenum Disilicide: MoSi2 ---
# Prefix: mos, Icon: TowerControl, Color: #9a3412 (orange-dark), MP 2030 degC, density 6.24 g/cm3
# MoSi2: furnace heating elements, thermoelectric generator, high-temp oxidation-resistant coating,
# aircraft turbine combustion chamber liner, thin-film microelectronics resistor, igniter
mos_records = [
    ['MOS-A2401', 'B24-MOS-001', 'Mumbai', 'MIDHANI', 'MoSi2 99.9% Industrial Furnace Heating Element', 'Kanthal Super 1800 degC', '99.9%', '2030 degC', '&#8377;920 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'Kanthal MoSi2 element'],
    ['MOS-A2402', 'B24-MOS-002', 'Bengaluru', 'DRDO DMRL', 'MoSi2 99.99% Thermoelectric Generator Hot-Side Leg', 'SiGe-MoSi2 SEG', '99.99%', '2030 degC', '&#8377;1080 Cr', 'delivered', 'critical', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'DRDO MoSi2 TEG leg'],
    ['MOS-A2403', 'B24-MOS-003', 'Hyderabad', 'Tata Chemicals', 'MoSi2 99.7% High-Temp Oxidation Resistant Coating', 'TBC Bond Coat Alt', '99.7%', '2030 degC', '&#8377;900 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'IIT-H MoSi2 oxid coat'],
    ['MOS-A2404', 'B24-MOS-004', 'Chennai', 'Bharat Forge', 'MoSi2 99.5% Aircraft Turbine Combustion Liner', 'Kaveri Engine CCG', '99.5%', '2030 degC', '&#8377;960 Cr', 'delivered', 'critical', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'GTRE MoSi2 liner'],
    ['MOS-A2405', 'B24-MOS-005', 'Kolkata', 'Shyam Chemicals', 'MoSi2 99.8% Thin-Film Microelectronics Resistor', 'CrSi2-MoSi2 TFR', '99.8%', '2030 degC', '&#8377;860 Cr', 'in-transit', 'high', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'BEL MoSi2 resistor'],
    ['MOS-A2406', 'B24-MOS-006', 'Noida', 'BHEL R&amp;D', 'MoSi2 99.6% Diesel Engine Glow Plug Igniter', 'Bosch Ceramic Glow', '99.6%', '2030 degC', '&#8377;840 Cr', 'delivered', 'medium', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'BHEL MoSi2 glow plug'],
    ['MOS-A2407', 'B24-MOS-007', 'Pune', 'Godrej Chemicals', 'MoSi2 99.4% Glass Melting Furnace Immersion Heater', 'Pt-MoSi2 Electrode', '99.4%', '2030 degC', '&#8377;880 Cr', 'in-transit', 'high', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'Asahi MoSi2 glass melt'],
    ['MOS-A2408', 'B24-MOS-008', 'Jaipur', 'Rajasthan Chemicals', 'MoSi2 99.3% Sintering Furnace Moly-Disilicide Boat', 'Powder Metallurgy', '99.3%', '2030 degC', '&#8377;800 Cr', 'delivered', 'high', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'BHEL MoSi2 boat'],
    ['MOS-A2409', 'B24-MOS-009', 'Guwahati', 'Assam Chemicals', 'MoSi2 99.9% Molten Aluminum Thermocouple Sheath', 'Type K MgO Sleeve', '99.9%', '2030 degC', '&#8377;900 Cr', 'in-transit', 'critical', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'IIT-G MoSi2 TC sheath'],
    ['MOS-A2410', 'B24-MOS-010', 'Ahmedabad', 'Gujarat Chemicals', 'MoSi2 99.5% Solar Thermal Receiver Coating', 'CSP Absorber Tube', '99.5%', '2030 degC', '&#8377;860 Cr', 'pending', 'high', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'NSE MoSi2 solar CSP'],
    ['MOS-A2411', 'B24-MOS-011', 'Lucknow', 'UP Chemicals', 'MoSi2 99.2% Pyrometer Calibration Blackbody Source', '1400 degC Cavity', '99.2%', '2030 degC', '&#8377;780 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'CSIR MoSi2 pyro'],
    ['MOS-A2412', 'B24-MOS-012', 'Visakhapatnam', 'Vizag Chemicals', 'MoSi2 99.92% Submarine Turbocharger Rotor Coating', 'SSK MAN B&amp;W T-C', '99.92%', '2030 degC', '&#8377;940 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK turbo coat'],
    ['MOS-A2413', 'B24-MOS-013', 'Balasore', 'DRDO TBRL', 'MoSi2 99.99% Hypersonic Scramjet Combustor Liner', 'Mach 8+ Scramjet', '99.99%', '2030 degC', '&#8377;1000 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO scramjet MoSi2'],
    ['MOS-A2414', 'B24-MOS-014', 'Bhilai', 'SAIL Chemicals', 'MoSi2 99.0% General High-Temp Heating Element', 'Process Chemical', '99.0%', '2030 degC', '&#8377;560 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL MoSi2 furnace'],
]

# --- Hafnium Carbide: HfC ---
# Prefix: hfc, Icon: Bolt, Color: #1e40af (blue-dark), MP 3958 degC, density 12.67 g/cm3
# HfC: highest melting point known (~3958 degC), hypersonic TPS leading-edge ceramic,
# rocket nozzle throat insert, nuclear reactor control rod, UHTC composite matrix,
# cutting tool cermet additive, arc evaporation cathode, fusion reactor first wall
hfc_records = [
    ['HFC-A2401', 'B24-HFC-001', 'Mumbai', 'MIDHANI', 'HfC 99.99% Hypersonic Leading-Edge UHTC', 'Mach 10+ TPS Tile', '99.99%', '3958 degC', '&#8377;1400 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'DRDO HSTDV HfC TPS'],
    ['HFC-A2402', 'B24-HFC-002', 'Bengaluru', 'DRDO DMRL', 'HfC 99.999% Rocket Nozzle Throat Insert', 'Scramjet UHTC', '99.999%', '3958 degC', '&#8377;1500 Cr', 'delivered', 'critical', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'ISRO HfC nozzle'],
    ['HFC-A2403', 'B24-HFC-003', 'Hyderabad', 'Tata Chemicals', 'HfC 99.9% UHTC Composite ZrB2-HfC Matrix', 'Ablative Heat Shield', '99.9%', '3958 degC', '&#8377;1360 Cr', 'in-transit', 'critical', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'DRDO HfC UHTC comp'],
    ['HFC-A2404', 'B24-HFC-004', 'Chennai', 'Bharat Forge', 'HfC 99.7% Fusion Reactor First-Wall Coating', 'ITER Blanket PFC', '99.7%', '3958 degC', '&#8377;1440 Cr', 'delivered', 'critical', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'IPRC HfC first wall'],
    ['HFC-A2405', 'B24-HFC-005', 'Kolkata', 'Shyam Chemicals', 'HfC 99.8% Nuclear Reactor Control Rod Alloy', 'HfC-TaC Nuclear', '99.8%', '3958 degC', '&#8377;1280 Cr', 'in-transit', 'high', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'BARC HfC ctrl rod'],
    ['HFC-A2406', 'B24-HFC-006', 'Noida', 'BHEL R&amp;D', 'HfC 99.5% Arc Evaporation Cathode Source', 'PVD Sputter Target', '99.5%', '3958 degC', '&#8377;1000 Cr', 'delivered', 'high', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'SSPL HfC arc cathode'],
    ['HFC-A2407', 'B24-HFC-007', 'Pune', 'Godrej Chemicals', 'HfC 99.4% Cemented Carbide Ultra-Hard Additive', 'WC-Co-HfC Cermet', '99.4%', '3958 degC', '&#8377;1120 Cr', 'in-transit', 'high', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'Sandvik HfC cermet'],
    ['HFC-A2408', 'B24-HFC-008', 'Jaipur', 'Rajasthan Chemicals', 'HfC 99.3% Electron Beam Welding Emitter', 'High-Temp Cathode', '99.3%', '3958 degC', '&#8377;960 Cr', 'delivered', 'medium', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'BHEL HfC EB weld'],
    ['HFC-A2409', 'B24-HFC-009', 'Guwahati', 'Assam Chemicals', 'HfC 99.99% Plasma Torch Electrode', '2000 degC Plasma Arc', '99.99%', '3958 degC', '&#8377;1200 Cr', 'in-transit', 'critical', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'IIT-G HfC plasma'],
    ['HFC-A2410', 'B24-HFC-010', 'Ahmedabad', 'Gujarat Chemicals', 'HfC 99.6% Thermoelectric Generator UHTC Leg', 'ZrB2-HfC SEG Hot', '99.6%', '3958 degC', '&#8377;1160 Cr', 'pending', 'critical', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'IISc HfC TEG'],
    ['HFC-A2411', 'B24-HFC-011', 'Lucknow', 'UP Chemicals', 'HfC 99.2% Ballistic Armor Ceramic Insert', 'Level IV NIJ Plate', '99.2%', '3958 degC', '&#8377;1080 Cr', 'delivered', 'high', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'DRDO HfC armor'],
    ['HFC-A2412', 'B24-HFC-012', 'Visakhapatnam', 'Vizag Chemicals', 'HfC 99.92% Submarine Reactor Pressure Vessel UHTC Liner', 'PWR Hot Leg Shield', '99.92%', '3958 degC', '&#8377;1400 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSBN UHTC liner'],
    ['HFC-A2413', 'B24-HFC-013', 'Balasore', 'DRDO TBRL', 'HfC 99.99% Hypersonic Glide Vehicle Nose Cap', 'Mach 15+ Reentry', '99.99%', '3958 degC', '&#8377;1600 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO HGV HfC nose'],
    ['HFC-A2414', 'B24-HFC-014', 'Bhilai', 'SAIL Chemicals', 'HfC 99.0% General UHTC Refractory Grade', 'Process Chemical', '99.0%', '3958 degC', '&#8377;800 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL HfC refractory'],
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


mos_config = {
    'prefix': 'mos', 'icon': 'TowerControl', 'color': '#9a3412',
    'title': 'Molybdenum Disilicide Logistics',
    'subtitle': 'MoSi2 furnace element &#8226; Thermoelectric generator &#8226; Oxidation coating &#8226; Scramjet liner supply chain',
    'fn_name': 'MolybdenumDisilicideLogisticsView',
}
with open('src/components/modules/molybdenum-disilicide-logistics-view.tsx', 'w') as f:
    f.write(gen_module(mos_records, mos_config))
print("Generated: molybdenum-disilicide-logistics-view.tsx")

hfc_config = {
    'prefix': 'hfc', 'icon': 'Bolt', 'color': '#1e40af',
    'title': 'Hafnium Carbide Logistics',
    'subtitle': 'HfC UHTC TPS &#8226; Rocket nozzle &#8226; Fusion first-wall &#8226; Hypersonic glide vehicle supply chain',
    'fn_name': 'HafniumCarbideLogisticsView',
}
with open('src/components/modules/hafnium-carbide-logistics-view.tsx', 'w') as f:
    f.write(gen_module(hfc_records, hfc_config))
print("Generated: hafnium-carbide-logistics-view.tsx")

for fname in ['src/components/modules/molybdenum-disilicide-logistics-view.tsx', 'src/components/modules/hafnium-carbide-logistics-view.tsx']:
    with open(fname, 'r') as f:
        c = f.read()
    rs = c[c.find('RECORDS = ['):c.find('];')]
    bad = re.findall(r"'[^']*'\s*:\s*'", rs)
    print(f"  {'WARNING: '+str(len(bad))+' typos' if bad else 'OK'}: {fname.split('/')[-1]}, Lines: {c.count(chr(10))+1}")
