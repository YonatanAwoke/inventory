import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/Header/Header";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom"

function RootLayout() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <SidebarProvider>
        <div className="flex flex-1 overflow-hidden">
          <AppSidebar className="w-64 shrink-0" />
          <main className="flex-1 p-4 overflow-auto">
            <SidebarTrigger />
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}

export default RootLayout;
