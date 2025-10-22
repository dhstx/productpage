import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config({ path: '/home/ubuntu/productpage/.env.backend' });

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const modelsToTry = [
  'claude-3-5-sonnet-20241022',
  'claude-3-5-sonnet-20240620',
  'claude-3-5-sonnet-latest',
  'claude-3-sonnet-20240229',
  'claude-3-opus-20240229',
  'claude-3-haiku-20240307'
];

console.log('Testing Claude models...\n');

for (const model of modelsToTry) {
  try {
    console.log(`Testing: ${model}...`);
    const response = await anthropic.messages.create({
      model: model,
      max_tokens: 50,
      messages: [{ role: 'user', content: 'Say "test successful"' }]
    });
    console.log(`✅ ${model} - WORKS!`);
    console.log(`   Response: ${response.content[0].text}\n`);
    break; // Stop after first working model
  } catch (error) {
    console.log(`❌ ${model} - ${error.message}\n`);
  }
}

