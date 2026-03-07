export type Runtime = 'cloudflare' | 'node' | 'deno' | 'bun' | 'browser';

export type OSType = 'linux' | 'windows' | 'darwin' | 'android' | 'ios' | 'unknown';

type RuntimeGlobals = typeof globalThis & {
  process?: { versions?: { node?: string; bun?: string }; platform?: string };
  Deno?: { env?: unknown; build?: { os?: string } };
  Bun?: { env?: unknown };
  window?: unknown;
  navigator?: {
    platform?: string;
    userAgent?: string;
    userAgentData?: {
      platform?: string;
    };
  };
};

const VALID_OS: readonly OSType[] = ['linux', 'windows', 'darwin', 'android', 'ios'] as const;

function normalizeOS(raw: string): OSType {
  const lower = raw.toLowerCase();
  if (lower.includes('win')) return 'windows';
  if (lower.includes('mac') || lower === 'darwin') return 'darwin';
  if (lower.includes('linux')) return 'linux';
  if (lower.includes('android')) return 'android';
  if (lower.includes('iphone') || lower.includes('ipad') || lower.includes('ios')) return 'ios';
  return 'unknown';
}

/**
 * Detects the current runtime environment.
 * Order: Bun → Deno → Node → Cloudflare (worker, no window) → Browser
 */
export function getRuntime(): Runtime {
  const g = globalThis as RuntimeGlobals;

  if (typeof g.Bun !== 'undefined' || g.process?.versions?.bun) {
    return 'bun';
  }

  if (typeof g.Deno !== 'undefined') {
    return 'deno';
  }

  if (g.process?.versions?.node) {
    return 'node';
  }

  if (typeof g.caches !== 'undefined' && typeof g.window === 'undefined') {
    return 'cloudflare';
  }

  return 'browser';
}

/**
 * Returns the operating system type for the current runtime.
 * - Node/Bun: uses process.platform
 * - Deno: uses Deno.build.os
 * - Browser: parses navigator.userAgent / userAgentData
 * - Cloudflare: returns 'unknown'
 */
export function getOS(): OSType {
  const g = globalThis as RuntimeGlobals;

  if (g.process?.platform) {
    const p = g.process.platform;
    if (p === 'win32') return 'windows';
    if (VALID_OS.includes(p as OSType)) return p as OSType;
    return normalizeOS(p);
  }

  const Deno = g.Deno as { build?: { os?: string } } | undefined;
  if (Deno?.build?.os) {
    const os = Deno.build.os;
    if (os === 'windows') return 'windows';
    if (VALID_OS.includes(os as OSType)) return os as OSType;
    return normalizeOS(os);
  }

  const nav = g.navigator;
  if (nav) {
    if (nav.userAgentData?.platform) {
      return normalizeOS(nav.userAgentData.platform);
    }
    if (nav.platform) {
      return normalizeOS(nav.platform);
    }
    if (nav.userAgent) {
      return normalizeOS(nav.userAgent);
    }
  }

  return 'unknown';
}
