#!/usr/bin/env python3
"""R474 Generator: Aluminum Gallium Nitride Logistics + Indium Gallium Arsenide Logistics"""
import re

TEMPLATE_PATH = 'src/components/modules/zinc-oxide-logistics-view.tsx'

# --- Aluminum Gallium Nitride: AlGaN ---
# Prefix: agn, Icon: LifeBuoy, Color: #0369a1 (sky-deep), MP >2100 degC (decomposition), density 6.15 g/cm3
# AlGaN: UV LED (265-365nm), 5G/6G HEMT power amplifier, solar-blind UV detector,
# power electronics converter, high-electron-mobility transistor
agn_records = [
    ['AGN-A2401', 'B24-AGN-001', 'Mumbai', 'MIDHANI', 'AlGaN 99.99% Deep-UV LED Epitaxial Wafer', '265 nm Sterilization', '99.99%', '2100 degC', '&#8377;940 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'BEL AlGaN DUV LED'],
    ['AGN-A2402', 'B24-AGN-002', 'Bengaluru', 'DRDO DMRL', 'AlGaN 99.999% 5G mmWave HEMT Power Amp', 'Ka-Band 100W PA', '99.999%', '2100 degC', '&#8377;960 Cr', 'delivered', 'critical', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'DRDO AlGaN 5G PA'],
    ['AGN-A2403', 'B24-AGN-003', 'Hyderabad', 'Tata Chemicals', 'AlGaN 99.95% Solar-Blind UV Photodetector', ' Missile Warning', '99.95%', '2100 degC', '&#8377;920 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'DRDO AlGaN MWS det'],
    ['AGN-A2404', 'B24-AGN-004', 'Chennai', 'Bharat Forge', 'AlGaN 99.9% EV Power Inverter Module', 'SiC/AlGaN EV Drive', '99.9%', '2100 degC', '&#8377;880 Cr', 'delivered', 'high', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'BHEL AlGaN inverter'],
    ['AGN-A2405', 'B24-AGN-005', 'Kolkata', 'Shyam Chemicals', 'AlGaN 99.7% Water Purification UV-C Source', '222 nm Far-UV-C', '99.7%', '2100 degC', '&#8377;820 Cr', 'in-transit', 'medium', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'Tata Water AlGaN UV'],
    ['AGN-A2406', 'B24-AGN-006', 'Noida', 'BHEL R&amp;D', 'AlGaN 99.98% Radar Solid-State T/R Module', 'AESA GaN-on-SiC', '99.98%', '2100 degC', '&#8377;940 Cr', 'delivered', 'critical', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'DRDO AlGaN AESA T/R'],
    ['AGN-A2407', 'B24-AGN-007', 'Pune', 'Godrej Chemicals', 'AlGaN 99.5% Industrial Power Supply SMPS', 'High-Freq Converter', '99.5%', '2100 degC', '&#8377;760 Cr', 'in-transit', 'medium', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'L&amp;T AlGaN SMPS'],
    ['AGN-A2408', 'B24-AGN-008', 'Jaipur', 'Rajasthan Chemicals', 'AlGaN 99.85% Satellite Solar Array Regulator', 'Rad-Hard Power Cond', '99.85%', '2100 degC', '&#8377;900 Cr', 'delivered', 'high', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'ISRO AlGaN power reg'],
    ['AGN-A2409', 'B24-AGN-009', 'Guwahati', 'Assam Chemicals', 'AlGaN 99.99% Wireless Charging Power Transistor', '15W GaN Charger', '99.99%', '2100 degC', '&#8377;840 Cr', 'in-transit', 'critical', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'IIT-G AlGaN wireless'],
    ['AGN-A2410', 'B24-AGN-010', 'Ahmedabad', 'Gujarat Chemicals', 'AlGaN 99.6% LiDAR VCSEL Driver Chip', '905 nm Auto LiDAR', '99.6%', '2100 degC', '&#8377;860 Cr', 'pending', 'high', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'BEL AlGaN LiDAR drv'],
    ['AGN-A2411', 'B24-AGN-011', 'Lucknow', 'UP Chemicals', 'AlGaN 99.4% Telecom Base Station Amplifier', 'Massive MIMO 64T', '99.4%', '2100 degC', '&#8377;800 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'Jio AlGaN MIMO PA'],
    ['AGN-A2412', 'B24-AGN-012', 'Visakhapatnam', 'Vizag Chemicals', 'AlGaN 99.92% Submarine Sonar Power Amp', 'Active Sonar Tx', '99.92%', '2100 degC', '&#8377;940 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK sonar PA'],
    ['AGN-A2413', 'B24-AGN-013', 'Balasore', 'DRDO TBRL', 'AlGaN 99.99% Hypersonic Plasma Comm Antenna', 'Mach 7+ RF Window', '99.99%', '2100 degC', '&#8377;960 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO HSTDV AlGaN ant'],
    ['AGN-A2414', 'B24-AGN-014', 'Bhilai', 'SAIL Chemicals', 'AlGaN 99.0% General Industrial Grade', 'Process Chemical', '99.0%', '2100 degC', '&#8377;540 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL AlGaN industrial'],
]

# --- Indium Gallium Arsenide: InGaAs ---
# Prefix: iga, Icon: BatteryCharging, Color: #7e22ce (purple), MP ~942 degC, density 5.67 g/cm3
# InGaAs: SWIR imaging (0.9-1.7um), fiber-optic photodetector, night vision camera,
# telecom laser diode receiver, satellite Earth observation
iga_records = [
    ['IGA-A2401', 'B24-IGA-001', 'Mumbai', 'MIDHANI', 'InGaAs 99.999% SWIR Imaging FPA Camera', '0.9-1.7 um Cooled', '99.999%', '942 degC', '&#8377;960 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'DRDO InGaAs SWIR cam'],
    ['IGA-A2402', 'B24-IGA-002', 'Bengaluru', 'DRDO DMRL', 'InGaAs 99.99% Telecom PIN Photodetector', '10-40 Gbps Rx', '99.99%', '942 degC', '&#8377;940 Cr', 'delivered', 'critical', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'BEL InGaAs PIN Rx'],
    ['IGA-A2403', 'B24-IGA-003', 'Hyderabad', 'Tata Chemicals', 'InGaAs 99.95% Night Vision Uncooled Camera', 'Passive NIR Goggle', '99.95%', '942 degC', '&#8377;920 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'BEL Optronic InGaAs NV'],
    ['IGA-A2404', 'B24-IGA-004', 'Chennai', 'Bharat Forge', 'InGaAs 99.9% Satellite Earth Observation Sensor', 'Hyperspectral Imager', '99.9%', '942 degC', '&#8377;900 Cr', 'delivered', 'high', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'ISRO InGaAs hyper'],
    ['IGA-A2405', 'B24-IGA-005', 'Kolkata', 'Shyam Chemicals', 'InGaAs 99.7% Fiber Amplifier Pump Laser Diode', '980 nm EDFA Pump', '99.7%', '942 degC', '&#8377;840 Cr', 'in-transit', 'medium', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'Sterlite InGaAs pump'],
    ['IGA-A2406', 'B24-IGA-006', 'Noida', 'BHEL R&amp;D', 'InGaAs 99.99% Missile Seeker IR Homing Head', 'InSb/InGaAs Dual-Band', '99.99%', '942 degC', '&#8377;960 Cr', 'delivered', 'critical', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'DRDO Astra InGaAs seeker'],
    ['IGA-A2407', 'B24-IGA-007', 'Pune', 'Godrej Chemicals', 'InGaAs 99.5% Industrial Machine Vision Camera', 'NIR Inspection', '99.5%', '942 degC', '&#8377;760 Cr', 'in-transit', 'medium', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'Bajaj InGaAs MV cam'],
    ['IGA-A2408', 'B24-IGA-008', 'Jaipur', 'Rajasthan Chemicals', 'InGaAs 99.85% Quantum Well Laser Structure', 'DFB 1550 nm', '99.85%', '942 degC', '&#8377;900 Cr', 'delivered', 'high', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'BEL InGaAs DFB laser'],
    ['IGA-A2409', 'B24-IGA-009', 'Guwahati', 'Assam Chemicals', 'InGaAs 99.99% Single Photon Avalanche Detector', 'Quantum Key Dist', '99.99%', '942 degC', '&#8377;940 Cr', 'in-transit', 'critical', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'IIT-G InGaAs SPAD'],
    ['IGA-A2410', 'B24-IGA-010', 'Ahmedabad', 'Gujarat Chemicals', 'InGaAs 99.6% LiDAR APD Receiver Array', 'Auto ADAS Sensor', '99.6%', '942 degC', '&#8377;860 Cr', 'pending', 'high', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'Bosch InGaAs LiDAR'],
    ['IGA-A2411', 'B24-IGA-011', 'Lucknow', 'UP Chemicals', 'InGaAs 99.4% Medical Pulse Oximeter Sensor', 'SpO2 NIR LED Det', '99.4%', '942 degC', '&#8377;740 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'BEL InGaAs SpO2'],
    ['IGA-A2412', 'B24-IGA-012', 'Visakhapatnam', 'Vizag Chemicals', 'InGaAs 99.92% Submarine Periscope Thermal Cam', 'EO Mast SWIR', '99.92%', '942 degC', '&#8377;940 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK periscope'],
    ['IGA-A2413', 'B24-IGA-013', 'Balasore', 'DRDO TBRL', 'InGaAs 99.99% Hypersonic Surface Temperature Array', 'Mach 7+ Pyro FPA', '99.99%', '942 degC', '&#8377;960 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO HSTDV InGaAs'],
    ['IGA-A2414', 'B24-IGA-014', 'Bhilai', 'SAIL Chemicals', 'InGaAs 99.0% General Industrial Grade', 'Process Chemical', '99.0%', '942 degC', '&#8377;540 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL InGaAs industrial'],
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


agn_config = {
    'prefix': 'agn', 'icon': 'LifeBuoy', 'color': '#0369a1',
    'title': 'Aluminum Gallium Nitride Logistics',
    'subtitle': 'AlGaN deep-UV LED &#8226; 5G HEMT power amp &#8226; Solar-blind UV detector &#8226; Power electronics supply chain',
    'fn_name': 'AluminumGalliumNitrideLogisticsView',
}
with open('src/components/modules/aluminum-gallium-nitride-logistics-view.tsx', 'w') as f:
    f.write(gen_module(agn_records, agn_config))
print("Generated: aluminum-gallium-nitride-logistics-view.tsx")

iga_config = {
    'prefix': 'iga', 'icon': 'BatteryCharging', 'color': '#7e22ce',
    'title': 'Indium Gallium Arsenide Logistics',
    'subtitle': 'InGaAs SWIR imaging &#8226; Fiber-optic photodetector &#8226; Night vision &#8226; Telecom receiver supply chain',
    'fn_name': 'IndiumGalliumArsenideLogisticsView',
}
with open('src/components/modules/indium-gallium-arsenide-logistics-view.tsx', 'w') as f:
    f.write(gen_module(iga_records, iga_config))
print("Generated: indium-gallium-arsenide-logistics-view.tsx")

for fname in ['src/components/modules/aluminum-gallium-nitride-logistics-view.tsx', 'src/components/modules/indium-gallium-arsenide-logistics-view.tsx']:
    with open(fname, 'r') as f:
        c = f.read()
    rs = c[c.find('RECORDS = ['):c.find('];')]
    bad = re.findall(r"'[^']*'\s*:\s*'", rs)
    print(f"  {'WARNING: '+str(len(bad))+' typos' if bad else 'OK'}: {fname.split('/')[-1]}, Lines: {c.count(chr(10))+1}")
