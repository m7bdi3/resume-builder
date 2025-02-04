import { ResumeItem } from "@/components/main/Resume/ResumeItem";
import { CreateResumeButton } from "@/components/premium/CreateResumeButton";
import prisma from "@/lib/prisma";
import { resumeDataInclude } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Resume",
};

export default async function ResumesPage() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const [resumes, totalCount] = await Promise.all([
    prisma.resume.findMany({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: resumeDataInclude,
    }),

    prisma.resume.count({
      where: { userId },
    }),
  ]);

  //TODO : CHECK QUOTA FOR NON PREMIUM

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-3 py-6">
      <CreateResumeButton canCreate={totalCount < 1} />
      <div className="space-y-1 ">
        <h1 className="text-3xl font-bold ">Your Resumes</h1>
        <p>Total: {totalCount}</p>
      </div>
      <div className="flex flex-col sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 w-full gap-3">
        {resumes.map((resume) => (
          <ResumeItem key={resume.id} resume={resume} />
        ))}
      </div>
    </main>
  );
}
