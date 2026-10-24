import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = { title: "Privacy Policy", description: "How SiteForge collects, uses, stores and protects your personal data, and the rights you have over it.", alternates: { canonical: "/privacy/" } };

const s = siteConfig;

export default function PrivacyPage() {
  return (
    <article className="prose-custom mx-auto max-w-3xl px-5 py-16 sm:px-6 sm:py-20">
      <h1>Privacy Policy</h1>
      <p className="text-muted-foreground">Last updated: {s.launchMonth}</p>

      <p>This Privacy Policy explains how {s.legalEntity} ({s.legalForm}, registration number {s.registrationNumber}), registered at {s.registeredOffice} ("we", "us", "{s.name}") collects, uses and protects your personal data when you use {s.name} at {s.url}.</p>

      <h2>1. Data controller</h2>
      <p>The data controller is {s.legalEntity}, {s.registeredOffice}. For privacy-related questions, email <a href={`mailto:${s.supportEmail}`}>{s.supportEmail}</a>.</p>

      <h2>2. What data we collect</h2>
      <h3>Account data</h3>
      <p>When you create an account, we collect your name, email address and a hashed version of your password. We never store your password in plain text.</p>
      <h3>Payment data</h3>
      <p>Payments are handled by Stripe. Stripe collects your card number, expiry date and billing address. We receive only your email, the plan purchased, the amount paid and a transaction reference. We do not see or store your full card details.</p>
      <h3>Generated content</h3>
      <p>When you use the website generator, we store the business description you enter, the style you choose and the HTML output. This data is linked to your account.</p>
      <h3>Contact messages</h3>
      <p>If you contact us through our form, we collect your name, email, subject and message.</p>
      <h3>Technical data</h3>
      <p>Our hosting provider (Cloudflare) automatically logs IP addresses, browser type, referring URL and timestamps for every request. These logs are managed by Cloudflare under their own privacy policy and are typically retained for 72 hours.</p>

      <h2>3. Why we process your data</h2>
      <table>
        <thead><tr><th>Purpose</th><th>Legal basis</th></tr></thead>
        <tbody>
          <tr><td>Create and manage your account</td><td>Contract performance</td></tr>
          <tr><td>Process your payment and activate your plan</td><td>Contract performance</td></tr>
          <tr><td>Generate websites on your behalf</td><td>Contract performance</td></tr>
          <tr><td>Host your generated websites</td><td>Contract performance</td></tr>
          <tr><td>Send you account-related emails (receipts, security alerts)</td><td>Contract performance</td></tr>
          <tr><td>Respond to your support requests</td><td>Legitimate interest</td></tr>
          <tr><td>Prevent fraud and abuse</td><td>Legitimate interest</td></tr>
          <tr><td>Comply with legal obligations</td><td>Legal obligation</td></tr>
        </tbody>
      </table>

      <h2>4. Sub-processors</h2>
      <p>We share your data with the following third parties, each acting as a sub-processor:</p>
      <table>
        <thead><tr><th>Sub-processor</th><th>Purpose</th><th>Location</th></tr></thead>
        <tbody>
          {s.subProcessors.map((sp) => <tr key={sp.name}><td>{sp.name}</td><td>{sp.purpose}</td><td>{sp.location}</td></tr>)}
        </tbody>
      </table>
      <p>We do not sell your personal data. We do not share it with anyone beyond these sub-processors.</p>

      <h2>5. International transfers</h2>
      <p>Your data may be processed in the United States and at Cloudflare edge locations worldwide. Where data is transferred outside the UK or EEA, it is protected by Standard Contractual Clauses or equivalent safeguards.</p>

      <h2>6. How long we keep your data</h2>
      <p>{s.dataRetention}</p>
      <p>Contact messages are kept for up to 12 months after we resolve them, then deleted. Payment records (transaction reference, amount, date) are kept for 7 years for accounting and tax compliance.</p>

      <h2>7. Your rights</h2>
      <p>Depending on your location, you may have the right to:</p>
      <ul>
        <li><strong>Access</strong> the personal data we hold about you</li>
        <li><strong>Correct</strong> inaccurate data</li>
        <li><strong>Delete</strong> your data (you can delete your account from your account page, which removes your profile and all generated websites)</li>
        <li><strong>Export</strong> your data in a portable format</li>
        <li><strong>Object</strong> to processing based on legitimate interest</li>
        <li><strong>Restrict</strong> processing while a complaint is being resolved</li>
      </ul>
      <p>To exercise any of these rights, email <a href={`mailto:${s.supportEmail}`}>{s.supportEmail}</a>. We respond within 30 days.</p>

      <h2>8. Security</h2>
      <p>We protect your data with HTTPS encryption in transit, hashed passwords (PBKDF2 with 100,000 iterations), HttpOnly session cookies and Cloudflare's network security. For more detail, see our <Link href="/security/">Security page</Link>.</p>

      <h2>9. Cookies</h2>
      <p>{s.name} uses a single, strictly necessary session cookie to keep you signed in. We do not use tracking cookies, analytics cookies, or advertising cookies. See our <Link href="/cookies/">Cookie Policy</Link> for details.</p>

      <h2>10. Children</h2>
      <p>{s.name} is not intended for anyone under the age of 18. We do not knowingly collect data from minors. If we learn that a user is under 18, we will delete their account and data.</p>

      <h2>11. Changes to this policy</h2>
      <p>We may update this Privacy Policy from time to time. When we do, we update the "Last updated" date at the top. If the changes are material, we notify you by email.</p>

      <h2>12. Contact</h2>
      <p>For any privacy-related questions or requests, email <a href={`mailto:${s.supportEmail}`}>{s.supportEmail}</a>.</p>
      <p>{s.legalEntity}<br />{s.registeredOffice}</p>
    </article>
  );
}
