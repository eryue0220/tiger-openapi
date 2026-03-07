function buildSignString(params: Record<string, unknown>): string {
  return Object.keys(params)
    .filter(
      (k) =>
        k !== 'sign' &&
        params[k] !== undefined &&
        params[k] !== null &&
        params[k] !== '' &&
        typeof params[k] === 'string'
    )
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&');
}

function normalizePrivateKey(raw: string): string {
  if (!raw) return '';
  if (raw.includes('BEGIN')) return raw;
  return `-----BEGIN RSA PRIVATE KEY-----\n${raw}\n-----END RSA PRIVATE KEY-----`;
}

function concatBytes(...chunks: Uint8Array[]): Uint8Array {
  const length = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const out = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.length;
  }
  return out;
}

function derLength(length: number): Uint8Array {
  if (length < 128) {
    return new Uint8Array([length]);
  }

  const bytes: number[] = [];
  let value = length;
  while (value > 0) {
    bytes.unshift(value & 0xff);
    value >>= 8;
  }

  return new Uint8Array([0x80 | bytes.length, ...bytes]);
}

function derEncode(tag: number, value: Uint8Array): Uint8Array {
  return concatBytes(new Uint8Array([tag]), derLength(value.length), value);
}

function pemToDer(pem: string): Uint8Array {
  const base64 = pem
    .replace(/-----BEGIN [^-]+-----/g, '')
    .replace(/-----END [^-]+-----/g, '')
    .replace(/\s+/g, '');

  if (typeof atob === 'function') {
    return Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
  }

  const bufferCtor = (
    globalThis as { Buffer?: { from(data: string, encoding: string): Uint8Array } }
  ).Buffer;

  if (bufferCtor) {
    return Uint8Array.from(bufferCtor.from(base64, 'base64'));
  }

  throw new Error('No base64 decoder available in the current runtime.');
}

function toPkcs8FromPkcs1(pkcs1: Uint8Array): Uint8Array {
  const version = new Uint8Array([0x02, 0x01, 0x00]);
  const rsaAlgorithmIdentifier = new Uint8Array([
    0x30, 0x0d, 0x06, 0x09, 0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x01, 0x01, 0x05, 0x00,
  ]);
  const privateKey = derEncode(0x04, pkcs1);
  return derEncode(0x30, concatBytes(version, rsaAlgorithmIdentifier, privateKey));
}

function derBuffer(bytes: Uint8Array): ArrayBuffer {
  return Uint8Array.from(bytes).buffer;
}

function toBase64(bytes: Uint8Array): string {
  const bufferCtor = (
    globalThis as { Buffer?: { from(data: Uint8Array): { toString(encoding: string): string } } }
  ).Buffer;
  if (bufferCtor) {
    return bufferCtor.from(bytes).toString('base64');
  }

  let binary = '';
  for (const b of bytes) {
    binary += String.fromCharCode(b);
  }
  return btoa(binary);
}

async function importPrivateKey(privateKeyPem: string): Promise<CryptoKey> {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    throw new Error('Web Crypto API is not available in the current runtime.');
  }

  const isPkcs8 = privateKeyPem.includes('BEGIN PRIVATE KEY');
  const der = pemToDer(privateKeyPem);
  const pkcs8Der = isPkcs8 ? der : toPkcs8FromPkcs1(der);

  return subtle.importKey(
    'pkcs8',
    derBuffer(pkcs8Der),
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-1',
    },
    false,
    ['sign']
  );
}

export async function signParams(params: Record<string, string | undefined>): Promise<string> {
  const privateKey = normalizePrivateKey(params.privateKey ?? '');
  if (!privateKey) throw new Error('privateKey is required for signing');

  const signStr = buildSignString(params);
  const key = await importPrivateKey(privateKey);
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    throw new Error('Web Crypto API is not available in the current runtime.');
  }

  const encoded = new TextEncoder().encode(signStr);
  const signature = await subtle.sign('RSASSA-PKCS1-v1_5', key, encoded);
  return toBase64(new Uint8Array(signature));
}
