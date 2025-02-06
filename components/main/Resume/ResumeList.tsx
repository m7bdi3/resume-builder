import { ResumeItem } from "@/components/main/Resume/ResumeItem";
import { CreateResumeButton } from "@/components/premium/CreateResumeButton";
import prisma from "@/lib/prisma";
import { resumeDataInclude } from "@/lib/types";
import { FilePen } from "lucide-react";

interface ResumeListProps {
  userId: string;
  canCreate: boolean;
}

export async function ResumeList({ userId, canCreate }: ResumeListProps) {
  const resumes = await prisma.resume.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: resumeDataInclude,
  });

  if (resumes.length === 0) {
    <div className="flex flex-col items-center justify-center gap-4 h-[50vh] text-center">
      <FilePen className="h-12 w-12 text-muted-foreground" />
      <div className="space-y-1.5">
        <h3 className="text-lg font-semibold">No resumes found</h3>
        <p className="text-sm text-muted-foreground">
          Get started by creating a new resume
        </p>
      </div>
      <CreateResumeButton canCreate={canCreate} />
    </div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {resumes.map((resume) => (
        <ResumeItem key={resume.id} resume={resume} />
      ))}
    </div>
  );
}
