export const siteConfig = {
  name: "OnePageForge",
  url: "https://onepageforge.com",
  tagline: "Describe your business. Get a website.",
  description: "Enter a short description of your business and get a complete, hosted one-page website. No builder to learn, no code to write.",

  legalEntity: "{{LEGAL ENTITY}}",
  legalForm: "{{LEGAL FORM}}",
  registrationNumber: "{{REGISTRATION NUMBER}}",
  registeredOffice: "{{REGISTERED OFFICE}}",
  governingLaw: "{{GOVERNING LAW}}",

  supportEmail: "support@onepageforge.com",
  supportHours: "Monday to Friday, 9 AM to 5 PM GMT",
  phone: "",

  launchMonth: "October 2026",
  creditDefinition: "1 credit = 1 website generated",
  refundWindow: "14 days",
  refundThreshold: "3 credits used",
  dataRetention: "We keep your generated websites for the duration of your access period plus 30 days, then delete them. Your account profile stays until you delete your account.",
  refundWaiver: "This is a one-time payment. Nothing renews automatically. You can request a refund within 14 days if you have used fewer than 3 credits. See our Refund Policy for details.",

  social: {
    instagram: { url: "https://instagram.com/onepageforge", live: false },
    tiktok: { url: "https://tiktok.com/@onepageforge", live: false },
    x: { url: "https://x.com/onepageforge", live: false },
    youtube: { url: "https://youtube.com/@onepageforge", live: false },
    linkedin: { url: "https://linkedin.com/company/onepageforge", live: false },
  },

  subProcessors: [
    { name: "Cloudflare, Inc.", purpose: "Hosting, CDN, D1 database, Workers AI", location: "USA (global edge network)" },
    { name: "Stripe, Inc.", purpose: "Payment processing", location: "USA" },
  ],

  features: {
    aiGeneration: { name: "AI Website Generation", live: true },
    hostedLink: { name: "Hosted Website Link", live: true },
    designStyles: { name: "Multiple Design Styles", live: true },
    mobileResponsive: { name: "Mobile-Responsive Websites", live: true },
    editRegenerate: { name: "Edit and Regenerate", live: true },
    downloadHtml: { name: "Download as HTML", live: true },
    customDomain: { name: "Custom Domain Connection", live: false },
    analytics: { name: "Analytics Dashboard", live: false },
    formForwarding: { name: "Form Submissions Forwarding", live: false },
    multiPage: { name: "Multi-Page Website Generation", live: false },
  },

  stripeLinks: {
    starter: "",
    pro: "",
    studio: "",
  },
} as const;

export type SocialKey = keyof typeof siteConfig.social;
