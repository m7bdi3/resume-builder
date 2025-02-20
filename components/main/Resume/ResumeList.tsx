"use client";

import { useState, useRef, useMemo } from "react";
import { useResumeStore } from "@/hooks/store/useResumeStore";
import { CreateResumeButton } from "@/components/premium/CreateResumeButton";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ResumeRow } from "./ResumeRow";
import { TableSkeleton } from "@/components/LoadingSkeleton";
import { DeleteDialog } from "../DeleteDialog";
import { SearchInput } from "../SearchInput";
import { EmptyState } from "../EmptyState";
export function ResumeList() {
  const { isLoading, resumes } = useResumeStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResumes, setSelectedResumes] = useState<Set<string>>(
    new Set()
  );
  const contentRef = useRef<HTMLDivElement>(null!);
  const [pending, setIsPending] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const filteredResumes = useMemo(
    () =>
      resumes.filter((resume) =>
        (resume.title || "").toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [resumes, searchTerm]
  );

  const handleSelectAll = () => {
    setSelectedResumes((prev) =>
      prev.size === filteredResumes.length
        ? new Set()
        : new Set(filteredResumes.map((r) => r.id))
    );
  };

  const handleSelectResume = (id: string) => {
    setSelectedResumes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (resumes.length === 0) {
    return <EmptyState type="resume" />;
  }

  return (
    <div className="space-y-4 w-full">
      <div className="flex justify-between items-center w-full gap-4">
        <SearchInput
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          title="resumes"
        />
        <div className="flex items-center gap-3">
          <CreateResumeButton />
          <Button
            variant="destructive"
            onClick={() => setShowDelete(true)}
            disabled={selectedResumes.size === 0 || pending}
          >
            Delete
          </Button>
          <DeleteDialog
            ids={Array.from(selectedResumes)}
            open={showDelete}
            onOpenChange={setShowDelete}
            type="resume"
            onSelect={() => setSelectedResumes(new Set())}
            onPending={setIsPending}
          />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedResumes.size === filteredResumes.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Resume</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredResumes.map((resume) => (
            <ResumeRow
              key={resume.id}
              resume={resume}
              isSelected={selectedResumes.has(resume.id)}
              onSelect={() => handleSelectResume(resume.id)}
              contentRef={contentRef}
              isPending={pending}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
