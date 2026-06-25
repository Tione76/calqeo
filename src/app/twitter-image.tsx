import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site/config";

export const runtime = "edge";

export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
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
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0ea5e9 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
            padding: 48,
          }}
        >
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-0.02em",
            }}
          >
            Calqe<span style={{ color: "#38bdf8" }}>o</span>
          </div>
          <div
            style={{
              fontSize: 36,
              color: "#cbd5e1",
              textAlign: "center",
              maxWidth: 900,
            }}
          >
            {SITE.tagline}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
