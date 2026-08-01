#!/usr/bin/env python3
"""R256: Carefully apply CSS classes across modules.
Rules:
- badge-interactive: Add to <Badge> className="..." (never create duplicate)
- glass-subtle: Add to <CardContent className="..."  
- numeric-cell: Add to <TableCell with amount/cost/revenue/value/fee/price
- btn-outline-animate: Add to <Button variant="outline" className="..."
- card-crud-lift: Add to Card that wraps a Table (check parent pattern)
- table-hover-highlight: Add to <Table> or <Table className= if standalone
- chip-group: Wrap consecutive <Badge lines
- input-focus-ring: Add to <Input type="text/number/search" className="..."
"""

import os, re, glob

MODULES_DIR = '/home/z/my-project/src/components/modules'
stats = {}

def has_class(line, cls):
    """Check if line already has a CSS class."""
    return cls in line

def add_class(line, cls):
    """Add a CSS class to a className="..." pattern."""
    # Find className="..." pattern
    pattern = r'(className=")([^"]*?)(")'
    match = re.search(pattern, line)
    if match:
        existing = match.group(2)
        if cls not in existing:
            new_classes = cls + ' ' + existing
            return line[:match.start()] + 'className="' + new_classes + '"' + line[match.end():]
    return line

def process_module(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    original = content
    lines = content.split('\n')
    new_lines = []
    
    for i, line in enumerate(lines):
        nl = line
        
        # 1. badge-interactive on <Badge className="
        if '<Badge' in nl and 'className="' in nl and not has_class(nl, 'badge-interactive'):
            nl = add_class(nl, 'badge-interactive')
            stats['badge-interactive'] = stats.get('badge-interactive', 0) + 1
        
        # 2. glass-subtle on <CardContent className="
        if '<CardContent className="' in nl and not has_class(nl, 'glass-subtle'):
            # Don't add if already has glass or card-specific class
            if 'card-glass' not in nl and 'glass-card' not in nl and 'glass-elevated' not in nl:
                nl = add_class(nl, 'glass-subtle')
                stats['glass-subtle'] = stats.get('glass-subtle', 0) + 1
        
        # 3. numeric-cell on <TableCell with financial/numeric patterns
        if '<TableCell' in nl and 'className="' in nl and not has_class(nl, 'numeric-cell'):
            if re.search(r'[Aa]mount|[Pp]rice|[Cc]ost|[Rr]ate|[Rr]evenue|[Ff]ee|[Vv]alue|[Tt]otal|[Pp]ercent|[Ss]core|[Ww]eight|[Dd]istance', nl):
                nl = add_class(nl, 'numeric-cell')
                stats['numeric-cell'] = stats.get('numeric-cell', 0) + 1
        
        # 4. btn-outline-animate on <Button variant="outline" className="
        if '<Button' in nl and 'variant="outline"' in nl and 'className="' in nl and not has_class(nl, 'btn-outline-animate'):
            nl = add_class(nl, 'btn-outline-animate')
            stats['btn-outline-animate'] = stats.get('btn-outline-animate', 0) + 1
        
        # 5. input-focus-ring on <Input type="text/number/search" className="
        if '<Input' in nl and 'className="' in nl and not has_class(nl, 'input-focus-ring'):
            if 'type="text"' in nl or 'type="number"' in nl or 'type="search"' in nl:
                nl = add_class(nl, 'input-focus-ring')
                stats['input-focus-ring'] = stats.get('input-focus-ring', 0) + 1
        
        # 6. card-crud-lift: Find <Card className= that contains table in next few lines
        if '<Card className="' in nl and not has_class(nl, 'card-crud-lift') and not has_class(nl, 'glass-card'):
            # Check if next 3 lines have <Table
            if i + 3 < len(lines):
                lookahead = '\n'.join(lines[i+1:i+4])
                if '<Table' in lookahead:
                    nl = add_class(nl, 'card-crud-lift')
                    stats['card-crud-lift'] = stats.get('card-crud-lift', 0) + 1
        
        # 7. table-hover-highlight: Only on standalone <Table> (not <Table className= already)
        if nl.strip().startswith('<Table>') and not has_class(nl, 'table-hover-highlight'):
            nl = nl.replace('<Table>', '<Table className="table-hover-highlight">')
            stats['table-hover-highlight'] = stats.get('table-hover-highlight', 0) + 1
        elif '<Table className="' in nl and not has_class(nl, 'table-hover-highlight'):
            nl = add_class(nl, 'table-hover-highlight')
            stats['table-hover-highlight'] = stats.get('table-hover-highlight', 0) + 1
        
        new_lines.append(nl)
    
    # Pass 2: Wrap consecutive <Badge lines with chip-group
    result = []
    i = 0
    while i < len(new_lines):
        if '<Badge' in new_lines[i] and i > 0:
            start = i
            count = 0
            j = i
            while j < len(new_lines):
                if '<Badge' in new_lines[j] or '</Badge>' in new_lines[j]:
                    count += 1
                    j += 1
                elif new_lines[j].strip() == '' and j + 1 < len(new_lines) and '<Badge' in new_lines[j+1]:
                    j += 1
                else:
                    break
            if count >= 3:  # At least 3 Badge elements
                prev = result[-1] if result else ''
                if 'chip-group' not in prev:
                    result.append('<div className="chip-group">')
                    for k in range(start, j):
                        result.append(new_lines[k])
                    result.append('</div>')
                    stats['chip-group'] = stats.get('chip-group', 0) + 1
                    i = j
                    continue
        
        result.append(new_lines[i])
        i += 1
    
    new_content = '\n'.join(result)
    if new_content != original:
        with open(filepath, 'w') as f:
            f.write(new_content)
        return True
    return False

# Process all modules
files = sorted(glob.glob(os.path.join(MODULES_DIR, '*-view.tsx')))
modified = 0
for f in files:
    if process_module(f):
        modified += 1

print(f"R256 CSS application: {modified}/{len(files)} modules modified")
for k, v in sorted(stats.items()):
    print(f"  {k}: {v}")
