import Link from "next/link"
import { Facebook, Instagram, MapPin, Phone } from "lucide-react"
import type { Store, StoreSettings } from "~/hooks/use-store-data"

interface FooterProps {
  store: Store
  settings: StoreSettings
}

export function Footer({ store, settings }: FooterProps) {
  return (
    <footer 
      className="border-t bg-black border-white"
      
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <h2 
                className="font-serif text-3xl font-light tracking-tight"
                style={{ color: settings.secondaryColor }}
              >
                {store.name}
              </h2>
            </Link>
            <p 
              className="text-sm leading-relaxed"
              style={{ color: `${settings.secondaryColor}99` }}
            >
              {store.description}
            </p>
            <div className="flex gap-4 pt-2">
              {settings.facebookUrl && (
                <Link
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:opacity-80"
                  style={{ color: settings.secondaryColor }}
                >
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </Link>
              )}
              {settings.instagramUrl && (
                <Link
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:opacity-80"
                  style={{ color: settings.secondaryColor }}
                >
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </Link>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 
              className="font-medium mb-4"
              style={{ color: settings.secondaryColor }}
            >
              Navigation
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/" 
                  className="text-sm transition-colors hover:opacity-80"
                  style={{ color: `${settings.secondaryColor}99` }}
                >
                  Home
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 
              className="font-medium mb-4"
              style={{ color: settings.secondaryColor }}
            >
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm">
                <Phone 
                  className="h-4 w-4 mt-0.5 flex-shrink-0"
                  style={{ color: settings.secondaryColor }}
                />
                <a 
                  href={`tel:${store.phoneNumber}`} 
                  className="transition-colors hover:opacity-80"
                  style={{ color: `${settings.secondaryColor}99` }}
                >
                  {store.phoneNumber}
                </a>
              </li>
            </ul>
          </div>

          {/* Location */}
          <div>
            <h3 
              className="font-medium mb-4"
              style={{ color: settings.secondaryColor }}
            >
              Location
            </h3>
            <div className="flex items-start gap-2 text-sm">
              <MapPin 
                className="h-4 w-4 mt-0.5 flex-shrink-0"
                style={{ color: settings.secondaryColor }}
              />
              <address 
                className="not-italic leading-relaxed"
                style={{ color: `${settings.secondaryColor}99` }}
              >
                {store.street}
                <br />
                {store.city}, {store.state}
                <br />
                United States
              </address>
            </div>
          </div>
        </div>

        <div 
          className="mt-12 pt-8 border-t"
          style={{ borderColor: `${settings.secondaryColor}33` }}
        >
          <p 
            className="text-center text-sm"
            style={{ color: `${settings.secondaryColor}99` }}
          >
            © {new Date().getFullYear()} {store.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
