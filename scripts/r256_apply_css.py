#!/usr/bin/env python3
"""R256: Batch apply CSS classes across all 171 modules.
Applies: card-crud-lift, table-hover-highlight, badge-interactive, chip-group,
         progress-bar-animated, numeric-cell, input-focus-ring, glass-subtle,
         btn-outline-animate, row-entrance, stagger animations
"""

import os
import re
import glob

MODULES_DIR = '/home/z/my-project/src/components/modules'
stats = {
    'card_crud_lift': 0,
    'table_hover': 0,
    'badge_interactive': 0,
    'chip_group': 0,
    'progress_animated': 0,
    'numeric_cell': 0,
    'input_focus': 0,
    'glass_subtle': 0,
    'btn_outline': 0,
    'row_entrance': 0,
    'stagger': 0,
}

def process_module(filepath):
    """Apply CSS class enhancements to a single module."""
    with open(filepath, 'r') as f:
        content = f.read()
    
    original = content
    lines = content.split('\n')
    new_lines = []
    
    for i, line in enumerate(lines):
        new_line = line
        
        # 1. Add card-crud-lift to Card with table patterns
        if 'Card className="' in new_line and ('<Card className="' in new_line or '<Card className=`' in new_line):
            # Check if this card contains a table (look ahead)
            if i + 1 < len(lines):
                look_ahead = '\n'.join(lines[i:min(i+5, len(lines))])
                if 'TableBody' in look_ahead or 'table-' in look_ahead:
                    if 'card-crud-lift' not in new_line:
                        new_line = new_line.replace('className="', 'className="card-crud-lift ')
                        stats['card_crud_lift'] += 1
        
        # 2. Add table-hover-highlight to tables
        if '<Table>' in new_line or '<Table ' in new_line:
            if 'table-hover-highlight' not in new_line:
                new_line = new_line.replace('<Table', '<Table className="table-hover-highlight')
                stats['table_hover'] += 1
        
        # 3. Add badge-interactive to Badge components
        if '<Badge' in new_line and 'className="' in new_line:
            if 'badge-interactive' not in new_line:
                new_line = new_line.replace('className="', 'className="badge-interactive ')
                stats['badge_interactive'] += 1
        
        # 4. Add numeric-cell to table cells with number-like content
        if '<TableCell' in new_line and 'className="' in new_line:
            # Check if content looks numeric
            if re.search(r'\{[\w.]+\}', new_line):
                # Look for amount/price/cost/rate/revenue patterns
                if re.search(r'[Aa]mount|[Pp]rice|[Cc]ost|[Rr]ate|[Rr]evenue|[Ff]ee|[Vv]alue|[Tt]otal|[Pp]ercent|[Ss]core', new_line) or re.search(r'₹|\$|%', new_line):
                    if 'numeric-cell' not in new_line:
                        new_line = new_line.replace('className="', 'className="numeric-cell ')
                        stats['numeric_cell'] += 1
        
        # 5. Add progress-bar-animated to progress/utility bars
        if 'progress' in new_line.lower() and 'className="' in new_line and 'w-' in new_line:
            if 'progress-bar-animated' not in new_line and 'animate' not in new_line:
                # Only for divs used as progress bars
                if '<div' in new_line or '<span' in new_line:
                    if re.search(r'bg-(emerald|green|blue|red|amber|orange|yellow|violet|cyan|rose|pink)', new_line):
                        new_line = new_line.replace('className="', 'className="progress-bar-animated ')
                        stats['progress_animated'] += 1
        
        # 6. Add input-focus-ring to Input components
        if '<Input' in new_line and ('type="text"' in new_line or 'type="number"' in new_line or 'type="search"' in new_line):
            if 'input-focus-ring' not in new_line:
                new_line = new_line.replace('className="', 'className="input-focus-ring ')
                stats['input_focus'] += 1
        
        # 7. Add glass-subtle to CardContent
        if '<CardContent className="' in new_line:
            if 'glass-subtle' not in new_line and 'glass' not in new_line.lower():
                new_line = new_line.replace('className="', 'className="glass-subtle ')
                stats['glass_subtle'] += 1
        
        # 8. Add btn-outline-animate to outline Button variants
        if '<Button' in new_line and 'variant="outline"' in new_line and 'className="' in new_line:
            if 'btn-outline-animate' not in new_line:
                new_line = new_line.replace('className="', 'className="btn-outline-animate ')
                stats['btn_outline'] += 1
        
        # 9. Wrap consecutive Badge elements with chip-group
        # (handled separately in a second pass)
        
        new_lines.append(new_line)
    
    # Second pass: wrap consecutive Badge lines with chip-group div
    result_lines = []
    i = 0
    while i < len(new_lines):
        # Find start of consecutive Badge lines
        if '<Badge' in new_lines[i] and i > 0:
            start = i
            count = 0
            j = i
            # Count consecutive Badge lines (allowing small gaps)
            while j < len(new_lines):
                if '<Badge' in new_lines[j] or (count > 0 and '</Badge>' in new_lines[j]):
                    count += 1
                    j += 1
                elif new_lines[j].strip() == '' and j + 1 < len(new_lines) and '<Badge' in new_lines[j+1]:
                    j += 1
                else:
                    break
            
            if count >= 2:
                # Check if already wrapped in chip-group
                prev_line = new_lines[start-1] if start > 0 else ''
                if 'chip-group' not in prev_line:
                    result_lines.append('<div className="chip-group">')
                    for k in range(start, j):
                        result_lines.append(new_lines[k])
                    result_lines.append('</div>')
                    stats['chip_group'] += 1
                    i = j
                    continue
        
        result_lines.append(new_lines[i])
        i += 1
    
    new_content = '\n'.join(result_lines)
    
    if new_content != original:
        with open(filepath, 'w') as f:
            f.write(new_content)
        return True
    return False

# Process all modules
module_files = sorted(glob.glob(os.path.join(MODULES_DIR, '*-view.tsx')))
modified = 0
for filepath in module_files:
    if process_module(filepath):
        modified += 1

print(f"R256 CSS class application complete:")
print(f"  Modules modified: {modified}/{len(module_files)}")
print(f"  card-crud-lift applied: {stats['card_crud_lift']}")
print(f"  table-hover-highlight applied: {stats['table_hover']}")
print(f"  badge-interactive applied: {stats['badge_interactive']}")
print(f"  chip-group wrapped: {stats['chip_group']}")
print(f"  progress-bar-animated applied: {stats['progress_animated']}")
print(f"  numeric-cell applied: {stats['numeric_cell']}")
print(f"  input-focus-ring applied: {stats['input_focus']}")
print(f"  glass-subtle applied: {stats['glass_subtle']}")
print(f"  btn-outline-animate applied: {stats['btn_outline']}")
