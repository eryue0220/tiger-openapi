import forge from 'node-forge';

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

export function signParams(params: Record<string, string | undefined>) {
  const privateKey = normalizePrivateKey(params.privateKey ?? '');
  if (!privateKey) throw new Error('privateKey is required for signing');

  const signStr = buildSignString(params);
  const key = forge.pki.privateKeyFromPem(privateKey);
  const md = forge.md.sha1.create();
  md.update(signStr, 'utf8');
  return forge.util.encode64(key.sign(md));
}
