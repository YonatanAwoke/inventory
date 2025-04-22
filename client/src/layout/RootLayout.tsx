
import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/Header/Header";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet, Navigate } from "react-router-dom";

function RootLayout() {
  const isAuthenticated = !!localStorage.getItem("token");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

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
