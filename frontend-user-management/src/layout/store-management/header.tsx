"use client";

import { ThemeToggle } from "~/components/ThemeToggle";
import { UserNav } from "./user-nav";
import { Button } from "~/components/ui/button";
import { SearchCommand } from "./search-dialog";
import { useSidebar } from "~/components/ui/sidebar";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "~/components/ui/hover-card";

export default function Header() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-300 bg-background dark:border-zinc-700">
      <div className="flex h-16 items-center px-2 sm:px-4">
        <div className="flex flex-1 items-center gap-2">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0 hover:bg-zinc-300 dark:hover:bg-zinc-800"
                onClick={toggleSidebar}
              >
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M9 3v18" />
                </svg>
                <span className="sr-only">Toggle sidebar</span>
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-12">
              <p className="text-xs">⌘B</p>
            </HoverCardContent>
          </HoverCard>
          <div className="flex-1">
          <SearchCommand />
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
        <ThemeToggle />
        <UserNav />
        </div>
      </div>
    </header>
  );
}