"use client";
import * as React from "react";
import { SuccessView } from "@/components/pages/SuccessView";

export default function SuccessPage() {
  return (
    <div className="px-5 py-16 sm:px-6 sm:py-20">
      <React.Suspense fallback={<div className="min-h-[360px]" />}>
        <SuccessView />
      </React.Suspense>
    </div>
  );
}
