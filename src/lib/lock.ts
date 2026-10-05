import { pbkdf2Sync, randomBytes, createCipheriv } from 'node:crypto';

/** Must match the decryption in components/Protected.astro. */
export const PBKDF2_ITERATIONS = 250_000;

/** Build-time password for protected case studies. Set CASE_STUDY_PASSWORD (a GitHub Actions secret in CI). */
export function getCasePassword(): string {
  const pw = process.env.CASE_STUDY_PASSWORD ?? import.meta.env.CASE_STUDY_PASSWORD;
  if (pw) return pw;
  if (import.meta.env.DEV) return 'dev';
  // Fail closed: without a secret nobody can unlock the page.
  console.warn('[lock] CASE_STUDY_PASSWORD is not set: protected case studies are locked for everyone.');
  return randomBytes(24).toString('hex');
}

/** AES-256-GCM with a PBKDF2-SHA256 key. Output is base64; the GCM tag is appended to the ciphertext (WebCrypto layout). */
export function encryptHtml(html: string, password: string) {
  const salt = randomBytes(16);
  const iv = randomBytes(12);
  const key = pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, 32, 'sha256');
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const data = Buffer.concat([cipher.update(html, 'utf8'), cipher.final(), cipher.getAuthTag()]);
  return { salt: salt.toString('base64'), iv: iv.toString('base64'), data: data.toString('base64'), iterations: PBKDF2_ITERATIONS };
}
