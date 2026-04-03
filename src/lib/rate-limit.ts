/**
 * Simple in-memory rate limiter.
 * Resets on deployment (Vercel serverless). Good enough for MVP.
 */
const windowMs = 60 * 60 * 1000; // 1 hour
const maxPerWorkerPerHour = 50; // 50 messages per worker per hour

const counters = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(workerId: string): {
  allowed: boolean;
  remaining: number;
} {
  const now = Date.now();
  const key = workerId;
  const entry = counters.get(key);

  if (!entry || now > entry.resetAt) {
    counters.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxPerWorkerPerHour - 1 };
  }

  if (entry.count >= maxPerWorkerPerHour) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: maxPerWorkerPerHour - entry.count };
}
