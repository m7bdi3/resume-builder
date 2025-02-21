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
import { additionalInfoSchema, AdditionalInfoValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export function AdditionalInfoForm({
  resumeData,
  setResumeData,
}: EditorFormProps) {
  const [newAchievement, setNewAchievement] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [newHobby, setNewHobby] = useState("");

  const form = useForm<AdditionalInfoValues>({
    resolver: zodResolver(additionalInfoSchema),
    defaultValues: {
      hobbies: resumeData.hobbies ?? [],
      achievements: resumeData.achievements ?? [],
      languages: resumeData.languages ?? [],
    },
  });

  const addAchievement = () => {
    if (!newAchievement.trim()) return;
    const current = form.getValues("achievements") || [];
    form.setValue("achievements", [...current, newAchievement.trim()]);
    setNewAchievement("");
  };

  const removeAchievement = (index: number) => {
    const current = form.getValues("achievements") || [];
    form.setValue(
      "achievements",
      current.filter((_, i) => i !== index)
    );
  };

  const addLanguage = () => {
    if (!newLanguage.trim()) return;
    const current = form.getValues("languages") || [];
    form.setValue("languages", [...current, newLanguage.trim()]);
    setNewLanguage("");
  };

  const removeLanguage = (index: number) => {
    const current = form.getValues("languages") || [];
    form.setValue(
      "languages",
      current.filter((_, i) => i !== index)
    );
  };

  const addHobby = () => {
    if (!newHobby.trim()) return;
    const current = form.getValues("hobbies") || [];
    form.setValue("hobbies", [...current, newHobby.trim()]);
    setNewHobby("");
  };

  const removeHobby = (index: number) => {
    const current = form.getValues("hobbies") || [];
    form.setValue(
      "hobbies",
      current.filter((_, i) => i !== index)
    );
  };

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;
      setResumeData({
        ...resumeData,
        hobbies:
          values.hobbies
            ?.filter((skill) => skill !== undefined)
            .map((skill) => skill.trim())
            .filter((skill) => skill !== "") || [],
        achievements:
          values.achievements
            ?.filter((skill) => skill !== undefined)
            .map((skill) => skill.trim())
            .filter((skill) => skill !== "") || [],
        languages:
          values.languages
            ?.filter((skill) => skill !== undefined)
            .map((skill) => skill.trim())
            .filter((skill) => skill !== "") || [],
      });
    });
    return unsubscribe;
  }, [form, resumeData, setResumeData]);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Additional Info</h2>
        <p className="text-sm text-muted-foreground">
          Leave empty if you do not want to add
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="achievements"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Achievements</FormLabel>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        placeholder="e.g. First place in coding competition"
                        value={newAchievement}
                        onChange={(e) => setNewAchievement(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addAchievement();
                          }
                        }}
                      />
                    </FormControl>
                    <Button type="button" onClick={addAchievement}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {field.value?.map((achievement, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm"
                      >
                        {achievement}
                        <button
                          type="button"
                          onClick={() => removeAchievement(index)}
                          className="ml-1 text-muted-foreground hover:text-foreground"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="languages"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Languages</FormLabel>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        placeholder="e.g. English"
                        value={newLanguage}
                        onChange={(e) => setNewLanguage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addLanguage();
                          }
                        }}
                      />
                    </FormControl>
                    <Button type="button" onClick={addLanguage}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {field.value?.map((language, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm"
                      >
                        {language}
                        <button
                          type="button"
                          onClick={() => removeLanguage(index)}
                          className="ml-1 text-muted-foreground hover:text-foreground"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hobbies"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hobbies</FormLabel>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        placeholder="e.g. Reading"
                        value={newHobby}
                        onChange={(e) => setNewHobby(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addHobby();
                          }
                        }}
                      />
                    </FormControl>
                    <Button type="button" onClick={addHobby}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {field.value?.map((hobby, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm"
                      >
                        {hobby}
                        <button
                          type="button"
                          onClick={() => removeHobby(index)}
                          className="ml-1 text-muted-foreground hover:text-foreground"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
