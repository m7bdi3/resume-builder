import type React from "react";
import { Form } from "@/components/ui/form";
import type { UseFormReturn } from "react-hook-form";

interface ResumeFormWrapperProps<T extends object> {
  title: string;
  description: string;
  form: UseFormReturn<T>;
  children: React.ReactNode;
}

export function ResumeFormWrapper<T extends object>({
  title,
  description,
  form,
  children,
}: ResumeFormWrapperProps<T>) {
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Form {...form}>
        <form className="space-y-3">{children}</form>
      </Form>
    </div>
  );
}
