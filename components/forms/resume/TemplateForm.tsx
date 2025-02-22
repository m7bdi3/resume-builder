import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { templateSchema, TemplateValues } from "@/lib/validation";
import { EditorFormProps } from "@/lib/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const TemplateForm = ({
  resumeData,
  setResumeData,
}: EditorFormProps) => {
  const form = useForm<TemplateValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      template: resumeData.template,
    },
  });
  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;
      setResumeData({ ...resumeData, ...values });
    });
    return unsubscribe;
  }, [form, resumeData, setResumeData]);

  return (
    <Form {...form}>
      <form className="space-y-4">
        <FormField
          control={form.control}
          name="template"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Select Template Style</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-2 gap-4"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="CLASSIC" />
                    </FormControl>
                    <FormLabel className="font-normal">Classic</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="MODERN" />
                    </FormControl>
                    <FormLabel className="font-normal">Modern</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="MINIMAL" />
                    </FormControl>
                    <FormLabel className="font-normal">Minimal</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="PROFESSIONAL" />
                    </FormControl>
                    <FormLabel className="font-normal">Professional</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="ELEGANT" />
                    </FormControl>
                    <FormLabel className="font-normal">Elegant</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="BOLDHEADER" />
                    </FormControl>
                    <FormLabel className="font-normal">Bold Header</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="BLOCKS" />
                    </FormControl>
                    <FormLabel className="font-normal">Blocks</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
