// Uses Web Crypto (globalThis.crypto.subtle) rather than Node's `crypto` module on purpose:
// this file is imported both by API routes (Node runtime) and middleware.js (Edge runtime),
// and Web Crypto is the one signing API available in both.

const encoder = new TextEncoder();

async function getKey(secret) {
  return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
    'verify',
  ]);
}

function toBase64Url(bytes) {
  let str = '';
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(str) {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/').padEnd(str.length + ((4 - (str.length % 4)) % 4), '=');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/**
 * Creates a signed session token encoding the given payload. Format: base64url(payload).base64url(signature)
 */
export async function createSessionToken(payload, secret) {
  const json = JSON.stringify(payload);
  const payloadB64 = toBase64Url(encoder.encode(json));
  const key = await getKey(secret);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payloadB64));
  const sigB64 = toBase64Url(new Uint8Array(signature));
  return `${payloadB64}.${sigB64}`;
}

/**
 * Verifies a session token's signature and expiry, returning the payload or null if invalid.
 */
export async function verifySessionToken(token, secret) {
  if (!token || !token.includes('.')) return null;
  const [payloadB64, sigB64] = token.split('.');

  try {
    const key = await getKey(secret);
    const signatureBytes = fromBase64Url(sigB64);
    const valid = await crypto.subtle.verify('HMAC', key, signatureBytes, encoder.encode(payloadB64));
    if (!valid) return null;

    const json = new TextDecoder().decode(fromBase64Url(payloadB64));
    const payload = JSON.parse(json);

    if (payload.expiresAt && Date.now() > payload.expiresAt) return null;
    return payload;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_NAME = 'pv_session';
export const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 12; // 12 hours
