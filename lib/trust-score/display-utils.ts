export function trustScoreBand(score: number): "high" | "mid" | "low" {
  if (score >= 65) {
    return "high";
  }
  if (score >= 45) {
    return "mid";
  }
  return "low";
}

export function trustScoreMeterColor(score: number): string {
  const band = trustScoreBand(score);
  if (band === "high") {
    return "bg-trust-high";
  }
  if (band === "mid") {
    return "bg-trust-mid";
  }
  return "bg-trust-low";
}
