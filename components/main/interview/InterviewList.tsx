"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { InterviewRow } from "./InterviewRow";
import { useInterviewStore } from "@/hooks/store/useInterviewStore";
import { TableSkeleton } from "@/components/LoadingSkeleton";
import { DeleteDialog } from "../DeleteDialog";
import { SearchInput } from "../SearchInput";
import { EmptyState } from "../EmptyState";
import { CreateInterviewButton } from "@/components/premium/CreateInterviewButton";

export function InterviewList() {
  const { interviews, isLoading } = useInterviewStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [pending, setIsPending] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<Set<string>>(
    new Set()
  );

  const filteredInterviewResult = useMemo(
    () =>
      interviews.filter((gap) =>
        (gap.title || "").toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [interviews, searchTerm]
  );

  const handleSelectAll = () => {
    setSelectedInterview((prev) =>
      prev.size === filteredInterviewResult.length
        ? new Set()
        : new Set(filteredInterviewResult.map((r) => r.id))
    );
  };

  const handleSelect = (id: string) => {
    setSelectedInterview((prev) => {
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

  if (interviews.length === 0) {
    return <EmptyState type="interview" />;
  }

  return (
    <div className="space-y-4 w-full">
      <div className="flex justify-between items-center w-full gap-4">
        <SearchInput
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          title="interviews"
        />
        <div className="flex items-center gap-3">
          <CreateInterviewButton />
          <Button
            variant="destructive"
            onClick={() => setShowDelete(true)}
            disabled={selectedInterview.size === 0 || pending}
          >
            Delete
          </Button>
          <DeleteDialog
            ids={Array.from(selectedInterview)}
            open={showDelete}
            onOpenChange={setShowDelete}
            type="interview"
            onSelect={() => setSelectedInterview(new Set())}
            onPending={setIsPending}
          />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={
                  selectedInterview.size === filteredInterviewResult.length
                }
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Interview</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredInterviewResult.map((interview) => (
            <InterviewRow
              key={interview.id}
              interview={interview}
              isSelected={selectedInterview.has(interview.id)}
              onSelect={() => handleSelect(interview.id)}
              isPending={pending}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
