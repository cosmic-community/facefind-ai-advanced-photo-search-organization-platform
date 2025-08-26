import { Suspense } from 'react'
import Header from '@/components/Header'
import SearchResults from '@/components/SearchResults'
import Footer from '@/components/Footer'

export default function SearchPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      
      <section className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-4">
            Photo Search Results
          </h1>
          <p className="text-muted-foreground">
            AI-powered face recognition results with bounding box visualization
          </p>
        </div>

        <Suspense fallback={
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        }>
          <SearchResults />
        </Suspense>
      </section>

      <Footer />
    </main>
  )
}