import Link from 'next/link'

export function Header() {
  return (
    <header className="border-b">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600">
          Catchment Check
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/area/camden" className="text-gray-600 hover:text-gray-900">
            Browse Areas
          </Link>
          <Link href="/about" className="text-gray-600 hover:text-gray-900">
            About
          </Link>
        </nav>
      </div>
    </header>
  )
}
