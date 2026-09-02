import glob
import re

for filepath in glob.glob('*/index.html'):
    if filepath == 'windows/index.html':
        continue
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            c = f.read()
        
        # In other files, the inline style exists on the <a> or it has some specific HTML.
        # Let's just find <a ... class="wa-fab"...> and replace the whole tag and its svg with a clean version?
        # Let's just see if they have style attributes.
        new_c = re.sub(r'style="[^"]*"', '', c) # this might be too aggressive!
        pass
    except:
        pass
