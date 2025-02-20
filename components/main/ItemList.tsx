"use client";
import { useState, useRef, useMemo } from "react";
import { useResumeStore } from "@/hooks/store/useResumeStore";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TableSkeleton } from "@/components/LoadingSkeleton";

import { useCoverStore } from "@/hooks/store/useCoverStore";
import { useAtsStore } from "@/hooks/store/useAtsStore";
import { useGapStore } from "@/hooks/store/useGapStore";
import { useInterviewStore } from "@/hooks/store/useInterviewStore";
import { EmptyState } from "./EmptyState";
import { SearchInput } from "./SearchInput";
import { DeleteDialog } from "./DeleteDialog";
import { ItemRow } from "./ItemRow";
import { CreateButton } from "./CreateItemButton";

interface Props {
  type: "resume" | "letter" | "ats" | "gap" | "interview";
}

const typeLabels = {
  resume: "Resume",
  letter: "Cover Letter",
  ats: "ATS",
  gap: "Gap",
  interview: "Interview",
};

export const ItemList = ({ type }: Props) => {
  // State hooks
  const { resumes, isLoading: resumeLoading } = useResumeStore();
  const { covers, isLoading: coverLoading } = useCoverStore();
  const { ats: atsItems, isLoading: atsLoading } = useAtsStore();
  const { gaps, isLoading: gapLoading } = useGapStore();
  const { interviews, isLoading: interviewLoading } = useInterviewStore();

  // Get data based on type
  const { data, isLoading } = useMemo(() => {
    switch (type) {
      case "resume":
        return { data: resumes, isLoading: resumeLoading };
      case "letter":
        return { data: covers, isLoading: coverLoading };
      case "ats":
        return { data: atsItems, isLoading: atsLoading };
      case "gap":
        return { data: gaps, isLoading: gapLoading };
      case "interview":
        return { data: interviews, isLoading: interviewLoading };
      default:
        return { data: [], isLoading: false };
    }
  }, [
    type,
    resumes,
    resumeLoading,
    covers,
    coverLoading,
    atsItems,
    atsLoading,
    gaps,
    gapLoading,
    interviews,
    interviewLoading,
  ]);

  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const contentRef = useRef<HTMLDivElement>(null!);
  const [pending, setIsPending] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // Filtered data
  const filteredData = useMemo(
    () =>
      data.filter((item) =>
        (item.title || "").toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [data, searchTerm]
  );

  // Selection handlers
  const handleSelectAll = () => {
    setSelectedIds((prev) =>
      prev.size === filteredData.length
        ? new Set()
        : new Set(filteredData.map((item) => item.id))
    );
  };

  const handleSelectItem = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  if (isLoading) return <TableSkeleton />;
  if (data.length === 0) return <EmptyState type={type} />;

  return (
    <div className="space-y-4 w-full">
      <div className="flex justify-between items-center w-full gap-4">
        <SearchInput
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          title={typeLabels[type]}
        />
        <div className="flex items-center gap-3">
          <CreateButton variant={type} />
          <Button
            variant="destructive"
            onClick={() => setShowDelete(true)}
            disabled={selectedIds.size === 0 || pending}
          >
            Delete
          </Button>
          <DeleteDialog
            ids={Array.from(selectedIds)}
            open={showDelete}
            onOpenChange={setShowDelete}
            type={type}
            onSelect={() => setSelectedIds(new Set())}
            onPending={setIsPending}
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedIds.size === filteredData.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>{typeLabels[type]}</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((item) => (
            <ItemRow
              key={item.id}
              recivedData={item}
              isSelected={selectedIds.has(item.id)}
              onSelect={() => handleSelectItem(item.id)}
              contentRef={contentRef}
              isPending={pending}
              type={type}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
