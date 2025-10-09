// Jarvis Framework API Client
import axios from 'axios';

const JARVIS_API_URL = process.env.JARVIS_API_URL || 'https://api.jarvis.manus.ai';
const JARVIS_API_KEY = process.env.JARVIS_API_KEY;

// Agent IDs from Jarvis Framework
export const AGENTS = {
  MASTER_COORDINATOR: 'master_coordinator',
  CONTENT_ORCHESTRATOR: 'content_orchestrator',
  VIDEO_SPECIALIST: 'video_specialist',
  MARKETING_HUB: 'marketing_hub',
  BUSINESS_ARCHITECT: 'business_architect',
  RESEARCH_ANALYST: 'research_analyst',
  DATA_SCIENTIST: 'data_scientist',
  WORKFLOW_AUTOMATOR: 'workflow_automator',
  INTEGRATION_SPECIALIST: 'integration_specialist',
  INFRASTRUCTURE_MANAGER: 'infrastructure_manager',
  SECURITY_GUARDIAN: 'security_guardian',
  ANALYTICS_ENGINE: 'analytics_engine'
};

class JarvisClient {
  constructor() {
    this.apiUrl = JARVIS_API_URL;
    this.apiKey = JARVIS_API_KEY;
    this.client = axios.create({
      baseURL: this.apiUrl,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 60000 // 60 second timeout
    });
  }

  /**
   * Execute an agent task
   * @param {string} agentId - The agent ID
   * @param {object} params - Task parameters
   * @returns {Promise<object>} - Agent response
   */
  async executeAgent(agentId, params) {
    try {
      const startTime = Date.now();
      
      const response = await this.client.post('/agents/execute', {
        agent_id: agentId,
        parameters: params,
        metadata: {
          timestamp: new Date().toISOString(),
          source: 'dhstx-platform'
        }
      });

      const executionTime = Date.now() - startTime;

      return {
        success: true,
        agent_id: agentId,
        result: response.data,
        execution_time_ms: executionTime,
        tokens_used: response.data.tokens_used || 0,
        status: 'success'
      };
    } catch (error) {
      console.error(`Jarvis agent execution error (${agentId}):`, error.message);
      
      return {
        success: false,
        agent_id: agentId,
        error: error.message,
        status: 'failed',
        execution_time_ms: 0,
        tokens_used: 0
      };
    }
  }

  /**
   * Get agent status
   * @param {string} agentId - The agent ID
   * @returns {Promise<object>} - Agent status
   */
  async getAgentStatus(agentId) {
    try {
      const response = await this.client.get(`/agents/${agentId}/status`);
      return response.data;
    } catch (error) {
      console.error(`Error getting agent status (${agentId}):`, error.message);
      return {
        agent_id: agentId,
        status: 'unknown',
        error: error.message
      };
    }
  }

  /**
   * List all available agents
   * @returns {Promise<array>} - List of agents
   */
  async listAgents() {
    try {
      const response = await this.client.get('/agents');
      return response.data;
    } catch (error) {
      console.error('Error listing agents:', error.message);
      return [];
    }
  }

  /**
   * Get agent execution logs
   * @param {string} executionId - The execution ID
   * @returns {Promise<object>} - Execution logs
   */
  async getExecutionLogs(executionId) {
    try {
      const response = await this.client.get(`/executions/${executionId}/logs`);
      return response.data;
    } catch (error) {
      console.error('Error getting execution logs:', error.message);
      return null;
    }
  }

  /**
   * Cancel an agent execution
   * @param {string} executionId - The execution ID
   * @returns {Promise<boolean>} - Success status
   */
  async cancelExecution(executionId) {
    try {
      await this.client.post(`/executions/${executionId}/cancel`);
      return true;
    } catch (error) {
      console.error('Error canceling execution:', error.message);
      return false;
    }
  }

  /**
   * Check usage limits for a user's plan
   * @param {string} planId - The subscription plan ID
   * @param {number} currentUsage - Current monthly usage
   * @returns {object} - Usage limit info
   */
  checkUsageLimits(planId, currentUsage) {
    const limits = {
      free: {
        api_calls: 100,
        tokens: 10000,
        agents: ['master_coordinator', 'content_orchestrator']
      },
      starter: {
        api_calls: 1000,
        tokens: 100000,
        agents: Object.values(AGENTS).slice(0, 6)
      },
      professional: {
        api_calls: 10000,
        tokens: 1000000,
        agents: Object.values(AGENTS)
      },
      enterprise: {
        api_calls: -1, // unlimited
        tokens: -1,
        agents: Object.values(AGENTS)
      }
    };

    const planLimits = limits[planId] || limits.free;
    const remaining = {
      api_calls: planLimits.api_calls === -1 ? -1 : planLimits.api_calls - currentUsage.api_calls,
      tokens: planLimits.tokens === -1 ? -1 : planLimits.tokens - currentUsage.tokens_used
    };

    return {
      plan: planId,
      limits: planLimits,
      current: currentUsage,
      remaining,
      exceeded: remaining.api_calls !== -1 && remaining.api_calls <= 0
    };
  }
}

// Export singleton instance
export const jarvisClient = new JarvisClient();
export default jarvisClient;

