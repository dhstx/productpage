import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const PUBLIC_AGENT_ID = "01K8498K7A7CV34D0BB6JMM18N";

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
        // Use Taskade MCP to send message
        const command = `manus-mcp-cli tool call send_message --server taskade --input '${JSON.stringify({
          agent_id: PUBLIC_AGENT_ID,
          message: input.message,
          conversation_id: input.conversationId,
        })}'`;

        const { stdout } = await execAsync(command);
        const response = JSON.parse(stdout);

        return {
          success: true,
          response: response.content?.[0]?.text || "I'm here to help! How can I assist you?",
          conversationId: response.conversation_id || input.conversationId,
        };
      } catch (error) {
        console.error("Chat error:", error);
        return {
          success: false,
          response: "Sorry, I'm having trouble connecting right now. Please try again or email support@inboxpass.org.",
          conversationId: input.conversationId,
        };
      }
    }),
});

