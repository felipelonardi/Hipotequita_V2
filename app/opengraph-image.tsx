import { ImageResponse } from "next/og"

// Route segment config
export const runtime = "edge"

// Image metadata
export const alt = "Hipotequita - Simulador de Préstamos Hipotecarios"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

// Image generation
export default async function Image() {
  return new ImageResponse(
    // ImageResponse JSX element
    <div
      style={{
        fontSize: 128,
        background: "white",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#8b5cf6", // Purple color matching the theme
      }}
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: 40 }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="120"
          height="120"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ marginRight: 20 }}
        >
          <path d="M4 10 L12 4 L20 10 V20 A2 2 0 0 1 18 22 H6 A2 2 0 0 1 4 20 Z"></path>
          <path d="M9 22 V12 H15 V22"></path>
        </svg>
        <div>Hipotequita</div>
      </div>
      <div style={{ fontSize: 48, color: "#4b5563" }}>Simulador de Préstamos Hipotecarios</div>
    </div>,
    // ImageResponse options
    {
      ...size,
    },
  )
}
