import { Suspense } from "react";
import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { GapList } from "@/components/main/gap/GapList";
import { TableSkeleton } from "@/components/LoadingSkeleton";

export const metadata: Metadata = {
  title: "Your Gaps | ResumeAI",
  description: "Manage and create your AI-powered gaps ",
};

export default async function AtsPage() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  return (
    <main className="relative size-full">
      <Suspense fallback={<TableSkeleton />}>
        <GapList />
      </Suspense>
    </main>
  );
}
