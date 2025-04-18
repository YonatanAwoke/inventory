import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/Header/Header";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom"

function RootLayout() {

  return (
    <div>
      <Header/>
      <SidebarProvider>
      <div className="flex h-screen">
        <AppSidebar />
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
