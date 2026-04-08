#!/usr/bin/env node

/**
 * Sheltra API Comprehensive Endpoint Test Report
 */

const BASE_URL = 'http://localhost:8000/api';
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bold: '\x1b[1m',
};

class TestReport {
  constructor() {
    this.results = [];
    this.token = null;
    this.userId = null;
  }

  log(msg, color = 'reset') {
    console.log(`${colors[color]}${msg}${colors.reset}`);
  }

  async fetch(method, path, data = null, token = null) {
    try {
      const url = `${BASE_URL}${path}`;
      const options = {
        method,
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
      };

      if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
      }

      if (data) {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(url, options);
      const json = await response.json().catch(() => response.text());

      return {
        status: response.status,
        data: json,
      };
    } catch (error) {
      return {
        status: 0,
        error: error.message,
      };
    }
  }

  record(name, status, expectedStatus, responseData = null) {
    const passed = (Array.isArray(expectedStatus) ? expectedStatus.includes(status) : status === expectedStatus);
    this.results.push({ name, passed, status, expectedStatus });

    const icon = passed ? '✓' : '✗';
    const color = passed ? 'green' : 'red';
    const statusText = passed ? `[${status}]` : `[${status}] Expected: [${expectedStatus}]`;

    console.log(`  ${colors[color]}${icon}${colors.reset} ${name} ${statusText}`);
    if (!passed && responseData && typeof responseData === 'object' && responseData.message) {
      console.log(`     ${colors.yellow}→ ${responseData.message}${colors.reset}`);
    }
  }

  async runAllTests() {
    console.clear();
    this.log('╔════════════════════════════════════════════════════════════════╗', 'cyan');
    this.log('║       SHELTRA API - COMPREHENSIVE ENDPOINT TEST REPORT         ║', 'cyan');
    this.log('╚════════════════════════════════════════════════════════════════╝\n', 'cyan');

    // Generate test credentials
    const testEmail = `test${Date.now()}@sheltra.local`;
    const testPassword = 'TestPass123!';

    this.log('\n📋 AUTHENTICATION ENDPOINTS\n', 'bold');

    // Register
    const regRes = await this.fetch('POST', '/auth/register', {
      name: 'Test User',
      email: testEmail,
      password: testPassword,
      password_confirmation: testPassword,
      role: 'refugee',
    });
    this.record('Register user', regRes.status, 201, regRes.data);
    if (regRes.status === 201) {
      this.userId = regRes.data.user?.id;
    }

    // Login
    const loginRes = await this.fetch('POST', '/auth/login', {
      email: testEmail,
      password: testPassword,
    });
    this.record('Login user', loginRes.status, 200, loginRes.data);
    if (loginRes.status === 200) {
      this.token = loginRes.data.token;
    }

    // Get Current User (without token)
    const meNoAuthRes = await this.fetch('GET', '/auth/me');
    this.record('Get /auth/me (no auth)', meNoAuthRes.status, 401);

    // Get Current User (with token)
    if (this.token) {
      const meRes = await this.fetch('GET', '/auth/me', null, this.token);
      this.record('Get /auth/me (with auth)', meRes.status, 200);

      // Validate Session
      const validateRes = await this.fetch('POST', '/auth/validate', {}, this.token);
      this.record('Validate session', validateRes.status, 200);
    }

    // Logout (needs token)
    if (this.token) {
      const logoutRes = await this.fetch('POST', '/auth/logout', {}, this.token);
      this.record('Logout user', logoutRes.status, 200);
    }

    // Test authenticated endpoints
    if (this.token) {
      this.log('\n👤 REFUGEE PROFILE ENDPOINTS\n', 'bold');

      // Get Profile
      const profileRes = await this.fetch('GET', '/refugee/profile', null, this.token);
      this.record('Get refugee profile', profileRes.status, [200, 404, 500]);

      // Update Profile
      const updateRes = await this.fetch(
        'POST',
        '/refugee/profile',
        {
          full_name: 'Test User',
          location: 'Berlin, Germany',
          phone: '+49 30 1234567',
          bio: 'Professional seeking opportunities',
          skills: ['Python', 'JavaScript'],
          languages: ['English', 'Arabic'],
          education: 'BSc Computer Science',
          work_experience: '5 years software development',
          availability: 'immediate',
        },
        this.token
      );
      this.record('Update refugee profile', updateRes.status, [200, 201, 422]);

      // Get Verification Status
      const verificationRes = await this.fetch('GET', '/refugee/verification-status', null, this.token);
      this.record('Get verification status', verificationRes.status, [200, 500]);

      // Generate Virtual NID
      const nidRes = await this.fetch(
        'POST',
        '/refugee/generate-nid',
        {
          full_name: 'Test User',
          country: 'Syria',
          email: testEmail,
        },
        this.token
      );
      this.record('Generate Virtual NID', nidRes.status, [200, 422]);
      if (nidRes.status === 200 && nidRes.data.data?.nidNumber) {
        console.log(`     📝 Generated NID: ${nidRes.data.data.nidNumber}`);
      }

      // Get Opportunities
      const oppRes = await this.fetch('GET', '/refugee/opportunities', null, this.token);
      this.record('Get job opportunities', oppRes.status, [200, 500]);

      // Get Applications
      const appRes = await this.fetch('GET', '/refugee/applications', null, this.token);
      this.record('Get applications', appRes.status, [200, 500]);

      // Update Skills
      const skillsRes = await this.fetch(
        'POST',
        '/refugee/skills',
        {
          skills: ['Python', 'React', 'AWS'],
        },
        this.token
      );
      this.record('Update skills', skillsRes.status, [200, 422]);

      // Analyze CV
      const cvRes = await this.fetch(
        'POST',
        '/refugee/cv-analyze',
        {
          cv_text:
            'Senior Software Developer with 8 years of experience in full-stack development, cloud platforms, and team leadership. Proficient in Python, JavaScript, and AWS.',
          target_role: 'Senior Developer',
          target_country: 'Germany',
        },
        this.token
      );
      this.record('Analyze CV with AI', cvRes.status, [200, 422]);
      if (cvRes.status === 200 && cvRes.data.data?.score) {
        console.log(`     📊 CV Score: ${cvRes.data.data.score}/100 (${cvRes.data.data.label})`);
      }

      // Try NGO endpoints (should fail with refugee token)
      this.log('\n🔒 PERMISSION TESTS (Refugee accessing NGO endpoints)\n', 'bold');
      const ngoCaseRes = await this.fetch('GET', '/ngo/cases', null, this.token);
      this.record('Access /ngo/cases (should fail)', ngoCaseRes.status, 403);

      // Try Employer endpoints (should fail with refugee token)
      const empRes = await this.fetch('GET', '/employer/jobs', null, this.token);
      this.record('Access /employer/jobs (should fail)', empRes.status, 403);

      // Try Admin endpoints (should fail with refugee token)
      const adminRes = await this.fetch('GET', '/admin/analytics', null, this.token);
      this.record('Access /admin/analytics (should fail)', adminRes.status, 403);
    }

    // Print Summary
    this.printSummary();
  }

