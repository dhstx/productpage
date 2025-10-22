/**
 * Adaptive PT Cost Calculator
 * Calculates PT costs dynamically based on model pricing, usage context, and safety buffers
 */

// PT Cost Classes (baseline)
export const PT_COST_CLASSES = {
  core: {
    short: { maxTokens: 1500, maxWords: 250, ptCost: 1, baselineCost: 0.001 },
    medium: { maxTokens: 4200, maxWords: 700, ptCost: 3, baselineCost: 0.003 },
    long: { maxTokens: 7800, maxWords: 1300, ptCost: 6, baselineCost: 0.0063 }
  },
  advanced: {
    short: { maxTokens: 1500, maxWords: 250, ptCost: 3, baselineCost: 0.025 },
    medium: { maxTokens: 4200, maxWords: 700, ptCost: 7, baselineCost: 0.100 },
    long: { maxTokens: 7800, maxWords: 1300, ptCost: 14, baselineCost: 0.300 }
  }
};

// Model pricing (will be fetched from database in production)
let MODEL_PRICING_CACHE = {
  'claude-3-haiku-20240307': {
    class: 'core',
    inputCostPer1M: 0.25,
    outputCostPer1M: 1.25,
    lastUpdated: new Date()
  },
  'gpt-4o-mini': {
    class: 'core',
    inputCostPer1M: 0.15,
    outputCostPer1M: 0.60,
    lastUpdated: new Date()
  },
  'gpt-4o': {
    class: 'advanced',
    inputCostPer1M: 5.00,
    outputCostPer1M: 15.00,
    lastUpdated: new Date()
  },
  'claude-3-5-sonnet-20241022': {
    class: 'advanced',
    inputCostPer1M: 3.00,
    outputCostPer1M: 15.00,
    lastUpdated: new Date()
  }
};

/**
 * Calculate adaptive buffer based on usage context
 */
export function calculateAdaptiveBuffer(context) {
  const {
    agentType = 'simple',
    contentType = 'text',
    integrations = 0,
    retryHistory = 0.05
  } = context;
  
  let buffer = 0;
  
  // Prompt bloat (15-25%)
  const promptBloat = {
    simple: 0.15,
    moderate: 0.20,
    complex: 0.25
  }[agentType] || 0.20;
  buffer += promptBloat;
  
  // Retry rate (5-15%)
  const retryRate = Math.min(0.15, Math.max(0.05, retryHistory));
  buffer += retryRate;
  
  // Moderation (3-8%)
  const moderationCost = {
    text: 0.03,
    code: 0.05,
    mixed: 0.08
  }[contentType] || 0.05;
  buffer += moderationCost;
  
  // Tool calls (5-10%)
  const toolCallCost = Math.min(0.10, integrations * 0.02);
  buffer += toolCallCost;
  
  // Variance buffer (5-10%)
  const varianceBuffer = 0.07;
  buffer += varianceBuffer;
  
  return buffer;
}

/**
 * Get latest model pricing from database or cache
 */
export async function getModelPricing(modelName, supabase) {
  // Check cache first
  if (MODEL_PRICING_CACHE[modelName]) {
    const cached = MODEL_PRICING_CACHE[modelName];
    const cacheAge = Date.now() - cached.lastUpdated.getTime();
    
    // Cache valid for 1 hour
    if (cacheAge < 3600000) {
      return cached;
    }
  }
  
  // Fetch from database
  if (supabase) {
    const { data, error } = await supabase
      .from('model_pricing')
      .select('*')
      .eq('model_name', modelName)
      .is('effective_to', null)
      .single();
    
    if (data && !error) {
      const pricing = {
        class: data.model_class,
        inputCostPer1M: parseFloat(data.input_cost_per_1m),
        outputCostPer1M: parseFloat(data.output_cost_per_1m),
        lastUpdated: new Date()
      };
      
      // Update cache
      MODEL_PRICING_CACHE[modelName] = pricing;
      return pricing;
    }
  }
  
  // Fallback to cache or default
  return MODEL_PRICING_CACHE[modelName] || {
    class: 'core',
    inputCostPer1M: 0.25,
    outputCostPer1M: 1.25,
    lastUpdated: new Date()
  };
}

/**
 * Calculate actual cost based on tokens and model
 */
export function calculateActualCost(inputTokens, outputTokens, modelPricing) {
  const inputCost = (inputTokens / 1000000) * modelPricing.inputCostPer1M;
  const outputCost = (outputTokens / 1000000) * modelPricing.outputCostPer1M;
  return inputCost + outputCost;
}

/**
 * Map cost to PT based on response length
 */
