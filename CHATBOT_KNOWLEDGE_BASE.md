# InboxPass AI Chatbot Knowledge Base

## Product Overview

**InboxPass** is an email compliance tool that helps businesses fix email deliverability issues by scanning domains for SPF, DKIM, DMARC, and BIMI configuration, then generating copy-paste DNS records to ensure compliance with Gmail and Microsoft's 2025 sender requirements.

**Price:** $29 one-time payment (no subscription)

**Website:** https://inboxpass.org

---

## Core Value Proposition

### The Problem
- Gmail and Microsoft enforced new email authentication requirements in 2024-2025
- Emails without proper SPF, DKIM, DMARC configuration go to spam or get blocked
- Non-compliance causes revenue loss, missed opportunities, and damaged sender reputation
- Most businesses don't know how to configure DNS records correctly

### The Solution
InboxPass provides:
1. **Free domain scan** - Instant pass/fail check for SPF, DKIM, DMARC, BIMI
2. **$29 compliance kit** - Complete DNS records, setup instructions, and validation checklist
3. **5-minute fix** - Copy-paste ready records with provider-specific guidance

---

## Product Features

### Free Scan (No Payment Required)
- Real-time DNS lookup for SPF, DKIM, DMARC, BIMI records
- Pass/fail status for each protocol
- Provider detection (Google Workspace, Microsoft 365, SendGrid, Mailgun, etc.)
- Identifies missing or misconfigured records
- Shows compliance status against Gmail/Microsoft requirements

### $29 Compliance Kit (After Payment)
1. **Copy-Paste DNS Records**
   - Exact TXT records for SPF, DMARC
   - DKIM selector recommendations
   - BIMI record (if applicable)
   - No syntax errors, no SPF 10-lookup failures

2. **Provider-Specific Setup Instructions**
   - Step-by-step guides for Google Workspace, Microsoft 365, SendGrid, Mailgun, Mailchimp, etc.
   - Screenshots and DNS configuration examples
   - Common pitfalls and troubleshooting tips

3. **One-Click Unsubscribe Headers**
   - Code snippets for List-Unsubscribe and List-Unsubscribe-Post headers
   - Implementation examples for different email platforms

4. **Simple Validation PDF**
   - Downloadable compliance report
   - Before/after comparison
   - Validation checklist to confirm setup

5. **Spam Rate & Engagement Guide**
   - Best practices to stay under 0.3% spam complaint rate
   - Tips for improving open rates and engagement

---

## Technical Details

### What We Scan
- **SPF (Sender Policy Framework):** Verifies authorized mail servers
- **DKIM (DomainKeys Identified Mail):** Cryptographic email authentication
- **DMARC (Domain-based Message Authentication):** Policy for handling failed authentication
- **BIMI (Brand Indicators for Message Identification):** Logo display in inboxes
- **Email Headers:** List-Unsubscribe and List-Unsubscribe-Post compliance

### DNS Record Types
- TXT records for SPF, DMARC
- CNAME records for DKIM selectors
- TXT records for BIMI (if logo is available)

### Compliance Requirements
**Gmail Requirements (2024+):**
- SPF or DKIM authentication (both recommended)
- DMARC policy (p=none minimum, p=quarantine or p=reject recommended)
- Aligned From: domain
- One-click unsubscribe for bulk senders (5,000+ emails/day)
- Spam complaint rate < 0.3%

**Microsoft Requirements (May 2025+):**
- SPF, DKIM, and DMARC required for high-volume senders
- Enforcement escalates from warnings → spam folder → blocking
- One-click unsubscribe required

---

## Common Questions & Answers

### General Questions

**Q: What is InboxPass?**
A: InboxPass is a $29 one-time tool that scans your domain for email authentication issues (SPF, DKIM, DMARC) and generates copy-paste DNS records to fix deliverability problems. It ensures compliance with Gmail and Microsoft's 2025 sender requirements.

**Q: How much does it cost?**
A: $29 one-time payment. No subscription, no recurring fees. You get instant access to your compliance kit after payment.

**Q: Is there a free trial?**
A: Yes! You can scan your domain for free to see your current compliance status. You only pay $29 if you want the full compliance kit with DNS records and setup instructions.

**Q: What's included in the $29 kit?**
A: Copy-paste DNS records (SPF, DKIM, DMARC), provider-specific setup guides, one-click unsubscribe code snippets, validation checklist, and a downloadable PDF report.

**Q: Do I need technical knowledge?**
A: No! Our instructions are written for non-technical users. If you can log into your DNS provider (like Cloudflare, Namecheap, GoDaddy), you can copy-paste the records we provide.

**Q: How long does setup take?**
A: Most users complete setup in 5-10 minutes. DNS changes can take 15 minutes to 48 hours to propagate globally.

**Q: Will this work for my email provider?**
A: Yes! InboxPass works with all email providers including Google Workspace, Microsoft 365, SendGrid, Mailgun, Mailchimp, Amazon SES, and custom SMTP servers.

### Technical Questions

**Q: What if I already have SPF records?**
A: We'll analyze your existing SPF record and provide an updated version that includes all necessary authorized senders without exceeding the 10-lookup limit.

