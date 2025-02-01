import { useResumeForm } from "@/hooks/useResumeForm";
import type { EditorFormProps } from "@/lib/types";
import { educatonSchema, type EducatonSchemaValues } from "@/lib/validation";
import { useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { EducationItem } from "./EducationItem";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ResumeFormWrapper } from "./ResumeFormWrapper";

export const EducationForm = ({
  resumeData,
  setResumeData,
}: EditorFormProps) => {
  const form = useResumeForm<EducatonSchemaValues>(
    educatonSchema,
    {
      educations: resumeData.educations || [],
    },
    { resumeData, setResumeData }
  );

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "educations",
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);
      move(oldIndex, newIndex);
    }
  };

  return (
    <ResumeFormWrapper
      title="Education"
      description="Add as many as you like"
      form={form}
    >
      <DndContext onDragEnd={handleDragEnd}>
        <SortableContext items={fields} strategy={verticalListSortingStrategy}>
          {fields.map((field, index) => (
            <EducationItem
              key={field.id}
              id={field.id}
              form={form}
              index={index}
              remove={remove}
            />
          ))}
        </SortableContext>
      </DndContext>
      <div className="flex justify-center">
        <Button
          type="button"
          onClick={() =>
            append({
              degree: "",
              school: "",
              startDate: "",
              endDate: "",
            })
          }
        >
          Add education
        </Button>
      </div>
    </ResumeFormWrapper>
  );
};
