# DHStx AI Agent System - Production Deployment Guide

**Version**: 1.0.0  
**Date**: October 21, 2025  
**Status**: Ready for Production

---

## 📋 Pre-Deployment Checklist

### ✅ Phase 1-4 Complete
- [x] Backend API with 13 AI agents
- [x] Frontend UI with agent selector
- [x] API integration and messaging
- [x] Conversation history and session management
- [x] Rate limiting and security fixes
- [x] All tests passing (100%)

### ✅ Code Quality
- [x] All features implemented
- [x] Code committed to GitHub
- [x] PR created (#123)
- [x] Security alerts reviewed (13 alerts - non-critical)
- [x] Dependencies installed

### ⚠️ Pending Actions
- [ ] Merge PR to main branch
- [ ] Configure production environment variables
- [ ] Run Supabase migrations
- [ ] Deploy to Vercel
- [ ] Test production deployment

---

## 🚀 Deployment Steps

### Step 1: Merge to Main Branch

```bash
# Review and merge PR #123
gh pr review 123
gh pr merge 123 --squash
```

Or via GitHub UI:
1. Go to https://github.com/dhstx/productpage/pull/123
2. Review changes
3. Click "Squash and merge"
4. Confirm merge

### Step 2: Configure Production Environment

**Vercel Environment Variables** (via Vercel Dashboard):

```bash
# Frontend (.env)
VITE_API_URL=https://your-api-domain.com

# Backend (Vercel Functions or separate API server)
ANTHROPIC_API_KEY=<your-key>
OPENAI_API_KEY=<your-key>
OPENAI_API_BASE=<your-base-url>
SUPABASE_URL=<your-supabase-url>
SUPABASE_KEY=<your-supabase-key>
JWT_SECRET=<generate-secure-secret>
NODE_ENV=production
```

**Generate JWT Secret**:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Step 3: Run Supabase Migrations

```bash
# Option A: Via Supabase Dashboard SQL Editor
# 1. Go to https://app.supabase.com
# 2. Select your project
# 3. Go to SQL Editor
# 4. Copy and paste contents of supabase-agent-schema.sql
# 5. Click "Run"

# Option B: Via Supabase CLI
supabase db push
```

### Step 4: Deploy to Vercel

```bash
# Via Vercel CLI
vercel --prod

# Or via GitHub (automatic)
# Vercel will auto-deploy when PR is merged to main
```

### Step 5: Verify Deployment

**API Health Check**:
```bash
curl https://your-api-domain.com/health
# Expected: {"status":"ok"}
```

**Frontend Check**:
```bash
curl https://dhstx.co
# Expected: 200 OK
```

**Agent Test**:
```bash
# Via browser: https://dhstx.co
# 1. Select an agent
# 2. Send a test message
# 3. Verify response
```

---

## 🔧 Configuration Files

### Frontend (.env)
```bash
VITE_API_URL=https://api.dhstx.co
```

### Backend (.env.backend or Vercel Environment Variables)
```bash
# AI APIs
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
OPENAI_API_BASE=https://api.openai.com/v1

# Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=eyJ...

# Security
JWT_SECRET=your-64-char-hex-secret
NODE_ENV=production

# Optional
PORT=3001
```

---

## 📊 Post-Deployment Monitoring

### Metrics to Monitor

1. **API Response Times**
   - Target: < 5 seconds
   - Alert if: > 10 seconds

2. **Error Rates**
   - Target: < 1%
   - Alert if: > 5%

3. **Cost per Request**
   - Target: $0.001 (0.1 cent)
   - Alert if: > $0.01

4. **Rate Limit Hits**
   - Monitor: requests/15min
   - Alert if: > 80 hits/15min

### Monitoring Tools

- **Vercel Analytics**: Automatic
- **Supabase Dashboard**: Database metrics
- **API Logs**: Check Vercel Functions logs

---

## 🔒 Security Considerations

### Implemented
✅ Rate limiting (100 req/15min)  
✅ JWT authentication  
✅ Environment variable encryption  
✅ HTTPS only  
✅ Input validation  

### Recommended
⚠️ Add CSRF protection  
⚠️ Implement request signing  
⚠️ Add API key rotation  
⚠️ Set up monitoring alerts  
⚠️ Enable WAF (Web Application Firewall)  

---

## 💰 Cost Estimates

### Monthly Costs (10,000 requests)

| Service | Cost |
|---------|------|
| Anthropic Claude | $7 |
| OpenAI GPT-4 | $0 (optional) |
| Supabase | $25 |
| Vercel | $20 |
| **Total** | **~$52/month** |

### Cost Optimization

- Use Claude Haiku for 90% of requests
- Cache frequent queries
- Implement request deduplication
- Monitor and optimize token usage

---

## 🐛 Troubleshooting

### Issue: API returns 500 error
**Solution**: Check environment variables are set correctly

### Issue: "Authentication required" error
**Solution**: Verify JWT_SECRET is configured and user is logged in

### Issue: Slow response times
**Solution**: Check Anthropic/OpenAI API status, consider caching

### Issue: Rate limit exceeded
**Solution**: Increase rate limit or implement user-based limits

### Issue: Database connection failed
**Solution**: Verify SUPABASE_URL and SUPABASE_KEY are correct

---

## 📞 Support

- **GitHub Issues**: https://github.com/dhstx/productpage/issues
- **Documentation**: See AGENT_DEPLOYMENT_GUIDE.md
- **API Docs**: See enhanced_agent_specifications.md

---

## 🎯 Success Criteria

Deployment is successful when:

✅ All API endpoints return 200 OK  
✅ Agents respond within 5 seconds  
✅ Conversation history loads correctly  
✅ No critical errors in logs  
✅ Cost per request < $0.01  
✅ User can complete full conversation flow  

---

## 📝 Rollback Plan

If deployment fails:

1. **Revert Vercel Deployment**
   ```bash
   vercel rollback
   ```

2. **Revert Git Commit**
   ```bash
   git revert HEAD
   git push origin main
   ```

3. **Restore Database** (if needed)
   - Use Supabase backup
   - Restore from previous snapshot

---

## 🔄 Next Steps After Deployment

1. Monitor for 24 hours
2. Collect user feedback
3. Address any issues
4. Plan Phase 6 features:
   - Streaming responses
   - Multi-agent workflows
   - Analytics dashboard
   - Export conversations

---

**Deployment Owner**: DHStx Team  
**Last Updated**: October 21, 2025  
**Version**: 1.0.0
