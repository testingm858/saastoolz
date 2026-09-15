// NEXT_PUBLIC_URL is expected to include the protocol (e.g.
// "https://saastoolz.com"), but a bare host with no scheme is a real
// misconfiguration seen on the production host — `new URL()` throws on it
// (ERR_INVALID_URL), which crashes every page's metadata/JSON-LD generation
// at build time. Normalize rather than trust the env var verbatim.
function normalizeBaseUrl(value: string): string {
  return /^https?:\/\//.test(value) ? value : `https://${value}`;
}

export const BASE_URL = normalizeBaseUrl(process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000");
