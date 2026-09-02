import glob
for f in glob.glob('*/index.html'):
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
        if 'wa-fab' in content and 'style=' in content:
            print(f'Check {f}')
