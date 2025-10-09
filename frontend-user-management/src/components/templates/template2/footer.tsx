import { Facebook, Instagram, MapPin, Phone, Mail } from "lucide-react"
import Link from "next/link"
import type { Store, StoreSettings } from "~/hooks/use-store-data"

interface FooterProps {
  store: Store
  settings: StoreSettings
}

export function Footer({ store, settings }: FooterProps) {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 
              className="text-3xl font-black mb-4"
              style={{ color: settings.primaryColor }}
            >
              {store.name}
            </h3>
            <p className="text-gray-400 mb-6">{store.description}</p>
            <div className="flex gap-4">
              {settings.facebookUrl && (
                <Link
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full transition-colors"
                  style={{ 
                    backgroundColor: settings.primaryColor,
                    '&:hover': { opacity: 0.8 }
                  }}
                >
                  <Facebook className="h-5 w-5" />
                </Link>
              )}
              {settings.instagramUrl && (
                <Link
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full transition-colors"
                  style={{ 
                    backgroundColor: settings.primaryColor,
                    '&:hover': { opacity: 0.8 }
                  }}
                >
                  <Instagram className="h-5 w-5" />
                </Link>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 
              className="text-xl font-bold mb-4"
              style={{ color: settings.primaryColor }}
            >
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 
              className="text-xl font-bold mb-4"
              style={{ color: settings.primaryColor }}
            >
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-1" />
                <span>
                  {store.street}
                  <br />
                  {store.city}, {store.state}
                </span>
              </li>
              {store.phoneNumber && (
                <li className="flex items-center gap-3 text-gray-400">
                  <Phone className="h-5 w-5 flex-shrink-0" />
                  <a href={`tel:${store.phoneNumber}`}>{store.phoneNumber}</a>
                </li>
              )}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 
              className="text-xl font-bold mb-4"
              style={{ color: settings.primaryColor }}
            >
              Newsletter
            </h4>
            <p className="text-gray-400 mb-4">Subscribe to get special offers and updates.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none"
                style={{ 
                  '&:focus': {
                    borderColor: settings.primaryColor
                  }
                }}
              />
              <button 
                className="px-6 py-3 rounded-full font-bold transition-colors"
                style={{ 
                  backgroundColor: settings.primaryColor,
                  color: settings.secondaryColor,
                  '&:hover': { opacity: 0.8 }
                }}
              >
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} {store.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
