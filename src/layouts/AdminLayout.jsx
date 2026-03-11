import { Outlet } from "react-router-dom"
import { AppSidebar } from "@/components/admin/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function AdminLayout() {
  
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
      }}
    >
      <AppSidebar variant="inset" />

      <SidebarInset>
        <main className="flex-1 p-4 md:p-3">
          {/* THIS is where page transforms */}
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}