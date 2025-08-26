'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { PhotoSearchResult, ProcessingStatus } from '@/types'
import PhotoGrid from '@/components/PhotoGrid'

export default function SearchInterface() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [status, setStatus] = useState<ProcessingStatus>('idle')
  const [results, setResults] = useState<PhotoSearchResult[]>([])
  const [processingTime, setProcessingTime] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file')
      return
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be smaller than 10MB')
      return
    }

    setSelectedFile(file)
    setError(null)
    
    // Create preview URL
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }, [])

  const handleSearch = useCallback(async () => {
    if (!selectedFile) {
      setError('Please select an image first')
      return
    }

    setStatus('processing')
    setError(null)
    
    try {
      // Convert file to base64
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64Data = e.target?.result as string
        
        const startTime = performance.now()
        
        const response = await fetch('/api/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image_data: base64Data,
            max_results: 50,
            similarity_threshold: 0.7
          })
        })

        const data = await response.json()
        const endTime = performance.now()
        
        setProcessingTime(endTime - startTime)

        if (!response.ok) {
          throw new Error(data.error || 'Search failed')
        }

        if (data.success && data.data) {
          setResults(data.data.results || [])
          setStatus('completed')
        } else {
          throw new Error(data.error || 'No results found')
        }
      }
      
      reader.onerror = () => {
        throw new Error('Failed to read image file')
      }
      
      reader.readAsDataURL(selectedFile)
      
    } catch (err) {
      console.error('Search error:', err)
      setError(err instanceof Error ? err.message : 'Search failed')
      setStatus('error')
    }
  }, [selectedFile])

  const clearResults = useCallback(() => {
    setResults([])
    setSelectedFile(null)
    setPreviewUrl(null)
    setStatus('idle')
    setError(null)
    setProcessingTime(0)
    
    // Clear file input
    const fileInput = document.getElementById('photo-upload') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }, [])

  return (
    <div className="max-w-4xl mx-auto">
      {/* Upload Interface */}
      <Card className="p-8 mb-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Upload Your Selfie</h2>
          <p className="text-muted-foreground mb-6">
            Choose a clear photo of yourself to find similar faces in our database
          </p>
          
          <div className="space-y-6">
            {/* File Input */}
            <div className="flex flex-col items-center space-y-4">
              <label 
                htmlFor="photo-upload" 
                className="cursor-pointer flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg hover:border-primary/50 transition-colors"
              >
                <div className="text-center">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-muted flex items-center justify-center">
                    📸
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, WEBP up to 10MB
                  </p>
                </div>
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Preview */}
            {previewUrl && (
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <img 
                    src={previewUrl} 
                    alt="Selected photo" 
                    className="max-w-xs max-h-48 rounded-lg object-cover"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedFile?.name} ({Math.round((selectedFile?.size || 0) / 1024)}KB)
                </p>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            {/* Search Button */}
            <div className="flex justify-center space-x-4">
              <Button
                onClick={handleSearch}
                disabled={!selectedFile || status === 'processing'}
                className="min-w-32"
              >
                {status === 'processing' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                    Searching...
                  </>
                ) : (
                  'Find Photos'
                )}
              </Button>
              
              {results.length > 0 && (
                <Button variant="outline" onClick={clearResults}>
                  Clear Results
                </Button>
              )}
            </div>

            {/* Processing Time */}
            {status === 'completed' && processingTime > 0 && (
              <p className="text-sm text-muted-foreground">
                Found {results.length} matches in {processingTime.toFixed(0)}ms
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Search Results</h3>
            <p className="text-sm text-muted-foreground">
              {results.length} photos found
            </p>
          </div>
          
          <PhotoGrid photos={results} showBoundingBoxes={true} />
        </div>
      )}

      {/* Empty State */}
      {status === 'completed' && results.length === 0 && (
        <Card className="p-8 text-center">
          <h3 className="text-lg font-medium mb-2">No matches found</h3>
          <p className="text-muted-foreground">
            Try uploading a different photo or check that your face is clearly visible
          </p>
        </Card>
      )}
    </div>
  )
}