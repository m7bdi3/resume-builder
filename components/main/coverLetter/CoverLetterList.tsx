import prisma from "@/lib/prisma";

import { FilePen } from "lucide-react";
import { CoverLetterItem } from "@/components/main/coverLetter/CoverLettertem";
import { CreateResumeButton } from "@/components/premium/CreateResumeButton";

interface ResumeListProps {
  userId: string;
  canCreate: boolean;
}

export async function CoverLetterList({ userId, canCreate }: ResumeListProps) {
  const coverLetters = await prisma.coverLetter.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });

  if (coverLetters.length === 0) {
    <div className="flex flex-col items-center justify-center gap-4 h-[50vh] text-center">
      <FilePen className="h-12 w-12 text-muted-foreground" />
      <div className="space-y-1.5">
        <h3 className="text-lg font-semibold">No Cover Letters found</h3>
        <p className="text-sm text-muted-foreground">
          Get started by creating a new Cover Letter
        </p>
      </div>
      <CreateResumeButton canCreate={canCreate} />
    </div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {coverLetters.map((cover) => (
        <CoverLetterItem key={cover.id} coverLetter={cover} />
      ))}
    </div>
  );
}
