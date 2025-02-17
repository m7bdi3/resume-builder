import * as React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function DashboardSkeleton() {
  return (
    <div className="h-full">
      <div className="container mx-auto p-6 space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <Skeleton className="h-9 w-64 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          <StatsCardSkeleton />
          <StatsCardSkeleton />
          <StatsCardSkeleton />
        </div>

        <Tabs defaultValue="resumes" className="space-y-4">
          <TabsList>
            <TabsTrigger value="resumes">Resumes</TabsTrigger>
            <TabsTrigger value="coverletters">Cover Letters</TabsTrigger>
            <TabsTrigger value="analyses">Analyses</TabsTrigger>
          </TabsList>

          <TabsContent value="resumes" className="space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-10 w-24" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <ResumeCardSkeleton />
              <ResumeCardSkeleton />
              <ResumeCardSkeleton />
            </div>
          </TabsContent>

          <TabsContent value="coverletters" className="space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-10 w-24" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <CoverLetterCardSkeleton />
              <CoverLetterCardSkeleton />
              <CoverLetterCardSkeleton />
            </div>
          </TabsContent>

          <TabsContent value="analyses" className="space-y-4">
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <AnalysisCardSkeleton />
              <AnalysisCardSkeleton />
              <AnalysisCardSkeleton />
              <AnalysisCardSkeleton />
              <AnalysisCardSkeleton />
              <AnalysisCardSkeleton />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function StatsCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-12" />
      </CardContent>
    </Card>
  );
}

function ResumeCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-16" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-20" />
      </CardFooter>
    </Card>
  );
}

function CoverLetterCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-40" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
      <CardFooter className="flex justify-end">
        <Skeleton className="h-8 w-16" />
      </CardFooter>
    </Card>
  );
}

function AnalysisCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-20" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
    </Card>
  );
}
