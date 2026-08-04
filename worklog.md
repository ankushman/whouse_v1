---
Task ID: R460 — Copper Sulfate Logistics + Manganese Metal Logistics
Agent: Main Agent (Cron Loop)
Task: R460 — 2 new Indian logistics modules for copper sulfate (CuSO4) fungicide/electroplating/mining flotation/submarine anti-fouling paint supply chain and manganese metal (Mn) FeMn/SiMn steel/Hadfield armour/Al-Mn aerospace/submarine HSLA-80 hull supply chain.

Work Log:
- Read worklog: R459 complete (commit 9f756cd), 744 exports, ~63,176 CSS
- TSC pre-validation: 0 errors in src/
- Candidate scan: copper-sulfate (CLEAN), manganese-metal (CLEAN), chromium-sulfate (CLEAN), nickel-carbonate (CLEAN), selenium-dioxide (CLEAN), ammonium-vanadate (CLEAN)
- Icons verified: BadgeCheck (0 uses, confirmed), Bean (0 uses, confirmed)
- Created Copper Sulfate Logistics (R460a): 227 lines, cus-* copper-brown #b45309, 14 records
  - 14 grades: CuSO4 99.5% Agricultural Fungicide, CuSO4 99.9% Electroplating Bath, CuSO4 99.3% Animal Feed, CuSO4 99.7% Mining Flotation, CuSO4 99.85% Water Treatment Algicide, CuSO4 99.8% Textile Mordant, CuSO4 99.6% Pigment Manufacturing, CuSO4 99.0% Battery Electrolyte, CuSO4 99.4% Soil Amendment, CuSO4 99.95% Analytical Crystal, CuSO4 99.2% Leather Tanning, CuSO4 99.9% Submarine Anti-Fouling, CuSO4 99.8% Warship Sonar Electrode, CuSO4 98.0% General Industrial
  - Manufacturers: MIDHANI, DRDO DMRL, Tata Chemicals, Bharat Forge, Shyam Chemicals, BHEL R&amp;D, Godrej Chemicals, Rajasthan Chemicals, Assam Chemicals, UP Chemicals, Gujarat Chemicals, Vizag Chemicals, DRDO TBRL, SAIL Chemicals
  - Applications: Maharashtra grape vineyard Cu spray, BEL PCB Cu plate, Amul dairy Cu premix, Hindalco Khetri Cu float, NTPC Talcher Cu algicide, Bhilwara Cu dye mordant, Sudarshan CuPC blue pigment, Exide Pb-Cu battery, Assam tea Cu foliar, IISc analytical CuSO4, Kanpur leather Cu tan, IN Navy SSK Cu anti-fouling, DRDO naval Cu electrode, SAIL process CuSO4
  - Rs 12,100 Cr total, avg 99.35%, density 3.6 g/cm3
  - Delayed: CUS-A2412 (28d, monsoon Visakhapatnam, submarine Cu anti-fouling paint)
- Created Manganese Metal Logistics (R460b): 227 lines, mnm-* slate-grey #475569, 14 records
  - 14 grades: Mn 99.9% Ferromanganese FeMn75, Mn 99.95% Silicomanganese SiMn65, Mn 99.7% Al-Mn Can Sheet, Mn 99.5% Hadfield Steel Mn12%, Mn 99.8% HSLA Bridge Girder, Mn 99.6% SS 200 Series, Mn 99.85% Dry Cell MnO2, Mn 99.3% Welding Flux, Mn 99.4% Fertilizer Grade, Mn 99.92% Aerospace 2000-Al, Mn 99.1% Al Bronze Propeller, Mn 99.95% Submarine HSLA-80, Mn 99.8% Warship Mangalloy Armour, Mn 98.0% General Metallurgical
  - Manufacturers: MIDHANI, DRDO DMRL, Tata Chemicals, Bharat Forge, Shyam Chemicals, BHEL R&amp;D, Godrej Chemicals, Rajasthan Chemicals, Assam Chemicals, UP Chemicals, Gujarat Chemicals, Vizag Chemicals, DRDO TBRL, SAIL Chemicals
  - Applications: SAIL BOF FeMn75 charge, Tata Steel SiMn65 ladle, Hindalco Al-Mn can, Indian Railways Mn12 frog, L&amp;T HSLA bridge, Jindal SS 201 Cr-Mn, Eveready MnO2 cell, Ador Welding Mn flux, IFFCO Mn foliar, HAL Tejas Al-Mn skin, Mazagon Dock Cu-Mn prop, IN Navy SSK HSLA-80 hull, DRDO naval Mn12 armour, SAIL Mn foundry
  - Rs 12,100 Cr total, avg 99.35%, density 7.21 g/cm3
  - Delayed: MNM-A2412 (28d, monsoon Visakhapatnam, submarine HSLA-80 pressure hull)
- TSC: 0 errors in src/
- Three-file registration: index.ts (746 exports), page.tsx (1276 viewMap entries), app-store.ts (758 navItems)
- CSS appended: 16 new rules (~63,200 total)
- Git commit: 38b981d, pushed to main

Stage Summary:
- Project now: 746 module exports, 758 navItems, ~63,200 CSS lines, 1276 viewMap entries, 0 TSC errors in src/
- Copper Sulfate: Submarine anti-fouling &#8377;960Cr, analytical &#8377;880Cr, electroplating &#8377;900Cr, mining flotation &#8377;860Cr
- Manganese Metal: Submarine HSLA-80 &#8377;960Cr, aerospace Al-Mn &#8377;960Cr, Hadfield armour &#8377;940Cr, FeMn75 &#8377;880Cr
- Delayed: CUS-A2412 (28d), MNM-A2412 (28d) — both monsoon Visakhapatnam naval corridor

**Project Current State:**
- 746 module exports, 758 navItems, ~63,200 CSS lines, 1276 viewMap entries, 0 TSC errors in src/

**Risks:**
- globals.css 63K+ lines, dev server OOM — TSC-only QA gate
- Mn 99.95% HSLA-80 grade — critical submarine pressure hull steel, South Africa/Australia import dependency
- CuSO4 99.9% anti-fouling grade — IMO environmental regulation tightening, Cu-based biocides under review
- Mn 99.92% aerospace grade — strategic for Tejas Mk2, limited Indian primary Mn production
- Next clean candidates: chromium-sulfate, nickel-carbonate, selenium-dioxide, ammonium-vanadate, silicon-nitride, tungsten-metal
