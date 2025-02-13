import { PremiumModal } from "@/components/premium/PremiumModal";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import { auth } from "@clerk/nextjs/server";
import { SubsProvider } from "../../components/SubsProvider";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { MainBreadcrumbs } from "@/components/main/main-breadcrumbs";
import InitResumesStore from "@/hooks/store/storeProvider";
import { getAllResumes } from "@/actions/prisma.actions";

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

  const resumes = await getAllResumes();
  return (
    <SubsProvider userSubsLevel={userSubsLevel}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 h-4 bg-accent"
              />
              <MainBreadcrumbs />
            </div>
          </header>
          {children}
          <InitResumesStore resumes={resumes} />
          <PremiumModal />
        </SidebarInset>
      </SidebarProvider>
    </SubsProvider>
  );
}
