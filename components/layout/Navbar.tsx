"use client";
import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { navLinks } from "@/lib/data";
import { useAuth } from "@/lib/auth";

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const { status } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6">
        <Logo />
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="inline-flex min-h-[44px] items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">{l.label}</Link>
          ))}
        </div>
        <div className="hidden items-center gap-1 md:flex">
          <ThemeToggle />
          {status === "in" ? (
            <>
              <Button asChild variant="ghost" size="sm"><Link href="/account/">Account</Link></Button>
              <Button asChild size="sm"><Link href="/app/">Create a website</Link></Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm"><Link href="/login/">Log in</Link></Button>
              <Button asChild size="sm"><Link href="/app/">Create a website</Link></Button>
            </>
          )}
        </div>
        <div className="flex items-center md:hidden"><ThemeToggle /><button className="-mr-2 flex h-11 w-11 items-center justify-center" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button></div>
      </nav>
      {open && (
        <div className="border-t border-border/40 bg-background px-5 pb-6 pt-4 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="flex min-h-[44px] items-center text-base font-medium" onClick={() => setOpen(false)}>{l.label}</Link>
            ))}
            <hr className="border-border/40" />
            {status === "in" ? (
              <>
                <Link href="/account/" className="text-base font-medium" onClick={() => setOpen(false)}>Account</Link>
                <Button asChild size="lg" className="w-full"><Link href="/app/" onClick={() => setOpen(false)}>Create a website</Link></Button>
              </>
            ) : (
              <>
                <Link href="/login/" className="text-base font-medium" onClick={() => setOpen(false)}>Log in</Link>
                <Button asChild size="lg" className="w-full"><Link href="/app/" onClick={() => setOpen(false)}>Create a website</Link></Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
