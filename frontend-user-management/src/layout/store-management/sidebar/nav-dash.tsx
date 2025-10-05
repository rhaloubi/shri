
"use client"

import Link from "next/link"
import { BarChart3, Package2, Plus, Lock, ShoppingBag } from "lucide-react"
import { useHasStore } from "~/hooks/useHasStore"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar"

const items = [
  {
    title: "Dashboard",
    href: "/store-management/dashboard",
    icon: BarChart3,
    allowWithoutStore: true
  },
  {
    title: "Products",
    href: "/store-management/products",
    icon: Package2,
    allowWithoutStore: false
  },
  {
    title: "Add Product",
    href: "/store-management/products/add",
    icon: Plus,
    allowWithoutStore: false
  },
  {
    title: "Orders",
    href: "/store-management/orders",
    icon: ShoppingBag,
    allowWithoutStore: false
  },
]

export function SidebarNav() {
  const { hasStore } = useHasStore();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-zinc-400 text-base">General</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild>
                {(item.allowWithoutStore || hasStore) ? (
                  <Link
                    href={item.href}
                    className="hover:bg-zinc-300 dark:hover:bg-zinc-800 text-base py-3"
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