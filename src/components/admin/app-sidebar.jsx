import {
  IconDashboard,
  IconCalendarEvent,
  IconUsers,
  IconBuildingSkyscraper,
  IconBed,
  IconFileInvoice,
  IconReceipt,
  IconCreditCard,
  IconShoppingCart,
  IconSoup,
  IconPackage,
  IconTags,
  IconClipboardList,
  IconReportAnalytics,
  IconUserShield,
  IconSettings,
  IconHelp,
} from "@tabler/icons-react"

import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar"

/* ------------------------------------------------------------------ */
/* Resort Management Sidebar Data                                     */
/* ------------------------------------------------------------------ */

const data = {
  user: {
    name: "Admin User",
    email: "admin@resort.com",
    avatar: "/avatars/admin.png",
  },

  navMain: [
    { title: "Dashboard", url: "/", icon: IconDashboard },

    { title: "Reservations Management", url: "/reservations", icon: IconCalendarEvent },

    { title: "Guests Management", url: "/guests", icon: IconUsers },

    { title: "Employees Management", url: "/employees", icon: IconUsers },

    { title: "Room Management", url: "/rooms", icon: IconBuildingSkyscraper },

    { title: "Room Types", url: "/roomtypes", icon: IconBed },

    { title: "Folios", url: "/folios", icon: IconFileInvoice },

    { title: "Invoices", url: "/invoices", icon: IconReceipt },

    { title: "Payments", url: "/payments", icon: IconCreditCard },

    { title: "F&B Management", url: "/fnb", icon: IconSoup },

    { title: "Menu Items", url: "/menu-items", icon: IconClipboardList },

    { title: "Orders", url: "/orders", icon: IconShoppingCart },

    { title: "Inventory", url: "/inventory", icon: IconPackage },

    { title: "Purchase Orders", url: "/purchase-orders", icon: IconClipboardList },

    { title: "Pricing & Rate Plans", url: "/pricing", icon: IconTags },

    { title: "Promotion Packages", url: "/promotions", icon: IconTags },

    { title: "HR & Payroll", url: "/hr-payroll", icon: IconUsers },

    { title: "Roles & Permissions", url: "/roles", icon: IconUserShield },

    { title: "Reporting", url: "/reports", icon: IconReportAnalytics },
  ],

  navSecondary: [
    { title: "Settings", url: "/settings", icon: IconSettings },
    { title: "Support Center", url: "/support", icon: IconHelp },
  ],
}

/* ------------------------------------------------------------------ */
/* Sidebar Component                                                   */
/* ------------------------------------------------------------------ */

export function AppSidebar(
  props
) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-2!"
            >
              <NavLink to="/" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  RMS
                </div>
                <span className="text-base font-semibold">
                  Resort Admin
                </span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Main Content */}
      <SidebarContent  className="no-scrollbar">
        <NavMain items={data.navMain} />
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <NavSecondary items={data.navSecondary} className="mt-auto" />
        <NavUser user={data.user} />
      </SidebarFooter>

    </Sidebar>
  )
}