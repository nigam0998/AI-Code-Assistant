import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"

export async function POST(request: NextRequest) {
  try {
    const { code, language, action, uiLanguage } = await request.json()

    if (!code || !language || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const google = createGoogleGenerativeAI({
      apiKey: "AIzaSyAS3ezWGETJKKVAjdOq8tz2tnu8WWFsPJg",
    })

    let systemPrompt = ""
    let userPrompt = ""

    const languageContext =
      uiLanguage === "hi"
        ? "Respond in Hindi (हिंदी में जवाब दें)"
        : uiLanguage === "pa"
          ? "Respond in Punjabi (ਪੰਜਾਬੀ ਵਿੱਚ ਜਵਾਬ ਦਿਓ)"
          : "Respond in English"

    switch (action) {
      case "analyze":
        systemPrompt = `You are a professional senior software engineer and code reviewer. ${languageContext}. Provide thorough, professional analysis with actionable insights.

Analyze the code with the expertise of a senior developer:
- Assess code quality, architecture, and design patterns
- Identify performance bottlenecks and optimization opportunities
- Review security vulnerabilities and best practices
- Suggest improvements for maintainability and scalability
- Provide specific, actionable recommendations

Structure your response professionally with clear sections and detailed explanations.`
        userPrompt = `Please provide a comprehensive analysis of this ${language} code:\n\n${code}`
        break

      case "debug":
        systemPrompt = `You are an expert debugging specialist and senior developer. ${languageContext}. Provide systematic debugging analysis with clear solutions.

Debug the code with professional expertise:
- Identify all bugs, errors, and potential issues systematically
- Explain the root cause of each problem
- Provide corrected code with detailed explanations
- Explain why each fix resolves the issue
- Suggest preventive measures for similar issues

Structure your response as a professional debugging report with clear sections.`
        userPrompt = `Please debug and analyze this ${language} code for issues:\n\n${code}`
        break

      case "document":
        systemPrompt = `You are a technical documentation specialist and senior developer. ${languageContext}. Create comprehensive, professional documentation.

Generate professional documentation:
- Provide clear overview and purpose of the code
- Document all functions, classes, and methods thoroughly
- Include parameter descriptions and return values
- Add usage examples and best practices
- Create inline comments for complex logic
- Follow industry documentation standards

Structure the documentation professionally with proper formatting and examples.`
        userPrompt = `Please create comprehensive documentation for this ${language} code:\n\n${code}`
        break

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      system: systemPrompt,
      prompt: userPrompt,
      maxTokens: 3000,
      temperature: 0.3,
    })

    if (!text || text.trim().length === 0) {
      throw new Error("Empty response from AI")
    }

    return NextResponse.json({
      result: text,
      success: true,
      metadata: {
        language,
        action,
        uiLanguage,
        responseLength: text.length,
      },
    })
  } catch (error) {
    console.error("Error processing code:", error)
    return NextResponse.json(
      {
        error: "Failed to process code. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error",
        success: false,
      },
      { status: 500 },
    )
  }
}
