import { UseFormReturn } from "react-hook-form";

import { FormDescription } from "@/components/ui/form";
import { ResumeValues } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { GripHorizontal, Trash2Icon } from "lucide-react";

import { useSortable } from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { RepeatedFormField } from "@/components/main/Resume/forms/RepeatedFormField";
import { Card } from "@/components/ui/card";

interface Props {
  id: string;
  form: UseFormReturn<ResumeValues>;
  index: number;
  remove: (index: number) => void;
  title: string;
  description?: string;
  isEducation: boolean;
  name: string;
}

export const DraggableItem = ({
  id,
  form,
  index,
  remove,
  title,
  description,
  name,
  isEducation,
}: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <Card
      className={cn(
        "space-y-3 border rounded  p-3",
        isDragging && "shadow-xl z-50 cursor-grab relative"
      )}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <div className="flex justify-between gap-2">
        <span className="font-semibold">
          {title} {index + 1}
        </span>
        <GripHorizontal
          className="size-5 cursor-grab text-muted-foreground focus:outline-none"
          {...attributes}
          {...listeners}
        />
      </div>

      {isEducation ? (
        <>
          <RepeatedFormField
            name={`${name}.${index}.degree`}
            form={form}
            label="Degree"
            inputType="input"
            autoFocus
          />

          <RepeatedFormField
            name={`${name}.${index}.school`}
            form={form}
            label="School"
            inputType="input"
            autoFocus={false}
          />
        </>
      ) : (
        <>
          <RepeatedFormField
            name={`${name}.${index}.position`}
            form={form}
            label="Job title"
            inputType="input"
            autoFocus
          />

          <RepeatedFormField
            name={`${name}.${index}.company`}
            form={form}
            label="Company"
            inputType="input"
            autoFocus={false}
          />
          <RepeatedFormField
            name={`${name}.${index}.description`}
            form={form}
            label="Description"
            inputType="textarea"
            autoFocus={false}
          />
        </>
      )}

      <div className="grid grid-cols-2 gap-3">
        <RepeatedFormField
          name={`${name}.${index}.startDate`}
          form={form}
          label="Start date"
          inputType="input"
          type="date"
          autoFocus={false}
          isDate
        />
        <RepeatedFormField
          name={`${name}.${index}.endDate`}
          form={form}
          label="End date"
          inputType="input"
          type="date"
          autoFocus={false}
          isDate
        />
      </div>
      {description && <FormDescription>{description}</FormDescription>}

      <Button variant="destructive" type="button" onClick={() => remove(index)}>
        <Trash2Icon className="size-4" />
      </Button>
    </Card>
  );
};
