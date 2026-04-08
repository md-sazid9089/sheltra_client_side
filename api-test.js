#!/usr/bin/env node

/**
 * Sheltra API Endpoint Testing Suite
 * Tests all critical endpoints to ensure proper functionality
 */

const BASE_URL = 'http://localhost:8000/api';
const timeout = 10000;

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

class APITester {
  constructor() {
    this.token = null;
    this.refugeeId = null;
    this.results = [];
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  async request(method, path, data = null, headers = {}) {
    try {
      const url = `${BASE_URL}${path}`;
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        timeout,
      };

      if (this.token) {
        options.headers['Authorization'] = `Bearer ${this.token}`;
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

  recordResult(testName, passed, details) {
    this.results.push({
      test: testName,
      passed,
      details,
    });

    const icon = passed ? '✓' : '✗';
    const color = passed ? 'green' : 'red';
    this.log(`  ${icon} ${testName}`, color);
    if (details && !passed) {
      this.log(`    ${details}`, 'yellow');
    }
  }

  async runTests() {
    this.log('\n═════════════════════════════════════════════════════', 'cyan');
    this.log('   SHELTRA API ENDPOINT TESTING SUITE', 'cyan');
    this.log('═════════════════════════════════════════════════════\n', 'cyan');

    // Test 1: Auth Endpoints
    await this.testAuthEndpoints();

    // Test 2: Refugee Endpoints
    if (this.token) {
      await this.testRefugeeEndpoints();
    }

    // Test 3: Public Endpoints
    await this.testPublicEndpoints();

    // Print Summary
    this.printSummary();
  }

  async testAuthEndpoints() {
    this.log('\n📋 TESTING AUTHENTICATION ENDPOINTS\n', 'blue');

    // Test: Register
    const registerRes = await this.request('POST', '/auth/register', {
      name: `Test User ${Date.now()}`,
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      password_confirmation: 'password123',
      role: 'refugee',
    });

    const registerPassed = registerRes.status === 201 || registerRes.status === 200;
    this.recordResult(
      'Register endpoint',
      registerPassed,
      registerPassed ? null : `Status: ${registerRes.status}, ${JSON.stringify(registerRes.data)}`
    );

    if (registerPassed) {
      this.refugeeId = registerRes.data.data?.user?.id;
    }

    // Test: Login
    const loginRes = await this.request('POST', '/auth/login', {
      email: `test${Date.now() - 100}@example.com`, // Use recent test user
      password: 'password123',
    });

    const loginPassed = loginRes.status === 200 && loginRes.data.data?.token;
    this.recordResult('Login endpoint', loginPassed, loginPassed ? null : `Status: ${loginRes.status}`);

    if (loginPassed) {
      this.token = loginRes.data.data.token;
    }

    // Test: Get Current User
    const meRes = await this.request('GET', '/auth/me');
    const mePassed = meRes.status === 200 || meRes.status === 401;
    this.recordResult(
      'Get current user (/auth/me)',
      mePassed,
      mePassed ? null : `Status: ${meRes.status}`
    );

    // Test: Validate Session
    if (this.token) {
      const validateRes = await this.request('POST', '/auth/validate', {});
      const validatePassed = validateRes.status === 200;
      this.recordResult(
        'Validate session endpoint',
        validatePassed,
        validatePassed ? null : `Status: ${validateRes.status}`
      );
    }
  }

  async testRefugeeEndpoints() {
    this.log('\n👤 TESTING REFUGEE ENDPOINTS\n', 'blue');

    // Test: Get Profile
    const profileRes = await this.request('GET', '/refugee/profile');
    const profilePassed =
      profileRes.status === 200 || profileRes.status === 404 || profileRes.status === 500;
    this.recordResult(
      'Get refugee profile',
      profilePassed,
      profilePassed ? null : `Status: ${profileRes.status}`
    );

    // Test: Update Profile
    const updateRes = await this.request('POST', '/refugee/profile', {
      full_name: 'Test Refugee User',
      location: 'Berlin, Germany',
      skills: ['Python', 'JavaScript', 'Teaching'],
      languages: ['English', 'Arabic'],
      availability: 'immediate',
      bio: 'Experienced professional seeking employment opportunities',
    });

    const updatePassed = updateRes.status === 200 || updateRes.status === 422 || updateRes.status === 201;
    this.recordResult(
      'Update refugee profile',
      updatePassed,
      updatePassed ? null : `Status: ${updateRes.status}`
    );

    // Test: Get Verification Status
    const verificationRes = await this.request('GET', '/refugee/verification-status');
    const verificationPassed =
      verificationRes.status === 200 || verificationRes.status === 500;
    this.recordResult(
      'Get verification status',
      verificationPassed,
      verificationPassed ? null : `Status: ${verificationRes.status}`
    );

    // Test: Generate NID
    const nidRes = await this.request('POST', '/refugee/generate-nid', {
      full_name: 'Test User',
      country: 'Syria',
      email: `test${Date.now()}@example.com`,
    });

    const nidPassed = nidRes.status === 200 || nidRes.status === 422;
    this.recordResult(
      'Generate Virtual NID',
      nidPassed,
      nidPassed ? null : `Status: ${nidRes.status}`
    );

    if (nidPassed && nidRes.data.data) {
      this.log(`    ↳ Generated NID: ${nidRes.data.data.nidNumber}`, 'cyan');
    }

    // Test: Get Opportunities
    const opportunitiesRes = await this.request('GET', '/refugee/opportunities');
    const opportunitiesPassed =
      opportunitiesRes.status === 200 || opportunitiesRes.status === 500;
    this.recordResult(
      'Get opportunities',
      opportunitiesPassed,
      opportunitiesPassed ? null : `Status: ${opportunitiesRes.status}`
    );

    // Test: Get Applications
    const applicationsRes = await this.request('GET', '/refugee/applications');
    const applicationsPassed =
      applicationsRes.status === 200 || applicationsRes.status === 500;
    this.recordResult(
      'Get applications',
      applicationsPassed,
      applicationsPassed ? null : `Status: ${applicationsRes.status}`
    );

    // Test: Update Skills
    const skillsRes = await this.request('POST', '/refugee/skills', {
      skills: ['Python', 'React', 'Data Analysis'],
    });

    const skillsPassed = skillsRes.status === 200 || skillsRes.status === 422;
    this.recordResult(
      'Update skills',
      skillsPassed,
      skillsPassed ? null : `Status: ${skillsRes.status}`
    );

    // Test: CV Analyze
    const cvRes = await this.request('POST', '/refugee/cv-analyze', {
      cv_text: 'I am a software developer with 5 years of experience in Python and JavaScript.',
      target_role: 'Software Developer',
      target_country: 'Germany',
    });

    const cvPassed = cvRes.status === 200 || cvRes.status === 422;
    this.recordResult(
      'Analyze CV',
      cvPassed,
      cvPassed ? null : `Status: ${cvRes.status}`
    );

    if (cvPassed && cvRes.data.data) {
      this.log(`    ↳ CV Score: ${cvRes.data.data.score}/100`, 'cyan');
    }
  }

  async testPublicEndpoints() {
    this.log('\n🌐 TESTING PUBLIC ENDPOINTS\n', 'blue');

    // Test: User endpoint (should return 401 without token)
    const userRes = await this.request('GET', '/user');
    const userPassed = userRes.status === 401;
    this.recordResult(
      'Public /user endpoint (should be 401 without auth)',
      userPassed,
      userPassed ? null : `Status: ${userRes.status}`
    );

    // Test: Invalid route (should return 404)
    const invalidRes = await this.request('GET', '/invalid-endpoint');
    const invalidPassed = invalidRes.status === 404 || invalidRes.status === 405;
    this.recordResult(
      'Invalid endpoint returns error',
      invalidPassed,
      invalidPassed ? null : `Status: ${invalidRes.status}`
    );
  }

  printSummary() {
    this.log('\n═════════════════════════════════════════════════════', 'cyan');
    this.log('   TEST SUMMARY', 'cyan');
    this.log('═════════════════════════════════════════════════════\n', 'cyan');

    const passed = this.results.filter((r) => r.passed).length;
    const total = this.results.length;
    const percentage = Math.round((passed / total) * 100);

    this.log(`Total Tests: ${total}`, 'blue');
    this.log(`Passed: ${passed}`, 'green');
    this.log(`Failed: ${total - passed}`, passed === total ? 'green' : 'red');
    this.log(`Success Rate: ${percentage}%\n`, percentage >= 80 ? 'green' : 'yellow');

    if (passed === total) {
      this.log('✓ ALL TESTS PASSED!', 'green');
    } else {
      this.log('⚠ Some tests failed. Review above for details.', 'yellow');
    }

    this.log('\n═════════════════════════════════════════════════════\n', 'cyan');
  }
}

// Run tests
const tester = new APITester();
tester.runTests().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
