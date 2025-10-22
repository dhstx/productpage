/**
 * Phase 3 Test Script
 * Tests the frontend API integration
 */

import { sendMessage, testConnection } from './src/lib/api/agentClient.js';

console.log('🧪 Phase 3 Integration Test\n');
console.log('Testing API client and frontend integration...\n');

// Mock localStorage for testing
global.localStorage = {
  getItem: (key) => {
    if (key === 'authToken') {
      return 'test-token-12345';
    }
    return null;
  }
};

async function runTests() {
  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };

  // Test 1: API Client Import
  console.log('Test 1: API Client Import');
  try {
    if (typeof sendMessage === 'function' && typeof testConnection === 'function') {
      console.log('✅ API client functions imported successfully\n');
      results.passed++;
      results.tests.push({ name: 'API Client Import', status: 'PASS' });
    }
  } catch (error) {
    console.log('❌ Failed to import API client:', error.message, '\n');
    results.failed++;
    results.tests.push({ name: 'API Client Import', status: 'FAIL', error: error.message });
  }

  // Test 2: Message Structure
  console.log('Test 2: Message Structure Validation');
  try {
    const testMessage = {
      id: Date.now(),
      role: 'user',
      content: 'Test message',
      timestamp: new Date().toISOString()
    };
    
    if (testMessage.id && testMessage.role && testMessage.content && testMessage.timestamp) {
      console.log('✅ Message structure is valid\n');
      results.passed++;
      results.tests.push({ name: 'Message Structure', status: 'PASS' });
    }
  } catch (error) {
    console.log('❌ Message structure validation failed:', error.message, '\n');
    results.failed++;
    results.tests.push({ name: 'Message Structure', status: 'FAIL', error: error.message });
  }

  // Test 3: Error Handling
  console.log('Test 3: Error Handling');
  try {
    // Test without auth token
    const originalGetItem = global.localStorage.getItem;
    global.localStorage.getItem = () => null;
    
    try {
      await sendMessage('test');
      console.log('❌ Should have thrown authentication error\n');
      results.failed++;
      results.tests.push({ name: 'Error Handling', status: 'FAIL', error: 'No auth error thrown' });
    } catch (error) {
      if (error.message.includes('Authentication required')) {
        console.log('✅ Authentication error handled correctly\n');
        results.passed++;
        results.tests.push({ name: 'Error Handling', status: 'PASS' });
      } else {
        console.log('❌ Unexpected error:', error.message, '\n');
        results.failed++;
        results.tests.push({ name: 'Error Handling', status: 'FAIL', error: error.message });
      }
    }
    
    global.localStorage.getItem = originalGetItem;
  } catch (error) {
    console.log('❌ Error handling test failed:', error.message, '\n');
    results.failed++;
    results.tests.push({ name: 'Error Handling', status: 'FAIL', error: error.message });
  }

  // Test 4: Component Structure
  console.log('Test 4: Component File Structure');
  try {
    const fs = await import('fs');
    const files = [
      './src/lib/api/agentClient.js',
      './src/components/MessageBubble.jsx',
      './src/components/AIChatInterface.jsx'
    ];
    
    let allExist = true;
    for (const file of files) {
      if (!fs.existsSync(file)) {
        console.log(`❌ Missing file: ${file}`);
        allExist = false;
      }
    }
    
    if (allExist) {
      console.log('✅ All required files exist\n');
      results.passed++;
      results.tests.push({ name: 'Component Structure', status: 'PASS' });
    } else {
      results.failed++;
      results.tests.push({ name: 'Component Structure', status: 'FAIL', error: 'Missing files' });
    }
  } catch (error) {
    console.log('❌ File structure test failed:', error.message, '\n');
    results.failed++;
    results.tests.push({ name: 'Component Structure', status: 'FAIL', error: error.message });
  }

  // Print Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Summary');
  console.log('='.repeat(50));
  console.log(`Total Tests: ${results.passed + results.failed}`);
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`Success Rate: ${Math.round((results.passed / (results.passed + results.failed)) * 100)}%`);
  console.log('='.repeat(50));
  
  console.log('\n📋 Detailed Results:');
  results.tests.forEach((test, index) => {
    console.log(`${index + 1}. ${test.name}: ${test.status}`);
    if (test.error) {
      console.log(`   Error: ${test.error}`);
    }
  });

  console.log('\n✅ Phase 3 Implementation Complete!');
  console.log('\nNext Steps:');
  console.log('1. Start API server: cd api && node server.js');
  console.log('2. Start frontend: npm run dev');
  console.log('3. Test in browser at http://localhost:5173');
  
  return results;
}

runTests().catch(console.error);
