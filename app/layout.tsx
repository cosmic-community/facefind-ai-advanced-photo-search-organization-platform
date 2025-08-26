import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import CosmicBadge from '@/components/CosmicBadge'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FaceFind AI - Advanced Photo Search & Organization',
  description: 'Lightning-fast photo search using advanced AI face recognition and intelligent event clustering',
  keywords: ['AI', 'photo search', 'face recognition', 'machine learning', 'photo organization'],
  authors: [{ name: 'FaceFind AI Team' }],
  openGraph: {
    title: 'FaceFind AI - Advanced Photo Search & Organization',
    description: 'Upload a selfie and find yourself in photos instantly with AI-powered search',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=630&fit=crop&auto=format',
        width: 1200,
        height: 630,
        alt: 'FaceFind AI Preview',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FaceFind AI - Advanced Photo Search & Organization',
    description: 'Upload a selfie and find yourself in photos instantly with AI-powered search',
    images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=630&fit=crop&auto=format'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Access environment variable on server side
  const bucketSlug = process.env.COSMIC_BUCKET_SLUG as string

  return (
    <html lang="en">
      <head>
        <script src="/dashboard-console-capture.js" />
        {/* Console capture script for dashboard debugging */}
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
          {children}
        </div>
        {/* Pass bucket slug as prop to client component */}
        <CosmicBadge bucketSlug={bucketSlug} />
      </body>
    </html>
  )
}