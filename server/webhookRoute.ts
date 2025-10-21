import express from "express";
import { handleStripeWebhook } from "./webhookHandler";

export const webhookRouter = express.Router();

/**
 * Stripe webhook endpoint
 * Note: This must use raw body, not JSON parsed body
 */
webhookRouter.post(
  "/stripe/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

