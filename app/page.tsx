import { Suspense } from 'react'
import Header from '@/components/Header'
import SearchInterface from '@/components/SearchInterface'
import FeatureGrid from '@/components/FeatureGrid'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="flex-1 container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Find Yourself in Photos
            <span className="block text-primary">Instantly</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Upload a selfie and discover all photos containing you with our advanced AI-powered face recognition technology. Lightning-fast results in under 300ms.
          </p>
        </div>

        {/* Search Interface */}
        <Suspense fallback={
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        }>
          <SearchInterface />
        </Suspense>

        {/* Features */}
        <FeatureGrid />
      </section>

      <Footer />
    </main>
  )
}