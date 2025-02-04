import { Navbar } from "@/components/navbar/Navbar";
import { PremiumModal } from "@/components/premium/PremiumModal";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import { auth } from "@clerk/nextjs/server";
import { SubsProvider } from "./SubsProvider";

export default async function ResumesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const userSubsLevel = await getUserSubscriptionLevel(userId);
  return (
    <SubsProvider userSubsLevel={userSubsLevel}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        {children}
        <PremiumModal />
      </div>
    </SubsProvider>
  );
}
