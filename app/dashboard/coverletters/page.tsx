import { Suspense } from "react";
import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { TableSkeleton } from "@/components/LoadingSkeleton";
import { ItemList } from "@/components/main/ItemList";

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
        <ItemList type="letter" />
      </Suspense>
    </main>
  );
}
