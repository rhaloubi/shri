
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

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
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarGroupLabel,
} from "~/components/ui/sidebar";
import { useHasStore } from "~/hooks/useHasStore";
import { Lock } from "lucide-react";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  allowWithoutStore?: boolean;
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
  const { hasStore } = useHasStore();
  
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
                      <SidebarMenuSubButton
                        asChild={subItem.allowWithoutStore || hasStore}
                        className={!subItem.allowWithoutStore && !hasStore ? 'opacity-50  cursor-not-allowed' : ''}
                      >
                        {(subItem.allowWithoutStore || hasStore) ? (
                          <Link
                            href={`/store-management/${subItem.url}`}
                            className="dark:hover:bg-gray-800 hover:bg-gray-200 text-md py-3"
                          >
                            {subItem.icon && <subItem.icon className="size-5" />}
                            <span>{subItem.title}</span>
                          </Link>
                        ) : (
                          <div className="flex items-center gap-2 text-md py-3">
                            <Lock className="size-4 text-muted-foreground" />
                            <span>{subItem.title}</span>
                          </div>
                        )}
                      </SidebarMenuSubButton>
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