import glob
import re

for filepath in glob.glob('*/index.html'):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            c = f.read()
        
        # Remove any line that starts with .wa-fab
        lines = c.split('\n')
        new_lines = [l for l in lines if not l.strip().startswith('.wa-fab')]
        new_c = '\n'.join(new_lines)
        
        if c != new_c:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_c)
            print(f"Cleaned .wa-fab styles in {filepath}")
    except Exception as e:
        print(f"Error on {filepath}: {e}")
