"use client";

import { useState, useRef, useMemo, useTransition } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { DeleteResume } from "@/actions/forms.actions";
import { ResumeRow } from "./ResumeRow";
import { FilePen, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
export function ResumeList() {
  const resumes = useResumeStore((state) => state.resumes);
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResumes, setSelectedResumes] = useState<Set<string>>(
    new Set()
  );

  const [isPending, startTransition] = useTransition();
  const { deleteResume } = useResumeStore();

  const contentRef = useRef<HTMLDivElement>(null!);

  const filteredResumes = useMemo(
    () =>
      resumes.filter((resume) =>
        (resume.title || "").toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [resumes, searchTerm]
  );

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        for (const id of selectedResumes) {
          await DeleteResume(id);
          deleteResume(id);
        }
        setSelectedResumes(new Set());
        toast({ description: "Resumes deleted successfully" });
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          description: "Failed to delete resumes.",
        });
      }
    });
  };

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

  if (resumes.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4 w-full">
      <div className="flex justify-between items-center w-full gap-4">
        <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="flex items-center gap-3">
          <CreateResumeButton />
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={selectedResumes.size === 0 || isPending}
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
        <h3 className="text-lg font-semibold">No resumes found</h3>
        <p className="text-sm text-muted-foreground">
          Get started by creating a new resume
        </p>
      </div>
      <CreateResumeButton />
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
        placeholder="Search resumes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-8"
      />
    </div>
  );
}
