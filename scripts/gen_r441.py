#!/usr/bin/env python3
"""gen_r441.py — R441: Tungsten Oxide (WO3) + Molybdenum Oxide (MoO3) logistics modules."""
import re

TEMPLATE = 'src/components/modules/zinc-oxide-logistics-view.tsx'

MODULES = [
  {
    'slug': 'tungsten-oxide',
    'title': 'Tungsten Oxide',
    'formula': 'WO3',
    'icon': 'Cog',
    'color': '#4338ca',       # indigo — heavy metal/industrial
    'prefix': 'TNO',
    'subtitle': 'WO3 smart window &#8226; Gas sensor &#8226; Fireproof &#8226; Tungsten carbide precursor supply chain',
    'var': 'tungsten_oxide',
    'func': 'Tungsten_OxideLogisticsView',
    'records': [
      ['TNO-A2401','B24-TNO-001','Mumbai','MIDHANI','WO3 99.9% Smart Window','Electrochromic','99.9%','1473 degC','&#8377;920 Cr','in-transit','critical','Mumbai','Pune','2024-07-15','3','West',''],
      ['TNO-A2402','B24-TNO-002','Bengaluru','DRDO DMRL','WO3 99.7% Gas Sensor','NOx Detect','99.7%','1473 degC','&#8377;880 Cr','delivered','high','Bengaluru','Chennai','2024-07-10','2','South',''],
      ['TNO-A2403','B24-TNO-003','Hyderabad','Tata Advanced Materials','WO3 99.5% Fireproof Fabric','Heat Resistant','99.5%','1473 degC','&#8377;800 Cr','in-transit','high','Hyderabad','Hyderabad','2024-07-18','1','South',''],
      ['TNO-A2404','B24-TNO-004','Chennai','Bharat Forge','WO3 99.0% Tungsten Carbide','Cutting Tool','99.0%','1473 degC','&#8377;840 Cr','delivered','medium','Chennai','Chennai','2024-07-08','0','South',''],
      ['TNO-A2405','B24-TNO-005','Kolkata','Shyam Chemicals','WO3 99.8% X-Ray Shield','Radiology','99.8%','1473 degC','&#8377;860 Cr','in-transit','high','Kolkata','Visakhapatnam','2024-07-20','5','East',''],
      ['TNO-A2406','B24-TNO-006','Noida','BHEL R&amp;D','WO3 99.3% Catalyst','Hydrogenation','99.3%','1468 degC','&#8377;800 Cr','delivered','high','Noida','Noida','2024-07-12','0','North',''],
      ['TNO-A2407','B24-TNO-007','Pune','Godrej Chemicals','WO3 99.6% Underwater Paint','Anti-Fouling','99.6%','1473 degC','&#8377;880 Cr','in-transit','critical','Pune','Mumbai','2024-07-16','2','West',''],
      ['TNO-A2408','B24-TNO-008','Jaipur','Rajasthan Chemicals','WO3 98.5% Ceramic Glaze','Yellow Tint','98.5%','1450 degC','&#8377;640 Cr','delivered','low','Jaipur','Jaipur','2024-07-09','1','North',''],
      ['TNO-A2409','B24-TNO-009','Guwahati','Assam Chemicals','WO3 99.4% Plasma Display','Phosphor','99.4%','1470 degC','&#8377;860 Cr','in-transit','high','Guwahati','Kolkata','2024-07-22','4','East',''],
      ['TNO-A2410','B24-TNO-010','Ahmedabad','Gujarat Chemicals','WO3 99.95% Submarine Periscope','IR Coating','99.95%','1473 degC','&#8377;960 Cr','pending','critical','Ahmedabad','Bengaluru','2024-07-25','3','West',''],
      ['TNO-A2411','B24-TNO-011','Lucknow','UP Chemicals','WO3 99.2% Pigment','Yellow Oxide','99.2%','1465 degC','&#8377;720 Cr','delivered','medium','Lucknow','Lucknow','2024-07-11','0','North',''],
      ['TNO-A2412','B24-TNO-012','Visakhapatnam','Vizag Chemicals','WO3 99.8% Warship Stealth','Radar Absorb','99.8%','1473 degC','&#8377;940 Cr','delayed','critical','Visakhapatnam','Visakhapatnam','2024-07-06','28','South',''],
      ['TNO-A2413','B24-TNO-013','Balasore','DRDO TBRL','WO3 99.6% Missile Fin','Aero Heat','99.6%','1470 degC','&#8377;900 Cr','in-transit','critical','Balasore','Chandipur','2024-07-19','2','East',''],
      ['TNO-A2414','B24-TNO-014','Bhilai','SAIL Chemicals','WO3 97% General Chemical','Alloy Add','97.0%','1440 degC','&#8377;640 Cr','delivered','low','Bhilai','Bhilai','2024-07-05','0','East',''],
    ],
  },
  {
    'slug': 'molybdenum-oxide',
    'title': 'Molybdenum Oxide',
    'formula': 'MoO3',
    'icon': 'Factory',
    'color': '#059669',       # emerald — steel/industrial
    'prefix': 'MOO',
    'subtitle': 'MoO3 steel alloy &#8226; Catalyst &#8226; Pigment &#8226; Lubricant supply chain',
    'var': 'molybdenum_oxide',
    'func': 'Molybdenum_OxideLogisticsView',
    'records': [
      ['MOO-A2401','B24-MOO-001','Mumbai','MIDHANI','MoO3 99.9% Steel Alloy','HSLA Strengthen','99.9%','795 degC','&#8377;920 Cr','in-transit','critical','Mumbai','Pune','2024-07-15','3','West',''],
      ['MOO-A2402','B24-MOO-002','Bengaluru','DRDO DMRL','MoO3 99.7% Jet Engine','Turbine Blade','99.7%','795 degC','&#8377;940 Cr','delivered','high','Bengaluru','Chennai','2024-07-10','2','South',''],
      ['MOO-A2403','B24-MOO-003','Hyderabad','Tata Steel','MoO3 99.5% Desulfurization','Refinery Cat','99.5%','795 degC','&#8377;840 Cr','in-transit','high','Hyderabad','Hyderabad','2024-07-18','1','South',''],
      ['MOO-A2404','B24-MOO-004','Chennai','Bharat Forge','MoO3 99.0% Pigment','Moly Orange','99.0%','795 degC','&#8377;760 Cr','delivered','medium','Chennai','Chennai','2024-07-08','0','South',''],
      ['MOO-A2405','B24-MOO-005','Kolkata','Shyam Chemicals','MoO3 99.8% Solid Lubricant','High Temp Grease','99.8%','795 degC','&#8377;880 Cr','in-transit','high','Kolkata','Visakhapatnam','2024-07-20','5','East',''],
      ['MOO-A2406','B24-MOO-006','Noida','BHEL R&amp;D','MoO3 99.3% Corrosion Inhibit','Boiler Pipe','99.3%','790 degC','&#8377;800 Cr','delivered','high','Noida','Noida','2024-07-12','0','North',''],
      ['MOO-A2407','B24-MOO-007','Pune','Godrej Chemicals','MoO3 99.6% Catalyst Oxidation','Methanol','99.6%','795 degC','&#8377;840 Cr','in-transit','critical','Pune','Mumbai','2024-07-16','2','West',''],
      ['MOO-A2408','B24-MOO-008','Jaipur','Rajasthan Chemicals','MoO3 98.5% Ceramic Glaze','Blue Tint','98.5%','780 degC','&#8377;640 Cr','delivered','low','Jaipur','Jaipur','2024-07-09','1','North',''],
      ['MOO-A2409','B24-MOO-009','Guwahati','Assam Chemicals','MoO3 99.4% Smoke Suppress','Fire Retard','99.4%','792 degC','&#8377;760 Cr','in-transit','high','Guwahati','Kolkata','2024-07-22','4','East',''],
      ['MOO-A2410','B24-MOO-010','Ahmedabad','Gujarat Chemicals','MoO3 99.95% Submarine Propeller','Alloy Strength','99.95%','795 degC','&#8377;960 Cr','pending','critical','Ahmedabad','Bengaluru','2024-07-25','3','West',''],
      ['MOO-A2411','B24-MOO-011','Lucknow','UP Chemicals','MoO3 99.2% Coil Coating','Galvanized','99.2%','788 degC','&#8377;720 Cr','delivered','medium','Lucknow','Lucknow','2024-07-11','0','North',''],
      ['MOO-A2412','B24-MOO-012','Visakhapatnam','Vizag Chemicals','MoO3 99.8% Warship Hull Alloy','Naval Steel','99.8%','795 degC','&#8377;940 Cr','delayed','critical','Visakhapatnam','Visakhapatnam','2024-07-06','28','South',''],
      ['MOO-A2413','B24-MOO-013','Balasore','DRDO TBRL','MoO3 99.6% Missile Airframe','HSLA Panel','99.6%','790 degC','&#8377;900 Cr','in-transit','critical','Balasore','Chandipur','2024-07-19','2','East',''],
      ['MOO-A2414','B24-MOO-014','Bhilai','SAIL Chemicals','MoO3 97% General Chemical','Cast Iron','97.0%','775 degC','&#8377;640 Cr','delivered','low','Bhilai','Bhilai','2024-07-05','0','East',''],
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
  content = re.sub(r"const \w+_RECORDS = \[.*?\];", f"const {mod['var']}_RECORDS = [\n{rec_block}\n];", content, flags=re.DOTALL)
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
  print("R441 generation complete.")
