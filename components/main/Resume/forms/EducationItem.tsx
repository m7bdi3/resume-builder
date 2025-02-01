import type { UseFormReturn } from "react-hook-form";
import type { EducatonSchemaValues } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { GripHorizontal, Trash2Icon } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { RepeatedFormField } from "./RepeatedFormField";

interface EducationItemProps {
  id: string;
  form: UseFormReturn<EducatonSchemaValues>;
  index: number;
  remove: (index: number) => void;
}

export const EducationItem = ({
  id,
  form,
  index,
  remove,
}: EducationItemProps) => {
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
        <span className="font-semibold">Education {index + 1}</span>
        <GripHorizontal
          className="size-5 cursor-grab text-muted-foreground focus:outline-none"
          {...attributes}
          {...listeners}
        />
      </div>

      <RepeatedFormField
        name={`educations.${index}.degree`}
        form={form}
        label="Degree"
        inputType="input"
        autoFocus
      />

      <RepeatedFormField
        name={`educations.${index}.school`}
        form={form}
        label="School"
        inputType="input"
        autoFocus={false}
      />
      <div className="grid grid-cols-2 gap-3">
        <RepeatedFormField
          name={`educations.${index}.startDate`}
          form={form}
          label="Start date"
          inputType="input"
          type="date"
          autoFocus={false}
          isDate
        />
        <RepeatedFormField
          name={`educations.${index}.endDate`}
          form={form}
          label="End date"
          inputType="input"
          type="date"
          autoFocus={false}
          isDate
        />
      </div>
      <Button variant="destructive" type="button" onClick={() => remove(index)}>
        <Trash2Icon className="size-4" />
      </Button>
    </div>
  );
};
