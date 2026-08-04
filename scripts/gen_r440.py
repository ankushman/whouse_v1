#!/usr/bin/env python3
"""gen_r440.py — R440: Aluminum Oxide (Al2O3) + Vanadium Oxide (V2O5) logistics modules.
Clone-and-customize from zinc-oxide template."""
import re

TEMPLATE = 'src/components/modules/zinc-oxide-logistics-view.tsx'

MODULES = [
  {
    'slug': 'aluminum-oxide',
    'title': 'Aluminum Oxide',
    'formula': 'Al2O3',
    'icon': 'Mountain',
    'color': '#2563eb',       # blue — sapphire/ceramic
    'prefix': 'ALO',
    'subtitle': 'Al2O3 sapphire substrate &#8226; Abrasive &#8226; Refractory &#8226; Ceramic insulator supply chain',
    'var': 'aluminum_oxide',
    'func': 'Aluminum_OxideLogisticsView',
    'records': [
      ['ALO-A2401','B24-ALO-001','Mumbai','MIDHANI','Al2O3 99.99% Sapphire Substrate','LED Wafer','99.99%','2072 degC','&#8377;960 Cr','in-transit','critical','Mumbai','Pune','2024-07-15','3','West',''],
      ['ALO-A2402','B24-ALO-002','Bengaluru','DRDO DMRL','Al2O3 99.9% Ceramic Armor','Blast Plate','99.9%','2072 degC','&#8377;940 Cr','delivered','high','Bengaluru','Chennai','2024-07-10','2','South',''],
      ['ALO-A2403','B24-ALO-003','Hyderabad','Tata Advanced Materials','Al2O3 99.7% Spark Plug','Ignition Insul','99.7%','2072 degC','&#8377;800 Cr','in-transit','high','Hyderabad','Hyderabad','2024-07-18','1','South',''],
      ['ALO-A2404','B24-ALO-004','Chennai','Bharat Forge','Al2O3 99.0% Grinding Wheel','Abrasive Disc','99.0%','2072 degC','&#8377;720 Cr','delivered','medium','Chennai','Chennai','2024-07-08','0','South',''],
      ['ALO-A2405','B24-ALO-005','Kolkata','Shyam Chemicals','Al2O3 99.8% Refractory Brick','Steel Furnace','99.8%','2072 degC','&#8377;840 Cr','in-transit','high','Kolkata','Visakhapatnam','2024-07-20','5','East',''],
      ['ALO-A2406','B24-ALO-006','Noida','BHEL R&amp;D','Al2O3 99.3% High-Voltage Insul','Transmission','99.3%','2065 degC','&#8377;860 Cr','delivered','high','Noida','Noida','2024-07-12','0','North',''],
      ['ALO-A2407','B24-ALO-007','Pune','Godrej Chemicals','Al2O3 99.6% Biomedical','Hip Implant','99.6%','2072 degC','&#8377;880 Cr','in-transit','critical','Pune','Mumbai','2024-07-16','2','West',''],
      ['ALO-A2408','B24-ALO-008','Jaipur','Rajasthan Chemicals','Al2O3 98.5% Water Filter','Membrane','98.5%','2050 degC','&#8377;640 Cr','delivered','low','Jaipur','Jaipur','2024-07-09','1','North',''],
      ['ALO-A2409','B24-ALO-009','Guwahati','Assam Chemicals','Al2O3 99.4% Sandpaper','Coated Abrasive','99.4%','2068 degC','&#8377;720 Cr','in-transit','high','Guwahati','Kolkata','2024-07-22','4','East',''],
      ['ALO-A2410','B24-ALO-010','Ahmedabad','Gujarat Chemicals','Al2O3 99.95% Submarine Window','Pressure Dome','99.95%','2072 degC','&#8377;960 Cr','pending','critical','Ahmedabad','Bengaluru','2024-07-25','3','West',''],
      ['ALO-A2411','B24-ALO-011','Lucknow','UP Chemicals','Al2O3 99.2% Cutting Tool','WC Insert','99.2%','2060 degC','&#8377;800 Cr','delivered','medium','Lucknow','Lucknow','2024-07-11','0','North',''],
      ['ALO-A2412','B24-ALO-012','Visakhapatnam','Vizag Chemicals','Al2O3 99.8% Warship Armor','Naval Ballistic','99.8%','2072 degC','&#8377;940 Cr','delayed','critical','Visakhapatnam','Visakhapatnam','2024-07-06','28','South',''],
      ['ALO-A2413','B24-ALO-013','Balasore','DRDO TBRL','Al2O3 99.6% Rocket Nozzle','Throat Insert','99.6%','2070 degC','&#8377;920 Cr','in-transit','critical','Balasore','Chandipur','2024-07-19','2','East',''],
      ['ALO-A2414','B24-ALO-014','Bhilai','SAIL Chemicals','Al2O3 97% General Chemical','Smelter Grade','97.0%','2040 degC','&#8377;640 Cr','delivered','low','Bhilai','Bhilai','2024-07-05','0','East',''],
    ],
  },
  {
    'slug': 'vanadium-oxide',
    'title': 'Vanadium Oxide',
    'formula': 'V2O5',
    'icon': 'Rocket',
    'color': '#d97706',       # amber — catalyst/energy
    'prefix': 'VNO',
    'subtitle': 'V2O5 sulfur catalyst &#8226; VRFB battery &#8226; Thermochromic &#8226; Smart glass supply chain',
    'var': 'vanadium_oxide',
    'func': 'Vanadium_OxideLogisticsView',
    'records': [
      ['VNO-A2401','B24-VNO-001','Mumbai','MIDHANI','V2O5 99.9% Sulfuric Acid Cat','Contact Process','99.9%','690 degC','&#8377;920 Cr','in-transit','critical','Mumbai','Pune','2024-07-15','3','West',''],
      ['VNO-A2402','B24-VNO-002','Bengaluru','DRDO DMRL','V2O5 99.7% VRFB Battery','Grid Storage','99.7%','690 degC','&#8377;940 Cr','delivered','high','Bengaluru','Chennai','2024-07-10','2','South',''],
      ['VNO-A2403','B24-VNO-003','Hyderabad','Tata Steel','V2O5 99.5% Steel Alloy','HSIA Strengthen','99.5%','690 degC','&#8377;800 Cr','in-transit','high','Hyderabad','Hyderabad','2024-07-18','1','South',''],
      ['VNO-A2404','B24-VNO-004','Chennai','Bharat Forge','V2O5 99.0% Ceramic Glaze','Yellow Pigment','99.0%','690 degC','&#8377;720 Cr','delivered','medium','Chennai','Chennai','2024-07-08','0','South',''],
      ['VNO-A2405','B24-VNO-005','Kolkata','Shyam Chemicals','V2O5 99.8% Phthalic Anhydride','Petrochemical','99.8%','690 degC','&#8377;840 Cr','in-transit','high','Kolkata','Visakhapatnam','2024-07-20','5','East',''],
      ['VNO-A2406','B24-VNO-006','Noida','BHEL R&amp;D','V2O5 99.3% Thermochromic','Smart Glass','99.3%','685 degC','&#8377;860 Cr','delivered','high','Noida','Noida','2024-07-12','0','North',''],
      ['VNO-A2407','B24-VNO-007','Pune','Godrej Chemicals','V2O5 99.6% Maleic Anhydride','Catalyst','99.6%','690 degC','&#8377;800 Cr','in-transit','critical','Pune','Mumbai','2024-07-16','2','West',''],
      ['VNO-A2408','B24-VNO-008','Jaipur','Rajasthan Chemicals','V2O5 98.5% Glass UV Block','Optical Coat','98.5%','675 degC','&#8377;640 Cr','delivered','low','Jaipur','Jaipur','2024-07-09','1','North',''],
      ['VNO-A2409','B24-VNO-009','Guwahati','Assam Chemicals','V2O5 99.4% Lithium Battery','Li-V Cathode','99.4%','688 degC','&#8377;880 Cr','in-transit','high','Guwahati','Kolkata','2024-07-22','4','East',''],
      ['VNO-A2410','B24-VNO-010','Ahmedabad','Gujarat Chemicals','V2O5 99.95% Submarine Battery','VRFB Backup','99.95%','690 degC','&#8377;960 Cr','pending','critical','Ahmedabad','Bengaluru','2024-07-25','3','West',''],
      ['VNO-A2411','B24-VNO-011','Lucknow','UP Chemicals','V2O5 99.2% Denox Catalyst','SCR Exhaust','99.2%','682 degC','&#8377;760 Cr','delivered','medium','Lucknow','Lucknow','2024-07-11','0','North',''],
      ['VNO-A2412','B24-VNO-012','Visakhapatnam','Vizag Chemicals','V2O5 99.8% Warship Battery','Naval VRFB','99.8%','690 degC','&#8377;940 Cr','delayed','critical','Visakhapatnam','Visakhapatnam','2024-07-06','28','South',''],
      ['VNO-A2413','B24-VNO-013','Balasore','DRDO TBRL','V2O5 99.6% Missile Fuel Cat','Ramjet Boost','99.6%','685 degC','&#8377;900 Cr','in-transit','critical','Balasore','Chandipur','2024-07-19','2','East',''],
      ['VNO-A2414','B24-VNO-014','Bhilai','SAIL Chemicals','V2O5 97% General Chemical','Alloy Add','97.0%','670 degC','&#8377;640 Cr','delivered','low','Bhilai','Bhilai','2024-07-05','0','East',''],
    ],
  },
]

