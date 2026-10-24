import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = { title: "Terms of Service", description: "The terms that apply when you use SiteForge: plans and credits, payments, refunds, acceptable use and liability.", alternates: { canonical: "/terms/" } };

const s = siteConfig;

export default function TermsPage() {
  return (
    <article className="prose-custom mx-auto max-w-3xl px-5 py-16 sm:px-6 sm:py-20">
      <h1>Terms of Service</h1>
      <p className="text-muted-foreground">Last updated: {s.launchMonth}</p>

      <p>These Terms of Service ("Terms") form a legally binding agreement between you ("Customer", "you") and {s.legalEntity} ({s.legalForm}, registration number {s.registrationNumber}), registered at {s.registeredOffice} ("we", "us", "{s.name}"). By creating an account or making a purchase, you accept these Terms in full.</p>

      <h2>1. What {s.name} does</h2>
      <p>{s.name} is an AI-powered website generator. You enter a short description of your business, choose a style, and our system creates a complete, single-page website that we host on your behalf. Each generation costs one credit. Credits are included in the plan you buy.</p>

      <h2>2. Eligibility</h2>
      <p>You must be at least 18 years old to use {s.name}. By creating an account, you confirm that you meet this age requirement. We may ask for proof of age at any time and suspend your account until you provide it.</p>

      <h2>3. Your account</h2>
      <p>You are responsible for keeping your password secure and for all activity on your account. Do not share your login credentials. If you suspect unauthorized access, contact us immediately at <a href={`mailto:${s.supportEmail}`}>{s.supportEmail}</a>.</p>
      <p>We may suspend or close your account if you violate these Terms, if your payment is disputed, or if we reasonably believe your use is harmful.</p>

      <h2>4. Plans, credits and pricing</h2>
      <p>We offer one-time plans that include a set number of credits and a set number of days of access. There are no subscriptions, no trials and no automatic renewals. The plans and prices shown on the <Link href="/pricing/">pricing page</Link> at the time of your purchase are the ones that apply to your order.</p>
      <p>{s.creditDefinition}. Credits do not expire before the access period ends. If you buy another plan while one is still active, the credits and remaining access days from both plans are added together.</p>

      <h2>5. Payments</h2>
      <p>All payments are processed by Stripe. We do not see or store your full card number. Prices are shown in USD and all charges appear in USD on your statement. You are responsible for any currency conversion fees your bank applies.</p>
      <p>We use Stripe Payment Links for checkout. When you click a payment button, you are taken to a Stripe-hosted page to complete the payment. After a successful payment, your plan is activated on the account whose email matches the email you used at checkout.</p>

      <h2>6. Refunds</h2>
      <p>You may request a refund within {s.refundWindow} of your purchase, provided you have used fewer than {s.refundThreshold}. To request a refund, email <a href={`mailto:${s.supportEmail}`}>{s.supportEmail}</a> with the email address you used at checkout. We process refunds within 10 business days. Once a refund is issued, your remaining credits and access are revoked immediately. See our <Link href="/refund/">Refund Policy</Link> for full details.</p>

      <h2>7. Generated websites</h2>
      <p>The websites you generate using {s.name} are yours to use. You may download the HTML and host it elsewhere. We grant you a non-exclusive, worldwide licence to use, modify and display any website generated through your account.</p>
      <p>We host your generated websites at a {s.name} subdomain (e.g. siteforge.com/s/your-slug) for the duration of your access period. After your access expires, hosted websites return a "this site has expired" notice. We delete the data {s.dataRetention.toLowerCase()}</p>

      <h2>8. Acceptable use</h2>
      <p>You may not use {s.name} to generate websites that:</p>
      <ul>
        <li>Promote illegal activity in your jurisdiction</li>
        <li>Contain hate speech, harassment or threats</li>
        <li>Infringe someone else's copyright, trademark or other intellectual property</li>
        <li>Impersonate another person or business</li>
        <li>Distribute malware, phishing pages or scams</li>
        <li>Contain sexually explicit material involving minors</li>
      </ul>
      <p>We may remove any generated website that violates these rules, with or without notice. Repeated violations result in account suspension.</p>

      <h2>9. AI-generated content</h2>
      <p>{s.name} uses AI to generate website content. AI output can be inaccurate, incomplete or inappropriate. You are responsible for reviewing every website you publish or share. We do not guarantee the accuracy or fitness of any AI-generated text, layout or design.</p>

      <h2>10. Availability and changes</h2>
      <p>We aim to keep {s.name} available at all times but do not guarantee uninterrupted service. We may pause the service for maintenance, updates or reasons beyond our control. We will try to give advance notice when possible.</p>
      <p>We may change features, plans or pricing at any time. Changes to pricing do not affect plans you have already bought. Changes to features apply to all users, including existing customers.</p>

      <h2>11. Intellectual property</h2>
      <p>The {s.name} name, logo, code and design are owned by {s.legalEntity}. You may not copy, modify or redistribute the {s.name} platform, its source code or its branding. The websites you generate are yours, as described in Section 7.</p>

      <h2>12. Limitation of liability</h2>
      <p>To the maximum extent permitted by applicable law, {s.legalEntity} is not liable for any indirect, incidental, special, consequential or punitive damages, including lost profits, lost revenue, lost data or business interruption, arising from your use of {s.name}.</p>
      <p>Our total liability for any claim related to {s.name} is limited to the amount you paid us in the 12 months before the claim arose.</p>

      <h2>13. Indemnification</h2>
      <p>You agree to indemnify and hold harmless {s.legalEntity}, its officers, directors and employees from any claim, demand or damage (including legal fees) arising from your use of {s.name}, your generated websites or your breach of these Terms.</p>

      <h2>14. Governing law and disputes</h2>
      <p>These Terms are governed by the laws of {s.governingLaw}. Any dispute that cannot be resolved informally shall be submitted to the courts of {s.governingLaw}.</p>

      <h2>15. Changes to these Terms</h2>
      <p>We may update these Terms from time to time. When we do, we update the "Last updated" date at the top. If the changes are material, we will notify you by email. Your continued use of {s.name} after a change means you accept the updated Terms.</p>

      <h2>16. Contact</h2>
      <p>Questions about these Terms? Email <a href={`mailto:${s.supportEmail}`}>{s.supportEmail}</a>.</p>
      <p>{s.legalEntity}<br />{s.registeredOffice}</p>
    </article>
  );
}
