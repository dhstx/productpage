/**
 * Multi-Agent Orchestration System Test
 * Tests the complete workflow with a real marketing campaign example
 */

import { handleUserRequest } from './api/services/orchestration.js';
import { getUserIntegrations } from './api/services/integrationManager.js';

// Mock Supabase client for testing
const mockSupabase = {
  from: (table) => ({
    select: () => ({
      eq: () => ({
        eq: () => ({
          data: [
            { integration_id: 'taskade', status: 'connected' },
            { integration_id: 'notion', status: 'connected' },
            { integration_id: 'invideo', status: 'connected' },
            { integration_id: 'intercom', status: 'connected' }
          ],
          error: null
        })
      })
    })
  })
};

// Test scenario: Marketing campaign request
async function testMarketingCampaign() {
  console.log('🚀 Testing Multi-Agent Orchestration System\n');
  console.log('=' .repeat(60));
  console.log('Scenario: Create a marketing campaign for Q2 product launch');
  console.log('=' .repeat(60) + '\n');
  
  const request = {
    request_id: 'test-' + Date.now(),
    user_id: 'test-user-123',
    message: 'Help me create a marketing campaign for our Q2 product launch. I need a timeline, creative assets, and an outreach strategy.',
    context: {
      user_integrations: ['taskade', 'notion', 'invideo', 'intercom'],
      conversation_history: [],
      user_tier: 'pro'
    }
  };
  
  console.log('📥 User Request:');
  console.log(`   "${request.message}"\n`);
  
  console.log('🔌 User\'s Connected Integrations:');
  console.log(`   ${request.context.user_integrations.join(', ')}\n`);
  
  console.log('⏳ Processing request...\n');
  
  try {
    const startTime = Date.now();
    
    // Execute the orchestration
    const result = await handleUserRequest(request);
    
    const executionTime = Date.now() - startTime;
    
    console.log('✅ Request completed in', executionTime, 'ms\n');
    console.log('=' .repeat(60));
    console.log('ORCHESTRATION RESULT');
    console.log('=' .repeat(60) + '\n');
    
    if (result.type === 'success') {
      console.log('📊 FINAL REPORT\n');
      console.log('Lead Agent:', result.report.lead_agent);
      console.log('\nSummary:');
      console.log(result.report.summary);
      
      console.log('\n📌 Key Findings:');
      result.report.key_findings.forEach((finding, i) => {
        console.log(`   ${i + 1}. ${finding}`);
      });
      
      console.log('\n⚡ Actions Taken:');
      result.report.actions_taken.forEach((action, i) => {
        console.log(`   ${i + 1}. ${action.agent}: ${action.action}`);
        console.log(`      Result: ${action.result}`);
      });
      
      console.log('\n💡 Recommendations:');
      result.report.recommendations.forEach((rec, i) => {
        console.log(`   ${i + 1}. ${rec}`);
      });
      
      console.log('\n📋 Next Steps:');
      result.report.next_steps.forEach((step, i) => {
        console.log(`   ${i + 1}. ${step}`);
      });
      
      if (result.report.artifacts && result.report.artifacts.length > 0) {
        console.log('\n📎 Artifacts:');
        result.report.artifacts.forEach((artifact, i) => {
          console.log(`   ${i + 1}. ${artifact.name} (${artifact.type})`);
          console.log(`      URL: ${artifact.url}`);
        });
      }
      
      console.log('\n📈 Metadata:');
      console.log(`   Agents Involved: ${result.report.metadata.agents_involved.join(', ')}`);
      console.log(`   Total Execution Time: ${result.report.metadata.total_execution_time_ms}ms`);
      console.log(`   Integrations Used: ${result.report.metadata.integrations_used.join(', ')}`);
      
    } else if (result.type === 'clarification_needed') {
      console.log('❓ CLARIFICATION NEEDED\n');
      console.log('Question:', result.question);
      
    } else if (result.type === 'integrations_required') {
      console.log('🔌 MISSING INTEGRATIONS\n');
      console.log('Missing:', result.missing.length, 'integration(s)');
      
      result.missing.forEach((missing, i) => {
        console.log(`\n${i + 1}. ${missing.integration_name} (${missing.priority} priority)`);
        console.log(`   Required by: ${missing.required_by_agents.join(', ')}`);
        console.log(`   For tasks: ${missing.required_for_tasks.slice(0, 2).join('; ')}`);
        
        if (missing.alternatives.length > 0) {
          console.log(`   Alternatives: ${missing.alternatives.map(a => a.name).join(', ')}`);
        }
      });
      
      if (result.can_proceed_partially) {
        console.log('\n✅ Can proceed with partial execution');
        console.log('Partial plan:', result.partial_plan.note);
      } else {
        console.log('\n❌ Cannot proceed without required integrations');
      }
      
    } else if (result.type === 'error') {
      console.log('❌ ERROR\n');
      console.log('Error:', result.error);
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('TEST COMPLETE');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    console.error(error.stack);
  }
}

// Test with missing integrations scenario
async function testMissingIntegrations() {
  console.log('\n\n🚀 Testing Missing Integrations Scenario\n');
  console.log('=' .repeat(60));
  console.log('Scenario: User missing Google Calendar integration');
  console.log('=' .repeat(60) + '\n');
  
  const request = {
    request_id: 'test-missing-' + Date.now(),
    user_id: 'test-user-456',
    message: 'Create a project timeline with calendar events for our Q2 launch',
    context: {
      user_integrations: ['taskade', 'notion'], // Missing google-calendar
      conversation_history: [],
      user_tier: 'free'
    }
  };
  
  console.log('📥 User Request:');
  console.log(`   "${request.message}"\n`);
  
  console.log('🔌 User\'s Connected Integrations:');
  console.log(`   ${request.context.user_integrations.join(', ')}\n`);
  
  console.log('⏳ Processing request...\n');
  
  try {
    const result = await handleUserRequest(request);
    
    console.log('Result Type:', result.type);
    
    if (result.type === 'integrations_required') {
      console.log('\n🔌 Integration Check Result:');
      console.log('Missing Integrations:', result.missing.length);
      console.log('Can Proceed Partially:', result.can_proceed_partially);
      
      result.missing.forEach(m => {
        console.log(`\n- ${m.integration_name} (${m.priority})`);
        console.log(`  Required by: ${m.required_by_agents.join(', ')}`);
      });
      
      console.log('\n✅ Test passed: Integration checking works correctly');
    }
    
  } catch (error) {
    console.error('\n❌ Test failed:', error);
  }
}

// Run all tests
async function runAllTests() {
  console.log('\n');
  console.log('╔' + '═'.repeat(58) + '╗');
  console.log('║' + ' '.repeat(10) + 'MULTI-AGENT SYSTEM TEST SUITE' + ' '.repeat(18) + '║');
  console.log('╚' + '═'.repeat(58) + '╝');
  console.log('\n');
  
  // Test 1: Full marketing campaign
  await testMarketingCampaign();
  
  // Test 2: Missing integrations
  await testMissingIntegrations();
  
  console.log('\n\n' + '='.repeat(60));
  console.log('ALL TESTS COMPLETE');
  console.log('='.repeat(60) + '\n');
}

// Run tests
runAllTests().catch(console.error);

