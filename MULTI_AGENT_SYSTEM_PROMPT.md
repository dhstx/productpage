# Multi-Agent Orchestration System - Complete Specification

## Executive Summary

Design and implement a sophisticated multi-agent orchestration system for DHStx that enables users to execute complex business tasks through natural language conversations. The system leverages personal integrations, department-specific lead agents, and specialist agents working collaboratively to deliver comprehensive solutions.

**Key Innovation**: Users interact with a single department lead (or the Orchestrator), who intelligently delegates to specialist agents, checks for required integrations, executes tasks, and reports unified results back to the user.

---

## System Variables (DHStx Configuration)

### Business Categories & Department Leads

```json
{
  "BUSINESS_CATEGORIES": [
    "Strategy & Leadership",
    "Operations & Project Management",
    "Research & Intelligence",
    "Technical Development",
    "Creative & Design",
    "Marketing & Communications",
    "Customer Relations",
    "Knowledge Management",
    "Financial Operations",
    "Legal & Compliance",
    "Security & Data Protection",
    "Performance & Analytics"
  ],
  
  "LEADS": {
    "Strategy & Leadership": "Chief of Staff",
    "Operations & Project Management": "Conductor",
    "Research & Intelligence": "Scout",
    "Technical Development": "Builder",
    "Creative & Design": "Muse",
    "Marketing & Communications": "Echo",
    "Customer Relations": "Connector",
    "Knowledge Management": "Archivist",
    "Financial Operations": "Ledger",
    "Legal & Compliance": "Counselor",
    "Security & Data Protection": "Sentinel",
    "Performance & Analytics": "Optimizer",
    "General/Multi-Category": "Orchestrator"
  }
}
```

### Agent Capabilities Matrix

```json
{
  "AGENT_CAPABILITIES": {
    "Orchestrator": {
      "primary": ["routing", "coordination", "multi-agent-orchestration"],
      "integrations": ["all"],
      "can_delegate_to": ["all_agents"]
    },
    "Chief of Staff": {
      "primary": ["strategic-planning", "decision-making", "goal-setting"],
      "integrations": ["notion", "taskade", "google-docs"],
      "can_delegate_to": ["Conductor", "Scout", "Ledger", "Optimizer"]
    },
    "Conductor": {
      "primary": ["project-management", "task-coordination", "workflow-optimization"],
      "integrations": ["taskade", "notion", "make", "google-calendar"],
      "can_delegate_to": ["Builder", "Muse", "Echo", "Connector"]
    },
    "Scout": {
      "primary": ["research", "market-analysis", "competitive-intelligence"],
      "integrations": ["explorium", "pophive", "hugging-face"],
      "can_delegate_to": ["Archivist", "Optimizer"]
    },
    "Builder": {
      "primary": ["coding", "technical-architecture", "development"],
      "integrations": ["github", "vercel", "cloudflare", "supabase"],
      "can_delegate_to": ["Sentinel", "Optimizer"]
    },
    "Muse": {
      "primary": ["design", "branding", "creative-content"],
      "integrations": ["invideo", "image-generation"],
      "can_delegate_to": ["Echo", "Archivist"]
    },
    "Echo": {
      "primary": ["marketing", "communications", "campaigns"],
      "integrations": ["taskade", "notion", "invideo"],
      "can_delegate_to": ["Muse", "Connector", "Optimizer"]
    },
    "Connector": {
      "primary": ["customer-relations", "support", "engagement"],
      "integrations": ["intercom", "gmail", "taskade"],
      "can_delegate_to": ["Echo", "Archivist"]
    },
    "Archivist": {
      "primary": ["knowledge-management", "documentation", "organization"],
      "integrations": ["notion", "airtable", "google-docs"],
      "can_delegate_to": []
    },
    "Ledger": {
      "primary": ["financial-analysis", "budgeting", "forecasting"],
      "integrations": ["stripe", "airtable", "supabase"],
      "can_delegate_to": ["Optimizer", "Archivist"]
    },
    "Counselor": {
      "primary": ["legal", "compliance", "risk-management"],
      "integrations": ["notion", "airtable"],
      "can_delegate_to": ["Archivist", "Sentinel"]
    },
    "Sentinel": {
      "primary": ["security", "data-protection", "threat-detection"],
      "integrations": ["cloudflare", "supabase", "github"],
      "can_delegate_to": []
    },
    "Optimizer": {
      "primary": ["analytics", "performance-monitoring", "efficiency"],
      "integrations": ["supabase", "airtable", "vercel"],
      "can_delegate_to": ["Archivist"]
    }
  }
}
```

### Available Integrations

```json
{
  "INTEGRATIONS_LIST": [
    {
      "id": "cloudflare",
      "name": "Cloudflare",
      "category": "infrastructure",
      "capabilities": ["dns", "workers", "d1", "r2", "kv"],
      "scopes": ["account:read", "workers:write", "dns:edit"],
      "status": "connected"
    },
    {
      "id": "stripe",
      "name": "Stripe",
      "category": "payments",
      "capabilities": ["payments", "subscriptions", "customers", "invoices"],
      "scopes": ["read_write"],
      "status": "connected"
    },
    {
      "id": "taskade",
      "name": "Taskade",
      "category": "productivity",
      "capabilities": ["tasks", "projects", "workflows", "collaboration"],
      "scopes": ["read_write"],
      "status": "connected"
    },
    {
      "id": "explorium",
      "name": "Explorium",
      "category": "data",
      "capabilities": ["business-intelligence", "prospect-discovery", "enrichment"],
      "scopes": ["read"],
      "status": "connected"
    },
    {
      "id": "invideo",
      "name": "InVideo",
      "category": "media",
      "capabilities": ["video-generation", "templates", "automation"],
      "scopes": ["create"],
      "status": "connected"
    },
    {
      "id": "pophive",
      "name": "PopHIVE",
      "category": "data",
      "capabilities": ["public-health-data", "datasets"],
      "scopes": ["read"],
      "status": "connected"
    },
    {
      "id": "intercom",
      "name": "Intercom",
      "category": "customer-support",
      "capabilities": ["conversations", "chats", "support-automation"],
      "scopes": ["read_write"],
      "status": "connected"
    },
    {
      "id": "supabase",
      "name": "Supabase",
      "category": "database",
      "capabilities": ["database", "auth", "storage", "realtime"],
      "scopes": ["read_write"],
      "status": "connected"
    },
    {
      "id": "notion",
      "name": "Notion",
      "category": "productivity",
      "capabilities": ["documents", "databases", "knowledge-management"],
      "scopes": ["read_write"],
      "status": "connected"
    },
    {
      "id": "vercel",
      "name": "Vercel",
      "category": "infrastructure",
      "capabilities": ["deployments", "projects", "domains", "logs"],
      "scopes": ["read_write"],
      "status": "connected"
    },
    {
      "id": "hugging-face",
      "name": "Hugging Face",
      "category": "ai",
      "capabilities": ["models", "datasets", "research"],
      "scopes": ["read"],
      "status": "connected"
    },
    {
      "id": "airtable",
      "name": "Airtable",
      "category": "database",
      "capabilities": ["databases", "automation", "collaboration"],
      "scopes": ["read_write"],
      "status": "connected"
    },
    {
      "id": "make",
      "name": "Make",
      "category": "automation",
      "capabilities": ["workflows", "scenarios", "integrations"],
      "scopes": ["execute"],
      "status": "connected"
    },
    {
      "id": "github",
      "name": "GitHub",
      "category": "development",
      "capabilities": ["repositories", "code", "collaboration"],
      "scopes": ["read_write"],
      "status": "connected"
    },
    {
      "id": "gmail",
      "name": "Gmail",
      "category": "communication",
      "capabilities": ["email", "send", "read"],
      "scopes": ["read_write"],
      "status": "available"
    },
    {
      "id": "google-calendar",
      "name": "Google Calendar",
      "category": "productivity",
      "capabilities": ["events", "scheduling", "reminders"],
      "scopes": ["read_write"],
      "status": "available"
    },
    {
      "id": "google-docs",
      "name": "Google Docs",
      "category": "productivity",
      "capabilities": ["documents", "collaboration", "editing"],
      "scopes": ["read_write"],
      "status": "available"
    }
  ]
}
```

