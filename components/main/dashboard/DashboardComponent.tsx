"use client";

import type React from "react";

import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PlusCircle,
  FileText,
  ClipboardCheck,
  ScanSearch,
  ChevronRight,
} from "lucide-react";
import type { atsResult, GapResult, InterviewResult } from "@prisma/client";
import { CoverLetterCard } from "./CoverLetterCard";
import { AtsCard } from "./AtsCard";
import { useDashboardData } from "@/hooks/useDashboardData";
import { DashboardSkeleton } from "./DashboardSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatsCard } from "./StatsCard";
import { ResumeCard } from "./ResumeCard";
import { GapCard } from "./GapCard";
import { InterviewCard } from "./InterviewCard";

export function DashboardComponent() {
  const { user } = useUser();
  const userName = user?.firstName;

  const { data, isLoading } = useDashboardData();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const { resumes, covers, atsResults, gaps, interviews } = data;
  const totalAnalyses = atsResults.length + gaps.length + interviews.length;

  return (
    <div className="h-full">
      <div className="container mx-auto p-6 space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <Avatar>
              <AvatarImage src={user?.imageUrl} alt={userName || "User"} />
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
            <DashboardSection
              title="Recent Resumes"
              viewAllLink="/dashboard/resumes"
              items={resumes.slice(0, 3)}
              ItemComponent={ResumeCard}
            />
          </TabsContent>

          <TabsContent value="coverletters" className="space-y-4">
            <DashboardSection
              title="Recent Cover Letters"
              viewAllLink="/dashboard/coverletters"
              items={covers.slice(0, 3)}
              ItemComponent={CoverLetterCard}
            />
          </TabsContent>

          <TabsContent value="analyses" className="space-y-4">
            <h2 className="text-2xl font-semibold">Recent Analyses</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Suspense fallback={<DashboardSkeleton />}>
                {[...atsResults].slice(0, 6).map((result) => (
                  <AtsCard key={result.id} result={result as atsResult} />
                ))}
                {[...gaps].slice(0, 6).map((result) => (
                  <GapCard key={result.id} result={result as GapResult} />
                ))}
                {[...interviews].slice(0, 6).map((result) => (
                  <InterviewCard
                    key={result.id}
                    result={result as InterviewResult}
                  />
                ))}
              </Suspense>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function DashboardSection<T>({
  title,
  viewAllLink,
  items,
  ItemComponent,
}: {
  title: string;
  viewAllLink: string;
  items: T[];
  ItemComponent: React.ComponentType<{ item: T }>;
}) {
  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <Button variant="ghost" asChild>
          <Link href={viewAllLink}>
            View All <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <ItemComponent key={index} item={item} />
        ))}
      </div>
    </>
  );
}
