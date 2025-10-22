/**
 * Integration Manager
 * Checks user integrations, prompts for missing ones, and manages integration requirements
 */

import { INTEGRATIONS_LIST, AGENT_CAPABILITIES } from './config.js';

/**
 * Get user's connected integrations from database
 */
export async function getUserIntegrations(userId, supabase) {
  try {
    const { data, error } = await supabase
      .from('user_integrations')
      .select('integration_id, status, scopes')
      .eq('user_id', userId)
      .eq('status', 'connected');
    
    if (error) throw error;
    
    return data.map(i => i.integration_id);
  } catch (error) {
    console.error('Error fetching user integrations:', error);
    // Return default connected integrations
    return INTEGRATIONS_LIST
      .filter(i => i.status === 'connected')
      .map(i => i.id);
  }
}

/**
 * Check if all required integrations are available
 */
export function checkRequiredIntegrations(executionPlan, userIntegrations) {
  const requiredIntegrations = new Set();
  const missingIntegrations = [];
  const integrationUsage = {};
  
  // Collect all required integrations from execution plan
  executionPlan.execution_plan.steps.forEach(step => {
    step.required_integrations.forEach(integration => {
      requiredIntegrations.add(integration);
      
      if (!integrationUsage[integration]) {
        integrationUsage[integration] = {
          agents: [],
          tasks: []
        };
      }
      
      integrationUsage[integration].agents.push(step.agent);
      integrationUsage[integration].tasks.push(step.task);
    });
  });
  
  // Check which integrations are missing
  requiredIntegrations.forEach(integrationId => {
    if (!userIntegrations.includes(integrationId)) {
      const integrationInfo = INTEGRATIONS_LIST.find(i => i.id === integrationId);
      const alternatives = findAlternativeIntegrations(integrationId, userIntegrations);
      const priority = determinePriority(integrationId, executionPlan);
      
      missingIntegrations.push({
        integration_id: integrationId,
        integration_name: integrationInfo?.name || integrationId,
        category: integrationInfo?.category || 'unknown',
        required_by_agents: integrationUsage[integrationId].agents,
        required_for_tasks: integrationUsage[integrationId].tasks,
        priority: priority,
        alternatives: alternatives,
        user_prompt: generateIntegrationPrompt(integrationInfo, alternatives, integrationUsage[integrationId]),
        connect_url: `/integrations/connect/${integrationId}`
      });
    }
  });
  
  const allRequired = missingIntegrations.length === 0;
  const canProceedPartially = checkPartialExecution(missingIntegrations, executionPlan);
  
  return {
    all_required_available: allRequired,
    missing_integrations: missingIntegrations,
    can_proceed_partially: canProceedPartially,
    partial_execution_plan: canProceedPartially ? 
      createPartialPlan(executionPlan, userIntegrations) : null,
    user_message: generateUserMessage(missingIntegrations, canProceedPartially)
  };
}

/**
 * Find alternative integrations user already has
 */
function findAlternativeIntegrations(integrationId, userIntegrations) {
  const alternatives = [];
  
  const integrationInfo = INTEGRATIONS_LIST.find(i => i.id === integrationId);
  if (!integrationInfo) return alternatives;
  
  // Find integrations in the same category that user has
  INTEGRATIONS_LIST.forEach(i => {
    if (userIntegrations.includes(i.id) && 
        i.category === integrationInfo.category &&
        i.id !== integrationId) {
      
      // Check capability overlap
      const sharedCapabilities = i.capabilities.filter(cap =>
        integrationInfo.capabilities.includes(cap)
      );
      
      if (sharedCapabilities.length > 0) {
        alternatives.push({
          id: i.id,
          name: i.name,
          shared_capabilities: sharedCapabilities,
          compatibility_score: sharedCapabilities.length / integrationInfo.capabilities.length
        });
      }
    }
  });
  
  // Sort by compatibility score
  alternatives.sort((a, b) => b.compatibility_score - a.compatibility_score);
  
  return alternatives;
}

