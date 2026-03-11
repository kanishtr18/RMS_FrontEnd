import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export function SiteHeader({
  title = "Admin Dashboard",
  statusLabel = "System Online",
  roleLabel = "Admin",
}) {
  return (
    <header
      className="
        sticky top-0 z-30
        flex h-(--header-height)
        items-center
        border-b border-border
        bg-background/80 backdrop-blur
        py-1.5
      "
    >
      <div className="flex w-full items-center gap-2 px-4 lg:px-6">
        
        {/* Sidebar toggle */}
        <SidebarTrigger className="-ml-1" />

        <Separator orientation="vertical" className="h-4 mx-2" />

        {/* Page title */}
        <h1 className="text-base font-semibold tracking-tight">
          {title}
        </h1>

        {/* Right section */}
        <div className="ml-auto flex items-center gap-3">

          {statusLabel && (
            <Badge variant="outline" className="text-xs">
              {statusLabel}
            </Badge>
          )}

          {roleLabel && (
            <Badge variant="secondary" className="text-xs">
              {roleLabel}
            </Badge>
          )}

        </div>
      </div>
    </header>
  )
}