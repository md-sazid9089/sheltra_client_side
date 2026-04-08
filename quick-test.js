#!/usr/bin/env node
const BASE_URL = 'http://localhost:8000/api';

async function test() {
  console.log('\n=== SHELTRA API TEST SUMMARY ===\n');

  // Test register
  const testEmail = `test${Date.now()}@sheltra.local`;
  const regRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      name: 'Test', email: testEmail, password: 'Test123!',
      password_confirmation: 'Test123!', role: 'refugee'
    })
  }).then(r => r.json());

  console.log('✓ Register:', regRes.status === 200 || regRes.success ? 'PASS' : 'FAIL');
  
  const token = regRes.token;

  // Test login  
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: 'Test123!' })
  }).then(r => r.json());

  console.log('✓ Login:', loginRes.token ? 'PASS' : 'FAIL');

  // Test NID
  const nidRes = await fetch(`${BASE_URL}/refugee/generate-nid`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ full_name: 'Test', country: 'Syria', email: testEmail })
  }).then(r => r.json());

  console.log('✓ NID Generation:', nidRes.data?.nidNumber ? `PASS (${nidRes.data.nidNumber})` : 'FAIL');

  // Test CV
  const cvRes = await fetch(`${BASE_URL}/refugee/cv-analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      cv_text: 'Software developer with 5 years experience',
      target_role: 'Developer', target_country: 'Germany'
    })
  }).then(r => r.json());

  console.log('✓ CV Analysis:', cvRes.data?.score ? `PASS (Score: ${cvRes.data.score}/100)` : 'FAIL');

  // Test Profile
  const profileRes = await fetch(`${BASE_URL}/refugee/profile`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
  }).then(r => ({ status: r.status }));

  console.log('✓ Get Profile:', profileRes.status === 200 ? 'PASS' : `${profileRes.status}`);

  // Test Opportunities
  const oppRes = await fetch(`${BASE_URL}/refugee/opportunities`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
  }).then(r => ({ status: r.status }));

  console.log('✓ Get Opportunities:', oppRes.status === 200 ? 'PASS' : `${oppRes.status}`);

  // Test Permission (refugee accessing NGO endpoints)
  const ngoRes = await fetch(`${BASE_URL}/ngo/cases`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
  }).then(r => ({ status: r.status }));

  console.log('✓ Permission Test (should be 403):', ngoRes.status === 403 ? 'PASS' : `FAIL (${ngoRes.status})`);

  console.log('\n✅ API TEST COMPLETE\n');
}

test().catch(e => console.error('Error:', e.message));
