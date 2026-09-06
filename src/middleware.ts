import { NextResponse, NextRequest } from "next/server";

// Canonical hostname is the bare apex — https://saastoolz.com is the only
// version that currently resolves (www.saastoolz.com 522s at the DNS/CDN
// layer, which this middleware can't fix since a request that never reaches
// the app can't be redirected by it). Once www is attached to the Vercel
// project and actually reaches this app, this guarantees the 301 happens at
// the application layer too — not dependent on a Cloudflare page rule or a
// Vercel dashboard redirect staying configured correctly forever.
const CANONICAL_HOST = "saastoolz.com";

export function middleware(request: NextRequest) {
  const hostname = (request.headers.get("host") ?? "").split(":")[0];

  if (hostname === `www.${CANONICAL_HOST}`) {
    const url = request.nextUrl.clone();
    url.protocol = "https";
    url.hostname = CANONICAL_HOST;
    url.port = "";
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

// Excludes /api — webhook providers (Stripe, etc.) call fixed URLs and
// generally don't follow redirects, so those routes must respond directly
// regardless of which host they were hit on.
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
