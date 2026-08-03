import { ImageResponse } from "next/og";
import { getToolById } from "@/lib/tools";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Satori (next/og's renderer) has no color-emoji glyphs of its own, so a raw
// emoji character renders as a blank/placeholder box. The standard fix is to
// swap it for its Twemoji SVG and render that as an <img> instead.
function twemojiUrl(emoji: string): string {
  // Twemoji's filenames drop the variation-selector-16 codepoint (U+FE0F)
  // that many emoji carry (e.g. 🗜️ = 1f5dc + fe0f, but the asset is just
  // "1f5dc.png") — keeping it in the URL 404s.
  const codePoint = [...emoji]
    .map((c) => c.codePointAt(0)!)
    .filter((cp) => cp !== 0xfe0f)
    .map((cp) => cp.toString(16))
    .join("-");
  return `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/${codePoint}.png`;
}

export default async function ToolOGImage({ params }: { params: Promise<{ toolId: string }> }) {
  const { toolId } = await params;
  const tool = getToolById(toolId);
  const name = tool && !tool.isPremium ? tool.name : "SaaSToolz";
  const description = tool && !tool.isPremium ? tool.description : "Free Online Tools";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #7c3aed 0%, #a21caf 60%, #c026d3 100%)",
          padding: "0 100px",
          textAlign: "center",
        }}
      >
        {tool && (
          <img src={twemojiUrl(tool.icon)} width={110} height={110} style={{ marginBottom: 24 }} />
        )}
        <div style={{ display: "flex", fontSize: 68, fontWeight: 800, color: "white", letterSpacing: -1, lineHeight: 1.1 }}>
          {name}
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "rgba(255,255,255,0.85)", marginTop: 20 }}>
          {description}
        </div>
        <div style={{ display: "flex", fontSize: 26, fontWeight: 700, color: "rgba(255,255,255,0.7)", marginTop: 40 }}>
          SaaSToolz — Free, no signup required
        </div>
      </div>
    ),
    { ...size }
  );
}
