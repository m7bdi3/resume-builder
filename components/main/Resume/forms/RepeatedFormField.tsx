import React, { memo, useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { FieldConfig } from "@/lib/forms";

interface Props {
  form: UseFormReturn;
  name: string;
  label: string;
  placeholder?: string;
  autoFocus: boolean;
  inputType: "input" | "textarea";
  description?: string;
  type?: string;
  img?: boolean;
  accept?: string;
  onSkillChange?: boolean;
  isDate?: boolean;
}

export const RepeatedFormField = memo(
  ({
    form,
    name,
    label,
    placeholder,
    autoFocus,
    inputType,
    description,
    type,
    img,
    accept,
    onSkillChange,
    isDate,
  }: Props) => {
    const imgInputRef = useRef<HTMLInputElement>(null);

    return (
      <>
        {img ? (
          <FormField
            control={form.control}
            name={name}
            render={({ field: { value, ...fieldValues } }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Input
                      {...fieldValues}
                      type={type}
                      ref={imgInputRef}
                      accept={accept}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        fieldValues.onChange(file);
                      }}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    onClick={() => {
                      fieldValues.onChange(null);
                      if (imgInputRef.current) {
                        imgInputRef.current.value = "";
                      }
                    }}
                  >
                    <Trash2 />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  {inputType === "input" ? (
                    <Input
                      {...field}
                      placeholder={placeholder ? placeholder : ""}
                      autoFocus={autoFocus}
                      type={type && type}
                      value={isDate ? field.value?.slice(0, 10) : field.value}
                    />
                  ) : (
                    <Textarea
                      {...field}
                      placeholder={placeholder ? placeholder : ""}
                      autoFocus={autoFocus}
                      onChange={
                        onSkillChange
                          ? (e) => {
                              const skills = e.target.value.split(",");
                              field.onChange(skills);
                            }
                          : field.onChange
                      }
                    />
                  )}
                </FormControl>
                <FormMessage />
                {description && (
                  <FormDescription>{description}</FormDescription>
                )}
              </FormItem>
            )}
          />
        )}
      </>
    );
  }
);

RepeatedFormField.displayName = "RepeatedFormField";

interface RenderFieldGroupProps {
  form: UseFormReturn;
  group: FieldConfig[];
  index: string;
  isGrid?: boolean;
}

const RenderFieldGroupComponent: React.FC<RenderFieldGroupProps> = ({
  form,
  group,
  index,
  isGrid = true,
}) => (
  <div className={cn(isGrid && "grid grid-cols-2 gap-3")} key={index}>
    {group.map((field) => (
      <RepeatedFormField key={field.name} form={form} {...field} />
    ))}
  </div>
);

export const RenderFieldGroup = memo(RenderFieldGroupComponent);

RenderFieldGroup.displayName = "renderFieldGroup";
