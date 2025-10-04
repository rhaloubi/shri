"use client"

import { User, KeyRound } from 'lucide-react'
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { authClient, useSession } from "~/lib/auth-client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../../components/ui/alert-dialog"

export default function ChangePasswordPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!session) {
    router.push('/store-management/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setShowAlert(true);
  };

  const handleConfirmChange = async () => {
    try {
      setIsLoading(true);
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        setError(error.message);
        setShowAlert(false);
        return;
      }

      setError('Password changed successfully!');
      setTimeout(() => {
        router.push('/store-management/dashboard');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setIsLoading(false);
      setShowAlert(false);
    }
  };

  return (
    <main className="p-4 sm:p-6 md:p-8">
      <div className="mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground mb-4 sm:mb-6 pb-3 border-b">
          Manage your password settings.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
          {/* Navigation Sidebar */}
          <div className="w-full sm:w-48 flex flex-row sm:flex-col gap-2 sm:gap-1 border-b sm:border-b-0 pb-4 sm:pb-0">
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
              className="flex-1 sm:flex-none justify-start w-full bg-zinc-100 dark:bg-zinc-800 text-primary"
            >
              <KeyRound className="mr-2" /> 
              Password
            </Button>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-2">Change Password</h2>
              <p className="text-sm text-muted-foreground">
                Update your password to keep your account secure.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Current Password</label>
                <Input 
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-2 w-full sm:w-2/3 lg:w-1/2"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">New Password</label>
                <Input 
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-2 w-full sm:w-2/3 lg:w-1/2"
                  required
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Password must be at least 6 characters long.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">Confirm New Password</label>
                <Input 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-2 w-full sm:w-2/3 lg:w-1/2"
                  required
                />
              </div>

              {error && (
                <p className={`text-sm ${error.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
                  {error}
                </p>
              )}

              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          </div>
        </div>
      </div>

      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Password Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change your password? You will need to use the new password for your next login.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:space-x-2">
            <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmChange} 
              disabled={isLoading}
              className="w-full sm:w-auto mt-3 sm:mt-0"
            >
              {isLoading ? 'Confirming...' : 'Confirm Change'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}