---

## 1. System Overview

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                            USER                                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      ORCHESTRATOR                                │
│  • Analyzes user request                                        │
│  • Routes to appropriate Department Lead                        │
│  • Handles multi-category tasks                                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   DEPARTMENT LEAD AGENT                          │
│  • Receives categorized request                                 │
│  • Plans task execution                                         │
│  • Selects minimal set of specialist agents                     │
│  • Checks integration requirements                              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  INTEGRATION MANAGER                             │
│  • Checks required integrations                                 │
│  • Identifies missing connections                               │
│  • Prompts user to add integrations if needed                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    │  All Required?  │
                    └────────┬────────┘
                             │
                ┌────────────┴────────────┐
                │ YES                     │ NO
                ▼                         ▼
    ┌───────────────────────┐   ┌──────────────────┐
    │ EXECUTE TASK          │   │ PROMPT USER      │
    │                       │   │ Add Integration  │
    └───────┬───────────────┘   └──────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│              SPECIALIST AGENTS (Parallel Execution)              │
│  Agent 1  │  Agent 2  │  Agent 3  │  ...                        │
│  ─────────┼───────────┼───────────┼─────                        │
│  Execute  │  Execute  │  Execute  │                             │
│  subtask  │  subtask  │  subtask  │                             │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              AGGREGATION & VALIDATION                            │
│  • Collect results from all specialist agents                   │
│  • Validate outputs                                             │
│  • Resolve conflicts                                            │
│  • Synthesize unified response                                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   DEPARTMENT LEAD REPORT                         │
│  • Summarizes execution                                         │
│  • Highlights key findings                                      │
│  • Provides actionable recommendations                          │
│  • Includes next steps                                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                            USER                                  │
│  Receives concise, actionable report                            │
└─────────────────────────────────────────────────────────────────┘
```

### Control Flow Narrative

**Happy Path:**
1. User submits natural language request
2. Orchestrator classifies request into business category
3. Routes to appropriate Department Lead
4. Lead analyzes task and creates execution plan
5. Lead identifies required specialist agents (minimal viable set)
6. Integration Manager checks for required integrations
7. All integrations available → proceed to execution
8. Specialist agents execute subtasks in parallel
9. Results aggregated and validated
10. Lead synthesizes unified report
11. User receives actionable summary

**Missing Integration Path:**
1-6. Same as happy path
7. Missing integration detected
8. Integration Manager prompts user: "To complete this task, I need access to [Integration]. Would you like to connect it?"
9a. User accepts → redirect to integration page → retry after connection
9b. User declines → Lead suggests alternative approach or partial execution
10. Continue with available integrations or abort gracefully

---

## 2. Data Schemas

### Integration Object

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "name": { "type": "string" },
    "category": { "type": "string" },
    "capabilities": {
      "type": "array",
      "items": { "type": "string" }
    },
    "scopes": {
      "type": "array",
      "items": { "type": "string" }
    },
    "status": {
      "type": "string",
      "enum": ["connected", "available", "disconnected"]
    },
    "metadata": {
      "type": "object",
      "properties": {
        "connected_at": { "type": "string", "format": "date-time" },
        "last_used": { "type": "string", "format": "date-time" }
      }
    }
  },
  "required": ["id", "name", "category", "capabilities", "status"]
}
```

### User Request

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "request_id": { "type": "string" },
    "user_id": { "type": "string" },
    "message": { "type": "string" },
    "context": {
      "type": "object",
      "properties": {
        "session_id": { "type": "string" },
        "previous_messages": {
          "type": "array",
          "items": { "type": "object" }
        },
        "user_integrations": {
          "type": "array",
          "items": { "type": "string" }
        }
      }
    },
    "timestamp": { "type": "string", "format": "date-time" }
  },
  "required": ["request_id", "user_id", "message", "timestamp"]
}
```

### Routing Decision

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "request_id": { "type": "string" },
    "category": { "type": "string" },
    "lead_agent": { "type": "string" },
    "confidence": { "type": "number", "minimum": 0, "maximum": 1 },
    "reasoning": { "type": "string" },
    "alternative_categories": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "category": { "type": "string" },
          "confidence": { "type": "number" }
        }
      }
    }
  },
  "required": ["request_id", "category", "lead_agent", "confidence"]
}
```

### Agent Invocation Envelope

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "invocation_id": { "type": "string" },
    "agent_id": { "type": "string" },
    "task": { "type": "string" },
    "inputs": {
      "type": "object",
      "additionalProperties": true
    },
    "required_integrations": {
      "type": "array",
      "items": { "type": "string" }
    },
    "context": {
      "type": "object",
      "properties": {
        "parent_request_id": { "type": "string" },
        "lead_agent": { "type": "string" },
        "sibling_agents": {
          "type": "array",
          "items": { "type": "string" }
        }
      }
    },
    "constraints": {
      "type": "object",
      "properties": {
        "max_execution_time": { "type": "integer" },
        "output_format": { "type": "string" }
      }
    }
  },
  "required": ["invocation_id", "agent_id", "task", "inputs"]
}
```

### Result Bundle

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "invocation_id": { "type": "string" },
    "agent_id": { "type": "string" },
    "status": {
      "type": "string",
      "enum": ["success", "partial_success", "failure"]
    },
    "output": {
      "type": "object",
      "additionalProperties": true
    },
    "metadata": {
      "type": "object",
      "properties": {
        "execution_time_ms": { "type": "integer" },
        "integrations_used": {
          "type": "array",
          "items": { "type": "string" }
        },
        "tokens_used": { "type": "integer" },
        "confidence": { "type": "number" }
      }
    },
    "errors": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "code": { "type": "string" },
          "message": { "type": "string" },
          "severity": {
            "type": "string",
            "enum": ["warning", "error", "critical"]
          }
        }
      }
    }
  },
  "required": ["invocation_id", "agent_id", "status", "output"]
}
```

