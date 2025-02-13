import { Suspense } from "react";
import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { BillingHeader } from "@/components/main/billing/BillingHeader";
import { BillingOverview } from "@/components/main/billing/BillingOverview";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const metadata: Metadata = {
  title: "Billing | ResumeAI",
  description: "Manage your subscription and payment details",
};

export default async function BillingPage() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-4xl">
      <BillingHeader />
      <ErrorBoundary fallback={<BillingErrorFallback />}>
        <Suspense fallback={<BillingOverviewSkeleton />}>
          <BillingOverview userId={userId} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

function BillingOverviewSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-10 bg-muted rounded w-1/4"></div>
      <div className="h-40 bg-muted rounded"></div>
    </div>
  );
}

function BillingErrorFallback() {
  return (
    <div className="text-center p-4 bg-destructive/10 rounded-md">
      <h2 className="text-lg font-semibold text-destructive">
        Error loading billing information
      </h2>
      <p className="text-muted-foreground">
        Please try again later or contact support if the problem persists.
      </p>
    </div>
  );
}
