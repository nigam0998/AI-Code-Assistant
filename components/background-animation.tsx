"use client"

import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function BackgroundAnimation() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDark = theme === "dark"

  // Code snippets that will animate
  const codeSnippets = [
    "function analyzeCode() {",
    "  const result = await ai.process(code);",
    "  return result.optimized;",
    "}",
    "",
    "class CodeAnalyzer {",
    "  constructor(language) {",
    "    this.lang = language;",
    "  }",
    "",
    "  async debug() {",
    "    const issues = this.findBugs();",
    "    return this.fixIssues(issues);",
    "  }",
    "}",
    "",
    "const languages = ['js', 'py', 'java'];",
    "languages.forEach(lang => {",
    "  console.log(`Processing ${lang}...`);",
    "});",
    "",
    "// AI-powered optimization",
    "if (performance.score < 0.8) {",
    "  optimizer.enhance(codebase);",
    "}",
  ]

  const pythonSnippets = [
    "def optimize_algorithm(data):",
    "    processed = []",
    "    for item in data:",
    "        if validate(item):",
    "            processed.append(transform(item))",
    "    return processed",
    "",
    "class AIDebugger:",
    "    def __init__(self, model):",
    "        self.model = model",
    "        self.accuracy = 0.95",
    "",
    "    def find_bugs(self, code):",
    "        issues = self.model.analyze(code)",
    "        return [i for i in issues if i.severity > 0.7]",
    "",
    "# Machine learning optimization",
    "import tensorflow as tf",
    "model = tf.keras.Sequential([",
    "    tf.keras.layers.Dense(128, activation='relu'),",
    "    tf.keras.layers.Dropout(0.2),",
    "    tf.keras.layers.Dense(10, activation='softmax')",
    "])",
  ]

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Existing gradient orbs with reduced opacity */}
      <motion.div
        className={`absolute -top-40 -right-40 w-96 h-96 rounded-full ${
          isDark
            ? "bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-cyan-500/20"
            : "bg-gradient-to-br from-purple-400/25 via-blue-400/25 to-cyan-400/25"
        } blur-2xl`}
        animate={{
          x: [0, 100, 0],
          y: [0, 60, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className={`absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full ${
          isDark
            ? "bg-gradient-to-tr from-pink-500/20 via-purple-500/20 to-indigo-500/20"
            : "bg-gradient-to-tr from-pink-400/25 via-purple-400/25 to-indigo-400/25"
        } blur-2xl`}
        animate={{
          x: [0, -60, 0],
          y: [0, -100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Animated Code Lines - JavaScript */}
      <div className="absolute inset-0 overflow-hidden">
        {codeSnippets.map((line, index) => (
          <motion.div
            key={`js-${index}`}
            className={`absolute font-mono text-sm ${
              isDark ? "text-green-400/30" : "text-green-600/40"
            } whitespace-nowrap`}
            style={{
              left: `${Math.random() * 120 - 20}%`,
              top: `${(index * 3) % 100}%`,
            }}
            initial={{ opacity: 0, x: -100 }}
            animate={{
              opacity: [0, 0.6, 0],
              x: ["-100px", "100vw"],
            }}
            transition={{
              duration: Math.random() * 10 + 15,
              repeat: Number.POSITIVE_INFINITY,
              delay: index * 0.5,
              ease: "linear",
            }}
          >
            {line}
          </motion.div>
        ))}
      </div>

      {/* Animated Code Lines - Python */}
      <div className="absolute inset-0 overflow-hidden">
        {pythonSnippets.map((line, index) => (
          <motion.div
            key={`py-${index}`}
            className={`absolute font-mono text-sm ${
              isDark ? "text-blue-400/25" : "text-blue-600/35"
            } whitespace-nowrap`}
            style={{
              right: `${Math.random() * 120 - 20}%`,
              top: `${((index + 10) * 4) % 100}%`,
            }}
            initial={{ opacity: 0, x: 100 }}
            animate={{
              opacity: [0, 0.5, 0],
              x: ["100px", "-100vw"],
            }}
            transition={{
              duration: Math.random() * 12 + 18,
              repeat: Number.POSITIVE_INFINITY,
              delay: index * 0.7 + 5,
              ease: "linear",
            }}
          >
            {line}
          </motion.div>
        ))}
      </div>

      {/* Floating Code Symbols */}
      {["{ }", "[ ]", "( )", "< >", "=>", "&&", "||", "!=", "===", "++"].map((symbol, index) => (
        <motion.div
          key={`symbol-${index}`}
          className={`absolute font-mono text-2xl font-bold ${isDark ? "text-purple-400/20" : "text-purple-600/30"}`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -200, 0],
            opacity: [0, 0.4, 0],
            rotate: [0, 360],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: Math.random() * 8 + 12,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        >
          {symbol}
        </motion.div>
      ))}

      {/* Terminal-like cursor blinks */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={`cursor-${i}`}
          className={`absolute w-2 h-4 ${isDark ? "bg-green-400/40" : "bg-green-600/50"}`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.3,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Binary rain effect */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={`binary-${i}`}
          className={`absolute font-mono text-xs ${isDark ? "text-cyan-400/20" : "text-cyan-600/30"}`}
          style={{
            left: `${Math.random() * 100}%`,
            top: "-10%",
          }}
          animate={{
            y: ["0vh", "110vh"],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 4,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 2,
            ease: "linear",
          }}
        >
          {Array.from({ length: 20 }, () => (Math.random() > 0.5 ? "1" : "0")).join("")}
        </motion.div>
      ))}

      {/* Grid Pattern */}
      <div
        className={`absolute inset-0 ${
          isDark
            ? "bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]"
            : "bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)]"
        } bg-[size:60px_60px]`}
      />

      {/* Animated Circuit Lines */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="circuit-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isDark ? "rgba(34, 197, 94, 0.3)" : "rgba(34, 197, 94, 0.2)"} />
            <stop offset="50%" stopColor={isDark ? "rgba(59, 130, 246, 0.3)" : "rgba(59, 130, 246, 0.2)"} />
            <stop offset="100%" stopColor={isDark ? "rgba(168, 85, 247, 0.3)" : "rgba(168, 85, 247, 0.2)"} />
          </linearGradient>
        </defs>

        <motion.path
          d="M0,100 L200,100 L200,200 L400,200 L400,300 L600,300"
          stroke="url(#circuit-gradient)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="5,5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 4, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }}
        />

        <motion.path
          d="M100,0 L100,150 L300,150 L300,250 L500,250 L500,400"
          stroke="url(#circuit-gradient)"
          strokeWidth="1"
          fill="none"
          strokeDasharray="3,3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.4 }}
          transition={{ duration: 6, delay: 2, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }}
        />
      </svg>

      {/* Pulsing Code Blocks */}
      <motion.div
        className={`absolute top-1/4 left-1/4 w-32 h-8 rounded ${
          isDark ? "bg-violet-500/10 border border-violet-500/20" : "bg-violet-400/15 border border-violet-400/25"
        } blur-sm`}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className={`absolute bottom-1/3 right-1/4 w-24 h-6 rounded ${
          isDark ? "bg-cyan-500/10 border border-cyan-500/20" : "bg-cyan-400/15 border border-cyan-400/25"
        } blur-sm`}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1.5,
        }}
      />
    </div>
  )
}
