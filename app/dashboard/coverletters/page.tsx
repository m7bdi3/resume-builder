import { Suspense } from "react";
import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { Card } from "@/components/ui/card";
import { CoverLetterList } from "@/components/main/coverLetter/CoverLetterList";

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
      <Suspense fallback={<ResumeListSkeleton />}>
        <CoverLetterList />
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
