import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'
import path from 'path'
import { ClusteringRequest, ClusteringResponse, ClusterResult, APIResponse } from '@/types'

// Cache for clustering results
const clusteringCache = new Map<string, { clusters: ClusterResult[], timestamp: number, silhouetteScore: number }>()
const CACHE_TTL = 15 * 60 * 1000 // 15 minutes (clustering is expensive)

export async function POST(request: NextRequest) {
  const startTime = performance.now()
  
  try {
    const body: ClusteringRequest = await request.json()
    
    // Create cache key based on parameters
    const cacheKey = JSON.stringify({
      min_cluster_size: body.min_cluster_size || 3,
      silhouette_threshold: body.silhouette_threshold || 0.7,
    })
    
    // Check cache unless force recompute is requested
    if (!body.force_recompute) {
      const cached = clusteringCache.get(cacheKey)
      
      if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
        const processingTime = performance.now() - startTime
        
        return NextResponse.json({
          success: true,
          data: {
            clusters: cached.clusters,
            silhouette_score: cached.silhouetteScore,
            total_photos_clustered: cached.clusters.reduce((sum, c) => sum + c.photo_ids.length, 0),
            processing_time_ms: processingTime
          },
          processing_time_ms: processingTime
        } as APIResponse<ClusteringResponse>)
      }
    }

    // Perform clustering
    const result = await performClustering(body)
    
    // Validate clustering quality
    if (result.silhouette_score < (body.silhouette_threshold || 0.7)) {
      console.warn(`Clustering quality ${result.silhouette_score} below threshold ${body.silhouette_threshold || 0.7}`)
    }

    // Cache the results
    clusteringCache.set(cacheKey, {
      clusters: result.clusters,
      timestamp: Date.now(),
      silhouetteScore: result.silhouette_score
    })

    const processingTime = performance.now() - startTime

    return NextResponse.json({
      success: true,
      data: {
        ...result,
        processing_time_ms: processingTime
      },
      processing_time_ms: processingTime
    } as APIResponse<ClusteringResponse>)

  } catch (error) {
    console.error('Clustering API error:', error)
    
    const processingTime = performance.now() - startTime
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Clustering failed',
      processing_time_ms: processingTime
    } as APIResponse<ClusteringResponse>, { status: 500 })
  }
}

async function performClustering(request: ClusteringRequest): Promise<ClusteringResponse> {
  return new Promise((resolve, reject) => {
    // Path to Python clustering script
    const scriptPath = path.join(process.cwd(), 'api', 'clusters.py')
    
    // Spawn Python process
    const pythonProcess = spawn('python', [scriptPath], {
      stdio: ['pipe', 'pipe', 'pipe']
    })

    let stdout = ''
    let stderr = ''

    // Send input data
    pythonProcess.stdin.write(JSON.stringify(request))
    pythonProcess.stdin.end()

    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString()
    })

    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString()
    })

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('Python clustering script error:', stderr)
        reject(new Error(`Clustering failed: ${stderr || 'Unknown error'}`))
        return
      }

      try {
        const result = JSON.parse(stdout)
        
        // Validate response structure
        if (!result.clusters || !Array.isArray(result.clusters)) {
          throw new Error('Invalid response format from clustering script')
        }

        if (typeof result.silhouette_score !== 'number') {
          throw new Error('Missing or invalid silhouette score')
        }

        resolve(result as ClusteringResponse)
      } catch (parseError) {
        console.error('Failed to parse clustering results:', parseError)
        reject(new Error('Failed to process clustering results'))
      }
    })

    pythonProcess.on('error', (error) => {
      console.error('Failed to start Python clustering process:', error)
      reject(new Error('Failed to execute clustering'))
    })

    // Timeout after 60 seconds (clustering can take longer)
    setTimeout(() => {
      pythonProcess.kill()
      reject(new Error('Clustering timeout - processing took too long'))
    }, 60000)
  })
}

// Handle OPTIONS for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}