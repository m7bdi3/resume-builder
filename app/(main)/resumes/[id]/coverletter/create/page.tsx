import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import { CoverLetterEditor } from "@/components/main/coverLetter/CoverLetterEditor";
import { resumeDataInclude } from "@/lib/types";

export const metadata: Metadata = {
  title: "Design your Cover Letter",
};

export default async function CoverLetterEditorPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ coverId: string }>;
}) {
  const { id } = await params;
  const { coverId } = await searchParams;
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const resume = await prisma.resume.findUnique({
    where: {
      id,
      userId,
    },
    include: resumeDataInclude,
  });

  const CoverToEdit = coverId
    ? await prisma.coverLetter.findUnique({
        where: {
          id: coverId,
          userId,
        },
      })
    : null;

  return (
    <Suspense fallback>
      <CoverLetterEditor coverLetterToEdit={CoverToEdit} resume={resume} />
    </Suspense>
  );
}