def fmt_record(r):
  parts = [f"'{v}'" for v in r]
  return f"  [{', '.join(parts)}],"

def generate_module(mod):
  slug = mod['slug']
  out = f"src/components/modules/{slug}-logistics-view.tsx"

  with open(TEMPLATE) as f:
    content = f.read()

  content = re.sub(r"import \{ \w+ \} from 'lucide-react'", f"import {{ {mod['icon']} }} from 'lucide-react'", content)
  content = re.sub(r'const \w+_RECORDS', f"const {mod['var']}_RECORDS", content)

  rec_block = '\n'.join(fmt_record(r) for r in mod['records'])
  content = re.sub(
    r"const \w+_RECORDS = \[.*?\];",
    f"const {mod['var']}_RECORDS = [\n{rec_block}\n];",
    content, flags=re.DOTALL,
  )

  content = re.sub(r'export default function \w+', f"export default function {mod['func']}", content)
  content = re.sub(r'return \w+_RECORDS\.filter', f"return {mod['var']}_RECORDS.filter", content)
  content = re.sub(r'<\w+ className="w-5 h-5"', f"<{mod['icon']} className=\"w-5 h-5\"", content)

  content = re.sub(r"color: '[^']+'", f"color: '{mod['color']}'", content)
  content = re.sub(r"color: '[^']+'", f"color: '{mod['color']}'", content)
  content = re.sub(r"backgroundColor: '[^']+'", f"backgroundColor: '{mod['color']}22'", content)

  content = re.sub(r'<h2 className="text-xl font-bold">[^<]+</h2>', f'<h2 className="text-xl font-bold">{mod["title"]} Logistics</h2>', content)
  content = re.sub(r'<p className="text-sm text-gray-400">[^<]+</p>', f'<p className="text-sm text-gray-400">{mod["subtitle"]}</p>', content)

  with open(out, 'w') as f:
    f.write(content)
  print(f"Generated {out}")

if __name__ == '__main__':
  for mod in MODULES:
    generate_module(mod)
  print("R440 generation complete.")
