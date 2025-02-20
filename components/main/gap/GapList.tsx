"use client";

import { useState, useMemo } from "react";
import { useGapStore } from "@/hooks/store/useGapStore";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { GapRow } from "./GapRow";

import { CreateGapButton } from "@/components/premium/CreateGapButton";
import { TableSkeleton } from "@/components/LoadingSkeleton";
import { DeleteDialog } from "../DeleteDialog";
import { SearchInput } from "../SearchInput";
import { EmptyState } from "../EmptyState";

export function GapList() {
  const { gaps, isLoading } = useGapStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGap, setSelectedGap] = useState<Set<string>>(new Set());
  const [pending, setIsPending] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const filteredAtsResult = useMemo(
    () =>
      gaps.filter((gap) =>
        (gap.title || "").toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [gaps, searchTerm]
  );

  const handleSelectAll = () => {
    setSelectedGap((prev) =>
      prev.size === filteredAtsResult.length
        ? new Set()
        : new Set(filteredAtsResult.map((r) => r.id))
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

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (gaps.length === 0) {
    return <EmptyState type="gap" />;
  }

  return (
    <div className="space-y-4 w-full">
      <div className="flex justify-between items-center w-full gap-4">
        <SearchInput
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          title="gap documents"
        />
        <div className="flex items-center gap-3">
          <CreateGapButton />
          <Button
            variant="destructive"
            onClick={() => setShowDelete(true)}
            disabled={selectedGap.size === 0 || pending}
          >
            Delete
          </Button>
          <DeleteDialog
            ids={Array.from(selectedGap)}
            open={showDelete}
            onOpenChange={setShowDelete}
            type="interview"
            onSelect={() => setSelectedGap(new Set())}
            onPending={setIsPending}
          />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedGap.size === filteredAtsResult.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Gap</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAtsResult.map((gap) => (
            <GapRow
              key={gap.id}
              gap={gap}
              isSelected={selectedGap.has(gap.id)}
              onSelect={() => handleSelectResume(gap.id)}
              isPending={pending}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
