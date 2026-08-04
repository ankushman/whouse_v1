#!/usr/bin/env python3
"""gen_r438.py — R438: Cobalt Oxide (Co3O4) + Iron Oxide (Fe2O3) logistics modules.
Clone-and-customize from zinc-oxide template."""
import re

TEMPLATE = 'src/components/modules/zinc-oxide-logistics-view.tsx'

MODULES = [
  {
    'slug': 'cobalt-oxide',
    'title': 'Cobalt Oxide',
    'formula': 'Co3O4',
    'icon': 'Target',
    'color': '#0891b2',       # cyan — aerospace/superalloy
    'prefix': 'COO',
    'subtitle': 'Co3O4 battery cathode &#8226; Superalloy &#8226; Ceramic pigment &#8226; Catalyst supply chain',
    'var': 'cobalt_oxide',
    'func': 'Cobalt_OxideLogisticsView',
    'records': [
      ['COO-A2401','B24-COO-001','Mumbai','MIDHANI','Co3O4 99.9% Battery Cathode','NMC Precursor','99.9%','895 degC','&#8377;920 Cr','in-transit','critical','Mumbai','Pune','2024-07-15','3','West',''],
      ['COO-A2402','B24-COO-002','Bengaluru','DRDO DMRL','Co3O4 99.7% Superalloy','Gas Turbine Blade','99.7%','895 degC','&#8377;940 Cr','delivered','high','Bengaluru','Chennai','2024-07-10','2','South',''],
      ['COO-A2403','B24-COO-003','Hyderabad','Tata Advanced Materials','Co3O4 99.5% Ceramic Pigment','Blue Cobalt','99.5%','895 degC','&#8377;760 Cr','in-transit','high','Hyderabad','Hyderabad','2024-07-18','1','South',''],
      ['COO-A2404','B24-COO-004','Chennai','Bharat Forge','Co3O4 99.0% Jet Engine','LPC Blade Coat','99.0%','890 degC','&#8377;880 Cr','delivered','medium','Chennai','Chennai','2024-07-08','0','South',''],
      ['COO-A2405','B24-COO-005','Kolkata','Shyam Chemicals','Co3O4 99.8% Heterogeneous Cat','Fischer-Tropsch','99.8%','895 degC','&#8377;840 Cr','in-transit','high','Kolkata','Visakhapatnam','2024-07-20','5','East',''],
      ['COO-A2406','B24-COO-006','Noida','BHEL R&amp;D','Co3O4 99.3% VOC Oxidation','Catalytic Conv','99.3%','892 degC','&#8377;800 Cr','delivered','high','Noida','Noida','2024-07-12','0','North',''],
      ['COO-A2407','B24-COO-007','Pune','Godrej Chemicals','Co3O4 99.6% Enamel Binder','Ceramic Glaze','99.6%','895 degC','&#8377;860 Cr','in-transit','critical','Pune','Mumbai','2024-07-16','2','West',''],
      ['COO-A2408','B24-COO-008','Jaipur','Rajasthan Chemicals','Co3O4 98.5% Tire Rubber','Vulcanize Agent','98.5%','880 degC','&#8377;640 Cr','delivered','low','Jaipur','Jaipur','2024-07-09','1','North',''],
      ['COO-A2409','B24-COO-009','Guwahati','Assam Chemicals','Co3O4 99.4% Magnetic Recorder','Tape Pigment','99.4%','893 degC','&#8377;720 Cr','in-transit','high','Guwahati','Kolkata','2024-07-22','4','East',''],
      ['COO-A2410','B24-COO-010','Ahmedabad','Gujarat Chemicals','Co3O4 99.95% Submarine Battery','Li-CoO2 Backup','99.95%','895 degC','&#8377;960 Cr','pending','critical','Ahmedabad','Bengaluru','2024-07-25','3','West',''],
      ['COO-A2411','B24-COO-011','Lucknow','UP Chemicals','Co3O4 99.2% Glass Polish','Optical Grind','99.2%','888 degC','&#8377;720 Cr','delivered','medium','Lucknow','Lucknow','2024-07-11','0','North',''],
      ['COO-A2412','B24-COO-012','Visakhapatnam','Vizag Chemicals','Co3O4 99.8% Warship Coating','Navy Anticorro','99.8%','895 degC','&#8377;940 Cr','delayed','critical','Visakhapatnam','Visakhapatnam','2024-07-06','28','South',''],
      ['COO-A2413','B24-COO-013','Balasore','DRDO TBRL','Co3O4 99.6% Solid Propellant','AP Catalyst','99.6%','890 degC','&#8377;880 Cr','in-transit','critical','Balasore','Chandipur','2024-07-19','2','East',''],
      ['COO-A2414','B24-COO-014','Bhilai','SAIL Chemicals','Co3O4 97% General Chemical','Alloy Binder','97.0%','875 degC','&#8377;640 Cr','delivered','low','Bhilai','Bhilai','2024-07-05','0','East',''],
    ],
  },
  {
    'slug': 'iron-oxide',
    'title': 'Iron Oxide',
    'formula': 'Fe2O3',
    'icon': 'Anvil',
    'color': '#991b1b',       # dark red — iron/steel
    'prefix': 'FEO',
    'subtitle': 'Fe2O3 pigment &#8226; Magnetic storage &#8226; Catalyst &#8226; Steel polishing supply chain',
    'var': 'iron_oxide',
    'func': 'Iron_OxideLogisticsView',
    'records': [
      ['FEO-A2401','B24-FEO-001','Mumbai','MIDHANI','Fe2O3 99.9% Magnetic Storage','Hard Disk Media','99.9%','1565 degC','&#8377;900 Cr','in-transit','critical','Mumbai','Pune','2024-07-15','3','West',''],
      ['FEO-A2402','B24-FEO-002','Bengaluru','DRDO DMRL','Fe2O3 99.7% RAM Memory','MRAM Thin Film','99.7%','1565 degC','&#8377;920 Cr','delivered','high','Bengaluru','Chennai','2024-07-10','2','South',''],
      ['FEO-A2403','B24-FEO-003','Hyderabad','Tata Steel','Fe2O3 99.5% Red Pigment','Paint Oxide','99.5%','1565 degC','&#8377;720 Cr','in-transit','high','Hyderabad','Hyderabad','2024-07-18','1','South',''],
      ['FEO-A2404','B24-FEO-004','Chennai','SAIL','Fe2O3 99.0% Steel Polish','Abrasive Media','99.0%','1565 degC','&#8377;760 Cr','delivered','medium','Chennai','Chennai','2024-07-08','0','South',''],
      ['FEO-A2405','B24-FEO-005','Kolkata','Shyam Chemicals','Fe2O3 99.8% Water Treatment','Flocculant','99.8%','1565 degC','&#8377;800 Cr','in-transit','high','Kolkata','Visakhapatnam','2024-07-20','5','East',''],
      ['FEO-A2406','B24-FEO-006','Noida','BHEL R&amp;D','Fe2O3 99.3% Gas Sensor','CO Detect','99.3%','1558 degC','&#8377;840 Cr','delivered','high','Noida','Noida','2024-07-12','0','North',''],
      ['FEO-A2407','B24-FEO-007','Pune','Godrej Chemicals','Fe2O3 99.6% Ferrite Magnet','Permanent Mag','99.6%','1565 degC','&#8377;880 Cr','in-transit','critical','Pune','Mumbai','2024-07-16','2','West',''],
      ['FEO-A2408','B24-FEO-008','Jaipur','Rajasthan Chemicals','Fe2O3 98.5% Cement Additive','Portland Mix','98.5%','1540 degC','&#8377;640 Cr','delivered','low','Jaipur','Jaipur','2024-07-09','1','North',''],
      ['FEO-A2409','B24-FEO-009','Guwahati','Assam Chemicals','Fe2O3 99.4% Anti-Corrosion','Primer Paint','99.4%','1560 degC','&#8377;820 Cr','in-transit','high','Guwahati','Kolkata','2024-07-22','4','East',''],
      ['FEO-A2410','B24-FEO-010','Ahmedabad','Gujarat Chemicals','Fe2O3 99.95% Submarine Hull','Degaussing Coat','99.95%','1565 degC','&#8377;940 Cr','pending','critical','Ahmedabad','Bengaluru','2024-07-25','3','West',''],
      ['FEO-A2411','B24-FEO-011','Lucknow','UP Chemicals','Fe2O3 99.2% Animal Feed','Iron Supplement','99.2%','1550 degC','&#8377;680 Cr','delivered','medium','Lucknow','Lucknow','2024-07-11','0','North',''],
      ['FEO-A2412','B24-FEO-012','Visakhapatnam','Vizag Chemicals','Fe2O3 99.8% Warship Anticorrosion','Navy Primer','99.8%','1565 degC','&#8377;940 Cr','delayed','critical','Visakhapatnam','Visakhapatnam','2024-07-06','28','South',''],
      ['FEO-A2413','B24-FEO-013','Balasore','DRDO TBRL','Fe2O3 99.6% Thermite','Welding Ignition','99.6%','1560 degC','&#8377;880 Cr','in-transit','critical','Balasore','Chandipur','2024-07-19','2','East',''],
      ['FEO-A2414','B24-FEO-014','Bhilai','SAIL Chemicals','Fe2O3 97% General Chemical','Foundry Sand','97.0%','1530 degC','&#8377;640 Cr','delivered','low','Bhilai','Bhilai','2024-07-05','0','East',''],
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
  print("R438 generation complete.")
