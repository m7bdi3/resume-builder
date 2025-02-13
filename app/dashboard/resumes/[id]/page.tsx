import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { resumeDataInclude } from "@/lib/types";
import { Suspense } from "react";
import { ResumeSettings } from "@/components/main/Resume/ResumeSettings";
import { getResumesCount } from "../page";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import { canCreateResume } from "@/lib/permissions";

export const metdata: Metadata = {
  title: "your resume",
};

interface Props {
  params: Promise<{ id?: string }>;
}

export default async function ResumePage({ params }: Props) {
  const { id } = await params;

  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const resume = id
    ? await prisma.resume.findUnique({
        where: {
          id,
          userId,
        },
        include: resumeDataInclude,
      })
    : null;

  const [totalCount, subLevel] = await Promise.all([
    getResumesCount(userId),
    getUserSubscriptionLevel(userId),
  ]);

  const canCreate = canCreateResume(subLevel, totalCount);

  return (
    <Suspense>
      <ResumeSettings resume={resume} canCreate={canCreate} />
    </Suspense>
  );
}
