
import Link from "next/link";
import { ChevronRight ,Lock } from "lucide-react";
import type { LucideIcon  } from "lucide-react";
import { useHasStore } from "~/hooks/useHasStore"


import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarGroupLabel,
} from "~/components/ui/sidebar";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
    icon: LucideIcon;
    allowWithoutStore?: boolean;
  }[];
}

interface NavMainProps {
  items: NavItem[];
}

export function NavMain({ items }: NavMainProps) {
  const { hasStore } = useHasStore()
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-base">platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title} className="text-md py-3">
                  {item.icon && <item.icon className="size-5" />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto size-5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                    {(subItem.allowWithoutStore || hasStore) ? (
                      <Link
                        href={`/store-management/${subItem.url}`}
                        className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-gray-200 dark:hover:bg-gray-800"
                      >
                        {subItem.icon && <subItem.icon className="size-5" />}
                        <span>{subItem.title}</span>
                      </Link>
                    ):(
                      <div
                        className="flex w-full items-center text-muted-foreground gap-2 rounded-md px-2 py-2 text-sm hover:bg-gray-200 dark:hover:bg-gray-800 cursor-not-allowed"
                      >
                        <Lock className="size-5 " />
                        <span>{subItem.title}</span>
                      </div>
                    )}
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}