### Lead Report to User

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "request_id": { "type": "string" },
    "lead_agent": { "type": "string" },
    "summary": { "type": "string" },
    "key_findings": {
      "type": "array",
      "items": { "type": "string" }
    },
    "actions_taken": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "agent": { "type": "string" },
          "action": { "type": "string" },
          "result": { "type": "string" }
        }
      }
    },
    "recommendations": {
      "type": "array",
      "items": { "type": "string" }
    },
    "next_steps": {
      "type": "array",
      "items": { "type": "string" }
    },
    "artifacts": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": { "type": "string" },
          "type": { "type": "string" },
          "url": { "type": "string" }
        }
      }
    },
    "metadata": {
      "type": "object",
      "properties": {
        "agents_involved": {
          "type": "array",
          "items": { "type": "string" }
        },
        "total_execution_time_ms": { "type": "integer" },
        "integrations_used": {
          "type": "array",
          "items": { "type": "string" }
        }
      }
    }
  },
  "required": ["request_id", "lead_agent", "summary"]
}
```

---

## 3. Policies and Routing

### Category Classification Rules

```javascript
const classifyRequest = (userMessage) => {
  // Priority-based classification with tie-breakers
  
  const rules = [
    {
      category: "Strategy & Leadership",
      keywords: ["strategic", "plan", "vision", "goal", "leadership", "executive", "decision"],
      weight: 1.0,
      lead: "Chief of Staff"
    },
    {
      category: "Operations & Project Management",
      keywords: ["project", "task", "timeline", "coordinate", "manage", "workflow"],
      weight: 0.9,
      lead: "Conductor"
    },
    {
      category: "Research & Intelligence",
      keywords: ["research", "analyze", "market", "trends", "competitive", "data"],
      weight: 0.8,
      lead: "Scout"
    },
    {
      category: "Technical Development",
      keywords: ["code", "develop", "build", "deploy", "technical", "architecture"],
      weight: 0.9,
      lead: "Builder"
    },
    {
      category: "Creative & Design",
      keywords: ["design", "creative", "brand", "visual", "video", "image"],
      weight: 0.8,
      lead: "Muse"
    },
    {
      category: "Marketing & Communications",
      keywords: ["marketing", "campaign", "communication", "message", "promote"],
      weight: 0.8,
      lead: "Echo"
    },
    {
      category: "Customer Relations",
      keywords: ["customer", "support", "engagement", "relationship", "client"],
      weight: 0.7,
      lead: "Connector"
    },
    {
      category: "Knowledge Management",
      keywords: ["document", "organize", "knowledge", "archive", "summarize"],
      weight: 0.7,
      lead: "Archivist"
    },
    {
      category: "Financial Operations",
      keywords: ["financial", "budget", "forecast", "revenue", "expense", "payment"],
      weight: 0.9,
      lead: "Ledger"
    },
    {
      category: "Legal & Compliance",
      keywords: ["legal", "compliance", "contract", "regulation", "risk"],
      weight: 0.9,
      lead: "Counselor"
    },
    {
      category: "Security & Data Protection",
      keywords: ["security", "protect", "threat", "vulnerability", "privacy"],
      weight: 1.0,
      lead: "Sentinel"
    },
    {
      category: "Performance & Analytics",
      keywords: ["analytics", "performance", "metrics", "optimize", "efficiency"],
      weight: 0.8,
      lead: "Optimizer"
    }
  ];
  
  // Tie-breaker: If multiple categories match with similar scores,
  // route to Orchestrator for multi-category handling
  const threshold = 0.15; // 15% difference required for clear winner
  
  // Default fallback
  return {
    category: "General/Multi-Category",
    lead: "Orchestrator",
    confidence: 0.5
  };
};
```

### Agent Selection Policy

```javascript
const selectAgents = (category, task, leadAgent) => {
  // Minimal viable set principle
  // 1. Identify required capabilities from task
  // 2. Map capabilities to agents
  // 3. Select minimal set that covers all capabilities
  // 4. Apply precedence rules for overlapping capabilities
  // 5. Resolve conflicts (prefer specialist over generalist)
  
  const capabilities = extractRequiredCapabilities(task);
  const candidateAgents = mapCapabilitiesToAgents(capabilities);
  const minimalSet = selectMinimalViableSet(candidateAgents);
  
  return {
    primary_agents: minimalSet,
    backup_agents: identifyBackups(minimalSet),
    execution_order: determineExecutionOrder(minimalSet, task)
  };
};
```

### Integration Requirement Resolution

```javascript
const checkIntegrations = (agents, userIntegrations) => {
  const requiredIntegrations = [];
  const missingIntegrations = [];
  const alternatives = [];
  
  agents.forEach(agent => {
    const agentIntegrations = AGENT_CAPABILITIES[agent].integrations;
    
    agentIntegrations.forEach(integration => {
      if (!userIntegrations.includes(integration)) {
        missingIntegrations.push({
          integration: integration,
          required_by: agent,
          alternatives: findAlternatives(integration),
          priority: determinePriority(agent, integration)
        });
      }
    });
  });
  
  return {
    all_required: missingIntegrations.length === 0,
    missing: missingIntegrations,
    can_proceed_partially: checkPartialExecution(missingIntegrations),
    user_prompt: generateIntegrationPrompt(missingIntegrations)
  };
};
```

---

## 4. Prompts and Role Specifications

### Orchestrator System Prompt

```markdown
# Role: Orchestrator - Central Intelligence Hub

## Responsibilities
- Analyze incoming user requests and classify into business categories
- Route requests to appropriate Department Lead agents
- Handle multi-category tasks by coordinating multiple leads
- Maintain conversation context and session state
- Escalate ambiguous requests to user for clarification

## Required Inputs
- User message (natural language)
- User ID and session context
- List of user's connected integrations
- Conversation history

## Expected Outputs
- Routing decision with category classification
- Confidence score (0-1)
- Reasoning for classification
- Alternative categories if confidence < 0.7

