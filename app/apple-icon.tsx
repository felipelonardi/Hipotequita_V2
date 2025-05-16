import { ImageResponse } from "next/og"

// Route segment config
export const runtime = "edge"

// Image metadata
export const size = {
  width: 180,
  height: 180,
}
export const contentType = "image/png"

// Image generation
export default function Icon() {
  return new ImageResponse(
    // ImageResponse JSX element
    <div
      style={{
        fontSize: 100,
        background: "white",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 24,
        color: "#8b5cf6", // Purple color matching the theme
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        height="100"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 10 L12 4 L20 10 V20 A2 2 0 0 1 18 22 H6 A2 2 0 0 1 4 20 Z"></path>
        <path d="M9 22 V12 H15 V22"></path>
      </svg>
    </div>,
    // ImageResponse options
    {
      ...size,
    },
  )
}
