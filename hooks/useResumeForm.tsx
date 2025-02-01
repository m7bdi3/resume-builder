import { DefaultValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import type { EditorFormProps } from "@/lib/types";

export function useResumeForm<T extends object>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: any,
  defaultValues: Partial<T>,
  { resumeData, setResumeData }: EditorFormProps
) {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;
      setResumeData({
        ...resumeData,
        ...values,
      });
    });
    return unsubscribe;
  }, [form, resumeData, setResumeData]);

  return form;
}
