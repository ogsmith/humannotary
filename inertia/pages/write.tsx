import { Head } from '@inertiajs/react'
import { useState } from 'react'
import { TypingCapture } from '~/components/typing_capture'
import { TypingMetrics } from '~/lib/typing_metrics'

interface SubmitResult {
  id: string
  verified: boolean
  humanScore: number
  reasons: string[]
}

export default function Write() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<SubmitResult | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (content: string, metrics: TypingMetrics & { pasteAttempts: number }) => {
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, metrics }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
      } else {
        setError(data.error || 'Failed to submit')
      }
    } catch {
      setError('Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyToClipboard = async () => {
    if (!result) return
    await navigator.clipboard.writeText(result.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (result) {
    return (
      <>
        <Head title="Submitted - Human Notary" />

        <div className="min-h-screen bg-gray-50 flex flex-col">
          <header className="py-4 px-4">
            <a href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              &larr; Back
            </a>
          </header>

          <main className="flex-1 flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-md text-center">
              <div
                className={`mb-6 p-4 rounded-lg ${result.verified ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}
              >
                {result.verified ? (
                  <div className="flex items-center justify-center gap-2 text-green-700">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-lg font-medium">Verified Human</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-amber-700">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <span className="text-lg font-medium">Not Verified</span>
                  </div>
                )}
                <p className="mt-2 text-sm opacity-75">
                  Human score: {Math.round(result.humanScore * 100)}%
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Post ID</h2>

              <div className="mt-4 p-4 bg-white border-2 border-gray-200 rounded-lg">
                <code className="text-2xl font-mono font-bold text-gray-900">{result.id}</code>
              </div>

              <button
                onClick={copyToClipboard}
                className="mt-4 px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                {copied ? 'Copied!' : 'Copy ID'}
              </button>

              <p className="mt-6 text-gray-500 text-sm">
                Share this ID with anyone. They can look it up to see your verified message.
              </p>

              <div className="mt-8 space-x-4">
                <a
                  href={`/posts/${result.id}`}
                  className="inline-block px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  View Post
                </a>
                <a
                  href="/write"
                  className="inline-block px-6 py-2 border-2 border-gray-200 rounded-lg text-gray-700 hover:border-gray-400 transition-colors"
                >
                  Write Another
                </a>
              </div>
            </div>
          </main>
        </div>
      </>
    )
  }

  return (
    <>
      <Head title="Write - Human Notary" />

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="py-4 px-4">
          <a href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
            &larr; Back
          </a>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
          <div className="w-full max-w-2xl text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Write Your Message</h1>
            <p className="text-gray-600">
              Type your message below. Your typing patterns will be analyzed to verify you're human.
            </p>
            <p className="text-amber-600 text-sm mt-2">
              Pasting is disabled. Take your time and type naturally.
            </p>
          </div>

          {error && (
            <div className="w-full max-w-2xl mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
              {error}
            </div>
          )}

          <TypingCapture onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </main>
      </div>
    </>
  )
}
