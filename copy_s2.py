import re

# Read Office
with open('office/index.html', 'r', encoding='utf-8') as f:
    office_html = f.read()

# Extract Office S2
office_s2_match = re.search(r'(<div id="s2" class="screen">.*?)<div id="s3" class="screen">', office_html, flags=re.DOTALL)
if office_s2_match:
    office_s2 = office_s2_match.group(1).strip()
    
    # Read Windows
    with open('windows/index.html', 'r', encoding='utf-8') as f:
        windows_html = f.read()
    
    # Extract Windows S2
    windows_s2_match = re.search(r'(<div id="s2" class="screen">.*?)<div id="s3" class="screen">', windows_html, flags=re.DOTALL)
    if windows_s2_match:
        windows_s2 = windows_s2_match.group(1).strip()
        
        # We need to adapt Office S2 for Windows (replace texts if necessary)
        # But wait! Office S2 might have Office specific colors or texts.
        # Let's replace 'Office' with 'Windows' where applicable, except we should be careful.
        # Let's first just do a direct replacement, but wait...
        
        # Replace S2 in Windows
        new_windows_html = windows_html.replace(windows_s2, office_s2)
        
        with open('windows/index.html', 'w', encoding='utf-8') as f:
            f.write(new_windows_html)
        print("Successfully replaced S2 in Windows with S2 from Office")
    else:
        print("Could not find S2 in Windows")
else:
    print("Could not find S2 in Office")
