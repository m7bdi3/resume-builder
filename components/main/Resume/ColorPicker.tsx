import { useState } from "react";
import { Color, ColorChangeHandler, TwitterPicker } from "react-color";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Button } from "../../ui/button";
import { Palette } from "lucide-react";
import { useSubsLevel } from "@/app/(main)/SubsProvider";
import usePremiumModal from "@/hooks/usePremiumModal";
import { canUseCustom } from "@/lib/permissions";

interface Props {
  color: Color | undefined;
  onChange: ColorChangeHandler;
}
export const ColorPicker = ({ color, onChange }: Props) => {
  const subLevel = useSubsLevel();
  const { setOpen } = usePremiumModal();
  const [showPopOver, setShowPopOver] = useState(false);
  return (
    <Popover
      open={showPopOver}
      onOpenChange={() => {
        if (!canUseCustom(subLevel)) {
          setOpen(true);
          return;
        }
        setShowPopOver(!showPopOver);
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          size={"icon"}
          title="Change Resume Color"
          onClick={() => setShowPopOver}
        >
          <Palette className="size-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="bg-transparent border-none shadow-none"
        align="end"
      >
        <TwitterPicker color={color} onChange={onChange} triangle="top-right" />
      </PopoverContent>
    </Popover>
  );
};