export function mapCostToPT(totalCost, modelClass, totalTokens) {
  const classes = PT_COST_CLASSES[modelClass];
  
  if (!classes) {
    throw new Error(`Invalid model class: ${modelClass}`);
  }
  
  // Determine response length category
  if (totalTokens <= classes.short.maxTokens) {
    return classes.short.ptCost;
  } else if (totalTokens <= classes.medium.maxTokens) {
    return classes.medium.ptCost;
  } else if (totalTokens <= classes.long.maxTokens) {
    return classes.long.ptCost;
  } else {
    // Over long threshold - charge proportionally
    const longPT = classes.long.ptCost;
    const longTokens = classes.long.maxTokens;
    return Math.ceil((totalTokens / longTokens) * longPT);
  }
}

/**
 * Main PT cost calculation function
 */
export async function calculatePTCost(params) {
  const {
    inputTokens,
    outputTokens,
    model,
    usageContext = {},
    supabase = null
  } = params;
  
  const totalTokens = inputTokens + outputTokens;
  
  // Get model pricing
  const modelPricing = await getModelPricing(model, supabase);
  const modelClass = modelPricing.class;
  
  // Calculate base cost
  const baseCost = calculateActualCost(inputTokens, outputTokens, modelPricing);
  
  // Calculate adaptive buffer
  const buffer = calculateAdaptiveBuffer(usageContext);
  
  // Apply buffer
  const totalCost = baseCost * (1 + buffer);
  
  // Map to PT
  const ptCost = mapCostToPT(totalCost, modelClass, totalTokens);
  
  return {
    ptCost,
    ptType: modelClass,
    baseCost,
    buffer,
    totalCost,
    inputTokens,
    outputTokens,
    totalTokens,
    model,
    modelClass
  };
}

/**
 * Estimate PT cost before making request
 */
export function estimatePTCost(message, model = 'claude-3-haiku-20240307', responseLength = 'medium') {
  // Rough estimation: 4 chars per token
  const estimatedInputTokens = Math.ceil(message.length / 4) + 500; // +500 for system prompt
  
  // Estimate output tokens based on length
  const outputTokenEstimates = {
    short: 400,
    medium: 1000,
    long: 2000
  };
  const estimatedOutputTokens = outputTokenEstimates[responseLength] || 1000;
  
  const totalTokens = estimatedInputTokens + estimatedOutputTokens;
  
  // Get model class
  const modelPricing = MODEL_PRICING_CACHE[model] || MODEL_PRICING_CACHE['claude-3-haiku-20240307'];
  const modelClass = modelPricing.class;
  
  // Map to PT
  const ptCost = mapCostToPT(0, modelClass, totalTokens); // Cost doesn't matter for estimation
  
  return {
    ptCost,
    ptType: modelClass,
    estimatedInputTokens,
    estimatedOutputTokens,
    totalTokens,
    confidence: 'medium',
    breakdown: {
      input: estimatedInputTokens,
      output: estimatedOutputTokens,
      model,
      modelClass
    }
  };
}

/**
 * Calculate PT cost per tier (for pricing validation)
 */
export function calculateTierCost(tier, usageScenario = 'average') {
  const usageRates = {
    light: 0.30,
    average: 0.60,
    power: 0.95
  };
  
  const rate = usageRates[usageScenario] || 0.60;
  
  // This would fetch from subscription_tiers table in production
  const tierConfigs = {
    freemium: { corePT: 100, advancedPT: 0, price: 0 },
    entry: { corePT: 300, advancedPT: 0, price: 19 },
    pro: { corePT: 700, advancedPT: 50, price: 49 },
    pro_plus: { corePT: 1600, advancedPT: 100, price: 79 },
    business: { corePT: 3500, advancedPT: 200, price: 159 }
  };
  
  const config = tierConfigs[tier];
  if (!config) {
    throw new Error(`Invalid tier: ${tier}`);
  }
  
  const corePTUsed = Math.floor(config.corePT * rate);
  const advancedPTUsed = 0; // Advanced is metered separately
  
  // Calculate cost
  const coreCost = corePTUsed * PT_COST_CLASSES.core.short.baselineCost;
  const advancedCost = advancedPTUsed * PT_COST_CLASSES.advanced.short.baselineCost;
  
  const totalCost = coreCost + advancedCost;
  const revenue = config.price;
  const grossMargin = revenue > 0 ? ((revenue - totalCost) / revenue) * 100 : 0;
  
  return {
    tier,
    usageScenario,
    corePTUsed,
    advancedPTUsed,
    coreCost,
    advancedCost,
    totalCost,
    revenue,
    grossMargin: Math.round(grossMargin * 100) / 100
  };
}

/**
 * Update model pricing cache (called when prices change)
 */
export function updateModelPricingCache(modelName, pricing) {
  MODEL_PRICING_CACHE[modelName] = {
    ...pricing,
    lastUpdated: new Date()
  };
}

/**
 * Get all cached model pricing
 */
export function getModelPricingCache() {
  return MODEL_PRICING_CACHE;
}

