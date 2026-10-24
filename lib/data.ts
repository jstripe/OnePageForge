import { siteConfig } from "./site-config";
import type { PlanId } from "./api-types";
import { PLAN_CATALOG } from "./api-types";

export interface Plan {
  id: PlanId;
  name: string;
  blurb: string;
  price: number;
  period: string;
  credits: number;
  features: string[];
  popular?: boolean;
}

export const plans: Plan[] = [
  {
    id: "starter",
    name: PLAN_CATALOG.starter.name,
    blurb: "Perfect for trying out your first AI-generated website.",
    price: 14,
    period: "1 month",
    credits: 5,
    features: [
      "5 website generations",
      "Hosted for 1 month",
      "3 design styles",
      "Mobile-responsive output",
      "Download as HTML",
    ],
  },
  {
    id: "pro",
    name: PLAN_CATALOG.pro.name,
    blurb: "For freelancers and small businesses who need more options.",
    price: 39,
    period: "3 months",
    credits: 20,
    popular: true,
    features: [
      "20 website generations",
      "Hosted for 3 months",
      "3 design styles",
      "Mobile-responsive output",
      "Edit and regenerate",
      "Download as HTML",
    ],
  },
  {
    id: "studio",
    name: PLAN_CATALOG.studio.name,
    blurb: "For agencies and consultants managing multiple clients.",
    price: 99,
    period: "12 months",
    credits: 60,
    features: [
      "60 website generations",
      "Hosted for 12 months",
      "3 design styles",
      "Mobile-responsive output",
      "Edit and regenerate",
      "Download as HTML",
    ],
  },
];

export const features = [
  {
    title: "Describe, Generate, Done",
    description: "Type a short description of your business. The AI builds a complete one-page website with a hero, services, about and contact sections.",
    icon: "Sparkles" as const,
  },
  {
    title: "Hosted and Shareable",
    description: "Every generated website gets a live hosted link you can share with clients, customers or on social media right away.",
    icon: "Globe" as const,
  },
  {
    title: "Mobile-Ready by Default",
    description: "Generated websites look great on phones, tablets and desktops. No extra work needed.",
    icon: "Smartphone" as const,
  },
  {
    title: "Multiple Design Styles",
    description: "Choose from modern, classic or bold styles to match your brand. Each one is designed for a different type of business.",
    icon: "Palette" as const,
  },
  {
    title: "Edit and Regenerate",
    description: "Not happy with the result? Adjust your description and regenerate. Each generation uses one credit.",
    icon: "RefreshCw" as const,
  },
  {
    title: "Download Your Website",
    description: "Download the generated HTML file and host it anywhere you want, or keep using our hosted link.",
    icon: "Download" as const,
  },
];

export const steps = [
  {
    number: 1,
    title: "Describe your business",
    description: "Enter your business name, what you do, and any style preferences. A few sentences is enough.",
  },
  {
    number: 2,
    title: "AI generates your website",
    description: "Our AI creates a complete one-page website with all the sections a business needs: hero, services, about and contact.",
  },
  {
    number: 3,
    title: "Share your live link",
    description: "Your website is hosted as soon as it is generated. Copy the link and share it with anyone. Edit and regenerate any time.",
  },
];

export const faqs = [
  {
    question: "What do I need to get started?",
    answer: "Just a short description of your business. Enter what your business does, who it serves and any style preferences. The AI handles the rest.",
  },
  {
    question: "What is a credit?",
    answer: `${siteConfig.creditDefinition}. Each time you generate or regenerate a website, one credit is used. Credits do not carry over after your access period ends.`,
  },
  {
    question: "Does the plan renew automatically?",
    answer: "No. All plans are one-time payments. When your access period ends, your hosted websites go offline and remaining credits expire. You can buy another plan at any time.",
  },
  {
    question: "What happens when my credits run out?",
    answer: "You can no longer generate new websites, but your existing hosted websites stay online until your access period ends. Buy another plan to get more credits. Credits from multiple purchases add up, and access days extend.",
  },
  {
    question: "Can I use my own domain?",
    answer: "Custom domain connection is on our roadmap and not available yet. For now, each website gets a hosted link you can share.",
  },
  {
    question: "What does a generated website include?",
    answer: "A complete one-page website with a hero section, services or features, an about section, a contact section and a footer. The content is based on your description.",
  },
  {
    question: "Is my data private?",
    answer: "Yes. We do not use your business descriptions or generated websites to train our own models. Your data is stored securely on Cloudflare infrastructure, and generated websites are deleted 30 days after your access period ends. See our Privacy Policy for details.",
  },
  {
    question: "Can I get a refund?",
    answer: `You can request a refund within ${siteConfig.refundWindow} of your purchase if you have used fewer than ${siteConfig.refundThreshold}. See our Refund Policy for the full terms.`,
  },
];

export const audiences = [
  { label: "Restaurants", icon: "UtensilsCrossed" as const },
  { label: "Freelancers", icon: "Briefcase" as const },
  { label: "Salons", icon: "Scissors" as const },
  { label: "Consultants", icon: "Users" as const },
  { label: "Coaches", icon: "GraduationCap" as const },
  { label: "Local Shops", icon: "Store" as const },
];

export const navLinks = [
  { label: "Features", href: "/features/" },
  { label: "Pricing", href: "/pricing/" },
  { label: "FAQ", href: "/#faq" },
];

export const footerLinks = {
  product: [
    { label: "Features", href: "/features/" },
    { label: "Pricing", href: "/pricing/" },
  ],
  company: [
    { label: "About", href: "/about/" },
    { label: "Careers", href: "/careers/" },
    { label: "Contact", href: "/contact/" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy/" },
    { label: "Terms of Service", href: "/terms/" },
    { label: "Security", href: "/security/" },
    { label: "Cookie Policy", href: "/cookies/" },
    { label: "Refund Policy", href: "/refund/" },
  ],
};

export const marqueeRowA = [
  "A restaurant menu and opening hours page",
  "A salon price list with a booking phone number",
  "A freelancer portfolio landing page",
  "A consultant services overview",
  "A local plumber contact page",
  "A photographer introduction page",
  "A coach programme and contact page",
  "A bakery page with products and location",
];

export const marqueeRowB = [
  "Restaurants",
  "Hair and beauty salons",
  "Freelancers",
  "Consultants",
  "Personal trainers",
  "Local shops",
  "Tutors and coaches",
  "Small service businesses",
  "Event pages",
];
