import Link from 'next/link'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/60"></div>
            <span className="font-bold text-xl">FaceFind AI</span>
          </Link>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link 
              href="/" 
              className="transition-colors hover:text-primary text-muted-foreground"
            >
              Search
            </Link>
            <Link 
              href="/about" 
              className="transition-colors hover:text-primary text-muted-foreground"
            >
              About
            </Link>
            <Link 
              href="/docs" 
              className="transition-colors hover:text-primary text-muted-foreground"
            >
              Documentation
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}