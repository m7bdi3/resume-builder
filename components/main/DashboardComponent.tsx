import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { PlusCircle, FileText, ClipboardCheck, ScanSearch } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function DashboardComponent() {
  const { userId } = await auth();

  if (!userId) return <div>Not authenticated</div>;

  // Fetch all user data in parallel
  const [resumes, coverLetters, atsResults, gapResults, interviewResults] =
    await Promise.all([
      prisma.resume.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.coverLetter.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.atsResult.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      }),
      prisma.gapResult.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      }),
      prisma.interviewResult.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      }),
    ]);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome Back!</h1>
          <p className="text-muted-foreground">
            You have {resumes.length} resumes, {coverLetters.length} cover
            letters, and{" "}
            {atsResults.length + gapResults.length + interviewResults.length}{" "}
            analyses
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Resume
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Resumes Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Resumes</h2>
            <Button variant="ghost" asChild>
              <Link href="/dashboard/resumes">
                View All
                <span className="ml-1 text-muted-foreground">
                  ({resumes.length})
                </span>
              </Link>
            </Button>
          </div>
          {resumes.slice(0, 3).map((resume) => (
            <Card key={resume.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">
                    {resume.title || "Untitled Resume"}
                  </CardTitle>
                </div>
                <Badge variant="outline">{resume.borderStyle}</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {resume.jobTitle || "No job title"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Updated {format(resume.updatedAt, "MMM dd, yyyy")}
                </p>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/resumes/${resume.id}`}>Edit</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/preview/${resume.id}`}>Preview</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </section>

        {/* Cover Letters Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Cover Letters</h2>
            <Button variant="ghost" asChild>
              <Link href="/dashboard/cover-letters">
                View All
                <span className="ml-1 text-muted-foreground">
                  ({coverLetters.length})
                </span>
              </Link>
            </Button>
          </div>
          {coverLetters.slice(0, 3).map((letter) => (
            <Card key={letter.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center space-x-2">
                  <ClipboardCheck className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">
                    {letter.title || "Untitled Cover Letter"}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {letter.jobDescription || "No job description"}
                </p>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/cover-letters/${letter.id}`}>
                    Edit
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </section>

        {/* Analysis Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Analyses</h2>
          <div className="space-y-4">
            {atsResults.slice(0, 2).map((result) => (
              <Card key={result.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center space-x-2">
                    <ScanSearch className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">ATS Analysis</CardTitle>
                  </div>
                  <Badge variant="secondary">{result.title}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {result.jobDescription || "No job description"}
                  </p>
                </CardContent>
              </Card>
            ))}

            {gapResults.slice(0, 2).map((result) => (
              <Card key={result.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center space-x-2">
                    <ScanSearch className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">Gap Analysis</CardTitle>
                  </div>
                  <Badge variant="secondary">{result.title}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {result.jobDescription || "No job description"}
                  </p>
                </CardContent>
              </Card>
            ))}

            {interviewResults.slice(0, 2).map((result) => (
              <Card key={result.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center space-x-2">
                    <ScanSearch className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">Interview Prep</CardTitle>
                  </div>
                  <Badge variant="secondary">{result.title}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {result.jobDescription || "No job description"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
