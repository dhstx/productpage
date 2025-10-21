// Test script for DHStx AI Agent System
// This tests the core agent execution without requiring full database setup

import dotenv from 'dotenv';
import { executeAgent } from './api/services/agentExecutor.js';
import { routeRequest, getAgentById, agents } from './src/lib/agents.js';

// Load environment variables
dotenv.config({ path: '.env.backend' });

console.log('🚀 DHStx AI Agent System - Test Suite\n');
console.log('=' .repeat(60));

// Test 1: Verify all agents are loaded
console.log('\n📋 Test 1: Verify Agent Configuration');
console.log('-'.repeat(60));
console.log(`Total agents loaded: ${agents.length}`);
console.log('Agents:');
agents.forEach((agent, index) => {
  console.log(`  ${index + 1}. ${agent.name} (${agent.id}) - ${agent.domain}`);
});

// Test 2: Test intelligent routing
console.log('\n🎯 Test 2: Test Intelligent Routing');
console.log('-'.repeat(60));

const testMessages = [
  { message: "Help me develop a strategic plan for Q1", expectedAgent: "commander" },
  { message: "Create a project timeline", expectedAgent: "conductor" },
  { message: "Research AI trends in 2025", expectedAgent: "scout" },
  { message: "Write a Python function", expectedAgent: "builder" },
  { message: "Design a landing page", expectedAgent: "muse" },
  { message: "Create a marketing campaign", expectedAgent: "echo" },
  { message: "Draft a customer response", expectedAgent: "connector" },
  { message: "Summarize this meeting", expectedAgent: "archivist" },
  { message: "Calculate our burn rate", expectedAgent: "ledger" },
  { message: "Review this contract", expectedAgent: "counselor" },
  { message: "Audit our security", expectedAgent: "sentinel" },
  { message: "Analyze conversion rates", expectedAgent: "optimizer" },
];

testMessages.forEach(({ message, expectedAgent }) => {
  const routed = routeRequest(message);
  const match = routed.id === expectedAgent ? '✅' : '❌';
  console.log(`${match} "${message}"`);
  console.log(`   → Routed to: ${routed.name} (${routed.id})`);
  if (routed.id !== expectedAgent) {
    console.log(`   ⚠️  Expected: ${expectedAgent}`);
  }
});

// Test 3: Test agent execution (if API keys are available)
console.log('\n🤖 Test 3: Test Agent Execution');
console.log('-'.repeat(60));

async function testAgentExecution() {
  // Check if API keys are available
  const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== '${ANTHROPIC_API_KEY}';
  const hasOpenAIKey = !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== '${OPENAI_API_KEY}';

  console.log(`Anthropic API Key: ${hasAnthropicKey ? '✅ Configured' : '❌ Missing'}`);
  console.log(`OpenAI API Key: ${hasOpenAIKey ? '✅ Configured' : '❌ Missing'}`);

  if (!hasAnthropicKey && !hasOpenAIKey) {
    console.log('\n⚠️  No API keys configured. Skipping execution test.');
    console.log('   Add ANTHROPIC_API_KEY or OPENAI_API_KEY to .env.backend to test execution.');
    return;
  }

  // Test with a simple message
  console.log('\n📤 Testing Orchestrator agent...');
  const testMessage = "What can you help me with?";
  
  try {
    const result = await executeAgent('orchestrator', testMessage, {
      userId: 'test-user',
      sessionId: 'test-session',
      conversationHistory: []
    });

    if (result.success) {
      console.log('✅ Agent execution successful!');
      console.log(`   Agent: ${result.agentName}`);
      console.log(`   Model: ${result.model} (${result.provider})`);
      console.log(`   Execution time: ${result.executionTime}ms`);
      console.log(`   Tokens used: ${result.usage?.totalTokens || 'N/A'}`);
      console.log(`\n   Response preview:`);
      console.log(`   ${result.response.substring(0, 200)}...`);
    } else {
      console.log('❌ Agent execution failed');
      console.log(`   Error: ${result.error}`);
    }
  } catch (error) {
    console.log('❌ Agent execution error');
    console.log(`   ${error.message}`);
  }
}

// Run async test
await testAgentExecution();

// Test 4: Verify agent metadata
console.log('\n📊 Test 4: Verify Agent Metadata');
console.log('-'.repeat(60));

const sampleAgent = getAgentById('commander');
console.log(`Sample Agent: ${sampleAgent.name}`);
console.log(`  ID: ${sampleAgent.id}`);
console.log(`  Domain: ${sampleAgent.domain}`);
console.log(`  Voice: ${sampleAgent.voice}`);
console.log(`  Capabilities: ${sampleAgent.capabilities.length} defined`);
console.log(`  Workflows: ${sampleAgent.workflows.join(', ')}`);
console.log(`  Integrations: ${sampleAgent.integrations.join(', ')}`);
console.log(`  Metrics:`);
console.log(`    - Initiative Success Rate: ${sampleAgent.metrics.initiativeSuccessRate}%`);
console.log(`    - Stakeholder Satisfaction: ${sampleAgent.metrics.stakeholderSatisfaction}%`);
console.log(`    - Tasks Completed: ${sampleAgent.metrics.tasksCompleted.toLocaleString()}`);

console.log('\n' + '='.repeat(60));
console.log('✅ Test Suite Complete!\n');
console.log('Next Steps:');
console.log('  1. Review the test results above');
console.log('  2. If agent execution worked, the system is ready!');
console.log('  3. Set up Supabase database schema (supabase-agent-schema.sql)');
console.log('  4. Start the API server: npm run dev');
console.log('  5. Test the /api/agents/chat endpoint');
console.log('\n');

