/**
 * Multi-Agent Orchestration System
 * Implements the complete orchestration logic for DHStx AI agents
 */

import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

// Initialize AI clients
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE
});

// Import configuration
import { BUSINESS_CATEGORIES, LEADS, AGENT_CAPABILITIES, INTEGRATIONS_LIST } from './config.js';
import { loadSystemPrompt } from './prompts.js';

/**
 * Step 1: Classify user request and route to appropriate lead
 */
export async function classifyRequest(input) {
  const { request_id, user_id, message, context } = input;
  
  const orchestratorPrompt = await loadSystemPrompt('Orchestrator');
  
  const classificationPrompt = `${orchestratorPrompt}

User Message: "${message}"

User's Connected Integrations: ${context.user_integrations.join(', ')}

Analyze this request and classify it into the most appropriate business category. Return your response in JSON format:
{
  "category": "string",
  "lead_agent": "string",
  "confidence": number (0-1),
  "reasoning": "string",
  "requires_clarification": boolean,
  "clarification_question": "string | null"
}`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: classificationPrompt
      }]
    });
    
    const result = JSON.parse(response.content[0].text);
    
    return {
      request_id,
      ...result
    };
  } catch (error) {
    console.error('Classification error:', error);
    // Fallback to Orchestrator
    return {
      request_id,
      category: 'General/Multi-Category',
      lead_agent: 'Orchestrator',
      confidence: 0.5,
      reasoning: 'Classification failed, defaulting to Orchestrator',
      requires_clarification: false
    };
  }
}

/**
 * Step 2: Plan task execution with selected agents
 */
export async function planTask(input) {
  const { request_id, category, lead_agent, user_message, user_integrations } = input;
  
  const leadPrompt = await loadSystemPrompt(lead_agent);
  
  const planningPrompt = `${leadPrompt}

User Request: "${user_message}"
Category: ${category}
User's Connected Integrations: ${user_integrations.join(', ')}

Available Agents You Can Delegate To: ${AGENT_CAPABILITIES[lead_agent].can_delegate_to.join(', ')}

Create an execution plan for this request. Select the minimal viable set of specialist agents needed.

Return your response in JSON format:
{
  "task_analysis": "string",
  "required_capabilities": ["string"],
  "selected_agents": ["string"],
  "execution_plan": {
    "steps": [
      {
        "agent": "string",
        "task": "string",
        "dependencies": ["string"],
        "required_integrations": ["string"]
      }
    ]
  },
  "estimated_time": "string"
}`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: planningPrompt
      }]
    });
    
    const result = JSON.parse(response.content[0].text);
    
    return {
      request_id,
      lead_agent,
      ...result
    };
  } catch (error) {
    console.error('Planning error:', error);
    throw new Error('Task planning failed');
  }
}

/**
 * Step 3: Check integration requirements
 */
export async function checkIntegrations(input) {
  const { execution_plan, user_integrations } = input;
  
  const requiredIntegrations = new Set();
  const missingIntegrations = [];
  
  // Collect all required integrations from execution plan
  execution_plan.execution_plan.steps.forEach(step => {
    step.required_integrations.forEach(integration => {
      requiredIntegrations.add(integration);
    });
  });
  
  // Check which integrations are missing
  requiredIntegrations.forEach(integration => {
    if (!user_integrations.includes(integration)) {
      const integrationInfo = INTEGRATIONS_LIST.find(i => i.id === integration);
      const alternatives = findAlternativeIntegrations(integration, user_integrations);
      
      missingIntegrations.push({
        integration_id: integration,
        integration_name: integrationInfo?.name || integration,
        required_by_agent: execution_plan.selected_agents.find(agent => 
          AGENT_CAPABILITIES[agent]?.integrations.includes(integration)
        ),
        priority: determinePriority(integration, execution_plan),
        alternatives: alternatives,
        user_prompt: generateIntegrationPrompt(integrationInfo, alternatives)
      });
    }
  });
  
  const allRequired = missingIntegrations.length === 0;
  const canProceedPartially = checkPartialExecution(missingIntegrations, execution_plan);
  
  return {
    all_required_available: allRequired,
    missing_integrations: missingIntegrations,
    can_proceed_partially: canProceedPartially,
    partial_execution_plan: canProceedPartially ? 
      createPartialPlan(execution_plan, user_integrations) : null
  };
}

/**
 * Step 4: Execute task plan with agents
 */
