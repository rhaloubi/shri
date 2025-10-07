"use client"

import { Settings, UserPen, KeyRound, Info } from "lucide-react"
import { useSession } from "~/lib/auth-client"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "~/components/ui/sidebar"
import { SidebarNav } from "./nav-dash"
import { StoreDisplay } from "./store-display"
import { Spinner } from "~/components/ui/spinner"

const data = {
  others: [
    {
      title: "Settings",
      url: "",
      icon: Settings,
      isActive: false,
      items: [
        { title: "Profile", url: "settings/profile", icon: UserPen, allowWithoutStore: true },
        { title: "Password", url: "settings/change-password", icon: KeyRound, allowWithoutStore: true },
        { title: "Info", url: "settings/info", icon: Info, allowWithoutStore: false },
      ],
    },
  ],
}

export function AppSidebar({ ...props }) {
  const { data: session } = useSession()

  const userData = session?.user ? { data: session.user } : null

  return (
    <Sidebar collapsible="icon" {...props} className="border-r-0">
      <SidebarHeader className="relative h-16 px-2 py-4">
        <StoreDisplay />
      </SidebarHeader>
      <SidebarContent>
        <SidebarNav />
        <NavMain items={data.others} />
      </SidebarContent>
      <SidebarFooter className="pb-3">{!session ? <div className="flex items-center gap-3"><Spinner /><span>Loading...</span></div>: <NavUser user={userData} />}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
