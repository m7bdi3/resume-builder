import { Circle, Square, Squircle } from "lucide-react";
import { Button } from "../../ui/button";
import { useSubsLevel } from "@/app/(main)/SubsProvider";
import usePremiumModal from "@/hooks/usePremiumModal";
import { canUseCustom } from "@/lib/permissions";

export const BorderStyles = {
  SQUARE: "square",
  CIRCLE: "circle",
  SQUIRCLE: "squircle",
};

const borderStyles = Object.values(BorderStyles);

interface Props {
  borderStyle: string | undefined;
  onChange: (borderStyle: string) => void;
}
export const BorderStyleButton = ({ borderStyle, onChange }: Props) => {
  const subLevel = useSubsLevel();
  const { open, setOpen } = usePremiumModal();

  const handleClick = () => {
    if (!canUseCustom(subLevel)) {
      setOpen(!open);
      return;
    }
    const currentIndex = borderStyle ? borderStyles.indexOf(borderStyle) : 0;
    const nextIndex = (currentIndex + 1) % borderStyles.length;
    onChange(borderStyles[nextIndex]);
  };

  const Icon =
    borderStyle === "square"
      ? Square
      : borderStyle === "circle"
        ? Circle
        : Squircle;
  return (
    <Button
      variant={"outline"}
      size={"icon"}
      title="Change border style"
      onClick={handleClick}
    >
      <Icon className="size-5" />
    </Button>
  );
};
