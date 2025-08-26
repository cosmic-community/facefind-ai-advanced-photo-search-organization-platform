import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'
import path from 'path'
import { SearchRequest, SearchResponse, PhotoSearchResult, APIResponse } from '@/types'

// Cache for repeated queries (in-memory for demo - use Redis in production)
const queryCache = new Map<string, { results: PhotoSearchResult[], timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export async function POST(request: NextRequest) {
  const startTime = performance.now()
  
  try {
    const body: SearchRequest = await request.json()
    
    // Validate input
    if (!body.image_data) {
      return NextResponse.json({
        success: false,
        error: 'Image data is required'
      } as APIResponse<SearchResponse>, { status: 400 })
    }

    // Check cache first (using a simple hash of image data)
    const cacheKey = Buffer.from(body.image_data).toString('base64').slice(0, 32)
    const cached = queryCache.get(cacheKey)
    
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
      const processingTime = performance.now() - startTime
      
      return NextResponse.json({
        success: true,
        data: {
          results: cached.results,
          processing_time_ms: processingTime
        },
        processing_time_ms: processingTime
      } as APIResponse<SearchResponse>)
    }

    // Call Python search script
    const results = await performFaceSearch(body)
    
    // Cache the results
    queryCache.set(cacheKey, {
      results: results.results,
      timestamp: Date.now()
    })

    // Clean up old cache entries periodically
    if (queryCache.size > 100) {
      const oldestKey = queryCache.keys().next().value
      queryCache.delete(oldestKey)
    }

    const processingTime = performance.now() - startTime

    return NextResponse.json({
      success: true,
      data: {
        ...results,
        processing_time_ms: processingTime
      },
      processing_time_ms: processingTime
    } as APIResponse<SearchResponse>)

  } catch (error) {
    console.error('Search API error:', error)
    
    const processingTime = performance.now() - startTime
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Search failed',
      processing_time_ms: processingTime
    } as APIResponse<SearchResponse>, { status: 500 })
  }
}

async function performFaceSearch(request: SearchRequest): Promise<SearchResponse> {
  return new Promise((resolve, reject) => {
    // Path to Python search script
    const scriptPath = path.join(process.cwd(), 'api', 'search.py')
    
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
        console.error('Python script error:', stderr)
        reject(new Error(`Search failed: ${stderr || 'Unknown error'}`))
        return
      }

      try {
        const result = JSON.parse(stdout)
        
        // Validate response structure
        if (!result.results || !Array.isArray(result.results)) {
          throw new Error('Invalid response format from search script')
        }

        resolve(result as SearchResponse)
      } catch (parseError) {
        console.error('Failed to parse search results:', parseError)
        reject(new Error('Failed to process search results'))
      }
    })

    pythonProcess.on('error', (error) => {
      console.error('Failed to start Python process:', error)
      reject(new Error('Failed to execute search'))
    })

    // Timeout after 30 seconds
    setTimeout(() => {
      pythonProcess.kill()
      reject(new Error('Search timeout - processing took too long'))
    }, 30000)
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