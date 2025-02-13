import { Loader2 } from "lucide-react";

export default function loading() {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Loader2 className="size-32 animate-spin" />
    </div>
  );
}
