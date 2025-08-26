# FaceFind AI - Advanced Photo Search & Organization Platform

![FaceFind AI Preview](https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=300&fit=crop&auto=format)

A cutting-edge photo management platform that uses advanced machine learning to help users find themselves in photos instantly. Upload a selfie and get lightning-fast results with face recognition and intelligent event clustering.

## ✨ Features

- **Lightning-Fast Search**: Sub-300ms response times with FAISS-powered similarity search
- **Advanced Face Recognition**: MTCNN face detection with FaceNet 128D embeddings  
- **Background Analysis**: DINO-ViT 384D background feature extraction
- **Smart Event Clustering**: HDBSCAN clustering with silhouette validation
- **Visual Feedback**: CSS-based bounding box overlays
- **Modern UI**: Clean interface built with shadcn/ui and Tailwind CSS
- **Mobile Optimized**: Responsive design for all devices
- **Error Handling**: Comprehensive error states and fallbacks
- **Performance Optimized**: Caching and GPU acceleration support

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmicjs.com/projects/new?clone_bucket=68ae06ec1f09167261d591fa&clone_repository=68ae08bc1f09167261d59221)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> No content model prompt provided - app built from existing content structure

### Code Generation Prompt

> Below is the detailed implementation plan, broken down by file and module changes. This plan ensures rigorous error handling, performance optimizations, and a modern, clean UI without external icon/image libraries. [Implementation plan details for FaceFind AI photo search platform with ML pipeline, face recognition, event clustering, and modern UI components]

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## 🛠️ Technologies Used

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **ML/AI**: FaceNet, MTCNN, DINO-ViT, HDBSCAN
- **Search**: FAISS (Facebook AI Similarity Search)
- **Database**: SQLite with blob storage
- **Python Libraries**: facenet-pytorch, torch, scikit-learn, umap-learn
- **Performance**: PCA dimensionality reduction, caching
- **Infrastructure**: Optional GPU acceleration with ONNX/TensorRT

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and bun
- Python 3.8+
- CUDA-compatible GPU (optional but recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd facefind-ai
   ```

2. **Install Node.js dependencies**
   ```bash
   bun install
   ```

3. **Install Python dependencies**
   ```bash
   pip install facenet-pytorch torch torchvision scikit-learn faiss-cpu hdbscan umap-learn sqlite3 pillow numpy
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
   DATABASE_PATH=./data/embeddings.db
   DATASET_PATH=./data/images
   FAISS_INDEX_PATH=./data/faiss_index
   ```

5. **Run the precomputation pipeline**
   ```bash
   python pipeline/precompute.py
   ```

6. **Start the development server**
   ```bash
   bun dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🤖 Cosmic SDK Examples

While this application focuses on AI-powered photo search, you can integrate Cosmic for content management:

```typescript
// Basic usage example
import { cosmic } from '@/lib/cosmic'

// Fetch photo metadata from Cosmic
const photos = await cosmic.objects
  .find({ type: 'photos' })
  .props(['id', 'title', 'metadata'])
  .depth(1)

// Store search analytics
await cosmic.objects.insertOne({
  type: 'search_analytics',
  title: 'Photo Search',
  metadata: {
    query_type: 'face_search',
    results_count: results.length,
    processing_time: responseTime
  }
})
```

## 🔗 Cosmic CMS Integration

This application can be enhanced with Cosmic for:

- **Photo Metadata Management**: Store photo tags, descriptions, and categories
- **User Analytics**: Track search patterns and popular queries
- **Content Moderation**: Manage inappropriate content flags
- **Event Information**: Store event details for clustered photos

Learn more about [Cosmic](https://www.cosmicjs.com) and explore the [Cosmic Docs](https://www.cosmicjs.com/docs).

## 🚀 Deployment Options

### Vercel (Recommended)
1. Push to GitHub
2. Import in Vercel dashboard
3. Set environment variables
4. Deploy automatically

### Docker
```dockerfile
# Multi-stage build for Python + Node.js
FROM python:3.9-slim as python-base
# Python dependencies...

FROM node:18-alpine as node-base  
# Node.js dependencies...
```

### Self-hosted
- Configure nginx reverse proxy
- Set up SSL certificates
- Install Python and Node.js runtimes
- Configure GPU drivers (optional)

Remember to:
- Set up proper CORS for API endpoints
- Configure file upload limits
- Set up monitoring for ML pipeline performance
- Implement proper security measures for uploaded images

<!-- README_END -->