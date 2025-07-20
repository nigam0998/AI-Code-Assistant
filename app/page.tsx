"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Moon, Sun, Copy, Code, Bug, FileText, Loader2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "next-themes"
import { useToast } from "@/hooks/use-toast"
import { SetupBanner } from "@/components/setup-banner"
import { EnhancedCodeDisplay } from "@/components/enhanced-code-display"
import { BackgroundAnimation } from "@/components/background-animation"

const languages = {
  javascript: "JavaScript",
  python: "Python",
  java: "Java",
  cpp: "C++",
  csharp: "C#",
  php: "PHP",
  ruby: "Ruby",
  go: "Go",
  rust: "Rust",
  typescript: "TypeScript",
  sql: "SQL",
  html: "HTML",
  css: "CSS",
}

const translations = {
  en: {
    title: "CodeMentor AI",
    subtitle: "Professional AI-powered code analysis, debugging, and documentation",
    codeInput: "Paste your code here for professional analysis and improvement suggestions",
    selectLanguage: "Select Programming Language",
    selectAction: "Choose Analysis Type",
    analyze: "Analyze & Optimize",
    debug: "Debug & Fix",
    document: "Generate Documentation",
    submit: "Analyze Code",
    processing: "Analyzing your code...",
    copyCode: "Copy to Clipboard",
    copied: "Copied Successfully",
    results: "Analysis Results",
  },
  hi: {
    title: "CodeMentor AI",
    subtitle: "पेशेवर AI-संचालित कोड विश्लेषण, डिबगिंग और दस्तावेजीकरण",
    codeInput: "पेशेवर विश्लेषण और सुधार सुझावों के लिए अपना कोड यहाँ पेस्ट करें",
    selectLanguage: "प्रोग्रामिंग भाषा चुनें",
    selectAction: "विश्लेषण प्रकार चुनें",
    analyze: "विश्लेषण और अनुकूलन",
    debug: "डिबग और सुधार",
    document: "दस्तावेज़ीकरण बनाएं",
    submit: "कोड का विश्लेषण करें",
    processing: "आपके कोड का विश्लेषण हो रहा है...",
    copyCode: "क्लिपबोर्ड पर कॉपी करें",
    copied: "सफलतापूर्वक कॉपी किया गया",
    results: "विश्लेषण परिणाम",
  },
  pa: {
    title: "CodeMentor AI",
    subtitle: "ਪੇਸ਼ੇਵਰ AI-ਸੰਚਾਲਿਤ ਕੋਡ ਵਿਸ਼ਲੇਸ਼ਣ, ਡਿਬਗਿੰਗ ਅਤੇ ਦਸਤਾਵੇਜ਼ੀਕਰਨ",
    codeInput: "ਪੇਸ਼ੇਵਰ ਵਿਸ਼ਲੇਸ਼ਣ ਅਤੇ ਸੁਧਾਰ ਸੁਝਾਵਾਂ ਲਈ ਆਪਣਾ ਕੋਡ ਇੱਥੇ ਪੇਸਟ ਕਰੋ",
    selectLanguage: "ਪ੍ਰੋਗਰਾਮਿੰਗ ਭਾਸ਼ਾ ਚੁਣੋ",
    selectAction: "ਵਿਸ਼ਲੇਸ਼ਣ ਕਿਸਮ ਚੁਣੋ",
    analyze: "ਵਿਸ਼ਲੇਸ਼ਣ ਅਤੇ ਅਨੁਕੂਲਨ",
    debug: "ਡਿਬੱਗ ਅਤੇ ਸੁਧਾਰ",
    document: "ਦਸਤਾਵੇਜ਼ੀਕਰਨ ਬਣਾਓ",
    submit: "ਕੋਡ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ",
    processing: "ਤੁਹਾਡੇ ਕੋਡ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਹੋ ਰਿਹਾ ਹੈ...",
    copyCode: "ਕਲਿੱਪਬੋਰਡ 'ਤੇ ਕਾਪੀ ਕਰੋ",
    copied: "ਸਫਲਤਾਪੂਰਵਕ ਕਾਪੀ ਕੀਤਾ ਗਿਆ",
    results: "ਵਿਸ਼ਲੇਸ਼ਣ ਨਤੀਜੇ",
  },
}

