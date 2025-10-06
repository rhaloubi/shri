import { useHasStore } from "~/hooks/useHasStore"
import Link from "next/link"

export default function HasStore() {
  const { hasStore } = useHasStore()
  const announcements = [
    {
      text: "CREATE YOUR STORE TO UNLOCK THE DASHBOARD FEATURES",
      link: "/store-management/create-store",
      cta: "CREATE NOW",
    },
    {
      text: "START MANAGING YOUR BUSINESS — CREATE YOUR STORE TODAY",
      link: "/store-management/create-store",
      cta: "GET STARTED",
    },
    {
      text: "UNLOCK INSIGHTS AND SALES TOOLS BY CREATING YOUR STORE",
      link: "/store-management/create-store",
      cta: "SETUP STORE",
    },
    {
      text: "ACCESS ANALYTICS & DASHBOARD — CREATE YOUR STORE FIRST",
      link: "/store-management/create-store",
      cta: "CREATE STORE",
    },
  ]

  return (
    <>
      {hasStore === false && (
        <div className="fixed top-0 left-0 right-0 z-[100] w-full bg-announcement-bg text-announcement-foreground overflow-hidden border-b border-black dark:border-white">
          <div className="flex animate-scroll">
            {/* First set of announcements */}
            {announcements.map((announcement, index) => (
              <div
                key={`first-${index}`}
                className="flex items-center justify-center gap-2 px-8 py-2 whitespace-nowrap"
              >
                <span className="text-xs font-medium tracking-wide">{announcement.text}</span>
                {announcement.cta && (
                  <Link
                    href={announcement.link}
                    className="text-xs font-bold underline tracking-wide hover:opacity-70 transition-opacity"
                  >
                    {announcement.cta}
                  </Link>
                )}
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {announcements.map((announcement, index) => (
              <div
                key={`second-${index}`}
                className="flex items-center justify-center gap-2 px-8 py-2 whitespace-nowrap"
              >
                <span className="text-xs font-medium tracking-wide">{announcement.text}</span>
                {announcement.cta && (
                  <Link
                    href={announcement.link}
                    className="text-xs font-bold underline tracking-wide hover:opacity-70 transition-opacity"
                  >
                    {announcement.cta}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
