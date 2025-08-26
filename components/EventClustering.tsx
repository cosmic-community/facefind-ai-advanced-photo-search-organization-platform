'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ClusterResult, ProcessingStatus } from '@/types'

interface EventClusteringProps {
  onClusteringComplete?: (clusters: ClusterResult[]) => void
  disabled?: boolean
}

export default function EventClustering({ 
  onClusteringComplete, 
  disabled = false 
}: EventClusteringProps) {
  const [status, setStatus] = useState<ProcessingStatus>('idle')
  const [clusters, setClusters] = useState<ClusterResult[]>([])
  const [processingTime, setProcessingTime] = useState<number>(0)
  const [silhouetteScore, setSilhouetteScore] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)

  const handleClusteringStart = async () => {
    setStatus('processing')
    setError(null)
    
    try {
      const startTime = performance.now()
      
      const response = await fetch('/api/clusters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          force_recompute: false,
          min_cluster_size: 3,
          silhouette_threshold: 0.7
        })
      })

      const data = await response.json()
      const endTime = performance.now()
      
      setProcessingTime(endTime - startTime)

      if (!response.ok) {
        throw new Error(data.error || 'Clustering failed')
      }

      if (data.success && data.data) {
        const clusterResults = data.data.clusters || []
        const silhouette = data.data.silhouette_score || 0
        
        setClusters(clusterResults)
        setSilhouetteScore(silhouette)
        setStatus('completed')
        
        // Notify parent component
        onClusteringComplete?.(clusterResults)
        
        // Validate clustering quality
        if (silhouette < 0.7) {
          console.warn('Clustering quality is below threshold:', silhouette)
        }
      } else {
        throw new Error(data.error || 'No clusters found')
      }
      
    } catch (err) {
      console.error('Clustering error:', err)
      setError(err instanceof Error ? err.message : 'Clustering failed')
      setStatus('error')
    }
  }

  const resetClustering = () => {
    setClusters([])
    setStatus('idle')
    setError(null)
    setProcessingTime(0)
    setSilhouetteScore(0)
  }

  return (
    <div className="space-y-4">
      {/* Clustering Button */}
      <div className="flex items-center space-x-3">
        <Button
          onClick={handleClusteringStart}
          disabled={disabled || status === 'processing'}
          variant={status === 'completed' ? 'outline' : 'default'}
        >
          {status === 'processing' ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
              Organizing...
            </>
          ) : status === 'completed' ? (
            `${clusters.length} Events Found`
          ) : (
            'Organize by Event'
          )}
        </Button>
        
        {status === 'completed' && (
          <Button variant="ghost" size="sm" onClick={resetClustering}>
            Reset
          </Button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <Card className="p-4 bg-destructive/10 text-destructive">
          <div className="flex items-start space-x-2">
            <span>⚠️</span>
            <div>
              <p className="font-medium">Clustering Failed</p>
              <p className="text-sm">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={handleClusteringStart}
              >
                Retry
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Results Summary */}
      {status === 'completed' && clusters.length > 0 && (
        <Card className="p-4">
          <div className="space-y-3">
            <h3 className="font-medium">Event Clustering Complete</h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Events Found:</span>
                <span className="ml-2 font-medium">{clusters.length}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Quality Score:</span>
                <span className={`ml-2 font-medium ${silhouetteScore >= 0.7 ? 'text-green-600' : 'text-yellow-600'}`}>
                  {silhouetteScore.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              Processing Time: {processingTime.toFixed(0)}ms
            </div>

            {/* Cluster Preview */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Events:</h4>
              <div className="space-y-1">
                {clusters.slice(0, 3).map((cluster, index) => (
                  <div 
                    key={cluster.cluster_id}
                    className="flex justify-between text-xs p-2 rounded bg-muted/50"
                  >
                    <span>
                      {cluster.label || `Event ${index + 1}`}
                    </span>
                    <span className="text-muted-foreground">
                      {cluster.photo_ids.length} photos
                    </span>
                  </div>
                ))}
                {clusters.length > 3 && (
                  <div className="text-xs text-muted-foreground text-center py-1">
                    +{clusters.length - 3} more events
                  </div>
                )}
              </div>
            </div>

            {silhouetteScore < 0.7 && (
              <div className="text-xs text-yellow-600 bg-yellow-50 p-2 rounded">
                ⚠️ Clustering quality is below optimal threshold. Consider adjusting parameters or adding more photos.
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Empty State */}
      {status === 'completed' && clusters.length === 0 && (
        <Card className="p-4 text-center">
          <h4 className="font-medium mb-2">No Events Detected</h4>
          <p className="text-sm text-muted-foreground">
            Unable to identify distinct events in the current photos. 
            Try adding more photos or adjusting clustering parameters.
          </p>
        </Card>
      )}

      {/* Help Text */}
      {disabled && (
        <p className="text-xs text-muted-foreground">
          Event clustering requires at least 3 photos to identify patterns
        </p>
      )}
    </div>
  )
}