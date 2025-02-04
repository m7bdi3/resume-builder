"use server";

import { auth } from "@clerk/nextjs/server";
import { resumeSchema, ResumeValues } from "@/lib/validation";
import prisma from "@/lib/prisma";
import { del, put } from "@vercel/blob";
import path from "path";
import { revalidatePath } from "next/cache";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import { canCreateResume, canUseCustom } from "@/lib/permissions";

export const saveResume = async (values: ResumeValues) => {
  const { id } = values;

  const { img, workExperience, educations, ...resumevalues } =
    resumeSchema.parse(values);

  const { userId } = await auth();

  if (!userId) {
    throw new Error("user not authenticated.");
  }

  const subLevel = await getUserSubscriptionLevel(userId);

  if (id === undefined) {
    const resumeCount = await prisma.resume.count({ where: { userId } });

    if (!canCreateResume(subLevel, resumeCount)) {
      throw new Error("User has reached the limit of resumes they can create.");
    }
  }

  const existingResume = id
    ? await prisma.resume.findUnique({
        where: {
          id,
          userId,
        },
      })
    : null;

  if (id && !existingResume) {
    throw new Error("Resume not found");
  }

  const hasCustom =
    (resumevalues.borderStyle &&
      resumevalues.borderStyle !== existingResume?.borderStyle) ||
    (resumevalues.colorHex &&
      resumevalues.colorHex !== existingResume?.colorHex);

  if (hasCustom && !canUseCustom(subLevel)) {
    throw new Error("User does not have permission to use custom styles.");
  }
  let newImgUrl: string | undefined | null = undefined;

  if (img instanceof File) {
    if (existingResume?.imgUrl) {
      await del(existingResume.imgUrl);
    }

    const blob = await put(`resume_img/${path.extname(img.name)}`, img, {
      access: "public",
    });
    newImgUrl = blob.url;
  } else if (img === null) {
    if (existingResume?.imgUrl) {
      await del(existingResume.imgUrl);
    }
    newImgUrl = null;
  }

  if (id) {
    return prisma.resume.update({
      where: {
        id,
      },
      data: {
        ...resumevalues,
        imgUrl: newImgUrl,
        workExperiences: {
          deleteMany: {},
          create: workExperience?.map((exp) => ({
            ...exp,
            startDate: exp.startDate ? new Date(exp.startDate) : undefined,
            endDate: exp.endDate ? new Date(exp.endDate) : undefined,
          })),
        },
        educations: {
          deleteMany: {},
          create: educations?.map((edu) => ({
            ...edu,
            startDate: edu.startDate ? new Date(edu.startDate) : undefined,
            endDate: edu.endDate ? new Date(edu.endDate) : undefined,
          })),
        },
        updatedAt: new Date(),
      },
    });
  } else {
    return prisma.resume.create({
      data: {
        ...resumevalues,
        userId,
        imgUrl: newImgUrl,
        workExperiences: {
          create: workExperience?.map((exp) => ({
            ...exp,
            startDate: exp.startDate ? new Date(exp.startDate) : undefined,
            endDate: exp.endDate ? new Date(exp.endDate) : undefined,
          })),
        },
        educations: {
          create: educations?.map((edu) => ({
            ...edu,
            startDate: edu.startDate ? new Date(edu.startDate) : undefined,
            endDate: edu.endDate ? new Date(edu.endDate) : undefined,
          })),
        },
        updatedAt: new Date(),
      },
    });
  }
};

export async function DeleteResume(id: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const resume = await prisma.resume.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!resume) {
    throw new Error("Resume not found");
  }

  if (resume.imgUrl) {
    await del(resume.imgUrl);
  }

  await prisma.resume.delete({
    where: { id },
  });

  revalidatePath("/resumes");
}
