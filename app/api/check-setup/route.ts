import { NextResponse } from "next/server"

export async function GET() {
  // API keys are now hardcoded, so always return configured
  const configured = true

  return NextResponse.json({
    configured,
    message: "API keys are configured and ready to use",
    services: {
      gemini: "✅ Google Gemini AI",
      bhashini: "✅ Bhashini Translation",
    },
  })
}
