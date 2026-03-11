// NavMain.tsx
import * as React from "react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { NavLink } from "react-router-dom"

export function NavMain({
  items,
}) {
  // exact button classes used in your existing UI (kept as a single string for copy/paste)
  const buttonClass = `
    ring-sidebar-ring
    data-[state=open]:hover:bg-sidebar-accent
    data-[state=open]:hover:text-sidebar-accent-foreground

    hover:bg-sidebar-accent
    hover:text-sidebar-accent-foreground

    bg-transparent

    data-[active=true]:bg-primary
    data-[active=true]:hover:bg-primary/90
    data-[active=true]:hover:text-primary-foreground
    data-[active=true]:active:bg-primary/90
    data-[active=true]:active:text-primary-foreground
    data-[active=true]:text-primary-foreground
  `

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <NavLink key={item.title} to={item.url} end>
              {({ isActive }) => (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    data-active={isActive}
                    tooltip={item.title}
                    className={buttonClass}
                  >
                    {/* keep icon + title markup exactly the same */}
                    {item.icon && <item.icon className="size-4" />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </NavLink>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}