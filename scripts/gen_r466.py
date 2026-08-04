#!/usr/bin/env python3
"""R466 Generator: Rhenium Metal Logistics + Indium Tin Oxide Logistics"""
import re

TEMPLATE_PATH = 'src/components/modules/zinc-oxide-logistics-view.tsx'

# --- Rhenium Metal: Re ---
# Prefix: rem, Icon: Languages, Color: #1e3a5f (navy-steel), MP 3186 degC, density 21.02 g/cm3
rem_records = [
    ['REM-A2401', 'B24-REM-001', 'Mumbai', 'MIDHANI', 'Re 99.9% Single Crystal Turbine Blade', 'Fighter Jet Engine', '99.9%', '3186 degC', '&#8377;960 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'HAL Tejas Re turbine blade'],
    ['REM-A2402', 'B24-REM-002', 'Bengaluru', 'DRDO DMRL', 'Re 99.95% Superalloy Nozzle Guide Vane', 'Gas Turbine Hot Sec', '99.95%', '3186 degC', '&#8377;980 Cr', 'delivered', 'critical', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'GE Aviation Re superalloy'],
    ['REM-A2403', 'B24-REM-003', 'Hyderabad', 'Tata Chemicals', 'Re 99.7% Rocket Combustion Chamber', 'Liquid Propulsion', '99.7%', '3186 degC', '&#8377;940 Cr', 'in-transit', 'critical', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'ISRO PSLV Re chamber'],
    ['REM-A2404', 'B24-REM-004', 'Chennai', 'Bharat Forge', 'Re 99.85% Catalyst Pt-Re Reforming', 'Petroleum Refinery', '99.85%', '3186 degC', '&#8377;900 Cr', 'delivered', 'high', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'HPCL Visakh Pt-Re reform'],
    ['REM-A2405', 'B24-REM-005', 'Kolkata', 'Shyam Chemicals', 'Re 99.3% Filament Incandescent Lamp', 'Specialty Lighting', '99.3%', '3186 degC', '&#8377;760 Cr', 'in-transit', 'medium', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'Surya Roshni Re filament'],
    ['REM-A2406', 'B24-REM-006', 'Noida', 'BHEL R&amp;D', 'Re 99.8% Gas Turbine Combustor Liner', 'Power Generation', '99.8%', '3186 degC', '&#8377;920 Cr', 'delivered', 'critical', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'BHEL GT Re combustor'],
    ['REM-A2407', 'B24-REM-007', 'Pune', 'Godrej Chemicals', 'Re 99.0% Electrical Contact Alloy', 'Spark Plug Erosion', '99.0%', '3186 degC', '&#8377;780 Cr', 'in-transit', 'medium', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'Mico Bosch Re contact'],
    ['REM-A2408', 'B24-REM-008', 'Jaipur', 'Rajasthan Chemicals', 'Re 99.6% Warship Gas Turbine Blade', 'Marine Propulsion', '99.6%', '3186 degC', '&#8377;940 Cr', 'delivered', 'critical', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'GRSE LM2500 Re blade'],
    ['REM-A2409', 'B24-REM-009', 'Guwahati', 'Assam Chemicals', 'Re 99.92% Thermocouple Pt-Re Element', 'Ultra-High Temp', '99.92%', '3186 degC', '&#8377;900 Cr', 'in-transit', 'high', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'IISc Pt-Re thermocouple'],
    ['REM-A2410', 'B24-REM-010', 'Ahmedabad', 'Gujarat Chemicals', 'Re 99.4% X-Ray Tube Target Anode', 'Medical Imaging', '99.4%', '3186 degC', '&#8377;860 Cr', 'pending', 'high', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'Wipro GE Re X-ray target'],
    ['REM-A2411', 'B24-REM-011', 'Lucknow', 'UP Chemicals', 'Re 99.8% Fcc Catalyst Re-Pt Regeneration', 'Refinery Dewax', '99.8%', '3186 degC', '&#8377;880 Cr', 'delivered', 'high', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'IOCL Mathura Re fcc cat'],
    ['REM-A2412', 'B24-REM-012', 'Visakhapatnam', 'Vizag Chemicals', 'Re 99.85% Submarine Nuclear Reactor Shield', 'Naval Nuke Contain', '99.85%', '3186 degC', '&#8377;960 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSBN Re shield'],
    ['REM-A2413', 'B24-REM-013', 'Balasore', 'DRDO TBRL', 'Re 99.95% Hypersonic Scramjet Nozzle', 'Mach 7+ Propulsion', '99.95%', '3186 degC', '&#8377;980 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO scramjet Re nozzle'],
    ['REM-A2414', 'B24-REM-014', 'Bhilai', 'SAIL Chemicals', 'Re 98.0% General Industrial Grade', 'Process Alloy', '98.0%', '3186 degC', '&#8377;580 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL Re alloy additive'],
]

# --- Indium Tin Oxide: ITO ---
# Prefix: ito, Icon: Telescope, Color: #0e7490 (cyan-dark), MP 1800 degC (decomp), density 7.15 g/cm3
ito_records = [
    ['ITO-A2401', 'B24-ITO-001', 'Mumbai', 'MIDHANI', 'ITO 99.9% Touch Panel Transparent Conductor', 'Smartphone Touch', '99.9%', '7.15 g/cm3', '&#8377;880 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'Dixon ITO touch panel'],
    ['ITO-A2402', 'B24-ITO-002', 'Bengaluru', 'DRDO DMRL', 'ITO 99.95% Fighter HUD Display Coating', 'Head-Up Display', '99.95%', '7.15 g/cm3', '&#8377;960 Cr', 'delivered', 'critical', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'HAL Tejas HUD ITO coat'],
    ['ITO-A2403', 'B24-ITO-003', 'Hyderabad', 'Tata Chemicals', 'ITO 99.7% LCD Panel Electrode Film', 'TV/Monitor TFT', '99.7%', '7.15 g/cm3', '&#8377;840 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'Dixon ITO LCD electrode'],
    ['ITO-A2404', 'B24-ITO-004', 'Chennai', 'Bharat Forge', 'ITO 99.85% Solar Cell TCO Front Contact', 'Thin-Film PV', '99.85%', '7.15 g/cm3', '&#8377;900 Cr', 'delivered', 'critical', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'Adani Solar ITO TCO'],
    ['ITO-A2405', 'B24-ITO-005', 'Kolkata', 'Shyam Chemicals', 'ITO 99.3% Electromagnetic Shield Window', 'Defense TEMPEST', '99.3%', '7.15 g/cm3', '&#8377;820 Cr', 'in-transit', 'high', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'BEL EMI ITO shield'],
    ['ITO-A2406', 'B24-ITO-006', 'Noida', 'BHEL R&amp;D', 'ITO 99.8% Submarine Periscope Display', 'Electro-Optic Mast', '99.8%', '7.15 g/cm3', '&#8377;940 Cr', 'delivered', 'critical', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'Mazagon Dock ITO display'],
    ['ITO-A2407', 'B24-ITO-007', 'Pune', 'Godrej Chemicals', 'ITO 99.0% Defogging Aircraft Windshield', 'Anti-Ice Heater', '99.0%', '7.15 g/cm3', '&#8377;780 Cr', 'in-transit', 'medium', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'HAL ITO windshield heat'],
    ['ITO-A2408', 'B24-ITO-008', 'Jaipur', 'Rajasthan Chemicals', 'ITO 99.6% Warship Bridge Touch Console', 'Naval CIC Display', '99.6%', '7.15 g/cm3', '&#8377;900 Cr', 'delivered', 'high', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'GRSE ITO bridge console'],
    ['ITO-A2409', 'B24-ITO-009', 'Guwahati', 'Assam Chemicals', 'ITO 99.92% OLED Anode Transparent', 'Flexible Display', '99.92%', '7.15 g/cm3', '&#8377;940 Cr', 'in-transit', 'critical', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'IIT-G ITO OLED anode'],
    ['ITO-A2410', 'B24-ITO-010', 'Ahmedabad', 'Gujarat Chemicals', 'ITO 99.4% Smart Glass Electrochromic Layer', 'Auto/Architectural', '99.4%', '7.15 g/cm3', '&#8377;800 Cr', 'pending', 'medium', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'Saint-Gobain ITO smart glass'],
    ['ITO-A2411', 'B24-ITO-011', 'Lucknow', 'UP Chemicals', 'ITO 99.8% Anti-Static Coating Packaging', 'ESD Safe Film', '99.8%', '7.15 g/cm3', '&#8377;760 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'Flex ESD ITO packaging'],
    ['ITO-A2412', 'B24-ITO-012', 'Visakhapatnam', 'Vizag Chemicals', 'ITO 99.85% Submarine Sonar Display Panel', 'Acoustic Operator', '99.85%', '7.15 g/cm3', '&#8377;960 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK sonar disp'],
    ['ITO-A2413', 'B24-ITO-013', 'Balasore', 'DRDO TBRL', 'ITO 99.95% Hypersonic IR Seeker Window', 'Missile Homing', '99.95%', '7.15 g/cm3', '&#8377;940 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO Astra ITO IR dom'],
    ['ITO-A2414', 'B24-ITO-014', 'Bhilai', 'SAIL Chemicals', 'ITO 98.0% General Industrial Grade', 'Process Chemical', '98.0%', '7.15 g/cm3', '&#8377;560 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL ITO coating batch'],
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


# --- Generate Rhenium Metal ---
rem_config = {
    'prefix': 'rem', 'icon': 'Languages', 'color': '#1e3a5f',
    'title': 'Rhenium Metal Logistics',
    'subtitle': 'Re turbine blade &#8226; Superalloy nozzle &#8226; Submarine reactor shield &#8226; Hypersonic scramjet supply chain',
    'fn_name': 'RheniumMetalLogisticsView',
}
with open('src/components/modules/rhenium-metal-logistics-view.tsx', 'w') as f:
    f.write(gen_module(rem_records, rem_config))
print("Generated: rhenium-metal-logistics-view.tsx")

# --- Generate Indium Tin Oxide ---
ito_config = {
    'prefix': 'ito', 'icon': 'Telescope', 'color': '#0e7490',
    'title': 'Indium Tin Oxide Logistics',
    'subtitle': 'ITO touch panel &#8226; Fighter HUD &#8226; Solar TCO &#8226; Submarine periscope display supply chain',
    'fn_name': 'IndiumTinOxideLogisticsView',
}
with open('src/components/modules/indium-tin-oxide-logistics-view.tsx', 'w') as f:
    f.write(gen_module(ito_records, ito_config))
print("Generated: indium-tin-oxide-logistics-view.tsx")

# --- Verify colon typo ---
for fname in ['src/components/modules/rhenium-metal-logistics-view.tsx', 'src/components/modules/indium-tin-oxide-logistics-view.tsx']:
    with open(fname, 'r') as f:
        c = f.read()
    rs = c[c.find('RECORDS = ['):c.find('];')]
    bad = re.findall(r"'[^']*'\s*:\s*'", rs)
    print(f"  {'WARNING: '+str(len(bad))+' typos' if bad else 'OK'}: {fname.split('/')[-1]}")
    lines = c.count('\n') + 1
    print(f"  Lines: {lines}")
