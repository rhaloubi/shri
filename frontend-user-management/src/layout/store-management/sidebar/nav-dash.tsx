
import Link from "next/link";
import { BarChart3, Package2, Plus } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";

export function SidebarNav() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-zinc-400 text-base">General</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href="/admin/dashboard"
                className="hover:bg-zinc-300 dark:hover:bg-zinc-800 text-base py-3"
              >
                <BarChart3 className="size-5" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href="/admin/products"
                className="hover:bg-zinc-300 dark:hover:bg-zinc-800 text-base py-3"
              >
                <Package2 className="size-5" />
                <span>Products</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href="/admin/products/add"
                className="hover:bg-zinc-300 dark:hover:bg-zinc-800 text-base py-3"
              >
                <Plus className="size-5" />
                <span>Add Product</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}