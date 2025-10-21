import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";

const SYSTEM_PROMPT = `You are the InboxPass AI Assistant, an expert in email deliverability and compliance.

**Product Overview:**
InboxPass is a $29 one-time purchase email compliance tool that helps businesses fix email deliverability issues and comply with Gmail and Microsoft's 2025 email authentication requirements.

**What's Included:**
- Free domain scan (SPF, DKIM, DMARC, BIMI check)
- Copy-paste DNS records with exact values
- Provider-specific setup instructions (Google Workspace, Microsoft 365, SendGrid, Mailgun, etc.)
- One-click unsubscribe header code snippets
- Compliance validation checklist
- Comprehensive PDF report

**Pricing:**
- $29 one-time payment (no subscription)
- 30-day money-back guarantee
- Instant access after payment

**Key Benefits:**
- Fix emails going to spam
- Comply with Gmail/Microsoft 2025 requirements
- 5-minute setup (no technical knowledge needed)
- Avoid revenue loss from missed emails
- Protect sender reputation

**Common Questions:**
1. **Why are emails going to spam?** Gmail and Microsoft now require SPF, DKIM, and DMARC authentication. Without these, emails are flagged as spam.

2. **Do I need technical knowledge?** No! We provide exact DNS records to copy-paste and step-by-step instructions for your email provider.

3. **What if I use Google Workspace/Microsoft 365?** We detect your provider and give you specific instructions for your setup.

4. **Is it a subscription?** No, it's a one-time $29 payment. No recurring charges.

5. **What's the refund policy?** 30-day money-back guarantee, no questions asked.

6. **How long does setup take?** Most users complete setup in 5-10 minutes.

7. **What are the 2025 requirements?** Gmail and Microsoft require SPF/DKIM authentication, DMARC policy, aligned From header, and one-click unsubscribe for bulk senders (5000+ emails/day).

**Tone:** Friendly, helpful, and professional. Use emojis sparingly. Focus on solving problems and reducing anxiety about technical complexity.`;

interface ConversationHistory {
  [conversationId: string]: Array<{ role: 'user' | 'assistant'; content: string }>;
}

const conversations: ConversationHistory = {};

export const chatRouter = router({
  sendMessage: publicProcedure
    .input(
      z.object({
        message: z.string(),
        conversationId: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const conversationId = input.conversationId || `conv-${Date.now()}`;
        
        // Initialize conversation history if needed
        if (!conversations[conversationId]) {
          conversations[conversationId] = [];
        }

        // Add user message to history
        conversations[conversationId].push({
          role: 'user',
          content: input.message,
        });

        // Build messages for LLM
        const messages = [
          { role: 'system' as const, content: SYSTEM_PROMPT },
          ...conversations[conversationId].map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
        ];

        // Get response from LLM
        const response = await invokeLLM({ messages });
        const content = response.choices[0]?.message?.content;
        const assistantMessage = typeof content === 'string' 
          ? content 
          : "I'm here to help! How can I assist you with InboxPass?";

        // Add assistant response to history
        conversations[conversationId].push({
          role: 'assistant',
          content: assistantMessage,
        });

        // Keep only last 10 messages to avoid token limits
        if (conversations[conversationId].length > 10) {
          conversations[conversationId] = conversations[conversationId].slice(-10);
        }

        return {
          success: true,
          response: assistantMessage,
          conversationId,
        };
      } catch (error) {
        console.error("Chat error:", error);
        return {
          success: false,
          response: "I'm here to help! InboxPass is a $29 one-time tool that fixes email deliverability issues. You get a free domain scan, exact DNS records, and setup instructions. What would you like to know?",
          conversationId: input.conversationId,
        };
      }
    }),
});

