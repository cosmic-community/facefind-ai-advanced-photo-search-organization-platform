import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-primary/60"></div>
              <span className="font-bold">FaceFind AI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Advanced AI-powered photo search and organization platform
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Face Recognition</li>
              <li>Event Clustering</li>
              <li>Lightning Search</li>
              <li>Background Analysis</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Technology</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>MTCNN Detection</li>
              <li>FaceNet Embeddings</li>
              <li>DINO-ViT Features</li>
              <li>HDBSCAN Clustering</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/docs" className="text-muted-foreground hover:text-primary">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/api-reference" className="text-muted-foreground hover:text-primary">
                  API Reference
                </Link>
              </li>
              <li>
                <Link href="/examples" className="text-muted-foreground hover:text-primary">
                  Examples
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-muted-foreground hover:text-primary">
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} FaceFind AI. Built with advanced machine learning and modern web technologies.</p>
        </div>
      </div>
    </footer>
  )
}