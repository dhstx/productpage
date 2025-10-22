// Comprehensive deployment test for DHStx AI Agent System
import dotenv from 'dotenv';
import { handleUserRequest } from './api/services/orchestrator.js';
import { v4 as uuidv4 } from 'uuid';

dotenv.config({ path: '.env.backend' });

console.log('🚀 DHStx AI Agent System - Deployment Test\n');
console.log('='.repeat(70));

// Test scenarios
const testScenarios = [
  {
    name: 'Strategic Planning',
    message: 'Help me develop a strategic plan for Q1 2026',
    expectedAgent: 'Commander'
  },
  {
    name: 'Project Management',
    message: 'Create a project timeline for our product launch',
    expectedAgent: 'Conductor'
  },
  {
    name: 'Market Research',
    message: 'Research AI trends in healthcare for 2026',
    expectedAgent: 'Scout'
  },
  {
    name: 'Software Development',
    message: 'Write a Python function to validate email addresses',
    expectedAgent: 'Builder'
  },
  {
    name: 'Design',
    message: 'Design a modern landing page for our SaaS product',
    expectedAgent: 'Muse'
  }
];

async function runTests() {
  let passedTests = 0;
  let failedTests = 0;

  for (const scenario of testScenarios) {
    console.log(`\n📋 Test: ${scenario.name}`);
    console.log(`   Message: "${scenario.message}"`);
    console.log(`   Expected Agent: ${scenario.expectedAgent}`);
    console.log('   ---');

    try {
      const userId = 'test-user-' + uuidv4();
      const sessionId = uuidv4();

      const startTime = Date.now();
      const result = await handleUserRequest(
        scenario.message,
        userId,
        sessionId
      );
      const duration = Date.now() - startTime;

      if (result.success) {
        const agentMatch = result.agent.name === scenario.expectedAgent ? '✅' : '⚠️';
        console.log(`   ${agentMatch} Agent: ${result.agent.name} (${result.agent.id})`);
        console.log(`   ⏱️  Duration: ${duration}ms`);
        console.log(`   🤖 Model: ${result.metadata.model}`);
        console.log(`   🎯 Provider: ${result.metadata.provider}`);
        console.log(`   📊 Tokens: ${result.metadata.tokensUsed}`);
        console.log(`   📝 Response preview: ${result.response.substring(0, 150)}...`);
        
        if (result.agent.name === scenario.expectedAgent) {
          passedTests++;
        } else {
          console.log(`   ⚠️  WARNING: Expected ${scenario.expectedAgent} but got ${result.agent.name}`);
          failedTests++;
        }
      } else {
        console.log(`   ❌ FAILED: ${result.error || 'Unknown error'}`);
        failedTests++;
      }

    } catch (error) {
      console.log(`   ❌ ERROR: ${error.message}`);
      console.error(error);
      failedTests++;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('\n📊 Test Summary:');
  console.log(`   ✅ Passed: ${passedTests}/${testScenarios.length}`);
  console.log(`   ❌ Failed: ${failedTests}/${testScenarios.length}`);
  console.log(`   📈 Success Rate: ${Math.round((passedTests / testScenarios.length) * 100)}%`);

  if (failedTests === 0) {
    console.log('\n🎉 All tests passed! System is ready for production.');
  } else {
    console.log(`\n⚠️  ${failedTests} test(s) failed. Review the results above.`);
  }

  console.log('\n' + '='.repeat(70));
  console.log('\n✅ Deployment test complete!\n');
}

// Run tests
runTests().catch(error => {
  console.error('\n❌ Fatal error during testing:', error);
  process.exit(1);
});

