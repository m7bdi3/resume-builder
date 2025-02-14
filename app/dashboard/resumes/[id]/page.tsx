import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { resumeDataInclude } from "@/lib/types";
import { Suspense } from "react";
import { ResumeSettings } from "@/components/main/Resume/ResumeSettings";

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

  return (
    <Suspense>
      <ResumeSettings resume={resume} />
    </Suspense>
  );
}
