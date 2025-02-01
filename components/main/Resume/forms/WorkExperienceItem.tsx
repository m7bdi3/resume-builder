import React from "react";
import { UseFormReturn } from "react-hook-form";

import { FormDescription } from "@/components/ui/form";
import { WorkExperienceValues } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { GripHorizontal, Trash2Icon } from "lucide-react";

import { useSortable } from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { RepeatedFormField } from "./RepeatedFormField";

interface workExperienceProps {
  id: string;
  form: UseFormReturn<WorkExperienceValues>;
  index: number;
  remove: (index: number) => void;
}

export const WorkExperienceItem = ({
  id,
  form,
  index,
  remove,
}: workExperienceProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  return (
    <div
      className={cn(
        "space-y-3 border rounded bg-background p-3",
        isDragging && "shadow-xl z-50 cursor-grab relative"
      )}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <div className="flex justify-between gap-2">
        <span className="font-semibold">Work experience {index + 1}</span>
        <GripHorizontal
          className="size-5 cursor-grab text-muted-foreground focus:outline-none"
          {...attributes}
          {...listeners}
        />
      </div>

      <RepeatedFormField
        name={`workExperience.${index}.position`}
        form={form}
        label="Job title"
        inputType="input"
        autoFocus
      />

      <RepeatedFormField
        name={`workExperience.${index}.company`}
        form={form}
        label="Company"
        inputType="input"
        autoFocus={false}
      />
      <div className="grid grid-cols-2 gap-3">
        <RepeatedFormField
          name={`workExperience.${index}.startDate`}
          form={form}
          label="Start date"
          inputType="input"
          type="date"
          autoFocus={false}
          isDate
        />
        <RepeatedFormField
          name={`workExperience.${index}.endDate`}
          form={form}
          label="End date"
          inputType="input"
          type="date"
          autoFocus={false}
          isDate
        />
      </div>
      <FormDescription>
        Leave <span className="font-semibold">end date</span> empty if you are
        still working here.
      </FormDescription>

      <RepeatedFormField
        name={`workExperience.${index}.description`}
        form={form}
        label="Description"
        inputType="textarea"
        autoFocus={false}
      />
      <Button
        variant={"destructive"}
        type="button"
        onClick={() => remove(index)}
      >
        <Trash2Icon className="size-4" />
      </Button>
    </div>
  );
};
