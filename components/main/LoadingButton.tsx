import { Loader2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";

interface Props {
  loading: boolean;
}

export const LoadingButton = ({
  loading,
  disabled,
  className,
  ...props
}: Props &
  React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants>) => {
  return (
    <Button
      disabled={loading || disabled}
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      {loading && <Loader2 className="size-5 animate-spin" />}
      {props.children}
    </Button>
  );
};
