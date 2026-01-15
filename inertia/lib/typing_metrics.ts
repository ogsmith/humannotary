export interface KeystrokeEvent {
  key: string
  timestamp: number
  type: 'keydown' | 'keyup'
}

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

export function calculateMetrics(events: KeystrokeEvent[]): TypingMetrics {
  const keydowns = events.filter((e) => e.type === 'keydown')
  const keyups = events.filter((e) => e.type === 'keyup')

  // Calculate inter-keystroke intervals (time between consecutive keydowns)
  const interKeystrokeIntervals: number[] = []
  for (let i = 1; i < keydowns.length; i++) {
    interKeystrokeIntervals.push(keydowns[i].timestamp - keydowns[i - 1].timestamp)
  }

  // Calculate dwell times (time between keydown and keyup for same key)
  const dwellTimes: number[] = []
  const keydownMap = new Map<string, number>()

  for (const event of events) {
    if (event.type === 'keydown') {
      keydownMap.set(event.key, event.timestamp)
    } else if (event.type === 'keyup') {
      const downTime = keydownMap.get(event.key)
      if (downTime !== undefined) {
        dwellTimes.push(event.timestamp - downTime)
        keydownMap.delete(event.key)
      }
    }
  }

  // Count backspaces
  const backspaceCount = keydowns.filter((e) => e.key === 'Backspace').length

  // Calculate statistics
  const totalTime =
    events.length > 0 ? events[events.length - 1].timestamp - events[0].timestamp : 0

  const averageInterval =
    interKeystrokeIntervals.length > 0
      ? interKeystrokeIntervals.reduce((a, b) => a + b, 0) / interKeystrokeIntervals.length
      : 0

  // Calculate variance
  const intervalVariance =
    interKeystrokeIntervals.length > 0
      ? interKeystrokeIntervals.reduce((sum, val) => sum + Math.pow(val - averageInterval, 2), 0) /
        interKeystrokeIntervals.length
      : 0

  // Coefficient of variation (standard deviation / mean)
  // Higher CV = more human-like variance
  const standardDeviation = Math.sqrt(intervalVariance)
  const coefficientOfVariation = averageInterval > 0 ? standardDeviation / averageInterval : 0

  return {
    totalTime,
    keystrokeCount: keydowns.length,
    interKeystrokeIntervals,
    dwellTimes,
    backspaceCount,
    pasteAttempts: 0, // Will be tracked separately in component
    averageInterval,
    intervalVariance,
    coefficientOfVariation,
  }
}
