import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { LegalToc } from "@/components/LegalToc";

export const metadata: Metadata = { title: "Refund Policy", description: "OnePageForge plans are one-time purchases. Read when you can request a refund, your statutory rights and how refunds are processed.", alternates: { canonical: "/refund/" } };

const s = siteConfig;

export default function RefundPage() {
  return (
    <article className="prose-custom mx-auto max-w-3xl px-5 py-16 sm:px-6 sm:py-20">
      <h1>Refund Policy</h1>
      <p className="text-muted-foreground">Last updated: {s.launchMonth}</p>
      <LegalToc page="refund" />

      <p>All {s.name} plans are one-time purchases made through Stripe. There are no subscriptions, no trials and no automatic renewals, so there is nothing to cancel. This policy explains when you can get your money back. It sits alongside our <a href="/terms/">Terms of Service</a>.</p>

      <h2 id="one-time-plans">One-time plans</h2>
      <p>Each plan gives you a set number of credits and a set number of days of access for a single payment. When the access period ends, the plan simply ends. We never charge you again unless you choose to buy another plan.</p>

      <h2 id="refund-within">Refund within {s.refundWindow}</h2>
      <p>You may request a full refund if both of the following are true:</p>
      <ol>
        <li>Your purchase was made within the last {s.refundWindow}.</li>
        <li>You have used fewer than {s.refundThreshold} from that purchase.</li>
      </ol>
      <p>If both conditions are met, we refund the full amount you paid for that plan.</p>

      <h2 id="billing-errors-faults-and-unauthorised-charges">Billing errors, faults and unauthorised charges</h2>
      <p>Whatever the usage, tell us and we will put it right if:</p>
      <ul>
        <li><strong>Billing error.</strong> You were charged twice for the same plan, or charged an amount different from the price shown at checkout.</li>
        <li><strong>Service fault.</strong> A problem on our side stopped you from using the plan you paid for and we were unable to fix it within a reasonable time. Credits used by a generation that failed on our side are returned automatically.</li>
        <li><strong>Unauthorised charge.</strong> A payment was made without your permission. Contact us first so that we can investigate and refund where appropriate.</li>
      </ul>

      <h2 id="your-statutory-right-to-cancel-uk-and-eu-consumers">Your statutory right to cancel (UK and EU consumers)</h2>
      <p>If you are a consumer in the United Kingdom or the European Union, you have a legal right to cancel a distance purchase within 14 days of buying, without giving a reason. Nothing in this policy reduces that right.</p>
      <p>If you ask to cancel within the 14 days and you have already started using the plan, for example by generating websites, we may deduct a proportionate amount for what you have used, as the law allows, and refund the rest. If you have not used the plan, you receive a full refund. To use this right, email us within the 14 days with the email you used at checkout.</p>

      <h2 id="what-is-not-refunded">What is not refunded</h2>
      <ul>
        <li>Plans bought more than {s.refundWindow} ago, unless a billing error, service fault, unauthorised charge or your statutory right applies.</li>
        <li>Plans where {s.refundThreshold} or more have been used, unless one of those same exceptions applies.</li>
        <li>Plans on accounts closed by us for breaking our Terms, such as abusing the service or generating prohibited content.</li>
        <li>Dissatisfaction with the style or wording of an AI-generated website that the service produced as described. You can generate again with your remaining credits.</li>
      </ul>

      <h2 id="how-to-request-a-refund">How to request a refund</h2>
      <ol>
        <li>Email <a href={`mailto:${s.supportEmail}`}>{s.supportEmail}</a> from the address you used at checkout, or use our <a href="/contact/">contact form</a> and choose "Refund request".</li>
        <li>Include the word "refund" in the subject and, if you can, the date and amount of the payment.</li>
        <li>We check the purchase and your credit usage and reply within 5 business days.</li>
      </ol>

      <h2 id="how-refunds-are-paid">How refunds are paid</h2>
      <p>Approved refunds go back to the card or payment method used at checkout, through Stripe. They normally appear within 5 to 10 business days, depending on your bank. When a refund is issued, the credits and access days from that purchase are removed from your account. Websites you generated stay online only for as long as any other active plan on your account allows.</p>

      <h2 id="chargebacks-and-disputes">Chargebacks and disputes</h2>
      <p>Please contact us before disputing a charge with your bank, so that we can solve the problem directly and faster. If a dispute is opened, we give the bank and Stripe the records of your purchase and usage, and we may suspend the account while the dispute is open. If the dispute is decided in your favour, the credits and access from that purchase are removed.</p>

      <h2 id="changes-to-this-policy">Changes to this policy</h2>
      <p>We may update this Refund Policy. The version shown on the date of your purchase is the one that applies to that purchase. When we make a material change we update the "Last updated" date and tell account holders by email.</p>

      <h2 id="contact">Contact</h2>
      <p>Questions about refunds? Email <a href={`mailto:${s.supportEmail}`}>{s.supportEmail}</a>.</p>
      <p>{s.legalEntity}<br />{s.registeredOffice}</p>
    </article>
  );
}
