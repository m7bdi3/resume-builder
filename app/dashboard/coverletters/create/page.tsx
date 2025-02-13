import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import { CoverLetterEditor } from "@/components/main/coverLetter/CoverLetterEditor";

export const metadata: Metadata = {
  title: "Design your Cover Letter",
};

export default async function CoverLetterEditorPage({
  searchParams,
}: {
  searchParams: Promise<{ coverId: string }>;
}) {
  const { coverId } = await searchParams;
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

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
      <CoverLetterEditor coverLetterToEdit={CoverToEdit} />
    </Suspense>
  );
}
