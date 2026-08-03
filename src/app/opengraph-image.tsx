import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { FREE_TOOLS } from "@/lib/tools";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "SaaSToolz — Free Online Tools";

export default async function OGImage() {
  const logoBuffer = await readFile(join(process.cwd(), "public/logo.jpeg"));
  const logoSrc = `data:image/jpeg;base64,${logoBuffer.toString("base64")}`;

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
        }}
      >
        <img src={logoSrc} width={140} height={140} style={{ borderRadius: 28, marginBottom: 32 }} />
        <div style={{ display: "flex", fontSize: 76, fontWeight: 800, color: "white", letterSpacing: -1 }}>
          SaaSToolz
        </div>
        <div style={{ display: "flex", fontSize: 32, color: "rgba(255,255,255,0.85)", marginTop: 16 }}>
          {FREE_TOOLS.length} free online tools — no signup required
        </div>
      </div>
    ),
    { ...size }
  );
}
