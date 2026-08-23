import { ImageResponse } from "next/og";
import prisma from "@/lib/prisma";
import { extractCoverImage } from "@/lib/markdown";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Blog cover images are stored as base64 data: URLs (see BlogPost.coverImage)
// rather than hosted at a public https URL — social crawlers (Facebook,
// Twitter/X, Slack, etc.) can't fetch a data: URI as og:image, so a plain
// <meta property="og:image" content="data:..."> would just fail silently.
// This route sidesteps that: Next serves it at a real, fetchable URL
// (/blog/{slug}/opengraph-image), and next/og's renderer (Satori) can embed
// a data: URI directly as an <img src> with no network fetch needed, so the
// uploaded cover still ends up baked into the PNG this route returns.
export default async function BlogPostOGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    select: { title: true, coverImage: true, content: true, published: true },
  });

  const isLive = post?.published ?? false;
  const title = isLive ? post!.title : "SaaSToolz Blog";
  const displayTitle = title.length > 70 ? `${title.slice(0, 67)}…` : title;
  const cover = isLive ? (post!.coverImage ?? extractCoverImage(post!.content)) : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "linear-gradient(135deg, #7c3aed 0%, #a21caf 60%, #c026d3 100%)",
        }}
      >
        {cover && (
          // eslint-disable-next-line @next/next/no-img-element -- rendered server-side by Satori, not the browser
          <img
            src={cover}
            width={size.width}
            height={size.height}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
        {cover && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              background: "linear-gradient(180deg, rgba(17,10,30,0) 35%, rgba(17,10,30,0.85) 100%)",
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            padding: "0 70px 56px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 22,
              fontWeight: 700,
              color: "rgba(255,255,255,0.85)",
              letterSpacing: 3,
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            SaaSToolz Blog
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 56,
              fontWeight: 800,
              color: "white",
              lineHeight: 1.15,
              letterSpacing: -1,
            }}
          >
            {displayTitle}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
