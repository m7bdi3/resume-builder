"use server";

import { auth } from "@clerk/nextjs/server";
import {
  CoverLetterValues,
  coverLetterSchema,
  resumeSchema,
  ResumeValues,
} from "@/lib/validation";
import prisma from "@/lib/prisma";
import { del, put } from "@vercel/blob";
import path from "path";
import { revalidatePath } from "next/cache";
import { resumeDataInclude } from "@/lib/types";

export const saveResume = async (values: ResumeValues) => {
  const { id } = values;

  const {
    img,
    workExperience,
    educations,
    jobDescription,
    projects,
    certifications,
    ...resumevalues
  } = resumeSchema.parse(values);

  const { userId } = await auth();

  if (!userId) {
    throw new Error("user not authenticated.");
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

  const getFullResume = async (resumeId: string) => {
    return await prisma.resume.findUnique({
      where: { id: resumeId },
      include: resumeDataInclude,
    });
  };

  if (!getFullResume) {
    throw new Error("Resume not found");
  }

  if (id) {
    await prisma.resume.update({
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
        projects: {
          deleteMany: {},
          create: projects?.map((pro) => ({
            ...pro,
            startDate: pro.startDate ? new Date(pro.startDate) : undefined,
            endDate: pro.endDate ? new Date(pro.endDate) : undefined,
          })),
        },
        certifications: {
          deleteMany: {},
          create: certifications?.map((cert) => ({
            ...cert,
            dateObtained: cert.dateObtained
              ? new Date(cert.dateObtained)
              : undefined,
          })),
        },
        references: {
          deleteMany: {},
          create: resumevalues.references?.map((ref) => ({
            ...ref,
          })),
        },
        updatedAt: new Date(),
      },
    });
    return await getFullResume(id);
  } else {
    const newResume = await prisma.resume.create({
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
        projects: {
          create: projects?.map((pro) => ({
            ...pro,
            title: pro.title || "",

            startDate: pro.startDate ? new Date(pro.startDate) : undefined,
            endDate: pro.endDate ? new Date(pro.endDate) : undefined,
          })),
        },
        certifications: {
          create: certifications?.map((cert) => ({
            ...cert,
            name: cert.name ?? "",
            dateObtained: cert.dateObtained
              ? new Date(cert.dateObtained)
              : undefined,
          })),
        },
        references: {
          create: resumevalues.references?.map((ref) => ({
            ...ref,
            name: ref.name ?? "",
          })),
        },
        updatedAt: new Date(),
      },
    });
    return await getFullResume(newResume.id);
  }
};

export const saveCover = async (values: CoverLetterValues) => {
  const { id } = values;

  const coverValues = coverLetterSchema.parse(values);

  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated.");
  }

  const existingCover = id
    ? await prisma.coverLetter.findUnique({
        where: {
          id,
          userId,
        },
      })
    : null;

  if (id && !existingCover) {
    throw new Error("Cover Letter not found");
  }

  if (id) {
    return prisma.coverLetter.update({
      where: {
        id,
        userId,
      },
      data: {
        ...coverValues,
        updatedAt: new Date(),
      },
    });
  } else {
    return prisma.coverLetter.create({
      data: {
        ...coverValues,
        userId,
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

export async function DeleteCover(id: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const cover = await prisma.coverLetter.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!cover) {
    throw new Error("Cover Letter not found");
  }

  await prisma.coverLetter.delete({
    where: { id },
  });

  revalidatePath("/coverletter");
}

export async function DeleteCoverLetter(id: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const coverLetter = await prisma.coverLetter.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!coverLetter) {
    throw new Error("Cover Letter not found");
  }

  await prisma.coverLetter.delete({
    where: { id },
  });

  revalidatePath("/coverletter");
}
