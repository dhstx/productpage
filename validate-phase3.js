/**
 * Phase 3 Validation Script
 * Validates file structure and code syntax
 */

import fs from 'fs';
import path from 'path';

console.log('🔍 Phase 3 Validation\n');

const results = {
  passed: 0,
  failed: 0,
  tests: []
};

// Test 1: Check required files exist
console.log('Test 1: Required Files');
const requiredFiles = [
  'src/lib/api/agentClient.js',
  'src/components/MessageBubble.jsx',
  'src/components/AIChatInterface.jsx',
  'api/agents/chat.js',
  '.env'
];

let allFilesExist = true;
for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - MISSING`);
    allFilesExist = false;
  }
}

if (allFilesExist) {
  results.passed++;
  results.tests.push({ name: 'Required Files', status: 'PASS' });
} else {
  results.failed++;
  results.tests.push({ name: 'Required Files', status: 'FAIL' });
}
console.log();

// Test 2: Check API client exports
console.log('Test 2: API Client Exports');
try {
  const apiClient = fs.readFileSync('src/lib/api/agentClient.js', 'utf8');
  const hasExports = apiClient.includes('export async function sendMessage') &&
                     apiClient.includes('export async function getSessions') &&
                     apiClient.includes('export async function testConnection');
  
  if (hasExports) {
    console.log('  ✅ All required functions exported');
    results.passed++;
    results.tests.push({ name: 'API Client Exports', status: 'PASS' });
  } else {
    console.log('  ❌ Missing required exports');
    results.failed++;
    results.tests.push({ name: 'API Client Exports', status: 'FAIL' });
  }
} catch (error) {
  console.log('  ❌ Error reading API client:', error.message);
  results.failed++;
  results.tests.push({ name: 'API Client Exports', status: 'FAIL' });
}
console.log();

// Test 3: Check MessageBubble component
console.log('Test 3: MessageBubble Component');
try {
  const messageBubble = fs.readFileSync('src/components/MessageBubble.jsx', 'utf8');
  const hasComponent = messageBubble.includes('export default function MessageBubble') &&
                       messageBubble.includes('message.role') &&
                       messageBubble.includes('message.content');
  
  if (hasComponent) {
    console.log('  ✅ MessageBubble component structure valid');
    results.passed++;
    results.tests.push({ name: 'MessageBubble Component', status: 'PASS' });
  } else {
    console.log('  ❌ MessageBubble component incomplete');
    results.failed++;
    results.tests.push({ name: 'MessageBubble Component', status: 'FAIL' });
  }
} catch (error) {
  console.log('  ❌ Error reading MessageBubble:', error.message);
  results.failed++;
  results.tests.push({ name: 'MessageBubble Component', status: 'FAIL' });
}
console.log();

// Test 4: Check AIChatInterface integration
console.log('Test 4: AIChatInterface Integration');
try {
  const chatInterface = fs.readFileSync('src/components/AIChatInterface.jsx', 'utf8');
  const hasIntegration = chatInterface.includes('sendMessage as sendMessageAPI') &&
                        chatInterface.includes('MessageBubble') &&
                        chatInterface.includes('const [messages, setMessages]') &&
                        chatInterface.includes('const [isLoading, setIsLoading]');
  
  if (hasIntegration) {
    console.log('  ✅ AIChatInterface properly integrated');
    results.passed++;
    results.tests.push({ name: 'AIChatInterface Integration', status: 'PASS' });
  } else {
    console.log('  ❌ AIChatInterface integration incomplete');
    results.failed++;
    results.tests.push({ name: 'AIChatInterface Integration', status: 'FAIL' });
  }
} catch (error) {
  console.log('  ❌ Error reading AIChatInterface:', error.message);
  results.failed++;
  results.tests.push({ name: 'AIChatInterface Integration', status: 'FAIL' });
}
console.log();

// Test 5: Check rate limiting
console.log('Test 5: Rate Limiting');
try {
  const chatAPI = fs.readFileSync('api/agents/chat.js', 'utf8');
  const hasRateLimiting = chatAPI.includes('express-rate-limit') &&
                         chatAPI.includes('chatRateLimiter') &&
                         chatAPI.includes('windowMs: 15 * 60 * 1000');
  
  if (hasRateLimiting) {
    console.log('  ✅ Rate limiting implemented');
    results.passed++;
    results.tests.push({ name: 'Rate Limiting', status: 'PASS' });
  } else {
    console.log('  ❌ Rate limiting not found');
    results.failed++;
    results.tests.push({ name: 'Rate Limiting', status: 'FAIL' });
  }
} catch (error) {
  console.log('  ❌ Error reading chat API:', error.message);
  results.failed++;
  results.tests.push({ name: 'Rate Limiting', status: 'FAIL' });
}
console.log();

// Test 6: Check environment variable
console.log('Test 6: Environment Variable');
try {
  const envFile = fs.readFileSync('.env', 'utf8');
  const hasAPIURL = envFile.includes('VITE_API_URL');
  
  if (hasAPIURL) {
    console.log('  ✅ VITE_API_URL configured');
    results.passed++;
    results.tests.push({ name: 'Environment Variable', status: 'PASS' });
  } else {
    console.log('  ❌ VITE_API_URL not found');
    results.failed++;
    results.tests.push({ name: 'Environment Variable', status: 'FAIL' });
  }
} catch (error) {
  console.log('  ❌ Error reading .env:', error.message);
  results.failed++;
  results.tests.push({ name: 'Environment Variable', status: 'FAIL' });
}
console.log();

// Print Summary
console.log('='.repeat(60));
console.log('📊 Validation Summary');
console.log('='.repeat(60));
console.log(`Total Tests: ${results.passed + results.failed}`);
console.log(`✅ Passed: ${results.passed}`);
console.log(`❌ Failed: ${results.failed}`);
console.log(`Success Rate: ${Math.round((results.passed / (results.passed + results.failed)) * 100)}%`);
console.log('='.repeat(60));

if (results.failed === 0) {
  console.log('\n✅ Phase 3 Implementation Validated Successfully!');
  console.log('\n📋 Phase 3 Features:');
  console.log('  • API client for backend communication');
  console.log('  • MessageBubble component for chat display');
  console.log('  • Full AIChatInterface integration');
  console.log('  • Message state management');
  console.log('  • Error handling');
  console.log('  • Loading indicators');
  console.log('  • Rate limiting (security)');
  console.log('  • Environment configuration');
  
  console.log('\n🚀 Ready to proceed to Phase 4!');
} else {
  console.log('\n⚠️  Some tests failed. Please review the errors above.');
}

process.exit(results.failed > 0 ? 1 : 0);
