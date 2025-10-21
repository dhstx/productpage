import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQ() {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold text-center">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>What is DMARC?</AccordionTrigger>
          <AccordionContent>
            DMARC (Domain-based Message Authentication, Reporting, and Conformance) is an email
            authentication protocol that helps protect your domain from email spoofing and phishing
            attacks. It works with SPF and DKIM to verify that emails claiming to be from your
            domain are actually sent by authorized servers. Major inbox providers like Gmail, Yahoo,
            and Microsoft now require DMARC for bulk senders.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>Will this fix my spam issues?</AccordionTrigger>
          <AccordionContent>
            InboxPass helps you configure the technical authentication requirements (SPF, DKIM,
            DMARC) that major inbox providers require. While proper authentication significantly
            improves deliverability, spam filtering also considers content quality, engagement
            rates, and sender reputation. Our compliance kit gives you the foundation needed to meet
            2024-2025 inbox provider requirements.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>Does this tool touch my DNS?</AccordionTrigger>
          <AccordionContent>
            No. InboxPass only reads your existing DNS records to check your current configuration.
            We provide you with recommended DNS records that you can copy and paste into your DNS
            provider's control panel. You maintain full control over your DNS settings.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger>What email providers do you support?</AccordionTrigger>
          <AccordionContent>
            We automatically detect and provide setup instructions for Google Workspace, Microsoft
            365, and popular ESPs including SendGrid, Mailgun, Postmark, Mailchimp, Klaviyo, Amazon
            SES, and SparkPost. Our compliance kit includes platform-specific steps for enabling
            DKIM and configuring one-click unsubscribe headers.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5">
          <AccordionTrigger>How long does DNS propagation take?</AccordionTrigger>
          <AccordionContent>
            After you add the recommended DNS records to your domain, changes typically propagate
            within 15 minutes to 48 hours, though most updates are visible within an hour. Our
            compliance kit includes a validation checklist with tools you can use to verify your
            records are active.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-6">
          <AccordionTrigger>What is one-click unsubscribe?</AccordionTrigger>
          <AccordionContent>
            One-click unsubscribe (RFC 8058) is a requirement from Gmail and Yahoo for bulk senders.
            It allows recipients to unsubscribe from your emails with a single click, without having
            to visit a web page. Our kit provides the exact header format and ESP-specific
            instructions for implementing this feature.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-7">
          <AccordionTrigger>Is my data secure?</AccordionTrigger>
          <AccordionContent>
            Yes. We only perform read-only DNS lookups on publicly available records. We do not
            store email content, passwords, or sensitive data. Payment processing is handled
            securely through Stripe. Your scan results and compliance report are stored encrypted
            and are only accessible to you.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-8">
          <AccordionTrigger>Can I scan multiple domains?</AccordionTrigger>
          <AccordionContent>
            Yes! You can scan as many domains as you need. Each domain requires a separate $29
            payment to download its compliance kit. Free scans are limited to 3 per day per IP
            address to prevent abuse.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

