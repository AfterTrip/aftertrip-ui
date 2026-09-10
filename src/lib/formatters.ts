export function formatCount(value: number) {
  return new Intl.NumberFormat("en", {
    notation: value >= 1000 ? "compact" : "standard",
    maximumFractionDigits: 1
  }).format(value);
}

export function formatTripDates(startDate?: string | null, endDate?: string | null) {
  if (!startDate || !endDate) return "Dates not set";
  const format = new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  });
  return `${format.format(new Date(`${startDate}T00:00:00Z`))} - ${format.format(
    new Date(`${endDate}T00:00:00Z`)
  )}`;
}

export function titleCaseEnum(value?: string | null) {
  if (!value) return "";
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