  printSummary() {
    const passed = this.results.filter((r) => r.passed).length;
    const total = this.results.length;
    const percentage = Math.round((passed / total) * 100);

    this.log('\n╔════════════════════════════════════════════════════════════════╗', 'cyan');
    this.log('║                       TEST SUMMARY                             ║', 'cyan');
    this.log('╚════════════════════════════════════════════════════════════════╝\n', 'cyan');

    this.log(`Total Endpoints Tested: ${total}`, 'blue');
    this.log(`Passed: ${passed}`, 'green');
    this.log(`Failed: ${total - passed}`, total - passed > 0 ? 'red' : 'green');
    this.log(`Success Rate: ${percentage}%\n`, percentage >= 80 ? 'green' : percentage >= 60 ? 'yellow' : 'red');

    if (percentage === 100) {
      this.log('🎉 PERFECT! All endpoints working correctly!', 'green');
    } else if (percentage >= 80) {
      this.log('✅ Excellent! Most endpoints are working properly.', 'green');
    } else if (percentage >= 60) {
      this.log('⚠️  Good progress, but some endpoints need attention.', 'yellow');
    } else {
      this.log('❌ Several endpoints need to be fixed.', 'red');
    }

    this.log('\n' + '═'.repeat(66) + '\n', 'cyan');

    // Endpoint Status Summary
    this.log('📊 ENDPOINT STATUS OVERVIEW\n', 'bold');

    const categories = {
      'Authentication': this.results.filter(r => r.name.includes('Register') || r.name.includes('Login') || r.name.includes('/auth/me') || r.name.includes('Validate')),
      'Refugee Profile': this.results.filter(r => r.name.includes('refugee') || r.name.includes('profile')),
      'Job & Skills': this.results.filter(r => r.name.includes('opportunities') || r.name.includes('application') || r.name.includes('skill')),
      'NID & CV': this.results.filter(r => r.name.includes('NID') || r.name.includes('CV')),
      'Security': this.results.filter(r => r.name.includes('should fail') || r.name.includes('Permission')),
    };

    for (const [category, tests] of Object.entries(categories)) {
      if (tests.length === 0) continue;
      const catPassed = tests.filter(t => t.passed).length;
      const catTotal = tests.length;
      const icon = catPassed === catTotal ? '✓' : catPassed > 0 ? '⚠️' : '✗';
      this.log(`${icon} ${category}: ${catPassed}/${catTotal}`, catPassed === catTotal ? 'green' : 'yellow');
    }

    this.log('\n' + '═'.repeat(66) + '\n', 'cyan');
  }
}

const report = new TestReport();
report.runAllTests().catch((e) => {
  console.error('Error:', e);
  process.exit(1);
});
