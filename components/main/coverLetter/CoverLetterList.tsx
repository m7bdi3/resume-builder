"use client";

import { MoreVertical, Printer, Trash2, View } from "lucide-react";
import { CreateCoverLetterButton } from "@/components/premium/CreateCoverLetterButton";
import { CoverLetterServerData } from "@/lib/types";
import { useMemo, useRef, useState } from "react";
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
import { useCoverStore } from "@/hooks/store/useCoverStore";

import Link from "next/link";
import { TableSkeleton } from "@/components/LoadingSkeleton";
import { DeleteDialog } from "../DeleteDialog";
import { SearchInput } from "../SearchInput";
import { EmptyState } from "../EmptyState";

export function CoverLetterList() {
  const { covers, isLoading } = useCoverStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCovers, setSelectedCovers] = useState<Set<string>>(new Set());

  const [pending, setIsPending] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null!);

  const filteredCovers = useMemo(
    () =>
      covers.filter((cover) =>
        (cover.title || "").toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [covers, searchTerm]
  );

  const handleSelectAll = () => {
    setSelectedCovers((prev) =>
      prev.size === filteredCovers.length
        ? new Set()
        : new Set(filteredCovers.map((r) => r.id))
    );
  };

  const handleSelectResume = (id: string) => {
    setSelectedCovers((prev) => {
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

  if (covers.length === 0) {
    return <EmptyState type="letter" />;
  }

  return (
    <div className="space-y-4 w-full">
      <div className="flex justify-between items-center w-full gap-4">
        <SearchInput
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          title="covers"
        />
        <div className="flex items-center gap-3">
          <CreateCoverLetterButton />
          <Button
            variant="destructive"
            onClick={() => setShowDelete(true)}
            disabled={selectedCovers.size === 0 || pending}
          >
            Delete
          </Button>
          <DeleteDialog
            ids={Array.from(selectedCovers)}
            open={showDelete}
            onOpenChange={setShowDelete}
            type="interview"
            onSelect={() => setSelectedCovers(new Set())}
            onPending={setIsPending}
          />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedCovers.size === filteredCovers.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Cover Letter</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCovers.map((cover) => (
            <CoverRow
              key={cover.id}
              cover={cover}
              isSelected={selectedCovers.has(cover.id)}
              onSelect={() => handleSelectResume(cover.id)}
              contentRef={contentRef}
              isPending={pending}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

interface Props {
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
}: Props) {
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
        type="letter"
      />
    </TableRow>
  );
}
