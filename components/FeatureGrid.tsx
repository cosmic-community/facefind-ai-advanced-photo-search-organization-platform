import { Card } from '@/components/ui/Card'

const features = [
  {
    title: 'Lightning Fast',
    description: 'Sub-300ms response times with FAISS-powered similarity search',
    icon: '⚡',
  },
  {
    title: 'Face Recognition',
    description: 'Advanced MTCNN detection with FaceNet 128D embeddings',
    icon: '🎯',
  },
  {
    title: 'Background Analysis',
    description: 'DINO-ViT 384D feature extraction for contextual understanding',
    icon: '🖼️',
  },
  {
    title: 'Smart Clustering',
    description: 'HDBSCAN event organization with silhouette validation',
    icon: '🧠',
  },
  {
    title: 'Visual Feedback',
    description: 'CSS-based bounding box overlays for precise face detection',
    icon: '📍',
  },
  {
    title: 'Mobile Ready',
    description: 'Responsive design optimized for all device sizes',
    icon: '📱',
  },
]

export default function FeatureGrid() {
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight mb-4">
          Powered by Advanced AI
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Our cutting-edge machine learning pipeline delivers unmatched accuracy and performance
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <div className="text-center space-y-4">
              <div className="text-4xl">{feature.icon}</div>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10">
          <h3 className="text-2xl font-bold mb-4">Technical Specifications</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">128D</div>
              <div className="text-sm text-muted-foreground">Face Embedding</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">384D</div>
              <div className="text-sm text-muted-foreground">Background Features</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">256D</div>
              <div className="text-sm text-muted-foreground">PCA Optimized</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">≥0.7</div>
              <div className="text-sm text-muted-foreground">Silhouette Score</div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}