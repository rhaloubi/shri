"use client"

import { User, KeyRound , Building2 } from 'lucide-react'
import { Button } from "../../../../../components/ui/button"
import { Input } from "../../../../../components/ui/input"
import { useRouter } from "next/navigation"
import {  useSession } from "~/lib/auth-client";
import LoadingPage from "~/components/loading-page"
import { useHasStore } from "~/hooks/useHasStore"

export default function ProfilePage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { hasStore } = useHasStore()

  if (!session) {
    return <LoadingPage />
  }

  const { user } = session;

  return (
    <main className="p-4 sm:p-6 md:p-8 ">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground mb-4 sm:mb-6 pb-3 border-b">
          View your Profile settings and set e-mail preferences.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
          {/* Navigation Sidebar */}
          <div className="w-full sm:w-48 flex flex-row md:flex-col gap-2 sm:gap-1 border-b sm:border-b-0 pb-4 sm:pb-0">
            <Button 
              variant="ghost" 
              className="flex-1 sm:flex-none justify-start w-full hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-primary transition-colors font-medium"
              onClick={() => router.push('/store-management/profile')}
            >
              <User className="mr-2" /> 
              Profile
            </Button>
            <Button 
              variant="ghost" 
              className="flex-1 sm:flex-none justify-start w-full hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-primary transition-colors font-medium"
              onClick={() => router.push('/store-management/change-password')}
            >
              <KeyRound className="mr-2" /> 
              Password
            </Button>
            {hasStore ? (
             <Button
              variant="ghost"
              className="flex-1 sm:flex-none justify-start w-full hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-primary transition-colors font-medium"
              onClick={() => router.push('/store-management/settings/info')}
            >
              <Building2 className="mr-2" />
              Store Info
            </Button>
            ) : null}
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-2">Profile</h2>
              <p className="text-sm text-muted-foreground">
                This is how others will see you on the site.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Username</label>
                <Input  
                  value={user?.name} 
                  disabled 
                  readOnly 
                  className="mt-2 w-full sm:w-2/3 lg:w-1/2" 
                />
                <p className="text-sm text-muted-foreground mt-2">
                  This is your public display name. It can be your real name or a pseudonym.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">Email</label>
                <Input 
                  value={user?.email}
                  disabled 
                  readOnly
                  className="mt-2 w-full sm:w-2/3 lg:w-1/2" 
                />
                <p className="text-sm text-muted-foreground mt-2">
                  You can manage verified email addresses in your email settings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}