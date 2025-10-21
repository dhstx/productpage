import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQ() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Why pay $29? Can't I do this for free?</AccordionTrigger>
        <AccordionContent>
          <p className="text-gray-700 leading-relaxed">
            You can try, but it's a notoriously frustrating, error-prone process. A single typo in your SPF record or a misaligned DMARC policy can take your entire email system offline.
          </p>
          <p className="text-gray-700 leading-relaxed mt-3">
            You're not paying for the <em>information</em>; you're paying for the <strong>correct, validated answer</strong> in 5 minutes, saving you hours of headache and lost revenue.
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-2">
        <AccordionTrigger>Do you log in to my DNS or email provider?</AccordionTrigger>
        <AccordionContent>
          <p className="text-gray-700 leading-relaxed">
            <strong>Never.</strong> Our tool performs 100% public DNS checks. We give <em>you</em> the records to copy and paste. You retain full control of your systems.
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-3">
        <AccordionTrigger>Will this 100% guarantee I never go to spam?</AccordionTrigger>
        <AccordionContent>
          <p className="text-gray-700 leading-relaxed">
            No. This tool fixes your <strong>technical compliance</strong>, which is the new, mandatory <em>ticket to entry</em>. You still need to send content people want and maintain a clean list.
          </p>
          <p className="text-gray-700 leading-relaxed mt-3">
            But without this compliance, even your <em>best</em> emails are flagged as spam.
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-4">
        <AccordionTrigger>What if I use Klaviyo, Mailchimp, SendGrid, etc.?</AccordionTrigger>
        <AccordionContent>
          <p className="text-gray-700 leading-relaxed">
            We designed the kit for this. Our scan detects common providers and gives you provider-specific instructions for enabling DKIM and one-click unsubscribe headers right inside their platforms.
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-5">
        <AccordionTrigger>What is DMARC?</AccordionTrigger>
        <AccordionContent>
          <p className="text-gray-700 leading-relaxed">
            DMARC (Domain-based Message Authentication, Reporting & Conformance) is an email authentication protocol that tells receiving servers what to do if an email fails SPF or DKIM checks.
          </p>
          <p className="text-gray-700 leading-relaxed mt-3">
            Without DMARC, Gmail and Microsoft now assume your domain is vulnerable to spoofing and will throttle or block your emails.
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-6">
        <AccordionTrigger>Will this fix my spam issues?</AccordionTrigger>
        <AccordionContent>
          <p className="text-gray-700 leading-relaxed">
            If your spam issues are caused by <strong>missing or misconfigured authentication</strong> (SPF, DKIM, DMARC), then yes—this will fix it.
          </p>
          <p className="text-gray-700 leading-relaxed mt-3">
            However, if you're sending to unengaged lists, using spammy content, or have a poor sender reputation, you'll need to address those separately. This tool ensures you meet the <em>technical requirements</em> that are now mandatory.
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-7">
        <AccordionTrigger>Does this tool touch my DNS?</AccordionTrigger>
        <AccordionContent>
          <p className="text-gray-700 leading-relaxed">
            <strong>No.</strong> We only perform read-only DNS lookups. We provide you with the exact records to add, but you (or your IT team) make the changes in your DNS provider (Cloudflare, GoDaddy, Namecheap, etc.).
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-8">
        <AccordionTrigger>What email providers do you support?</AccordionTrigger>
        <AccordionContent>
          <p className="text-gray-700 leading-relaxed mb-3">
            We provide tailored instructions for the most common email service providers, including:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Google Workspace (Gmail for Business)</li>
            <li>Microsoft 365 (Outlook)</li>
            <li>SendGrid</li>
            <li>Mailgun</li>
            <li>Mailchimp</li>
            <li>Klaviyo</li>
            <li>Amazon SES</li>
            <li>Postmark</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-3">
            If you use a different provider, the DNS records we generate will still work—you'll just need to follow your provider's documentation for adding them.
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-9">
        <AccordionTrigger>How long does DNS propagation take?</AccordionTrigger>
        <AccordionContent>
          <p className="text-gray-700 leading-relaxed">
            DNS changes typically propagate within <strong>5-30 minutes</strong>, but can take up to 48 hours in rare cases. Most providers (Cloudflare, Route53) propagate within minutes.
          </p>
          <p className="text-gray-700 leading-relaxed mt-3">
            You can verify your changes using our free scanner after adding the records.
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-10">
        <AccordionTrigger>What is one-click unsubscribe?</AccordionTrigger>
        <AccordionContent>
          <p className="text-gray-700 leading-relaxed">
            One-click unsubscribe is a <strong>mandatory email header</strong> (not just a footer link) that allows recipients to unsubscribe with a single click, without logging in or visiting a webpage.
          </p>
          <p className="text-gray-700 leading-relaxed mt-3">
            Gmail and Yahoo now <em>require</em> this header for bulk senders. Our compliance kit shows you exactly how to add it to your ESP.
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-11">
        <AccordionTrigger>Is my data secure?</AccordionTrigger>
        <AccordionContent>
          <p className="text-gray-700 leading-relaxed">
            Yes. We only perform public DNS lookups—the same information anyone can query. We don't store your domain data, and we don't require any login credentials or access to your email systems.
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-12">
        <AccordionTrigger>Can I scan multiple domains?</AccordionTrigger>
        <AccordionContent>
          <p className="text-gray-700 leading-relaxed">
            Yes! Each scan is $29 per domain. If you need to scan multiple domains, simply run the tool once for each domain and you'll receive a separate compliance kit for each.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

