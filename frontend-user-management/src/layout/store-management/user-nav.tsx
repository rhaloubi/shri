"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LogOut, LayoutDashboard, User, Package2, Plus } from "lucide-react";
import { useSession } from "../../../context/SessionContext";
import Cookies from "js-cookie";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Button } from "../../ui/button";
import { Avatar, AvatarFallback } from "../../ui/avatar";

export function UserNav() {
  const router = useRouter();
  const { session, setSession: updateSession } = useSession();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.shiftKey && event.metaKey) {
        switch (event.key.toLowerCase()) {
          case "p":
            void router.push("/admin/profile");
            break;
          case "d":
            void router.push("/admin/dashboard");
            break;
          case "g":
            void router.push("/admin/products");
            break;
          case "h":
            void router.push("/admin/products/add");
            break;
          case "z":
            void handleLogout();
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  const handleLogout = async () => {
    try {
      Cookies.remove('authToken', { path: '/' });
      updateSession(null); // Clear session data
      void router.push("/admin");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Logout failed:", error.message);
      }
    }
  };

  if (!session) {
    return null;
  }

  const userInitials = session.username
    ? session.username.substring(0, 2).toUpperCase()
    : "UN";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{session.username}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {session.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => void router.push("/admin/profile")}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => void router.push("/admin/dashboard")}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
            <DropdownMenuShortcut>⇧⌘D</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => void router.push("/admin/products")}>
            <Package2 className="mr-2 h-4 w-4" />
            <span>Products</span>
            <DropdownMenuShortcut>⇧⌘G</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => void router.push("/admin/products/add")}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Add Product</span>
            <DropdownMenuShortcut>⇧⌘H</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => void handleLogout()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Z</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}