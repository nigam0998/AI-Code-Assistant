"use client"

import { useState } from "react"
import { ChevronDown, Lightbulb, AlertCircle, CheckCircle, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"

interface CodeDisplayProps {
  code: string
  language: string
  theme?: string
  action: string
}

export function EnhancedCodeDisplay({ code, language, theme, action }: CodeDisplayProps) {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({})

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const getActionIcon = () => {
    switch (action) {
      case "analyze":
        return <Lightbulb className="w-5 h-5 text-blue-500" />
      case "debug":
        return <AlertCircle className="w-5 h-5 text-orange-500" />
      case "document":
        return <BookOpen className="w-5 h-5 text-green-500" />
      default:
        return <CheckCircle className="w-5 h-5 text-primary" />
    }
  }

  const getActionTitle = () => {
    switch (action) {
      case "analyze":
        return "Code Analysis & Optimization"
      case "debug":
        return "Debugging & Error Resolution"
      case "document":
        return "Professional Documentation"
      default:
        return "AI Analysis Results"
    }
  }

  const processResponse = (text: string) => {
    const lines = text.split("\n")
    const sections: { title: string; content: string[]; type: string }[] = []
    let currentSection: { title: string; content: string[]; type: string } | null = null

    lines.forEach((line, index) => {
      const trimmedLine = line.trim()

      if (
        trimmedLine.endsWith(":") ||
        (trimmedLine.startsWith("**") && trimmedLine.endsWith("**")) ||
        trimmedLine.match(/^\d+\.\s*[A-Z]/) ||
        trimmedLine.startsWith("#")
      ) {
        if (currentSection && currentSection.content.length > 0) {
          sections.push(currentSection)
        }

        const title = trimmedLine
          .replace(/^\*\*|\*\*$/g, "")
          .replace(/^#+\s*/, "")
          .replace(/:$/, "")
          .replace(/^\d+\.\s*/, "")

        currentSection = {
          title,
          content: [],
          type: detectSectionType(title),
        }
      } else if (currentSection && trimmedLine) {
        currentSection.content.push(line)
      } else if (!currentSection && trimmedLine) {
        if (!sections.length) {
          sections.push({
            title: "Overview",
            content: [line],
            type: "info",
          })
        }
      }
    })

    if (currentSection && currentSection.content.length > 0) {
      sections.push(currentSection)
    }

    if (sections.length === 0) {
      sections.push({
        title: getActionTitle(),
        content: lines,
        type: "info",
      })
    }

    return sections
  }

  const detectSectionType = (title: string): string => {
    const lowerTitle = title.toLowerCase()
    if (lowerTitle.includes("bug") || lowerTitle.includes("error") || lowerTitle.includes("issue")) return "error"
    if (lowerTitle.includes("fix") || lowerTitle.includes("solution") || lowerTitle.includes("correct"))
      return "success"
    if (lowerTitle.includes("improve") || lowerTitle.includes("suggest") || lowerTitle.includes("recommend"))
      return "warning"
    if (lowerTitle.includes("code") && (lowerTitle.includes("new") || lowerTitle.includes("updated"))) return "code"
    return "info"
  }

  const getSectionIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "warning":
        return <Lightbulb className="w-4 h-4 text-amber-500" />
      case "code":
        return <BookOpen className="w-4 h-4 text-blue-500" />
      default:
        return <CheckCircle className="w-4 h-4 text-primary" />
    }
  }

  const getSectionBorderColor = (type: string) => {
    switch (type) {
      case "error":
        return "border-l-red-500"
      case "success":
        return "border-l-green-500"
      case "warning":
        return "border-l-amber-500"
      case "code":
        return "border-l-blue-500"
      default:
        return "border-l-primary"
    }
  }

  const sections = processResponse(code)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        {getActionIcon()}
        <h3 className="font-semibold text-lg">{getActionTitle()}</h3>
      </div>

      {sections.map((section, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card
            className={`border-l-4 ${getSectionBorderColor(section.type)} glass-card rounded-2xl border-0 shadow-lg`}
          >
            <CardContent className="p-4">
              <Button
                variant="ghost"
                className="w-full justify-between p-0 h-auto font-medium text-left hover:bg-transparent glass-button rounded-xl border-0"
                onClick={() => toggleSection(`section-${index}`)}
              >
                <div className="flex items-center gap-3">
                  {getSectionIcon(section.type)}
                  <span className="text-base">{section.title}</span>
                </div>
                <motion.div
                  animate={{ rotate: expandedSections[`section-${index}`] ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </Button>

              <AnimatePresence>
                {(expandedSections[`section-${index}`] || index === 0) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 space-y-3"
                  >
                    {section.content.map((line, lineIndex) => {
                      const trimmedLine = line.trim()

                      if (trimmedLine.startsWith("```")) {
                        return (
                          <div
                            key={lineIndex}
                            className={`p-4 rounded-2xl font-mono text-sm glass-input border-0 ${
                              theme === "dark" ? "text-gray-100" : "text-gray-900"
                            }`}
                          >
                            <div className="text-xs text-muted-foreground mb-2 font-sans">Code Example:</div>
                          </div>
                        )
                      }

                      if (trimmedLine.startsWith("- ") || trimmedLine.startsWith("• ")) {
                        return (
                          <div key={lineIndex} className="flex items-start gap-3 ml-4">
                            <span className="text-primary mt-1.5 w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
                            <span className="flex-1 leading-relaxed">{trimmedLine.replace(/^[\s\-•]+/, "")}</span>
                          </div>
                        )
                      }

                      if (trimmedLine) {
                        return (
                          <p key={lineIndex} className="leading-relaxed text-muted-foreground">
                            {line}
                          </p>
                        )
                      }

                      return <div key={lineIndex} className="h-2" />
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
