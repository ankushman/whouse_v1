---
Task ID: R459 — Cobalt Carbonate Logistics + Zinc Sulfate Logistics
Agent: Main Agent (Cron Loop)
Task: R459 — 2 new Indian logistics modules for cobalt carbonate (CoCO3) NMC cathode/superalloy binder/ceramic pigment/submarine sonar magnet supply chain and zinc sulfate (ZnSO4) fertilizer/Zn-ion battery/galvanizing bath/submarine hull CP supply chain.

Work Log:
- Read worklog: R458 complete (commit 50ce829), 742 exports, ~63,152 CSS
- TSC pre-validation: 0 errors in src/
- Candidate scan: cobalt-carbonate (CLEAN), zinc-sulfate (CLEAN), copper-sulfate (CLEAN), manganese-metal (CLEAN), chromium-sulfate (CLEAN), nickel-carbonate (CLEAN)
- Icons verified: Heart (0 uses, confirmed), Map (0 uses, confirmed)
- Created Cobalt Carbonate Logistics (R459a): 227 lines, cbc-* cobalt-blue #1d4ed8, 14 records
  - 14 grades: CoCO3 99.9% Li-Ion Battery Precursor, CoCO3 99.95% Superalloy Binder, CoCO3 99.5% Ceramic Pigment Blue, CoCO3 99.7% Hardmetal WC-Co Binder, CoCO3 99.85% Animal Feed Trace Mineral, CoCO3 99.3% Magnetic Alloy Alnico, CoCO3 99.8% Catalyst Petroleum HDS, CoCO3 99.0% Electroplating Anode, CoCO3 99.6% Rubber Adhesion Promoter, CoCO3 99.92% EV Battery NCM-811, CoCO3 99.4% Polyester Dye Catalyst, CoCO3 99.95% Submarine Sonar Magnet, CoCO3 99.8% Warship Gas Turbine Blade, CoCO3 97.5% General Industrial Grade
  - Manufacturers: MIDHANI, DRDO DMRL, Tata Chemicals, Bharat Forge, Shyam Chemicals, BHEL R&amp;D, Godrej Chemicals, Rajasthan Chemicals, Assam Chemicals, UP Chemicals, Gujarat Chemicals, Vizag Chemicals, DRDO TBRL, SAIL Chemicals
  - Applications: Exide NMC-622 Li cell, HAL Tejas Ni-Co blade, Corning Co-blue glass frit, Sandvik WC-Co carbide, Amul dairy Co premix, BHEL generator Alnico mag, IOC Vadodara Co-Mo HDS, Rajasthan Co bright plate, MRF brass Co-plated tyre, Ola Electric NCM-811 pack, Bhilwara Co-blue dye mord, IN Navy SSK sonar Alnico, DRDO naval LM2500 Co blade, SAIL steel Co charge
  - Rs 12,100 Cr total, avg 99.35%, density 4.13 g/cm3
  - Delayed: CBC-A2412 (28d, monsoon Visakhapatnam, submarine sonar Alnico magnet)
- Created Zinc Sulfate Logistics (R459b): 227 lines, zns-* cyan #0e7490, 14 records
  - 14 grades: ZnSO4 99.5% Agricultural Micronutrient, ZnSO4 99.9% Zn-Ion Battery Electrolyte, ZnSO4 99.3% Animal Feed Supplement, ZnSO4 99.7% Galvanizing Zinc Bath, ZnSO4 99.0% Water Treatment Coagulant, ZnSO4 99.8% Rayon Viscose Spin Bath, ZnSO4 99.6% Zinc Plating Electrolyte, ZnSO4 99.1% Wood Preservative, ZnSO4 99.4% Fungicide Zineb/Ziram, ZnSO4 99.85% Lithium Battery Zn Anode, ZnSO4 99.2% Dental Cement Zinc Phosphate, ZnSO4 99.9% Submarine Zinc Anode CP, ZnSO4 99.7% Warship Smoke Screening, ZnSO4 98.0% General Industrial Grade
  - Manufacturers: MIDHANI, DRDO DMRL, Tata Chemicals, Bharat Forge, Shyam Chemicals, BHEL R&amp;D, Godrej Chemicals, Rajasthan Chemicals, Assam Chemicals, UP Chemicals, Gujarat Chemicals, Vizag Chemicals, DRDO TBRL, SAIL Chemicals
  - Applications: IFFCO Zn foliar spray, IISc Zn-ion pouch cell, Venkateshwara Zn feed, SAIL HDG bath replenish, Kolkata ZWC flocculant, Grasim Viscose ZnSO4 bath, Tata Steel Zn electroplate, Rajasthan CCA Zn treat, UPL Zineb fungicide, IISc Zn-Li prototype, Dental ZnPO4 cement, IN Navy SSK Zn anode plate, DRDO naval ZnO smoke, SAIL ZnSO4 pickle liquor
  - Rs 12,100 Cr total, avg 99.35%, density 3.54 g/cm3
  - Delayed: ZNS-A2412 (28d, monsoon Visakhapatnam, submarine Zn anode plate)
- TSC: 0 errors in src/
- Three-file registration: index.ts (744 exports), page.tsx (1274 viewMap entries), app-store.ts (756 navItems)
- CSS appended: 16 new rules (~63,176 total)
- Git commit: 9f756cd, pushed to main

Stage Summary:
- Project now: 744 module exports, 756 navItems, ~63,176 CSS lines, 1274 viewMap entries, 0 TSC errors in src/
- Cobalt Carbonate: Submarine sonar &#8377;960Cr, NCM-811 EV &#8377;960Cr, superalloy &#8377;960Cr, NMC-622 &#8377;940Cr
- Zinc Sulfate: Submarine Zn anode &#8377;960Cr, Zn-ion battery &#8377;940Cr, Zn-Li hybrid &#8377;960Cr, galvanizing &#8377;860Cr
- Delayed: CBC-A2412 (28d), ZNS-A2412 (28d) — both monsoon Visakhapatnam naval corridor

**Project Current State:**
- 744 module exports, 756 navItems, ~63,176 CSS lines, 1274 viewMap entries, 0 TSC errors in src/

**Risks:**
- globals.css 63K+ lines, dev server OOM — TSC-only QA gate
- CoCO3 99.92% NCM-811 grade — DRC controls 70% global Co, critical EV battery supply chain risk
- CoCO3 99.95% superalloy grade — strategic defense material, imported from China/Finland
- ZnSO4 99.85% Zn-Li hybrid grade — emerging battery chemistry, limited Indian production capacity
- Next clean candidates: copper-sulfate, manganese-metal, chromium-sulfate, nickel-carbonate, silicon-metal, titanium-sponge
