// Base Cosmic object interface
interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type: string;
  created_at: string;
  modified_at: string;
}

// Photo search and ML types
export interface PhotoSearchResult {
  id: string;
  filepath: string;
  similarity_score: number;
  face_bbox: BoundingBox;
  background_features?: number[];
  cluster_label?: string;
  orientation?: string;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FaceEmbedding {
  embedding: number[];
  confidence: number;
  bbox: BoundingBox;
}

export interface BackgroundFeatures {
  features: number[];
  image_dimensions: {
    width: number;
    height: number;
  };
}

export interface ClusterResult {
  cluster_id: string;
  label: string;
  photo_ids: string[];
  representative_photo?: string;
  event_confidence: number;
}

export interface SearchRequest {
  image_data: string; // base64 encoded image
  max_results?: number;
  similarity_threshold?: number;
}

export interface SearchResponse {
  results: PhotoSearchResult[];
  processing_time_ms: number;
  query_embedding?: number[];
  error?: string;
}

export interface ClusteringRequest {
  force_recompute?: boolean;
  min_cluster_size?: number;
  silhouette_threshold?: number;
}

export interface ClusteringResponse {
  clusters: ClusterResult[];
  silhouette_score: number;
  total_photos_clustered: number;
  processing_time_ms: number;
  error?: string;
}

// Database schema interfaces
export interface PhotoRecord {
  image_id: number;
  filepath: string;
  face_embedding: ArrayBuffer; // BLOB in SQLite
  background_embedding: ArrayBuffer; // BLOB in SQLite  
  combined_embedding: ArrayBuffer; // BLOB in SQLite
  cluster_label?: string;
  orientation?: string;
  created_at: string;
  updated_at: string;
}

// API response types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  processing_time_ms?: number;
}

// Error handling types
export interface MLError extends Error {
  code: string;
  details?: Record<string, any>;
}

// Configuration types
export interface ModelConfig {
  face_detector: {
    model_type: 'mtcnn';
    min_face_size: number;
    thresholds: [number, number, number];
  };
  face_encoder: {
    model_type: 'facenet';
    embedding_size: 128;
  };
  background_encoder: {
    model_type: 'dino_vit';
    embedding_size: 384;
  };
  clustering: {
    algorithm: 'hdbscan';
    min_cluster_size: number;
    min_samples: number;
    silhouette_threshold: number;
  };
}

// Component props types
export interface SearchInterfaceProps {
  onSearchComplete?: (results: PhotoSearchResult[]) => void;
}

export interface SearchResultsProps {
  results?: PhotoSearchResult[];
  loading?: boolean;
  error?: string;
}

export interface EventClusteringProps {
  onClusteringComplete?: (clusters: ClusterResult[]) => void;
  disabled?: boolean;
}

export interface PhotoGridProps {
  photos: PhotoSearchResult[];
  onPhotoClick?: (photo: PhotoSearchResult) => void;
  showBoundingBoxes?: boolean;
}

// Utility types
export type ProcessingStatus = 'idle' | 'processing' | 'completed' | 'error';

export type ClusteringAlgorithm = 'hdbscan' | 'kmeans' | 'dbscan';

export type ImageFormat = 'jpeg' | 'png' | 'webp';

// Type guards
export function isPhotoSearchResult(obj: any): obj is PhotoSearchResult {
  return obj && 
         typeof obj.id === 'string' && 
         typeof obj.filepath === 'string' && 
         typeof obj.similarity_score === 'number' && 
         obj.face_bbox && 
         typeof obj.face_bbox.x === 'number';
}

export function isBoundingBox(obj: any): obj is BoundingBox {
  return obj && 
         typeof obj.x === 'number' && 
         typeof obj.y === 'number' && 
         typeof obj.width === 'number' && 
         typeof obj.height === 'number';
}

export function isClusterResult(obj: any): obj is ClusterResult {
  return obj && 
         typeof obj.cluster_id === 'string' && 
         Array.isArray(obj.photo_ids) && 
         typeof obj.event_confidence === 'number';
}

// Constants
export const ML_CONSTANTS = {
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
  MIN_FACE_SIZE: 20,
  MAX_RESULTS_DEFAULT: 50,
  SIMILARITY_THRESHOLD_DEFAULT: 0.7,
  SILHOUETTE_THRESHOLD_DEFAULT: 0.7,
  CACHE_TTL_MS: 5 * 60 * 1000, // 5 minutes
  PROCESSING_TIMEOUT_MS: 30 * 1000, // 30 seconds
} as const;