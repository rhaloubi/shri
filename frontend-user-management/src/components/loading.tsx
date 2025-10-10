import { Spinner } from "~/components/ui/spinner"

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-black">
      {/* Spinner */}
      <Spinner className="h-16 w-16 text-white" />

      {/* Loading Text */}
      <div className="flex flex-col items-center gap-3">
        <h2 className="text-2xl font-semibold text-white">Loading</h2>
        <p className="text-sm text-white/70">Please wait while we prepare everything...</p>
      </div>

      {/* Animated Dots */}
      <div className="flex gap-2">
        <div className="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:-0.3s]" />
        <div className="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:-0.15s]" />
        <div className="h-2 w-2 animate-bounce rounded-full bg-white" />
      </div>

      {/* Optional Progress Indicator */}
      <div className="w-64 overflow-hidden rounded-full bg-white/10">
        <div className="h-1 animate-pulse bg-white" style={{ width: "60%" }} />
      </div>
    </div>
  )
}
