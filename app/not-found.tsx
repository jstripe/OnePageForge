import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-5 text-center">
      <p className="font-heading text-8xl font-bold text-primary">404</p>
      <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Page not found</h1>
      <p className="mt-3 text-lg text-muted-foreground">The page you are looking for does not exist or has been moved.</p>
      <Button asChild size="lg" className="mt-8"><Link href="/">Back to home</Link></Button>
    </div>
  );
}
