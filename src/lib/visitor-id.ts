const VISITOR_ID_KEY = "aftertrip.visitor.id";

export function getVisitorId() {
  if (typeof window === "undefined") return undefined;
  const existing = localStorage.getItem(VISITOR_ID_KEY);
  if (existing) return existing;
  const visitorId = globalThis.crypto?.randomUUID?.() ??
    `visitor-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  localStorage.setItem(VISITOR_ID_KEY, visitorId);
  return visitorId;
}
