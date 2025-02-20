import { Suspense } from "react";
import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { DashboardSkeleton } from "@/components/main/dashboard/DashboardSkeleton";
import { DashboardComponent } from "@/components/main/dashboard/DashboardComponent";

export const metadata: Metadata = {
  title: "Your Dashboard | ResumeAI",
  description: "Manage and create your AI-powered resumes",
};

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  return (
    <main className="relative size-full">
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardComponent />
      </Suspense>
    </main>
  );
}
