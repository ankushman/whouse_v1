#!/bin/bash
# Quick QA: click each nav button, snapshot, look for errors
set -e
cd /home/z/my-project

# Define test cases: "nav_text|expected_heading_substring"
tests=(
  "Dashboard|Executive Dashboard"
  "Operations Overview|Operations Overview"
  "Warehouses|Warehouses"
  "Inbound|Inbound"
  "Procurement / PO|Procurement"
  "BOM Management|BOM"
  "Quality Inspection|Quality Inspection"
  "Outbound|Outbound"
  "Returns & Reverse|Returns"
  "Inventory|Inventory"
  "Transportation|Transportation"
  "Yard Management|Yard Management"
  "Route Optimization|Route"
  "Warehouse Map|Warehouse Map"
  "Equipment|Equipment"
  "Employees|Employees"
  "Vendor Management|Vendor Management"
  "Customer SLA|Customer SLA"
  "Supplier Quality|Supplier Quality"
  "Productivity|Productivity"
  "Cost Analytics|Cost Analytics"
  "Predictive Analytics|Predictive"
  "Energy & ESG|Energy"
  "Compliance & Audit|Compliance"
  "Alerts|Alerts"
  "Dock Scheduling|Dock"
  "SLA Countdown|SLA"
  "Shift Handover|Shift"
  "Reports|Reports"
  "Settings|Settings"
)

for test in "${tests[@]}"; do
  nav="${test%|*}"
  expected="${test#*|}"
  # Use JS to find and click the button (handles ref resetting)
  click_result=$(cat <<EOF | agent-browser eval --stdin
(function(){
  const btns = Array.from(document.querySelectorAll('button'));
  const t = btns.find(b => b.textContent?.trim() === '${nav}');
  if (t) { t.click(); return 'ok'; } else { return 'missing'; }
})();
EOF
)
  sleep 1.5
  snap=$(agent-browser snapshot --timeout 3000 2>&1)
  err=$(echo "$snap" | grep -iE "Application error|TypeError|ReferenceError|cannot read|undefined is not" | head -1)
  heading=$(echo "$snap" | grep -E "heading \"" | head -1)
  if [ -n "$err" ]; then
    echo "FAIL [${nav}]: $err"
  elif [ -z "$heading" ]; then
    echo "WARN [${nav}]: no heading found"
  else
    echo "OK   [${nav}]: ${heading}"
  fi
done
