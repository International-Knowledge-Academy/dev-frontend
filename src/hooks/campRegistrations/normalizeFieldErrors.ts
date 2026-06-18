const toLines = (val: unknown): string[] => {
  if (Array.isArray(val))           return val.flatMap(toLines);
  if (typeof val === "string")      return [val];
  if (val && typeof val === "object")
    return Object.entries(val as Record<string, unknown>).flatMap(([k, v]) =>
      toLines(v).map((m) => `${k}: ${m}`)
    );
  return [];
};

const normalizeFieldErrors = (data: unknown): Record<string, string[]> => {
  if (!data || typeof data !== "object" || Array.isArray(data)) return {};
  const result: Record<string, string[]> = {};
  for (const [key, val] of Object.entries(data as Record<string, unknown>)) {
    const lines = toLines(val);
    if (lines.length) result[key] = lines;
  }
  return result;
};

export default normalizeFieldErrors;
