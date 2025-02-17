"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

import { useResumeStore } from "@/hooks/store/useResumeStore";
import { useCoverStore } from "@/hooks/store/useCoverStore";
import { useAtsStore } from "@/hooks/store/useAtsStore";
import { useGapStore } from "@/hooks/store/useGapStore";
import { useInterviewStore } from "@/hooks/store/useInterviewStore";
import { useUser } from "@clerk/nextjs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PlusCircle,
  FileText,
  ClipboardCheck,
  ScanSearch,
  ChevronRight,
} from "lucide-react";
import { CoverLetterServerData, ResumeServerData } from "@/lib/types";
import { DashboardSkeleton } from "./DashboardSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function DashboardComponent() {
  const { user } = useUser();

  const userName = user?.firstName;

  const { resumes, isLoading: resumeLoading } = useResumeStore();
  const { covers, isLoading: coverLoading } = useCoverStore();
  const { ats: atsResults, isLoading: atsLoading } = useAtsStore();
  const { gaps, isLoading: gapLoading } = useGapStore();
  const { interviews, isLoading: interviewLoading } = useInterviewStore();

  const totalAnalyses = atsResults.length + gaps.length + interviews.length;

  const isLoading =
    resumeLoading ||
    coverLoading ||
    atsLoading ||
    gapLoading ||
    interviewLoading;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="h-full">
      <div className="container mx-auto p-6 space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <Avatar>
              <AvatarImage src={user?.imageUrl} alt={userName || "D3"} />
              <AvatarFallback>
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h1 className="text-3xl font-bold">Welcome back, {userName}!</h1>
            <p className="text-muted-foreground mt-1">
              Here&apos;s an overview of your career documents and analyses.
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/resumes/editor">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Resume
            </Link>
          </Button>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          <StatsCard
            title="Resumes"
            count={resumes.length}
            icon={<FileText className="h-4 w-4" />}
          />
          <StatsCard
            title="Cover Letters"
            count={covers.length}
            icon={<ClipboardCheck className="h-4 w-4" />}
          />
          <StatsCard
            title="Analyses"
            count={totalAnalyses}
            icon={<ScanSearch className="h-4 w-4" />}
          />
        </div>

        <Tabs defaultValue="resumes" className="space-y-4">
          <TabsList>
            <TabsTrigger value="resumes">Resumes</TabsTrigger>
            <TabsTrigger value="coverletters">Cover Letters</TabsTrigger>
            <TabsTrigger value="analyses">Analyses</TabsTrigger>
          </TabsList>

          <TabsContent value="resumes" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Recent Resumes</h2>
              <Button variant="ghost" asChild>
                <Link href="/dashboard/resumes">
                  View All <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {resumes.slice(0, 3).map((resume) => (
                <ResumeCard key={resume.id} resume={resume} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="coverletters" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Recent Cover Letters</h2>
              <Button variant="ghost" asChild>
                <Link href="/dashboard/coverletters">
                  View All <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {covers.slice(0, 3).map((letter) => (
                <CoverLetterCard key={letter.id} letter={letter} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analyses" className="space-y-4">
            <h2 className="text-2xl font-semibold">Recent Analyses</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...atsResults, ...gaps, ...interviews]
                .slice(0, 6)
                .map((result) => (
                  <AnalysisCard key={result.id} result={result} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function StatsCard({
  title,
  count,
  icon,
}: {
  title: string;
  count: number;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count}</div>
      </CardContent>
    </Card>
  );
}

function ResumeCard({ resume }: { resume: ResumeServerData }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">
          {resume.title || "Untitled Resume"}
        </CardTitle>
        <Badge variant="outline">{resume.borderStyle}</Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {resume.jobTitle || "No job title"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Updated {format(resume.updatedAt, "MMM dd, yyyy")}
        </p>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/resumes/editor?resumeId=${resume.id}`}>
            Edit
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/preview/${resume.id}`}>Preview</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function CoverLetterCard({ letter }: { letter: CoverLetterServerData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {letter.title || "Untitled Cover Letter"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {letter.jobDescription || "No job description"}
        </p>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/coverletters/editor?coverId=${letter.id}`}>
            Edit
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function AnalysisCard({
  result,
}: {
  result: {
    title: string;
    jobDescription: string;
  };
}) {
  const getAnalysisType = () => {
    if ("jobDescription" in result) {
      return "ATS Analysis";
    } else if ("gaps" in result) {
      return "Gap Analysis";
    } else {
      return "Interview Prep";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">{getAnalysisType()}</CardTitle>
        <Badge variant="secondary">{result.title}</Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {result.jobDescription || "No job description"}
        </p>
      </CardContent>
    </Card>
  );
}
