import { Suspense } from "react";
import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { CoverLetterList } from "@/components/main/coverLetter/CoverLetterList";
import { TableSkeleton } from "@/components/LoadingSkeleton";

export const metadata: Metadata = {
  title: "Your Cover Letters | D3",
  description: "Manage and create your AI-powered resumes",
};

export default async function CoverLetterPage() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  return (
    <main className="relative w-full max-w-7xl mx-auto p-4 space-y-6">
      <Suspense fallback={<TableSkeleton />}>
        <CoverLetterList />
      </Suspense>
    </main>
  );
}
