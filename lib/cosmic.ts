import { createBucketClient } from '@cosmicjs/sdk'

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
})

// Analytics and logging functions
export async function logSearchAnalytics(queryType: string, resultsCount: number, processingTime: number) {
  try {
    await cosmic.objects.insertOne({
      type: 'search_analytics',
      title: `Search Query - ${new Date().toISOString()}`,
      metadata: {
        query_type: queryType,
        results_count: resultsCount,
        processing_time_ms: processingTime,
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Failed to log search analytics:', error);
  }
}

export async function logClusteringAnalytics(clustersCount: number, photosCount: number, silhouetteScore: number) {
  try {
    await cosmic.objects.insertOne({
      type: 'clustering_analytics',
      title: `Clustering Operation - ${new Date().toISOString()}`,
      metadata: {
        clusters_count: clustersCount,
        photos_clustered: photosCount,
        silhouette_score: silhouetteScore,
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Failed to log clustering analytics:', error);
  }
}

export async function getPhotoMetadata() {
  try {
    const response = await cosmic.objects
      .find({ type: 'photos' })
      .props(['id', 'title', 'metadata'])
      .depth(1);
    return response.objects;
  } catch (error) {
    if ((error as any).status === 404) {
      return [];
    }
    console.error('Failed to fetch photo metadata:', error);
    throw error;
  }
}