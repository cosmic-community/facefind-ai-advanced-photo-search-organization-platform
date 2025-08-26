'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { PhotoSearchResult, ClusterResult } from '@/types'
import PhotoGrid from '@/components/PhotoGrid'
import EventClustering from '@/components/EventClustering'

interface SearchResultsProps {
  results?: PhotoSearchResult[]
  loading?: boolean
  error?: string
}

export default function SearchResults({ 
  results: initialResults,
  loading: initialLoading,
  error: initialError 
}: SearchResultsProps = {}) {
  const [results, setResults] = useState<PhotoSearchResult[]>(initialResults || [])
  const [loading, setLoading] = useState(initialLoading || false)
  const [error, setError] = useState<string | null>(initialError || null)
  const [clusters, setClusters] = useState<ClusterResult[]>([])
  const [showClusters, setShowClusters] = useState(false)
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null)

  // Load results from URL params or local storage if available
  useEffect(() => {
    if (!initialResults) {
      // Try to load cached results
      try {
        const cached = localStorage.getItem('search_results')
        if (cached) {
          const parsedResults = JSON.parse(cached)
          setResults(parsedResults)
        }
      } catch (err) {
        console.error('Failed to load cached results:', err)
      }
    }
  }, [initialResults])

  const handleClusteringComplete = (newClusters: ClusterResult[]) => {
    setClusters(newClusters)
    setShowClusters(true)
  }

  const handleClusterSelect = (clusterId: string | null) => {
    setSelectedCluster(clusterId)
    
    if (clusterId === null) {
      // Show all results
      return
    }
    
    // Filter results by cluster
    const cluster = clusters.find(c => c.cluster_id === clusterId)
    if (cluster) {
      const filteredResults = results.filter(r => 
        cluster.photo_ids.includes(r.id)
      )
      // Note: This would require state management for filtered vs all results
    }
  }

  const handleBackToSearch = () => {
    // Clear cached results and redirect
    localStorage.removeItem('search_results')
    window.location.href = '/'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Processing your search...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <div className="text-destructive mb-4">⚠️</div>
        <h3 className="text-lg font-medium mb-2">Search Error</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={handleBackToSearch}>Back to Search</Button>
      </Card>
    )
  }

  if (results.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-muted-foreground mb-4">📷</div>
        <h3 className="text-lg font-medium mb-2">No Results Yet</h3>
        <p className="text-muted-foreground mb-4">
          Upload a photo to start searching for faces
        </p>
        <Button onClick={handleBackToSearch}>Start Searching</Button>
      </Card>
    )
  }

  const displayedResults = selectedCluster 
    ? results.filter(r => {
        const cluster = clusters.find(c => c.cluster_id === selectedCluster)
        return cluster?.photo_ids.includes(r.id)
      })
    : results

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">
            {displayedResults.length} Photo{displayedResults.length !== 1 ? 's' : ''} Found
          </h2>
          <p className="text-muted-foreground">
            AI-powered face recognition with bounding box visualization
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Event Clustering */}
          <EventClustering 
            onClusteringComplete={handleClusteringComplete}
            disabled={results.length < 3}
          />
          
          <Button variant="outline" onClick={handleBackToSearch}>
            New Search
          </Button>
        </div>
      </div>

      {/* Cluster Filter */}
      {showClusters && clusters.length > 0 && (
        <Card className="p-4">
          <h3 className="font-medium mb-3">Filter by Event</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCluster === null ? "default" : "outline"}
              size="sm"
              onClick={() => handleClusterSelect(null)}
            >
              All Photos ({results.length})
            </Button>
            {clusters.map(cluster => (
              <Button
                key={cluster.cluster_id}
                variant={selectedCluster === cluster.cluster_id ? "default" : "outline"}
                size="sm"
                onClick={() => handleClusterSelect(cluster.cluster_id)}
              >
                {cluster.label || `Cluster ${cluster.cluster_id}`} ({cluster.photo_ids.length})
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* Results Grid */}
      <PhotoGrid 
        photos={displayedResults} 
        showBoundingBoxes={true}
        onPhotoClick={(photo) => {
          console.log('Photo clicked:', photo.filepath)
          // Could implement modal or detailed view
        }}
      />

      {/* Performance Stats */}
      {results.length > 0 && (
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-muted-foreground space-y-2 sm:space-y-0">
            <span>
              Search completed with {results.length} matches
            </span>
            <span>
              Average similarity: {(results.reduce((sum, r) => sum + r.similarity_score, 0) / results.length).toFixed(2)}
            </span>
          </div>
        </Card>
      )}
    </div>
  )
}