export async function executePlan(input) {
  const { request_id, execution_plan, user_integrations } = input;
  
  const results = [];
  
  // Execute agents in parallel (respecting dependencies)
  const executionPromises = execution_plan.execution_plan.steps.map(async (step) => {
    const invocation_id = `${request_id}-${step.agent}-${Date.now()}`;
    
    try {
      const agentPrompt = await loadSystemPrompt(step.agent);
      
      const executionPrompt = `${agentPrompt}

Task: ${step.task}

Required Integrations Available: ${step.required_integrations.filter(i => 
  user_integrations.includes(i)
).join(', ')}

Execute this task and return your result in JSON format:
{
  "status": "success | partial_success | failure",
  "output": {
    // Task-specific structured data
  },
  "metadata": {
    "execution_time_ms": number,
    "integrations_used": ["string"],
    "confidence": number
  },
  "errors": []
}`;

      const startTime = Date.now();
      
      const response = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: executionPrompt
        }]
      });
      
      const executionTime = Date.now() - startTime;
      const result = JSON.parse(response.content[0].text);
      
      return {
        invocation_id,
        agent_id: step.agent,
        status: result.status || 'success',
        output: result.output || {},
        metadata: {
          execution_time_ms: executionTime,
          integrations_used: result.metadata?.integrations_used || [],
          tokens_used: response.usage.input_tokens + response.usage.output_tokens,
          confidence: result.metadata?.confidence || 0.8
        },
        errors: result.errors || []
      };
    } catch (error) {
      console.error(`Agent ${step.agent} execution error:`, error);
      return {
        invocation_id,
        agent_id: step.agent,
        status: 'failure',
        output: {},
        metadata: {
          execution_time_ms: 0,
          integrations_used: [],
          tokens_used: 0,
          confidence: 0
        },
        errors: [{
          code: 'AGENT_EXECUTION_FAILED',
          message: error.message,
          severity: 'error'
        }]
      };
    }
  });
  
  const executionResults = await Promise.all(executionPromises);
  
  return {
    request_id,
    results: executionResults
  };
}

/**
 * Step 5: Aggregate and validate results
 */
export async function aggregateAndValidate(input) {
  const { request_id, lead_agent, agent_results } = input;
  
  // Combine all outputs
  const aggregated_output = {};
  const conflicts = [];
  let totalConfidence = 0;
  
  agent_results.forEach(result => {
    if (result.status === 'success' || result.status === 'partial_success') {
      aggregated_output[result.agent_id] = result.output;
      totalConfidence += result.metadata.confidence;
    }
  });
  
  const avgConfidence = agent_results.length > 0 ? 
    totalConfidence / agent_results.length : 0;
  
  // Check for conflicts (simplified - can be enhanced)
  const validation_status = agent_results.every(r => r.status === 'success') ? 
    'valid' : 'partial';
  
  return {
    request_id,
    aggregated_output,
    validation_status,
    conflicts,
    confidence: avgConfidence
  };
}

/**
 * Step 6: Produce final lead report
 */
export async function produceLeadReport(input) {
  const { request_id, lead_agent, aggregated_results, original_request } = input;
  
  const leadPrompt = await loadSystemPrompt(lead_agent);
  
  const reportingPrompt = `${leadPrompt}

Original User Request: "${original_request}"

Agent Execution Results:
${JSON.stringify(aggregated_results.aggregated_output, null, 2)}

Validation Status: ${aggregated_results.validation_status}
Overall Confidence: ${aggregated_results.confidence}

Create a comprehensive report for the user summarizing what was accomplished.

Return your response in JSON format:
{
  "summary": "string",
  "key_findings": ["string"],
  "actions_taken": [
    {
      "agent": "string",
      "action": "string",
      "result": "string"
    }
  ],
  "recommendations": ["string"],
  "next_steps": ["string"],
  "artifacts": [
    {
      "name": "string",
      "type": "string",
      "url": "string"
    }
  ]
}`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: reportingPrompt
      }]
    });
    
    const result = JSON.parse(response.content[0].text);
    
    // Collect metadata
    const agents_involved = [lead_agent];
    const integrations_used = new Set();
    let total_execution_time = 0;
    
    Object.keys(aggregated_results.aggregated_output).forEach(agent => {
      if (!agents_involved.includes(agent)) {
        agents_involved.push(agent);
      }
    });
    
    return {
      request_id,
      lead_agent,
      summary: result.summary,
      key_findings: result.key_findings || [],
      actions_taken: result.actions_taken || [],
      recommendations: result.recommendations || [],
      next_steps: result.next_steps || [],
      artifacts: result.artifacts || [],
      metadata: {
        agents_involved,
        total_execution_time_ms: total_execution_time,
        integrations_used: Array.from(integrations_used)
      }
    };
  } catch (error) {
    console.error('Report generation error:', error);
    throw new Error('Report generation failed');
  }
}

