import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EditorFormProps } from "@/lib/types";
import { skillsSchema, SkillsSchemaValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { GenerateSkillsButton } from "../ai/GenerateSkillsButton";
import { X } from "lucide-react";

export function SkillsForm({ resumeData, setResumeData }: EditorFormProps) {
  const [newTechnicalSkill, setNewTechnicalSkill] = useState("");
  const [newSoftSkill, setNewSoftSkill] = useState("");

  const form = useForm<SkillsSchemaValues>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      softSkills: resumeData.softSkills ?? [],
      technicalSkills: resumeData.technicalSkills ?? [],
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;
      setResumeData({
        ...resumeData,
        softSkills:
          values.softSkills
            ?.filter((skill) => skill !== undefined)
            .map((skill) => skill.trim())
            .filter((skill) => skill !== "") || [],
        technicalSkills:
          values.technicalSkills
            ?.filter((skill) => skill !== undefined)
            .map((skill) => skill.trim())
            .filter((skill) => skill !== "") || [],
      });
    });
    return unsubscribe;
  }, [form, resumeData, setResumeData]);

  const addTechnicalSkill = () => {
    if (!newTechnicalSkill.trim()) return;
    const currentSkills = form.getValues("technicalSkills") || [];
    form.setValue("technicalSkills", [
      ...currentSkills,
      newTechnicalSkill.trim(),
    ]);
    setNewTechnicalSkill("");
  };

  const removeTechnicalSkill = (index: number) => {
    const currentSkills = form.getValues("technicalSkills") || [];
    form.setValue(
      "technicalSkills",
      currentSkills.filter((_, i) => i !== index)
    );
  };

  const addSoftSkill = () => {
    if (!newSoftSkill.trim()) return;
    const currentSkills = form.getValues("softSkills") || [];
    form.setValue("softSkills", [...currentSkills, newSoftSkill.trim()]);
    setNewSoftSkill("");
  };

  const removeSoftSkill = (index: number) => {
    const currentSkills = form.getValues("softSkills") || [];
    form.setValue(
      "softSkills",
      currentSkills.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Skills</h2>
        <p className="text-sm text-muted-foreground">What are you good at?</p>
      </div>
      <Form {...form}>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="technicalSkills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Technical Skills</FormLabel>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        placeholder="e.g. React.js"
                        value={newTechnicalSkill}
                        onChange={(e) => setNewTechnicalSkill(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addTechnicalSkill();
                          }
                        }}
                      />
                    </FormControl>
                    <Button type="button" onClick={addTechnicalSkill}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {field.value?.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeTechnicalSkill(index)}
                          className="ml-1 text-muted-foreground hover:text-foreground"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <GenerateSkillsButton
                  resumeData={resumeData}
                  onSkillsGenerated={(skills) =>
                    form.setValue("technicalSkills", skills.technicalSkills)
                  }
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="softSkills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Soft Skills</FormLabel>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        placeholder="e.g. Problem Solving"
                        value={newSoftSkill}
                        onChange={(e) => setNewSoftSkill(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addSoftSkill();
                          }
                        }}
                      />
                    </FormControl>
                    <Button type="button" onClick={addSoftSkill}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {field.value?.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSoftSkill(index)}
                          className="ml-1 text-muted-foreground hover:text-foreground"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <GenerateSkillsButton
                  resumeData={resumeData}
                  onSkillsGenerated={(skills) =>
                    form.setValue("softSkills", skills.softSkills)
                  }
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
