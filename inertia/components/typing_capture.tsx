import { useState, useRef, useCallback } from 'react'
import { KeystrokeEvent, TypingMetrics, calculateMetrics } from '~/lib/typing_metrics'

interface TypingCaptureProps {
  onSubmit: (content: string, metrics: TypingMetrics & { pasteAttempts: number }) => void
  isSubmitting?: boolean
}

export function TypingCapture({ onSubmit, isSubmitting = false }: TypingCaptureProps) {
  const [content, setContent] = useState('')
  const [pasteAttempts, setPasteAttempts] = useState(0)
  const [showPasteWarning, setShowPasteWarning] = useState(false)
  const eventsRef = useRef<KeystrokeEvent[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    eventsRef.current.push({
      key: e.key,
      timestamp: Date.now(),
      type: 'keydown',
    })
  }, [])

  const handleKeyUp = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    eventsRef.current.push({
      key: e.key,
      timestamp: Date.now(),
      type: 'keyup',
    })
  }, [])

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault()
    setPasteAttempts((prev) => prev + 1)
    setShowPasteWarning(true)
    setTimeout(() => setShowPasteWarning(false), 3000)
  }, [])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
  }, [])

  const handleSubmit = useCallback(() => {
    if (!content.trim()) return

    const metrics = calculateMetrics(eventsRef.current)
    onSubmit(content, { ...metrics, pasteAttempts })
  }, [content, pasteAttempts, onSubmit])

  const characterCount = content.length
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onPaste={handlePaste}
          placeholder="Type your message here... (no pasting allowed)"
          className="w-full h-64 p-4 text-lg bg-white border-2 border-gray-200 rounded-lg resize-none focus:outline-none focus:border-gray-400 transition-colors"
          disabled={isSubmitting}
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
        />

        {showPasteWarning && (
          <div className="absolute top-4 right-4 bg-red-100 text-red-700 px-3 py-1 rounded-md text-sm animate-pulse">
            Paste not allowed
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-3 text-sm text-gray-500">
        <div className="space-x-4">
          <span>{characterCount} characters</span>
          <span>{wordCount} words</span>
        </div>

        {pasteAttempts > 0 && (
          <span className="text-amber-600">{pasteAttempts} paste attempt(s) blocked</span>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!content.trim() || isSubmitting}
        className="mt-6 w-full py-3 px-6 bg-black text-white font-medium rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Verifying...' : 'Submit for Verification'}
      </button>
    </div>
  )
}
