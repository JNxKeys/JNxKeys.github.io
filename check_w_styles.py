with open('windows/index.html', 'r', encoding='utf-8') as f:
    c = f.read()

start_idx = c.find('.trust-hero {')
end_idx = c.find('</style>', start_idx)
print(c[start_idx:end_idx])
