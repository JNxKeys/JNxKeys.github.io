import glob
import re

for filepath in glob.glob('*/index.html'):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            c = f.read()
        
        # In the original online code, the wa-fab button has inline styles that break it.
        # It looks like: style="position: fixed; bottom: 20px; right: 20px; ..."
        # I need to remove the style attribute entirely from <a class="wa-fab"...>
        
        new_c = re.sub(r'(<a class="wa-fab"[^>]*) style="[^"]*"', r'\1', c)
        
        if c != new_c:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_c)
            print(f"Fixed {filepath}")
    except Exception as e:
        print(f"Error on {filepath}: {e}")
