
"use client"

import Link from "next/link"
import { LayoutTemplate, Lock } from "lucide-react"
import { useHasStore } from "~/hooks/useHasStore"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar"

const items = [
  {
    title: "E-store",
    href: "/store-management/e-store",
    icon: LayoutTemplate,
    allowWithoutStore: false
  }
]

export function SidebarEstore() {
  const { hasStore } = useHasStore();

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild>
                {(item.allowWithoutStore || hasStore) ? (
                  <Link
                    href={item.href}
                    className="bg-sidebar-primary text-sidebar-primary-foreground w-full shadow-none flex items-center justify-center gap-2 text-center"
                    >
                    <item.icon className="size-5" />
                    <span>{item.title}</span>
                    </Link>

                ) : (
                  <div className="opacity-50 cursor-not-allowed text-base py-3 flex items-center gap-2">
                    <Lock className="size-5 text-muted-foreground" />
                    <span>{item.title}</span>
                  </div>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}