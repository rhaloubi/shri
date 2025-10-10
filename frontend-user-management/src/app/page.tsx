
import { ppEditorialNewUltralightItalic, inter } from "~/styles/fonts/fonts"
import { GalleryVerticalEnd } from "lucide-react"
import { Button } from "~/components/ui/button"
import Link from "next/link"

export default function MarketplacePage() {
  return (
    <div
      className={`min-h-screen bg-[#141414] flex flex-col ${ppEditorialNewUltralightItalic.variable} ${inter.variable}`}
    >
      {/* Header */}
      <header className="w-full px-8 py-6 flex items-center justify-between border-b border-white/10">
        <Link href="/" className="flex items-center gap-2 font-medium text-white/80 hover:text-white transition-colors">
          <div className="bg-white text-[#141414] flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          <span className={`${inter.className} text-sm font-medium`}>StoreManager</span>
        </Link>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="text-white/70 hover:text-white hover:bg-white/5 border border-white/20 rounded-full px-6"
            onClick={() => window.location.href = "/store-management/login"}
          >
            Login
          </Button>
          <Button className="bg-white text-[#141414] hover:bg-white/90 rounded-full px-6 font-medium" onClick={() => window.location.href = "/store-management/signup"}>Sign Up</Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-8 py-16">
        <div className="max-w-4xl w-full text-center space-y-8">
          {/* Coming Soon Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5">
            <div className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className={`${inter.className} text-sm text-white/70`}>Coming Soon</span>
          </div>

          {/* Main Heading */}
          <h1
            className={`${ppEditorialNewUltralightItalic.className} text-6xl md:text-8xl font-light italic text-white/90 tracking-tighter leading-[110%]`}
          >
            Marketplace
            <br />
            is on the way
          </h1>

          {/* Description */}
          <div className="max-w-2xl mx-auto space-y-6">
            <p className={`${inter.className} text-lg text-white/60 font-light leading-relaxed`}>
              While our marketplace is being crafted, discover our powerful store management service. Create your own
              professional e-store in just 20 minutes.
            </p>

            <div className="h-px bg-white/10 w-full max-w-md mx-auto" />

            <p className={`${inter.className} text-base text-white/50 font-light`}>
              No technical skills required. Beautiful templates. Powerful features. Everything you need to start selling
              online.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button
              size="lg"
              className="bg-white text-[#141414] hover:bg-white/90 rounded-full px-8 py-6 font-medium text-base"
              onClick={() => window.location.href = "/store-management/signup"}
            >
              Try Store Manager
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="text-white/70 hover:text-white hover:bg-white/5 border border-white/20 rounded-full px-8 py-6"
            >
              Learn More
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
            <div className="p-6 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
              <div className="size-10 rounded-md bg-white/10 flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className={`${inter.className} text-white/90 font-medium mb-2`}>Quick Setup</h3>
              <p className={`${inter.className} text-sm text-white/50 font-light`}>
                Launch your store in 20 minutes with our intuitive setup wizard
              </p>
            </div>

            <div className="p-6 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
              <div className="size-10 rounded-md bg-white/10 flex items-center justify-center mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className={`${inter.className} text-white/90 font-medium mb-2`}>Beautiful Design</h3>
              <p className={`${inter.className} text-sm text-white/50 font-light`}>
                Professional templates that make your products shine
              </p>
            </div>

            <div className="p-6 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
              <div className="size-10 rounded-md bg-white/10 flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className={`${inter.className} text-white/90 font-medium mb-2`}>Full Control</h3>
              <p className={`${inter.className} text-sm text-white/50 font-light`}>
                Manage inventory, orders, and customers all in one place
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-8 py-6 border-t border-white/10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className={`${inter.className} text-sm text-white/40`}>© 2025 StoreManager. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className={`${inter.className} text-sm text-white/50 hover:text-white/80 transition-colors`}>
              Privacy
            </Link>
            <Link href="#" className={`${inter.className} text-sm text-white/50 hover:text-white/80 transition-colors`}>
              Terms
            </Link>
            <Link href="#" className={`${inter.className} text-sm text-white/50 hover:text-white/80 transition-colors`}>
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
