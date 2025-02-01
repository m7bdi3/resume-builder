import { useResumeForm } from "@/hooks/useResumeForm";
import type { EditorFormProps } from "@/lib/types";
import {
  workExperienceSchema,
  type WorkExperienceValues,
} from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { useFieldArray } from "react-hook-form";
import { WorkExperienceItem } from "./WorkExperienceItem";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ResumeFormWrapper } from "@/components/main/Resume/forms/ResumeFormWrapper";

export const WorkExperienceForm = ({
  resumeData,
  setResumeData,
}: EditorFormProps) => {
  const form = useResumeForm<WorkExperienceValues>(
    workExperienceSchema,
    {
      workExperience: resumeData.workExperience || [],
    },
    { resumeData, setResumeData }
  );

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "workExperience",
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
      title="Work experiences"
      description="Add as many as you like"
      form={form}
    >
      <DndContext onDragEnd={handleDragEnd}>
        <SortableContext items={fields} strategy={verticalListSortingStrategy}>
          {fields.map((field, index) => (
            <WorkExperienceItem
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
              position: "",
              company: "",
              startDate: "",
              endDate: "",
              description: "",
            })
          }
        >
          Add work experience
        </Button>
      </div>
    </ResumeFormWrapper>
  );
};
