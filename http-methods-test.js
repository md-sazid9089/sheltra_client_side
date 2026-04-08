#!/usr/bin/env node
const BASE_URL = 'http://localhost:8000/api';

async function comprehensiveHTTPTest() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║     SHELTRA API - COMPREHENSIVE HTTP METHODS TEST      ║');
  console.log('║          Testing GET, POST, PUT Methods                ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
  let results = { get: [], post: [], put: [], total: 0, passed: 0, failed: 0 };

  // Create test users for each role
  console.log('📋 Setting up test users...\n');
  const refugee = await createTestUser('refugee_http_test', 'refugee');
  const ngo = await createTestUser('ngo_http_test', 'ngo');
  const employer = await createTestUser('employer_http_test', 'employer');

  console.log('✅ Test users created\n');

  // ═══════════════════════════════════════════════════════════════════
  // SECTION 1: AUTHENTICATION ENDPOINTS
  // ═══════════════════════════════════════════════════════════════════

  console.log('═══════════════════════════════════════════════════════');
  console.log('🔐 AUTHENTICATION ENDPOINTS');
  console.log('═══════════════════════════════════════════════════════\n');

  // POST /auth/register
  await testEndpoint({
    name: 'POST /auth/register',
    method: 'POST',
    path: '/auth/register',
    headers,
    body: {
      name: `User ${Date.now()}`,
      email: `test${Date.now()}@sheltra.test`,
      password: 'Test123!',
      password_confirmation: 'Test123!',
      role: 'refugee'
    },
    expectedStatus: 201,
    type: 'post',
    results
  });

  // POST /auth/login
  await testEndpoint({
    name: 'POST /auth/login',
    method: 'POST',
    path: '/auth/login',
    headers,
    body: {
      email: refugee.email,
      password: 'Test123!'
    },
    expectedStatus: 200,
    type: 'post',
    results
  });

  // GET /auth/me
  await testEndpoint({
    name: 'GET /auth/me',
    method: 'GET',
    path: '/auth/me',
    headers: { 'Authorization': `Bearer ${refugee.token}`, 'Accept': 'application/json' },
    expectedStatus: 200,
    type: 'get',
    results,
    token: refugee.token
  });

  // ═══════════════════════════════════════════════════════════════════
  // SECTION 2: REFUGEE ENDPOINTS
  // ═══════════════════════════════════════════════════════════════════

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('👤 REFUGEE ENDPOINTS');
  console.log('═══════════════════════════════════════════════════════\n');

  // GET /refugee/profile
  await testEndpoint({
    name: 'GET /refugee/profile',
    method: 'GET',
    path: '/refugee/profile',
    headers: { 'Authorization': `Bearer ${refugee.token}`, 'Accept': 'application/json' },
    expectedStatus: 200,
    type: 'get',
    results
  });

  // POST /refugee/profile
  await testEndpoint({
    name: 'POST /refugee/profile',
    method: 'POST',
    path: '/refugee/profile',
    headers: { 'Authorization': `Bearer ${refugee.token}`, ...headers },
    body: {
      full_name: 'Test User',
      location: 'Berlin, Germany',
      phone: '+49123456789',
      bio: 'Developer looking for opportunities',
      skills: ['JavaScript', 'React', 'PHP'],
      education: 'Bachelor in Computer Science',
      work_experience: '5 years in web development',
      availability: 'immediate',
      languages: ['Arabic', 'English', 'German']
    },
    expectedStatus: 200,
    type: 'post',
    results
  });

  // PUT /refugee/profile
  await testEndpoint({
    name: 'PUT /refugee/profile',
    method: 'PUT',
    path: '/refugee/profile',
    headers: { 'Authorization': `Bearer ${refugee.token}`, ...headers },
    body: {
      full_name: 'Test User Updated',
      location: 'Munich, Germany',
      phone: '+49987654321',
      bio: 'Senior developer seeking new opportunities',
      skills: ['JavaScript', 'React', 'Node.js', 'Docker'],
      availability: '2_weeks'
    },
    expectedStatus: 200,
    type: 'put',
    results
  });

  // GET /refugee/opportunities
  await testEndpoint({
    name: 'GET /refugee/opportunities',
    method: 'GET',
    path: '/refugee/opportunities',
    headers: { 'Authorization': `Bearer ${refugee.token}`, 'Accept': 'application/json' },
    expectedStatus: 200,
    type: 'get',
    results
  });

  // GET /refugee/verification-status
  await testEndpoint({
    name: 'GET /refugee/verification-status',
    method: 'GET',
    path: '/refugee/verification-status',
    headers: { 'Authorization': `Bearer ${refugee.token}`, 'Accept': 'application/json' },
    expectedStatus: 200,
    type: 'get',
    results
  });

  // POST /refugee/generate-nid
  await testEndpoint({
    name: 'POST /refugee/generate-nid',
    method: 'POST',
    path: '/refugee/generate-nid',
    headers: { 'Authorization': `Bearer ${refugee.token}`, ...headers },
    body: {
      full_name: 'Test User',
      country: 'Syria',
      email: refugee.email
    },
    expectedStatus: 200,
    type: 'post',
    results
  });

  // POST /refugee/cv-analyze
  await testEndpoint({
    name: 'POST /refugee/cv-analyze',
    method: 'POST',
    path: '/refugee/cv-analyze',
    headers: { 'Authorization': `Bearer ${refugee.token}`, ...headers },
    body: {
      cv_text: 'Developer with 5 years experience in JavaScript and PHP',
      target_role: 'Senior Developer',
      target_country: 'Germany'
    },
    expectedStatus: 200,
    type: 'post',
    results
  });

  // POST /refugee/skills
  await testEndpoint({
    name: 'POST /refugee/skills',
    method: 'POST',
    path: '/refugee/skills',
    headers: { 'Authorization': `Bearer ${refugee.token}`, ...headers },
    body: {
      skills: ['JavaScript', 'React', 'Node.js', 'MySQL']
    },
    expectedStatus: 200,
    type: 'post',
    results
  });

  // GET /refugee/applications
  await testEndpoint({
    name: 'GET /refugee/applications',
    method: 'GET',
    path: '/refugee/applications',
    headers: { 'Authorization': `Bearer ${refugee.token}`, 'Accept': 'application/json' },
    expectedStatus: 200,
    type: 'get',
    results
  });

  // ═══════════════════════════════════════════════════════════════════
  // SECTION 3: NGO ENDPOINTS
  // ═══════════════════════════════════════════════════════════════════

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('🏢 NGO ENDPOINTS');
  console.log('═══════════════════════════════════════════════════════\n');

  // GET /ngo/cases
  await testEndpoint({
    name: 'GET /ngo/cases',
    method: 'GET',
    path: '/ngo/cases',
    headers: { 'Authorization': `Bearer ${ngo.token}`, 'Accept': 'application/json' },
    expectedStatus: 200,
    type: 'get',
    results
  });

  // GET /ngo/metrics
  await testEndpoint({
    name: 'GET /ngo/metrics',
    method: 'GET',
    path: '/ngo/metrics',
    headers: { 'Authorization': `Bearer ${ngo.token}`, 'Accept': 'application/json' },
    expectedStatus: 200,
    type: 'get',
    results
  });

  // ═══════════════════════════════════════════════════════════════════
  // SECTION 4: EMPLOYER ENDPOINTS
  // ═══════════════════════════════════════════════════════════════════

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('💼 EMPLOYER ENDPOINTS');
  console.log('═══════════════════════════════════════════════════════\n');

  // GET /employer/profile
  await testEndpoint({
    name: 'GET /employer/profile',
    method: 'GET',
    path: '/employer/profile',
    headers: { 'Authorization': `Bearer ${employer.token}`, 'Accept': 'application/json' },
    expectedStatus: 200,
    type: 'get',
    results
  });

  // POST /employer/profile
  await testEndpoint({
    name: 'POST /employer/profile',
    method: 'POST',
    path: '/employer/profile',
    headers: { 'Authorization': `Bearer ${employer.token}`, ...headers },
    body: {
      company_name: 'Tech Innovations GmbH',
      industry: 'Software Development',
      company_size: '11-50',
      location: 'Berlin, Germany',
      website: 'https://tech-innovations.de',
      phone: '+49301234567',
      description: 'Leading software development company focused on refugee employment',
      ethical_hiring_pledge: true,
      contact_email: 'hr@tech-innovations.de'
    },
    expectedStatus: 200,
    type: 'post',
    results
  });

  // PUT /employer/profile
  await testEndpoint({
    name: 'PUT /employer/profile',
    method: 'PUT',
    path: '/employer/profile',
    headers: { 'Authorization': `Bearer ${employer.token}`, ...headers },
    body: {
      company_name: 'Tech Solutions Europe',
      industry: 'Information Technology',
      company_size: '51-200',
      location: 'Munich, Germany',
      ethical_hiring_pledge: true,
      contact_email: 'careers@techsolutions.eu'
    },
    expectedStatus: 200,
    type: 'put',
    results
  });

  // GET /employer/jobs
  await testEndpoint({
    name: 'GET /employer/jobs',
    method: 'GET',
    path: '/employer/jobs',
    headers: { 'Authorization': `Bearer ${employer.token}`, 'Accept': 'application/json' },
    expectedStatus: 200,
    type: 'get',
    results
  });

  // POST /employer/jobs
  await testEndpoint({
    name: 'POST /employer/jobs',
    method: 'POST',
    path: '/employer/jobs',
    headers: { 'Authorization': `Bearer ${employer.token}`, ...headers },
    body: {
      title: 'Senior Backend Developer',
      description: 'We are seeking an experienced backend developer with 5+ years of experience in PHP and MySQL to join our growing team. You will work on scalable applications serving thousands of users. The ideal candidate is familiar with Laravel, REST APIs, and Docker containerization. Fluency in English is required.',
      role_type: 'full_time',
      location: 'Berlin, Germany',
      salary_min: 55000,
      salary_max: 85000,
      required_skills: ['PHP', 'MySQL', 'REST API', 'Docker'],
      preferred_skills: ['Laravel', 'AWS', 'Agile'],
      experience_years: 5,
      num_positions: 2
    },
    expectedStatus: 201,
    type: 'post',
    results
  });

  // GET /employer/talent
  await testEndpoint({
    name: 'GET /employer/talent',
    method: 'GET',
    path: '/employer/talent',
    headers: { 'Authorization': `Bearer ${employer.token}`, 'Accept': 'application/json' },
    expectedStatus: 200,
    type: 'get',
    results
  });

  // GET /employer/applications
  await testEndpoint({
    name: 'GET /employer/applications',
    method: 'GET',
    path: '/employer/applications',
    headers: { 'Authorization': `Bearer ${employer.token}`, 'Accept': 'application/json' },
    expectedStatus: 200,
    type: 'get',
    results
  });

  // GET /employer/metrics
  await testEndpoint({
    name: 'GET /employer/metrics',
    method: 'GET',
    path: '/employer/metrics',
    headers: { 'Authorization': `Bearer ${employer.token}`, 'Accept': 'application/json' },
    expectedStatus: 200,
    type: 'get',
    results
  });

  // ═══════════════════════════════════════════════════════════════════
  // SECTION 5: SHARED ENDPOINTS
  // ═══════════════════════════════════════════════════════════════════

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('🔄 SHARED ENDPOINTS (All Authenticated Users)');
  console.log('═══════════════════════════════════════════════════════\n');

  // GET /user
  await testEndpoint({
    name: 'GET /user',
    method: 'GET',
    path: '/user',
    headers: { 'Authorization': `Bearer ${refugee.token}`, 'Accept': 'application/json' },
    expectedStatus: 200,
    type: 'get',
    results
  });

  // ═══════════════════════════════════════════════════════════════════
  // SUMMARY
  // ═══════════════════════════════════════════════════════════════════

  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║              COMPREHENSIVE TEST RESULTS                 ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  const getCount = results.get.length;
  const postCount = results.post.length;
  const putCount = results.put.length;

  console.log('📊 TOTAL ENDPOINTS TESTED:');
  console.log(`   GET  Endpoints: ${getCount} ${getCount > 0 ? results.get.filter(r => r.passed).length === getCount ? '✅' : '⚠️' : ''}`);
  console.log(`   POST Endpoints: ${postCount} ${postCount > 0 ? results.post.filter(r => r.passed).length === postCount ? '✅' : '⚠️' : ''}`);
  console.log(`   PUT  Endpoints: ${putCount} ${putCount > 0 ? results.put.filter(r => r.passed).length === putCount ? '✅' : '⚠️' : ''}`);

  const totalTests = getCount + postCount + putCount;
  const totalPassed = results.get.filter(r => r.passed).length + 
                      results.post.filter(r => r.passed).length + 
                      results.put.filter(r => r.passed).length;

  console.log(`\n📈 OVERALL RESULTS:`);
  console.log(`   Total Tests: ${totalTests}`);
  console.log(`   ✅ Passed: ${totalPassed}`);
  console.log(`   ❌ Failed: ${totalTests - totalPassed}`);
  console.log(`   Success Rate: ${Math.round((totalPassed / totalTests) * 100)}%\n`);

  // Details
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 DETAILED BREAKDOWN:\n');

  console.log('✅ GET ENDPOINTS:');
  results.get.forEach(r => {
    const icon = r.passed ? '✓' : '✗';
    console.log(`   ${icon} ${r.name.padEnd(40)} [${r.status}]`);
  });

  console.log('\n✅ POST ENDPOINTS:');
  results.post.forEach(r => {
    const icon = r.passed ? '✓' : '✗';
    console.log(`   ${icon} ${r.name.padEnd(40)} [${r.status}]`);
  });

  console.log('\n✅ PUT ENDPOINTS:');
  results.put.forEach(r => {
    const icon = r.passed ? '✓' : '✗';
    console.log(`   ${icon} ${r.name.padEnd(40)} [${r.status}]`);
  });

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (totalPassed === totalTests) {
    console.log('\n🎉 ALL HTTP METHODS WORKING PERFECTLY! 🎉\n');
  } else {
    console.log(`\n⚠️  ${totalTests - totalPassed} endpoint(s) need attention\n`);
  }
}

async function createTestUser(prefix, role) {
  const email = `${prefix}_${Date.now()}@sheltra.test`;
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

async function testEndpoint(config) {
  try {
    const options = {
      method: config.method,
      headers: config.headers
    };

    if (config.body) {
      options.body = JSON.stringify(config.body);
    }

    const response = await fetch(`${BASE_URL}${config.path}`, options);
    const passed = response.status === config.expectedStatus;
    const status = response.status;

    const result = {
      name: config.name,
      status,
      passed,
      expected: config.expectedStatus
    };

    config.results[config.type].push(result);
    config.results.total++;

    if (passed) {
      config.results.passed++;
      console.log(`✓ ${config.name.padEnd(40)} [${status}]`);
    } else {
      config.results.failed++;
      console.log(`✗ ${config.name.padEnd(40)} [Got: ${status}, Expected: ${config.expectedStatus}]`);
    }
  } catch (error) {
    console.log(`✗ ${config.name.padEnd(40)} [ERROR: ${error.message}]`);
    config.results[config.type].push({
      name: config.name,
      status: 'ERROR',
      passed: false
    });
    config.results.failed++;
  }
}

comprehensiveHTTPTest().catch(e => console.error('Fatal Error:', e.message));