## Strict Output Format
```json
{
  "category": "string",
  "lead_agent": "string",
  "confidence": number,
  "reasoning": "string",
  "requires_clarification": boolean,
  "clarification_question": "string | null"
}
```

## Decision Logic
1. Analyze user message for intent and domain
2. Match against business category keywords
3. If confidence >= 0.7: route to lead
4. If 0.4 <= confidence < 0.7: ask clarifying question
5. If confidence < 0.4: default to Orchestrator (self-handle)
6. For multi-category: coordinate multiple leads

## Example Behavior
User: "Help me develop a strategic plan for our Q2 marketing campaign"
Output:
```json
{
  "category": "Strategy & Leadership",
  "lead_agent": "Chief of Staff",
  "confidence": 0.85,
  "reasoning": "Request involves strategic planning (Chief of Staff's domain) with marketing component (will delegate to Echo)",
  "requires_clarification": false,
  "clarification_question": null
}
```
```

### Department Lead System Prompt Template

```markdown
# Role: {LEAD_NAME} - {CATEGORY} Department Lead

## Responsibilities
- Receive categorized requests from Orchestrator
- Analyze task requirements and create execution plan
- Select minimal viable set of specialist agents
- Coordinate agent execution and aggregate results
- Validate outputs and synthesize unified report
- Report back to user with actionable summary

## Required Inputs
- User request (already categorized)
- User's connected integrations
- Available specialist agents
- Task context and constraints

## Expected Outputs
- Execution plan with selected agents
- Integration requirements check
- Aggregated results from specialist agents
- Final user-facing report

## Strict Output Format

### Planning Phase
```json
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
}
```

### Reporting Phase
```json
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
}
```

## Decision Logic
1. Analyze user request for specific requirements
2. Identify required capabilities
3. Map capabilities to specialist agents
4. Select minimal viable set (avoid redundancy)
5. Check integration requirements
6. If missing integrations: prompt user
7. Execute plan with selected agents
8. Aggregate and validate results
9. Synthesize unified report
10. Present to user with clear next steps

## Delegation Rules
- Only delegate to agents in your `can_delegate_to` list
- Prefer specialist agents over generalists
- Minimize number of agents (efficiency)
- Ensure all required capabilities are covered
- Handle integration checks before execution

## Example Behavior
User (via Orchestrator): "Create a project timeline for our new product launch"

Planning:
```json
{
  "task_analysis": "User needs project timeline creation - requires task breakdown, scheduling, and coordination",
  "required_capabilities": ["project-management", "task-coordination", "scheduling"],
  "selected_agents": ["Conductor"],
  "execution_plan": {
    "steps": [
      {
        "agent": "Conductor",
        "task": "Create detailed project timeline with milestones and dependencies",
        "dependencies": [],
        "required_integrations": ["taskade", "google-calendar"]
      }
    ]
  },
  "estimated_time": "2-3 minutes"
}
```

Reporting:
```json
{
  "summary": "Created comprehensive project timeline for product launch with 12 milestones across 4 phases",
  "key_findings": [
    "Launch timeline: 16 weeks from kickoff to market release",
    "Critical path identified: Design → Development → Testing → Launch",
    "Resource allocation: 3 teams, 8 key stakeholders"
  ],
  "actions_taken": [
    {
      "agent": "Conductor",
      "action": "Generated project timeline in Taskade",
      "result": "Timeline created with 47 tasks, 12 milestones, dependencies mapped"
    }
  ],
  "recommendations": [
    "Schedule weekly sync meetings for cross-team coordination",
    "Build 2-week buffer before launch for unforeseen delays",
    "Assign dedicated project manager for timeline tracking"
  ],
  "next_steps": [
    "Review timeline with stakeholders",
    "Assign task owners in Taskade",
    "Set up automated reminders for milestone deadlines"
  ],
  "artifacts": [
    {
      "name": "Product Launch Timeline",
      "type": "taskade_project",
      "url": "https://taskade.com/projects/..."
    }
  ]
}
```
```

### Specialist Agent Template

```markdown
# Role: {AGENT_NAME} - {SPECIALTY} Specialist

## Responsibilities
- Execute specific subtasks delegated by Department Lead
- Use required integrations to complete tasks
- Return structured results to Lead
- Report errors or missing resources

## Required Inputs
- Specific task description
- Input data/parameters
- Required integrations (verified available)
- Output format specification

## Expected Outputs
- Task result (structured data)
- Execution metadata (time, integrations used, confidence)
- Errors or warnings (if any)

## Strict Output Format
```json
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
  "errors": [
    {
      "code": "string",
      "message": "string",
      "severity": "warning | error | critical"
    }
  ]
}
```

## Execution Logic
1. Validate inputs and required integrations
2. Execute task using available integrations
3. Structure output according to specification
4. Include metadata for transparency
5. Report any errors or warnings
6. Return to Department Lead

## Integration Usage
- Only use integrations specified in task envelope
- Handle integration errors gracefully
- Report missing permissions or rate limits
- Suggest alternatives if primary integration fails
```

### Integration Manager System Prompt

```markdown
# Role: Integration Manager

## Responsibilities
- Check integration requirements for task execution
- Identify missing integrations
- Generate user-friendly prompts for missing integrations
- Suggest alternatives when possible
- Track integration usage and permissions

## Required Inputs
- List of required integrations (from execution plan)
- User's connected integrations
- Integration catalog with capabilities

## Expected Outputs
- Integration check result
- Missing integrations list with priorities
- User prompt (if integrations missing)
- Alternative suggestions

## Strict Output Format
```json
{
  "all_required_available": boolean,
  "missing_integrations": [
    {
      "integration_id": "string",
      "integration_name": "string",
      "required_by_agent": "string",
      "priority": "critical | high | medium | low",
      "alternatives": ["string"],
      "user_prompt": "string"
    }
  ],
  "can_proceed_partially": boolean,
  "partial_execution_plan": {
    // Modified plan using only available integrations
  }
}
```

## Decision Logic
1. Compare required integrations vs user's connected integrations
2. Identify gaps
3. Prioritize missing integrations (critical > high > medium > low)
4. Find alternatives if available
5. Determine if partial execution is possible
6. Generate user-friendly prompt

## User Prompt Generation
- Be specific about what integration is needed
- Explain why it's needed for the task
- Offer alternatives if available
- Make it easy to connect (provide link)
- Allow user to proceed partially or abort

## Example Behavior
Required: ["taskade", "google-calendar"]
User has: ["taskade"]
Missing: ["google-calendar"]