**Q: How do I know if my DKIM is working?**
A: Our scan checks common DKIM selectors. If we don't find your DKIM record, we'll provide instructions on how to generate and publish it through your email provider.

**Q: What DMARC policy should I use?**
A: Start with `p=none` to monitor without blocking. Once you're confident in your setup, upgrade to `p=quarantine` or `p=reject` for maximum protection.

**Q: Do I need BIMI?**
A: BIMI is optional but recommended for brand recognition. It requires a verified logo and DMARC policy of `p=quarantine` or `p=reject`.

**Q: What if I use multiple email services?**
A: No problem! We'll provide SPF records that include all your email services (e.g., Google Workspace + SendGrid + Mailchimp).

**Q: Can I use this for multiple domains?**
A: Each $29 purchase covers one domain. If you have multiple domains, you'll need to scan and purchase separately for each.

### Compliance & Policy Questions

**Q: Why are my emails going to spam?**
A: Common reasons:
- Missing or misconfigured SPF/DKIM/DMARC records
- High spam complaint rate (>0.3%)
- Poor sender reputation
- Missing unsubscribe headers
- Sudden volume spikes

**Q: When do Gmail/Microsoft requirements apply?**
A: Gmail requirements are active now (2024+). Microsoft enforcement began May 5, 2025. If you send bulk emails (5,000+/day), you must comply immediately.

**Q: What happens if I don't comply?**
A: Your emails will be throttled, sent to spam, or blocked entirely. This results in lost revenue, missed opportunities, and damaged sender reputation.

**Q: Do I need one-click unsubscribe?**
A: Yes, if you send bulk emails (5,000+/day) to Gmail or Microsoft addresses. Our compliance kit includes code snippets for List-Unsubscribe headers.

**Q: How do I reduce spam complaints?**
A: 
- Only email people who opted in
- Make unsubscribe easy and obvious
- Send relevant, valuable content
- Clean your list regularly (remove bounces and inactive subscribers)
- Avoid spam trigger words

### Payment & Refund Questions

**Q: What payment methods do you accept?**
A: We accept all major credit cards, debit cards, and digital wallets through Stripe (Visa, Mastercard, Amex, Discover, Apple Pay, Google Pay).

**Q: Is payment secure?**
A: Yes! All payments are processed through Stripe, a PCI-compliant payment processor. We never see or store your card details.

**Q: What's your refund policy?**
A: 30-day money-back guarantee, no questions asked. If you're not satisfied for any reason, email support@inboxpass.org and we'll refund your $29 in full.

**Q: Do I get a receipt?**
A: Yes! You'll receive an email receipt immediately after payment with your order details and download link.

**Q: Can I pay by invoice?**
A: Currently, we only accept card payments through Stripe. For enterprise/bulk purchases, contact support@inboxpass.org.

### Support Questions

**Q: How do I get help?**
A: Email support@inboxpass.org and we'll respond within 24 hours (usually much faster).

**Q: What if the DNS records don't work?**
A: Email us at support@inboxpass.org with your domain name and we'll troubleshoot for free. If we can't fix it, we'll refund your $29.

**Q: Can you set up DNS for me?**
A: Our compliance kit includes detailed instructions, but we don't offer hands-on setup service. If you need help, email support@inboxpass.org and we'll guide you through it.

**Q: Do you offer consulting?**
A: InboxPass is a self-service tool. For custom consulting, email support@inboxpass.org with your requirements.

---

## Pricing & Guarantees

### Pricing
- **Free Scan:** Unlimited, no credit card required
- **Compliance Kit:** $29 one-time payment
- **No subscription:** Pay once, keep forever

### Money-Back Guarantee
- **30-day refund policy**
- No questions asked
- Full refund if DNS records don't work
- Email support@inboxpass.org to request refund

### What You Get
✅ Copy-paste SPF, DKIM, DMARC records  
✅ Provider-specific setup guides  
✅ One-click unsubscribe code snippets  
✅ Validation checklist  
✅ Downloadable PDF report  
✅ Email support  

---

## Use Cases & Customer Profiles

### Who Uses InboxPass?

1. **SaaS Companies**
   - Transactional emails (password resets, notifications)
   - Marketing campaigns
   - Product updates

2. **E-commerce Stores**
   - Order confirmations
   - Shipping notifications
   - Promotional emails

3. **Marketing Agencies**
   - Client email campaigns
   - Newsletter management
   - Lead nurturing

4. **Freelancers & Consultants**
   - Client communications
   - Invoice reminders
   - Newsletter updates

5. **Non-Profits**
   - Donor communications
   - Event invitations
   - Fundraising campaigns

### Common Scenarios

**Scenario 1: "My emails suddenly started going to spam"**
- Likely cause: Gmail/Microsoft enforcement kicked in
- Solution: Scan domain, fix missing DMARC policy, add unsubscribe headers

**Scenario 2: "I just launched a new domain and want to avoid spam"**
- Solution: Set up SPF, DKIM, DMARC from day one before sending any emails

