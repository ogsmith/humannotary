interface VerifiedBadgeProps {
  verified: boolean
  score?: number
}

export function VerifiedBadge({ verified, score }: VerifiedBadgeProps) {
  if (verified) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
        <svg
          className="w-4 h-4 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
        <span className="text-sm font-medium text-green-700">Verified Human</span>
        {score !== undefined && (
          <span className="text-xs text-green-600">({Math.round(score * 100)}%)</span>
        )}
      </div>
    )
  }

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full">
      <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <span className="text-sm font-medium text-amber-700">Unverified</span>
      {score !== undefined && (
        <span className="text-xs text-amber-600">({Math.round(score * 100)}%)</span>
      )}
    </div>
  )
}
