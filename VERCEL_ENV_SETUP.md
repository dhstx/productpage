# Vercel Environment Variables Setup

**IMPORTANT**: You need to configure these environment variables in Vercel for the agents to work.

## How to Add Environment Variables

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select the `productpage` project
3. Go to **Settings** → **Environment Variables**
4. Add each variable below

## Required Environment Variables

### AI API Keys

```
ANTHROPIC_API_KEY=sk-ant-api03-...
```
(Your Anthropic Claude API key)

```
OPENAI_API_KEY=sk-...
```
(Your OpenAI API key)

```
OPENAI_API_BASE=https://api.openai.com/v1
```
(OpenAI API base URL)

### Database

```
SUPABASE_URL=https://your-project.supabase.co
```
(Your Supabase project URL)

```
SUPABASE_KEY=eyJ...
```
(Your Supabase anon/public key)

### Security (Optional but Recommended)

```
JWT_SECRET=your-random-secret-here
```
(Generate with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`)

```
NODE_ENV=production
```

## After Adding Variables

1. **Redeploy**: Vercel will automatically redeploy after you add environment variables
2. **Wait 2-3 minutes** for the deployment to complete
3. **Test**: Visit your site and try chatting with an agent

## Testing

Once deployed with environment variables:

1. Go to your site (dhstx.co or the Vercel preview URL)
2. Click "Select Agent" and choose any agent
3. Type a message and send
4. You should get a response from the AI agent!

## Troubleshooting

**If agents don't respond:**
- Check that all environment variables are set correctly in Vercel
- Check the Vercel function logs for errors
- Make sure the deployment succeeded

**If you see "Authentication required":**
- This is expected for now (auth is optional)
- The agents should still work without authentication

## Current Status

✅ Frontend deployed with 13 agents  
✅ Backend API deployed as serverless functions  
⏳ **Environment variables need to be configured** (you need to do this in Vercel dashboard)  
⏳ Agents will work once environment variables are set