/**
 * Determine priority level of missing integration
 */
function determinePriority(integrationId, executionPlan) {
  const stepsRequiring = executionPlan.execution_plan.steps.filter(step =>
    step.required_integrations.includes(integrationId)
  );
  
  const totalSteps = executionPlan.execution_plan.steps.length;
  const requiringSteps = stepsRequiring.length;
  
  if (requiringSteps === totalSteps) {
    return 'critical'; // All steps need this
  } else if (requiringSteps > totalSteps / 2) {
    return 'high'; // More than half need this
  } else if (requiringSteps > 0) {
    return 'medium'; // Some steps need this
  }
  
  return 'low';
}

/**
 * Generate user-friendly prompt for missing integration
 */
function generateIntegrationPrompt(integrationInfo, alternatives, usage) {
  if (!integrationInfo) return 'Integration required';
  
  let prompt = `To complete this task, I need access to **${integrationInfo.name}**.\n\n`;
  
  // Explain why it's needed
  prompt += `**Why it's needed:**\n`;
  prompt += `- Required by: ${usage.agents.join(', ')}\n`;
  prompt += `- For tasks: ${usage.tasks.slice(0, 2).join('; ')}${usage.tasks.length > 2 ? '...' : ''}\n\n`;
  
  // Suggest alternatives if available
  if (alternatives.length > 0) {
    prompt += `**Alternatives:**\n`;
    alternatives.slice(0, 2).forEach(alt => {
      prompt += `- ${alt.name} (${Math.round(alt.compatibility_score * 100)}% compatible)\n`;
    });
    prompt += `\n`;
  }
  
  // Call to action
  if (alternatives.length > 0) {
    prompt += `Would you like to:\n`;
    prompt += `1. Connect ${integrationInfo.name} for full functionality\n`;
    prompt += `2. Use ${alternatives[0].name} instead (may have limitations)\n`;
    prompt += `3. Skip tasks requiring this integration`;
  } else {
    prompt += `Would you like to:\n`;
    prompt += `1. Connect ${integrationInfo.name} now\n`;
    prompt += `2. Skip tasks requiring this integration`;
  }
  
  return prompt;
}

/**
 * Check if we can execute at least some steps without missing integrations
 */
function checkPartialExecution(missingIntegrations, executionPlan) {
  // Check if any missing integrations are critical
  const criticalMissing = missingIntegrations.filter(m => m.priority === 'critical');
  
  if (criticalMissing.length > 0) {
    return false; // Can't proceed if critical integrations are missing
  }
  
  // Check if we can execute at least 50% of steps
  const totalSteps = executionPlan.execution_plan.steps.length;
  const executableSteps = executionPlan.execution_plan.steps.filter(step => {
    return step.required_integrations.every(integration =>
      !missingIntegrations.find(m => m.integration_id === integration)
    );
  });
  
  return executableSteps.length >= totalSteps * 0.5;
}

/**
 * Create a modified plan that only includes steps with available integrations
 */
function createPartialPlan(executionPlan, userIntegrations) {
  const partialSteps = executionPlan.execution_plan.steps.filter(step => {
    return step.required_integrations.every(integration =>
      userIntegrations.includes(integration)
    );
  });
  
  const skippedSteps = executionPlan.execution_plan.steps.filter(step => {
    return !step.required_integrations.every(integration =>
      userIntegrations.includes(integration)
    );
  });
  
  return {
    ...executionPlan,
    execution_plan: {
      steps: partialSteps
    },
    skipped_steps: skippedSteps.map(s => ({
      agent: s.agent,
      task: s.task,
      reason: 'Missing required integrations'
    })),
    note: `Executing ${partialSteps.length} of ${executionPlan.execution_plan.steps.length} steps with available integrations`,
    limitations: `Some functionality will be limited due to missing integrations`
  };
}

