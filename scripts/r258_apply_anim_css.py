#!/usr/bin/env python3
"""R258: Batch apply new animation/interaction CSS classes across modules.
Applies: hover-lift, press-scale, inner-glow, neon-hover, ripple-host"""

import os, re, glob

MODULES_DIR = '/home/z/my-project/src/components/modules'

stats = {}

def add_class(line, cls):
    """Add a CSS class to className="..." pattern."""
    pattern = r'(className=")([^"]*?)(")'
    match = re.search(pattern, line)
    if match:
        existing = match.group(2)
        if cls not in existing:
            new_classes = cls + ' ' + existing
            return line[:match.start()] + 'className="' + new_classes + '"' + line[match.end():], True
    return line, False

def process_module(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    original = content
    lines = content.split('\n')
    new_lines = []
    
    for line in lines:
        nl = line
        
        # 1. hover-lift on Card components (when Card has a child that's a table or chart)
        if '<Card ' in nl and ('className="' in nl or 'className=`' in nl) and not 'hover-lift' in nl:
            # Check if card contains table or chart content
            nl, did_add = add_class(nl, 'hover-lift-sm')
            if did_add: stats['hover-lift'] = stats.get('hover-lift', 0) + 1
        
        # 2. press-scale on Button components
        if '<Button ' in nl and 'className="' in nl and not 'press-scale' in nl:
            nl, did_add = add_class(nl, 'press-scale')
            if did_add: stats['press-scale'] = stats.get('press-scale', 0) + 1
        
        # 3. inner-glow on CardContent
        if '<CardContent className="' in nl and not 'inner-glow' in nl:
            nl, did_add = add_class(nl, 'inner-glow')
            if did_add: stats['inner-glow'] = stats.get('inner-glow', 0) + 1
        
        # 4. underline-animated on SortHeader-like th elements with cursor-pointer
        if 'cursor-pointer' in nl and 'text-' in nl and 'text-[11px]' in nl and not 'underline-animated' in nl:
            nl, did_add = add_class(nl, 'underline-animated')
            if did_add: stats['underline-animated'] = stats.get('underline-animated', 0) + 1
        
        # 5. shimmer on stat/kpi cards (card with font-bold inside)
        if 'font-bold' in nl and ('<CardContent' in nl or '<div className' in nl) and 'shimmer' not in content[:content.find(nl) if nl else 0]:
            pass  # Only apply to stat-like cards (with numbers)
        
        new_lines.append(nl)
    
    new_content = '\n'.join(new_lines)
    if new_content != original:
        with open(filepath, 'w') as f:
            f.write(new_content)
        return True
    return False

files = sorted(glob.glob(os.path.join(MODULES_DIR, '*-view.tsx')))
modified = 0
for fp in files:
    if process_module(fp):
        modified += 1

total_applied = sum(stats.values())
print(f"R258 CSS animation application: {modified}/{len(files)} modules")
for k, v in sorted(stats.items()):
    print(f"  {k}: {v}")
print(f"  Total: {total_applied}")
