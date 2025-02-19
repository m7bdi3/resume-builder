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

export async function getAllAts() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("user not authenticated.");
  }

  try {
    return withRetry(async () => {
      const ats = await prisma.atsResult.findMany({
        where: { userId },
        orderBy: {
          updatedAt: "desc",
        },
      });
      return ats;
    });
  } catch (error) {
    console.error("Error fetching ats:", error);
    throw new Error("Failed to retrieve ats. Please try again later.");
  }
}

export async function getAllGaps() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("user not authenticated.");
  }

  try {
    return withRetry(async () => {
      const gap = await prisma.gapResult.findMany({
        where: { userId },
        orderBy: {
          updatedAt: "desc",
        },
      });
      return gap;
    });
  } catch (error) {
    console.error("Error fetching gaps:", error);
    throw new Error("Failed to retrieve gaps. Please try again later.");
  }
}

export async function getAllInterview() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("user not authenticated.");
  }

  try {
    return withRetry(async () => {
      const interviews = await prisma.interviewResult.findMany({
        where: { userId },
        orderBy: {
          updatedAt: "desc",
        },
      });
      return interviews;
    });
  } catch (error) {
    console.error("Error fetching interviews:", error);
    throw new Error("Failed to retrieve interviews. Please try again later.");
  }
}

export async function DeleteAts(id: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("user not authenticated.");
  }
  const ats = withRetry(async () => {
    return await prisma.atsResult.findUnique({
      where: {
        userId,
        id,
      },
    });
  });

  if (!ats) {
    throw new Error("No ats found for the given ID and user.");
  }

  try {
    return withRetry(async () => {
      const deletedAts = await prisma.atsResult.delete({
        where: { userId, id },
      });
      return deletedAts;
    });
  } catch (error) {
    console.error("Error deleting ats:", error);
    throw new Error("Failed to delete ats. Please try again later.");
  }
}

export async function DeleteGap(id: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("user not authenticated.");
  }
  const ats = withRetry(async () => {
    return await prisma.gapResult.findUnique({
      where: {
        userId,
        id,
      },
    });
  });

  if (!ats) {
    throw new Error("No ats found for the given ID and user.");
  }

  try {
    return withRetry(async () => {
      const deletedGap = await prisma.gapResult.delete({
        where: { userId, id },
      });
      return deletedGap;
    });
  } catch (error) {
    console.error("Error deleting gap:", error);
    throw new Error("Failed to delete gap. Please try again later.");
  }
}

export async function DeleteInterview(id: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("user not authenticated.");
  }
  const interview = withRetry(async () => {
    return await prisma.interviewResult.findUnique({
      where: {
        userId,
        id,
      },
    });
  });

  if (!interview) {
    throw new Error("No interview found for the given ID and user.");
  }

  try {
    return withRetry(async () => {
      const deletedinterview = await prisma.interviewResult.delete({
        where: { userId, id },
      });
      return deletedinterview;
    });
  } catch (error) {
    console.error("Error deleting interview:", error);
    throw new Error("Failed to delete interview. Please try again later.");
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

export async function getAllData() {
  const [resumes, covers, ats, gaps, interviews] = await Promise.all([
    getAllResumes(),
    getAllCovers(),
    getAllAts(),
    getAllGaps(),
    getAllInterview(),
  ]);
  return { resumes, covers, ats, gaps, interviews };
}
