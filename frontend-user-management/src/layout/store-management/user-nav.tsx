"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LogOut, LayoutDashboard, User, Package2, Plus ,Lock } from "lucide-react";
import { signOut, useSession } from "~/lib/auth-client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useHasStore } from "~/hooks/useHasStore";

export function UserNav() {
  const router = useRouter();
  const { data: session } = useSession();
  const { hasStore } = useHasStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.shiftKey && event.metaKey) {
        switch (event.key.toLowerCase()) {
          case "p":
            void handleNavigation("/store-management/profile");
            break;
          case "d":
            void handleNavigation("/store-management/dashboard");
            break;
          case "g":
            void handleNavigation("/store-management/products", true);
            break;
          case "h":
            void handleNavigation("/store-management/products/add" ,true);
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
      await signOut();
      router.push("/");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Logout failed:", error.message);
      }
    }
  };

  if (!session) {
    return null;
  }

  const userInitials = session.user?.email
    ? session.user.email.substring(0, 2).toUpperCase()
    : "UN";

  const handleNavigation = (path: string, requiresStore: boolean = false) => {
    if (requiresStore && !hasStore) {
      return;
    }
    void router.push(path);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            {session.user?.image ? (
              <AvatarImage src={session.user?.image} />
            ) : (
              <AvatarFallback>{userInitials}</AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{session.user?.email}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {session.user?.name ?? "User"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem 
            onClick={() => handleNavigation("/store-management/profile")}>
              <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleNavigation("/store-management/dashboard")}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
            <DropdownMenuShortcut>⇧⌘D</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem 
            onClick={() => handleNavigation("/store-management/products", true)}
            className={!hasStore ? "opacity-50 cursor-not-allowed" : ""}
          >
            {hasStore ? (
              <Package2 className="mr-2 h-4 w-4" />
            ) : (
              <Lock className="mr-2 h-4 w-4 text-muted-foreground" />
            )}
            <span>Products</span>
            <DropdownMenuShortcut>⇧⌘G</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => handleNavigation("/store-management/products/add", true)}
            className={!hasStore ? "opacity-50 cursor-not-allowed" : ""}
          >
            {hasStore ? (
              <Plus className="mr-2 h-4 w-4" />
            ) : (
              <Lock className="mr-2 h-4 w-4 text-muted-foreground" />
            )}
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