export function formatDate(date: Date | string | null | undefined) {
  if (!date) return "No due date";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
