"use client";

import { useState, useMemo } from "react";
import { useAtsStore } from "@/hooks/store/useAtsStore";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AtsRow } from "./AtsRow";
import { CreateAtsButton } from "@/components/premium/CreateAtsButton";
import { TableSkeleton } from "@/components/LoadingSkeleton";
import { DeleteDialog } from "../DeleteDialog";
import { SearchInput } from "../SearchInput";
import { EmptyState } from "../EmptyState";
export function AtsList() {
  const { ats: atsResults, isLoading } = useAtsStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAts, setSelectedAts] = useState<Set<string>>(new Set());
  const [pending, setIsPending] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const filteredAtsResult = useMemo(
    () =>
      atsResults.filter((ats) =>
        (ats.title || "").toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [atsResults, searchTerm]
  );

  const handleSelectAll = () => {
    setSelectedAts((prev) =>
      prev.size === filteredAtsResult.length
        ? new Set()
        : new Set(filteredAtsResult.map((r) => r.id))
    );
  };

  const handleSelectResume = (id: string) => {
    setSelectedAts((prev) => {
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

  if (atsResults.length === 0) {
    return <EmptyState type="ats" />;
  }

  return (
    <div className="space-y-4 w-full">
      <div className="flex justify-between items-center w-full gap-4">
        <SearchInput
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          title="ats documents"
        />
        <div className="flex items-center gap-3">
          <CreateAtsButton />
          <Button
            variant="destructive"
            onClick={() => setShowDelete(true)}
            disabled={selectedAts.size === 0 || pending}
          >
            Delete
          </Button>
          <DeleteDialog
            ids={Array.from(selectedAts)}
            open={showDelete}
            onOpenChange={setShowDelete}
            type="ats"
            onSelect={() => setSelectedAts(new Set())}
            onPending={setIsPending}
          />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedAts.size === filteredAtsResult.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Ats</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAtsResult.map((ats) => (
            <AtsRow
              key={ats.id}
              ats={ats}
              isSelected={selectedAts.has(ats.id)}
              onSelect={() => handleSelectResume(ats.id)}
              isPending={pending}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