Output:
```json
{
  "all_required_available": false,
  "missing_integrations": [
    {
      "integration_id": "google-calendar",
      "integration_name": "Google Calendar",
      "required_by_agent": "Conductor",
      "priority": "high",
      "alternatives": ["taskade-calendar"],
      "user_prompt": "To create a complete project timeline with calendar integration, I need access to Google Calendar. Would you like to connect it now, or should I proceed using Taskade's built-in calendar?"
    }
  ],
  "can_proceed_partially": true,
  "partial_execution_plan": {
    "note": "Timeline will be created in Taskade only, without Google Calendar sync"
  }
}
```
```

---

## 5. API Surface and Contracts

### Core API Functions

```typescript
// 1. Classify user request and route to appropriate lead
interface ClassifyRequestInput {
  request_id: string;
  user_id: string;
  message: string;
  context: {
    session_id: string;
    previous_messages: Message[];
    user_integrations: string[];
  };
}

interface ClassifyRequestOutput {
  category: string;
  lead_agent: string;
  confidence: number;
  reasoning: string;
  requires_clarification: boolean;
  clarification_question?: string;
}

async function classify_request(
  input: ClassifyRequestInput
): Promise<ClassifyRequestOutput>;

// 2. Plan task execution with selected agents
interface PlanTaskInput {
  request_id: string;
  category: string;
  lead_agent: string;
  user_message: string;
  user_integrations: string[];
}

interface PlanTaskOutput {
  task_analysis: string;
  required_capabilities: string[];
  selected_agents: string[];
  execution_plan: {
    steps: Array<{
      agent: string;
      task: string;
      dependencies: string[];
      required_integrations: string[];
    }>;
  };
  estimated_time: string;
}

async function plan_task(
  input: PlanTaskInput
): Promise<PlanTaskOutput>;

// 3. Check integration requirements
interface CheckIntegrationsInput {
  execution_plan: PlanTaskOutput;
  user_integrations: string[];
}

interface CheckIntegrationsOutput {
  all_required_available: boolean;
  missing_integrations: Array<{
    integration_id: string;
    integration_name: string;
    required_by_agent: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    alternatives: string[];
    user_prompt: string;
  }>;
  can_proceed_partially: boolean;
  partial_execution_plan?: object;
}

async function check_integrations(
  input: CheckIntegrationsInput
): Promise<CheckIntegrationsOutput>;

// 4. Execute task plan with agents
interface ExecutePlanInput {
  request_id: string;
  execution_plan: PlanTaskOutput;
  user_integrations: string[];
}

interface ExecutePlanOutput {
  results: Array<{
    invocation_id: string;
    agent_id: string;
    status: 'success' | 'partial_success' | 'failure';
    output: object;
    metadata: {
      execution_time_ms: number;
      integrations_used: string[];
      tokens_used: number;
      confidence: number;
    };
    errors: Array<{
      code: string;
      message: string;
      severity: 'warning' | 'error' | 'critical';
    }>;
  }>;
}

async function execute_plan(
  input: ExecutePlanInput
): Promise<ExecutePlanOutput>;

// 5. Aggregate and validate results
interface AggregateResultsInput {
  request_id: string;
  lead_agent: string;
  agent_results: ExecutePlanOutput['results'];
}

interface AggregateResultsOutput {
  aggregated_output: object;
  validation_status: 'valid' | 'partial' | 'invalid';
  conflicts: Array<{
    field: string;
    values: any[];
    resolution: string;
  }>;
  confidence: number;
}

async function aggregate_and_validate(
  input: AggregateResultsInput
): Promise<AggregateResultsOutput>;

// 6. Produce final lead report
interface ProduceReportInput {
  request_id: string;
  lead_agent: string;
  aggregated_results: AggregateResultsOutput;
  original_request: string;
}

interface ProduceReportOutput {
  summary: string;
  key_findings: string[];
  actions_taken: Array<{
    agent: string;
    action: string;
    result: string;
  }>;
  recommendations: string[];
  next_steps: string[];
  artifacts: Array<{
    name: string;
    type: string;
    url: string;
  }>;
  metadata: {
    agents_involved: string[];
    total_execution_time_ms: number;
    integrations_used: string[];
  };
}

async function produce_lead_report(
  input: ProduceReportInput
): Promise<ProduceReportOutput>;
```

### Error Codes

```typescript
enum ErrorCode {
  // Classification errors
  CLASSIFICATION_AMBIGUOUS = 'E1001',
  CLASSIFICATION_FAILED = 'E1002',
  
  // Planning errors
  NO_SUITABLE_AGENTS = 'E2001',
  PLANNING_FAILED = 'E2002',
  
  // Integration errors
  INTEGRATION_MISSING = 'E3001',
  INTEGRATION_UNAUTHORIZED = 'E3002',
  INTEGRATION_RATE_LIMITED = 'E3003',
  INTEGRATION_FAILED = 'E3004',
  
  // Execution errors
  AGENT_EXECUTION_FAILED = 'E4001',
  AGENT_TIMEOUT = 'E4002',
  AGENT_INVALID_OUTPUT = 'E4003',
  
  // Aggregation errors
  RESULT_CONFLICT = 'E5001',
  VALIDATION_FAILED = 'E5002',
  
