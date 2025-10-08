
import { Button } from "~/components/ui/button"
import { Card } from "~/components/ui/card"
import { Store, Palette, Type, Share2 } from "lucide-react"

interface EmptyStoreStateProps {
  onCreateStore: () => void
}

export function  EmptyStoreState({ onCreateStore }: EmptyStoreStateProps) {
  return (

      <main className="max-w-6xl mx-auto">
       <Card className=" w-full dark:bg-black text-center">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Store className="h-10 w-10 text-primary" />
          </div>
        </div>

        <h1 className="text-3xl font-bold tracking-tight mb-3">Create Your E-Store for Free</h1>

        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          Build a beautiful online store with custom branding, colors, and typography in minutes.
        </p>

        <div className="grid grid-cols-3 gap-6 mb-10 max-w-lg mx-auto">
          <div className="space-y-2">
            <div className="h-12 w-12 rounded-lg bg-accent flex items-center justify-center mx-auto">
              <Palette className="h-6 w-6 text-primary" />
            </div>
            <div className="text-sm font-medium">Custom Colors</div>
            <div className="text-xs text-muted-foreground">Curated palettes</div>
          </div>

          <div className="space-y-2">
            <div className="h-12 w-12 rounded-lg bg-accent flex items-center justify-center mx-auto">
              <Type className="h-6 w-6 text-primary" />
            </div>
            <div className="text-sm font-medium">Typography</div>
            <div className="text-xs text-muted-foreground">Beautiful fonts</div>
          </div>

          <div className="space-y-2">
            <div className="h-12 w-12 rounded-lg bg-accent flex items-center justify-center mx-auto">
              <Share2 className="h-6 w-6 text-primary" />
            </div>
            <div className="text-sm font-medium">Social Links</div>
            <div className="text-xs text-muted-foreground">Connect accounts</div>
          </div>
        </div>

        <div className="flex justify-center">
            <Button onClick={onCreateStore} size="lg" className="text-base justify-center w-50 px-8 cursor-pointer">
                Create E-Store
            </Button>
        </div>


        <p className="text-sm text-muted-foreground mt-4">No credit card required • Free forever</p>
      </Card>
      </main>
  )
}
