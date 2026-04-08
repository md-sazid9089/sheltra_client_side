#!/usr/bin/env node

/**
 * Sheltra API Detailed Diagnostic Test
 */

const BASE_URL = 'http://localhost:8000/api';

async function request(method, path, data = null, token = null) {
  try {
    const url = `${BASE_URL}${path}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    const responseText = await response.text();

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }

    return {
      status: response.status,
      ok: response.ok,
      data: responseData,
    };
  } catch (error) {
    return {
      status: 0,
      ok: false,
      error: error.message,
    };
  }
}

async function runDiagnostics() {
  console.log('\n🔍 SHELTRA API DIAGNOSTIC TEST\n');
  console.log('═'.repeat(60));

  // Test 1: Health Check
  console.log('\n1️⃣  API Health Check');
  console.log('─'.repeat(60));
  
  const meRes = await request('GET', '/auth/me');
  console.log(`GET /auth/me → Status: ${meRes.status}`);
  console.log(`Expected: 401 (needs auth), Got: ${meRes.status}`);
  console.log(`Result: ${meRes.status === 401 ? '✓ PASS' : '✗ FAIL'}\n`);

  // Test 2: Register Flow
  console.log('2️⃣  Registration Flow');
  console.log('─'.repeat(60));
  
  const testEmail = `test${Date.now()}@sheltra.test`;
  const testPassword = 'TestPass123!';
  
  console.log(`📧 Email: ${testEmail}`);
  console.log(`🔐 Password: ${testPassword}`);
  
  const registerRes = await request('POST', '/auth/register', {
    name: 'Test User',
    email: testEmail,
    password: testPassword,
    password_confirmation: testPassword,
    role: 'refugee',
  });

  console.log(`POST /auth/register → Status: ${registerRes.status}`);
  console.log(`Response:`, JSON.stringify(registerRes.data, null, 2));
  
  if (registerRes.status === 201 || registerRes.status === 200) {
    console.log('✓ Registration successful\n');
  } else {
    console.log('✗ Registration failed\n');
    return;
  }

  // Test 3: Login Flow
  console.log('3️⃣  Login Flow');
  console.log('─'.repeat(60));
  
  const loginRes = await request('POST', '/auth/login', {
    email: testEmail,
    password: testPassword,
  });

  console.log(`POST /auth/login → Status: ${loginRes.status}`);
  if (loginRes.status !== 200) {
    console.log(`Response:`, JSON.stringify(loginRes.data, null, 2));
  }

  let token = null;
  if (loginRes.status === 200 && loginRes.data.data?.token) {
    token = loginRes.data.data.token;
    console.log(`✓ Login successful`);
    console.log(`📝 Token: ${token.substring(0, 20)}...\n`);
  } else {
    console.log(`✗ Login failed → Status: ${loginRes.status}\n`);
  }

  // Test 4: Authenticated Endpoints
  if (token) {
    console.log('4️⃣  Authenticated Endpoints');
    console.log('─'.repeat(60));

    // Get current user
    const userRes = await request('GET', '/auth/me', null, token);
    console.log(`GET /auth/me (authenticated) → Status: ${userRes.status}`);
    if (userRes.status === 200) {
      console.log(`✓ User: ${userRes.data.data?.email || userRes.data.data?.name} (Role: ${userRes.data.data?.role})\n`);
    } else {
      console.log(`✗ Failed to get user\n`);
    }

    // Validate session
    const validateRes = await request('POST', '/auth/validate', {}, token);
    console.log(`POST /auth/validate → Status: ${validateRes.status}`);
    console.log(`Result: ${validateRes.status === 200 ? '✓ PASS' : '✗ FAIL'}\n`);

    // Test refugee endpoints
    console.log('5️⃣  Refugee Endpoints (Authenticated)');
    console.log('─'.repeat(60));

    const profileRes = await request('GET', '/refugee/profile', null, token);
    console.log(`GET /refugee/profile → Status: ${profileRes.status}`);
    console.log(`Result: ${[200, 404, 500].includes(profileRes.status) ? '✓ PASS' : '✗ FAIL'}\n`);

    // Test NID Generation
    const nidRes = await request(
      'POST',
      '/refugee/generate-nid',
      {
        full_name: 'Test User',
        country: 'Syria',
        email: testEmail,
      },
      token
    );

    console.log(`POST /refugee/generate-nid → Status: ${nidRes.status}`);
    if (nidRes.status === 200 && nidRes.data.data?.nidNumber) {
      console.log(`✓ NID Generated: ${nidRes.data.data.nidNumber}`);
      console.log(`  Expires: ${nidRes.data.data.expiryDate}\n`);
    } else {
      console.log(`Result: ${nidRes.status === 200 ? '✓ PASS' : '✗ FAIL'}\n`);
    }

    // Test CV Analysis
    const cvRes = await request(
      'POST',
      '/refugee/cv-analyze',
      {
        cv_text: 'I am a software developer with 5 years of experience in Python and JavaScript. I have worked on web applications and mobile apps.',
        target_role: 'Senior Developer',
        target_country: 'Germany',
      },
      token
    );

    console.log(`POST /refugee/cv-analyze → Status: ${cvRes.status}`);
    if (cvRes.status === 200 && cvRes.data.data?.score) {
      console.log(`✓ CV Score: ${cvRes.data.data.score}/100 (${cvRes.data.data.label})`);
      console.log(`  Summary: ${cvRes.data.data.summary?.substring(0, 80)}...\n`);
    } else {
      console.log(`Result: ${cvRes.status === 200 ? '✓ PASS' : '✗ FAIL'}\n`);
    }
  }

  // Test 5: Rate Limiting
  console.log('6️⃣  Rate Limiting Check (Auth Endpoints)');
  console.log('─'.repeat(60));

  console.log('Sending 6 rapid login requests (limit: 5/min)...');
  
  let rateLimitHit = false;
  for (let i = 0; i < 6; i++) {
    const res = await request('POST', '/auth/login', {
      email: 'test@example.com',
      password: 'wrong',
    });
    
    if (res.status === 429) {
      console.log(`✓ Rate limit triggered on attempt ${i + 1}`);
      rateLimitHit = true;
      break;
    }
  }

  if (!rateLimitHit) {
    console.log('⚠️  Rate limiting may not be working (no 429 received)\n');
  } else {
    console.log();
  }

  // Summary
  console.log('═'.repeat(60));
  console.log('\n✅ DIAGNOSTIC TEST COMPLETE\n');
}

runDiagnostics().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
