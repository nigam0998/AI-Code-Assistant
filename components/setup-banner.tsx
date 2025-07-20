"use client"

import { useState, useEffect } from "react"
import { CheckCircle, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export function SetupBanner() {
  const [setupStatus, setSetupStatus] = useState<{
    configured: boolean
    services?: { gemini: string; bhashini: string }
  } | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkApiKey = async () => {
      try {
        const response = await fetch("/api/check-setup")
        const data = await response.json()
        setSetupStatus(data)

        // Show success banner briefly when configured
        if (data.configured) {
          setIsVisible(true)
          setTimeout(() => setIsVisible(false), 5000) // Hide after 5 seconds
        } else {
          setIsVisible(true)
        }
      } catch (error) {
        setIsVisible(true)
      } finally {
        setIsChecking(false)
      }
    }

    checkApiKey()
  }, [])

  if (isChecking || !isVisible || !setupStatus) return null

  return (
    <Alert
      className={`mb-6 glass-card rounded-2xl border-0 ${
        setupStatus.configured ? "text-green-800 dark:text-green-200" : "text-orange-800 dark:text-orange-200"
      }`}
    >
      <CheckCircle
        className={`h-4 w-4 ${
          setupStatus.configured ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400"
        }`}
      />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex-1">
          <strong>{setupStatus.configured ? "✅ Setup Complete!" : "Setup Required:"}</strong>
          <div className="mt-2 text-sm">
            {setupStatus.configured ? (
              <div className="space-y-1">
                <div className="text-green-700 dark:text-green-300">AI Code Assistant is ready to use with:</div>
                {setupStatus.services && (
                  <div className="text-green-600 dark:text-green-400 text-xs">
                    <div>{setupStatus.services.gemini}</div>
                    <div>{setupStatus.services.bhashini}</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-orange-600 dark:text-orange-400">
                Please configure your API keys to use the AI features.
              </div>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="glass-button rounded-xl border-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </AlertDescription>
    </Alert>
  )
}
