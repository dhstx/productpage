import { createClient } from '@supabase/supabase-js';
import { calculatePTCost } from '../services/ptCostCalculator.js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, agent, model } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Estimate token count (rough approximation: 1 token ≈ 4 characters)
    const estimatedInputTokens = Math.ceil(message.length / 4);
    
    // Assume average response length (can be adjusted based on agent)
    const estimatedOutputTokens = 1000; // Default assumption
    
    const totalEstimatedTokens = estimatedInputTokens + estimatedOutputTokens;

    // Get model pricing
    const modelToUse = model || 'claude-3-haiku-20240307';
    const { data: modelPricing } = await supabase
      .from('model_pricing')
      .select('*')
      .eq('model_name', modelToUse)
      .single();

    if (!modelPricing) {
      return res.status(400).json({ error: 'Model pricing not found' });
    }

    // Calculate PT cost
    const ptCost = await calculatePTCost({
      model: modelToUse,
      inputTokens: estimatedInputTokens,
      outputTokens: estimatedOutputTokens,
      modelPricing
    });

    return res.status(200).json({
      estimated_pt: ptCost.totalPT,
      estimated_tokens: totalEstimatedTokens,
      estimated_input_tokens: estimatedInputTokens,
      estimated_output_tokens: estimatedOutputTokens,
      model: modelToUse,
      model_type: modelPricing.model_type,
      breakdown: ptCost.breakdown
    });

  } catch (error) {
    console.error('PT estimation error:', error);
    return res.status(500).json({ 
      error: 'Failed to estimate PT cost',
      message: error.message 
    });
  }
}

