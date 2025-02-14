"use server";

import prisma from "@/lib/prisma";
import { resumeDataInclude } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";

export async function getAllResumes() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("user not authenticated.");
  }

  try {
    const resumes = await prisma.resume.findMany({
      where: { userId },
      include: resumeDataInclude,
      orderBy: {
        updatedAt: "desc",
      },
    });
    return resumes;
  } catch (error) {
    console.error("Error fetching resumes:", error);
    throw new Error("Failed to retrieve resumes. Please try again later.");
  }
}

export async function deleteResume(id: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("user not authenticated.");
  }

  const resume = await prisma.resume.findUnique({
    where: {
      userId,
      id,
    },
  });
  if (!resume) {
    throw new Error("No resume found for the given ID and user.");
  }

  try {
    const deletedResume = await prisma.resume.delete({
      where: { userId, id },
    });
    return deletedResume;
  } catch (error) {
    console.error("Error deleting resume:", error);
    throw new Error("Failed to delete resume. Please try again later.");
  }
}
