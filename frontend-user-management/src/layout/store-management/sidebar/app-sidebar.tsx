"use client";

import { Settings, UserPen, KeyRound } from "lucide-react";
import {  useSession } from "~/lib/auth-client";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "~/components/ui/sidebar";
import { SidebarNav } from "./nav-dash";

const data = {
  others: [
    {
      title: "Settings",
      url: "",
      icon: Settings,
      isActive: false,
      items: [
        { title: "Profile", url: "profile", icon: UserPen },
        { title: "Password", url: "change-password", icon: KeyRound },
      ],
    },
  ],
};

export function AppSidebar({ ...props }) {
  const { data: session } = useSession();

  // Format session data to match the expected structure by NavUser
  const userData = session?.user ? { data: session.user } : null;

  return (
    <Sidebar collapsible="icon" {...props} className="border-r-0 ">
      <SidebarHeader className="relative h-16 px-2 py-4"></SidebarHeader>
      <SidebarContent>
        <SidebarNav />
        <NavMain items={data.others} />
      </SidebarContent>
      <SidebarFooter className="pb-3">
        {!session ? <div>No user data</div> : <NavUser user={userData} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}