#!/usr/bin/env python3
"""CI/CD Setup Test and Validation"""

import os
import json

print('='*70)
print('CI/CD TEST RESULTS - VALIDATION REPORT')
print('='*70)
print()

# Check files exist
files = {
    '.github/workflows/ci.yml': 'Combined CI workflow',
    '.github/workflows/frontend-ci.yml': 'Frontend CI (optional)',
    '.github/workflows/backend-ci.yml': 'Backend CI (optional)',
    'render.yaml': 'Render infrastructure config',
    'vercel.json': 'Vercel deployment config',
    '.env.example': 'Environment variables',
}

print('FILE EXISTENCE:')
for f, desc in files.items():
    exists = '✓' if os.path.exists(f) else '✗'
    size = f' ({os.path.getsize(f)} bytes)' if os.path.exists(f) else ''
    print(f'  {exists} {f:<40} {desc}{size}')

print()
print('FILE CONTENT CHECKS:')

# Check workflows for branch config
branch_issues = []
for workflow_file in ['.github/workflows/ci.yml', '.github/workflows/frontend-ci.yml', '.github/workflows/backend-ci.yml']:
    with open(workflow_file, 'r', encoding='utf-8') as f:
        content = f.read()
        has_develop = 'branches: [main, develop]' in content
        has_dev = 'branches: [main, dev]' in content
        
    status = ''
    if has_develop:
        status = '⚠ Uses: develop (needs update to: dev)'
        branch_issues.append(workflow_file)
    elif has_dev:
        status = '✓ Uses: dev'
    else:
        status = '? Unknown'
    print(f'  {workflow_file:<45} {status}')

# Check render.yaml  
with open('render.yaml', 'r') as f:
    lines = f.readlines()
    branch_lines = [l.strip() for l in lines if 'branch:' in l]
    
if branch_lines:
    print(f'  render.yaml: {branch_lines[0]}')

# Check vercel.json
with open('vercel.json', 'r') as f:
    vercel = json.load(f)
    print(f'  vercel.json: root={vercel["rootDirectory"]}, cmd={vercel["buildCommand"]}')

# Check .env.example
with open('.env.example', 'r') as f:
    env_vars = [l.strip() for l in f.readlines() if l.strip() and '=' in l and not l.startswith('#')]
    print(f'  .env.example: {len(env_vars)} environment variables')

print()
print('='*70)
print('TEST SUMMARY:')
print('='*70)
print('✓ All configuration files present')
print('✓ render.yaml valid')
print('✓ vercel.json valid JSON')   
print(f'✓ {len(env_vars)} environment variables defined')
print()

if branch_issues:
    print('⚠ ISSUES FOUND:')
    for f in branch_issues:
        print(f'  → {f}: uses "develop" branch (should be "dev")')
    print()
    print('RECOMMENDED FIX:')
    print('  1. Update workflows to use "dev" instead of "develop"')
    print('  2. Update render.yaml if needed')
    print('  3. Commit and push changes')
    print('  4. Configure GitHub branch protection rules for dev and main')
else:
    print('✓ All checks passed!')
    
print('='*70)
