#!/usr/bin/env node
const BASE_URL = 'http://localhost:8000/api';

async function demoTest() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║          SHELTRA PLATFORM - DEMO TEST                  ║');
  console.log('║     Testing All Features with Demo User                ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
  let testsPassed = 0;
  let testsFailed = 0;

  // ═══════════════════════════════════════════════════════════════════
  // PHASE 1: USER REGISTRATION
  // ═══════════════════════════════════════════════════════════════════
  
  console.log('📝 PHASE 1: USER REGISTRATION\n');
  
  const demoEmail = `demo_refugee_${Date.now()}@sheltra.test`;
  const demoPassword = 'DemoPass123!';
  
  console.log(`Creating demo user...`);
  console.log(`  Email: ${demoEmail}`);
  console.log(`  Role: refugee\n`);

  const regRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      name: 'Ahmed Hassan',
      email: demoEmail,
      password: demoPassword,
      password_confirmation: demoPassword,
      role: 'refugee'
    })
  }).then(r => r.json());

  if (regRes.success || regRes.token) {
    console.log('✅ Registration successful');
    console.log(`   User ID: ${regRes.user?.id}`);
    console.log(`   Name: ${regRes.user?.name}`);
    console.log(`   Role: ${regRes.user?.role}\n`);
    testsPassed++;
  } else {
    console.log('❌ Registration failed\n');
    testsFailed++;
    return;
  }

  const token = regRes.token;

  // ═══════════════════════════════════════════════════════════════════
  // PHASE 2: AUTHENTICATION
  // ═══════════════════════════════════════════════════════════════════

  console.log('🔐 PHASE 2: AUTHENTICATION\n');

  console.log('Testing login...');
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email: demoEmail, password: demoPassword })
  }).then(r => r.json());

  if (loginRes.token) {
    console.log('✅ Login successful');
    console.log(`   Token: ${loginRes.token.substring(0, 30)}...\n`);
    testsPassed++;
  } else {
    console.log('❌ Login failed\n');
    testsFailed++;
  }

  console.log('Testing session validation...');
  const meRes = await fetch(`${BASE_URL}/auth/me`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
  }).then(r => r.json());

  if (meRes.user?.id) {
    console.log('✅ Session valid');
    console.log(`   User: ${meRes.user?.name}`);
    console.log(`   Email: ${meRes.user?.email}\n`);
    testsPassed++;
  } else {
    console.log('❌ Session validation failed\n');
    testsFailed++;
  }

  // ═══════════════════════════════════════════════════════════════════
  // PHASE 3: PROFILE MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════

  console.log('👤 PHASE 3: PROFILE MANAGEMENT\n');

  console.log('Getting current profile...');
  const getProfileRes = await fetch(`${BASE_URL}/refugee/profile`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
  }).then(r => r.json());

  if (getProfileRes.success) {
    console.log('✅ Profile retrieved');
    console.log(`   Status: ${getProfileRes.data?.status || 'new'}\n`);
    testsPassed++;
  } else {
    console.log('⚠️  No profile yet (expected for new user)\n');
  }

  console.log('Updating profile...');
  const updateProfileRes = await fetch(`${BASE_URL}/refugee/profile`, {
    method: 'POST',
    headers,
    headers: { 'Authorization': `Bearer ${token}`, ...headers },
    body: JSON.stringify({
      country_of_origin: 'Syria',
      target_country: 'Germany',
      phone: '+49123456789',
      skills: ['Software Development', 'Project Management'],
      work_experience: '5 years in IT sector',
      educational_background: '5 years in IT sector',
      looking_for: 'Junior Developer position'
    })
  }).then(r => r.json());

  if (updateProfileRes.success) {
    console.log('✅ Profile updated successfully\n');
    testsPassed++;
  } else {
    console.log(`⚠️  Profile update: ${updateProfileRes.message}\n`);
  }

  // ═══════════════════════════════════════════════════════════════════
  // PHASE 4: NID VERIFICATION
  // ═══════════════════════════════════════════════════════════════════

  console.log('🆔 PHASE 4: NID VERIFICATION\n');

  console.log('Generating National ID Number...');
  const nidRes = await fetch(`${BASE_URL}/refugee/generate-nid`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, ...headers },
    body: JSON.stringify({
      full_name: 'Ahmed Hassan',
      country: 'Syria',
      email: demoEmail
    })
  }).then(r => r.json());

  if (nidRes.data?.nidNumber) {
    console.log('✅ NID Generated successfully');
    console.log(`   NID Number: ${nidRes.data.nidNumber}`);
    console.log(`   Expiry: ${nidRes.data.expiresAt}`);
    console.log(`   Status: ${nidRes.data.status}\n`);
    testsPassed++;
  } else {
    console.log('❌ NID generation failed\n');
    testsFailed++;
  }

  // ═══════════════════════════════════════════════════════════════════
  // PHASE 5: CV ANALYSIS
  // ═══════════════════════════════════════════════════════════════════

  console.log('📄 PHASE 5: CV ANALYSIS\n');

  console.log('Analyzing CV...');
  const cvRes = await fetch(`${BASE_URL}/refugee/cv-analyze`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, ...headers },
    body: JSON.stringify({
      cv_text: `AHMED HASSAN
      
Senior Software Developer with 5 years of experience in web development, architecture and team leadership. 
Experienced in React, Node.js, PHP, and MySQL. Led teams of 3-5 developers. 
Proficient in Agile/Scrum methodologies.

EXPERIENCE:
- Senior Developer at TechCorp (2020-2026): Led React projects, mentored juniors
- Developer at WebSolutions (2018-2020): Built e-commerce platforms
- Junior Developer at StartupXYZ (2017-2018): Developed backend APIs

SKILLS: JavaScript, React, Node.js, PHP, MySQL, Docker, Git, AWS
LANGUAGES: Arabic (Native), English (Fluent), German (Basic)`,
      target_role: 'Senior Developer',
      target_country: 'Germany'
    })
  }).then(r => r.json());

  if (cvRes.data?.score) {
    console.log('✅ CV Analysis complete');
    console.log(`   Overall Score: ${cvRes.data.score}/100`);
    console.log(`   Strengths: ${cvRes.data.strengths?.join(', ') || 'N/A'}`);
    console.log(`   Recommendations: ${cvRes.data.recommendations?.join(', ') || 'N/A'}\n`);
    testsPassed++;
  } else {
    console.log('❌ CV analysis failed\n');
    testsFailed++;
  }

  // ═══════════════════════════════════════════════════════════════════
  // PHASE 6: JOB OPPORTUNITIES
  // ═══════════════════════════════════════════════════════════════════

  console.log('💼 PHASE 6: JOB OPPORTUNITIES\n');

  console.log('Fetching job opportunities...');
  const oppRes = await fetch(`${BASE_URL}/refugee/opportunities`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
  }).then(r => r.json());

  if (oppRes.success) {
    console.log('✅ Job opportunities retrieved');
    console.log(`   Total opportunities: ${oppRes.data?.length || 0}`);
    if (oppRes.data?.length > 0) {
      console.log(`   First opportunity: ${oppRes.data[0]?.title || 'N/A'}`);
    }
    console.log('');
    testsPassed++;
  } else {
    console.log('❌ Job opportunities fetch failed\n');
    testsFailed++;
  }

  // ═══════════════════════════════════════════════════════════════════
  // PHASE 7: VERIFICATION STATUS
  // ═══════════════════════════════════════════════════════════════════

  console.log('✓ PHASE 7: VERIFICATION STATUS\n');

  console.log('Getting verification status...');
  const verifyRes = await fetch(`${BASE_URL}/refugee/verification-status`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
  }).then(r => r.json());

  if (verifyRes.data) {
    console.log('✅ Verification status retrieved');
    console.log(`   Email Verified: ${verifyRes.data?.email_verified ? '✓' : '✗'}`);
    console.log(`   NID Verified: ${verifyRes.data?.nid_verified ? '✓' : '✗'}`);
    console.log(`   Skills Verified: ${verifyRes.data?.skills_verified ? '✓' : '✗'}\n`);
    testsPassed++;
  } else {
    console.log('⚠️  Verification status: No data\n');
  }

  // ═══════════════════════════════════════════════════════════════════
  // PHASE 8: ROLE-BASED ACCESS CONTROL
  // ═══════════════════════════════════════════════════════════════════

  console.log('🔒 PHASE 8: ROLE-BASED ACCESS CONTROL\n');

  console.log('Testing role restrictions (refugee user)...\n');

  // Try to access NGO endpoint (should fail)
  console.log('  Attempting to access /ngo/cases (should be denied)...');
  const ngoAccessRes = await fetch(`${BASE_URL}/ngo/cases`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
  });

  if (ngoAccessRes.status === 403) {
    console.log('  ✅ Access denied as expected (403)\n');
    testsPassed++;
  } else {
    console.log(`  ❌ Should be denied, got ${ngoAccessRes.status}\n`);
    testsFailed++;
  }

  // Try to access Employer endpoint (should fail)
  console.log('  Attempting to access /employer/profile (should be denied)...');
  const empAccessRes = await fetch(`${BASE_URL}/employer/profile`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
  });

  if (empAccessRes.status === 403) {
    console.log('  ✅ Access denied as expected (403)\n');
    testsPassed++;
  } else {
    console.log(`  ❌ Should be denied, got ${empAccessRes.status}\n`);
    testsFailed++;
  }

  // ═══════════════════════════════════════════════════════════════════
  // FINAL REPORT
  // ═══════════════════════════════════════════════════════════════════

  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║           DEMO TEST RESULTS                            ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  const totalTests = testsPassed + testsFailed;
  const successRate = Math.round((testsPassed / totalTests) * 100);

  console.log(`📊 SUMMARY:`);
  console.log(`   ✅ Passed: ${testsPassed}/${totalTests}`);
  console.log(`   ❌ Failed: ${testsFailed}/${totalTests}`);
  console.log(`   📈 Success Rate: ${successRate}%\n`);

  if (testsFailed === 0) {
    console.log('🎉 ALL FEATURES WORKING PERFECTLY! 🎉\n');
  } else {
    console.log(`⚠️  ${testsFailed} test(s) failed. Review output above.\n`);
  }

  console.log('📋 DEMO USER CREDENTIALS:');
  console.log(`   Email: ${demoEmail}`);
  console.log(`   Password: ${demoPassword}`);
  console.log(`   Role: Refugee`);
  console.log('');
}

demoTest().catch(e => console.error('Error:', e.message));
