import * as React from "react"
import {
  IconBrandProducthunt,
  IconCalendarCheck,
  IconCamera,
  IconCashRegister,
  IconDashboard,
  IconFileAi,
  IconFileDescription,
  IconListDetails,
  IconPremiumRights,
  IconReportMoney,
  IconTax,
  IconUsersPlus,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { StoreIcon } from "lucide-react"

const data = {
  // user: {
  //   name: "shadcn",
  //   email: "new@example.com",
  //   avatar: "/avatars/shadcn.jpg",
  // },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: IconDashboard,
    },
    {
      title: "Products",
      url: "/product",
      icon: IconBrandProducthunt,
    },
    {
      title: "Category",
      url: "/category",
      icon: IconListDetails,
    },
    {
      title: "Sales",
      url: "/sale",
      icon: IconCashRegister,
    },
    {
      title: "Purchase",
      url: "/purchase",
      icon: IconReportMoney,
    },
    {
      title: "Revenue",
      url: "/revenue",
      icon: IconTax,
    },
    {
      title: "Budget",
      url: "/budget",
      icon: IconPremiumRights,
    },
    {
      title: "Suppliers",
      url: "/supplier",
      icon: IconUsersPlus,
    },
    {
      title: "Appointment",
      url: "/appointment",
      icon: IconCalendarCheck,
    },
    {
      title: "Prescription",
      url: "/prescription",
      icon: IconFileDescription,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  // navSecondary: [
  //   {
  //     title: "Settings",
  //     url: "#",
  //     icon: IconSettings,
  //   },
  //   {
  //     title: "Get Help",
  //     url: "#",
  //     icon: IconHelp,
  //   },
  //   {
  //     title: "Search",
  //     url: "#",
  //     icon: IconSearch,
  //   },
  // ],
  // documents: [
  //   {
  //     name: "Data Library",
  //     url: "#",
  //     icon: IconDatabase,
  //   },
  //   {
  //     name: "Reports",
  //     url: "#",
  //     icon: IconReport,
  //   },
  //   {
  //     name: "Word Assistant",
  //     url: "#",
  //     icon: IconFileWord,
  //   },
  // ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <StoreIcon className="!size-5" />
                <span className="text-base font-semibold">Inventory</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter> */}
    </Sidebar>
  )
}
