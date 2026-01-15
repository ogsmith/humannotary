export interface TypingMetrics {
  totalTime: number
  keystrokeCount: number
  interKeystrokeIntervals: number[]
  dwellTimes: number[]
  backspaceCount: number
  pasteAttempts: number
  averageInterval: number
  intervalVariance: number
  coefficientOfVariation: number
}

export interface VerificationResult {
  verified: boolean
  humanScore: number
  reasons: string[]
}

// Thresholds (tunable)
const MIN_TYPING_TIME_MS = 5000 // At least 5 seconds of typing
const MIN_CV = 0.25 // Coefficient of variation - humans have at least 25% variance
const MAX_AVG_INTERVAL = 50 // If average interval < 50ms, probably not human
const MIN_KEYSTROKES = 10 // Need at least 10 keystrokes to analyze
const PASTE_PENALTY = 0.15 // Each paste attempt reduces score by 15%

export function verifyTypingMetrics(
  metrics: TypingMetrics,
  contentLength: number
): VerificationResult {
  const reasons: string[] = []
  let score = 1.0

  // Check minimum typing time
  if (metrics.totalTime < MIN_TYPING_TIME_MS) {
    score -= 0.3
    reasons.push(`Typing time too short (${Math.round(metrics.totalTime / 1000)}s)`)
  }

  // Check for paste attempts
  if (metrics.pasteAttempts > 0) {
    const pastePenalty = Math.min(metrics.pasteAttempts * PASTE_PENALTY, 0.5)
    score -= pastePenalty
    reasons.push(`${metrics.pasteAttempts} paste attempt(s) detected`)
  }

  // Check coefficient of variation (humans are inconsistent)
  if (metrics.coefficientOfVariation < MIN_CV && metrics.keystrokeCount > MIN_KEYSTROKES) {
    score -= 0.25
    reasons.push(
      `Typing too consistent (CV: ${metrics.coefficientOfVariation.toFixed(2)}, expected >${MIN_CV})`
    )
  }

  // Check for unnaturally fast typing
  if (metrics.averageInterval < MAX_AVG_INTERVAL && metrics.keystrokeCount > MIN_KEYSTROKES) {
    score -= 0.2
    reasons.push(`Typing too fast (${Math.round(metrics.averageInterval)}ms avg interval)`)
  }

  // Check for corrections (humans make mistakes)
  const expectedBackspaces = Math.max(1, Math.floor(contentLength * 0.02)) // Expect ~2% correction rate
  if (contentLength > 100 && metrics.backspaceCount < expectedBackspaces) {
    score -= 0.1
    reasons.push(`Few corrections (${metrics.backspaceCount} backspaces for ${contentLength} chars)`)
  }

  // Bonus for natural typing patterns
  if (metrics.coefficientOfVariation > 0.4 && metrics.keystrokeCount > 20) {
    score += 0.1
    reasons.push('Natural typing variance detected')
  }

  // Bonus for reasonable backspace usage
  if (metrics.backspaceCount > 0 && metrics.backspaceCount < metrics.keystrokeCount * 0.2) {
    score += 0.05
    reasons.push('Normal correction pattern')
  }

  // Clamp score between 0 and 1
  score = Math.max(0, Math.min(1, score))

  // Threshold for verification
  const verified = score >= 0.7

  return {
    verified,
    humanScore: score,
    reasons,
  }
}
