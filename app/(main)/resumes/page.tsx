import { Suspense } from "react";
import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { Card } from "@/components/ui/card";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import { canCreateResume } from "@/lib/permissions";
import prisma from "@/lib/prisma";
import { Header } from "@/components/main/Resume/ResumeHeader";
import { ResumeList } from "@/components/main/Resume/ResumeList";

export const metadata: Metadata = {
  title: "Your Resumes | ResumeAI",
  description: "Manage and create your AI-powered resumes",
};

export async function getResumesCount(userId: string): Promise<number> {
  return prisma.resume.count({ where: { userId } });
}

export default async function ResumesPage() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const [totalCount, subLevel] = await Promise.all([
    getResumesCount(userId),
    getUserSubscriptionLevel(userId),
  ]);

  const canCreate = canCreateResume(subLevel, totalCount);

  return (
    <main className="relative overflow-hidden w-full min-h-screen pb-16">
      <div className="max-w-7xl mx-auto p-4 space-y-6 relative">
        <Header
          totalCount={totalCount}
          subLevel={subLevel}
          canCreate={canCreate}
          title="My Resumes"
        />
        <Suspense fallback={<ResumeListSkeleton />}>
          <ResumeList userId={userId} canCreate={canCreate} />
        </Suspense>
      </div>
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
