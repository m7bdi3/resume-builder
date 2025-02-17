import { Suspense } from "react";
import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { ResumeList } from "@/components/main/Resume/ResumeList";
import { TableSkeleton } from "@/components/LoadingSkeleton";

export const metadata: Metadata = {
  title: "Your Resumes | ResumeAI",
  description: "Manage and create your AI-powered resumes",
};

export default async function ResumesPage() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  return (
    <main className="relative size-full">
      <Suspense fallback={<TableSkeleton />}>
        <ResumeList />
      </Suspense>
    </main>
  );
}
