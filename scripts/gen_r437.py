#!/usr/bin/env python3
"""gen_r437.py — R437: Copper Oxide (CuO/Cu2O) + Manganese Oxide (MnO2) logistics modules.
Clone-and-customize from zinc-oxide template."""
import re

TEMPLATE = 'src/components/modules/zinc-oxide-logistics-view.tsx'

MODULES = [
  {
    'slug': 'copper-oxide',
    'title': 'Copper Oxide',
    'formula': 'CuO',
    'icon': 'CircuitBoard',
    'color': '#ea580c',       # orange — copper/electronics
    'prefix': 'CUO',
    'subtitle': 'CuO semiconductor &#8226; Antifouling paint &#8226; Battery cathode &#8226; PCB etching supply chain',
    'var': 'copper_oxide',
    'func': 'Copper_OxideLogisticsView',
    'records': [
      ['CUO-A2401','B24-CUO-001','Mumbai','MIDHANI','CuO 99.9% Semiconductor','p-Type Thin Film','99.9%','1446 degC','&#8377;900 Cr','in-transit','critical','Mumbai','Pune','2024-07-15','3','West',''],
      ['CUO-A2402','B24-CUO-002','Bengaluru','DRDO DMRL','CuO 99.7% Superconductor','YBCO Precursor','99.7%','1446 degC','&#8377;920 Cr','delivered','high','Bengaluru','Chennai','2024-07-10','2','South',''],
      ['CUO-A2403','B24-CUO-003','Hyderabad','Hindalco Industries','Cu2O 99.5% Antifouling','Ship Hull Paint','99.5%','1235 degC','&#8377;760 Cr','in-transit','high','Hyderabad','Hyderabad','2024-07-18','1','South',''],
      ['CUO-A2404','B24-CUO-004','Chennai','Sterlite Copper','CuO 99.0% PCB Etchant','Ferric Chloride','99.0%','1446 degC','&#8377;720 Cr','delivered','medium','Chennai','Chennai','2024-07-08','0','South',''],
      ['CUO-A2405','B24-CUO-005','Kolkata','Shyam Chemicals','CuO 99.8% Battery Cathode','Li-Ion Additive','99.8%','1446 degC','&#8377;840 Cr','in-transit','high','Kolkata','Visakhapatnam','2024-07-20','5','East',''],
      ['CUO-A2406','B24-CUO-006','Noida','BHEL R&amp;D','CuO 99.3% Gas Sensor','H2S Detect','99.3%','1440 degC','&#8377;800 Cr','delivered','high','Noida','Noida','2024-07-12','0','North',''],
      ['CUO-A2407','B24-CUO-007','Pune','Godrej Chemicals','CuO 99.6% Pigment','Ceramic Glaze','99.6%','1446 degC','&#8377;880 Cr','in-transit','critical','Pune','Mumbai','2024-07-16','2','West',''],
      ['CUO-A2408','B24-CUO-008','Jaipur','Rajasthan Chemicals','CuO 98.5% Fungicide','Agricultural','98.5%','1420 degC','&#8377;640 Cr','delivered','low','Jaipur','Jaipur','2024-07-09','1','North',''],
      ['CUO-A2409','B24-CUO-009','Guwahati','Assam Chemicals','CuO 99.4% Thermoelectric','Seebeck Module','99.4%','1442 degC','&#8377;860 Cr','in-transit','high','Guwahati','Kolkata','2024-07-22','4','East',''],
      ['CUO-A2410','B24-CUO-010','Ahmedabad','Gujarat Chemicals','CuO 99.95% Submarine Cable','Anti-Fouling Coat','99.95%','1446 degC','&#8377;940 Cr','pending','critical','Ahmedabad','Bengaluru','2024-07-25','3','West',''],
      ['CUO-A2411','B24-CUO-011','Lucknow','UP Chemicals','CuO 99.2% Catalyst','CO Oxidation','99.2%','1438 degC','&#8377;720 Cr','delivered','medium','Lucknow','Lucknow','2024-07-11','0','North',''],
      ['CUO-A2412','B24-CUO-012','Visakhapatnam','Vizag Chemicals','CuO 99.8% Warship Hull','Navy Antifoul','99.8%','1446 degC','&#8377;940 Cr','delayed','critical','Visakhapatnam','Visakhapatnam','2024-07-06','28','South',''],
      ['CUO-A2413','B24-CUO-013','Balasore','DRDO TBRL','CuO 99.6% Rocket Igniter','Solid Propellant','99.6%','1440 degC','&#8377;880 Cr','in-transit','critical','Balasore','Chandipur','2024-07-19','2','East',''],
      ['CUO-A2414','B24-CUO-014','Bhilai','SAIL Chemicals','CuO 97% General Chemical','Alloy Smelt','97.0%','1400 degC','&#8377;640 Cr','delivered','low','Bhilai','Bhilai','2024-07-05','0','East',''],
    ],
  },
  {
    'slug': 'manganese-oxide',
    'title': 'Manganese Oxide',
    'formula': 'MnO2',
    'icon': 'Flame',
    'color': '#0d9488',       # teal — battery/catalyst
    'prefix': 'MNO',
    'subtitle': 'MnO2 battery cathode &#8226; Water purification &#8226; Ferrite &#8226; Alloy supply chain',
    'var': 'manganese_oxide',
    'func': 'Manganese_OxideLogisticsView',
    'records': [
      ['MNO-A2401','B24-MNO-001','Mumbai','MIDHANI','MnO2 99.9% Battery Cathode','Li-MnO2 Primary','99.9%','535 degC','&#8377;900 Cr','in-transit','critical','Mumbai','Pune','2024-07-15','3','West',''],
      ['MNO-A2402','B24-MNO-002','Bengaluru','DRDO DMRL','MnO2 99.7% Ferrite Core','Soft Mn-Zn','99.7%','535 degC','&#8377;760 Cr','delivered','high','Bengaluru','Chennai','2024-07-10','2','South',''],
      ['MNO-A2403','B24-MNO-003','Hyderabad','Tata Steel','MnO2 99.5% Water Purify','Potable Filter','99.5%','535 degC','&#8377;720 Cr','in-transit','high','Hyderabad','Hyderabad','2024-07-18','1','South',''],
      ['MNO-A2404','B24-MNO-004','Chennai','MOIL','MnO2 99.0% Steel Alloy','Desulfurize','99.0%','535 degC','&#8377;800 Cr','delivered','medium','Chennai','Chennai','2024-07-08','0','South',''],
      ['MNO-A2405','B24-MNO-005','Kolkata','Shyam Chemicals','MnO2 99.8% Dry Cell','Alkaline Battery','99.8%','535 degC','&#8377;840 Cr','in-transit','high','Kolkata','Visakhapatnam','2024-07-20','5','East',''],
      ['MNO-A2406','B24-MNO-006','Noida','BHEL R&amp;D','MnO2 99.3% Glass Decolor','UV Stabilize','99.3%','530 degC','&#8377;760 Cr','delivered','high','Noida','Noida','2024-07-12','0','North',''],
      ['MNO-A2407','B24-MNO-007','Pune','Godrej Chemicals','MnO2 99.6% Catalyst','Ozone Decompose','99.6%','535 degC','&#8377;880 Cr','in-transit','critical','Pune','Mumbai','2024-07-16','2','West',''],
      ['MNO-A2408','B24-MNO-008','Jaipur','Rajasthan Chemicals','MnO2 98.5% Ceramic Pigment','Brown Glaze','98.5%','520 degC','&#8377;640 Cr','delivered','low','Jaipur','Jaipur','2024-07-09','1','North',''],
      ['MNO-A2409','B24-MNO-009','Guwahati','Assam Chemicals','MnO2 99.4% Zinc-Mn Cell','Rechargeable','99.4%','533 degC','&#8377;860 Cr','in-transit','high','Guwahati','Kolkata','2024-07-22','4','East',''],
      ['MNO-A2410','B24-MNO-010','Ahmedabad','Gujarat Chemicals','MnO2 99.95% Submarine Battery','Li-MnO2 Backup','99.95%','535 degC','&#8377;940 Cr','pending','critical','Ahmedabad','Bengaluru','2024-07-25','3','West',''],
      ['MNO-A2411','B24-MNO-011','Lucknow','UP Chemicals','MnO2 99.2% Fertilizer','Mn Micronutrient','99.2%','528 degC','&#8377;680 Cr','delivered','medium','Lucknow','Lucknow','2024-07-11','0','North',''],
      ['MNO-A2412','B24-MNO-012','Visakhapatnam','Vizag Chemicals','MnO2 99.8% Warship Battery','Naval Backup','99.8%','535 degC','&#8377;940 Cr','delayed','critical','Visakhapatnam','Visakhapatnam','2024-07-06','28','South',''],
      ['MNO-A2413','B24-MNO-013','Balasore','DRDO TBRL','MnO2 99.6% Thermite','Pyrotechnic','99.6%','530 degC','&#8377;880 Cr','in-transit','critical','Balasore','Chandipur','2024-07-19','2','East',''],
      ['MNO-A2414','B24-MNO-014','Bhilai','SAIL Chemicals','MnO2 97% General Chemical','Alloy Deoxidize','97.0%','510 degC','&#8377;640 Cr','delivered','low','Bhilai','Bhilai','2024-07-05','0','East',''],
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

  # Replace color — multiple passes to catch all instances
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
  print("R437 generation complete.")
