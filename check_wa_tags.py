import glob, re
for f in glob.glob('*/index.html'):
    with open(f, 'r', encoding='utf-8') as file:
        match = re.search(r'<a[^>]*class="wa-fab"[^>]*>', file.read())
        if match and 'style' in match.group(0):
            print(f'{f}: {match.group(0)}')
