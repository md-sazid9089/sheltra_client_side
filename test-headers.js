#!/usr/bin/env node
const BASE_URL = 'http://localhost:8000/api';

async function test() {
  // Register as refugee
  const testEmail = `test${Date.now()}@sheltra.local`;
  const regRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'  // IMPORTANT
    },
    body: JSON.stringify({
      name: 'Refugee Test',
      email: testEmail,
      password: 'Test123!',
      password_confirmation: 'Test123!',
      role: 'refugee'
    })
  }).then(r => r.json());

  const token = regRes.token;
  console.log('Registered as refugee with role:', regRes.user?.role);

  // Try to access NGO endpoint WITHOUT Accept header (should redirect)
  const response1 = await fetch(`${BASE_URL}/ngo/cases`, {
    method: 'GET',
    headers: { 
      'Authorization': `Bearer ${token}`
    },
    redirect: 'manual'
  });

  console.log('\n1. Without Accept header (manual redirect):');
  console.log('   Status:', response1.status, '(302 = redirect)');

  // Try to access NGO endpoint WITH Accept header (should return 403)
  const response2 = await fetch(`${BASE_URL}/ngo/cases`, {
    method: 'GET',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  }).then(r => r.text().then(t => ({status: r.status, text: t})))
    .then(r => ({
      status: r.status,
      data: r.status === 200 || r.text.startsWith('{') ? JSON.parse(r.text) : r.text
    }));

  console.log('\n2. With Accept: application/json header:');
  console.log('   Status:', response2.status);
  if (typeof response2.data === 'object') {
    console.log('   Message:', response2.data.message);
  } else {
    console.log('   Response:', response2.data.substring(0, 100));
  }
}

test().catch(e => console.error('Error:', e.message));
