// Small, safe LocalStorage helpers. Every call is wrapped in try/catch so the
// app never crashes when storage is unavailable or full.

const KEYS = {
  messages: "rexi.messages",
  language: "rexi.language",
  theme: "rexi.theme",
};

export function loadJson<T>(key: string, fallback: T): T {
  try {
    if (typeof window === "undefined") return fallback;
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveJson(key: string, value: unknown): void {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full (large videos) or blocked — the chat keeps working in memory.
  }
}

export function removeKey(key: string): void {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export const STORAGE_KEYS = KEYS;

/** Formats a timestamp as e.g. "10:42 AM". */
export function formatTime(date: Date = new Date()): string {
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export function makeId(): string {
  return `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

/** Reads a local file into a base64 data URL so it can survive a refresh. */
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}
