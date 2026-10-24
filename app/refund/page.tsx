import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = { title: "Refund Policy", description: "SiteForge plans are one-time purchases. Read when you can request a refund and how it is processed.", alternates: { canonical: "/refund/" } };

const s = siteConfig;

export default function RefundPage() {
  return (
    <article className="prose-custom mx-auto max-w-3xl px-5 py-16 sm:px-6 sm:py-20">
      <h1>Refund Policy</h1>
      <p className="text-muted-foreground">Last updated: {s.launchMonth}</p>

      <p>All {s.name} plans are one-time purchases. There are no subscriptions, no trials and no automatic renewals.</p>

      <h2>When you can get a refund</h2>
      <p>You may request a full refund if both of the following are true:</p>
      <ol>
        <li>Your purchase was made within the last {s.refundWindow}.</li>
        <li>You have used fewer than {s.refundThreshold} from that purchase.</li>
      </ol>
      <p>If both conditions are met, we will refund the full amount you paid for that plan. No partial refunds are available.</p>

      <h2>When a refund is not available</h2>
      <ul>
        <li>More than {s.refundWindow} have passed since your purchase.</li>
        <li>You have used {s.refundThreshold} or more from the plan you bought.</li>
        <li>Your account has been suspended for violating our Terms of Service.</li>
      </ul>

      <h2>What happens after a refund</h2>
      <p>Once we process a refund:</p>
      <ul>
        <li>The credits from the refunded plan are removed immediately.</li>
        <li>The access days from the refunded plan are removed immediately.</li>
        <li>Any websites you generated using credits from the refunded plan remain accessible until the end of any remaining access period from other plans. If you have no other active plan, they expire immediately.</li>
        <li>Your account stays open. You can purchase a new plan at any time.</li>
      </ul>

      <h2>How to request a refund</h2>
      <ol>
        <li>Email <a href={`mailto:${s.supportEmail}`}>{s.supportEmail}</a> from the email address you used at checkout.</li>
        <li>Include the word "refund" in the subject line.</li>
        <li>We will verify your purchase and credit usage and respond within 5 business days.</li>
        <li>If your request is approved, the refund is processed through Stripe. It typically takes 5 to 10 business days to appear on your statement, depending on your bank.</li>
      </ol>

      <h2>Disputes</h2>
      <p>If you dispute a charge with your bank instead of contacting us, we will provide the bank with records of your purchase and usage. If the dispute is resolved in our favour, your account may be suspended.</p>
      <p>We encourage you to contact us first so we can resolve the issue directly.</p>

      <h2>Changes to this policy</h2>
      <p>We may update this Refund Policy. The version shown here on the date of your purchase is the one that applies to that purchase. When we make a material change we update the "Last updated" date and tell account holders by email.</p>

      <h2>Contact</h2>
      <p>Questions about refunds? Email <a href={`mailto:${s.supportEmail}`}>{s.supportEmail}</a>.</p>
      <p>{s.legalEntity}<br />{s.registeredOffice}</p>
    </article>
  );
}
