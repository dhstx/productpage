// Agent Execution Handler
import { asyncHandler } from '../middleware/errorHandler.js';
import { jarvisClient, AGENTS } from '../utils/jarvis-client.js';
import db from '../utils/database.js';

export const executeAgent = asyncHandler(async (req, res) => {
  const { agentId } = req.params;
  const { parameters } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Validate agent ID
  if (!Object.values(AGENTS).includes(agentId)) {
    return res.status(400).json({ error: 'Invalid agent ID' });
  }

  try {
    // Get user's subscription
    const subscription = await db.subscriptions.findByUserId(userId);
    if (!subscription) {
      return res.status(403).json({ error: 'No active subscription' });
    }

    // Check usage limits
    const monthlyUsage = await db.agent_usage.getMonthlyUsage(userId);
    const usageLimits = jarvisClient.checkUsageLimits(subscription.plan_id, monthlyUsage);

    if (usageLimits.exceeded) {
      return res.status(429).json({
        error: 'Usage limit exceeded',
        limits: usageLimits
      });
    }

    // Check if agent is available for this plan
    if (!usageLimits.limits.agents.includes(agentId)) {
      return res.status(403).json({
        error: 'Agent not available in your plan',
        available_agents: usageLimits.limits.agents
      });
    }

    // Execute agent
    const result = await jarvisClient.executeAgent(agentId, parameters);

    // Log usage
    await db.agent_usage.create({
      user_id: userId,
      agent_id: agentId,
      task_type: parameters.task_type || 'general',
      tokens_used: result.tokens_used,
      execution_time_ms: result.execution_time_ms,
      status: result.status,
      error_message: result.error || null,
      request_data: parameters,
      response_data: result.result
    });

    res.json({
      success: result.success,
      agent_id: agentId,
      result: result.result,
      execution_time_ms: result.execution_time_ms,
      tokens_used: result.tokens_used,
      usage: {
        current: monthlyUsage,
        remaining: usageLimits.remaining
      }
    });
  } catch (error) {
    console.error('Agent execution error:', error);
    res.status(500).json({
      error: 'Agent execution failed',
      message: error.message
    });
  }
});

export const getAgentStatus = asyncHandler(async (req, res) => {
  const { agentId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const status = await jarvisClient.getAgentStatus(agentId);
    res.json(status);
  } catch (error) {
    console.error('Error getting agent status:', error);
    res.status(500).json({ error: 'Failed to get agent status' });
  }
});

export const listAgents = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    // Get user's subscription to determine available agents
    const subscription = await db.subscriptions.findByUserId(userId);
    const monthlyUsage = await db.agent_usage.getMonthlyUsage(userId);
    const usageLimits = jarvisClient.checkUsageLimits(
      subscription?.plan_id || 'free',
      monthlyUsage
    );

    // Get all agents from Jarvis
    const agents = await jarvisClient.listAgents();

    res.json({
      agents: agents.length > 0 ? agents : Object.entries(AGENTS).map(([key, id]) => ({
        id,
        name: key.toLowerCase().replace(/_/g, ' '),
        available: usageLimits.limits.agents.includes(id)
      })),
      usage: {
        current: monthlyUsage,
        limits: usageLimits.limits,
        remaining: usageLimits.remaining
      }
    });
  } catch (error) {
    console.error('Error listing agents:', error);
    res.status(500).json({ error: 'Failed to list agents' });
  }
});

export const getAgentLogs = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { limit = 100 } = req.query;

  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const logs = await db.agent_usage.getUserLogs(userId, parseInt(limit));
    res.json(logs);
  } catch (error) {
    console.error('Error getting agent logs:', error);
    res.status(500).json({ error: 'Failed to get agent logs' });
  }
});