  // System errors
  INTERNAL_ERROR = 'E9001',
  RATE_LIMIT_EXCEEDED = 'E9002'
}
```

---

## 6. Example End-to-End Run

### User Goal
"Help me create a comprehensive marketing campaign for our new product launch, including a timeline, creative assets, and customer outreach strategy."

### Step 1: Classification
```json
{
  "category": "Marketing & Communications",
  "lead_agent": "Echo",
  "confidence": 0.92,
  "reasoning": "Request centers on marketing campaign creation (Echo's domain). Will require coordination with Muse (creative), Conductor (timeline), and Connector (outreach).",
  "requires_clarification": false
}
```

### Step 2: Task Planning
```json
{
  "task_analysis": "Multi-faceted marketing campaign requiring: (1) Project timeline, (2) Creative assets (video, graphics), (3) Customer outreach strategy, (4) Campaign messaging",
  "required_capabilities": [
    "marketing",
    "project-management",
    "creative-content",
    "customer-engagement",
    "video-generation"
  ],
  "selected_agents": ["Conductor", "Muse", "Connector"],
  "execution_plan": {
    "steps": [
      {
        "agent": "Conductor",
        "task": "Create campaign timeline with milestones and deadlines",
        "dependencies": [],
        "required_integrations": ["taskade", "google-calendar"]
      },
      {
        "agent": "Muse",
        "task": "Generate creative assets: campaign video and social media graphics",
        "dependencies": [],
        "required_integrations": ["invideo"]
      },
      {
        "agent": "Connector",
        "task": "Develop customer outreach strategy with segmentation and messaging",
        "dependencies": [],
        "required_integrations": ["intercom", "taskade"]
      }
    ]
  },
  "estimated_time": "5-7 minutes"
}
```

### Step 3: Integration Check
```json
{
  "all_required_available": false,
  "missing_integrations": [
    {
      "integration_id": "google-calendar",
      "integration_name": "Google Calendar",
      "required_by_agent": "Conductor",
      "priority": "medium",
      "alternatives": ["taskade-calendar"],
      "user_prompt": "To sync your campaign timeline with Google Calendar, I need access. Would you like to connect it now, or should I proceed using Taskade's built-in calendar?"
    }
  ],
  "can_proceed_partially": true,
  "partial_execution_plan": {
    "note": "Timeline will be created in Taskade only, without Google Calendar sync"
  }
}
```

### User Response
"Proceed with Taskade calendar for now."

### Step 4: Execution (Parallel)

**Conductor Result:**
```json
{
  "status": "success",
  "output": {
    "timeline_url": "https://taskade.com/projects/campaign-timeline-xyz",
    "milestones": [
      { "name": "Campaign Kickoff", "date": "2025-11-01", "status": "pending" },
      { "name": "Creative Assets Complete", "date": "2025-11-15", "status": "pending" },
      { "name": "Outreach Launch", "date": "2025-11-22", "status": "pending" },
      { "name": "Product Launch", "date": "2025-12-01", "status": "pending" }
    ],
    "total_tasks": 32,
    "phases": ["Planning", "Creative", "Outreach", "Launch"]
  },
  "metadata": {
    "execution_time_ms": 3200,
    "integrations_used": ["taskade"],
    "confidence": 0.95
  },
  "errors": []
}
```

**Muse Result:**
```json
{
  "status": "success",
  "output": {
    "video_url": "https://invideo.io/projects/campaign-video-abc",
    "video_duration": "60s",
    "graphics": [
      { "type": "Instagram Post", "url": "https://...", "dimensions": "1080x1080" },
      { "type": "Facebook Ad", "url": "https://...", "dimensions": "1200x628" },
      { "type": "LinkedIn Banner", "url": "https://...", "dimensions": "1584x396" }
    ],
    "brand_consistency": "All assets use brand colors (#FFC96C, #1A1A1A) and typography"
  },
  "metadata": {
    "execution_time_ms": 12000,
    "integrations_used": ["invideo"],
    "confidence": 0.88
  },
  "errors": []
}
```

**Connector Result:**
```json
{
  "status": "success",
  "output": {
    "strategy_document_url": "https://notion.so/outreach-strategy-def",
    "customer_segments": [
      { "name": "Early Adopters", "size": "~500", "channel": "Email + LinkedIn" },
      { "name": "Enterprise Clients", "size": "~200", "channel": "Direct Outreach" },
      { "name": "SMB Market", "size": "~2000", "channel": "Social Media + Email" }
    ],
    "messaging_framework": {
      "value_proposition": "...",
      "key_benefits": ["...", "...", "..."],
      "call_to_action": "..."
    },
    "outreach_sequence": [
      { "day": 1, "channel": "email", "subject": "..." },
      { "day": 3, "channel": "linkedin", "message": "..." },
      { "day": 7, "channel": "follow-up", "subject": "..." }
    ]
  },
  "metadata": {
    "execution_time_ms": 4500,
    "integrations_used": ["intercom", "taskade"],
    "confidence": 0.91
  },
  "errors": []
}
```

### Step 5: Aggregation & Validation
```json
{
  "aggregated_output": {
    "campaign_components": {
      "timeline": "Taskade project with 32 tasks across 4 phases",
      "creative_assets": "1 video (60s) + 3 social media graphics",
      "outreach_strategy": "3 customer segments with multi-channel sequence"
    },
    "integration_points": [
      "Timeline milestones align with creative delivery dates",
      "Outreach sequence begins after creative assets complete",
      "All components ready 1 week before product launch"
    ]
  },
  "validation_status": "valid",
  "conflicts": [],
  "confidence": 0.91
}
```

### Step 6: Lead Report (Echo)
```json
{
  "summary": "Created comprehensive marketing campaign for product launch with timeline, creative assets, and customer outreach strategy. Campaign spans 4 weeks with 3 customer segments and multi-channel approach.",
  
  "key_findings": [
    "Campaign timeline: 4 weeks from kickoff to launch (Nov 1 - Dec 1)",
    "Creative assets: 1 campaign video (60s) + 3 platform-specific graphics",
    "Target audience: 2,700 potential customers across 3 segments",
    "Outreach channels: Email, LinkedIn, Social Media with 7-day sequence"
  ],
  
  "actions_taken": [
    {
      "agent": "Conductor",
      "action": "Created campaign timeline in Taskade",
      "result": "32 tasks organized across 4 phases with milestone tracking"
    },
    {
      "agent": "Muse",
      "action": "Generated creative assets using InVideo",
      "result": "1 campaign video + 3 social media graphics (brand-consistent)"
    },
    {
      "agent": "Connector",
      "action": "Developed customer outreach strategy",
      "result": "3-segment approach with messaging framework and outreach sequence"
    }
  ],
  
  "recommendations": [
    "Schedule creative review meeting by Nov 10 to ensure assets align with brand guidelines",
    "Set up A/B testing for email subject lines to optimize open rates",
    "Prepare customer support team for increased inquiries during outreach phase",
    "Consider adding retargeting ads for users who engage but don't convert"
  ],
  
  "next_steps": [
    "Review and approve creative assets (video + graphics)",
    "Assign task owners in Taskade timeline",
    "Upload customer segments to Intercom for outreach automation",
    "Schedule campaign kickoff meeting with stakeholders",
    "Set up analytics tracking for campaign performance"
  ],
  
  "artifacts": [
    {
      "name": "Campaign Timeline",
      "type": "taskade_project",
      "url": "https://taskade.com/projects/campaign-timeline-xyz"
    },
    {
      "name": "Campaign Video",
      "type": "video",
      "url": "https://invideo.io/projects/campaign-video-abc"
    },
    {
      "name": "Social Media Graphics",
      "type": "image_set",
      "url": "https://drive.google.com/folder/graphics-xyz"
    },
    {
      "name": "Outreach Strategy Document",
      "type": "notion_page",
      "url": "https://notion.so/outreach-strategy-def"
    }
  ],
  
  "metadata": {
    "agents_involved": ["Echo", "Conductor", "Muse", "Connector"],
    "total_execution_time_ms": 19700,
    "integrations_used": ["taskade", "invideo", "intercom"]
  }
}
```

---

## 7. Starter Artifacts

### categories.json
```json
{
  "categories": [
    {
      "id": "strategy_leadership",
      "name": "Strategy & Leadership",
      "lead_agent": "Chief of Staff",
      "description": "Strategic planning, executive decisions, organizational goals",
      "keywords": ["strategic", "plan", "vision", "goal", "leadership", "executive", "decision"]
    },
    {
      "id": "operations_pm",
      "name": "Operations & Project Management",
      "lead_agent": "Conductor",
      "description": "Project coordination, task management, workflow optimization",
      "keywords": ["project", "task", "timeline", "coordinate", "manage", "workflow"]
    },
    {
      "id": "research_intelligence",
      "name": "Research & Intelligence",
      "lead_agent": "Scout",
      "description": "Market research, competitive analysis, data insights",
      "keywords": ["research", "analyze", "market", "trends", "competitive", "data"]
    },
    {
      "id": "technical_dev",
      "name": "Technical Development",
      "lead_agent": "Builder",
      "description": "Software development, architecture, technical implementation",
      "keywords": ["code", "develop", "build", "deploy", "technical", "architecture"]
    },
    {
      "id": "creative_design",
      "name": "Creative & Design",
      "lead_agent": "Muse",
      "description": "Visual design, branding, creative content creation",
      "keywords": ["design", "creative", "brand", "visual", "video", "image"]
    },
    {
      "id": "marketing_comms",
      "name": "Marketing & Communications",
      "lead_agent": "Echo",
      "description": "Marketing campaigns, messaging, brand communications",
      "keywords": ["marketing", "campaign", "communication", "message", "promote"]
    },
    {
      "id": "customer_relations",
      "name": "Customer Relations",
      "lead_agent": "Connector",
      "description": "Customer engagement, support, relationship management",
      "keywords": ["customer", "support", "engagement", "relationship", "client"]
    },
    {
      "id": "knowledge_mgmt",
      "name": "Knowledge Management",
      "lead_agent": "Archivist",
      "description": "Documentation, organization, knowledge archival",
      "keywords": ["document", "organize", "knowledge", "archive", "summarize"]
    },
    {
      "id": "financial_ops",
      "name": "Financial Operations",
      "lead_agent": "Ledger",
      "description": "Financial analysis, budgeting, forecasting",
      "keywords": ["financial", "budget", "forecast", "revenue", "expense", "payment"]
    },
    {
      "id": "legal_compliance",
      "name": "Legal & Compliance",
      "lead_agent": "Counselor",
      "description": "Legal guidance, compliance, risk management",
      "keywords": ["legal", "compliance", "contract", "regulation", "risk"]
    },
    {
      "id": "security_protection",
      "name": "Security & Data Protection",
      "lead_agent": "Sentinel",
      "description": "Cybersecurity, data protection, threat detection",
      "keywords": ["security", "protect", "threat", "vulnerability", "privacy"]
    },
    {
      "id": "performance_analytics",
      "name": "Performance & Analytics",
      "lead_agent": "Optimizer",
      "description": "Performance monitoring, analytics, optimization",
      "keywords": ["analytics", "performance", "metrics", "optimize", "efficiency"]
    }
  ]
}
```

### agents.json
```json
{
  "agents": [
    {
      "id": "orchestrator",
      "name": "Orchestrator",
      "type": "coordinator",
      "capabilities": ["routing", "coordination", "multi-agent-orchestration"],
      "integrations": ["all"],
      "can_delegate_to": ["all"],
      "system_prompt_file": "prompts/Orchestrator.md"
    },
    {
      "id": "commander",
      "name": "Chief of Staff",
      "type": "lead",
      "category": "Strategy & Leadership",
      "capabilities": ["strategic-planning", "decision-making", "goal-setting"],
      "integrations": ["notion", "taskade", "google-docs"],
      "can_delegate_to": ["Conductor", "Scout", "Ledger", "Optimizer"],
      "system_prompt_file": "prompts/Chief of Staff.md"
    },
    {
      "id": "conductor",
      "name": "Conductor",
      "type": "lead",
      "category": "Operations & Project Management",
      "capabilities": ["project-management", "task-coordination", "workflow-optimization"],
      "integrations": ["taskade", "notion", "make", "google-calendar"],
      "can_delegate_to": ["Builder", "Muse", "Echo", "Connector"],
      "system_prompt_file": "prompts/Conductor.md"
    },
    {
      "id": "scout",
      "name": "Scout",
      "type": "lead",
      "category": "Research & Intelligence",
      "capabilities": ["research", "market-analysis", "competitive-intelligence"],
      "integrations": ["explorium", "pophive", "hugging-face"],
      "can_delegate_to": ["Archivist", "Optimizer"],
      "system_prompt_file": "prompts/Scout.md"
    },
    {
      "id": "builder",
      "name": "Builder",
      "type": "specialist",
      "category": "Technical Development",
      "capabilities": ["coding", "technical-architecture", "development"],
      "integrations": ["github", "vercel", "cloudflare", "supabase"],
      "can_delegate_to": ["Sentinel", "Optimizer"],
      "system_prompt_file": "prompts/Builder.md"
    },
    {
      "id": "muse",
      "name": "Muse",
      "type": "specialist",
      "category": "Creative & Design",
      "capabilities": ["design", "branding", "creative-content"],
      "integrations": ["invideo", "image-generation"],
      "can_delegate_to": ["Echo", "Archivist"],
      "system_prompt_file": "prompts/Muse.md"
    },
    {
      "id": "echo",
      "name": "Echo",
      "type": "lead",
      "category": "Marketing & Communications",
      "capabilities": ["marketing", "communications", "campaigns"],
      "integrations": ["taskade", "notion", "invideo"],
      "can_delegate_to": ["Muse", "Connector", "Optimizer"],
      "system_prompt_file": "prompts/Echo.md"
    },
    {
      "id": "connector",
      "name": "Connector",
      "type": "specialist",
      "category": "Customer Relations",
      "capabilities": ["customer-relations", "support", "engagement"],
      "integrations": ["intercom", "gmail", "taskade"],
      "can_delegate_to": ["Echo", "Archivist"],
      "system_prompt_file": "prompts/Connector.md"
    },
    {
      "id": "archivist",
      "name": "Archivist",
      "type": "specialist",
      "category": "Knowledge Management",
      "capabilities": ["knowledge-management", "documentation", "organization"],
      "integrations": ["notion", "airtable", "google-docs"],
      "can_delegate_to": [],
      "system_prompt_file": "prompts/Archivist.md"
    },
    {
      "id": "ledger",
      "name": "Ledger",
      "type": "lead",
      "category": "Financial Operations",
      "capabilities": ["financial-analysis", "budgeting", "forecasting"],
      "integrations": ["stripe", "airtable", "supabase"],
      "can_delegate_to": ["Optimizer", "Archivist"],
      "system_prompt_file": "prompts/Ledger.md"
    },
    {
      "id": "counselor",
      "name": "Counselor",
      "type": "lead",
      "category": "Legal & Compliance",
      "capabilities": ["legal", "compliance", "risk-management"],
      "integrations": ["notion", "airtable"],
      "can_delegate_to": ["Archivist", "Sentinel"],
      "system_prompt_file": "prompts/Counselor.md"
    },
    {
      "id": "sentinel",
      "name": "Sentinel",
      "type": "specialist",
      "category": "Security & Data Protection",
      "capabilities": ["security", "data-protection", "threat-detection"],
      "integrations": ["cloudflare", "supabase", "github"],
      "can_delegate_to": [],
      "system_prompt_file": "prompts/Sentinel.md"
    },
    {
      "id": "optimizer",
      "name": "Optimizer",
      "type": "specialist",
      "category": "Performance & Analytics",
      "capabilities": ["analytics", "performance-monitoring", "efficiency"],
      "integrations": ["supabase", "airtable", "vercel"],
      "can_delegate_to": ["Archivist"],
      "system_prompt_file": "prompts/Optimizer.md"
    }
  ]
}
```

### integrations.json
(See "Available Integrations" section above)

### Orchestration Pseudocode (TypeScript Skeleton)

```typescript
// orchestrator.ts - Main orchestration logic

