#!/usr/bin/env node
const BASE_URL = 'http://localhost:8000/api';

async function comprehensiveTest() {
  console.log('\n=== SHELTRA COMPREHENSIVE API TEST ===\n');

  const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };

  // 1. Register three different users (refugee, NGO, employer)
  console.log('Creating test users...\n');
  
  const refugeeUser = await createUser('test_refugee', 'refugee');
  const ngoUser = await createUser('test_ngo', 'ngo');
  const employerUser = await createUser('test_employer', 'employer');

  console.log('✓ Users created');
  console.log(`  - Refugee: ${refugeeUser.token.substring(0, 20)}...`);
  console.log(`  - NGO: ${ngoUser.token.substring(0, 20)}...`);
  console.log(`  - Employer: ${employerUser.token.substring(0, 20)}...\n`);

  let passed = 0;
  let failed = 0;

  // 2. Test refugee endpoints with refugee user (should PASS 200)
  console.log('Testing Refugee Endpoints:');
  const tests = [
    { name: 'GET /refugee/profile', method: 'GET', url: '/refugee/profile', token: refugeeUser.token, expectedStatus: 200 },
    { name: 'GET /refugee/opportunities', method: 'GET', url: '/refugee/opportunities', token: refugeeUser.token, expectedStatus: 200 },
    { name: 'POST /refugee/generate-nid', method: 'POST', url: '/refugee/generate-nid', token: refugeeUser.token, expectedStatus: 200, body: { full_name: 'Test', country: 'Syria', email: refugeeUser.email } },
    { name: 'POST /refugee/cv-analyze', method: 'POST', url: '/refugee/cv-analyze', token: refugeeUser.token, expectedStatus: 200, body: { cv_text: 'Developer with experience', target_role: 'Engineer', target_country: 'Germany' } },
    
    // 3. Test refugee accessing NGO endpoints (should FAIL 403)
    { name: 'GET /ngo/cases (refugee - should deny)', method: 'GET', url: '/ngo/cases', token: refugeeUser.token, expectedStatus: 403 },
    { name: 'GET /employer/profile (refugee - should deny)', method: 'GET', url: '/employer/profile', token: refugeeUser.token, expectedStatus: 403 },

    // 4. Test NGO endpoints with NGO user (should PASS 200)
    { name: 'GET /ngo/cases (NGO)', method: 'GET', url: '/ngo/cases', token: ngoUser.token, expectedStatus: 200 },
    { name: 'GET /ngo/metrics (NGO)', method: 'GET', url: '/ngo/metrics', token: ngoUser.token, expectedStatus: 200 },

    // 5. Test employer endpoints with employer user (should PASS 200)
    { name: 'GET /employer/profile (Employer)', method: 'GET', url: '/employer/profile', token: employerUser.token, expectedStatus: 200 },
    { name: 'GET /employer/jobs (Employer)', method: 'GET', url: '/employer/jobs', token: employerUser.token, expectedStatus: 200 },
    { name: 'GET /employer/talent (Employer)', method: 'GET', url: '/employer/talent', token: employerUser.token, expectedStatus: 200 },
  ];

  for (const test of tests) {
    const result = await runTest(test);
    if (result.passed) {
      console.log(`  ✓ ${test.name}`);
      passed++;
    } else {
      console.log(`  ✗ ${test.name} - Got ${result.status}, expected ${test.expectedStatus}`);
      failed++;
    }
  }

  console.log(`\n=== RESULTS ===`);
  console.log(`✅ Passed: ${passed}/${tests.length}`);
  console.log(`❌ Failed: ${failed}/${tests.length}`);

  if (failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED!\n');
  }
}

async function createUser(prefix, role) {
  const email = `${prefix}_${Date.now()}@sheltra.local`;
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      name: `Test ${role}`,
      email,
      password: 'Test123!',
      password_confirmation: 'Test123!',
      role
    })
  }).then(r => r.json());

  return { token: res.token, email };
}

async function runTest(test) {
  try {
    const options = {
      method: test.method,
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${test.token}`
      }
    };

    if (test.body) {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(test.body);
    }

    const res = await fetch(`${BASE_URL}${test.url}`, options);
    const passed = res.status === test.expectedStatus;
    return { passed, status: res.status };
  } catch (e) {
    return { passed: false, status: 'ERROR', error: e.message };
  }
}

comprehensiveTest().catch(e => console.error('Error:', e.message));
