import { Suspense } from "react";
import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { Card } from "@/components/ui/card";
import { InitInterviewStore } from "@/hooks/store/storeProvider";
import { InterviewList } from "@/components/main/interview/InterviewList";

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
      <InitInterviewStore />
      <Suspense fallback={<ResumeListSkeleton />}>
        <InterviewList />
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