export default function CodeAssistant() {
  const [code, setCode] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("")
  const [selectedAction, setSelectedAction] = useState("")
  const [result, setResult] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [uiLanguage, setUiLanguage] = useState<"en" | "hi" | "pa">("en")
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({})
  const [mounted, setMounted] = useState(false)

  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const t = translations[uiLanguage]

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async () => {
    if (!code.trim() || !selectedLanguage || !selectedAction) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to proceed with the analysis",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setResult("")

    try {
      const response = await fetch("/api/process-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          language: selectedLanguage,
          action: selectedAction,
          uiLanguage,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to process code")
      }

      if (data.result) {
        setResult(data.result)
        toast({
          title: "Analysis Complete",
          description: "Your code has been successfully analyzed with detailed insights",
        })
      } else {
        throw new Error("No result received from AI")
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unable to analyze your code at the moment. Please try again."
      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedStates((prev) => ({ ...prev, [id]: true }))
      toast({
        title: t.copied,
        description: "Successfully copied to your clipboard",
      })
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [id]: false }))
      }, 2000)
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard. Please select and copy manually.",
        variant: "destructive",
      })
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case "analyze":
        return <Code className="w-4 h-4" />
      case "debug":
        return <Bug className="w-4 h-4" />
      case "document":
        return <FileText className="w-4 h-4" />
      default:
        return <Code className="w-4 h-4" />
    }
  }

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundAnimation />

      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Header with Glass Effect */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-header fixed top-0 left-0 right-0 z-50 px-4 py-4 mb-12"
          >
            <div className="container mx-auto flex justify-between items-center">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  {t.title}
                </h1>
                <p className="text-muted-foreground mt-1 text-xs md:text-sm font-medium">{t.subtitle}</p>
              </div>

              <div className="flex items-center gap-3">
                <Select value={uiLanguage} onValueChange={(value: "en" | "hi" | "pa") => setUiLanguage(value)}>
                  <SelectTrigger className="w-28 md:w-32 glass-select rounded-xl text-xs md:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-card rounded-xl border-0">
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">हिंदी</SelectItem>
                    <SelectItem value="pa">ਪੰਜਾਬੀ</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleThemeToggle}
                  className="glass-button rounded-xl border-0 bg-transparent w-8 h-8 md:w-10 md:h-10"
                >
                  <motion.div
                    key={theme}
                    initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    {theme === "dark" ? (
                      <Moon className="w-3 h-3 md:w-4 md:h-4" />
                    ) : (
                      <Sun className="w-3 h-3 md:w-4 md:h-4" />
                    )}
                  </motion.div>
                </Button>
              </div>
            </div>
          </motion.header>

          {/* Add top padding to account for fixed header */}
          <div className="pt-20 md:pt-24">
            <SetupBanner />

            <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
              {/* Input Section */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <Card className="h-full glass-card rounded-2xl md:rounded-3xl border-0 shadow-2xl">
                  <CardHeader className="pb-4 md:pb-6">
                    <CardTitle className="flex items-center gap-3 text-lg md:text-xl">
                      <div className="p-2 md:p-3 rounded-xl md:rounded-2xl glass-button">
                        <Code className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                      </div>
                      Code Input
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 md:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                        <SelectTrigger className="glass-select rounded-xl border-0 text-sm">
                          <SelectValue placeholder={t.selectLanguage} />
                        </SelectTrigger>
                        <SelectContent className="glass-card rounded-xl border-0">
                          {Object.entries(languages).map(([key, value]) => (
                            <SelectItem key={key} value={key}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={selectedAction} onValueChange={setSelectedAction}>
                        <SelectTrigger className="glass-select rounded-xl border-0 text-sm">
                          <SelectValue placeholder={t.selectAction} />
                        </SelectTrigger>
                        <SelectContent className="glass-card rounded-xl border-0">
                          <SelectItem value="analyze">
                            <div className="flex items-center gap-2">
                              <Code className="w-4 h-4" />
                              {t.analyze}
                            </div>
                          </SelectItem>
                          <SelectItem value="debug">
                            <div className="flex items-center gap-2">
                              <Bug className="w-4 h-4" />
                              {t.debug}
                            </div>
                          </SelectItem>
                          <SelectItem value="document">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              {t.document}
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="relative">
                      <Textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder={t.codeInput}
                        className="min-h-[300px] md:min-h-[400px] font-mono text-xs md:text-sm resize-none glass-input rounded-xl md:rounded-2xl border-0"
                      />
                      {code && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute top-3 right-3"
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(code, "input")}
                            className="h-6 w-6 md:h-8 md:w-8 p-0 glass-button rounded-lg md:rounded-xl border-0"
                          >
                            {copiedStates.input ? (
                              <Check className="w-3 h-3 text-green-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </Button>
                        </motion.div>
                      )}
                    </div>

                    <Button
                      onClick={handleSubmit}
                      disabled={isLoading || !code.trim() || !selectedLanguage || !selectedAction}
                      className="w-full h-10 md:h-12 text-sm md:text-base font-medium glass-button rounded-xl md:rounded-2xl border-0 bg-gradient-to-r from-primary/80 to-primary/60 hover:from-primary/90 hover:to-primary/70 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      size="lg"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 animate-spin" />
                          {t.processing}
                        </>
                      ) : (
                        <>
                          {getActionIcon(selectedAction)}
                          <span className="ml-2 md:ml-3">{t.submit}</span>
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Results Section */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <Card className="h-full glass-card rounded-2xl md:rounded-3xl border-0 shadow-2xl">
                  <CardHeader className="pb-4 md:pb-6">
                    <CardTitle className="flex items-center justify-between text-lg md:text-xl">
                      <span className="flex items-center gap-3">
                        <div className="p-2 md:p-3 rounded-xl md:rounded-2xl glass-button">
                          {selectedAction ? getActionIcon(selectedAction) : <Code className="w-4 h-4 md:w-5 md:h-5" />}
                        </div>
                        {t.results}
                      </span>
                      {result && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(result, "result")}
                          className="h-6 w-6 md:h-8 md:w-8 p-0 glass-button rounded-lg md:rounded-xl border-0"
                        >
                          {copiedStates.result ? (
                            <Check className="w-3 h-3 text-green-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AnimatePresence mode="wait">
                      {isLoading ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center h-[300px] md:h-[400px]"
                        >
                          <div className="text-center">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            >
                              <Loader2 className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-4 md:mb-6 text-primary" />
                            </motion.div>
                            <p className="text-muted-foreground text-base md:text-lg font-medium">{t.processing}</p>
                            <p className="text-xs md:text-sm text-muted-foreground mt-2">
                              Please wait while we analyze your code
                            </p>
                          </div>
                        </motion.div>
                      ) : result ? (
                        <motion.div
                          key="result"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.5 }}
                        >
                          <EnhancedCodeDisplay
                            code={result}
                            language={selectedLanguage}
                            theme={theme}
                            action={selectedAction}
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="empty"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center h-[300px] md:h-[400px] text-muted-foreground"
                        >
                          <div className="text-center">
                            <motion.div
                              animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.5, 0.8, 0.5],
                              }}
                              transition={{
                                duration: 3,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut",
                              }}
                            >
                              <Code className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 opacity-40" />
                            </motion.div>
                            <p className="text-lg md:text-xl font-semibold mb-3">Ready for Analysis</p>
                            <p className="text-xs md:text-sm max-w-md px-4">
                              Submit your code to receive professional insights, optimizations, and detailed
                              documentation
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
