"use client"

import { useState, useEffect } from "react"
import { Building2, Store, Phone, MapPin, Eye, Pencil,User , KeyRound  } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog"
import { getCookie } from "cookies-next"
import { toast, Toaster } from "sonner"
import { useSession } from "~/lib/auth-client"
import { useRouter } from "next/navigation"
import LoadingPage from "~/components/loading-page"

type StoreOwner = {
  ID: string
  BusinessName: string
  Phone: string
}

type StoreDetails = {
  ID: string
  Name: string
  Description: string
  Street: string
  City: string
  State: string
  IsActive: boolean
}

export default function StoreInfoPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [storeOwner, setStoreOwner] = useState<StoreOwner | null>(null)
  const [storeDetails, setStoreDetails] = useState<StoreDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoadingStore, setIsLoadingStore] = useState(false)
  const [isEditingOwner, setIsEditingOwner] = useState(false)
  const [isEditingStore, setIsEditingStore] = useState(false)
  
  const [editedOwner, setEditedOwner] = useState<StoreOwner>({
    ID: '',
    BusinessName: '',
    Phone: ''
  })
  
  const [editedStore, setEditedStore] = useState<StoreDetails>({
    ID: '',
    Name: '',
    Description: '',
    Street: '',
    City: '',
    State: '',
    IsActive: false
  })
  

  useEffect(() => {
    fetchStoreOwner()
  }, [])

  const fetchStoreOwner = async () => {
    try {
      const token = getCookie("better-auth.jwt")
      if (!token) {
        toast.error("Authentication token not found")
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/store-owners`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: 'include',
        cache: 'no-store'
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error("Store owner fetch error:", errorData)
        throw new Error("Failed to fetch store owner information")
      }

      const data = await response.json()
      
      const ownerData = Array.isArray(data) ? data[0] : data
      setStoreOwner(ownerData)
    } catch (error) {
      console.error("Error fetching store owner:", error)
      toast.error(error instanceof Error ? error.message : "Failed to load store owner information")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStoreDetails = async () => {
    setIsLoadingStore(true)
    try {
      const token = getCookie("better-auth.jwt")
      if (!token) {
        toast.error("Authentication token not found")
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stores`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: 'include',
        cache: 'no-store'
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error("Store details fetch error:", errorData)
        throw new Error("Failed to fetch store details")
      }

      const data = await response.json()
      setStoreDetails(data[0])
    } catch (error) {
      console.error("Error fetching store details:", error)
      toast.error(error instanceof Error ? error.message : "Failed to load store details")
    } finally {
      setIsLoadingStore(false)
    }
  }

  const handleUpdateStoreOwner = async () => {
    if (!editedOwner || !storeOwner) return

    // Validate phone number format
    const phoneRegex = /^\+[0-9]{12}$/
    if (!phoneRegex.test(editedOwner.Phone)) {
      toast.error("Phone number must be in format: +212XXXXXXXXX")
      return
    }

    try {
      const token = getCookie("better-auth.jwt")
      if (!token) {
        toast.error("Authentication token not found")
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/store-owners/${storeOwner.ID}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          business_name: editedOwner.BusinessName,
          phone: editedOwner.Phone,
        }),
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(errorData || "Failed to update store owner information")
      }

      const updatedData = await response.json()
      setStoreOwner(updatedData) // Update the store owner state with the response data
      setIsEditingOwner(false)
      setEditedOwner({
        ID: '',
        BusinessName: '',
        Phone: ''
      })
      toast.success("Store owner information updated successfully")
    } catch (error) {
      console.error("Error updating store owner:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update store owner information")
    }
  }

  const handleUpdateStore = async () => {
    if (!editedStore || !storeDetails) return

    try {
      const token = getCookie("better-auth.jwt")
      if (!token) {
        toast.error("Authentication token not found")
        return
      }

      // Create FormData object
      const formData = new FormData()
      formData.append("name", editedStore.Name)
      formData.append("description", editedStore.Description)
      formData.append("street", editedStore.Street)
      formData.append("city", editedStore.City)
      formData.append("state", editedStore.State)
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stores/${storeDetails.ID}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // Remove Content-Type header to let the browser set it with the boundary
        },
        body: formData,
        credentials: 'include',
      })
      
      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(errorData || "Failed to update store details")
      }
      
      await fetchStoreDetails()
      setIsEditingStore(false)
      setEditedStore({
        ID: '',
        Name: '',
        Description: '',
        Street: '',
        City: '',
        State: '',
        IsActive: false
      })
      toast.success("Store details updated successfully")
    } catch (error) {
      console.error("Error updating store:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update store details")
    }
  }

  if (!session) {
    return <LoadingPage />
  }

  if (isLoading) {
    return (
      <main className="p-4 sm:p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="p-4 sm:p-6 md:p-8">
      <Toaster position="top-right" expand={true} richColors />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Store Information</h1>
        <p className="text-muted-foreground mb-4 sm:mb-6 pb-3 border-b">
          View your store owner details and business information.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
          <div className="w-full sm:w-48 flex flex-row md:flex-col gap-2 sm:gap-1 border-b sm:border-b-0 pb-4 sm:pb-0">
           <Button 
              variant="ghost" 
              className="flex-1 sm:flex-none justify-start w-full hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-primary transition-colors font-medium"
              onClick={() => router.push('/store-management/settings/profile')}
            >
              <User className="mr-2" /> 
              Profile
            </Button>
            <Button 
              variant="ghost" 
              className="flex-1 sm:flex-none justify-start w-full hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-primary transition-colors font-medium"
              onClick={() => router.push('/store-management/settings/change-password')}
            >
              <KeyRound className="mr-2" /> 
              Password
            </Button>
            <Button
              variant="ghost"
              className="flex-1 sm:flex-none justify-start w-full hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-primary transition-colors font-medium"
            >
              <Building2 className="mr-2" />
              Store Info
            </Button>
          </div>

          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-2">Store Details</h2>
              <p className="text-sm text-muted-foreground">
                Manage your store information and view store details.
              </p>
            </div>

            {storeOwner ? (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Store className="h-4 w-4" />
                      Business Name
                    </Label>
                    {!isEditingOwner && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditedOwner(storeOwner)
                          setIsEditingOwner(true)
                        }}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    )}
                  </div>
                  <Input
                    value={isEditingOwner ? (editedOwner.BusinessName || '') : (storeOwner.BusinessName || '')}
                    onChange={(e) => setEditedOwner(prev => ({ ...prev, BusinessName: e.target.value }))}
                    disabled={!isEditingOwner}
                    className="mt-2 w-full sm:w-2/3 lg:w-1/2"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </Label>
                  <Input
                    value={isEditingOwner ? (editedOwner.Phone || '') : (storeOwner.Phone || '')}
                    onChange={(e) => setEditedOwner(prev => ({ ...prev, Phone: e.target.value }))}
                    disabled={!isEditingOwner}
                    className="mt-2 w-full sm:w-2/3 lg:w-1/2"
                    placeholder="+212600000000"
                    pattern="^\+[0-9]{12}$"
                  />
                  {isEditingOwner && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Format: +212XXXXXXXXX (Morocco)
                    </p>
                  )}
                </div>

                {isEditingOwner && (
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleUpdateStoreOwner}>
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditingOwner(false)
                        setEditedOwner({
                          ID: '',
                          BusinessName: '',
                          Phone: ''
                        })
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                )}

                <div className="pt-4">
                  <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open)
                    if (open && !storeDetails) {
                      fetchStoreDetails()
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button className="w-full sm:w-auto">
                        <Eye className="h-4 w-4 mr-2" />
                        View More Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent 
                      className="max-w-2xl max-h-[80vh] overflow-y-auto"
                      aria-describedby="store-details-description"
                    >
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <MapPin className="h-5 w-5" />
                          Complete Store Details
                        </DialogTitle>
                        <p id="store-details-description" className="text-sm text-muted-foreground">
                          View detailed information about your store
                        </p>
                      </DialogHeader>

                      {isLoadingStore ? (
                        <div className="space-y-4 py-4">
                          <div className="animate-pulse space-y-3">
                            <div className="h-4 bg-muted rounded w-3/4"></div>
                            <div className="h-4 bg-muted rounded w-full"></div>
                            <div className="h-4 bg-muted rounded w-5/6"></div>
                          </div>
                        </div>
                      ) : storeDetails ? (
                        <div className="space-y-4 py-4">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Store Information</h3>
                            {!isEditingStore && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditedStore(storeDetails)
                                  setIsEditingStore(true)
                                }}
                              >
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-semibold">Store Name</Label>
                            <Input
                              value={isEditingStore ? (editedStore.Name || '') : (storeDetails.Name || '')}
                              onChange={(e) => setEditedStore(prev => ({ ...prev, Name: e.target.value }))}
                              disabled={!isEditingStore}
                              className="w-full"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-semibold">Description</Label>
                            <Input
                              value={isEditingStore ? (editedStore.Description || '') : (storeDetails.Description || '')}
                              onChange={(e) => setEditedStore(prev => ({ ...prev, Description: e.target.value }))}
                              disabled={!isEditingStore}
                              className="w-full"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-sm font-semibold">Street</Label>
                              <Input
                                value={isEditingStore ? (editedStore.Street || '') : (storeDetails.Street || '')}
                                onChange={(e) => setEditedStore(prev => ({ ...prev, Street: e.target.value }))}
                                disabled={!isEditingStore}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm font-semibold">City</Label>
                              <Input
                                value={isEditingStore ? (editedStore.City || '') : (storeDetails.City || '')}
                                onChange={(e) => setEditedStore(prev => ({ ...prev, City: e.target.value }))}
                                disabled={!isEditingStore}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-semibold">State / Region</Label>
                            <Input
                              value={isEditingStore ? (editedStore.State || '') : (storeDetails.State || '')}
                              onChange={(e) => setEditedStore(prev => ({ ...prev, State: e.target.value }))}
                              disabled={!isEditingStore}
                            />
                          </div>

                          {isEditingStore && (
                            <div className="flex gap-2 pt-4">
                              <Button onClick={handleUpdateStore}>
                                Save Changes
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setIsEditingStore(false)
                                  setEditedStore({
                                    ID: '',
                                    Name: '',
                                    Description: '',
                                    Street: '',
                                    City: '',
                                    State: '',
                                    IsActive: false
                                  })
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="py-8 text-center text-muted-foreground">
                          <p>No store details available</p>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <p>No store owner information available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}