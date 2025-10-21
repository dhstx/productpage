import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);

// Test the scanDomain endpoint
const testDomain = 'google.com';

console.log('Testing PDF generation for:', testDomain);
console.log('Scanning domain...');

try {
  const response = await fetch('http://localhost:3000/api/trpc/domain.scanDomain', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      domain: testDomain,
      userAgent: 'Test',
      referrer: 'test'
    })
  });
  
  const data = await response.json();
  console.log('Scan complete:', JSON.stringify(data, null, 2));
} catch (error) {
  console.error('Error:', error.message);
}
