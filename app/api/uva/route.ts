import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("UVA API route: Starting request to Argentina Datos API")

    // Direct fetch with minimal options
    const response = await fetch("https://argentinadatos.com/api/v1/finanzas/indices/uva", {
      method: "GET",
      cache: "no-store", // Disable caching to ensure fresh data
    })

    console.log(`UVA API route: Response status: ${response.status}`)

    if (!response.ok) {
      throw new Error(`Error fetching UVA data: ${response.status} ${response.statusText}`)
    }

    // Get response as text first for debugging
    const responseText = await response.text()
    console.log(`UVA API route: Response text: ${responseText.substring(0, 200)}...`)

    // Parse the JSON
    let data
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error("UVA API route: JSON parse error:", parseError)
      throw new Error("Invalid JSON response")
    }

    console.log(`UVA API route: Successfully parsed data with ${data.length || 0} items`)

    // Return the data
    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("UVA API route error:", error)

    // Return hardcoded latest known value as fallback
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      fallbackValue: 1384.3, // Latest known value from your test
      fallbackDate: "2025-03-18",
      timestamp: new Date().toISOString(),
    })
  }
}
