import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { LegalToc } from "@/components/LegalToc";

export const metadata: Metadata = { title: "Security", description: "How OnePageForge protects your account, payments and generated websites.", alternates: { canonical: "/security/" } };

const s = siteConfig;

export default function SecurityPage() {
  return (
    <article className="prose-custom mx-auto max-w-3xl px-5 py-16 sm:px-6 sm:py-20">
      <h1>Security</h1>
      <p className="text-muted-foreground">Last updated: {s.launchMonth}</p>
      <LegalToc page="security" />

      <p>We take the security of your data seriously. This page describes the measures we have in place to protect your account, your generated websites and your personal information.</p>

      <h2 id="infrastructure">Infrastructure</h2>
      <ul>
        <li><strong>Hosting.</strong> {s.name} runs on Cloudflare Workers, a serverless platform distributed across Cloudflare's global network. There are no traditional servers to patch or maintain.</li>
        <li><strong>Database.</strong> Your data is stored in Cloudflare D1, a serverless SQL database that runs at the edge. Data is encrypted at rest by Cloudflare.</li>
        <li><strong>TLS.</strong> All connections to {s.name} are encrypted with HTTPS (TLS 1.2 or higher). HTTP requests are automatically redirected to HTTPS.</li>
        <li><strong>DDoS protection.</strong> Cloudflare provides automatic DDoS mitigation at the network and application layers.</li>
      </ul>

      <h2 id="authentication">Authentication</h2>
      <ul>
        <li><strong>Password hashing.</strong> Passwords are hashed using PBKDF2 with 100,000 iterations and a unique random salt per account. We never store passwords in plain text.</li>
        <li><strong>Session management.</strong> Sessions are managed with HttpOnly cookies that cannot be read by client-side JavaScript. Session tokens are generated using cryptographically secure random bytes.</li>
        <li><strong>CSRF protection.</strong> All mutating API requests are protected with same-origin checks. Requests from different origins are rejected.</li>
      </ul>

      <h2 id="payments">Payments</h2>
      <ul>
        <li><strong>Stripe.</strong> Payments are processed entirely by Stripe. Card details are entered on Stripe's PCI-compliant checkout page. We never see, handle or store your full card number, CVV or billing address.</li>
        <li><strong>PCI DSS.</strong> Stripe is certified as a PCI DSS Level 1 service provider. We do not hold any payment card certification ourselves because we never handle card data.</li>
        <li><strong>Webhook verification.</strong> Stripe webhook events are verified using the webhook signing secret before we act on them. Unverified events are rejected.</li>
      </ul>

      <h2 id="data-handling">Data handling</h2>
      <ul>
        <li><strong>Minimal collection.</strong> We collect only the data necessary to operate the service: your name, email, hashed password, generated websites and payment references.</li>
        <li><strong>Account deletion.</strong> You can delete your account from your account page. This permanently removes your profile, generated websites and all associated data.</li>
        <li><strong>Data retention.</strong> {s.dataRetention}</li>
      </ul>

      <h2 id="access-controls-and-monitoring">Access controls and monitoring</h2>
      <ul>
        <li><strong>Least access.</strong> Access to production configuration and customer data is limited to the people who need it to run the service, and admin functions are restricted to approved administrator accounts.</li>
        <li><strong>Isolation.</strong> Each customer can only read, list and delete their own generated websites and account data.</li>
        <li><strong>Logging.</strong> The platform records request and error logs so that suspicious activity and failures can be detected and investigated. Passwords and payment details are never written to logs.</li>
        <li><strong>Updates.</strong> We review dependencies and apply security patches to the software we run.</li>
      </ul>

      <h2 id="your-responsibilities">Your responsibilities</h2>
      <p>Security is shared. Choose a strong, unique password, do not share your login, sign out on shared devices, and tell us straight away if you think your account has been accessed by someone else. See our <a href="/privacy/">Privacy Policy</a> for how we handle your data.</p>

      <h2 id="what-stays-on-your-device">What stays on your device</h2>
      <p>Only your light or dark mode preference stays in your browser. Descriptions you enter and websites you generate are processed and stored on our servers, because that is where the AI runs and where your websites are hosted.</p>

      <h2 id="hosted-websites">Hosted websites</h2>
      <p>Generated websites are served in a restricted sandbox that blocks scripts, forms and access to your account, so a generated page cannot act on behalf of a visitor who happens to be signed in.</p>

      <h2 id="incident-response">Incident response</h2>
      <p>If we become aware of a security incident that affects personal data, we investigate it, take steps to contain it and tell affected customers and the relevant authorities without undue delay, as the law requires.</p>

      <h2 id="rate-limiting">Rate limiting</h2>
      <p>Sign-up, login, the contact form and website generation are rate-limited to prevent abuse. Excessive requests result in temporary blocks.</p>

      <h2 id="responsible-disclosure">Responsible disclosure</h2>
      <p>If you discover a security vulnerability in {s.name}, please report it to <a href={`mailto:${s.supportEmail}`}>{s.supportEmail}</a> with the subject line "Security Report". We ask that you:</p>
      <ul>
        <li>Do not exploit the vulnerability beyond what is needed to show that it exists.</li>
        <li>Do not access other users' data.</li>
        <li>Give us reasonable time to fix the issue before disclosing it publicly.</li>
      </ul>
      <p>We appreciate your help in keeping {s.name} safe.</p>

      <h2 id="contact">Contact</h2>
      <p>Security questions? Email <a href={`mailto:${s.supportEmail}`}>{s.supportEmail}</a>.</p>
    </article>
  );
}
