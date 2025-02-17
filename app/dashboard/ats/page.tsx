import { Suspense } from "react";
import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { Card } from "@/components/ui/card";
import { AtsList } from "@/components/main/ats/AtsList";
import { InitAtsStore } from "@/hooks/store/storeProvider";

export const metadata: Metadata = {
  title: "Your Ats | ResumeAI",
  description: "Manage and create your AI-powered ats ",
};

export default async function AtsPage() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  return (
    <main className="relative size-full">
      <InitAtsStore />
      <Suspense fallback={<ResumeListSkeleton />}>
        <AtsList />
      </Suspense>
    </main>
  );
}

function ResumeListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="h-[400px] animate-pulse bg-muted" />
      ))}
    </div>
  );
}
