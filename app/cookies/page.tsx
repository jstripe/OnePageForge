import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { LegalToc } from "@/components/LegalToc";

export const metadata: Metadata = { title: "Cookie Policy", description: "OnePageForge uses only strictly necessary and functional cookies. See exactly which ones.", alternates: { canonical: "/cookies/" } };

const s = siteConfig;

export default function CookiesPage() {
  return (
    <article className="prose-custom mx-auto max-w-3xl px-5 py-16 sm:px-6 sm:py-20">
      <h1>Cookie Policy</h1>
      <p className="text-muted-foreground">Last updated: {s.launchMonth}</p>
      <LegalToc page="cookies" />

      <p>This Cookie Policy explains how {s.name} ({s.url}) uses cookies.</p>

      <h2 id="what-cookies-are">What cookies are</h2>
      <p>Cookies are small text files stored on your device by your browser. They are widely used to keep websites working and to remember your preferences.</p>

      <h2 id="cookies-we-set">Cookies we set</h2>
      <table>
        <thead><tr><th>Name</th><th>Purpose</th><th>Type</th><th>Duration</th></tr></thead>
        <tbody>
          <tr><td>onepageforge_session</td><td>Keeps you signed in to your account. It is HttpOnly, so scripts on the page cannot read it.</td><td>Strictly necessary</td><td>30 days</td></tr>
        </tbody>
      </table>
      <p>This is the only cookie we set. It is created when you sign up or log in and removed when you log out or delete your account.</p>

      <h2 id="browser-storage">Browser storage</h2>
      <table>
        <thead><tr><th>Key</th><th>Purpose</th><th>Where</th><th>Duration</th></tr></thead>
        <tbody>
          <tr><td>theme</td><td>Remembers whether you chose light or dark mode</td><td>localStorage in your browser, never sent to us</td><td>Until you clear your browser data</td></tr>
        </tbody>
      </table>
      <p>That is the complete list. We use no analytics cookies, no advertising cookies, no tracking pixels and no third-party cookies on {s.url}.</p>

      <h2 id="stripe-checkout-cookies">Stripe checkout cookies</h2>
      <p>When you go to the Stripe checkout page to make a payment, Stripe may set its own cookies on the stripe.com domain. Those cookies are governed by <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">Stripe's privacy policy</a>, not ours. They do not appear on {s.url}.</p>

      <h2 id="why-no-cookie-banner">Why no cookie banner</h2>
      <p>Because we use only strictly necessary and functional cookies, most privacy regulations (including the GDPR and the UK PECR) do not require us to show a cookie consent banner. If that changes, we will add one.</p>

      <h2 id="how-to-manage-cookies">How to manage cookies</h2>
      <p>You can delete or block cookies in your browser settings. If you delete the session cookie, you will be signed out. If you clear your browser storage, your theme preference resets to the default (dark).</p>
      <ul>
        <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Chrome</a></li>
        <li><a href="https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox" target="_blank" rel="noopener noreferrer">Firefox</a></li>
        <li><a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
        <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">Edge</a></li>
      </ul>

      <h2 id="changes">Changes</h2>
      <p>If we add any new cookies, we will update this page and, where required, ask for your consent.</p>

      <h2 id="more-information">More information</h2>
      <p>For details on how we handle your data, see our <Link href="/privacy/">Privacy Policy</Link>. Questions? Email <a href={`mailto:${s.supportEmail}`}>{s.supportEmail}</a>.</p>
    </article>
  );
}
