#!/usr/bin/env node
const BASE_URL = 'http://localhost:8000/api';

async function debug() {
  console.log('\n=== ROLE DEBUGGING ===\n');

  // Step 1: Register new user
  const testEmail = `test${Date.now()}@sheltra.local`;
  const regRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test User',
      email: testEmail,
      password: 'Test123!',
      password_confirmation: 'Test123!',
      role: 'refugee'
    })
  }).then(r => r.json());

  console.log('1. Registration Response:');
  console.log('   Status:', regRes.success ? '✓' : '✗');
  console.log('   User Role (from register):', regRes.user?.role);
  console.log('   Token:', regRes.token ? 'PRESENT' : 'MISSING');
  
  const token = regRes.token;

  // Step 2: Check user endpoint
  const userRes = await fetch(`${BASE_URL}/user`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json());

  console.log('\n2. User Endpoint (/api/user):');
  console.log('   Role:', userRes.data?.role);
  console.log('   Full Response:', JSON.stringify(userRes, null, 2));

  // Step 3: Check auth/me endpoint
  const meRes = await fetch(`${BASE_URL}/auth/me`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json());

  console.log('\n3. Auth Me Endpoint (/api/auth/me):');
  console.log('   Role:', meRes.data?.role);
  console.log('   Full Response:', JSON.stringify(meRes, null, 2));

  // Step 4: Try to access refugee endpoint (should work)
  const refugeeRes = await fetch(`${BASE_URL}/refugee/profile`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => ({ status: r.status, json: r.json() }))
    .then(r => r.json().then(j => ({ status: r.status, data: j })));

  console.log('\n4. Refugee Profile Endpoint (should be 200):');
  console.log('   Status:', refugeeRes.status);
  console.log('   Message:', refugeeRes.data?.message);

  // Step 5: Try to access NGO endpoint (should be 403)
  const ngoRes = await fetch(`${BASE_URL}/ngo/cases`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => ({ status: r.status, json: r.json() }))
    .then(r => r.json().then(j => ({ status: r.status, data: j })));

  console.log('\n5. NGO Cases Endpoint (should be 403):');
  console.log('   Status:', ngoRes.status);
  console.log('   Message:', ngoRes.data?.message);

  console.log('\n✅ DEBUG COMPLETE\n');
}

debug().catch(e => console.error('Error:', e.message));
