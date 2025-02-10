import { DefaultValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import type { CoverEditorFormProps } from "@/lib/types";

export function useCoverForm<T extends object>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: any,
  defaultValues: Partial<T>,
  { coverData, setCoverData }: CoverEditorFormProps
) {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;
      setCoverData({
        ...coverData,
        ...values,
      });
    });
    return unsubscribe;
  }, [form, coverData, setCoverData]);

  return form;
}
