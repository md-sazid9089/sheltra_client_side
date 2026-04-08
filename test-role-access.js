#!/usr/bin/env node

const BASE_URL = 'http://localhost:8000/api';

async function testRoleAccess() {
  console.log('\n🔐 TESTING ROLE-BASED ACCESS CONTROL\n');

  // Create a refugee user
  const testEmail = `refugee${Date.now()}@test.local`;
  const regRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test Refugee',
      email: testEmail,
      password: 'Test123!',
      password_confirmation: 'Test123!',
      role: 'refugee'
    })
  }).then(r => r.json());

  console.log('✓ Created refugee user:', testEmail);
  const refugeeToken = regRes.token;
  console.log('✓ Refugee token:', refugeeToken.substring(0, 20) + '...');

  // Test 1: Refugee accessing own endpoints (should work)
  console.log('\n[Test 1] Refugee accessing own profile endpoint');
  const profileRes = await fetch(`${BASE_URL}/refugee/profile`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${refugeeToken}` }
  });
  console.log(`  Status: ${profileRes.status} ${profileRes.status === 200 ? '✓ PASS' : '✗ FAIL'}`);

  // Test 2: Refugee accessing NGO endpoints (should be 403)
  console.log('\n[Test 2] Refugee accessing /ngo/cases (should be 403)');
  const ngoRes = await fetch(`${BASE_URL}/ngo/cases`, {
    method: 'GET',
    headers: { 
      'Authorization': `Bearer ${refugeeToken}`,
      'Accept': 'application/json'
    }
  });
  const ngoData = await ngoRes.json();
  
  console.log(`  Status: ${ngoRes.status}`);
  console.log(`  Expected: 403`);
  console.log(`  Result: ${ngoRes.status === 403 ? '✓ PASS' : '✗ FAIL'}`);
  
  if (ngoRes.status !== 403) {
    console.log('\n  ⚠️ ISSUE DETECTED:');
    console.log(`     Refugee got ${ngoRes.status} instead of 403`);
    console.log(`     Response:`, JSON.stringify(ngoData, null, 2));
  }

  // Test 3: Refugee accessing employer endpoints (should be 403)
  console.log('\n[Test 3] Refugee accessing /employer/jobs (should be 403)');
  const empRes = await fetch(`${BASE_URL}/employer/jobs`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${refugeeToken}` }
  });
  console.log(`  Status: ${empRes.status} ${empRes.status === 403 ? '✓ PASS' : '✗ FAIL'}`);

  // Test 4: Check user role in token
  console.log('\n[Test 4] Verify user role in system');
  const meRes = await fetch(`${BASE_URL}/auth/me`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${refugeeToken}` }
  }).then(r => r.json());
  
  console.log(`  User role: ${meRes.data?.role}`);
  console.log(`  Expected: refugee`);
  console.log(`  Result: ${meRes.data?.role === 'refugee' ? '✓ PASS' : '✗ FAIL'}`);

  console.log('\n✅ Role-based access test complete\n');
}

testRoleAccess().catch(e => console.error('Error:', e.message));
