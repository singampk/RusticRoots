'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
  mainImageIndex?: number
  onMainImageChange?: (index: number) => void
}

export default function ImageUpload({ 
  images, 
  onImagesChange, 
  maxImages = 20, 
  mainImageIndex = 0, 
  onMainImageChange 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (images.length + files.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images`)
      return
    }

    setUploading(true)
    const uploadPromises = Array.from(files).map(uploadFile)
    
    try {
      const uploadedUrls = await Promise.all(uploadPromises)
      const validUrls = uploadedUrls.filter(url => url !== null) as string[]
      onImagesChange([...images, ...validUrls])
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Some images failed to upload. Please try again.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        return data.imageUrl
      } else {
        const error = await response.json()
        console.error('Upload error:', error)
        return null
      }
    } catch (error) {
      console.error('Upload error:', error)
      return null
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
    
    // Adjust main image index if needed
    if (onMainImageChange) {
      if (index === mainImageIndex && newImages.length > 0) {
        // If removing main image, set first image as main
        onMainImageChange(0)
      } else if (index < mainImageIndex) {
        // If removing image before main image, adjust main image index
        onMainImageChange(mainImageIndex - 1)
      }
    }
  }

  const setAsMainImage = (index: number) => {
    console.log('Setting main image to index:', index)
    if (onMainImageChange) {
      onMainImageChange(index)
    }
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return
    
    const newImages = [...images]
    const [movedImage] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, movedImage)
    onImagesChange(newImages)
    
    // Adjust main image index when moving images
    if (onMainImageChange) {
      if (fromIndex === mainImageIndex) {
        // Moving the main image
        onMainImageChange(toIndex)
      } else if (fromIndex < mainImageIndex && toIndex >= mainImageIndex) {
        // Moving image from before main to after main
        onMainImageChange(mainImageIndex - 1)
      } else if (fromIndex > mainImageIndex && toIndex <= mainImageIndex) {
        // Moving image from after main to before main
        onMainImageChange(mainImageIndex + 1)
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Product Images ({images.length}/{maxImages})
        </label>
        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Images
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Progress */}
      {uploading && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex items-center">
            <svg className="animate-spin w-4 h-4 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm text-blue-800">Uploading images...</span>
          </div>
        </div>
      )}

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((imageUrl, index) => (
          <div key={index} className="relative group">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={imageUrl}
                alt={`Product image ${index + 1}`}
                fill
                className="object-cover"
                onError={() => {
                  // Handle broken images
                  console.error('Failed to load image:', imageUrl)
                }}
              />
            </div>
            
            {/* Always Visible Remove Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log('Remove button clicked for image:', index)
                removeImage(index)
              }}
              className="absolute top-1 right-1 p-1 bg-red-600 rounded-full hover:bg-red-700 shadow-lg z-30 opacity-80 hover:opacity-100 transition-opacity"
              title="Remove image"
            >
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Always Visible Set Main Button */}
            {index !== mainImageIndex && onMainImageChange && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log('Set Main button clicked for image:', index)
                  setAsMainImage(index)
                }}
                className="absolute top-1 left-1 px-2 py-1 bg-amber-600 text-white text-xs font-semibold rounded hover:bg-amber-700 shadow-lg z-30 opacity-80 hover:opacity-100 transition-opacity"
                title="Set as main image"
              >
                Main
              </button>
            )}

            {/* Main Image Badge */}
            {index === mainImageIndex && (
              <div className="absolute top-1 left-1 bg-amber-800 text-white text-xs px-2 py-1 rounded font-semibold shadow-lg z-30">
                Main Image
              </div>
            )}

            {/* Hover Controls for Move */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg pointer-events-none">
              {/* Overlay Background */}
              <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg"></div>
              
              {/* Center Row - Move Controls */}
              <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-auto">
                <div className="flex space-x-2">
                  {/* Move Left */}
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        moveImage(index, index - 1)
                      }}
                      className="p-2 bg-white rounded-full hover:bg-gray-100 cursor-pointer shadow-lg"
                      title="Move left"
                    >
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  )}
                  
                  {/* Move Right */}
                  {index < images.length - 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        moveImage(index, index + 1)
                      }}
                      className="p-2 bg-white rounded-full hover:bg-gray-100 cursor-pointer shadow-lg"
                      title="Move right"
                    >
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Debug: Image Index Display */}
            <div className="absolute bottom-2 left-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-75">
              {index + 1} {index === mainImageIndex ? '(Main)' : ''}
            </div>
          </div>
        ))}
        
        {/* Empty Slots */}
        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colors disabled:opacity-50"
          >
            <div className="text-center">
              <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm text-gray-500">Add Image</span>
            </div>
          </button>
        )}
      </div>

      {/* Help Text */}
      <div className="text-sm text-gray-500">
        <p>• Upload up to {maxImages} images (max 10MB each)</p>
        <p>• Supported formats: JPG, PNG, WebP</p>
        <p>• Click &quot;Set Main&quot; to choose the main product image</p>
        <p>• Use arrow buttons to reorder images</p>
        <p>• Hover over images to see management options</p>
      </div>
    </div>
  )
}