/**
 * Generate user-facing message about missing integrations
 */
function generateUserMessage(missingIntegrations, canProceedPartially) {
  if (missingIntegrations.length === 0) {
    return null;
  }
  
  const criticalCount = missingIntegrations.filter(m => m.priority === 'critical').length;
  const highCount = missingIntegrations.filter(m => m.priority === 'high').length;
  
  let message = `I need access to ${missingIntegrations.length} integration${missingIntegrations.length > 1 ? 's' : ''} to complete this task:\n\n`;
  
  // List critical integrations first
  if (criticalCount > 0) {
    message += `**Critical (required for all tasks):**\n`;
    missingIntegrations
      .filter(m => m.priority === 'critical')
      .forEach(m => {
        message += `- ${m.integration_name}\n`;
      });
    message += `\n`;
  }
  
  // Then high priority
  if (highCount > 0) {
    message += `**High Priority:**\n`;
    missingIntegrations
      .filter(m => m.priority === 'high')
      .forEach(m => {
        message += `- ${m.integration_name}\n`;
      });
    message += `\n`;
  }
  
  // Options for user
  if (canProceedPartially) {
    message += `I can proceed with limited functionality using your existing integrations, or you can connect the missing integrations for full capabilities.\n\n`;
    message += `**Options:**\n`;
    message += `1. Connect missing integrations (recommended)\n`;
    message += `2. Proceed with partial execution\n`;
    message += `3. Cancel this request`;
  } else {
    message += `Unfortunately, I cannot proceed without these integrations. Please connect them to continue.\n\n`;
    message += `**Options:**\n`;
    message += `1. Connect required integrations\n`;
    message += `2. Cancel this request`;
  }
  
  return message;
}

/**
 * Handle user's response to integration prompt
 */
export function handleIntegrationResponse(userChoice, missingIntegrations, partialPlan) {
  switch (userChoice) {
    case 'connect':
      return {
        action: 'redirect_to_integrations',
        integrations_to_connect: missingIntegrations.map(m => ({
          id: m.integration_id,
          url: m.connect_url
        })),
        message: 'Please connect the required integrations and try again.'
      };
    
    case 'use_alternatives':
      // Find which alternatives to use
      const alternativeMappings = {};
      missingIntegrations.forEach(m => {
        if (m.alternatives.length > 0) {
          alternativeMappings[m.integration_id] = m.alternatives[0].id;
        }
      });
      
      return {
        action: 'proceed_with_alternatives',
        alternative_mappings: alternativeMappings,
        message: 'Proceeding with alternative integrations...'
      };
    
    case 'proceed_partial':
      if (!partialPlan) {
        return {
          action: 'error',
          message: 'Cannot proceed partially - critical integrations are missing.'
        };
      }
      
      return {
        action: 'execute_partial_plan',
        plan: partialPlan,
        message: 'Proceeding with available integrations...'
      };
    
    case 'cancel':
      return {
        action: 'cancel',
        message: 'Task cancelled. Let me know if you need anything else!'
      };
    
    default:
      return {
        action: 'error',
        message: 'Invalid choice. Please select a valid option.'
      };
  }
}

/**
 * Get integration status for display
 */
export function getIntegrationStatus(integrationId, userIntegrations) {
  const isConnected = userIntegrations.includes(integrationId);
  const integrationInfo = INTEGRATIONS_LIST.find(i => i.id === integrationId);
  
  return {
    id: integrationId,
    name: integrationInfo?.name || integrationId,
    status: isConnected ? 'connected' : 'available',
    category: integrationInfo?.category,
    capabilities: integrationInfo?.capabilities || [],
    can_connect: !isConnected
  };
}

/**
 * Get all available integrations for user
 */
export function getAllIntegrations(userIntegrations) {
  return INTEGRATIONS_LIST.map(integration => ({
    ...integration,
    status: userIntegrations.includes(integration.id) ? 'connected' : integration.status
  }));
}

