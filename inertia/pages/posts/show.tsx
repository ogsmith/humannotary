import { Head } from '@inertiajs/react'
import { VerifiedBadge } from '~/components/verified_badge'

interface Post {
  id: string
  content: string
  verified: boolean
  humanScore: number
  createdAt: string
}

interface Props {
  post: Post | null
  error: string | null
}

export default function Show({ post, error }: Props) {
  if (error || !post) {
    return (
      <>
        <Head title="Not Found - Human Notary" />

        <div className="min-h-screen bg-gray-50 flex flex-col">
          <header className="py-4 px-4">
            <a href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              &larr; Back
            </a>
          </header>

          <main className="flex-1 flex flex-col items-center justify-center px-4">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
              <p className="text-gray-600 mb-8">
                The post you're looking for doesn't exist or has been removed.
              </p>
              <a
                href="/"
                className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Go Home
              </a>
            </div>
          </main>
        </div>
      </>
    )
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <>
      <Head title={`${post.id} - Human Notary`} />

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="py-4 px-4">
          <a href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
            &larr; Back
          </a>
        </header>

        <main className="flex-1 flex flex-col items-center px-4 py-8">
          <div className="w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <code className="text-sm font-mono text-gray-500">ID: {post.id}</code>
                <p className="text-xs text-gray-400 mt-1">{formattedDate}</p>
              </div>
              <VerifiedBadge verified={post.verified} score={post.humanScore} />
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
              <div className="prose prose-gray max-w-none">
                <p className="text-lg text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {post.content}
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-500 text-sm mb-4">
                {post.verified
                  ? 'This message was verified as human-written through typing pattern analysis.'
                  : 'This message could not be verified as human-written.'}
              </p>
              <a
                href="/write"
                className="inline-block px-6 py-2 border-2 border-gray-200 rounded-lg text-gray-700 hover:border-gray-400 transition-colors"
              >
                Write Your Own
              </a>
            </div>
          </div>
        </main>

        <footer className="py-4 text-center text-gray-400 text-sm">Human Notary</footer>
      </div>
    </>
  )
}
