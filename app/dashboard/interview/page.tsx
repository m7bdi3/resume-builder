import { Suspense } from "react";
import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { TableSkeleton } from "@/components/LoadingSkeleton";
import { ItemList } from "@/components/main/ItemList";

export const metadata: Metadata = {
  title: "Your Interview Q&A | ResumeAI",
  description: "Manage and create your AI-powered resumes",
};

export default async function InterviewPage() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  return (
    <main className="relative size-full">
      <Suspense fallback={<TableSkeleton />}>
        <ItemList type="interview" />
      </Suspense>
    </main>
  );
}
