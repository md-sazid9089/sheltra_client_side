#!/usr/bin/env node
const BASE_URL = 'http://localhost:8000/api';

async function simplTest() {
  // Register as refugee
  const testEmail = `test${Date.now()}@sheltra.local`;
  const regRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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

  // Try to access NGO endpoint
  const response = await fetch(`${BASE_URL}/ngo/cases`, {
    method: 'GET',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();
  console.log('\nAccessing /ngo/cases with refugee token:');
  console.log('Status:', response.status);
  console.log('Success:', data.success);
  console.log('Message:', data.message);
  console.log('\nFull response:', JSON.stringify(data, null, 2));
}

simplTest().catch(e => console.error('Error:', e.message));
