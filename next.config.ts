import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // sharp and @napi-rs/canvas ship native .node binaries, and ffmpeg-static
  // ships a standalone .exe/binary — all three need Node to resolve their
  // real on-disk path at runtime. Left to the bundler, it either rewrites
  // that path to a bogus "\ROOT\..." placeholder (ffmpeg-static) or can't
  // locate the native binding at all (sharp, @napi-rs/canvas). tesseract.js
  // hits the same "\ROOT\..." placeholder bug — it spawns a real Node
  // worker_threads Worker from a computed on-disk path
  // (node_modules/tesseract.js/src/worker-script/node/index.js) that
  // Turbopack's tracer mangles the same way it mangled ffmpeg-static's path.
  serverExternalPackages: ["sharp", "ffmpeg-static", "@napi-rs/canvas", "tesseract.js", "tesseract.js-core"],
  // Hostinger's build host kills the child process Turbopack spawns to run
  // PostCSS ("node process exited before we could connect to it"), failing every
  // build. Worker threads avoid spawning a process.
  experimental: { turbopackPluginRuntimeStrategy: "workerThreads" },
  // Next.js only auto-adds long-lived caching to /_next/static — genuinely
  // static files under /public (the logo, blog cover art, uploaded images)
  // were served with no Cache-Control at all. Filenames here either never
  // change (brand assets) or are content-addressed with a timestamp
  // (uploads, see src/lib/blog-images.ts), so a year-long immutable cache is
  // safe; a changed cover image gets a new filename, not a mutated old one.
  async headers() {
    const immutable = [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }];
    return [
      { source: "/uploads/:path*", headers: immutable },
      // Scoped to the extension, not the whole /blog/ prefix — that prefix
      // is also the live blog post route (/blog/[slug]), which must stay
      // uncached.
      { source: "/blog/:path(.*\\.(?:jpg|jpeg|png|webp|gif))", headers: immutable },
      { source: "/logo.jpeg", headers: immutable },
    ];
  },
};

export default nextConfig;
