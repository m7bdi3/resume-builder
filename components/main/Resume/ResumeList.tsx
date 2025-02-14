"use client";

import { useState, useRef, useMemo } from "react";
import { useResumeStore } from "@/hooks/store/useResumeStore";
import type { ResumeServerData } from "@/lib/types";
import { formatDate } from "date-fns";
import { mapToResumeValues } from "@/lib/utils";
import { ResumePreview } from "@/components/main/Resume/ResumePreview/ResumePreview";
import { DeleteDialog } from "@/components/main/DeleteResumeDiaog";
import { CreateResumeButton } from "@/components/premium/CreateResumeButton";
import { useReactToPrint } from "react-to-print";
import {
  FilePen,
  Printer,
  Trash2,
  Search,
  MoreVertical,
  Download,
  View,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";

import Link from "next/link";

interface ResumeListProps {
  canCreate: boolean;
}

export function ResumeList({ canCreate }: ResumeListProps) {
  const resumes = useResumeStore((state) => state.resumes);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResumes, setSelectedResumes] = useState<Set<string>>(
    new Set()
  );
  const contentRef = useRef<HTMLDivElement>(null!);

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

  if (resumes.length === 0) {
    return <EmptyState canCreate={canCreate} />;
  }

  return (
    <div className="space-y-4 w-full">
      <div className="flex justify-between items-center w-full">
        <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="flex items-center gap-3">
          <CreateResumeButton canCreate={canCreate} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Printer className="mr-2 h-4 w-4" />
                Print
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {}}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {}} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function EmptyState({ canCreate }: { canCreate: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 h-[50vh] text-center">
      <FilePen className="h-12 w-12 text-muted-foreground" />
      <div className="space-y-1.5">
        <h3 className="text-lg font-semibold">No resumes found</h3>
        <p className="text-sm text-muted-foreground">
          Get started by creating a new resume
        </p>
      </div>
      <CreateResumeButton canCreate={canCreate} />
    </div>
  );
}

function SearchInput({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}) {
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

function ResumeRow({
  resume,
  isSelected,
  onSelect,
  contentRef,
}: {
  resume: ResumeServerData;
  isSelected: boolean;
  onSelect: () => void;
  contentRef: React.RefObject<HTMLDivElement>;
}) {
  const printFn = useReactToPrint({
    contentRef,
    documentTitle: "Resume",
  });
  const [showDelete, setShowDelete] = useState(false);

  return (
    <TableRow className="h-[200px]">
      <TableCell>
        <Checkbox checked={isSelected} onCheckedChange={onSelect} />
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-4">
          <div className="w-32 h-40 overflow-hidden border rounded">
            <ResumePreview
              resumeData={mapToResumeValues(resume)}
              className="transform scale-[0.2] origin-top-left w-[500%] h-[500%]"
              contentRef={contentRef}
            />
          </div>
          <div>
            <h3 className="font-semibold">
              {resume.title || "Untitled Resume"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {resume.description || "No description"}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell>{formatDate(resume.updatedAt, "MMM d, yyyy")}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/resumes/editor?resumeId=${resume.id}`}>
                <View className="mr-2 h-4 w-4" />
                View
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => printFn()}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {}}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setShowDelete(true)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
      <DeleteDialog
        id={resume.id}
        open={showDelete}
        onOpenChange={setShowDelete}
        isResume
      />
    </TableRow>
  );
}
