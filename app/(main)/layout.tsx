import { Navbar } from "@/components/navbar/Navbar";
import { PremiumModal } from "@/components/premium/PremiumModal";

export default function ResumesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      {children}
      <PremiumModal />
    </div>
  );
}
