import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

import { AppSidebar } from "@/components/ui/app-sidebar";
import { MainBreadcrumbs } from "@/components/main/main-breadcrumbs";

import { ThemeToggle } from "@/components/theme-toggle";

import { ConnectionStatus, NetworkStatus } from "@/components/NetworkStatus";
import { QueryProviders } from "@/components/QueryProvider";
import { InitStores } from "@/hooks/store/storeProvider";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { getAllData } from "@/actions/prisma.actions";
import { cookies } from "next/headers";

export default async function ResumesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["allData"],
    queryFn: getAllData,
  });

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <QueryProviders dehydratedState={dehydrate(queryClient)}>
      <SidebarProvider defaultOpen={defaultOpen}>
        <div className="flex h-screen overflow-hidden  w-full">
          <AppSidebar />
          <SidebarInset>
            <header className="fixed inset-0 z-10 flex h-12 items-center w-full gap-2 border-b bg-sidebar ease-linear ">
              <div className="flex items-center justify-between px-4 w-full">
                <div className="flex items-center gap-2 w-full">
                  <SidebarTrigger className="-ml-1" />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  <MainBreadcrumbs />
                </div>
                <ThemeToggle />
              </div>
            </header>
            <main className="flex-grow overflow-auto p-6 mt-[3rem] size-full">
              {children}
            </main>
            <InitStores />
            <NetworkStatus />
            <ConnectionStatus />
          </SidebarInset>
        </div>
      </SidebarProvider>
    </QueryProviders>
  );
}
