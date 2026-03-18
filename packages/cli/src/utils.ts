export function parseOptionalNumber(value?: string): number | undefined {
  if (value === undefined) return undefined;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid number value: ${value}`);
  }
  return parsed;
}

export function parseOptionalBoolean(value?: string): boolean | undefined {
  if (value === undefined) return undefined;
  const normalized = value.toLowerCase();
  if (normalized === 'true') return true;
  if (normalized === 'false') return false;
  throw new Error(`Invalid boolean value: ${value}. Use true or false.`);
}

export function parseOptionalStringArray(value?: string): string[] | undefined {
  if (!value) return undefined;
  const values = String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  return values.length > 0 ? values : undefined;
}
