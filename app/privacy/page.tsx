import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { LegalToc } from "@/components/LegalToc";

export const metadata: Metadata = { title: "Privacy Policy", description: "How OnePageForge collects, uses, stores and protects your personal data, and the rights you have over it.", alternates: { canonical: "/privacy/" } };

const s = siteConfig;

export default function PrivacyPage() {
  return (
    <article className="prose-custom mx-auto max-w-3xl px-5 py-16 sm:px-6 sm:py-20">
      <h1>Privacy Policy</h1>
      <p className="text-muted-foreground">Last updated: {s.launchMonth}</p>
      <LegalToc page="privacy" />

      <p>This Privacy Policy explains how {s.legalEntity} ({s.legalForm}, registration number {s.registrationNumber}), registered at {s.registeredOffice} ("we", "us", "{s.name}") collects, uses and protects your personal data when you use {s.name} at {s.url}.</p>

      <h2 id="1-data-controller">1. Data controller</h2>
      <p>The data controller is {s.legalEntity}, {s.registeredOffice}. For privacy-related questions, email <a href={`mailto:${s.supportEmail}`}>{s.supportEmail}</a>.</p>

      <h2 id="2-what-data-we-collect">2. What data we collect</h2>
      <h3>Account data</h3>
      <p>When you create an account, we collect your name, email address and a hashed version of your password. We never store your password in plain text.</p>
      <h3>Payment data</h3>
      <p>Payments are handled by Stripe. Stripe collects your card number, expiry date and billing address. We receive only your email, the plan purchased, the amount paid and a transaction reference. We do not see or store your full card details.</p>
      <h3>Generated content</h3>
      <p>When you use the website generator, we store the business description you enter, the style you choose and the HTML output. This data is linked to your account.</p>
      <h3>Contact messages</h3>
      <p>If you contact us through our form, we collect your name, email, subject and message.</p>
      <h3>Technical data</h3>
      <p>Our hosting provider (Cloudflare) processes IP addresses, browser type, referring URL and timestamps for every request in order to deliver the site and protect it from abuse. Cloudflare handles these logs under its own privacy terms. We use your IP address, in hashed form, for rate limiting on sign-up, login, contact and generation requests.</p>

      <h2 id="3-why-we-process-your-data">3. Why we process your data</h2>
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

      <h2 id="4-sub-processors">4. Sub-processors</h2>
      <p>We share your data with the following third parties, each acting as a sub-processor:</p>
      <table>
        <thead><tr><th>Sub-processor</th><th>Purpose</th><th>Location</th></tr></thead>
        <tbody>
          {s.subProcessors.map((sp) => <tr key={sp.name}><td>{sp.name}</td><td>{sp.purpose}</td><td>{sp.location}</td></tr>)}
        </tbody>
      </table>
      <p>We do not sell your personal data. We do not share it with anyone beyond these sub-processors.</p>

      <h3>When we disclose data</h3>
      <p>Beyond the sub-processors above, we disclose personal data only to comply with a legal obligation or valid legal request, to protect the rights, safety or property of our customers or the service, or to a successor if the business is sold or reorganised, in which case this policy continues to apply to your data until you are told otherwise.</p>

      <h2 id="5-international-transfers">5. International transfers</h2>
      <p>Your data may be processed in the United States and at Cloudflare edge locations worldwide. Where data is transferred outside the UK or EEA, it is protected by the safeguards our providers rely on, such as the UK and EU-US data transfer frameworks or Standard Contractual Clauses.</p>

      <h2 id="6-how-long-we-keep-your-data">6. How long we keep your data</h2>
      <p>{s.dataRetention}</p>
      <table>
        <thead><tr><th>Data</th><th>How long we keep it</th></tr></thead>
        <tbody>
          <tr><td>Account profile (name, email, password hash)</td><td>Until you delete your account</td></tr>
          <tr><td>Generated websites and the descriptions you entered</td><td>Until you delete them or your account, or 30 days after your access period ends, whichever comes first</td></tr>
          <tr><td>Sessions (login cookies)</td><td>30 days, then removed</td></tr>
          <tr><td>Rate-limit counters (hashed IP)</td><td>About 24 hours</td></tr>
          <tr><td>Contact messages</td><td>12 months after they are sent, then deleted</td></tr>
          <tr><td>Payment records (Stripe reference, plan, amount, date)</td><td>Kept without a link to your account after you delete it, for accounting and tax purposes (generally up to 7 years)</td></tr>
        </tbody>
      </table>

      <h2 id="what-stays-in-your-browser">What stays in your browser</h2>
      <p>Your light or dark mode choice is stored in your browser's local storage and is never sent to us. Everything else you create, including descriptions and generated websites, is sent to our servers because the AI runs there and the websites are hosted there. Nothing is processed only on your device.</p>

      <h2 id="7-your-rights">7. Your rights</h2>
      <p>Depending on your location, you may have the right to:</p>
      <ul>
        <li><strong>Access</strong> the personal data we hold about you</li>
        <li><strong>Correct</strong> inaccurate data</li>
        <li><strong>Delete</strong> your data (you can delete your account from your account page, which removes your profile, sessions, plan and all generated websites)</li>
        <li><strong>Export</strong> your data in a portable format</li>
        <li><strong>Object</strong> to processing based on legitimate interest</li>
        <li><strong>Restrict</strong> processing while a complaint is being resolved</li>
      </ul>
      <p>To exercise any of these rights, email <a href={`mailto:${s.supportEmail}`}>{s.supportEmail}</a>. We respond within 30 days.</p>
      <p><strong>Complaints.</strong> If you are unhappy with how we handle your data, please contact us first. You also have the right to complain to the data protection authority where you live or work, for example the Information Commissioner's Office (ICO) in the United Kingdom or your national authority in the European Union.</p>
      <p><strong>US state privacy rights.</strong> Residents of some US states, such as California, can ask to access, correct or delete their personal data. We do not sell personal data and we do not share it for cross-context behavioural advertising. Use the contact details below to make a request.</p>

      <h2 id="8-security">8. Security</h2>
      <p>We protect your data with HTTPS encryption in transit, hashed passwords (PBKDF2 with 100,000 iterations), HttpOnly session cookies and Cloudflare's network security. For more detail, see our <Link href="/security/">Security page</Link>.</p>

      <h2 id="9-cookies">9. Cookies</h2>
      <p>{s.name} uses a single, strictly necessary session cookie to keep you signed in. We do not use tracking cookies, analytics cookies, or advertising cookies. See our <Link href="/cookies/">Cookie Policy</Link> for details.</p>

      <h2 id="10-children">10. Children</h2>
      <p>{s.name} is not intended for anyone under the age of 18. We do not knowingly collect data from minors. If we learn that a user is under 18, we will delete their account and data.</p>

      <h2 id="11-changes-to-this-policy">11. Changes to this policy</h2>
      <p>We may update this Privacy Policy from time to time. When we do, we update the "Last updated" date at the top. If the changes are material, we notify you by email.</p>

      <h2 id="12-contact">12. Contact</h2>
      <p>For any privacy-related questions or requests, email <a href={`mailto:${s.supportEmail}`}>{s.supportEmail}</a>.</p>
      <p>{s.legalEntity}<br />{s.registeredOffice}</p>
    </article>
  );
}