import { classifyRequest, planTask, checkIntegrations, executePlan, aggregateAndValidate, produceLeadReport } from './api';
import { BUSINESS_CATEGORIES, LEADS, AGENT_CAPABILITIES, INTEGRATIONS_LIST } from './config';

interface UserRequest {
  request_id: string;
  user_id: string;
  message: string;
  context: {
    session_id: string;
    user_integrations: string[];
  };
}

async function handleUserRequest(request: UserRequest): Promise<LeadReport> {
  // Step 1: Classify request and route to lead
  const routing = await classifyRequest({
    request_id: request.request_id,
    user_id: request.user_id,
    message: request.message,
    context: request.context
  });
  
  if (routing.requires_clarification) {
    return await askClarification(routing.clarification_question);
  }
  
  // Step 2: Plan task execution
  const plan = await planTask({
    request_id: request.request_id,
    category: routing.category,
    lead_agent: routing.lead_agent,
    user_message: request.message,
    user_integrations: request.context.user_integrations
  });
  
  // Step 3: Check integration requirements
  const integrationCheck = await checkIntegrations({
    execution_plan: plan,
    user_integrations: request.context.user_integrations
  });
  
  if (!integrationCheck.all_required_available) {
    const userResponse = await promptForIntegrations(integrationCheck.missing_integrations);
    
    if (userResponse.action === 'add_integrations') {
      // Wait for user to add integrations, then retry
      return await handleUserRequest(request);
    } else if (userResponse.action === 'proceed_partially') {
      // Use partial execution plan
      plan = integrationCheck.partial_execution_plan;
    } else {
      // User declined, abort
      return createAbortReport(request.request_id, routing.lead_agent);
    }
  }
  
  // Step 4: Execute plan with selected agents
  const executionResults = await executePlan({
    request_id: request.request_id,
    execution_plan: plan,
    user_integrations: request.context.user_integrations
  });
  
  // Step 5: Aggregate and validate results
  const aggregated = await aggregateAndValidate({
    request_id: request.request_id,
    lead_agent: routing.lead_agent,
    agent_results: executionResults.results
  });
  
  // Step 6: Produce final lead report
  const report = await produceLeadReport({
    request_id: request.request_id,
    lead_agent: routing.lead_agent,
    aggregated_results: aggregated,
    original_request: request.message
  });
  
  return report;
}

