import { Spinner } from "~/components/ui/spinner"

export default function LoadingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-lg text-muted-foreground">Waiting for the session...</p>
      </div>
    </main>
  )
}