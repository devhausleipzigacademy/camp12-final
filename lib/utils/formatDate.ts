export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("de-DE", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}