**Scenario 3: "I'm migrating to a new email provider"**
- Solution: Update SPF records to include new provider, verify DKIM setup

**Scenario 4: "I send emails through multiple services"**
- Solution: Consolidate all services into one SPF record, ensure DKIM for each

---

## Competitor Comparison

### InboxPass vs. Alternatives

**InboxPass ($29 one-time)**
- ✅ One-time payment
- ✅ Copy-paste DNS records
- ✅ Provider-specific guides
- ✅ 5-minute setup
- ✅ No ongoing fees

**MXToolbox (Free + Paid)**
- ❌ Complex interface
- ❌ No setup instructions
- ❌ Requires technical knowledge

**DMARCian ($25/month)**
- ❌ Monthly subscription
- ❌ Expensive for small businesses
- ✅ Advanced monitoring

**Manual Setup (Free)**
- ❌ Time-consuming (hours)
- ❌ High error rate
- ❌ No validation

---

## Objection Handling

### "I can do this myself for free"
**Response:** Absolutely! But most people spend 2-4 hours researching, make syntax errors, and still aren't sure if it's correct. InboxPass gives you tested, copy-paste records in 5 minutes for $29. Your time is worth more than that.

### "Why not use a free tool?"
**Response:** Free tools show you what's wrong but don't tell you how to fix it. InboxPass gives you exact DNS records, setup instructions, and validation—everything you need in one place.

### "I'm not sure if I need this"
**Response:** Try the free scan first! You'll see exactly what's missing. If your emails are landing in inboxes, great. If not, $29 is a small price to fix a problem that's costing you customers.

### "What if it doesn't work?"
**Response:** We have a 30-day money-back guarantee. If the DNS records don't work or you're not satisfied, email us and we'll refund your $29—no questions asked.

### "I don't have time to set this up"
**Response:** Setup takes 5-10 minutes. We provide step-by-step instructions with screenshots. If you can log into your DNS provider, you can do this.

### "I'm not technical enough"
**Response:** Our instructions are written for non-technical users. Thousands of people with zero DNS experience have successfully set this up. If you get stuck, email us and we'll help.

---

## Key Talking Points

### Pain Points to Emphasize
- 📉 Lost revenue from emails in spam
- 😤 Frustration with low open rates
- ⚠️ Risk of sender reputation damage
- ⏰ Time wasted troubleshooting
- 🚫 Fear of being blocked by Gmail/Microsoft

### Benefits to Highlight
- ✅ Fix deliverability in 5 minutes
- 💰 One-time $29 payment (no subscription)
- 📋 Copy-paste DNS records (no guesswork)
- 🎯 Gmail & Microsoft 2025 compliant
- 🛡️ 30-day money-back guarantee

### Social Proof
- 1,247+ domains scanned
- 98% success rate
- 4.9/5 customer rating
- Trusted by SaaS companies, e-commerce stores, and marketing agencies

---

## Tone & Voice Guidelines

### Personality
- **Helpful, not pushy:** Focus on solving problems, not hard-selling
- **Clear, not technical:** Avoid jargon, explain concepts simply
- **Confident, not arrogant:** We know our stuff, but we're approachable
- **Urgent, not alarmist:** Emphasize importance without fear-mongering

### Do's
✅ Use simple language  
✅ Provide specific examples  
✅ Offer actionable next steps  
✅ Acknowledge user concerns  
✅ Be patient with non-technical users  

### Don'ts
❌ Use technical jargon without explanation  
❌ Pressure users to buy immediately  
❌ Dismiss user concerns  
❌ Over-promise results  
❌ Assume technical knowledge  

---

## Call-to-Actions

### Primary CTA
"Scan Your Domain for Free" → Leads to free scan

### Secondary CTA
"Get Your $29 Compliance Kit" → Leads to Stripe checkout

### Support CTA
"Email support@inboxpass.org" → For questions or refunds

---

## Contact Information

**Support Email:** support@inboxpass.org  
**Website:** https://inboxpass.org  
**Response Time:** Within 24 hours (usually faster)  

---

## Quick Reference: Common Commands

### User says: "How does this work?"
**Response:** "InboxPass scans your domain for email authentication issues (SPF, DKIM, DMARC) and generates copy-paste DNS records to fix them. You get a free scan first, then pay $29 if you want the full compliance kit with setup instructions."

### User says: "Is this a subscription?"
**Response:** "No! It's a one-time $29 payment. No recurring fees, no subscription. You pay once and keep the compliance kit forever."

### User says: "What if I need help?"
**Response:** "Email support@inboxpass.org and we'll help you troubleshoot. We respond within 24 hours (usually much faster)."

### User says: "Can I get a refund?"
**Response:** "Yes! We have a 30-day money-back guarantee. If you're not satisfied for any reason, email support@inboxpass.org and we'll refund your $29 in full."

### User says: "I'm not technical"
**Response:** "No problem! Our instructions are written for non-technical users. If you can log into your DNS provider (like Cloudflare or GoDaddy), you can copy-paste the records we provide. It takes 5-10 minutes."

---

## End of Knowledge Base

**Last Updated:** January 21, 2025  
**Version:** 1.0  

