import { Suspense } from "react";
import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { AtsList } from "@/components/main/ats/AtsList";
import { TableSkeleton } from "@/components/LoadingSkeleton";

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
      <Suspense fallback={<TableSkeleton />}>
        <AtsList />
      </Suspense>
    </main>
  );
}
