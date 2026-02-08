

export function assertCanRegenerate(count: number | null | undefined) {
  if ((count ?? 0) >= 1) {
    throw new Error("Daily regeneration limit reached (1/day).");
  }
}

