"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Plus, Trash2, ImagePlus, X, Loader2, Star } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog"
import { Input } from "~/components/ui/input"
import { toast } from "sonner"

const MAX_IMAGES = 10

interface ProductImage {
  ID: string
  URL: string
  AltText: string
  IsPrimary: boolean
  ProductID: string
}

interface ProductImageGalleryProps {
  images: ProductImage[]
  onAddImages: (files: File[]) => Promise<void>
  onDeleteImage: (imageId: string) => Promise<void>
  onSetPrimaryImage: (imageId: string) => Promise<void>
  onUpdateAltText: (imageId: string, altText: string) => Promise<void>
}

export function ProductImageGallery({ 
  images, 
  onAddImages, 
  onDeleteImage,
  onSetPrimaryImage,
  onUpdateAltText 
}: ProductImageGalleryProps) {
  const [isAddImageOpen, setIsAddImageOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null)
  const [isSettingPrimaryId, setIsSettingPrimaryId] = useState<string | null>(null)
  const [editingAltText, setEditingAltText] = useState<{ id: string; text: string } | null>(null)

  const remainingSlots = MAX_IMAGES - images.length
  const primaryImage = images.find(img => img.IsPrimary) || images[0]

  useEffect(() => {
    return () => {
      previewUrls.forEach(url => {
        if (url) URL.revokeObjectURL(url)
      })
    }
  }, [previewUrls])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files
    if (!fileList) return

    const files = Array.from(fileList)
    const totalSelected = selectedFiles.length + files.length

    if (totalSelected > remainingSlots) {
      toast.error(`You can only add ${remainingSlots} more image${remainingSlots === 1 ? '' : 's'}`)
      return
    }

    const newUrls = files.map(file => URL.createObjectURL(file))
    
    setSelectedFiles(prev => [...prev, ...files])
    setPreviewUrls(prev => [...prev, ...newUrls])

    e.target.value = ''
  }

  const handleRemovePreview = (index: number) => {
    const url = previewUrls[index]
    if (url) {
      URL.revokeObjectURL(url)
    }
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    setPreviewUrls(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    try {
      setIsUploading(true)
      await onAddImages(selectedFiles)
      previewUrls.forEach(url => {
        if (url) URL.revokeObjectURL(url)
      })
      setSelectedFiles([])
      setPreviewUrls([])
      setIsAddImageOpen(false)
    } catch (error) {
      console.error('Error uploading images:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDialogClose = () => {
    previewUrls.forEach(url => {
      if (url) URL.revokeObjectURL(url)
    })
    setSelectedFiles([])
    setPreviewUrls([])
    setIsAddImageOpen(false)
  }

  const handleDeleteImage = async (imageId: string) => {
    try {
      setIsDeletingId(imageId)
      await onDeleteImage(imageId)
    } finally {
      setIsDeletingId(null)
    }
  }

  const handleSetPrimary = async (imageId: string) => {
    try {
      setIsSettingPrimaryId(imageId)
      await onSetPrimaryImage(imageId)
      toast.success('Primary image updated')
    } catch (error) {
      toast.error('Failed to set primary image')
    } finally {
      setIsSettingPrimaryId(null)
    }
  }

  const handleUpdateAltText = async (imageId: string, altText: string) => {
    try {
      await onUpdateAltText(imageId, altText)
      setEditingAltText(null)
      toast.success('Alt text updated')
    } catch (error) {
      toast.error('Failed to update alt text')
    }
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square rounded-lg overflow-hidden border">
        {primaryImage ? (
          <Image
            src={primaryImage.URL}
            alt={primaryImage.AltText || "Main product image"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
            No image available
          </div>
        )}
      </div>

      {/* Thumbnails and Image Management */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium">Images ({images?.length || 0})</h3>
            <p className="text-xs text-muted-foreground">
              {remainingSlots} slot{remainingSlots === 1 ? '' : 's'} remaining
            </p>
          </div>
          <Dialog open={isAddImageOpen} onOpenChange={setIsAddImageOpen}>
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                variant="outline"
                disabled={remainingSlots === 0}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Image
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Images</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-4">
                  <input
                    type="file"
                    id="image-upload"
                    multiple
                    accept="image/png,image/jpeg"
                    className="hidden"
                    onChange={handleImageSelect}
                    disabled={isUploading}
                  />
                  
                  {previewUrls.length > 0 ? (
                    <>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {previewUrls.map((url, index) => (
                          <div key={url} className="relative group aspect-square">
                            <Image
                              src={url}
                              alt={`New image ${index + 1}`}
                              fill
                              className="rounded-lg object-cover"
                              sizes="(max-width: 768px) 33vw, 16vw"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemovePreview(index)}
                              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              disabled={isUploading}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      {selectedFiles.length < remainingSlots && (
                        <div className="mt-4 flex justify-center">
                          <Button 
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('image-upload')?.click()}
                            className="w-full"
                            disabled={isUploading}
                          >
                            <ImagePlus className="h-4 w-4 mr-2" />
                            Add more images
                          </Button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center">
                      <div className="flex flex-col items-center gap-2">
                        <ImagePlus className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm font-medium">Drop your images here</p>
                        <p className="text-xs text-muted-foreground">
                          PNG or JPG (max. 5MB) • {remainingSlots} slot{remainingSlots === 1 ? '' : 's'} available
                        </p>
                        <Button 
                          type="button"
                          variant="secondary" 
                          size="sm"
                          onClick={() => document.getElementById('image-upload')?.click()}
                          disabled={isUploading}
                        >
                          Select images
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={handleDialogClose}
                    disabled={isUploading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleUpload}
                    disabled={selectedFiles.length === 0 || isUploading}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      'Upload Images'
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {images?.map((image) => (
            <div key={image.ID} className="relative group">
              <div className="relative aspect-square rounded-md overflow-hidden border-2 border-gray-200 hover:border-gray-300 transition-colors">
                <Image
                  src={image.URL}
                  alt={image.AltText || `Product image`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 25vw, 12vw"
                />
                {(isDeletingId === image.ID || isSettingPrimaryId === image.ID) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                  </div>
                )}
                {image.IsPrimary && (
                  <div className="absolute top-2 left-2 bg-yellow-400 rounded-full p-1">
                    <Star className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>

              <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {!image.IsPrimary && (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="w-6 h-6 p-0"
                    onClick={() => handleSetPrimary(image.ID)}
                    disabled={isSettingPrimaryId === image.ID}
                  >
                    <Star className="w-3 h-3" />
                  </Button>
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="w-6 h-6 p-0"
                      disabled={isDeletingId === image.ID}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Image</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this image? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isDeletingId === image.ID}>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDeleteImage(image.ID)}
                        disabled={isDeletingId === image.ID}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <div 
                className="mt-1 text-xs text-gray-500 cursor-pointer"
                onClick={() => setEditingAltText({ id: image.ID, text: image.AltText })}
              >
                {editingAltText?.id === image.ID ? (
                  <Input
                    size="sm"
                    value={editingAltText.text}
                    onChange={(e) => setEditingAltText({ id: image.ID, text: e.target.value })}
                    onBlur={() => handleUpdateAltText(image.ID, editingAltText.text)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleUpdateAltText(image.ID, editingAltText.text)
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <span className="hover:text-gray-700">
                    {image.AltText || 'Add alt text'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}