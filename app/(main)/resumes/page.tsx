import { ResumeItem } from "@/components/main/Resume/ResumeItem";
import { CreateResumeButton } from "@/components/premium/CreateResumeButton";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { canCreateResume } from "@/lib/permissions";
import prisma from "@/lib/prisma";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import { resumeDataInclude } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import { PackageOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Your Resumes",
};

export default async function ResumesPage() {
  const { userId } = await auth();

  if (!userId) return null;

  const [resumes, totalCount, subLevel] = await Promise.all([
    prisma.resume.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: resumeDataInclude,
    }),
    prisma.resume.count({ where: { userId } }),
    getUserSubscriptionLevel(userId),
  ]);

  return (
    <main className="container mx-auto p-4 space-y-6 max-w-7xl">
      <Card className="bg-card/50">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-3">
              <CardTitle className="text-2xl font-bold">My Resumes</CardTitle>
              <Badge variant="secondary" className="text-sm">
                {subLevel} Tier
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {totalCount} {totalCount === 1 ? "document" : "documents"} stored
            </p>
          </div>
          <CreateResumeButton
            canCreate={canCreateResume(subLevel, totalCount)}
          />
        </CardHeader>
      </Card>

      <Separator className="bg-border/50" />

      {resumes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resumes.map((resume) => (
            <ResumeItem key={resume.id} resume={resume} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 h-[50vh] text-center">
          <PackageOpen className="h-12 w-12 text-muted-foreground" />
          <div className="space-y-1.5">
            <h3 className="text-lg font-semibold">No resumes found</h3>
            <p className="text-sm text-muted-foreground">
              Get started by creating a new resume
            </p>
          </div>
          <CreateResumeButton
            canCreate={canCreateResume(subLevel, totalCount)}
          />
        </div>
      )}
    </main>
  );
}
