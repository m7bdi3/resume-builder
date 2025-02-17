"use client";

import { useState, useMemo, useTransition } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { AtsRow } from "./AtsRow";
import { FilePen, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DeleteAts } from "@/actions/prisma.actions";
import { CreateAtsButton } from "@/components/premium/CreateAtsButton";
import { TableSkeleton } from "@/components/LoadingSkeleton";
export function AtsList() {
  const { deleteAts, ats: atsResults, isLoading } = useAtsStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAts, setSelectedAts] = useState<Set<string>>(new Set());

  const [isPending, startTransition] = useTransition();

  const filteredAtsResult = useMemo(
    () =>
      atsResults.filter((ats) =>
        (ats.title || "").toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [atsResults, searchTerm]
  );

  const { toast } = useToast();
  const handleDelete = async () => {
    startTransition(async () => {
      try {
        for (const id of selectedAts) {
          await DeleteAts(id);
          deleteAts(id);
        }
        setSelectedAts(new Set());
        toast({ description: "Ats deleted successfully" });
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          description: "Failed to delete ats results.",
        });
      }
    });
  };

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
            disabled={selectedAts.size === 0 || isPending}
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
          Get started by creating a new Ats
        </p>
      </div>
      <CreateAtsButton />
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
