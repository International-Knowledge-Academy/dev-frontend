const TTL = 5 * 60 * 1000; // 5 minutes

interface Entry {
  data: unknown;
  ts: number;
}

const dataStore    = new Map<string, Entry>();
const inflightStore = new Map<string, Promise<unknown>>();

export const requestCache = {
  /** Build a stable cache key from an endpoint + optional params object. */
  key(endpoint: string, params?: object): string {
    if (!params || Object.keys(params).length === 0) return endpoint;
    return `${endpoint}::${JSON.stringify(params, Object.keys(params).sort())}`;
  },

  get<T>(key: string): T | null {
    const entry = dataStore.get(key);
    if (!entry) return null;
    if (Date.now() - entry.ts > TTL) { dataStore.delete(key); return null; }
    return entry.data as T;
  },

  set(key: string, data: unknown): void {
    dataStore.set(key, { data, ts: Date.now() });
  },

  /** Delete a cache entry — call before refetch() to force fresh data. */
  invalidate(key: string): void {
    dataStore.delete(key);
  },

  getInflight<T>(key: string): Promise<T> | null {
    return (inflightStore.get(key) as Promise<T>) ?? null;
  },

  setInflight(key: string, promise: Promise<unknown>): void {
    inflightStore.set(key, promise);
    promise.finally(() => inflightStore.delete(key));
  },
};