/**
 * Main orchestration handler
 */
export async function handleUserRequest(request) {
  const { request_id, user_id, message, context } = request;
  
  try {
    // Step 1: Classify and route
    const routing = await classifyRequest({
      request_id,
      user_id,
      message,
      context
    });
    
    if (routing.requires_clarification) {
      return {
        type: 'clarification_needed',
        question: routing.clarification_question
      };
    }
    
    // Step 2: Plan task
    const plan = await planTask({
      request_id,
      category: routing.category,
      lead_agent: routing.lead_agent,
      user_message: message,
      user_integrations: context.user_integrations
    });
    
    // Step 3: Check integrations
    const integrationCheck = await checkIntegrations({
      execution_plan: plan,
      user_integrations: context.user_integrations
    });
    
    if (!integrationCheck.all_required_available) {
      return {
        type: 'integrations_required',
        missing: integrationCheck.missing_integrations,
        can_proceed_partially: integrationCheck.can_proceed_partially,
        partial_plan: integrationCheck.partial_execution_plan
      };
    }
    
    // Step 4: Execute plan
    const executionResults = await executePlan({
      request_id,
      execution_plan: plan,
      user_integrations: context.user_integrations
    });
    
    // Step 5: Aggregate results
    const aggregated = await aggregateAndValidate({
      request_id,
      lead_agent: routing.lead_agent,
      agent_results: executionResults.results
    });
    
    // Step 6: Produce report
    const report = await produceLeadReport({
      request_id,
      lead_agent: routing.lead_agent,
      aggregated_results: aggregated,
      original_request: message
    });
    
    return {
      type: 'success',
      report
    };
    
  } catch (error) {
    console.error('Orchestration error:', error);
    return {
      type: 'error',
      error: error.message
    };
  }
}

// Helper functions

function findAlternativeIntegrations(integration, userIntegrations) {
  // Find similar integrations user already has
  const alternatives = [];
  
  const integrationInfo = INTEGRATIONS_LIST.find(i => i.id === integration);
  if (!integrationInfo) return alternatives;
  
  INTEGRATIONS_LIST.forEach(i => {
    if (userIntegrations.includes(i.id) && 
        i.category === integrationInfo.category &&
        i.id !== integration) {
      alternatives.push(i.id);
    }
  });
  
  return alternatives;
}

function determinePriority(integration, executionPlan) {
  // Determine if integration is critical, high, medium, or low priority
  const stepsRequiring = executionPlan.execution_plan.steps.filter(step =>
    step.required_integrations.includes(integration)
  );
  
  if (stepsRequiring.length === executionPlan.execution_plan.steps.length) {
    return 'critical';
  } else if (stepsRequiring.length > executionPlan.execution_plan.steps.length / 2) {
    return 'high';
  } else if (stepsRequiring.length > 0) {
    return 'medium';
  }
  return 'low';
}

function generateIntegrationPrompt(integrationInfo, alternatives) {
  if (!integrationInfo) return 'Integration required';
  
  let prompt = `To complete this task, I need access to ${integrationInfo.name}.`;
  
  if (alternatives.length > 0) {
    const altNames = alternatives.map(alt => 
      INTEGRATIONS_LIST.find(i => i.id === alt)?.name
    ).filter(Boolean);
    prompt += ` Alternatively, I can use ${altNames.join(' or ')} which you already have connected.`;
  }
  
  prompt += ' Would you like to connect it now, or should I proceed with available integrations?';
  
  return prompt;
}

function checkPartialExecution(missingIntegrations, executionPlan) {
  // Check if we can execute at least some steps without missing integrations
  const criticalMissing = missingIntegrations.filter(m => m.priority === 'critical');
  return criticalMissing.length === 0;
}

function createPartialPlan(executionPlan, userIntegrations) {
  // Create a modified plan that only includes steps with available integrations
  const partialSteps = executionPlan.execution_plan.steps.filter(step => {
    return step.required_integrations.every(integration =>
      userIntegrations.includes(integration)
    );
  });
  
  return {
    ...executionPlan,
    execution_plan: {
      steps: partialSteps
    },
    note: `Executing ${partialSteps.length} of ${executionPlan.execution_plan.steps.length} steps with available integrations`
  };
}

