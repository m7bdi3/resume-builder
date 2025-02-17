import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { resumeDataInclude } from "@/lib/types";
import { Suspense } from "react";

import { ResumeEditor } from "@/components/main/Resume/ResumeEditor";
export const metadata: Metadata = {
  title: "Design your resume",
};

interface Props {
  searchParams: Promise<{ resumeId?: string }>;
}

export default async function EditorPage({ searchParams }: Props) {
  const { resumeId } = await searchParams;

  const { userId } = await auth();

  if (!userId) {
    return null;
  }
  const resumeToEdit = resumeId
    ? await prisma.resume.findUnique({
        where: {
          id: resumeId,
          userId,
        },
        include: resumeDataInclude,
      })
    : null;

  return (
    <Suspense fallback>
      <ResumeEditor resumeToEdit={resumeToEdit} />
    </Suspense>
  );
}
