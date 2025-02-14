"use client";

import {
  FilePen,
  MoreVertical,
  Printer,
  Search,
  Trash2,
  View,
} from "lucide-react";
import { CreateResumeButton } from "@/components/premium/CreateResumeButton";
import { Input } from "@/components/ui/input";
import { CreateCoverLetterButton } from "@/components/premium/CreateCoverLetterButton";
import { CoverLetterServerData } from "@/lib/types";
import { useMemo, useRef, useState, useTransition } from "react";
import { useReactToPrint } from "react-to-print";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { CoverLetterPreview } from "./CoverLetterPreview/CoverLetterPreview";
import { mapToCoverLetterValues } from "@/lib/utils";
import { formatDate } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DeleteDialog } from "../DeleteResumeDiaog";
import { useCoverStore } from "@/hooks/store/useCoverStore";
import { useToast } from "@/hooks/use-toast";
import { DeleteCover } from "@/actions/forms.actions";
import Link from "next/link";

export function CoverLetterList() {
  const covers = useCoverStore((state) => state.covers);
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResumes, setSelectedResumes] = useState<Set<string>>(
    new Set()
  );

  const [isPending, startTransition] = useTransition();
  const { deleteCover } = useCoverStore();

  const contentRef = useRef<HTMLDivElement>(null!);

  const filteredResumes = useMemo(
    () =>
      covers.filter((cover) =>
        (cover.title || "").toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [covers, searchTerm]
  );

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        for (const id of selectedResumes) {
          await DeleteCover(id);
          deleteCover(id);
        }
        setSelectedResumes(new Set());
        toast({ description: "Resumes deleted successfully" });
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          description: "Failed to delete covers.",
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

  if (covers.length === 0) {
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
            <TableHead>Cover Letter</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredResumes.map((cover) => (
            <CoverRow
              key={cover.id}
              cover={cover}
              isSelected={selectedResumes.has(cover.id)}
              onSelect={() => handleSelectResume(cover.id)}
              contentRef={contentRef}
              isPending={isPending}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

interface ResumeRowProps {
  cover: CoverLetterServerData;
  isSelected: boolean;
  onSelect: () => void;
  contentRef: React.RefObject<HTMLDivElement>;
  isPending: boolean;
}

export function CoverRow({
  cover,
  isSelected,
  onSelect,
  contentRef,
  isPending,
}: ResumeRowProps) {
  const [showDelete, setShowDelete] = useState(false);

  const printFn = useReactToPrint({
    contentRef,
    documentTitle: cover.title || "Cover letter",
  });

  return (
    <TableRow className="h-[200px]">
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelect}
          disabled={isPending}
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-4">
          <div className="w-32 h-40 overflow-hidden border rounded">
            <CoverLetterPreview
              coverLetterData={mapToCoverLetterValues(cover)}
              className="transform scale-[0.2] origin-top-left w-[500%] h-[500%]"
              contentRef={contentRef}
            />
          </div>
          <div>
            <h3 className="font-semibold">
              {cover.title || "Untitled Cover letter"}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {cover.jobTitle || "No job title"}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell>{formatDate(cover.updatedAt, "MMM d, yyyy")}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/coverletters/editor?coverId=${cover.id}`}>
                <View className="mr-2 h-4 w-4" />
                View
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => printFn}>
              <Printer className="mr-2 h-4 w-4" />
              Print
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
        id={cover.id}
        open={showDelete}
        onOpenChange={setShowDelete}
        isResume={false}
      />
    </TableRow>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 h-[50vh] text-center">
      <FilePen className="h-12 w-12 text-muted-foreground" />
      <div className="space-y-1.5">
        <h3 className="text-lg font-semibold">No cover letters found</h3>
        <p className="text-sm text-muted-foreground">
          Get started by creating a new cover letter
        </p>
      </div>
      <CreateCoverLetterButton />
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
        placeholder="Search covers..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-8"
      />
    </div>
  );
}
