"use server";

import prisma from "@/lib/prisma";
import { resumeDataInclude } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  let attempts = 0;

  while (attempts < MAX_RETRIES) {
    try {
      return await fn();
    } catch (error) {
      if (attempts === MAX_RETRIES - 1) throw error;
      await new Promise((resolve) =>
        setTimeout(resolve, RETRY_DELAY * (attempts + 1))
      );
      attempts++;
    }
  }
  throw new Error("Max retries reached");
}

export async function getAllResumes() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("user not authenticated.");
  }

  try {
    return withRetry(async () => {
      const resumes = await prisma.resume.findMany({
        where: { userId },
        include: resumeDataInclude,
        orderBy: {
          updatedAt: "desc",
        },
      });
      return resumes;
    });
  } catch (error) {
    console.error("Error fetching resumes:", error);
    throw new Error("Failed to retrieve resumes. Please try again later.");
  }
}

export async function getAllCovers() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("user not authenticated.");
  }

  try {
    return withRetry(async () => {
      const covers = await prisma.coverLetter.findMany({
        where: { userId },
        orderBy: {
          updatedAt: "desc",
        },
      });
      return covers;
    });
  } catch (error) {
    console.error("Error fetching covers:", error);
    throw new Error("Failed to retrieve covers. Please try again later.");
  }
}

export async function deleteResume(id: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("user not authenticated.");
  }
  const resume = withRetry(async () => {
    return await prisma.resume.findUnique({
      where: {
        userId,
        id,
      },
    });
  });

  if (!resume) {
    throw new Error("No resume found for the given ID and user.");
  }

  try {
    return withRetry(async () => {
      const deletedResume = await prisma.resume.delete({
        where: { userId, id },
      });
      return deletedResume;
    });
  } catch (error) {
    console.error("Error deleting resume:", error);
    throw new Error("Failed to delete resume. Please try again later.");
  }
}

export async function getResumesCount(userId: string): Promise<number> {
  return withRetry(async () => {
    return prisma.resume.count({ where: { userId } });
  });
}
