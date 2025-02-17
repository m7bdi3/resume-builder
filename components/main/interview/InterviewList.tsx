"use client";

import { useState, useMemo, useTransition } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { InterviewRow } from "./InterviewRow";
import { FilePen, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DeleteInterview } from "@/actions/prisma.actions";
import { CreateAtsButton } from "@/components/premium/CreateAtsButton";
import { useInterviewStore } from "@/hooks/store/useInterviewStore";
import { CreateInterviewButton } from "@/components/premium/CreateInterviewButton";

export function InterviewList() {
  const interviews = useInterviewStore((state) => state.interviews);
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGap, setSelectedGap] = useState<Set<string>>(new Set());

  const [isPending, startTransition] = useTransition();
  const { deleteInterview } = useInterviewStore();

  const filteredInterviewResult = useMemo(
    () =>
      interviews.filter((gap) =>
        (gap.title || "").toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [interviews, searchTerm]
  );

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        for (const id of selectedGap) {
          await DeleteInterview(id);
          deleteInterview(id);
        }
        setSelectedGap(new Set());
        toast({ description: "Interview deleted successfully" });
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          description: "Failed to delete interview results.",
        });
      }
    });
  };

  const handleSelectAll = () => {
    setSelectedGap((prev) =>
      prev.size === filteredInterviewResult.length
        ? new Set()
        : new Set(filteredInterviewResult.map((r) => r.id))
    );
  };

  const handleSelectResume = (id: string) => {
    setSelectedGap((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  if (interviews.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4 w-full">
      <div className="flex justify-between items-center w-full gap-4">
        <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="flex items-center gap-3">
          <CreateAtsButton />
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={selectedGap.size === 0 || isPending}
          >
            Delete
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedGap.size === filteredInterviewResult.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Gap</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredInterviewResult.map((interview) => (
            <InterviewRow
              key={interview.id}
              interview={interview}
              isSelected={selectedGap.has(interview.id)}
              onSelect={() => handleSelectResume(interview.id)}
              isPending={isPending}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 h-[50vh] text-center">
      <FilePen className="h-12 w-12 text-muted-foreground" />
      <div className="space-y-1.5">
        <h3 className="text-lg font-semibold">No result found</h3>
        <p className="text-sm text-muted-foreground">
          Get started by creating a new Interview Q&A
        </p>
      </div>
      <CreateInterviewButton />
    </div>
  );
}

interface SearchInputProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

function SearchInput({ searchTerm, setSearchTerm }: SearchInputProps) {
  return (
    <div className="relative w-[70%]">
      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-8"
      />
    </div>
  );
}
