import re

with open('candidate_page_bundle.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Find strings, APIs, fetch, post
urls = re.findall(r'"([^"]*api[^"]*)"', code)
print('API strings found:', set(urls))

# Find error strings or validations
errors = re.findall(r'"([^"]*(?:required|error|invalid|failed|success|submit|deadline|deliverable|token)[^"]*)"', code, re.IGNORECASE)
print(f'Found {len(set(errors))} candidate workflow strings:')
for e in sorted(set(errors)):
    if len(e) < 100:
        print(' -', e)

# Look for fetch or submission method
fetches = re.findall(r'fetch\([^)]+\)', code)
print(f"\nFetch calls found: {len(fetches)}")
for fc in fetches[:5]:
    print(' ', fc[:150])
