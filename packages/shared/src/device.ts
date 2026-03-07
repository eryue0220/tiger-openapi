import { getRuntime } from './runtime.js';

const STORAGE_KEY = '__tiger_device_id__';

/**
 * Returns a stable device identifier.
 * - Node.js / Bun (Linux/Windows): Uses MAC address from network interfaces, or hostname-based hash fallback.
 * - Deno: Uses hostname-based SHA-256 hash.
 * - Browser: Uses localStorage-persisted UUID (generated once per origin).
 * - Cloudflare Workers / Edge: Generates UUID per invocation (no persistence).
 *
 * In browser, the Promise resolves immediately.
 */
export async function getDeviceId(): Promise<string> {
  const runtime = getRuntime();
  if (runtime === 'node' || runtime === 'bun') {
    return getDeviceIdNode();
  }
  if (runtime === 'deno') {
    return getDeviceIdDeno();
  }
  return getDeviceIdBrowserOrEdge();
}

/**
 * Sync version for browser only. Throws in Node.js, Bun, Deno, and Workers.
 * Use {@link getDeviceId} for cross-environment support.
 */
export function getDeviceIdSync(): string {
  const runtime = getRuntime();
  if (runtime !== 'browser') {
    throw new Error(
      'getDeviceIdSync() is browser-only. Use getDeviceId() for Node/Bun/Deno/Workers.'
    );
  }
  return getDeviceIdBrowserOrEdge();
}

async function getDeviceIdNode(): Promise<string> {
  try {
    const { createHash } = await import('node:crypto');
    const { hostname, networkInterfaces } = await import('node:os');

    const mac = getMacFromNetworkInterfaces(networkInterfaces);
    if (mac) return mac;
    return fallbackGetMac(createHash, hostname);
  } catch {
    return '00:00:00:00:00:00';
  }
}

async function getDeviceIdDeno(): Promise<string> {
  try {
    const Deno = (globalThis as unknown as { Deno: { hostname?: () => string } }).Deno;
    const hostname = typeof Deno?.hostname === 'function' ? Deno.hostname() : 'deno';
    return hashWithWebCrypto(hostname || 'deno');
  } catch {
    return generateBrowserDeviceId();
  }
}

function getMacFromNetworkInterfaces(
  networkInterfaces: typeof import('node:os').networkInterfaces
): string | null {
  const ifaces = networkInterfaces();

  if (!ifaces) return null;

  for (const addrs of Object.values(ifaces)) {
    if (!Array.isArray(addrs)) continue;
    for (const addr of addrs) {
      if (addr?.internal) continue;
      const mac = String(addr?.mac ?? '')
        .trim()
        .toLowerCase()
        .replace(/-/g, ':');

      if (!mac || mac === '00:00:00:00:00:00') continue;

      if (/^([0-9a-f]{2}:){5}[0-9a-f]{2}$/.test(mac)) return mac;
    }
  }

  return null;
}

function fallbackGetMac(
  createHash: typeof import('node:crypto').createHash,
  hostname: () => string
): string {
  const seed = hostname() || 'node';
  const hash = createHash('sha256').update(seed).digest();
  const hex = hash.slice(0, 6).toString('hex');
  return hex.replace(/(.{2})/g, '$1:').slice(0, -1);
}

async function hashWithWebCrypto(seed: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(seed);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = new Uint8Array(hashBuffer);
  const hex = Array.from(hashArray.slice(0, 6))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return hex.replace(/(.{2})/g, '$1:').slice(0, -1);
}

function getDeviceIdBrowserOrEdge(): string {
  try {
    const storage = getStorage();
    if (storage) {
      const id = storage.getItem(STORAGE_KEY);
      if (id) return id;

      const newId = generateBrowserDeviceId();
      storage.setItem(STORAGE_KEY, newId);
      return newId;
    }
    return generateBrowserDeviceId();
  } catch {
    return generateBrowserDeviceId();
  }
}

function getStorage(): Storage | null {
  try {
    if (typeof globalThis.localStorage !== 'undefined') {
      return globalThis.localStorage;
    }
  } catch {
    // localStorage may throw in private/incognito mode
  }
  return null;
}

function generateBrowserDeviceId(): string {
  if (typeof globalThis.crypto !== 'undefined' && globalThis.crypto.randomUUID) {
    return globalThis.crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
