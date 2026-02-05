

export function assertCanRegenerate(count: number | null | undefined) {
  if ((count ?? 0) >= 3) {
    throw new Error("Daily regeneration limit reached (3/day).");
  }
}

