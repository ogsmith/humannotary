import { Head, router } from '@inertiajs/react'
import { useState, FormEvent } from 'react'

export default function Home() {
  const [id, setId] = useState('')
  const [error, setError] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault()
    if (!id.trim()) return

    setIsSearching(true)
    setError('')

    try {
      const response = await fetch(`/api/posts/search?id=${encodeURIComponent(id.trim())}`)
      const data = await response.json()

      if (response.ok && data.exists) {
        router.visit(`/posts/${data.id}`)
      } else {
        setError('Post not found')
      }
    } catch {
      setError('Something went wrong')
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <>
      <Head title="Human Notary" />

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <main className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="w-full max-w-md text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Human Notary</h1>
            <p className="text-gray-600 mb-8">Verifying Human Written Stories</p>

            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={id}
                  onChange={(e) => {
                    setId(e.target.value)
                    setError('')
                  }}
                  placeholder="Enter post ID"
                  className="w-full px-4 py-3 text-lg text-center border-2 border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors"
                  autoComplete="off"
                />
                {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={!id.trim() || isSearching}
                className="w-full py-3 px-6 bg-black text-white font-medium rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isSearching ? 'Searching...' : 'Look Up'}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-gray-500 text-sm mb-3">Want to write something verified?</p>
              <a
                href="/write"
                className="inline-block px-6 py-2 border-2 border-gray-200 rounded-lg text-gray-700 hover:border-gray-400 transition-colors"
              >
                Write Now
              </a>
            </div>
          </div>
        </main>

        <footer className="py-4 text-center text-gray-400 text-sm">
          Human Notary
        </footer>
      </div>
    </>
  )
}
