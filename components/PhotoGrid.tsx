'use client'

import { useState } from 'react'
import { PhotoSearchResult, BoundingBox } from '@/types'
import { Card } from '@/components/ui/Card'

interface PhotoGridProps {
  photos: PhotoSearchResult[]
  onPhotoClick?: (photo: PhotoSearchResult) => void
  showBoundingBoxes?: boolean
}

export default function PhotoGrid({ 
  photos, 
  onPhotoClick, 
  showBoundingBoxes = false 
}: PhotoGridProps) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())

  const handleImageLoad = (photoId: string) => {
    setLoadedImages(prev => new Set(prev).add(photoId))
  }

  const handleImageError = (photoId: string) => {
    setFailedImages(prev => new Set(prev).add(photoId))
  }

  const renderBoundingBox = (bbox: BoundingBox, containerWidth: number, containerHeight: number) => {
    // Calculate percentage-based positioning for responsive bounding boxes
    const left = (bbox.x / containerWidth) * 100
    const top = (bbox.y / containerHeight) * 100
    const width = (bbox.width / containerWidth) * 100
    const height = (bbox.height / containerHeight) * 100

    return (
      <div
        className="bounding-box"
        style={{
          left: `${left}%`,
          top: `${top}%`,
          width: `${width}%`,
          height: `${height}%`,
        }}
      />
    )
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No photos to display</p>
      </div>
    )
  }

  return (
    <div className="photo-grid">
      {photos.map((photo) => {
        const isLoaded = loadedImages.has(photo.id)
        const hasFailed = failedImages.has(photo.id)
        
        return (
          <Card 
            key={photo.id}
            className="photo-item group cursor-pointer hover:shadow-lg transition-all duration-200"
            onClick={() => onPhotoClick?.(photo)}
          >
            <div className="relative w-full h-full">
              {!isLoaded && !hasFailed && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              )}
              
              {hasFailed ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted text-muted-foreground">
                  <div className="text-2xl mb-2">📷</div>
                  <p className="text-xs text-center px-2">
                    Failed to load image
                  </p>
                </div>
              ) : (
                <>
                  <img
                    src={photo.filepath}
                    alt={`Search result ${photo.id}`}
                    className="w-full h-full object-cover rounded-lg"
                    onLoad={() => handleImageLoad(photo.id)}
                    onError={() => handleImageError(photo.id)}
                    style={{ display: isLoaded ? 'block' : 'none' }}
                  />
                  
                  {/* Bounding Box Overlay */}
                  {showBoundingBoxes && isLoaded && photo.face_bbox && (
                    <div className="absolute inset-0">
                      {/* Assuming standard image dimensions for demo - in real app, get from image */}
                      {renderBoundingBox(photo.face_bbox, 400, 400)}
                    </div>
                  )}
                </>
              )}
              
              {/* Similarity Score Overlay */}
              {isLoaded && (
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {(photo.similarity_score * 100).toFixed(0)}% match
                </div>
              )}
              
              {/* Cluster Label */}
              {photo.cluster_label && (
                <div className="absolute bottom-2 left-2 bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded">
                  {photo.cluster_label}
                </div>
              )}
            </div>
          </Card>
        )
      })}
    </div>
  )
}