// Helper functions
async function askClarification(question: string): Promise<LeadReport> {
  // Prompt user for clarification
  // Return clarification request as a special report type
}

async function promptForIntegrations(missing: MissingIntegration[]): Promise<UserResponse> {
  // Show user-friendly prompt for missing integrations
  // Return user's decision (add, proceed_partially, or abort)
}

function createAbortReport(requestId: string, leadAgent: string): LeadReport {
  // Create a report indicating task was aborted due to missing integrations
}

export { handleUserRequest };
```

---

## Validation Gates

### Integration Sufficiency
- [ ] All required integrations identified correctly
- [ ] Missing integrations detected and reported
- [ ] Alternatives suggested when available
- [ ] User prompted only for critical missing integrations
- [ ] Partial execution plan viable when integrations missing

### Plan Minimality
- [ ] Selected agents cover all required capabilities
- [ ] No redundant agents selected
- [ ] Delegation follows can_delegate_to rules
- [ ] Execution order respects dependencies
- [ ] Estimated time realistic

### Error Paths
- [ ] Classification ambiguity handled (clarification requested)
- [ ] Integration failures handled gracefully
- [ ] Agent execution failures don't crash system
- [ ] Timeout handling in place
- [ ] Conflict resolution logic works

### User-Facing Report Clarity
- [ ] Summary is concise and actionable
- [ ] Key findings are specific and relevant
- [ ] Actions taken are clearly described
- [ ] Recommendations are practical
- [ ] Next steps are clear and prioritized
- [ ] Artifacts are accessible and well-labeled
- [ ] Metadata provides transparency without overwhelming

---

## Implementation Checklist

- [ ] Implement `classify_request` function
- [ ] Implement `plan_task` function
- [ ] Implement `check_integrations` function
- [ ] Implement `execute_plan` function
- [ ] Implement `aggregate_and_validate` function
- [ ] Implement `produce_lead_report` function
- [ ] Create system prompts for all agents
- [ ] Set up integration catalog and status tracking
- [ ] Implement error handling and logging
- [ ] Add user prompts for missing integrations
- [ ] Test end-to-end flows with real integrations
- [ ] Optimize for performance (parallel execution)
- [ ] Add monitoring and analytics
- [ ] Document API contracts
- [ ] Create user-facing documentation

---

## Next Steps for DHStx

1. **Review and Approve Specification**: Ensure this aligns with your vision
2. **Prioritize Implementation**: Start with core orchestration (Orchestrator + 3-4 leads)
3. **Integration Setup**: Ensure all MCP integrations are properly configured
4. **Prompt Engineering**: Refine system prompts for each agent
5. **Build MVP**: Implement basic orchestration with 1-2 example workflows
6. **Test with Real Users**: Gather feedback and iterate
7. **Scale Up**: Add remaining agents and advanced features
8. **Monitor & Optimize**: Track performance, costs, and user satisfaction

---

**This specification provides a complete blueprint for your multi-agent orchestration system. Ready to implement!**

