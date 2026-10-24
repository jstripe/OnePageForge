"use client";
import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={"flex min-h-[44px] items-center gap-2 " + className}>
      <svg width="32" height="32" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden className="drop-shadow-[0_4px_10px_hsl(var(--primary)/0.45)]">
        <defs><linearGradient id="sf-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#60A5FA" /><stop offset="1" stopColor="#2563EB" /></linearGradient></defs>
        <rect width="64" height="64" rx="14" fill="url(#sf-g)" />
        <rect x="15.4" y="16.6" width="30.7" height="33.3" rx="3.8" fill="#fff" />
        <rect x="19.8" y="24.3" width="23" height="2.9" rx="1.4" fill="#2563EB" />
        <rect x="19.8" y="32" width="19.2" height="2.9" rx="1.4" fill="#2563EB" />
        <rect x="19.8" y="39.7" width="14" height="2.9" rx="1.4" fill="#2563EB" />
        <path d="M46 5.8l2.6 6.4 6.4 2.6-6.4 2.6L46 23.8l-2.6-6.4-6.4-2.6 6.4-2.6z" fill="#FEF08A" stroke="#2563EB" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
      <span className="font-heading text-xl font-bold tracking-tight">OnePageForge</span>
    </Link>
  );
}
